import { useState, useEffect } from "react";
import axios from "axios";
import { getBaseUrl } from "@/util/baseUrl";
import { getAuthConfig } from "@/util/getAuthConfig";
import { PlanoDeAcao } from "@/types/planodeAção";



interface PlanoAcaoData {
  formularioRespondidoId: number | null;
  observacoes: string;
  recomendacoes_ordem: number[];
  prazo: string;
  gravidade: string;
  urgencia: string;
  categoria: string;
  orcamentoMax: string;
}

const usePlanoAcao = () => {
  const [planos, setPlanos] = useState<PlanoDeAcao[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plano, setPlano] = useState<PlanoDeAcao | null>(null);

  const API_URL = `${getBaseUrl()}/api/planodeacao/`;

  const fetchPlanos = async () => {
    setLoading(true);
    try {
      const authConfig = await getAuthConfig();
      const { data } = await axios.get<PlanoDeAcao[]>(API_URL, authConfig);
      setPlanos(data);
      setError(null);
    } catch (err: any) {
      console.error("Erro ao buscar planos de ação:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Erro ao buscar planos de ação"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchPlanoPorFormulario = async (formularioRespondidoId: number) => {
    setLoading(true);
    try {
      const authConfig = await getAuthConfig();
      const { data } = await axios.get<PlanoDeAcao[]>(
        `${API_URL}?formularioRespondidoId=${formularioRespondidoId}`,
        authConfig
      );

      console.log("Dados recebidos plano:", data);
      setPlano(data[0] || null);
      setPlanos(data);
      setError(null);
      return data;
    } catch (err: any) {
      console.error("Erro ao buscar plano de ação:", err);
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  const criarPlano = async (data: PlanoAcaoData) => {
    console.log("Payload enviado ao backend:", data);
    setLoading(true);
    try {
      const authConfig = await getAuthConfig();
      const response = await axios.post<PlanoDeAcao>(API_URL, data, authConfig);
      setPlanos((prev) => [...prev, response.data]);
      setError(null);
      return response.data;
    } catch (err: any) {
      console.error("Erro ao criar plano de ação:", err);
      console.log("Resposta completa do erro:", err.response?.data);
      const errorMessage =
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        "Erro ao criar plano de ação";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const atualizarKanban = async (
    planoId: number,
    colunas: { [key: string]: any[] }
  ) => {
    try {
      const authConfig = await getAuthConfig();

      const dados = Object.entries(colunas)
        .map(([status, cards]) =>
          cards.map((card: any, index: number) => ({
            plano_id: planoId,
            recomendacao_id: card.id,
            status,
            ordem: index,
          }))
        )
        .flat();

      await axios.post(`${API_URL}kanban/update/`, { dados }, authConfig);
    } catch (err) {
      console.error("Erro ao atualizar kanban:", err);
    }
  };

  useEffect(() => {
    fetchPlanos();
  }, []);

  return {
    planos,
    loading,
    error,
    plano,
    fetchPlanoPorFormulario,
    fetchPlanos,
    criarPlano,
    atualizarKanban,
  };
};

export default usePlanoAcao;
