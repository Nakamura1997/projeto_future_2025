from bs4 import BeautifulSoup
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser

from django.shortcuts import get_object_or_404
from django.http import HttpResponse, FileResponse
from django.core.files.base import ContentFile
from django.conf import settings

from form.models import FormularioRespondido
from .models import Report
from .serializers import ReportSerializer
from .utils.pdf_generator import generate_pdf_report

from weasyprint import HTML
from playwright.sync_api import sync_playwright
import pypandoc

from io import BytesIO
import os
import tempfile
import uuid
from datetime import datetime
from pathlib import Path

import base64
import zipfile
from pdf2docx import Converter


class GenerateOperationalReport(APIView):
    def get(self, request, formulario_id):
        try:
            formulario = get_object_or_404(FormularioRespondido, pk=formulario_id)
            report, _ = Report.objects.get_or_create(
                formulario_respondido=formulario,
                tipo="operacional",
                defaults={"criado_por": request.user, "status": "rascunho"},
            )

            logo_path = os.path.join(
                settings.BASE_DIR, "static", "img", "logo_future.png"
            )
            logo_url = request.build_absolute_uri(
                "/static/img/LogoFutureHorizontal.png"
            )

            pdf_content = generate_pdf_report(formulario.id, logo_path)

            report.pdf_file.save(
                f"relatorio_operacional_{formulario.id}.pdf",
                ContentFile(pdf_content.read()),
            )
            report.status = "preenchimento"
            report.save()

            serializer = ReportSerializer(report)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response(
                {"error": f"Erro ao gerar relatório operacional: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class DownloadOperationalPDF(APIView):
    def get(self, request, report_id):
        try:
            report = get_object_or_404(Report, pk=report_id, tipo="operacional")

            if not report.pdf_file:
                return Response(
                    {"error": "PDF não disponível para download"},
                    status=status.HTTP_404_NOT_FOUND,
                )

            response = HttpResponse(
                report.pdf_file.read(), content_type="application/pdf"
            )
            filename = f"relatorio_operacional_{report.formulario_respondido.id}.pdf"
            response["Content-Disposition"] = f'attachment; filename="{filename}"'
            return response

        except Exception as e:
            return Response(
                {"error": f"Erro ao baixar relatório: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class ReportDetailView(APIView):
    def get(self, request, report_id):
        report = get_object_or_404(Report, pk=report_id)
        serializer = ReportSerializer(report)
        return Response(serializer.data)


class ReportListView(APIView):
    def get(self, request):
        reports = Report.objects.filter(criado_por=request.user).order_by(
            "-data_criacao"
        )
        serializer = ReportSerializer(reports, many=True)
        return Response(serializer.data)


class GenerateMultipleReportsView(APIView):
    def post(self, request, formulario_id):
        try:
            formulario = get_object_or_404(FormularioRespondido, pk=formulario_id)
            tipos_de_relatorio = ["operacional"]

            reports = []
            for tipo in tipos_de_relatorio:
                report, _ = Report.objects.get_or_create(
                    formulario_respondido=formulario,
                    tipo=tipo,
                    defaults={"criado_por": request.user, "status": "rascunho"},
                )

                if report.status in ["rascunho", "reprovado"] or not report.pdf_file:
                    logo_path = os.path.join(
                        settings.BASE_DIR, "static", "img", "logo_future.png"
                    )
                    pdf_stream = generate_pdf_report(formulario.id, logo_path)

                    report.pdf_file.save(
                        f"relatorio_{tipo}_{formulario.id}_{datetime.now().strftime('%Y%m%d%H%M%S')}.pdf",
                        ContentFile(pdf_stream.read()),
                    )
                    report.status = "preenchimento"
                    report.criado_por = request.user
                    report.save()

                reports.append(report)

            serializer = ReportSerializer(reports, many=True)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except Exception as e:
            print(f"Erro detalhado: {e}")
            return Response(
                {"error": f"Erro ao gerar relatórios: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class GenerateTemporaryPDF(APIView):
    def get(self, request, formulario_id):
        try:
            formulario = get_object_or_404(FormularioRespondido, pk=formulario_id)
            logo_path = os.path.join(
                settings.BASE_DIR, "static", "img", "logo_future.png"
            )
            pdf_content = generate_pdf_report(formulario.id, logo_path)

            response = HttpResponse(
                pdf_content.getvalue(), content_type="application/pdf"
            )
            filename = f"relatorio_temporario_{formulario.id}.pdf"
            response["Content-Disposition"] = f'inline; filename="{filename}"'

            return response

        except Exception as e:
            return Response(
                {"error": f"Erro ao gerar PDF temporário: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


class GenerateDocxOrPdfView(APIView):
    def post(self, request):
        try:
            html = request.data.get("html")
            tipo = request.data.get("tipo", "pdf")

            if not html:
                return Response({"error": "HTML não enviado."}, status=400)

            if tipo == "pdf":
                pdf_bytes = HTML(string=html).write_pdf()
                return HttpResponse(
                    pdf_bytes,
                    content_type="application/pdf",
                    headers={
                        "Content-Disposition": 'attachment; filename="relatorio.pdf"'
                    },
                )

            elif tipo == "docx":
                try:
                    pypandoc.get_pandoc_path()
                except OSError:
                    pypandoc.download_pandoc()

                with tempfile.NamedTemporaryFile(
                    delete=False, suffix=".html"
                ) as temp_html:
                    temp_html.write(html.encode("utf-8"))
                    temp_html.flush()

                    with tempfile.NamedTemporaryFile(
                        delete=False, suffix=".docx"
                    ) as temp_docx:
                        pypandoc.convert_file(
                            temp_html.name,
                            "docx",
                            format="html",
                            outputfile=temp_docx.name,
                        )
                        docx_content = temp_docx.read()

                return HttpResponse(
                    docx_content,
                    content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    headers={
                        "Content-Disposition": 'attachment; filename="relatorio.docx"'
                    },
                )

            else:
                return Response(
                    {"error": "Tipo inválido. Use 'pdf' ou 'docx'."}, status=400
                )

        except Exception as e:
            return Response({"error": f"Erro ao gerar arquivo: {str(e)}"}, status=500)


class UploadReportFileView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, report_id):
        report = get_object_or_404(Report, pk=report_id)
        file = request.FILES.get("file")
        if not file:
            return Response({"error": "Arquivo não enviado."}, status=400)

        try:
            if file.name.endswith(".docx"):
                output = pypandoc.convert_text(file.read(), "pdf", format="docx")
                pdf_content = BytesIO(output)
                report.pdf_file.save(
                    f"{os.path.splitext(file.name)[0]}.pdf",
                    ContentFile(pdf_content.read()),
                    save=True,
                )
            else:
                report.pdf_file.save(file.name, file, save=True)

            report.status = "pendente"
            report.tipo = "executivo"  # <- Força o tipo como executivo
            report.save()

            return Response({"message": "Arquivo anexado com sucesso."}, status=200)

        except Exception as e:
            return Response(
                {"error": f"Erro ao processar arquivo: {str(e)}"}, status=500
            )


class GetReportByFormularioId(APIView):
    def get(self, request, formulario_id):
        try:
            report = Report.objects.filter(
                formulario_respondido_id=formulario_id, tipo="operacional"
            ).first()
            if not report:
                return Response({"error": "Nenhum relatório encontrado."}, status=404)

            serializer = ReportSerializer(report)
            return Response(serializer.data, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=500)


class GeneratePDFWithPlaywright(APIView):
    def post(self, request, formulario_id):
        try:
            html_content = request.data.get("html")
            if not html_content:
                return Response({"error": "HTML não enviado."}, status=400)

            formulario = get_object_or_404(FormularioRespondido, pk=formulario_id)

            report, _ = Report.objects.get_or_create(
                formulario_respondido=formulario,
                tipo="operacional",
                defaults={"criado_por": request.user, "status": "rascunho"},
            )

            # Caminhos temporários
            unique_id = str(uuid.uuid4())
            temp_html_path = f"/tmp/{unique_id}.html"
            temp_pdf_path = f"/tmp/{unique_id}.pdf"

            # Salvar HTML temporário
            with open(temp_html_path, "w", encoding="utf-8") as f:
                f.write(html_content)

            # Limpeza de páginas em branco
            with open(temp_html_path, "r", encoding="utf-8") as f:
                soup = BeautifulSoup(f.read(), "html.parser")

            for page in soup.select(".report-page"):
                style = page.get("style", "")
                is_hidden = "display:none" in style or "hidden" in page.get("class", [])
                children = [
                    c for c in page.find_all(recursive=False) if c.name != "footer"
                ]
                has_text = page.get_text(strip=True)
                has_img = page.find("img") is not None

                if (not children and not has_text and not has_img) or is_hidden:
                    page.decompose()

            with open(temp_html_path, "w", encoding="utf-8") as f:
                f.write(str(soup))

            # Carrega logo do rodapé em base64
            logo_path = os.path.join(
                settings.BASE_DIR, "static", "img", "LogoFutureHorizontal.png"
            )
            with open(logo_path, "rb") as image_file:
                logo_base64 = base64.b64encode(image_file.read()).decode("utf-8")
            logo_url = f"data:image/png;base64,{logo_base64}"

            # Template do rodapé (sem usar @page que não funciona no Playwright)
            footer_template = f"""
                <div style="width: 100%; font-size:10px; display: flex; justify-content: space-between; align-items: center; padding: 0 1cm;">
                    <img src="{logo_url}" style="height: 24px;" />
                    <span style="color: red; font-weight: bold;">DOCUMENTO RESTRITO</span>
                    <span style="color: gray;">Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
                </div>
            """ 

            # Geração do PDF
            with sync_playwright() as p:
                browser = p.chromium.launch()
                page = browser.new_page()
                page.set_viewport_size({"width": 1280, "height": 900})
                page.goto(f"file://{temp_html_path}", wait_until="networkidle")
                page.pdf(
                    path=temp_pdf_path,
                    format="A4",
                    print_background=True,
                    display_header_footer=True,
                    header_template="<div></div>",
                    footer_template=footer_template,
                    margin={
                        "top": "1cm",
                        "bottom": "2.8cm",
                        "left": "1.5cm",
                        "right": "1.5cm",
                    },
                )
                browser.close()

            # Salvar PDF no modelo
            with open(temp_pdf_path, "rb") as f:
                report.pdf_file.save(
                    f"relatorio_operacional_{formulario.id}.pdf",
                    ContentFile(f.read()),
                    save=True,
                )

            report.status = "preenchimento"
            report.save()

            return FileResponse(
                open(temp_pdf_path, "rb"), content_type="application/pdf"
            )

        except Exception as e:
            return Response({"error": f"Erro ao gerar PDF: {str(e)}"}, status=500)


class GenerateDocxFromHTMLView(APIView):
    def post(self, request):
        try:
            html_content = request.data.get("html")
            if not html_content:
                return Response({"error": "HTML não enviado."}, status=400)

            unique_id = str(uuid.uuid4())
            temp_html_path = f"/tmp/{unique_id}.html"
            temp_pdf_path = f"/tmp/{unique_id}.pdf"
            temp_docx_path = f"/tmp/{unique_id}.docx"

            # 🔹 Salva HTML temporário
            with open(temp_html_path, "w", encoding="utf-8") as f:
                f.write(html_content)

            # 🔥 Remove páginas em branco antes de gerar PDF
            with open(temp_html_path, "r", encoding="utf-8") as f:
                soup = BeautifulSoup(f.read(), "html.parser")

            for page in soup.select(".report-page"):
                style = page.get("style", "")
                is_hidden = "display:none" in style or "hidden" in page.get("class", [])

                only_footer = all(child.name == "footer" for child in page.find_all(recursive=False))
                empty_text = not page.get_text(strip=True)
                no_img = page.find("img") is None

                if is_hidden or (only_footer and empty_text and no_img):
                    page.decompose()


            with open(temp_html_path, "w", encoding="utf-8") as f:
                f.write(str(soup))

            # ✅ Logo do rodapé em Base64 (tamanho reduzido)
            logo_path = os.path.join(
                settings.BASE_DIR, "static", "img", "LogoFutureHorizontal.png"
            )
            with open(logo_path, "rb") as image_file:
                logo_base64 = base64.b64encode(image_file.read()).decode("utf-8")

            logo_url = f"data:image/png;base64,{logo_base64}"
            footer_template = f"""
                <div class="footer-content" style="width: 100%; font-size:10px; display: flex; justify-content: space-between; align-items: center; padding: 0 1cm;">
                    <img src="{logo_url}" style="height: 24px;" />
                    <span style="color: red; font-weight: bold;">DOCUMENTO RESTRITO</span>
                    <span style="color: gray;">Página <span class="pageNumber"></span> de <span class="totalPages"></span></span>
                </div>
                <style>
                    @page {{
                        size: A4;
                        margin: 1cm 1.5cm 2.8cm 1.5cm;
                    }}
                </style>
            """

            # ✅ Geração do PDF via Playwright
            with sync_playwright() as p:
                browser = p.chromium.launch()
                page = browser.new_page()
                page.goto(f"file://{temp_html_path}", wait_until="networkidle")
                page.pdf(
                    path=temp_pdf_path,
                    format="A4",
                    margin={
                        "top": "1cm",
                        "bottom": "2.8cm",
                        "left": "1.5cm",
                        "right": "1.5cm",
                    },
                    display_header_footer=True,
                    print_background=True,
                    header_template="<div></div>",
                    footer_template=footer_template,
                )
                browser.close()

            # ✅ Converte PDF para DOCX
            converter = Converter(temp_pdf_path)
            converter.convert(temp_docx_path, start=0, end=None)
            converter.close()

            # ✅ Retorna o DOCX
            with open(temp_docx_path, "rb") as f:
                response = HttpResponse(
                    f.read(),
                    content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                )
                response["Content-Disposition"] = (
                    'attachment; filename="relatorio.docx"'
                )
                return response

        except Exception as e:
            return Response({"error": f"Erro ao gerar DOCX: {str(e)}"}, status=500)
