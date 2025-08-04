export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: string;
}

export interface Recomendacao {
  id: number;
  cliente: number;
  formulario_respondido: number;
  analista: number;
  categoria_display: string;
  prioridade_display: string;
  urgencia_display: string;
  gravidade_display: string;
  nome: string;
  categoria: string;
  aplicabilidade: string;
  tecnologia: string;
  nist: string;
  prioridade: string;
  responsavel: string;
  data_inicio: string; 
  data_fim: string;
  meses: number;
  detalhes: string;
  investimentos: string;
  riscos: string;
  justificativa: string;
  observacoes: string;
  urgencia: string;
  gravidade: string;
  cumprida: boolean;
  data_cumprimento: string | null;
  comprovante: string | null;
  criado_em: string;
  atualizado_em: string;
  perguntaId: string;
  ordem: number;
  status: "A Fazer" | "Em Progresso" | "Concluída";
  data_alteracao: string;
}

export interface PlanoDeAcao {
  id: number;
  categoria: string;
  cliente: Usuario;
  criado_por: Usuario;
  data_criacao: string;
  data_atualizacao: string;
  formularioRespondidoId: number;
  gravidade: string;
  observacoes: string;
  orcamentoMax: string;
  prazo: string;
  urgencia: string;
  recomendacoes: Recomendacao[];
}
