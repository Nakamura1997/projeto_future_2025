// src/app/funcionario/relatorios/page.tsx
"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import React from "react";
import { FiHome, FiBarChart2, FiFileText } from "react-icons/fi";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";
import RelatorioNIST from "@/components/RelatorioNIST";

export default function RelatorioPage() {
  const isSidebarCollapsed = useSidebarCollapsed();

  return (
    <div className="flex">
      <Sidebar />

      <main
        className={`${
          isSidebarCollapsed ? "main-content-collapsed" : "main-content"
        }`}
      >
        <h1 className="text-2xl font-bold mb-4">Relatório de Avaliação</h1>

        <RelatorioNIST />
      </main>
    </div>
  );
}
