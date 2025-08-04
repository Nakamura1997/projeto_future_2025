// =================================================================
// ARQUIVO: ConteudoRelatorio.tsx (Componente Principal)
// =================================================================
"use client";

import { useRef, useState, useEffect } from "react";
import { FiDownload, FiEdit2, FiX } from "react-icons/fi";
import RadarNistCsf from "./RadarNistCsf";
import NistCsfTable from "./NistTable";
import CoverPage from "./Relatorio/CoverPage";
import RelatorioIntroducao from "./Relatorio/RelatorioIntroducao";
import ResumoAvaliacao from "./Relatorio/ResumoAvaliacao";
import DetalhesTecnicosPorCategoria from "./Relatorio/DetalhesTecnicosPorCategoria";
import Summary from "./Relatorio/Summary";
import MaturityLevelTable from "./Relatorio/MaturityLevelTable";
import { useReportExport } from "@/hooks/useReportExport";
import { useReportEditing } from "@/hooks/useReportEditing";
import { useReportFilters } from "@/hooks/useReportFilters";
import logo from "@/assets/LogoFutureHorizontal.png";
import logoReport from "@/assets/Imagem1.png";
import nistLogo from "@/assets/logo_nist.png";
import { CSS } from "@/util/cssRelatorio";
import { useExportWord } from "@/hooks/useExportWord";
import { useReports } from "@/hooks/useReports";
import html2canvas from "html2canvas";

import PlanoDeAcaoReportPage from "./PlanoDeAcaoReportPage";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import RelatorioNIST from "./RelatorioNIST";
import usePlanoAcao from "@/hooks/usePlanoAcao";
import { getBaseUrl } from "@/util/baseUrl";
import { PlanoDeAcao } from "@/types/planodeAção";
import { FaFilePdf, FaFileWord } from "react-icons/fa";
import { useSnackbar } from "notistack";
import { CircularProgress } from "@mui/material";
import clsx from "clsx";
// Em seu componente:

type ConteudoRelatorioProps = {
  data: any;
  formularioRespondidoId: any;
  onClose: () => void;
};

