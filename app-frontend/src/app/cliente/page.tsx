"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";
import { FiHome, FiFileText, FiCheckCircle, FiClock } from "react-icons/fi";
import { useFormulario } from "@/hooks/useFormulario";
import FloatingSocialMenu from "@/components/FloatingSocialMenu";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";

export default function Cliente() {
  const isSidebarCollapsed = useSidebarCollapsed();
  const [formulariosRespondidos, setFormulariosRespondidos] = useState<any>({});
  const { getFormularioRespondido, getFormulariosPorCliente } = useFormulario();
  const router = useRouter();
  const formularioId = 1;
  const [clienteId, setClienteId] = useState<number | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    if (userRaw) {
      const user = JSON.parse(userRaw);
      const id = user.tipo === "subcliente" ? user.cliente?.id : user.id;
      setClienteId(id);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const respondidos = JSON.parse(
      localStorage.getItem("formulariosEmAndamento") || "{}"
    );
    setFormulariosRespondidos(respondidos);

    const formulario = respondidos[0] || {};
    localStorage.setItem("nomeFormulario", formulario.nome);
    localStorage.setItem("statusFormulario", formulario.status);
    localStorage.setItem("formularioRespondidoId", formulario.id);
    localStorage.setItem("formularioRespondidoIdCliente", formulario.id);
  }, []);

  useEffect(() => {
    if (clienteId !== null) {
      getFormularioRespondido(formularioId, clienteId);
      getFormulariosPorCliente(clienteId).then(() => {
        const respondidos = JSON.parse(
          localStorage.getItem("formulariosEmAndamento") || "{}"
        );
        setFormulariosRespondidos(respondidos);
      });
    }
  }, [clienteId]);

  const handleFormularioClick = (
    formularios: Array<{ id: number; nome: string; status: string }>
  ) => {
    if (!formularios || formularios.length === 0) return;
    const formulario = formularios[0];
    localStorage.setItem("nomeFormulario", formulario.nome);
    localStorage.setItem("statusFormulario", formulario.status);
    const nomeFormatado = formulario.nome.toLowerCase().split(" ")[0];
    router.push(`/cliente/formulario/${nomeFormatado}`);
  };

  const getTitleClassName = (status: string) => {
    switch (status) {
      case "rascunho":
        return "formTitleRascunho";
      case "analise":
        return "formTitleAnalise";
      case "pendente":
        return "formTitlePendente";
      case "concluido":
        return "formTitleConcluido";
      default:
        return "";
    }
  };

  const getIconClassName = (status: string) => {
    switch (status) {
      case "pendente":
        return "iconPendente";
      case "analise":
      case "aguardando_analise":
        return "iconAnalise";
      case "concluido":
        return "iconConcluido";
      case "rascunho":
        return "iconRascunho";
      default:
        return "";
    }
  };

  return (
    <div className="homeCliente-container">
      <Sidebar />
      <div>
        <main
          className={
            isSidebarCollapsed ? "main-content-collapsed" : "main-content"
          }
        >
          <div className="homeCliente-inner">
            <h3 className="titulo-cfor-cliente">
              Aqui você pode acompanhar seus formulários.
            </h3>

            {Object.keys(formulariosRespondidos).length > 0 && (
              <div
                className="card-cliente-form"
                onClick={() => handleFormularioClick(formulariosRespondidos)}
              >
                {Object.entries(formulariosRespondidos).map(
                  ([id, formulario]: [string, any]) => (
                    <div key={id} className="formulario-linha">
                      {formulario.status === "analise" ||
                      formulario.status === "aguardando_analise" ? (
                        <FiClock
                          className={getIconClassName(formulario.status)}
                        />
                      ) : formulario.status === "concluido" ? (
                        <FiCheckCircle
                          className={getIconClassName(formulario.status)}
                        />
                      ) : formulario.status === "pendente" ? (
                        <FiClock
                          className={getIconClassName(formulario.status)}
                        />
                      ) : (
                        <FiFileText
                          className={getIconClassName(formulario.status)}
                        />
                      )}
                      <div className="formulario-info">
                        <h4
                          className={`formTitle ${getTitleClassName(
                            formulario.status
                          )}`}
                        >
                          {formulario.nome}
                        </h4>
                        <p>Status: {formulario.status}</p>
                        <p className="form-data">
                          Atualizado em:{" "}
                          {new Date(formulario.data).toLocaleDateString()}
                        </p>
                        {formulario.observacoes_pendencia && (
                          <span className="pendenciaDestaque">
                            Pendência: {formulario.observacoes_pendencia}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            )}

            <div className="pdf">
              <button
                className="botao-nist"
                onClick={() => setShowPdfModal(true)}
              >
                Sobre o NIST CSF
              </button>
              {isMobile && (
                <h3 className="aviso-desktop-only">
                  Obs: esta ferramenta foi desenvolvida para uso exclusivo na
                  versão desktop.
                </h3>
              )}

              {showPdfModal && (
                <div className="modal-overlay">
                  <div className="modal-content">
                    <button
                      className="modal-close"
                      onClick={() => setShowPdfModal(false)}
                    >
                      &times;
                    </button>
                    <h2 className="modal-title">Nota Técnica – NIST CSF 2.0</h2>
                    <iframe
                      src="/NotaTecnica.pdf"
                      className="modal-pdf"
                      title="PDF NIST"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="atalhos-nist">
              <div className="atalho-nist">
                <strong>📘 Documentação Completa:</strong>
                <br />
                <a
                  href="https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-53r5.pdf"
                  target="_blank"
                >
                  Abrir documento oficial
                </a>
              </div>
              <div className="atalho-nist">
                <strong>📄 Nota Técnica:</strong>
                <br />
                <a href="/NotaTecnica.pdf" download>
                  Download PDF
                </a>
              </div>
              <div className="atalho-nist">
                <strong>🌐 Site Oficial:</strong>
                <br />
                <a href="https://www.nist.gov/cyberframework" target="_blank">
                  Acessar NIST.gov
                </a>
              </div>
              <div className="atalho-nist">
                <strong>📚 Guia de Implementação:</strong>
                <br />
                <a
                  href="https://www.nist.gov/cyberframework/framework"
                  target="_blank"
                >
                  Como implementar o framework
                </a>
              </div>
            </div>
          </div>
          <FloatingSocialMenu />
        </main>
      </div>
    </div>
  );
}
