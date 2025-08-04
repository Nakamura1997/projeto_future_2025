"use client";

import React, { useEffect, useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import usePlanoAcao from "@/hooks/usePlanoAcao";
import { PlanoDeAcao } from "@/types/planodeAção";

interface PlanoDeAcaoReportPageProps {
  id: string | number;
}

const PlanoDeAcaoReportPage: React.FC<PlanoDeAcaoReportPageProps> = ({
  id,
}) => {
  const formularioId = localStorage.getItem("formularioEmAnaliseId");

  const { planos, loading, fetchPlanoPorFormulario } = usePlanoAcao();
  const [plano, setPlano] = useState<PlanoDeAcao>();

  useEffect(() => {
    if (!formularioId) {
      const storedId = localStorage.getItem("formularioEmAnaliseId");
      console.log("storedId", storedId);
    }
  }, [formularioId]);

  useEffect(() => {
    console.log("id", id);
    const storedId = localStorage.getItem("formularioEmAnaliseId");

    if (planos) {
      console.log("plabnos", planos);
      const encontrarPlano =
        planos.find(
          (plano) => plano.formularioRespondidoId === Number(storedId)
        ) || null;
      console.log("encontrarPlano------------------>", encontrarPlano);
      setPlano(encontrarPlano);
    } else {
      fetchPlanoPorFormulario(parseInt(formularioId, 10));
    }
  }, [planos]);

  useEffect(() => {
    if (formularioId) {
      fetchPlanoPorFormulario(parseInt(formularioId, 10));
    }
  }, [formularioId]);

  if (loading) {
    return <p>Carregando plano de ação...</p>;
  }

  if (!plano) {
    return <p>Nenhum plano de ação disponível para este formulário.</p>;
  }

  const recomendacoesOrdenadas = plano.recomendacoes || [];

  return (
    <div className="reportContainer">
      <div className="header"></div>
      <div className="titleSection">
        <p className="mainTitle">PLANO DE AÇÃO</p>
        <p className="subtitle">NIST CYBERSECURITY FRAMEWORK</p>
      </div>

      <div className="observacoes-box">
        {plano.observacoes &&
          plano.observacoes.split("\n").map((p, idx) => <p key={idx}>{p}</p>)}
      </div>

      <div className="plano-acao-list">
        {recomendacoesOrdenadas.map((rec) => (
          <div key={rec.id} className="recomendacao-card">
            <div className="recomendacao-header">
              <FiAlertTriangle className="icon-alert" />
              <div className="recomendacao-titles">
                <h3>{rec.nome || rec.nist}</h3>
                <span className={`badge badge-${rec.prioridade || "na"}`}>
                  {rec.prioridade_display || "N/A"}
                </span>
              </div>
            </div>
            <div className="recomendacao-body">
              <p>
                <strong>Categoria:</strong> {rec.categoria_display || "N/A"}
              </p>
              <p>
                <strong>Aplicabilidade:</strong> {rec.aplicabilidade || "N/A"}
              </p>
              <p>
                <strong>Tecnologia:</strong> {rec.tecnologia || "N/A"}
              </p>
              <p>
                <strong>Responsável:</strong> {rec.responsavel || "N/A"}
              </p>
              <p>
                <strong>Período:</strong> {rec.data_inicio} a {rec.data_fim} (
                {rec.meses} meses)
              </p>
              <p>
                <strong>Investimentos previstos:</strong> R${" "}
                {rec.investimentos || "0,00"}
              </p>
              <p>
                <strong>Detalhes:</strong> {rec.detalhes || "Não especificado"}
              </p>
              <p>
                <strong>Riscos:</strong> {rec.riscos || "Não especificado"}
              </p>
              <p>
                <strong>Justificativa:</strong>{" "}
                {rec.justificativa || "Não especificado"}
              </p>
              <p>
                <strong>Observações:</strong>{" "}
                {rec.observacoes || "Não especificado"}
              </p>
              <p>
                <strong>Pontuação:</strong>{" "}
                {(parseInt(rec.gravidade || "0", 10) || 0) *
                  (parseInt(rec.urgencia || "0", 10) || 0)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="footer-capa">
        <p className="date">
          {new Date()
            .toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
            .toUpperCase()}
        </p>
        <p className="version">VERSÃO 1.0</p>
      </div>
    </div>
  );
};

export default PlanoDeAcaoReportPage;
