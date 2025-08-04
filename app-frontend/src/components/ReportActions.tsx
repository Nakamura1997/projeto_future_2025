import { FiDownload, FiEdit2, FiFilter, FiCheck, FiEye } from "react-icons/fi";

interface ReportActionsProps {
  isEditing: boolean;
  toggleEditing: () => void;
  isExporting: boolean;
  exportToPdf: () => void;
  exportToWord: () => void;
  previewHtml: () => void;
}

export const ReportActions = ({
  isEditing,
  toggleEditing,
  isExporting,
  exportToPdf,
  exportToWord,
  previewHtml,
}: ReportActionsProps) => {
  return (
    <div className="report-actions">
      <button
        onClick={toggleEditing}
        className={`btn ${isEditing ? "btn-success" : "btn-primary"}`}
      >
        {isEditing ? (
          <>
            <FiCheck /> Concluir Edição
          </>
        ) : (
          <>
            <FiEdit2 /> Editar Relatório
          </>
        )}
      </button>
      <div>
        <button
          onClick={() =>
            document
              .getElementById("report-filters-panel")
              ?.classList.toggle("hidden")
          }
          className="btn btn-secondary"
        >
          <FiFilter /> Filtros
        </button>
        <button
          onClick={exportToPdf}
          className="btn btn-export"
          disabled={isExporting}
        >
          {isExporting ? (
            "Exportando..."
          ) : (
            <>
              <FiDownload /> Exportar PDF
            </>
          )}
        </button>
        <button
          onClick={exportToWord}
          className="btn btn-export"
          disabled={isExporting}
          style={{ marginRight: "10px" }}
        >
          {isExporting ? (
            "Exportando..."
          ) : (
            <>
              <FiDownload /> Exportar Word
            </>
          )}
        </button>
        <button
          onClick={() => {
            const previewWindow = window.open("", "_blank");
            if (previewWindow) {
              previewWindow.document.write(
                "<h1>Carregando pré-visualização...</h1>"
              );
              // Chama previewHtml após um pequeno delay para garantir que a janela está aberta
              setTimeout(() => previewHtml(), 100);
            }
          }}
          className="btn btn-preview"
          disabled={isExporting}
        >
          <FiEye /> Pré-visualizar
        </button>
      </div>
    </div>
  );
};
