"use client";
import { useState, useRef, useEffect } from "react";
import Modal from "./Modal";
import { useReports } from "@/hooks/useReports";
import { useFormulario } from "@/hooks/useFormulario";
import { useSnackbar } from "@/hooks/useSnackbar";
import { getBaseUrl } from "@/util/baseUrl";

interface RelatorioModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: number;
  formularioId: number;
}

export default function RelatorioModal({
  isOpen,
  onClose,
  reportId,
  formularioId,
}: RelatorioModalProps) {
  const {
    uploadReportFile,
    downloadPdfReportAnexado,
    deleteReportFile,
    getReportByFormularioId,
  } = useReports();
  const { aprovarFormulario } = useFormulario();
  const { showSnackbar, SnackbarComponent } = useSnackbar();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  // Carregar o relatório ao abrir o modal
  useEffect(() => {
    const fetchReport = async () => {
      if (isOpen && formularioId) {
        setLoading(true);
        try {
          const data = await getReportByFormularioId(formularioId);
          console.log("********** Dados do relatório:", data);

          // Se não houver arquivo PDF anexado, mostra o dropzone
          if (
            data.pdf_url &&
            data.status !== "rascunho" &&
            data.status !== "reprovado"
          ) {
            setPreviewUrl(`${getBaseUrl()}${data.pdf_url}`);
          } else {
            setPreviewUrl(null);
          }
        } catch {
          setPreviewUrl(null);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchReport();
  }, [isOpen, formularioId]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        showSnackbar("Somente arquivos PDF são permitidos.", "info");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      showSnackbar("Selecione um arquivo antes de enviar.", "info");
      return;
    }
    try {
      setLoading(true);
      await uploadReportFile(reportId, selectedFile);
      showSnackbar("Relatório anexado com sucesso.", "success");
      // Recarregar o preview após upload
      const data = await getReportByFormularioId(formularioId);
      if (data.pdf_url) {
        setPreviewUrl(`${getBaseUrl()}${data.pdf_url}`);
      }
      setSelectedFile(null); // limpar seleção após upload
    } catch {
      showSnackbar("Erro ao anexar relatório.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      setLoading(true);
      await downloadPdfReportAnexado(reportId);
      showSnackbar("Visualização iniciada.", "success");
    } catch {
      showSnackbar("Erro ao visualizar relatório.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Deseja realmente excluir o arquivo anexado?")) return;
    try {
      setLoading(true);
      await deleteReportFile(reportId);
      setPreviewUrl(null);
      showSnackbar("Relatório excluído com sucesso.", "success");
    } catch {
      showSnackbar("Erro ao excluir relatório.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    try {
      setLoading(true);
      const result = await aprovarFormulario(formularioId);

      if (result?.alreadyApproved) {
        showSnackbar("Este formulário já foi aprovado anteriormente.", "info");
      } else {
        showSnackbar("Formulário aprovado com sucesso.", "success");
      }

      onClose();
    } catch {
      showSnackbar("Erro ao aprovar formulário.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="anexo">
      <Modal isOpen={isOpen} onClose={onClose} title="Gerenciar Relatório">
        <div
          className="drop-zone"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileInputRef.current?.click()}
        >
          {selectedFile ? (
            <p>{selectedFile.name}</p>
          ) : (
            <p>Arraste e solte o relatório aqui ou clique para selecionar.</p>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </div>

        {previewUrl && (
          <iframe
            src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(
              previewUrl
            )}`}
            width="100%"
            height="600px"
            title="Preview do Relatório"
          />
        )}

        <div className="button-group">
          <button
            onClick={handleUpload}
            disabled={loading || !selectedFile}
            className="btn"
          >
            📤 Anexar Relatório
          </button>
          <button onClick={handleDownload} disabled={loading} className="btn">
            👁️ Visualizar/Download
          </button>
          <button onClick={handleDelete} disabled={loading} className="btn">
            🗑️ Excluir Relatório
          </button>
          <button onClick={handleApprove} disabled={loading} className="btn">
            ✅ Aprovar Formulário
          </button>
        </div>

        <SnackbarComponent />
      </Modal>
    </div>
  );
}