export default function ConteudoRelatorio({
  data,
  formularioRespondidoId,
  onClose,
}: ConteudoRelatorioProps) {
  console.log("📦 Dados recebidos em <ConteudoRelatorio />:", data);
  const { generateDocxOrPdfFromHtml } = useReports();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const reportRef = useRef<HTMLDivElement>(null);

  const [base64Images, setBase64Images] = useState<{ [key: string]: string }>(
    {}
  );
  const { planos, loading, fetchPlanoPorFormulario } = usePlanoAcao();
  const [plano, setPlano] = useState<PlanoDeAcao>();
  const [isGenerating, setIsGenerating] = useState<
    null | "pdf" | "docx" | "html"
  >(null);

  useEffect(() => {
    if (formularioRespondidoId) {
      fetchPlanoPorFormulario(formularioRespondidoId);
    }
  }, [data]);

  useEffect(() => {
    if (planos) {
      console.log("planos", planos);
      const encontrarPlano = planos.find(
        (plano) => plano.criado_por.role === "analista"
      );
      setPlano(encontrarPlano);
    }
  }, [planos]);

  const replaceNistTableWithImage = async (clone: HTMLElement) => {
    const nistTableElement = document.querySelector(
      ".nist-csf-container"
    ) as HTMLElement;
    if (!nistTableElement) {
      console.warn("NistCsfTable não encontrado para captura.");
      return;
    }

    // Captura usando html2canvas
    const canvas = await html2canvas(nistTableElement, {
      scale: 2,
      backgroundColor: "#fff",
    });
    const imgDataUrl = canvas.toDataURL("image/png");

    // Encontra o mesmo elemento no clone
    const cloneNistTableElement = clone.querySelector(".nist-csf-container");
    if (cloneNistTableElement) {
      const img = document.createElement("img");
      img.src = imgDataUrl;
      img.style.maxWidth = "100%";
      img.style.height = "auto";
      cloneNistTableElement.innerHTML = "";
      cloneNistTableElement.appendChild(img);
    }
  };

  const gerarDocxViaPlaywright = async () => {
    setIsGenerating("docx");

    const snackId = enqueueSnackbar("Gerando...", {
      persist: true,
      variant: "info",
      content: (key) => (
        <div
          id={key}
          className={clsx(
            "MuiSnackbarContent-root",
            "MuiSnackbarContent-message",
            "notistack-MuiContent",
            "notistack-MuiContent-info"
          )}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "8px 16px",
            borderRadius: "4px",
            color: "white",
            backgroundColor: "#2196f3", // azul padrão do variant "info"
          }}
        >
          <CircularProgress size={20} style={{ color: "white" }} />
          <span>Gerando relatório Word... Isso pode levar alguns minutos.</span>
        </div>
      ),
    });

    try {
      const html = await generateHtmlString(true);
      if (!html || !formularioRespondidoId) {
        closeSnackbar(snackId);
        enqueueSnackbar("Erro ao preparar o HTML para exportação.", {
          variant: "error",
        });
        return;
      }

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${getBaseUrl()}/api/reports/html-to-docx/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ html }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error || `Erro ao gerar DOCX (status: ${response.status})`
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "relatorio.docx");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      closeSnackbar(snackId);
      enqueueSnackbar("Relatório DOCX gerado com sucesso.", {
        variant: "success",
      });
    } catch (error) {
      console.error("Erro ao gerar DOCX via Playwright:", error);
      closeSnackbar(snackId);
      enqueueSnackbar(
        "Erro ao gerar o DOCX. Veja o console para mais detalhes.",
        {
          variant: "error",
        }
      );
    } finally {
      setIsGenerating(null);
    }
  };

  const gerarPdfViaPlaywright = async () => {
    setIsGenerating("pdf");
    try {
      const html = await generateHtmlString();
      if (!html || !formularioRespondidoId) {
        alert("Erro ao preparar o HTML para exportar.");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await fetch(
        `${getBaseUrl()}/api/reports/gerar-pdf-playwright/${formularioRespondidoId}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ html }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error || `Erro ao gerar PDF (status: ${response.status})`
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "relatorio.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar o PDF. Veja o console para mais detalhes.");
    } finally {
      setIsGenerating(null);
    }
  };

  const generateHtmlString = async (word = false): Promise<string | null> => {
    console.log(reportRef);
    if (!reportRef.current) {
      alert("Retornou null.");
      return null;
    }
    if (Object.keys(base64Images).length < 2) {
      alert("As imagens ainda estão sendo carregadas. Aguarde.");
      return null;
    }

    const clone = reportRef.current.cloneNode(true) as HTMLElement;
    await embedImagesAsBase64(clone);
    Array.from(clone.querySelectorAll(".no-print, .no-export")).forEach((el) =>
      el.remove()
    );

    const styles = Array.from(
      document.querySelectorAll("style, link[rel='stylesheet']")
    )
      .map((style) => {
        if (style.tagName === "STYLE") return style.outerHTML;
        if (style.tagName === "LINK")
          return `<link rel="stylesheet" href="${
            (style as HTMLLinkElement).href
          }">`;
        return "";
      })
      .join("\n");

    if (word) {
      await replaceRadarChartWithImage(clone);
      await replaceNistTableWithImage(clone);
    }

    const htmlContent = clone.innerHTML;
    const fullHtml = `
    <!DOCTYPE html>
    <html lang="pt-BR">
      <head>
        <meta charset="UTF-8" />
        <title>Relatório de Segurança</title>
        ${styles}
        <style>${CSS}</style>
      </head>
      <body>${htmlContent}</body>
    </html>
  `;

    return fullHtml;
  };

  useEffect(() => {
    const convertImageToBas64 = async (key: string, imageModule: any) => {
      try {
        const response = await fetch(imageModule.src);
        const blob = await response.blob();
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          setBase64Images((prev) => ({
            ...prev,
            [key]: reader.result as string,
          }));
        };
      } catch (error) {
        console.error(`Falha ao converter a imagem ${key}:`, error);
      }
    };

    convertImageToBas64("logoReport", logoReport);
    convertImageToBas64("nistLogo", nistLogo);
  }, []);

  const embedImagesAsBase64 = async (htmlElement: HTMLElement) => {
    const images = Array.from(
      htmlElement.querySelectorAll<HTMLImageElement>("img[data-img-key]")
    );

    for (const img of images) {
      const key = img.getAttribute("data-img-key");
      if (key && base64Images[key]) {
        img.src = base64Images[key];
        console.log(`Imagem com chave "${key}" substituída por Base64.`);
      }
    }
  };
  const replaceRadarChartWithImage = async (clone: HTMLElement) => {
    const svg = document.querySelector("#radar-chart svg");
    if (!svg) {
      console.warn("SVG do RadarChart não encontrado.");
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1900));
    // Cria wrapper neutro (sem estilos exagerados!)
    const wrapper = document.createElement("div");
    wrapper.style.background = "#fff";
    wrapper.style.padding = "0";
    wrapper.style.margin = "0";
    wrapper.style.width = "800px";
    wrapper.style.height = "800px";
    wrapper.style.display = "flex";
    wrapper.style.justifyContent = "center";
    wrapper.style.alignItems = "center";
    wrapper.style.position = "fixed";
    wrapper.style.top = "-9999px";
    wrapper.style.left = "-9999px";
    wrapper.style.overflow = "visible";
    wrapper.style.zIndex = "-1";
    wrapper.style.overflow = "visible";
    wrapper.style.border = "none";
    wrapper.style.boxShadow = "none";
    wrapper.style.borderRadius = "0";

    // Clona só o SVG
    const clonedSvg = svg.cloneNode(true) as SVGElement;
    clonedSvg.setAttribute("width", "700");
    clonedSvg.setAttribute("height", "700");
    clonedSvg.style.background = "#fff";
    clonedSvg.style.border = "none";
    clonedSvg.style.boxShadow = "none";
    clonedSvg.style.borderRadius = "0";
    clonedSvg.style.overflow = "visible";
    clonedSvg.style.background = "#fff";

    // Remove defs se tiver
    const defs = clonedSvg.querySelector("defs");
    if (defs) defs.remove();

    wrapper.appendChild(clonedSvg);
    document.body.appendChild(wrapper);

    const canvas = await html2canvas(wrapper, {
      backgroundColor: "#fff",
      scale: 2,
      useCORS: true,
    });

    document.body.removeChild(wrapper);

    const imgDataUrl = canvas.toDataURL("image/png");

    const cloneRadarElement = clone.querySelector("#radar-chart");
    if (cloneRadarElement) {
      const img = document.createElement("img");
      img.src = imgDataUrl;
      img.style.width = "700px";
      img.style.height = "auto";
      img.style.display = "block";
      img.style.margin = "0 auto";

      cloneRadarElement.innerHTML = "";
      cloneRadarElement.appendChild(img);

      console.log("✅ Radar renderizado com tamanho e fundo corretos!");
    }
  };

  const exportToHtml = async () => {
    setIsGenerating("html");
    try {
      if (!reportRef.current) return;
      if (Object.keys(base64Images).length < 2) {
        alert(
          "As imagens ainda estão sendo carregadas. Tente novamente em um instante."
        );
        return;
      }

      const clone = reportRef.current.cloneNode(true) as HTMLElement;
      await embedImagesAsBase64(clone);
      Array.from(clone.querySelectorAll(".no-print, .no-export")).forEach(
        (el) => el.remove()
      );

      const styles = Array.from(
        document.querySelectorAll('style, link[rel="stylesheet"]')
      )
        .map((style) => {
          if (style.tagName === "STYLE") return style.outerHTML;
          if (style.tagName === "LINK")
            return `<link rel="stylesheet" href="${
              (style as HTMLLinkElement).href
            }">`;
          return "";
        })
        .join("\n");

      const htmlContent = clone.innerHTML;
      const fullHtml = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><title>Relatório de Segurança</title>${styles}<style>${CSS}</style></head><body>${htmlContent}</body></html>`;

      const blob = new Blob([fullHtml], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `relatorio-seguranca-${new Date()
        .toISOString()
        .slice(0, 10)}.html`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (e) {
      console.error("Erro ao exportar HTML:", e);
      alert("Erro ao exportar HTML.");
    } finally {
      setIsGenerating(null);
    }
  };

  const { isExporting, exportToPdf, previewHtml } = useReportExport(reportRef);
  const {
    isEditing,
    toggleEditing,
    summaryContentRef,
    detailsContentRef,
    recommendationsContentRef,
  } = useReportEditing();
  const { reportFilters, handleReportFilterChange } = useReportFilters();
  const [isEditingReport, setIsEditingReport] = useState(false); // ✅ para controle modal editor
  const [htmlReportContent, setHtmlReportContent] = useState<string | null>(
    null
  );

  const handleOpenEditor = async () => {
    const html = await generateHtmlString();
    if (html) {
      setHtmlReportContent(html);
      setIsEditingReport(true);
    } else {
      alert("Não foi possível gerar o HTML para edição.");
    }
  };

  if (isEditingReport && htmlReportContent) {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#fff",
          zIndex: 9999,
          overflow: "auto",
        }}
      >
        <button
          onClick={() => setIsEditingReport(false)}
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "10px 12px",
            backgroundColor: "#e74c3c",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            zIndex: 10000,
          }}
        >
          <FiX /> Fechar Editor
        </button>
        <RelatorioNIST htmlContent={htmlReportContent} />
      </div>
    );
  }

  return (
    <div className="reporContainer">
      <div
        className="no-print"
        role="region"
        aria-label="Botões de exportação"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          display: "flex",
          flexDirection: "column-reverse",
          gap: "14px",
          zIndex: 1000,
        }}
      >
        {/* Botão HTML */}
        <button
          onClick={exportToHtml}
          disabled={isGenerating !== null}
          aria-label="Exportar relatório como HTML"
          style={{
            padding: "12px 18px",
            backgroundColor: "#f39c12",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: isGenerating ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            opacity: isGenerating ? 0.6 : 1,
            transition: "all 0.2s",
          }}
        >
          <FiDownload aria-hidden="true" />
          <span>HTML</span>
        </button>

        {/* Botão Word */}
        <button
          onClick={gerarDocxViaPlaywright}
          disabled={isGenerating !== null}
          aria-label="Exportar relatório como Word"
          style={{
            padding: "12px 18px",
            backgroundColor: "#e91e63",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: isGenerating ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            opacity: isGenerating ? 0.6 : 1,
            transition: "all 0.2s",
          }}
        >
          <FaFileWord aria-hidden="true" />
          <span>Word</span>
        </button>

        {/* Botão PDF */}
        <button
          onClick={gerarPdfViaPlaywright}
          disabled={isGenerating !== null}
          aria-label="Exportar relatório como PDF"
          style={{
            padding: "12px 18px",
            backgroundColor: "#00bcd4",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: isGenerating ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
            opacity: isGenerating ? 0.6 : 1,
            transition: "all 0.2s",
          }}
        >
          <FaFilePdf aria-hidden="true" />
          <span>PDF</span>
        </button>
      </div>

      <div className="report-content" ref={reportRef}>
        <section className="report-page page-1" id="capa">
          <CoverPage base64Images={base64Images} />
        </section>

        <section className="report-page page-2" id="sumario">
          <Summary />
        </section>

        {reportFilters.introducao && (
          <section className="report-page" id="introducao">
            <RelatorioIntroducao base64Images={base64Images} />
          </section>
        )}

        <section className="report-page" id="table-maturity">
          <MaturityLevelTable isEditing={false} />
        </section>

        {reportFilters.resumo && (
          <section className="report-page" id="resumo">
            <div className="report-section">
              <h4>Resumo da Avaliação</h4>
              <ResumoAvaliacao />
            </div>
          </section>
        )}

        {reportFilters.graficoRadar && (
          <div>
            <section className="report-page" id="grafico-table">
              <div className="report-section">
                <div>
                  <div className="radar-chart-container">
                    <NistCsfTable />
                    <RadarNistCsf />
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {reportFilters.detalhesTecnicos && (
          <div id="detalhesTecnicos">
            <div className="report-section">
              <h4 style={{ display: "none" }}>quebra de linha nescerraria</h4>
              <div className="report-page">
                <DetalhesTecnicosPorCategoria data={data} />
              </div>
            </div>
          </div>
        )}

        {reportFilters.recomendacoesGerais && (
          <section className="report-page" id="reco">
            <div className="report-section">
              <h4>Recomendações Gerais</h4>
              <div
                ref={recommendationsContentRef}
                className={`editable-content ${isEditing ? "editing" : ""}`}
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
              />
            </div>
          </section>
        )}
        <PlanoDeAcaoReportPage id={plano?.id} />
      </div>
    </div>
  );
}
