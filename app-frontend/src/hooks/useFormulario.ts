import { useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { getBaseUrl } from "@/util/baseUrl";

interface Formulario {
  status: string;
  id: number;
  nome: string;
  total?: string;
}

interface Categoria {
  id: number;
  nome: string;
  formulario: number;
}

interface Pergunta {
  id: number;
  questao: string;
  codigo: string;
  categoria: number;
  formulario: number;
}

interface Resposta {
  pergunta: number;
  politica: string;
  pratica: string;
  info_complementar?: string;
  anexos?: File | null | string;
}

interface FormularioRespondido {
  id: number;
  formulario: number;
  cliente: number;
  status: string;
  progresso: number;
  versao: number;
  criado_em: string;
  responsavel?: number;
  respostas?: {
    pergunta: number;
    politica: string;
    pratica: string;
    info_complementar?: string;
    anexos?: string | null;
  }[];
}

type NivelMaturidade =
  | "Inicial"
  | "Repetido"
  | "Definido"
  | "Gerenciado"
  | "Otimizado";

interface RespostaPergunta {
  pergunta: number; // ID da pergunta
  politica: NivelMaturidade;
  pratica: NivelMaturidade;
  info_complementar: string;
  anexos: string | null;
}

interface Pergunta {
  id: number;
  questao: string;
  codigo: string;
  resposta: RespostaPergunta | null;
}

interface Categorias {
  id: number;
  nome: string;
  perguntas: Pergunta[];
}

interface FormularioCompleto {
  id: number;
  nome: string;
  categorias: Categorias[];
}

interface FormularioEmAndamento {
  observacoes_pendencia?: any;
  id: number;
  formulario: number;
  formulario_nome: string;
  status: string;
  atualizado_em: string;
  versao: number;
  progresso: number;
}

interface FormularioEmAnaliseExibicao {
  aprovado: boolean;
  finalizado: boolean;
  data_finalizado?: string | null | Date;
  data_aprovado?: string | null | Date;
  data_resposta: ReactNode;
  status: string;
  analista_responsavel: string;
  setor: ReactNode;
  data_submissao: string | number | Date;
  prioridade: string;
  id_formulario_respondido: number;
  id_cliente: number;
  nome_cliente: string;
  id_formulario: number;
  nome_formulario: string;
}

const API_URL = `${getBaseUrl()}/form`;

export const useFormulario = () => {
  const [formularios, setFormularios] = useState<Formulario[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [perguntas, setPerguntas] = useState<Pergunta[]>([]);
  const [formularioRespondido, setFormularioRespondido] =
    useState<FormularioCompleto | null>(null);
  const [formulariosEmAndamento, setFormulariosEmAndamento] = useState<
    FormularioEmAndamento[]
  >([]);
  const [formulariosTodos, setFormulariosTodos] = useState<
    FormularioEmAnaliseExibicao[]
  >([]);
  const [loadingFormulariosTodos, setLoadingFormulariosTodos] = useState(false);
  const [errorFormulariosTodos, setErrorFormulariosTodos] = useState<
    string | null
  >(null);
  const [loadingFormulariosEmAndamento, setLoadingFormulariosEmAndamento] =
    useState(false);
  const [errorFormulariosEmAndamento, setErrorFormulariosEmAndamento] =
    useState<string | null>(null);

  const [formulariosEmAnalise, setFormulariosEmAnalise] = useState<
    FormularioEmAnaliseExibicao[]
  >([]);
  const [loadingFormulariosEmAnalise, setLoadingFormulariosEmAnalise] =
    useState(false);
  const [errorFormulariosEmAnalise, setErrorFormulariosEmAnalise] = useState<
    string | null
  >(null);

  const [formulariosConcluidos, setFormulariosConcluidos] = useState([]);
  const [loadingFormulariosConcluidos, setLoadingFormulariosConcluidos] =
    useState(false);

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  async function getFormularios() {
    try {
      getFormulariosTodos();
      const response = await axios.get(
        `${API_URL}/formularios/`,
        getAuthConfig()
      );
      setFormularios(response.data);

      response.data.forEach((formulario: { id: number; total: number }) => {
        localStorage.setItem(
          `formulario_${formulario.id}_total`,
          formulario.total.toString()
        );
      });
    } catch (error) {
      console.error("Erro ao buscar formulários:", error);
    }
  }

  const getCategoriasByFormulario = async (formularioId: number) => {
    try {
      const response = await axios.get(
        `${API_URL}/formularios/${formularioId}/categorias/`,
        getAuthConfig()
      );
      setCategorias(response.data);
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
    }
  };

  const getQuestoesByCategoria = async (categoriaId: number) => {
    try {
      const response = await axios.get(
        `${API_URL}/categorias/${categoriaId}/perguntas/`,
        getAuthConfig()
      );
      setPerguntas(response.data);
    } catch (error) {
      console.error("Erro ao buscar questões:", error);
    }
  };

  const getFormularioRespondido = async (formid: number, id: number) => {
    try {
      const formularioId = 1;
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const clienteId = user.id;

      const response = await axios.get(
        `${API_URL}/formularios/${formularioId}/clientes/${clienteId}/`,
        getAuthConfig()
      );
      console.log("response", response);
      const formulariosRespondidos = JSON.parse(
        localStorage.getItem("formulariosRespondidos") || "{}"
      );

      formulariosRespondidos[formularioId] = {
        nome: response.data.formulario?.nome,
        status: response.data.status,
        data: new Date().toISOString(),
      };

      localStorage.setItem(
        "formulariosRespondidos",
        JSON.stringify(formulariosRespondidos)
      );
      setFormularioRespondido(response.data);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar formulário respondido:", error);
      return null;
    }
  };

  const saveFormularioRespondido = async (
    respostas: Resposta[],
    status: string = "rascunho"
  ) => {
    try {
      const formularioId = 1; // NIST
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const clienteId = user.id;

      // Montagem correta do payload
      const data = {
        status,
        respostas: respostas.map((resposta) => ({
          pergunta: resposta.pergunta,
          politica: resposta.politica,
          pratica: resposta.pratica,
          info_complementar: resposta.info_complementar || "",
          anexos: resposta.anexos || null,
        })),
      };

      console.log("Enviando data para salvar respostas:", data);

      const response = await axios.post(
        `${API_URL}/formularios/${formularioId}/clientes/${clienteId}/`,
        data,
        getAuthConfig()
      );

      // Opcional: atualizar dados após salvar
      await getFormularioRespondido(Number(formularioId), clienteId);

      return response.data;
    } catch (error) {
      console.error("Erro ao salvar respostas:", error);
      throw error;
    }
  };

  const updateFormularioById = async (
    id: number,
    data: Partial<Formulario>
  ) => {
    try {
      const response = await axios.patch(
        `${API_URL}/formularios/${id}/`,
        data,
        getAuthConfig()
      );
      setFormularios((prev) =>
        prev.map((form) =>
          form.id === id ? { ...form, ...response.data } : form
        )
      );
    } catch (error) {
      console.error("Erro ao atualizar formulário:", error);
    }
  };

  const colocarEmPendencia = async (
    formularioId: number,
    categorias: string[],
    observacoes: string
  ) => {
    try {
      const categoriasTexto = categorias.length
        ? `\nCategorias com pendência: ${categorias.join(", ")}.`
        : "";

      const observacoesComCategorias = `${observacoes.trim()}${categoriasTexto}`;
      const response = await axios.post(
        `${API_URL}/formularios/${formularioId}/pendencia/`,
        { observacoes: observacoesComCategorias },
        getAuthConfig()
      );

      return response.data;
    } catch (error) {
      console.error("Erro ao colocar formulário em pendência:", error);
      throw error;
    }
  };

  useEffect(() => {
    getFormularios();
  }, []);

  const getFormulariosEmAndamento = async (clienteId: number) => {
    try {
      setLoadingFormulariosEmAndamento(true);
      setErrorFormulariosEmAndamento(null);

      const response = await axios.get(
        `${API_URL}/clientes/${clienteId}/formularios-em-andamento/`,
        getAuthConfig()
      );
      console.log("response andamentooooo", response);
      const emAndamento = response.data
        ? response.data.map((form: FormularioEmAndamento) => ({
            id: form.id,
            nome: form.formulario_nome,
            status: form.status,
            data: form.atualizado_em,
            progresso: form.progresso,
            observacoes_pendencia: form.observacoes_pendencia,
          }))
        : [];

      setFormulariosEmAndamento(emAndamento);

      // Atualiza também no localStorage se necessário
      localStorage.setItem(
        "formulariosEmAndamento",
        JSON.stringify(emAndamento)
      );
      const formulario = emAndamento[0] || {};

      localStorage.setItem("statusFormulario", formulario.status);
      localStorage.setItem("statusFormulario", formulario.status);

      return response.data;
    } catch (error) {
      console.error("Erro ao buscar formulários em andamento:", error);
      setErrorFormulariosEmAndamento(
        "Erro ao carregar formulários em andamento"
      );
      throw error;
    } finally {
      setLoadingFormulariosEmAndamento(false);
    }
  };

  const buscarFormulariosEmAnalise = async () => {
    setLoadingFormulariosEmAnalise(true);
    setErrorFormulariosEmAnalise(null);

    try {
      const response = await axios.get(
        `${API_URL}/formularios-em-analise/`,
        getAuthConfig()
      );

      const data = response.data;

      const formulariosArray: FormularioEmAnaliseExibicao[] = Object.entries(
        data
      ).map(([id, formulario]) => {
        const f = formulario as any;

        // Seleciona data de acordo com status
        let data_resposta = "";
        if (f.finalizado && f.data_finalizado) {
          data_resposta = new Date(f.data_finalizado).toLocaleDateString();
        } else if (f.aprovado && f.data_aprovado) {
          data_resposta = new Date(f.data_aprovado).toLocaleDateString();
        } else if (f.data_resposta) {
          data_resposta = new Date(f.data_resposta).toLocaleDateString();
        }

        return {
          id_formulario_respondido: parseInt(id),
          id_cliente: f.id_cliente,
          nome_cliente: f.nome_cliente,
          id_formulario: f.id_formulario,
          nome_formulario: f.nome_formulario,
          aprovado: f.aprovado,
          finalizado: f.finalizado,
          data_resposta, // já com data correta
          status: f.status ?? "",
          analista_responsavel: f.nome_analista ?? "",
          setor: f.setor ?? "",
          data_submissao: f.data_submissao ?? "",
          prioridade: f.prioridade ?? "",
          data_aprovado: f.data_aprovado
            ? new Date(f.data_aprovado).toLocaleDateString()
            : null,
          data_finalizado: f.data_finalizado
            ? new Date(f.data_finalizado).toLocaleDateString()
            : null,
        };
      });

      setFormulariosEmAnalise(formulariosArray);
      return formulariosArray;
    } catch (error: any) {
      console.error("Erro ao buscar formulários em análise:", error);
      setErrorFormulariosEmAnalise("Erro ao carregar formulários em análise.");
      return null;
    } finally {
      setLoadingFormulariosEmAnalise(false);
    }
  };

  const finalizarFormulario = async (formularioId: number) => {
    try {
      const response = await axios.post(
        `${API_URL}/formularios/${formularioId}/finalizar/`,
        {},
        getAuthConfig()
      );

      // Atualiza localStorage como finalizado
      const localData = localStorage.getItem("formularioAnaliseCompleto");
      if (localData) {
        const parsed = JSON.parse(localData);
        parsed.finalizado = true;
        localStorage.setItem(
          "formularioAnaliseCompleto",
          JSON.stringify(parsed)
        );
      }

      console.log("response.data finalizado", response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erro ao finalizar formulário:", error);

      const status = error?.response?.status;
      const detail = error?.response?.data?.detail;

      // ⚠️ Verifica se já está finalizado (erro 400 com mensagem do tipo)
      if (
        status === 400 &&
        typeof detail === "string" &&
        detail.toLowerCase().includes("já finalizado")
      ) {
        const localData = localStorage.getItem("formularioAnaliseCompleto");
        if (localData) {
          const parsed = JSON.parse(localData);
          parsed.finalizado = true;
          localStorage.setItem(
            "formularioAnaliseCompleto",
            JSON.stringify(parsed)
          );
        }

        console.warn(
          "Formulário já estava finalizado. Apenas atualizando localStorage."
        );
        return { status: "already_finalized" };
      }

      throw error;
    }
  };

  const aprovarFormulario = async (formularioId: number) => {
    try {
      const response = await axios.post(
        `${API_URL}/formularios/${formularioId}/aprovar/`,
        {},
        getAuthConfig()
      );

      // Atualiza localStorage
      const localData = localStorage.getItem("formularioAnaliseCompleto");
      if (localData) {
        const parsed = JSON.parse(localData);
        parsed.finalizado = true;
        parsed.aprovado = true;
        localStorage.setItem(
          "formularioAnaliseCompleto",
          JSON.stringify(parsed)
        );
      }

      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Erro ao aprovar formulário:", error);

      // Se o erro for "formulário já aprovado", retorna uma flag
      if (
        error.response &&
        error.response.data &&
        typeof error.response.data.detail === "string" &&
        error.response.data.detail.includes("aprovado")
      ) {
        return { success: false, alreadyApproved: true };
      }

      // Para outros erros, lança exceção
      throw error;
    }
  };

  const getFormulariosTodos = async (params: Record<string, any> = {}) => {
    setLoadingFormulariosTodos(true);
    setErrorFormulariosTodos(null);

    try {
      const response = await axios.get(
        `${API_URL}/formularios-respondidos-todos/`,
        {
          params,
          ...getAuthConfig(),
        }
      );

      console.log("Formulários em todos:", response.data);
      setFormulariosTodos(response.data); // caso use pagination
      return response.data;
    } catch (error: any) {
      console.error("Erro ao carregar todos os formulários:", error);
      setErrorFormulariosTodos("Erro ao carregar formulários.");
      throw error;
    } finally {
      setLoadingFormulariosTodos(false);
    }
  };

  const buscarFormulariosConcluidos = async () => {
    setLoadingFormulariosConcluidos(true);
    try {
      const response = await axios.get(
        `${API_URL}/formularios-concluidos-todos/`,
        getAuthConfig()
      );

      const data = response.data;

      const formulariosArray: FormularioEmAnaliseExibicao[] = Object.entries(
        data
      ).map(([id, formulario]) => {
        const f = formulario as any;

        let data_resposta = "";
        if (f.finalizado && f.data_finalizado) {
          data_resposta = new Date(f.data_finalizado).toLocaleDateString();
        } else if (f.aprovado && f.data_aprovado) {
          data_resposta = new Date(f.data_aprovado).toLocaleDateString();
        }

        return {
          id_formulario_respondido: parseInt(id),
          id_cliente: f.id_cliente,
          nome_cliente: f.nome_cliente,
          id_formulario: f.id_formulario,
          nome_formulario: f.nome_formulario,
          aprovado: f.aprovado,
          finalizado: f.finalizado,
          data_resposta,
          status: f.status ?? "",
          analista_responsavel: f.nome_analista ?? "",
          setor: f.setor ?? "",
          data_submissao: f.data_submissao ?? "",
          prioridade: f.prioridade ?? "",
          data_aprovado: f.data_aprovado
            ? new Date(f.data_aprovado).toLocaleDateString()
            : null,
          data_finalizado: f.data_finalizado
            ? new Date(f.data_finalizado).toLocaleDateString()
            : null,
        };
      });

      setFormulariosConcluidos(formulariosArray);
      return formulariosArray;
    } catch (error) {
      console.error("Erro ao buscar formulários concluídos:", error);
    } finally {
      setLoadingFormulariosConcluidos(false);
    }
  };

  const getFormulariosRecentes = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/formularios-recentes/`,
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      console.error("Erro ao carregar formulários recentes:", error);
      throw error;
    }
  };

  const getFormulariosPorCliente = async (clienteId: number) => {
    try {
      const response = await axios.get(
        `${API_URL}/clientes/${clienteId}/formularios/`,
        getAuthConfig()
      );
      console.log("Formulários do cliente (todos):", response.data);
      // await getFormulariosEmAndamento(clienteId);
      const emAndamento = response.data
        ? response.data.map((form: FormularioEmAndamento) => ({
            id: form.id,
            nome: form.formulario_nome,
            status: form.status,
            data: form.atualizado_em,
            progresso: form.progresso,
            observacoes_pendencia: form.observacoes_pendencia,
          }))
        : [];
      localStorage.setItem(
        "formulariosEmAndamento",
        JSON.stringify(emAndamento)
      );

      const formulario = emAndamento[0] || {};

      localStorage.setItem("statusFormulario", formulario.status);
      localStorage.setItem("statusFormulario", formulario.status);

      console.log("Formulário selecionado:", formulario);
      console.log("ID do formulário selecionado:", formulario.id);
      console.log("Nome do formulário selecionado:", formulario.nome);
      console.log("Status do formulário selecionado:", formulario.status);
      localStorage.setItem("nomeFormulario", formulario.nome);
      localStorage.setItem("statusFormulario", formulario.status);
      localStorage.setItem("formularioRespondidoId", formulario.id);
      localStorage.setItem("formularioRespondidoIdCliente", formulario.id);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar formulários por cliente:", error);
      throw error;
    }
  };

  useEffect(() => {
    buscarFormulariosEmAnalise();
  }, []);

  return {
    formularios,
    categorias,
    perguntas,
    formularioRespondido,
    formulariosEmAnalise,
    loadingFormulariosEmAnalise,
    errorFormulariosEmAnalise,
    formulariosEmAndamento,
    getFormularios,
    getCategoriasByFormulario,
    getQuestoesByCategoria,
    getFormularioRespondido,
    saveFormularioRespondido,
    updateFormularioById,
    getFormulariosEmAndamento,
    colocarEmPendencia,
    buscarFormulariosEmAnalise,
    finalizarFormulario,
    aprovarFormulario,
    getFormulariosRecentes,
    getFormulariosPorCliente,

    formulariosTodos,

    loadingFormulariosTodos,

    errorFormulariosTodos,

    getFormulariosTodos,
    formulariosConcluidos,
    loadingFormulariosConcluidos,
    buscarFormulariosConcluidos,
  };
};
