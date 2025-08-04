import { FiFilter } from 'react-icons/fi';

interface ReportFiltersPanelProps {
  reportFilters: any;
  handleReportFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  data: any;
}

export const ReportFiltersPanel = ({
  reportFilters,
  handleReportFilterChange,
  data,
}: ReportFiltersPanelProps) => {
  const ordemCategorias = ['GV', 'ID', 'PR', 'DE', 'RS', 'RC'];

  return (
    <div id="report-filters-panel" className="report-filters-panel hidden">
      <h4>Filtros do Relatório</h4>
      <div className="filter-section">
        <h5>Seções</h5>
        <div className="filter-options">
          <label>
            <input
              type="checkbox"
              name="introducao"
              checked={reportFilters.introducao ?? true}
              onChange={handleReportFilterChange}
            />
            Introdução
          </label>
          <label>
            <input
              type="checkbox"
              name="resumo"
              checked={reportFilters.resumo}
              onChange={handleReportFilterChange}
            />
            Resumo da Avaliação
          </label>
          <label>
            <input
              type="checkbox"
              name="sumarioExecutivo"
              checked={reportFilters.sumarioExecutivo}
              onChange={handleReportFilterChange}
            />
            Sumário Executivo
          </label>
          <label>
            <input
              type="checkbox"
              name="graficoRadar"
              checked={reportFilters.graficoRadar}
              onChange={handleReportFilterChange}
            />
            Gráfico Radar
          </label>
          <label>
            <input
              type="checkbox"
              name="detalhesTecnicos"
              checked={reportFilters.detalhesTecnicos}
              onChange={handleReportFilterChange}
            />
            Detalhes Técnicos
          </label>
          <label>
            <input
              type="checkbox"
              name="recomendacoesGerais"
              checked={reportFilters.recomendacoesGerais}
              onChange={handleReportFilterChange}
            />
            Recomendações Gerais
          </label>
        </div>
      </div>

      <div className="filter-section">
        <h5>Categorias</h5>
        <div className="filter-options">
          {ordemCategorias.map((sigla) => (
            <label key={sigla}>
              <input
                type="checkbox"
                name={`categoria_${sigla}`}
                checked={reportFilters[`categoria_${sigla}` as keyof typeof reportFilters]}
                onChange={handleReportFilterChange}
              />
              {data?.categorias?.find((cat: any) => cat.sigla === sigla)?.categoria || sigla}{' '}
              ({sigla})
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};