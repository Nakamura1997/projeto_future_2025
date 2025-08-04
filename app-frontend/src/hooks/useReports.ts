import { getBaseUrl } from "@/util/baseUrl";

interface ReportData {
  id: number;
  tipo: string;
  status: string;
  data_criacao: string;
  pdf_file?: string;
  formulario_respondido: number;
}

export const useReports = () => {
  const API_URL = `${getBaseUrl()}/api/reports`;

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  // Gerar relatório operacional
  const generateOperationalReport = async (formularioId: number) => {
    try {
      const response = await fetch(`${API_URL}/operacional/${formularioId}/`, {
        method: "GET",
        ...getAuthConfig(),
      });
      if (!response.ok) throw new Error("Erro ao gerar relatório operacional");
      return await response.json();
    } catch (error) {
      console.error("Erro ao gerar relatório operacional:", error);
      throw error;
    }
  };

  // Baixar PDF do relatório
  const downloadPdfReport = async (reportId: number) => {
    try {
      const response = await fetch(`${API_URL}/download/${reportId}/`, {
        method: "GET",
        ...getAuthConfig(),
      });

      if (!response.ok) throw new Error("Erro ao baixar PDF");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `relatorio_${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error("Erro ao baixar PDF:", error);
      throw error;
    }
  };

  // Listar todos os relatórios
  const getAllReports = async (): Promise<ReportData[]> => {
    try {
      const response = await fetch(`${API_URL}/`, {
        method: "GET",
        ...getAuthConfig(),
      });
      if (!response.ok) throw new Error("Erro ao obter relatórios");
      return await response.json();
    } catch (error) {
      console.error("Erro ao obter relatórios:", error);
      throw error;
    }
  };

  // Gerar PDF ou Word enviando HTML ao backend
  const generateDocxOrPdfFromHtml = async (
    html: string,
    tipo: "pdf" | "docx" = "pdf"
  ) => {
    try {
      const response = await fetch(`${API_URL}/gerar-docx/`, {
        method: "POST",
        headers: {
          ...getAuthConfig().headers,
        },
        body: JSON.stringify({ html, tipo }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error ||
            `Erro ao gerar ${tipo} (status: ${response.status})`
        );
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        tipo === "pdf" ? "relatorio.pdf" : "relatorio.docx"
      );
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error(`Erro ao gerar ${tipo}:`, error);
      throw error;
    }
  };

  // Gerar relatórios operacional e executivo
  const generateAllReports = async (formularioId: number | any) => {
    try {
      const response = await fetch(
        `${API_URL}/gerar-relatorios/${formularioId}/`,
        {
          method: "POST",
          ...getAuthConfig(),
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(
          errorData?.error ||
            `Erro ao gerar relatórios (status: ${response.status})`
        );
      }
      return await response.json();
    } catch (error) {
      console.error("Erro ao gerar relatórios:", error);
      throw error;
    }
  };

  // Nova função para gerar PDF temporário (não salva no banco)
  const generateTemporaryPDF = async (formularioId: number) => {
    try {
      const response = await fetch(`${API_URL}/temp-pdf/${formularioId}/`, {
        method: "GET",
        ...getAuthConfig(),
      });

      if (!response.ok) throw new Error("Erro ao gerar PDF temporário");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `relatorio_temporario_${formularioId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error("Erro ao gerar PDF temporário:", error);
      throw error;
    }
  };

  const uploadReportFile = async (reportId: number, file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${API_URL}/upload-report/${reportId}/`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData,
      });
      if (!response.ok) throw new Error("Erro ao anexar relatório.");
      return await response.json();
    } catch (error) {
      console.error("Erro ao anexar relatório:", error);
      throw error;
    }
  };

  // Download de relatório
  const downloadPdfReportAnexado = async (reportId: number) => {
    try {
      const response = await fetch(`${API_URL}/upload-report/${reportId}/`, {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error("Erro ao baixar relatório.");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `relatorio_${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error("Erro ao baixar relatório:", error);
      throw error;
    }
  };

  // Deletar arquivo de relatório
  const deleteReportFile = async (reportId: number) => {
    try {
      const response = await fetch(`${API_URL}/upload-report/${reportId}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (!response.ok) throw new Error("Erro ao excluir relatório.");
      return await response.json();
    } catch (error) {
      console.error("Erro ao excluir relatório:", error);
      throw error;
    }
  };

  const getReportByFormularioId = async (formularioId: number) => {
    try {
      if (formularioId === 0) {
        formularioId = 1;
      }
      console.log("id", formularioId);
      const response = await fetch(
        `${API_URL}/report-by-formulario/${formularioId}/`,
        {
          method: "GET",
          ...getAuthConfig(),
        }
      );
      if (!response.ok)
        throw new Error("Erro ao obter relatório por formulário.");
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    generateOperationalReport,
    downloadPdfReport,
    getAllReports,
    generateAllReports,
    generateDocxOrPdfFromHtml,
    generateTemporaryPDF,
    uploadReportFile,
    downloadPdfReportAnexado,
    deleteReportFile,
    getReportByFormularioId,
  };
};
