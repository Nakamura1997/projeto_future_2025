"use client";

import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";
import Sidebar from "@/components/Sidebar";
import React, { useEffect, useState } from "react";
import { useFormulario } from "@/hooks/useFormulario";
import { useRouter } from "next/navigation";

export default function RelatorioPage() {
  const isSidebarCollapsed = useSidebarCollapsed();
  const [formulario, setFormulario] = useState<any>(null);
  const router = useRouter();
  const { getFormulariosPorCliente } = useFormulario();

  useEffect(() => {
    async function load() {
      const userRaw = localStorage.getItem("user");
      if (!userRaw) return;

      const user = JSON.parse(userRaw);
      const clienteId = user.tipo === "subcliente" ? user.cliente?.id : user.id;

      const lista = await getFormulariosPorCliente(clienteId);

      const finalizado = lista?.find(
        (f: any) => f.status === "concluido" || f.finalizado
      );

      const aprovado = lista?.find(
        (f: any) => f.status === "concluido" || f.aprovado
      );

      if (aprovado) {
        setFormulario(finalizado);
        localStorage.setItem(
          "formularioRespondidoId",
          finalizado.id.toString()
        );
        localStorage.setItem(
          "formularioRespondidoIdCliente",
          finalizado.id.toString()
        );
      }
    }

    load();
  }, []);

  const navegarParaAnalise = () => {
    router.push("/cliente/relatorios/relatorioDetalhado");
  };

  const navegarParaPlanoAcao = () => {
    router.push("/cliente/relatorios/planoDeAcao");
  };

  return (
    <div className="flex">
      <Sidebar />
      <main
        className={`${
          isSidebarCollapsed ? "main-content-collapsed" : "main-content"
        } p-4`}
      >
        <h1 className="text-2xl font-bold mb-6">Relatório de Avaliação</h1>
        <div>
          {!formulario ? (
            <p className="text-gray-600">
              Nenhum formulário finalizado disponível para exibição.
            </p>
          ) : (
            <div className="formulario-card">
              <h2 className="formulario-titulo">
                {formulario.nome_formulario || "Formulário Finalizado"}
              </h2>

              <p className="formulario-atualizacao">
                Última atualização:{" "}
                {new Date(formulario.data_finalizado).toLocaleDateString()}
              </p>

              <div className="formulario-botoes">
                <button onClick={navegarParaAnalise} className="btn-orange">
                  <i className="animation"></i>Análise Técnica
                  <i className="animation"></i>
                </button>

                <button
                  onClick={navegarParaPlanoAcao}
                  className="btn-orange ml-4"
                >
                  <i className="animation"></i>Plano de Ação
                  <i className="animation"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
