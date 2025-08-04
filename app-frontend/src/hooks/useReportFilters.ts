import { useState } from 'react';

export const useReportFilters = () => {
  const [reportFilters, setReportFilters] = useState({
    introducao: true,
    resumo: true,
    sumarioExecutivo: true,
    graficoRadar: true,
    detalhesTecnicos: true,
    recomendacoesGerais: true,
    categoria_GV: true,
    categoria_ID: true,
    categoria_PR: true,
    categoria_DE: true,
    categoria_RS: true,
    categoria_RC: true,
  });

  const handleReportFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setReportFilters((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return { reportFilters, handleReportFilterChange };
};