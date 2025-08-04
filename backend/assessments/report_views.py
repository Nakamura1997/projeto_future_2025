from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from bs4 import BeautifulSoup
import json
import base64

from assessments.models import (
    AssessmentResponse,
    Question,
    Assessment,
    ControlAssessment,
    RiskAssessment,
    Answer,
)


class RelatorioExportarView(APIView):
    """
    View para exportar o relatório em formato HTML para impressão
    """

    def post(self, request, assessment_response_id):
        try:
            # Verifica se o formulário respondido existe
            assessment_response = get_object_or_404(
                AssessmentResponse, id=assessment_response_id
            )

            # Recebe os dados do frontend
            data = request.data
            if not data:
                return Response(
                    {"error": "Dados não fornecidos"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            filters = data.get("filters", {})
            content = data.get("content", {})
            chart_image = data.get(
                "chartImage", None
            )  # Base64 da imagem do gráfico gerado no frontend

            # Verifica se os dados necessários foram fornecidos
            if not filters or not content:
                return Response(
                    {"error": "Filtros ou conteúdo não fornecidos"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            # Gera o HTML para impressão
            html_content = self.generate_print_html(
                filters, content, chart_image, assessment_response
            )

            # Retorna o HTML como resposta
            return Response({"html": html_content})

        except Exception as e:
            return Response(
                {"error": f"Erro ao gerar HTML para impressão: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def generate_print_html(
        self, filters, content, chart_image=None, assessment_response=None
    ):
        """Gera um HTML formatado para impressão com base nos filtros e conteúdo."""
        # Cabeçalho HTML
        html = """
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <title>Relatório de Maturidade em Cibersegurança NIST</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333;
                    margin: 0;
                    padding: 20px;
                }
                h1, h2, h3, h4 {
                    color: #2c3e50;
                    margin-top: 20px;
                    margin-bottom: 10px;
                }
                .report-section {
                    margin-bottom: 30px;
                    padding: 20px;
                    border: 1px solid #eee;
                    border-radius: 5px;
                    background-color: #f9f9f9;
                    page-break-inside: avoid;
                }
                .question-block {
                    margin-left: 20px;
                    margin-bottom: 15px;
                    padding-left: 15px;
                    border-left: 3px solid #ccc;
                }
                .category-GV { border-left-color: #3498db; }
                .category-ID { border-left-color: #2ecc71; }
                .category-PR { border-left-color: #f39c12; }
                .category-DE { border-left-color: #e74c3c; }
                .category-RS { border-left-color: #9b59b6; }
                .category-RC { border-left-color: #1abc9c; }
                .radar-chart-container {
                    text-align: center;
                    margin: 20px 0;
                }
                .radar-chart-container img {
                    max-width: 100%;
                    height: auto;
                }
                @media print {
                    body {
                        padding: 0;
                        margin: 15mm;
                    }
                    .report-section {
                        border: none;
                        padding: 0;
                        margin-bottom: 20px;
                        background-color: white;
                    }
                    .no-print {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            <h1>Relatório de Maturidade em Cibersegurança NIST CSF</h1>
        """

        # Adiciona informações do usuário e assessment se disponíveis
        if assessment_response:
            html += f"""
            <p><strong>Usuário:</strong> {assessment_response.user.username}</p>
            <p><strong>Data da Avaliação:</strong> {assessment_response.created_at.strftime('%d/%m/%Y')}</p>
            """
        else:
            html += """
            <p><strong>Usuário:</strong> Não disponível</p>
            <p><strong>Data da Avaliação:</strong> Data não disponível</p>
            """

        # Instruções de impressão
        html += """
        <div class="no-print" style="margin: 20px 0; padding: 10px; background-color: #f8f9fa; border: 1px solid #ddd; border-radius: 4px;">
            <p><strong>Instruções:</strong> Para salvar este relatório como PDF, use a função de impressão do seu navegador (Ctrl+P ou Cmd+P) e selecione "Salvar como PDF".</p>
            <button onclick="window.print()" style="padding: 10px 15px; background-color: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer;">Imprimir / Salvar como PDF</button>
        </div>
        """

        # Adiciona as seções conforme os filtros

        # Sumário Executivo
        if filters.get("sumarioExecutivo", False):
            html += f"""
            <div class="report-section">
                <h2>Sumário Executivo</h2>
                {content.get('sumario', '<p>Sumário Executivo não disponível.</p>')}
            </div>
            """

        # Gráfico Radar
        if filters.get("graficoRadar", False) and chart_image:
            html += f"""
            <div class="report-section">
                <h2>Gráfico de Maturidade por Categoria</h2>
                <div class="radar-chart-container">
                    <img src="{chart_image}" alt="Gráfico Radar de Maturidade" style="max-width: 100%; height: auto;">
                    <p><em>O gráfico acima representa o nível de maturidade em cada categoria do NIST CSF.</em></p>
                </div>
            </div>
            """

        # Detalhes Técnicos
        if filters.get("detalhesTecnicos", False):
            html += f"""
            <div class="report-section">
                <h2>Detalhes Técnicos por Categoria</h2>
                {content.get('detalhes', '<p>Detalhes técnicos não disponíveis.</p>')}
            </div>
            """

        # Recomendações Gerais
        if filters.get("recomendacoesGerais", False):
            html += f"""
            <div class="report-section">
                <h2>Recomendações Gerais</h2>
                {content.get('recomendacoes', '<p>Recomendações gerais não disponíveis.</p>')}
            </div>
            """

        # Fecha o HTML
        html += """
        </body>
        </html>
        """

        return html


class CategoriasMediasView(APIView):
    """
    View para obter as médias das categorias para um assessment
    """

    def get(self, request, assessment_response_id):
        try:
            # Verifica se o assessment existe
            assessment_response = get_object_or_404(
                AssessmentResponse, id=assessment_response_id
            )

            # Obtém todas as questões respondidas neste assessment
            responses = AssessmentResponse.objects.filter(
                user=assessment_response.user
            ).select_related("question")

            # Agrupa por categoria
            categorias = {}
            for response in responses:
                categoria = response.question.get_category_display()
                if categoria not in categorias:
                    categorias[categoria] = {
                        "soma_politica": 0,
                        "soma_pratica": 0,
                        "count": 0,
                    }

                categorias[categoria]["soma_politica"] += response.politica
                categorias[categoria]["soma_pratica"] += response.pratica
                categorias[categoria]["count"] += 1

            # Calcula as médias
            resultado = {}
            for categoria, dados in categorias.items():
                media_politica = dados["soma_politica"] / dados["count"]
                media_pratica = dados["soma_pratica"] / dados["count"]
                media_geral = (media_politica + media_pratica) / 2

                resultado[categoria] = {
                    "nome": categoria,
                    "media_politica": round(media_politica, 2),
                    "media_pratica": round(media_pratica, 2),
                    "media_geral": round(media_geral, 2),
                }

            return Response(resultado)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
