"use client";

import React, { useEffect, useMemo, useState } from "react";
import { FiSave, FiFilter, FiArrowUp, FiArrowDown } from "react-icons/fi";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { useSnackbar } from "notistack";

import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import usePlanoAcao from "@/hooks/usePlanoAcao";
import { Recomendacao } from "@/types/planodeAção";

interface PlanoDeAcaoProps {
  recomendacoes: Recomendacao[];
  isAnalista?: boolean;
  onClose: () => void;
}

const SortableItem = ({
  rec,
  toggleSelect,
  checked,
}: {
  rec: Recomendacao;
  toggleSelect: (id: number) => void;
  checked: boolean;
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: rec.id });

  const style = { transform: CSS.Transform.toString(transform), transition };
  const risco =
    (parseInt(rec.urgencia || "0") || 0) *
    (parseInt(rec.gravidade || "0") || 0);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="recomendacao-card sortable-card"
    >
      <div className="recomendacao-header" {...attributes} {...listeners}>
        <input
          type="checkbox"
          checked={checked}
          onChange={() => toggleSelect(rec.id)}
        />
        <h4>{rec.nome || rec.nist}</h4>
        <span className={`badge badge-${rec.prioridade || "na"}`}>
          {rec.prioridade || "N/A"}
        </span>
      </div>
      <div className="recomendacao-body">
        <p>
          <strong>Aplica-se a:</strong> {rec.aplicabilidade || "Política"}
        </p>
        <p>
          <strong>Risco:</strong> {risco}
        </p>
        <p>
          <strong>Categoria:</strong> {rec.categoria}
        </p>
        <p>
          <strong>Tecnologia:</strong> {rec.tecnologia || "N/A"}
        </p>
        <p>
          <strong>Investimentos:</strong> {rec.investimentos || "N/A"}
        </p>
        <p>
          <strong>Detalhes:</strong> {rec.detalhes || "Não especificado"}
        </p>
      </div>
    </div>
  );
};

