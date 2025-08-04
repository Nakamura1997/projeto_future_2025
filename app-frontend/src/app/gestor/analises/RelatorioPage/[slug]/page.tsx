"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/LoadingSpinner";
import useAvaliacao from "@/hooks/useAvaliacao";
import ConteudoRelatorio from "@/components/ConteudoRelatorio";

const RelatorioPage = () => {
  const searchParams = useSearchParams();
  const formularioRespondidoId = searchParams.get("id");
  const { data, loading, error } = useAvaliacao(Number(formularioRespondidoId));

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Erro ao carregar dados</div>;
  if (!data) return <div>Nenhum dado disponível</div>;

  return (
    <div className="relatorio-full-page">
      <ConteudoRelatorio
        data={data}
        formularioRespondidoId={formularioRespondidoId}
        onClose={() => window.close()}
      />
    </div>
  );
};

export default RelatorioPage;
