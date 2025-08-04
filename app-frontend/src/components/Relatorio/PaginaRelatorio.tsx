// src/components/Relatorio/PaginaRelatorio.tsx

import React from "react";
import { Footer } from "./Footer";

type PaginaRelatorioProps = {
  children: React.ReactNode;
  pageNumber: number;
  totalPages: number;
};

export const PaginaRelatorio = ({ children, pageNumber, totalPages }: PaginaRelatorioProps) => {
  return (
    // A classe 'report-page' é a que controla a quebra de página no CSS
    <section className="report-page">
      <div className="page-content">{children}</div>
      <Footer pageNumber={pageNumber} totalPages={totalPages} />
    </section>
  );
};