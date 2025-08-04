"use client";

import { useEffect, useState } from "react";
import AnaliseDetail from "@/components/AnaliseDetail";
import Sidebar from "@/components/Sidebar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { FiHome, FiBarChart2, FiFileText } from "react-icons/fi";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";


export default function AnaliseDetailPage() {
  const [formularioRespondidoId, setFormularioRespondidoId] = useState<number | null>(null);
  const isSidebarCollapsed = useSidebarCollapsed();

  useEffect(() => {
      const storedId = localStorage.getItem("formularioRespondidoId");
      if (storedId && !isNaN(Number(storedId))) {
        setFormularioRespondidoId(Number(storedId));
      } else {
        console.warn("ID inválido");
      }
 
  }, []);

  if (formularioRespondidoId === null) return 
  <div className="flex min-h-screen bg-gray-100 flex-1 flex main-content">
  <Sidebar 
 
   
  />
  <div className={`${isSidebarCollapsed ? "main-content-collapsed" : "main-content"}`}>
    <LoadingSpinner />
  </div>
</div>;

  return <AnaliseDetail empresaId={formularioRespondidoId.toString()} />;
}
