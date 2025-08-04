"use client";

import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import usePlanoAcao from "@/hooks/usePlanoAcao";

interface VisualizarPlanoProps {
  planoId: number;
  modo: "kanban";
  onClose: () => void;
  plano: any;
}

const VisualizarPlano: React.FC<VisualizarPlanoProps> = ({
  planoId,
  modo,
  onClose,
  plano,
}) => {
  const statusColunas = ["A Fazer", "Em Progresso", "Finalizado"];
  const [colunas, setColunas] = useState<{ [key: string]: any[] }>({
    "A Fazer": [],
    "Em Progresso": [],
    Finalizado: [],
  });
  const { atualizarKanban } = usePlanoAcao();
  useEffect(() => {
    if (plano?.recomendacoes?.length) {
      const novaColunas: { [key: string]: any[] } = {
        "A Fazer": [],
        "Em Progresso": [],
        Finalizado: [],
      };

      plano.recomendacoes.forEach((rec) => {
        console.log("rec", rec);
        console.log("rec status", rec.status);
        const status = rec.status || "Em Progresso"; // fallback se não tiver
        if (!novaColunas[status]) novaColunas[status] = [];
        novaColunas[status].push(rec);
      });

      Object.keys(novaColunas).forEach((coluna) => {
        novaColunas[coluna].sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
      });

      setColunas(novaColunas);
    }
  }, [plano]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;

    const origem = [...colunas[source.droppableId]];
    const destino = [...colunas[destination.droppableId]];
    const [movido] = origem.splice(source.index, 1);
    destino.splice(destination.index, 0, movido);
    atualizarKanban(planoId, {
      ...colunas,
      [source.droppableId]: origem,
      [destination.droppableId]: destino,
    });
    setColunas((prev) => ({
      ...prev,
      [source.droppableId]: origem,
      [destination.droppableId]: destino,
    }));
  };

  if (!plano) return <p>Carregando plano...</p>;

  const renderKanban = () => (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="kanban-board">
        {statusColunas.map((status) => (
          <Droppable droppableId={status} key={status}>
            {(provided) => (
              <div
                className="kanban-column"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                <h3>{status}</h3>
                {colunas[status]?.map((rec, index) => (
                  <Draggable
                    key={rec.id}
                    draggableId={String(rec.id)}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        className="card-recomendacao"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <h4>{rec.nome || rec.nist}</h4>
                        <p>
                          <strong>Categoria:</strong> {rec.categoria_display}
                        </p>
                        <p>
                          <strong>Urgência:</strong> {rec.urgencia_display}
                        </p>
                        <p>
                          <strong>Gravidade:</strong> {rec.gravidade_display}
                        </p>
                        <p>
                          <strong>Período:</strong> {rec.data_inicio} até{" "}
                          {rec.data_fim} ({rec.meses} meses)
                        </p>
                        <p>
                          <strong>Responsável:</strong> {rec.responsavel}
                        </p>
                        <p>
                          <strong>detalhes:</strong> {rec.detalhes}
                        </p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );

  return (
    <div className="visualizar-plano">
      {modo === "kanban" && renderKanban()}
    </div>
  );
};

export default VisualizarPlano;
