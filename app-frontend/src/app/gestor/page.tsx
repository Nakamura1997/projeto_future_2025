"use client";

import { useEffect, useState } from "react";
import { useFormulario } from "@/hooks/useFormulario";
import Sidebar from "@/components/Sidebar";
import FloatingSocialMenu from "@/components/FloatingSocialMenu";
import { FiHome, FiBarChart2, FiFileText, FiUsers } from "react-icons/fi";

export default function AnalistaDashboard() {
  const { getFormulariosRecentes } = useFormulario();

  const [formulariosRascunho, setFormulariosRascunho] = useState([]);
  const [formulariosEmAnaliseRecentes, setFormulariosEmAnaliseRecentes] =
    useState([]);
  const [formulariosConcluidosRecentes, setFormulariosConcluidosRecentes] =
    useState([]);

  useEffect(() => {
    getFormulariosRecentes().then((data) => {
      setFormulariosRascunho(data.rascunhos || []);
      setFormulariosEmAnaliseRecentes(data.em_analise || []);
      setFormulariosConcluidosRecentes(data.concluidos || []);
    });
  }, []);

  const renderTable = (data) => (
    <table className="table">
      <thead>
        <tr>
          <th>Cliente</th>
          <th>Formulário</th>
          <th>Status</th>
          <th>Última Atualização</th>
        </tr>
      </thead>
      <tbody>
        {data.map((formulario) => (
          <tr key={formulario.id}>
            <td>{formulario.nome_cliente || "-"}</td>
            <td>{formulario.nome_formulario || formulario.nome}</td>
            <td>
              <span className={`status-label ${formulario.status}`}>
                {formulario.status || "-"}
              </span>
            </td>
            <td>
              {formulario.atualizado_em
                ? new Date(formulario.atualizado_em).toLocaleDateString()
                : "-"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content">
        <h1 className="dashboard-title">Dashboard do Analista</h1>

        <div className="summary-row">
          <div className="summary-badge orange">
            <p>Em Rascunho</p>
            <h2>{formulariosRascunho.length}</h2>
          </div>
          <div className="summary-badge blue">
            <p>Em Análise</p>
            <h2>{formulariosEmAnaliseRecentes.length}</h2>
          </div>
          <div className="summary-badge green">
            <p>Concluídos</p>
            <h2>{formulariosConcluidosRecentes.length}</h2>
          </div>
        </div>

        <section className="section">
          <div className="section-header">
            <h2>📄 Formulários em Rascunho</h2>
            <a href="/analista/analises" className="view-all">
              Ver todos 👁️
            </a>
          </div>
          {formulariosRascunho.length > 0 ? (
            renderTable(formulariosRascunho)
          ) : (
            <p className="empty-text">Nenhum formulário em rascunho.</p>
          )}
        </section>

        <section className="section">
          <div className="section-header">
            <h2>🔍 Formulários em Análise</h2>
            <a href="/analista/analises" className="view-all">
              Ver todos 👁️
            </a>
          </div>
          {formulariosEmAnaliseRecentes.length > 0 ? (
            renderTable(formulariosEmAnaliseRecentes)
          ) : (
            <p className="empty-text">Nenhum formulário em análise.</p>
          )}
        </section>

        <section className="section">
          <div className="section-header">
            <h2>✅ Formulários Concluídos</h2>
            <a href="/analista/relatorios" className="view-all">
              Ver todos 👁️
            </a>
          </div>
          {formulariosConcluidosRecentes.length > 0 ? (
            renderTable(formulariosConcluidosRecentes)
          ) : (
            <p className="empty-text">Nenhum formulário concluído.</p>
          )}
        </section>

        <FloatingSocialMenu />
      </main>
    </div>
  );
}
