// src/components/AnaliseDetail.tsx
"use client";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { useState, useEffect } from "react";
import styles from "./analises.module.css"; // Certifique-se de que o seu CSS está neste caminho
import Sidebar from "@/components/Sidebar";
import PlanoDeAcao from "@/components/PlanoDeAcao";
import Modal from "@/components/Modal";
import RelatorioModal from "@/components/RelatorioModal";

import {
  FiHome,
  FiBarChart2,
  FiFileText,
  FiPlus,
  FiX,
  FiEdit2,
  FiCheck,
  FiAlertCircle,
  FiSave,
  FiCheckCircle,
  FiCircle,
  FiEye,
  FiFilter,
} from "react-icons/fi";
import useAvaliacao from "@/hooks/useAvaliacao";
import useRecomendacoes from "@/hooks/useRecomendacoes";
import NistCsfTable from "@/components/NistTable";
import RadarNistCsf from "@/components/RadarNistCsf";
import { agruparPorCategoria } from "@/util/subCategorias";
import FormularioRecomendacao from "./FormularioRecomendacao";
import ErrorMessage from "@/components/ErrorMessage";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useFormulario } from "@/hooks/useFormulario";
import React from "react";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";
import { filterPerguntasByScore } from "@/util/filterPerguntas";
import { useSnackbar } from "@/hooks/useSnackbar";

import SubcategoryDetailTable from "./SubcategoryDetailTable";
import Relatorio from "./Relatorio";
import { modalClasses } from "@mui/material";
import { calculateNistProgressWithRecommendations } from "@/util/calculateProgress";
import usePlanoAcao from "@/hooks/usePlanoAcao";

export interface AnaliseDetailProps {
  empresaId: string;
}

interface Subcategoria {
  perguntas: any;
  subcategoria: string;
  id: string;
  nome: string;
  media: number;
  politica: number;
  pratica: number;
  objetivo: number;
  status: string;
}

interface Categoria {
  sigla: string;
  categoria: string;
  media: number;
  politica: number;
  pratica: number;
  objetivo: number;
  status: string;
}

