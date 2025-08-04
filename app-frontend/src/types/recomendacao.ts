export interface Recomendacao {
  id: number;
  cliente: number;
  formulario_respondido: number;
  analista: number;
  nome: string;
  categoria: string;
  categoria_display?: string;
  tecnologia: string;
  nist: string;
  prioridade: string;
  prioridade_display?: string;
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
  cumprida: boolean;
  data_cumprimento: string | null;
  comprovante: string | null;
  criado_em: string;
  atualizado_em: string;
  perguntaId: string;
  aplicabilidade?: string;
}

export interface FormData {
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
