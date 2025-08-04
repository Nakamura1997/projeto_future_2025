"use client";

import { useRef } from "react";
import { FiDownload, FiX } from "react-icons/fi";
import RadarNistCsf from "./RadarNistCsf";
import NistCsfTable from "./NistTable";
import CoverPage from "./Relatorio/CoverPage";
import RelatorioIntroducao from "./Relatorio/RelatorioIntroducao";
import ResumoAvaliacao from "./Relatorio/ResumoAvaliacao";
import DetalhesTecnicosPorCategoria from "./Relatorio/DetalhesTecnicosPorCategoria";
import Summary from "./Relatorio/Summary";
import MaturityLevelTable from "./Relatorio/MaturityLevelTable";
import { Footer } from "./Relatorio/Footer";
import logo from "@/assets/LogoFutureHorizontal.png";
import { useReportExport } from "@/hooks/useReportExport";
import { useReportEditing } from "@/hooks/useReportEditing";
import { useReportFilters } from "@/hooks/useReportFilters";
import { ReportFiltersPanel } from "./ReportFiltersPanel";
import { ReportActions } from "./ReportActions";

type RelatorioProps = {
  data: any;
  onClose: () => void;
};

export default function Relatorio({ data, onClose }: RelatorioProps) {
  console.log("📦 Dados recebidos em <Relatorio />:", data);

  const reportRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Hooks personalizados
  
  const { isExporting, exportToPdf, exportToWord, previewHtml } =
    useReportExport(reportRef);
  const {
    isEditing,
    toggleEditing,
    summaryContentRef,
    detailsContentRef,
    recommendationsContentRef,
  } = useReportEditing();
  const { reportFilters, handleReportFilterChange } = useReportFilters();

  const ordemCategorias = ["GV", "ID", "PR", "DE", "RS", "RC"];

  return (
    <div className="modal-overlay">
      <div className="modal-report">
        <div className="modal-header">
          <h3>Relatório de Maturidade em Cibersegurança</h3>
          <button
            onClick={onClose}
            className="btn-close"
            aria-label="Fechar modal"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="modal-body">
          <ReportActions
            isEditing={isEditing}
            toggleEditing={toggleEditing}
            isExporting={isExporting}
            exportToPdf={exportToPdf}
            exportToWord={exportToWord}
            previewHtml={previewHtml}
          />

          <ReportFiltersPanel
            reportFilters={reportFilters}
            handleReportFilterChange={handleReportFilterChange}
            data={data}
          />

          <div className="report-content" ref={reportRef}>
            <section className="report-page" id="capa">
              <CoverPage base64Images={{}} />
            </section>

            <section className="report-page" id="sumario">
              <Summary />
            </section>

            {reportFilters.introducao && (
              <section className="report-page" id="introducao">
                <RelatorioIntroducao base64Images={{}} />
              </section>
            )}

            <section className="report-page" id="table-maturity">
              <MaturityLevelTable isEditing={false} />
            </section>

            {reportFilters.resumo && (
              <section className="report-page" id="resumo">
                <div className="report-section">
                  <h4>Resumo da Avaliação</h4>
                  <ResumoAvaliacao  />
                </div>
              </section>
            )}

            {reportFilters.graficoRadar && (
              <section className="report-page" id="grafico">
                <div className="report-section">
                  <h4>CSF – Cybersecurity Framework – versão 2</h4>
                  <div className="radar-chart-container">
                    <NistCsfTable />
                    <RadarNistCsf />
                  </div>
                </div>
              </section>
            )}

            {reportFilters.detalhesTecnicos && (
              <div id="detalhesTecnicos">
                <div className="report-section">
                  <h4>CSF – Cybersecurity Framework </h4>
                  <DetalhesTecnicosPorCategoria data={data} />
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
            <h1>Plano de Ação Inicial</h1>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-cancel">
            Fechar
          </button>
          <button
            onClick={exportToPdf}
            className="btn btn-confirm"
            disabled={isExporting}
          >
            {isExporting ? "Exportando..." : "Exportar PDF"}
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
        </div>
      </div>
    </div>
  );
}
