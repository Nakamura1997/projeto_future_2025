"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import usePlanoAcao from "@/hooks/usePlanoAcao";
import PlanoDeAcao from "@/components/PlanoDeAcao";
import VisualizarPlano from "@/components/VisualizarPlano";
import PlanoDeAcaoReportPage from "@/components/PlanoDeAcaoReportPage";
import Modal from "@/components/Modal";
import useRecomendacoes from "@/hooks/useRecomendacoes";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";
import { Recomendacao } from "@/types/recomendacao";

interface Usuario {
  id: number;
  nome: string;
  email: string;
}

export interface PlanoDeAcao {
  id: number;
  cliente: Usuario;
  criado_por: Usuario;
  observacoes: string;
  data_criacao: string;
  data_atualizacao: string;
  recomendacoes: Recomendacao[];
  prazo?: string;
  gravidade?: string;
  urgencia?: string;
  categoria?: string;
  orcamentoMax?: string;
  formularioRespondidoId?: number | null;
}

export default function PlanoDeAcaoPage() {
  const { planos, loading, error, fetchPlanoPorFormulario } = usePlanoAcao();
  const [showModalCriar, setShowModalCriar] = useState(false);
  const [planoSelecionado, setPlanoSelecionado] = useState<number | null>(null);
  const [modoVisualizacao, setModoVisualizacao] = useState<
    "kanban" | "relatorio" | ""
  >("");
  const isSidebarCollapsed = useSidebarCollapsed();
  const [formularioId, setFormularioId] = useState<number | null>(null);
  const [plano, setPlano] = useState(null);

  const { recomendacoes, fetchRecomendacoes } = useRecomendacoes();

  useEffect(() => {
    const id = localStorage.getItem("formularioRespondidoIdCliente");
    localStorage.setItem("formularioRespondidoId", id);
    localStorage.setItem("formularioEmAnaliseId", id);
    fetchRecomendacoes(Number(id));
    setFormularioId(Number(id));
    fetchRecomendacoes(formularioId);
    setFormularioId(formularioId);
    fetchPlanoPorFormulario(formularioId);
    console.log("recomendaçoes", recomendacoes);
    if (id) {
      const parsed = parseInt(id);
      setFormularioId(parsed);
      fetchPlanoPorFormulario(parsed);
      fetchRecomendacoes(formularioId);
    }
  }, []);

  useEffect(() => {
    if (planos) {
      const plano = planos.find((plano) => plano.id === planoSelecionado);
      setPlano(plano);
      console.log("plano selecionado", plano);
    }
  }, [planos, planoSelecionado]);

  return (
    <div className="flex">
      <Sidebar />

      <main
        className={`${
          isSidebarCollapsed ? "main-content-collapsed" : "main-content"
        } p-4`}
      >
        <h1 className="text-2xl font-bold mb-4">Plano de Ação</h1>

        <button
          className="btn-orange mb-4"
          onClick={() => {
            fetchRecomendacoes(formularioId);
            setShowModalCriar(true);
          }}
        >
          + Criar novo Plano de Ação
        </button>

        {loading && <p>Carregando plano de ação...</p>}
        {!loading && planos.length > 0 && (
          <table className="tabela-planos w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Criado por</th>
                <th>Criado em</th>
                <th>Atualizado em</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {planos.map((plano) => (
                <tr key={plano.id}>
                  <td>{plano.id}</td>
                  <td>{(plano as any).cliente?.nome}</td>
                  <td>{(plano as any).criado_por?.nome}</td>
                  <td>{new Date(plano.data_criacao).toLocaleString()}</td>
                  <td>{new Date(plano.data_atualizacao).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn-action"
                      onClick={() => {
                        setPlanoSelecionado(plano.id);
                        setPlano(plano);
                        setModoVisualizacao(""); // padrão: relatório
                      }}
                    >
                      Visualizar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && !planos && (
          <p>Nenhum plano de ação encontrado para este formulário.</p>
        )}

        {showModalCriar && (
          <Modal
            isOpen={showModalCriar}
            onClose={() => setShowModalCriar(false)}
            title="Criar Novo Plano de Ação"
          >
            <PlanoDeAcao
              recomendacoes={recomendacoes}
              isAnalista={false}
              onClose={() => setShowModalCriar(false)}
            />
          </Modal>
        )}

        {planoSelecionado && (
          <Modal
            isOpen={!!planoSelecionado}
            onClose={() => setPlanoSelecionado(null)}
            title={`Visualizar Plano ${planoSelecionado}`}
          >
            <div className="modo-switch mb-2 flex gap-2 justify-center">
              <button
                className={`btn-tab ${
                  modoVisualizacao === "kanban" ? "active" : ""
                }`}
                onClick={() => setModoVisualizacao("kanban")}
              >
                Kanban
              </button>
              <button
                className={`btn-tab ${
                  modoVisualizacao === "relatorio" ? "active" : ""
                }`}
                onClick={() => setModoVisualizacao("relatorio")}
              >
                Relatório
              </button>
            </div>

            {modoVisualizacao === "kanban" ? (
              <VisualizarPlano
                planoId={planoSelecionado}
                modo="kanban"
                onClose={() => setPlanoSelecionado(null)}
                plano={plano}
              />
            ) : (
              <PlanoDeAcaoReportPage id={planoSelecionado} />
            )}
          </Modal>
        )}
      </main>
    </div>
  );
}
