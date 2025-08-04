"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { useFormulario } from "@/hooks/useFormulario";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";

export default function FormularioPage() {
  const isSidebarCollapsed = useSidebarCollapsed();
  const router = useRouter();
  const { formularios, getFormularios } = useFormulario();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    getFormularios();
  }, []);

  const handleFormularioClick = (formulario) => {
    console.log("formulario", formulario);
    localStorage.setItem("selectedFormularioId", formulario.id.toString());
    localStorage.setItem("nomefomulario", formulario.nome.toString());

    const respondidos = JSON.parse(
      localStorage.getItem("formulariosEmAndamento") || "{}"
    );

    const formularios = respondidos[0] || {};

    localStorage.setItem("nomeFormulario", formularios.nome);
    localStorage.setItem(
      `formulario_${formularios.id}_total`,
      formularios.nome
    );
    const nomeFormatado = formulario.nome.toLowerCase().split(" ")[0];
    router.push(`/cliente/formulario/${nomeFormatado}`);
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const className = isMobile
    ? "sidebar-mobile"
    : isSidebarCollapsed
    ? "main-content-collapsed"
    : "main-content";

  return (
    <div className="flex">
      <Sidebar />
      <div className={className}>
        <main>
          <div className="cards-list">
            {formularios.map((formulario) => (
              <div
                key={formulario.id}
                className="cardForm"
                onClick={() => handleFormularioClick(formulario)}
              >
                <h2 className="text-lg font-semibold">{formulario.nome}</h2>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
