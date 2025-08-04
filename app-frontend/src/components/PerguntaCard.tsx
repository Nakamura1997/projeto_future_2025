import React, { useEffect, useState } from "react";
import { FiPlus, FiX, FiEdit2, FiEye, FiPaperclip } from "react-icons/fi"; // Added FiPaperclip
import FormularioRecomendacao from "./FormularioRecomendacao";

// Importe seus estilos CSS Modules se PerguntaCard tiver estilos específicos
// import styles from './PerguntaCard.module.css'; // Exemplo

// Adicionando um tipo básico para Anexo para clareza (ajuste se necessário)
interface Anexo {
  id: string;
  nome: string;
  url: string; // Ou outro campo que aponte para o arquivo
}

interface Pergunta {
  id: string;
  subcategoria: string;
  politica: number | null;
  pratica: number | null;
  info_complementar: string | null;
  anexos?: Anexo[]; // Assumindo que a pergunta pode ter um array de anexos
  // outras propriedades da pergunta...
}

interface PerguntaCardProps {
  pergunta: Pergunta; // Usando o tipo Pergunta mais específico
  recomendacoes: any[]; // Recomendações específicas para esta pergunta
  mostrarFormulario: string | null; // ID da pergunta cujo formulário está visível
  editandoRecomendacao: any; // Recomendação sendo editada
  formData: any; // Dados do formulário
  activeTab: string; // Aba ativa (para contexto no formulário)
  categoriasData: any[]; // Dados das categorias (para contexto no formulário)

  // Funções de interação (passadas do componente pai/AnaliseDetail)
  onHandleEditarRecomendacao: (recomendacao: any) => void;
  onRemoverRecomendacao: (id: string) => void; // Assumindo ID como string
  onSetMostrarFormulario: (perguntaId: string | null) => void;
  onSubmitForm: (e: React.FormEvent) => Promise<void>;
  onInputChangeForm: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onCancelForm: () => void; // Função para cancelar o formulário
  onSetFormData: (data: any) => void; // Função para atualizar o formData no pai
  onViewRecomendacao: (recomendacao: any) => void; // Added: Handler to view recommendation details in a modal
  onViewAnexos: (perguntaId: string, anexos: Anexo[] | undefined) => void; // Added: Handler to view attachments
}

