"use client";

import { useState, useEffect } from "react";
import { useFormulario } from "@/hooks/useFormulario";
import {
  FiFileText,
  FiHome,
  FiBarChart2,
  FiCheckCircle,
  FiCircle,
} from "react-icons/fi";
import Sidebar from "@/components/Sidebar";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";
import RadarNistCsf from "./RadarNistCsf";
import NistCsfTable from "./NistTable";
import styles from "./analises.module.css";
import useAvaliacao, { Subcategoria } from "@/hooks/useAvaliacao";
import { AnaliseDetailProps } from "./AnaliseDetail";
import SubcategoryDetailTable from "./SubcategoryDetailTable";
import useRecomendacoes from "@/hooks/useRecomendacoes";
import ErrorMessage from "./ErrorMessage";
import LoadingSpinner from "./LoadingSpinner";
import { agruparPorCategoria } from "@/util/subCategorias";
import { useReports } from "@/hooks/useReports";
import { getBaseUrl } from "@/util/baseUrl";

export default function RelatorioCliente({ empresaId }: AnaliseDetailProps) {
  const isSidebarCollapsed = useSidebarCollapsed();

  const [formularioRespondidoId, setFormularioRespondidoId] = useState<number>(
    Number(empresaId)
  );
  const {
    generateOperationalReport,
    downloadPdfReport,
    downloadPdfReportAnexado,
    getReportByFormularioId,
  } = useReports();

  const [loadings, setLoading] = useState(false);
  const [formularioId, setFormularioId] = useState<number | null>(null);
  const [reportId, setReportId] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedFormularioId = Number(
        localStorage.getItem("formularioRespondidoId")
      );
      const storedReportId = Number(localStorage.getItem("reportId"));
      setFormularioId(storedFormularioId);
      setReportId(storedReportId);
    }
  }, []);

  const handleVerRelatorioTecnico = () => {
    // Usa a origem da URL atual (domínio e porta)
    const url = `${window.location.origin}/analista/analises/RelatorioPage/${formularioId}?id=${formularioId}`;
    window.open(url, "_blank");
  };

  const handleBaixarRelatorioTecnico = async () => {
    try {
      setLoading(true);
      await generateOperationalReport(formularioId);
      await downloadPdfReport(formularioId);
    } catch (error) {
      console.error("Erro ao baixar relatório técnico", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBaixarRelatorioExecutivo = async () => {
    try {
      setLoading(true);
      await downloadPdfReportAnexado(reportId);
    } catch (error) {
      console.error("Erro ao baixar relatório executivo", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const respondidos = JSON.parse(
      localStorage.getItem("formulariosEmAndamento") || "{}"
    );
    console.log("Formulários respondidos________________>:", respondidos);
    const formulario = respondidos[0] || {};
    setFormularioRespondidoId(formulario.id);
  }, []);

  console.log("ID do formulário respondido:", formularioRespondidoId);
  const { data, loading, error } = useAvaliacao(formularioRespondidoId);

  const finalizado = data?.finalizado || true;
  const ordemCategorias = ["GV", "ID", "PR", "DE", "RS", "RC"];
  const [activeTab, setActiveTab] = useState<string>("GV");

  const handlerTab = (sigla: string) => {
    alert(`Aba ${sigla} selecionada`);
    setActiveTab(sigla);
  };
  const [subcategoria, setSubcategoria] = useState<Record<
    string,
    Subcategoria[]
  > | null>(null);
  const [expandedRows, setExpandedRows] = useState<{ [key: string]: boolean }>(
    {}
  );

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
  // Função para atualizar o estado de filtro Low Scores Only
  const handleFilterLowScoresOnlyChange = (
    subcategoryId: string,
    filterState: boolean
  ) => {
    setFilterLowScoresOnly((prevFilter) => ({
      ...prevFilter,
      [subcategoryId]: filterState,
    }));
  };
  const {
    recomendacoes,
    recomendacoesPorCategoria,
    adicionarRecomendacao,
    atualizarRecomendacao,
    removerRecomendacao,
    verificarRecomendacoesFaltantes,
  } = useRecomendacoes();
  const [mostrarFormulario, setMostrarFormulario] = useState<string | null>(
    null
  );
  useEffect(() => {
    if (data?.subcategorias) {
      const subcategoriasAgrupadas = agruparPorCategoria(data.subcategorias);
      setSubcategoria(subcategoriasAgrupadas);
    } else {
      setSubcategoria({});
    }
  }, [data]);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const isCurrentlyExpanded = !!prev[id];
      const newExpandedState = {
        ...prev,
        [id]: !isCurrentlyExpanded,
      };

      // Se a linha está sendo expandida (de false para true)
      if (!isCurrentlyExpanded) {
        // Define o filtro padrão para mostrar apenas notas baixas para esta subcategoria
        setFilterLowScoresOnly((prevFilter) => ({
          ...prevFilter,
          [id]: true, // true significa "filtrar, mostrar apenas notas baixas"
        }));
      }
      // Opcional: Se quiser resetar o filtro ao recolher, descomente abaixo
      /*
       else {
          setFilterLowScoresOnly(prevFilter => {
             const newState = { ...prevFilter };
             delete newState[id];
             return newState;
          });
       }
       */

      return newExpandedState;
    });
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

  useEffect(() => {
    console.log("Dados da avaliação:", data);
  }, [data]); // Efeito vazio para evitar warnings de dependências não utilizadas
  // Verifica se há recomendações faltantes e atualiza o estado
  // Função para obter as subcategorias da aba ativa (usada para passar para o componente da tabela)
  const getSubcategoriasAtivas = () => {
    console.log(
      "##########################################################333"
    );

    console.log(
      "Subcategorias:********************************************************************************************************************************************",
      subcategoria
    );
    console.log(
      "ActiveTab:********************************************************************************************************************************************",
      activeTab
    );
    // console.log(subcategoria[activeTab]);
    console.log(
      "##########################################################333"
    );
    if (!subcategoria || !activeTab) return [];

    return subcategoria[activeTab] || [];
  };

  // Função para obter as recomendações da aba ativa (usada para passar para o componente da tabela)
  const getRecomendacoesAtivas = () => {
    return recomendacoes;
  };
  const [editandoRecomendacao, setEditandoRecomendacao] = useState<any>(null);

  const [filterLowScoresOnly, setFilterLowScoresOnly] = useState<{
    [key: string]: boolean;
  }>({});

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

  const handleVerRelatorioExecutivo = async () => {
    try {
      setLoading(true);
      const data = await getReportByFormularioId(formularioId);
      if (data.pdf_url) {
        const pdfUrl = `${getBaseUrl()}${data.pdf_url}`;
        const viewerUrl = `https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(
          pdfUrl
        )}`;
        window.open(viewerUrl, "_blank");
      } else {
        alert(
          "Nenhum relatório executivo anexado disponível para visualização."
        );
      }
    } catch (error) {
      console.error("Erro ao visualizar relatório executivo:", error);
      alert("Erro ao visualizar relatório executivo.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
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
    <div className="flex">
      <Sidebar />

      <main
        className={`${
          isSidebarCollapsed ? "main-content-collapsed" : "main-content"
        }`}
      >
        <h1 className="text-2xl font-bold mb-4">Relatorio Detalhado</h1>

        <h4 className="nistExplanation">
          O Framework de Cibersegurança NIST 2.0 (Cybersecurity Framework) é uma
          referência para organizações melhorarem sua postura de segurança
          cibernética, avaliando práticas de governança, identificação,
          proteção, detecção, resposta e recuperação. Este relatório mostra de
          forma clara o nível de maturidade da sua empresa em cada categoria e
          subcategoria do NIST. Segue sua avaliação
        </h4>
        <div className="header-relatorio">NIST 2.0 MATURIDADE.</div>
        <div className="reportButtons">
          <button className="reportButton" onClick={handleVerRelatorioTecnico}>
            📄 Ver Relatório
          </button>
          <button
            className="reportButton"
            onClick={handleBaixarRelatorioTecnico}
          >
            Baixar Relatório Técnico
          </button>
          <button
            className="reportButton"
            onClick={handleVerRelatorioExecutivo}
          >
            Baixar Relatório Executivo
          </button>
        </div>
        <div className="graficos">
          <RadarNistCsf />
          <NistCsfTable />
        </div>

        {finalizado && (
          <>
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

            {/* --- Seção com Abas para Categorias Detalhadas --- */}
            <div className={`${styles.card} mb-6`}>
              <h4 className={styles.tituloSecao}>
                Avaliação Detalhada por Categorias
              </h4>

              {/* Container das Abas */}
              <div className="tabContainer">
                {ordemCategorias.map((sigla) => {
                  const categoria = data?.categorias.find(
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

              {/* Conteúdo da Aba Ativa - Usando o novo componente da tabela */}
              <div className="tabContent">
                {activeTab &&
                  data?.categorias &&
                  data.categorias.length > 0 && (
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
          </>
        )}
      </main>
    </div>
  );
}
