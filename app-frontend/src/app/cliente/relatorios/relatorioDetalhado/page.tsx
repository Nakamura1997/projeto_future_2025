// src/app/funcionario/relatorios/page.tsx
"use client";

import { useState, useEffect } from "react";

import React from "react";

import RelatorioCliente from "@/components/Relatorio_cliente";

export default function RelatorioDetalhadoPage() {
  let formularioId = null;
  if (typeof window !== "undefined") {
    formularioId = localStorage.getItem("formularioRespondidoId");
  }
  const empresaId = "1";
  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">Relatório Detalhado</h1>
      <RelatorioCliente empresaId={formularioId} />
    </main>
  );
}