const PerguntaCard: React.FC<PerguntaCardProps> = ({
  pergunta,
  recomendacoes,
  mostrarFormulario,
  editandoRecomendacao,
  formData,
  activeTab,
  categoriasData,
  onHandleEditarRecomendacao,
  onRemoverRecomendacao,
  onSetMostrarFormulario,
  onSubmitForm,
  onInputChangeForm,
  onCancelForm,
  onSetFormData,
  onViewRecomendacao,
  onViewAnexos, // Destructure the new prop
}) => {
  const handleAddRecomendacaoClick = () => {
    onSetFormData((prev: any) => ({
      ...prev,
      // Garante que a categoria e perguntaId estão corretos ao adicionar
      categoria:
        categoriasData.find((c) => c.sigla === activeTab)?.categoria +
        " (" +
        activeTab +
        ")",
      perguntaId: pergunta.id,
      // Preenche o NIST com a sigla da categoria ativa
      nist: activeTab,
    }));
    // Usa o pergunta.id para mostrar o formulário específico desta pergunta
    onSetMostrarFormulario(pergunta.id);
  };

  // Lógica para determinar a cor da borda e o estilo da nota
  const isLowNote = (note: number | null) => note !== null && note < 3;
  const shouldApplyRedBorder =
    isLowNote(pergunta.politica) || isLowNote(pergunta.pratica);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Get user data from localStorage
    const userDataString = localStorage.getItem("user");
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        setUserRole(userData.role);
      } catch (error) {
        console.error("Failed to parse user data from localStorage:", error);
      }
    }
  }, []);

  const isCliente = userRole === "cliente";

  // Determina a classe da borda
  const borderClass = shouldApplyRedBorder
    ? "pergunta-card--border-red"
    : "pergunta-card--border-blue";

  // Verifica se existem anexos para esta pergunta
  const hasAnexos = pergunta.anexos && pergunta.anexos.length > 0;

  return (
    // Aplica a classe base e a classe condicional da borda
    <div key={pergunta.id} className={`pergunta-card ${borderClass}`}>
      <div className="pergunta-header">
        {/* ID e Texto agora lado a lado no header flex */}
        <span className="pergunta-id">{pergunta.id}</span>
        <h5 className="pergunta-texto">{pergunta.subcategoria}</h5>
      </div>

      {/* Container aprimorado para Notas, Info Complementares e Anexos */}
      <div className="pergunta-info-notas">
        {/* Notas */}
        <div className="pergunta-notas-scores">
          <span
            className={` ${
              isLowNote(pergunta.politica) ? "nota--low" : "nota"
            }`}
          >
            Política:{" "}
            <span className="nota-valor">{pergunta.politica ?? "-"}</span>{" "}
            {/* Use ?? '-' para mostrar '-' se for null */}
          </span>
          <span
            className={`${isLowNote(pergunta.pratica) ? "nota--low" : "nota"}`}
          >
            Prática:{" "}
            <span className="nota-valor">{pergunta.pratica ?? "-"}</span>
          </span>
        </div>

        {/* Informações Complementares */}
        <div className="informacoes-complementares">
          <span className="informacoes-label">Informações complementares:</span>
          <span className="informacoes-texto">
            {pergunta.info_complementar?.trim()
              ? pergunta.info_complementar
              : "Não informado."}
          </span>
        </div>

        {/* Botão de Anexos */}
        <div className="pergunta-anexos">
          <button
            className="btn-anexos"
            onClick={() => onViewAnexos(pergunta.id, pergunta.anexos)}
            disabled={!hasAnexos} // Desabilita se não houver anexos
          >
            <FiPaperclip />{" "}
            {hasAnexos
              ? `Ver anexos (${pergunta.anexos!.length})`
              : "Sem anexos"}
          </button>
        </div>
      </div>

      {/* Recomendações para esta pergunta */}
      <div className="recomendacoes-section">
        <h6>Recomendações</h6>
        <div className="recomendacoes-grid"></div>
        {recomendacoes.length > 0 ? (
          <div className="recomendacoes-grid">
            {recomendacoes.map((rec) => (
              <div key={rec.id} className="recomendacao-card">
                <div className="recomendacao-header">
                  <h5 className="recomendacao-titulo">{rec.nome}</h5>
                  <div className="recomendacao-meta">
                    <span
                      className={`recomendacao-prioridade prioridade-${rec.prioridade?.toLowerCase()}`}
                    >
                      {rec.prioridade_display || rec.prioridade}
                    </span>
                  </div>
                </div>

                <div className="recomendacao-content">
                  <div className="recomendacao-detalhes">
                    <p>
                      <strong>Aplica-se a:</strong>{" "}
                      {rec.aplicabilidade || "Não informado"}
                    </p>

                    <p>
                      <strong>Categoria:</strong> {rec.categoria}
                    </p>
                    <p>
                      <strong>Tecnologia:</strong> {rec.tecnologia}
                    </p>
                    <p>
                      <strong>NIST:</strong> {rec.nist}
                    </p>
                    <p>
                      <strong>Investimentos Previsto:</strong>{" "}
                      {Number(rec.investimentos).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </p>
                  </div>

                  <div className="recomendacao-descricao">
                    <h6>Detalhes:</h6>
                    <p>{rec.detalhes}</p>
                  </div>

                  <div className="recomendacao-riscos">
                    <h6>Riscos:</h6>
                    <p>{rec.riscos}</p>
                  </div>

                  <div className="recomendacao-justificativa">
                    <h6>Justificativa:</h6>
                    <p>{rec.justificativa}</p>
                  </div>

                  {rec.observacoes && (
                    <div className="recomendacao-observacoes">
                      <h6>Observações:</h6>
                      <p>{rec.observacoes}</p>
                    </div>
                  )}
                </div>
                {!isCliente && (
                  <div className="recomendacao-actions">
                    <button
                      onClick={() => onHandleEditarRecomendacao(rec)}
                      className="btn-action btn-edit"
                    >
                      <FiEdit2 /> Editar
                    </button>
                    <button
                      onClick={() => onRemoverRecomendacao(rec.id)}
                      className="btn-action btn-delete"
                    >
                      <FiX /> Remover
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="sem-recomendacoes">
            Nenhuma recomendação para esta pergunta.
          </div>
        )}

        {/* Botão para adicionar nova recomendação */}
        {/* Oculta o botão se o formulário desta pergunta já estiver visível */}
        {mostrarFormulario !== pergunta.id && !isCliente &&(
          <button
            className="btn-add-recomendacao"
            onClick={handleAddRecomendacaoClick}
          >
            <FiPlus /> Adicionar Recomendação
          </button>
        )}
        {mostrarFormulario === pergunta.id && (
          <FormularioRecomendacao
            formData={formData}
            onChange={onInputChangeForm}
            onSubmit={onSubmitForm}
            onCancel={onCancelForm}
            subcategorias={categoriasData.reduce((acc, cat) => {
              acc[cat.sigla] = cat.subcategorias || [];
              return acc;
            }, {} as Record<string, any[]>)}
            isEditing={!!editandoRecomendacao}
          />
        )}
      </div>
    </div>
  );
};

export default PerguntaCard;