export default function AnaliseDetail({ empresaId }: AnaliseDetailProps) {
  const isSidebarCollapsed = useSidebarCollapsed();
  const [isFormFinalizado, setIsFormFinalizado] = useState(false);

  // Estados principais mantidos em AnaliseDetail
  const [mostrarFormulario, setMostrarFormulario] = useState<string | null>(
    null
  );
  const [isFinalizando, setIsFinalizando] = useState(false);

  const { showSnackbar, SnackbarComponent } = useSnackbar();

  const [mostrarPlanoAcao, setMostrarPlanoAcao] = useState(false);

  const [subcategoria, setSubcategoria] = useState<Record<
    string,
    Subcategoria[]
  > | null>(null);
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [showRelatorioModal, setShowRelatorioModal] = useState(false);

  useEffect(() => {
    const form = JSON.parse(
      localStorage.getItem("formularioAnaliseCompleto") || "{}"
    );
    const name = form.nome_cliente;
    if (name) {
      setClienteName(name);
    }

    if (form.finalizado === true) {
      setIsFormFinalizado(true);
    } else {
      setIsFormFinalizado(false);
    }
  }, []);

  const [editandoRecomendacao, setEditandoRecomendacao] = useState<any>(null);
  const { colocarEmPendencia } = useFormulario();
  const [formData, setFormData] = useState({
    nome: "",
    categoria: "",
    tecnologia: "",
    nist: "",
    prioridade: "",
    responsavel: "",
    data_inicio: "",
    data_fim: "",
    detalhes: "",
    investimentos: "",
    riscos: "",
    justificativa: "",
    observacoes: "",
    gravidade: "",
    meses: "1",
    urgencia: "",
    perguntaId: "",
    aplicabilidade: "",
  });
  const [progressoTotal, setProgressoTotal] = useState(70);
  const [formularioRespondidoId, setFormularioRespondidoId] = useState<number>(
    Number(empresaId)
  );
  const { data, loading, error } = useAvaliacao(formularioRespondidoId);
  const {
    recomendacoes,
    recomendacoesPorCategoria,
    adicionarRecomendacao,
    atualizarRecomendacao,
    removerRecomendacao,
    verificarRecomendacoesFaltantes,
  } = useRecomendacoes();

  const [mostrarModalPendencia, setMostrarModalPendencia] = useState(false);
  const [categoriaPendente, setCategoriaPendente] = useState<string[]>([]);
  const [observacoesPendencia, setObservacoesPendencia] = useState("");
  const [filterLowScoresOnly, setFilterLowScoresOnly] = useState<{
    [key: string]: boolean;
  }>({});

  const ordemCategorias = ["GV", "ID", "PR", "DE", "RS", "RC"];
  const [clienteName, setClienteName] = useState<string | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  const [activeTab, setActiveTab] = useState<string>("GV");
  const [mostrarRelatorio, setMostrarRelatorio] = useState(false);
  useEffect(() => {}, [recomendacoesPorCategoria]);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const isCurrentlyExpanded = !!prev[id];
      const newExpandedState = {
        ...prev,
        [id]: !isCurrentlyExpanded,
      };

      if (!isCurrentlyExpanded) {
        setFilterLowScoresOnly((prevFilter) => ({
          ...prevFilter,
          [id]: true,
        }));
      }

      return newExpandedState;
    });
  };
  const { plano, fetchPlanoPorFormulario } = usePlanoAcao();

  useEffect(() => {
    const verificarPlano = async () => {
      if (formularioRespondidoId) {
        const plano = await fetchPlanoPorFormulario(formularioRespondidoId);
        console.log("plano de ação", plano);
        console.log("isFinalizando", isFormFinalizado);
        if (plano !== null && plano !== undefined) {
          setMostrarRelatorio(true);
          console.log("mostrar", mostrarRelatorio);
        } else {
          setMostrarRelatorio(false);
        }
      } else {
        setMostrarRelatorio(false);
      }
    };

    verificarPlano();
  }, [formularioRespondidoId]);

  const [totalControlesObrigatorios, setTotalControlesObrigatorios] =
    useState(0);
  const [controlesConcluidos, setControlesConcluidos] = useState(0);

  useEffect(() => {
    if (!data || !recomendacoes) return;

    const { totalObrigatorios, concluidos, percentual } =
      calculateNistProgressWithRecommendations(data, recomendacoes);

    setProgressoTotal(percentual);
    setTotalControlesObrigatorios(totalObrigatorios);
    setControlesConcluidos(concluidos);
  }, [data, recomendacoes]);

  const handleFilterLowScoresOnlyChange = (
    subcategoryId: string,
    filterState: boolean
  ) => {
    setFilterLowScoresOnly((prevFilter) => ({
      ...prevFilter,
      [subcategoryId]: filterState,
    }));
  };

  const handlerTab = (sigla: string) => {
    setActiveTab(sigla);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditarRecomendacao = (recomendacao: any) => {
    setEditandoRecomendacao(recomendacao);

    setFormData({
      nome: recomendacao.nome || "",
      categoria: recomendacao.categoria || "",
      tecnologia: recomendacao.tecnologia || "",
      nist: recomendacao.nist || "",
      prioridade: recomendacao.prioridade || "",
      responsavel: recomendacao.responsavel || "",
      data_inicio: recomendacao.data_inicio || "",
      data_fim: recomendacao.data_fim || "",
      detalhes: recomendacao.detalhes || "",
      investimentos: recomendacao.investimentos || "",
      riscos: recomendacao.riscos || "",
      justificativa: recomendacao.justificativa || "",
      observacoes: recomendacao.observacoes || "",
      gravidade: recomendacao.gravidade || "",
      meses: recomendacao.meses ? recomendacao.meses.toString() : "0",
      urgencia: recomendacao.urgencia || "",
      perguntaId: recomendacao.perguntaId || "",
      aplicabilidade: recomendacao.aplicabilidade || "", // agora seguro
    });

    // Mostrar o formulário na pergunta correta ao iniciar edição
    setMostrarFormulario(recomendacao.perguntaId);
  };

  const handleCancelForm = () => {
    setMostrarFormulario(null);
    setEditandoRecomendacao(null);
    // Opcional: Limpar formData ao cancelar
    setFormData({
      nome: "",
      categoria: "",
      tecnologia: "",
      nist: "",
      prioridade: "",
      responsavel: "",
      data_inicio: "",
      data_fim: "",
      detalhes: "",
      investimentos: "",
      riscos: "",
      justificativa: "",
      observacoes: "",
      gravidade: "",
      meses: "1",
      urgencia: "",
      perguntaId: "",
      aplicabilidade: "",
    });
  };

  const handleColocarEmPendencia = async () => {
    if (categoriaPendente.length === 0 || !observacoesPendencia.trim()) {
      alert("Selecione uma categoria e descreva a pendência");
      return;
    }

    try {
      await colocarEmPendencia(
        formularioRespondidoId,
        categoriaPendente,
        observacoesPendencia
      );

      setMostrarModalPendencia(false);
      setCategoriaPendente([]);
      setObservacoesPendencia("");
      alert("Formulário colocado em pendência com sucesso!");
    } catch (error) {
      console.error("Erro ao colocar em pendência:", error);
      alert("Erro ao processar pendência");
    }
  };

  const handleMarcarComoConcluido = async () => {
    if (confirm("Tem certeza que deseja marcar esta análise como concluída?")) {
      try {
        alert("Análise concluída com sucesso!");
      } catch (error) {
        console.error("Erro ao concluir análise:", error);
        alert("Erro ao concluir análise");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.nome ||
      !formData.categoria ||
      !formData.nist ||
      !formData.perguntaId
    ) {
      alert(
        "Preencha os campos obrigatórios: Nome, Categoria, NIST e selecione a Pergunta"
      );
      return;
    }

    try {
      if (editandoRecomendacao) {
        await atualizarRecomendacao(editandoRecomendacao.id, formData);
        setEditandoRecomendacao(null);
      } else {
        await adicionarRecomendacao(formData);
      }

      // Limpa o formulário e esconde
      setFormData({
        nome: "",
        categoria: "",
        tecnologia: "",
        nist: "",
        prioridade: "",
        responsavel: "",
        data_inicio: "",
        data_fim: "",
        detalhes: "",
        investimentos: "",
        riscos: "",
        justificativa: "",
        observacoes: "",
        gravidade: "",
        meses: "1",
        urgencia: "",
        perguntaId: "",
        aplicabilidade: "",
      });
      setMostrarFormulario(null);
    } catch (error) {
      console.error("Erro ao enviar recomendação:", error);
    }
  };

  useEffect(() => {
    if (data?.subcategorias) {
      const subcategoriasAgrupadas = agruparPorCategoria(data.subcategorias);
      setSubcategoria(subcategoriasAgrupadas);
    } else {
      setSubcategoria({});
    }
  }, [data]);

  useEffect(() => {
    if (empresaId) {
      const parsedId = Number(empresaId);
      if (!isNaN(parsedId)) {
        setFormularioRespondidoId(parsedId);
      }
    }
  }, [empresaId]);

  useEffect(() => {
    // Buscar o nome do cliente do localStorage
    const form = JSON.parse(
      localStorage.getItem("formularioAnaliseCompleto") || "{}"
    );
    const name = form.nome_cliente;
    if (name) {
      setClienteName(name);
    }
  }, []); // Removida a dependência [clienteName] para buscar apenas uma vez

  // Função para obter as subcategorias da aba ativa (usada para passar para o componente da tabela)
  const getSubcategoriasAtivas = () => {
    if (!subcategoria || !activeTab) return [];
    return subcategoria[activeTab] || [];
  };

  // Função para obter as recomendações da aba ativa (usada para passar para o componente da tabela)
  const getRecomendacoesAtivas = () => {
    return recomendacoes;
  };
  const [categoriasCompletas, setCategoriasCompletas] = useState<
    Record<string, boolean>
  >({});
  useEffect(() => {
    if (!data) return;

    const completas: Record<string, boolean> = {};

    data.categorias.forEach((categoria) => {
      const subcats = data.subcategorias[categoria.sigla] || [];

      // Verifica se TODAS têm info_complementar (ajuste a lógica conforme seus dados)
      const todasCompletas = subcats.every((sub) => {
        // Aqui você pode ajustar o campo de validação, se for outro
        return (
          sub.perguntas &&
          sub.perguntas.length > 0 &&
          sub.perguntas.some((p: any) => p?.resposta?.info_complementar)
        );
      });

      completas[categoria.sigla] = todasCompletas;
    });

    setCategoriasCompletas(completas);
  }, [data]);

  // Contar quantos controles estão abaixo de 3 (política ou prática)
  const controlesAbaixoDe3 =
    data?.categorias?.filter(
      (cat) =>
        (cat.politica !== null && cat.politica < 3) ||
        (cat.pratica !== null && cat.pratica < 3)
    ).length || 0;

  // Se considerar concluído como controles que agora estão >= 3

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-100 flex-1 main-content">
        <Sidebar />
        <div className="flex justify-center items-center w-full h-full">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-100 flex-1 main-content">
        <Sidebar />
        <div className="flex justify-center items-center w-full h-full">
          <ErrorMessage message={`Erro: ${error}`} type="error" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex min-h-screen bg-gray-100 flex-1 main-content">
        <Sidebar />
        <div className="flex justify-center items-center w-full h-full">
          <ErrorMessage message="Nenhum dado disponível" type="info" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex analise">
      <Sidebar />
      {/* isSidebarOpen não está sendo usado, mantido por compatibilidade com o código original */}
      <main
        className={`${
          isSidebarCollapsed ? "main-content-collapsed" : "main-content"
        }`}
      >
        <div className="container-avaliacao">
          <div className="tituloPagina">
            <div className="header-actions">
              <h4>
                Análise de Cybersegurança <span>{clienteName}</span>
              </h4>
              <div className="headerButtons">
                <button
                  onClick={() => setMostrarModalPendencia(true)}
                  className="btn-pendencia"
                >
                  <FiAlertCircle /> Pendência
                </button>
                <button
                  onClick={async () => {
                    setIsFinalizando(true);
                    try {
                      const sucesso = await verificarRecomendacoesFaltantes();
                      if (sucesso) {
                        setIsFormFinalizado(true);
                        showSnackbar(
                          "Relatório gerado e formulário finalizado com sucesso!",
                          "success"
                        );
                      } else {
                        showSnackbar(
                          "Erro ao gerar relatório ou finalizar formulário.",
                          "error"
                        );
                      }
                    } catch (error: any) {
                      const msg =
                        error?.response?.data?.error || error?.message || "";
                      if (msg.includes("já foi finalizado")) {
                        setIsFormFinalizado(true);
                        showSnackbar(
                          "O formulário já foi finalizado anteriormente.",
                          "success"
                        );
                      } else {
                        showSnackbar("Erro inesperado ao finalizar.", "error");
                        console.error(error);
                      }
                    } finally {
                      setIsFinalizando(false);
                    }
                  }}
                  className="btn-finalizar"
                  disabled={isFinalizando || isFormFinalizado}
                >
                  <FiSave />
                  {isFinalizando ? "Finalizando..." : "Finalizar"}
                </button>

                {isFormFinalizado && (
                  <button
                    onClick={() => setMostrarPlanoAcao(true)}
                    className="btn-preview"
                  >
                    <FiFilter /> Gerar Plano de Ação
                  </button>
                )}

                {/* <button
                  onClick={() => setShowReportModal(true)}
                  className="btn-preview"
                >
                  <FiEye /> Prévia Relatório
                </button> */}
                {mostrarRelatorio && isFormFinalizado && (
                  <button
                    onClick={() => {
                      const url = `/analista/analises/RelatorioPage/${formularioRespondidoId}?id=${formularioRespondidoId}`;
                      window.open(url, "_blank");
                    }}
                    className="btn-preview"
                  >
                    <FiEye /> Prévia Relatório
                  </button>
                )}

                {mostrarRelatorio && isFormFinalizado && (
                  <button
                    onClick={() => setShowRelatorioModal(true)}
                    className="btn-preview"
                  >
                    📄 Relatório Anexado
                  </button>
                )}
              </div>
            </div>
          </div>
          {mostrarPlanoAcao && (
            <Modal
              isOpen={mostrarPlanoAcao}
              onClose={() => setMostrarPlanoAcao(false)}
              title={`Plano de Ação ${clienteName ? `- ${clienteName}` : ""}`}
            >
              <PlanoDeAcao
                isAnalista={true}
                recomendacoes={getRecomendacoesAtivas()}
                onClose={() => setMostrarPlanoAcao(false)}
              />
            </Modal>
          )}
          <SnackbarComponent />

          {mostrarModalPendencia && (
            <div className="modal-overlay">
              <div className="modal-content">
                <div className="modal-header">
                  <h3>Adicionar Pendência</h3>
                </div>

                <div className="modal-body">
                  <div className="categorias-container">
                    <label className="title">Categoria com Pendência</label>
                    <div className="categorias-list">
                      {data.categorias.map((cat) => (
                        <label key={cat.sigla} className="categoria-item">
                          <input
                            type="checkbox"
                            value={cat.sigla}
                            checked={categoriaPendente.includes(cat.sigla)}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (categoriaPendente.includes(value)) {
                                setCategoriaPendente(
                                  categoriaPendente.filter((v) => v !== value)
                                );
                              } else {
                                setCategoriaPendente([
                                  ...categoriaPendente,
                                  value,
                                ]);
                              }
                            }}
                          />
                          <span>
                            {cat.categoria} ({cat.sigla})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Descrição da Pendência
                    </label>
                    <textarea
                      value={observacoesPendencia}
                      onChange={(e) => setObservacoesPendencia(e.target.value)}
                      placeholder="Descreva detalhadamente o que precisa ser corrigido..."
                      className="modal-textarea"
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    onClick={() => {
                      setMostrarModalPendencia(false);
                      setCategoriaPendente([]);
                      setObservacoesPendencia("");
                    }}
                    className="btn btn-cancel"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleColocarEmPendencia}
                    disabled={
                      categoriaPendente.length === 0 ||
                      !observacoesPendencia.trim()
                    }
                    className="btn btn-confirm"
                  >
                    Confirmar Pendência
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Modal de Relatório Editável */}
          {showReportModal && (
            <Relatorio data={data} onClose={() => setShowReportModal(false)} />
          )}
          <div className={`${styles.card} mb-6`}>
            <h4 className={styles.tituloSecao}>
              Análise de Performance por Subcategoria
            </h4>
            <div className="h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
              <div className="container mx-auto p-4">
                <div className="graficos">
                  <RadarNistCsf />
                  <NistCsfTable />
                </div>
              </div>
            </div>
          </div>

          {/* Seção de Avaliação por Categorias (Mantida inline ou componentizada separadamente) */}
          <div className={`${styles.card} mb-6`}>
            <h4 className={styles.tituloSecao}>Avaliação por Categorias</h4>
            <p className="mb-4">
              Médias de performance por categoria principal
            </p>

            <table className={styles.tabelaestilo}>
              <thead>
                <tr>
                  <th>Categoria</th>
                  <th>Média</th>
                  <th>Política</th>
                  <th>Prática</th>
                  <th>Objetivo</th>
                </tr>
              </thead>
              <tbody>
                {data?.categorias?.map((cat) => (
                  <tr key={cat?.sigla}>
                    <td>
                      {cat?.categoria} ({cat?.sigla})
                    </td>
                    <td
                      className={
                        cat?.media !== null && cat?.media < 3
                          ? styles.notaBaixa
                          : styles.notaAlta
                      }
                    >
                      {cat?.media?.toFixed(2)}
                    </td>
                    <td
                      className={
                        cat?.politica !== null && cat?.politica < 3
                          ? styles.notaBaixa
                          : styles.notaAlta
                      }
                    >
                      {cat?.politica?.toFixed(2)}
                    </td>
                    <td
                      className={
                        cat?.pratica !== null && cat?.pratica < 3
                          ? styles.notaBaixa
                          : styles.notaAlta
                      }
                    >
                      {cat?.pratica?.toFixed(2)}
                    </td>
                    <td>{cat?.objetivo?.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="progresso-container">
            <div className="progresso-header">
              <span className="progresso-title">Progresso geral</span>
              <span className="progresso-contador">
                {controlesConcluidos}/{totalControlesObrigatorios}
              </span>
            </div>

            <div className="barra-progresso">
              <div
                className="progresso-preenchido"
                style={{ width: `${progressoTotal}%` }}
              ></div>
            </div>

            <div className="progresso-percentual">
              {Math.round(progressoTotal)}% concluído
            </div>
          </div>
          {/* --- Seção com Abas para Categorias Detalhadas --- */}
          <div className={`${styles.card} mb-6`}>
            <h4 className={styles.tituloSecao}>
              Avaliação Detalhada por Categorias
            </h4>

            {/* Container das Abas */}
            <div className="tabContainer">
              {ordemCategorias.map((sigla) => {
                const categoria = data.categorias.find(
                  (c) => c.sigla === sigla
                );
                if (!categoria) return null;
                const completa = false;

                return (
                  <button
                    key={sigla}
                    className={`tabButton ${
                      activeTab === sigla ? "activeTab" : ""
                    }`}
                    onClick={() => handlerTab(sigla)}
                  >
                    {categoria.categoria} ({sigla}){" "}
                    {completa ? (
                      <FiCheckCircle className="ml-2" />
                    ) : (
                      <FiCircle className="ml-2 text-gray-400" />
                    )}{" "}
                  </button>
                );
              })}
            </div>
            <RelatorioModal
              isOpen={showRelatorioModal}
              onClose={() => setShowRelatorioModal(false)}
              reportId={formularioRespondidoId} // ou ID do relatório se diferente
              formularioId={formularioRespondidoId}
            />

            {/* Conteúdo da Aba Ativa - Usando o novo componente da tabela */}
            <div className="tabContent">
              {activeTab && data?.categorias && data.categorias.length > 0 && (
                <div key={activeTab}>
                  <h4 className="mb-4">
                    {
                      data.categorias.find((c) => c.sigla === activeTab)
                        ?.categoria
                    }{" "}
                    ({activeTab})
                  </h4>

                  {/* Renderiza o componente da tabela detalhada */}
                  <SubcategoryDetailTable
                    subcategories={getSubcategoriasAtivas()} // Passa as subcategorias da aba ativa
                    recomendacoes={getRecomendacoesAtivas()} // Passa as recomendações da aba ativa
                    expandedRows={expandedRows}
                    filterLowScoresOnly={filterLowScoresOnly}
                    mostrarFormulario={mostrarFormulario}
                    editandoRecomendacao={editandoRecomendacao}
                    formData={formData}
                    activeTab={activeTab}
                    categoriasData={data.categorias} // Passa os dados das categorias para contexto do formulário
                    onToggleRow={toggleRow} // Passa o handler do pai
                    onFilterLowScoresOnlyChange={
                      handleFilterLowScoresOnlyChange
                    } // Passa o novo handler do pai
                    onHandleEditarRecomendacao={handleEditarRecomendacao} // Passa o handler do pai
                    onRemoverRecomendacao={(id: string) =>
                      removerRecomendacao(Number(id))
                    } // Corrige o tipo do parâmetro
                    onSetMostrarFormulario={setMostrarFormulario} // Passa o setter do pai
                    onSubmitForm={handleSubmit} // Passa o handler do pai
                    onInputChangeForm={handleInputChange} // Passa o handler do pai
                    onCancelForm={handleCancelForm} // Passa o handler do pai
                    onSetFormData={setFormData} // Passa o setter do pai
                  />
                </div>
              )}
              {/* Mensagem se não houver categorias ou subcategorias */}
              {activeTab &&
                (!data?.categorias || data.categorias.length === 0) && (
                  <p className="text-center text-gray-500">
                    Dados de categorias não disponíveis.
                  </p>
                )}
              {activeTab &&
                data?.categorias.find((c) => c.sigla === activeTab) &&
                getSubcategoriasAtivas().length === 0 && (
                  <p className="text-center text-gray-500">
                    Nenhuma subcategoria disponível para esta categoria.
                  </p>
                )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
