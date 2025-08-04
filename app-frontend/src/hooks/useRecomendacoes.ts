import { getBaseUrl } from "@/util/baseUrl";
import { useEffect, useState } from "react";
import axios from "axios";
import { useReports } from "./useReports";
import { useFormulario } from "./useFormulario";
import { Recomendacao } from "@/types/planodeAção";

interface FormData {
  nome: string;
  categoria: string;
  tecnologia: string;
  nist: string;
  prioridade: string;
  data_inicio: string;
  data_fim: string;
  meses: string;
  detalhes: string;
  investimentos: string;
  riscos: string;
  justificativa: string;
  observacoes: string;
  urgencia: string;
  gravidade: string;
  perguntaId: string;
  aplicabilidade?: string;
}

const { generateAllReports } = useReports();

const getAuthConfig = () => {
  let token = "";
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };
};

const useRecomendacoes = () => {
  const { finalizarFormulario } = useFormulario();

  const [recomendacoes, setRecomendacoes] = useState<Recomendacao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  let cliente = null;
  let formularioId = null;
  if (typeof window !== "undefined") {
    cliente = localStorage.getItem("cliente_formulario_analise_id");
    formularioId = localStorage.getItem("formularioEmAnaliseId");
  }
  const API_URL = `${getBaseUrl()}/recommendations/recomendacoes/${cliente}/${formularioId}/`;

  const fetchRecomendacoes = async (parsed?: number) => {
    const clienteId =
      typeof window !== "undefined"
        ? localStorage.getItem("cliente_formulario_analise_id")
        : null;

    const formulario = parsed
      ? parsed
      : typeof window !== "undefined"
      ? localStorage.getItem("formularioEmAnaliseId")
      : null;
    console.log("clienteId", clienteId, "formulario", formulario);
    if (!clienteId || !formulario) {
      console.log("erro");
      return;
    }

    const url = `${getBaseUrl()}/recommendations/recomendacoes/${clienteId}/${formulario}/`;

    setLoading(true);
    try {
      const response = await axios.get(url, getAuthConfig());
      setRecomendacoes(response.data);
      setError(null);
    } catch (err: any) {
      console.error("Erro ao buscar recomendações:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Erro ao buscar recomendações"
      );
    } finally {
      setLoading(false);
    }
  };

  const adicionarRecomendacao = async (dados: FormData) => {
    try {
      setLoading(true);
      const response = await axios.post(API_URL, dados, getAuthConfig());
      setRecomendacoes((prev) => [...prev, response.data]);
      return response.data;
    } catch (err: any) {
      console.error("Erro ao adicionar recomendação:", err);
      const errorMessage =
        err.response?.data?.detail ||
        Object.values(err.response?.data || {}).join("\n") ||
        "Erro ao adicionar recomendação";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const atualizarRecomendacao = async (
    id: number,
    formData: Partial<FormData>
  ) => {
    try {
      setLoading(true);
      const response = await axios.patch(
        `${getBaseUrl()}/recommendations/recomendacoes/${id}/`,
        formData,
        getAuthConfig()
      );
      setRecomendacoes((prev) =>
        prev.map((r) => (r.id === id ? response.data : r))
      );
      return response.data;
    } catch (err: any) {
      console.error("Erro ao atualizar recomendação:", err);
      const errorMessage =
        err.response?.data?.detail ||
        Object.values(err.response?.data || {}).join("\n") ||
        "Erro ao atualizar recomendação";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const removerRecomendacao = async (id: number) => {
    try {
      setLoading(true);
      await axios.delete(
        `${getBaseUrl()}/recommendations/recomendacoes/${id}/`,
        getAuthConfig()
      );
      setRecomendacoes((prev) => prev.filter((r) => r.id !== id));
    } catch (err: any) {
      console.error("Erro ao remover recomendação:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Erro ao remover recomendação"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const marcarComoConcluida = async (id: number, comprovante?: File) => {
    try {
      setLoading(true);
      const data = {
        cumprida: true,
        data_cumprimento: new Date().toISOString(),
      };

      if (comprovante) {
        data["comprovante"] = comprovante;
      }

      const response = await axios.patch(
        `${getBaseUrl()}/recommendations/recomendacoes/${id}/`,
        data,
        getAuthConfig()
      );

      setRecomendacoes((prev) =>
        prev.map((r) => (r.id === id ? response.data : r))
      );
      return response.data;
    } catch (err: any) {
      console.error("Erro ao marcar como concluída:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Erro ao marcar como concluída"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Adicione esta função no final do arquivo, antes do export
  const agruparRecomendacoesPorCategoria = (recomendacoes: Recomendacao[]) => {
    const agrupada = recomendacoes.reduce((acc, recomendacao) => {
      // Extrai o nome base da categoria (remove a sigla entre parênteses se existir)
      let categoria = recomendacao.categoria;
      if (categoria.includes("(")) {
        categoria = categoria.split("(")[0].trim();
      }

      if (!acc[categoria]) {
        acc[categoria] = [];
      }
      acc[categoria].push(recomendacao);
      return acc;
    }, {} as Record<string, Recomendacao[]>);

    return agrupada;
  };

  // Modifique o retorno do hook para incluir a função de agrupamento
  const verificarRecomendacoesFaltantes = async () => {
    console.clear();
    console.log("Salvando o relatório...");

    if (!formularioId) {
      console.warn("formularioId está indefinido ou nulo. Retornando false.");
      return false;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${getBaseUrl()}/recommendations/formularios/${formularioId}/verificar-recomendacoes/`,
        getAuthConfig()
      );
      console.log("Response da verificação:", response);

      if (response.data.pode_enviar) {
        await generateAllReports(formularioId); // apenas gera
        console.log("Relatórios gerados com sucesso");

        const finalizadoResp = await finalizarFormulario(Number(formularioId));
        console.log("Resposta da finalização:", finalizadoResp);

        if (
          finalizadoResp?.status === "already_finalized" ||
          finalizadoResp?.success ||
          finalizadoResp?.status?.toLowerCase?.().includes("sucesso") || // <-- aqui
          finalizadoResp?.message?.toLowerCase?.().includes("sucesso")
        ) {
          console.log(
            "Formulário foi finalizado com sucesso ou já estava finalizado."
          );
          return true;
        }

        console.warn("Falha ao finalizar o formulário. Retornando false.");
        return false;
      }

      console.warn("Não pode enviar recomendações. Retornando false.");
      return false;
    } catch (err: any) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.detail ||
        err?.message ||
        "";
      console.error("Erro ao verificar recomendações faltantes:", err);

      if (msg.toLowerCase().includes("já foi finalizado")) {
        console.warn("Formulário já estava finalizado. Retornando true.");
        return true;
      } else {
        const erroMsg =
          err.response?.data?.detail ||
          err.message ||
          "Erro ao verificar recomendações faltantes";
        console.error("Erro capturado e tratado:", erroMsg);
        setError(erroMsg);
        console.log("Retornando false após erro tratado.");
        return false;
      }
    } finally {
      setLoading(false);
      console.log("Finalizou verificação (finally).");
    }
  };

  useEffect(() => {
    fetchRecomendacoes();
  }, [cliente, formularioId]);

  return {
    recomendacoes,
    loading,
    error,
    recomendacoesPorCategoria: agruparRecomendacoesPorCategoria(recomendacoes),
    fetchRecomendacoes,
    adicionarRecomendacao,
    atualizarRecomendacao,
    removerRecomendacao,
    marcarComoConcluida,
    verificarRecomendacoesFaltantes,
  };
};

export default useRecomendacoes;