const PlanoDeAcao: React.FC<PlanoDeAcaoProps> = ({
  recomendacoes,
  isAnalista = true,
  onClose,
}) => {
  const [prazo, setPrazo] = useState("");
  const [gravidade, setGravidade] = useState("");
  const [urgencia, setUrgencia] = useState("");
  const [categoria, setCategoria] = useState("");
  const [orcamentoMax, setOrcamentoMax] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>(
    recomendacoes.map((rec) => rec.id)
  );

  const { enqueueSnackbar } = useSnackbar();

  const [sortField, setSortField] = useState<
    "risco" | "gravidade" | "urgencia" | "investimentos"
  >("risco");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const { criarPlano } = usePlanoAcao();

  const categorias = ["GV", "ID", "PR", "DE", "RS", "RC"];

  const calcularRisco = (rec: Recomendacao) =>
    (parseInt(rec.urgencia || "0") || 0) *
    (parseInt(rec.gravidade || "0") || 0);

  const sortByField = (a: Recomendacao, b: Recomendacao) => {
    let valA = 0,
      valB = 0;
    switch (sortField) {
      case "gravidade":
        valA = parseInt(a.gravidade || "0", 10);
        valB = parseInt(b.gravidade || "0", 10);
        break;
      case "urgencia":
        valA = parseInt(a.urgencia || "0", 10);
        valB = parseInt(b.urgencia || "0", 10);
        break;
      case "risco":
        valA = calcularRisco(a);
        valB = calcularRisco(b);
        break;
      case "investimentos":
        valA = parseInt(a.investimentos.replace(/[^\d.-]/g, "") || "0", 10);
        valB = parseInt(b.investimentos.replace(/[^\d.-]/g, "") || "0", 10);
        break;
    }
    return sortOrder === "asc" ? valA - valB : valB - valA;
  };

  const filteredRecommendations = useMemo(() => {
    return recomendacoes
      .filter((rec) => {
        if (prazo && Number(rec.meses) > Number(prazo)) return false;
        if (gravidade && Number(rec.gravidade) < Number(gravidade))
          return false;
        if (urgencia && Number(rec.urgencia) < Number(urgencia)) return false;
        if (categoria && !rec.categoria.includes(`(${categoria})`))
          return false;
        if (
          orcamentoMax &&
          Number(rec.investimentos.replace(/[^\d.-]/g, "")) >
            Number(orcamentoMax)
        )
          return false;
        return true;
      })
      .sort(sortByField);
  }, [
    recomendacoes,
    prazo,
    gravidade,
    urgencia,
    categoria,
    orcamentoMax,
    sortField,
    sortOrder,
  ]);

  const [sortedRecommendations, setSortedRecommendations] = useState<
    Recomendacao[]
  >([]);

  useEffect(() => {
    setSortedRecommendations(filteredRecommendations);
  }, [filteredRecommendations]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const storedId = localStorage.getItem("formularioRespondidoId");
    if (storedId && !isNaN(Number(storedId))) {
      setFormularioRespondidoId(Number(storedId));
    } else {
      console.warn("ID inválido");
    }
  }, []);

  const selectAll = () => {
    setSelectedIds((prev) =>
      prev.length === filteredRecommendations.length
        ? []
        : filteredRecommendations.map((rec) => rec.id)
    );
  };
  const [formularioRespondidoId, setFormularioRespondidoId] = useState<
    number | null
  >(null);

  const toggleSortOrder = () =>
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setSortedRecommendations((items) => {
      const oldIndex = items.findIndex((r) => r.id === active.id);
      const newIndex = items.findIndex((r) => r.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  };

  const handleSalvarPlano = async () => {
    try {
      await criarPlano({
        formularioRespondidoId,
        observacoes: observacoes.trim() || "Nenhuma observação",
        recomendacoes_ordem: sortedRecommendations
          .filter((rec) => selectedIds.includes(rec.id))
          .map((rec) => rec.id),
        prazo,
        gravidade,
        urgencia,
        categoria,
        orcamentoMax,
      });

      enqueueSnackbar("Plano de Ação salvo com sucesso!", {
        variant: "success",
      });
      onClose();
    } catch (error) {
      console.error(error);
      enqueueSnackbar("Erro ao salvar Plano de Ação. Veja o console.", {
        variant: "error",
      });
    }
  };

  return (
    <div className="plano-acao-wrapper">
      <div className="sidebar-filtros">
        <h4>Filtros</h4>
        {[
          { label: "Prazo máximo (meses)", value: prazo, setter: setPrazo },
          {
            label: "Gravidade mínima (1-5)",
            value: gravidade,
            setter: setGravidade,
          },
          {
            label: "Urgência mínima (1-5)",
            value: urgencia,
            setter: setUrgencia,
          },
          {
            label: "Orçamento máximo (R$)",
            value: orcamentoMax,
            setter: setOrcamentoMax,
          },
        ].map(({ label, value, setter }, idx) => (
          <label key={idx}>
            {label}
            <input
              type="number"
              value={value}
              onChange={(e) => setter(e.target.value)}
            />
          </label>
        ))}

        <label>
          Categoria NIST
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Todas</option>
            {categorias.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </label>

        <label>
          <FiFilter className="inline-icon" /> Ordenar por:
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as any)}
          >
            <option value="risco">Risco (Urgência * Gravidade)</option>
            <option value="gravidade">Gravidade</option>
            <option value="urgencia">Urgência</option>
            <option value="investimentos">Investimentos</option>
          </select>
        </label>

        <button
          type="button"
          className="btn-sort-toggle"
          onClick={toggleSortOrder}
        >
          {sortOrder === "asc" ? <FiArrowUp /> : <FiArrowDown />}{" "}
          {sortOrder === "asc" ? "Crescente" : "Decrescente"}
        </button>

        <div className="actions-footer">
          <button
            className="btn-action"
            disabled={selectedIds.length === 0}
            onClick={handleSalvarPlano}
          >
            <FiSave /> Salvar Plano de Ação
          </button>
        </div>
      </div>

      <div className="plano-acao-main">
        <h3>Observações do Plano de Ação</h3>
        <textarea
          className="textarea-word"
          value={observacoes}
          onChange={(e) => setObservacoes(e.target.value)}
          placeholder="Escreva aqui as observações gerais ou requisitos específicos..."
        />

        <div className="header-row">
          <h4>Recomendações Filtradas ({filteredRecommendations.length})</h4>
          <button onClick={selectAll} className="btn-action small">
            {selectedIds.length === filteredRecommendations.length
              ? "Desmarcar todas"
              : "Selecionar todas"}
          </button>
        </div>

        <div className="recomendacoes-scroll">
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedRecommendations.map((r) => r.id)}
              strategy={verticalListSortingStrategy}
            >
              {sortedRecommendations.map((rec) => (
                <SortableItem
                  key={rec.id}
                  rec={rec}
                  toggleSelect={toggleSelect}
                  checked={selectedIds.includes(rec.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default PlanoDeAcao;
