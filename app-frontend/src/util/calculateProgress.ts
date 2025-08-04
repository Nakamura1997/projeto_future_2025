interface PerguntaNist {
  id?: string;
  subcategoria?: string;
  politica: string | number | null;
  pratica: string | number | null;
  tipo: string;
  subcategorias?: PerguntaNist[];
  info_complementar?: string;
}

interface Recomendacao {
  perguntaId: string;
  cumprida: boolean;
}

interface dataNist {
  categorias: Categoria[];
  subcategorias: Record<string, SubcategoriaDetalhada[]>;
  mediaEmpresa: MediaEmpresa;
}

interface Categoria {
  categoria: string;
  sigla: string;
  media: number | string;
  politica: number | string;
  pratica: number | string;
  objetivo: number | string;
  status: string;
  tipo: "CATEGORIA";
  subcategorias: (Subcategoria | Pergunta)[];
}

interface Subcategoria {
  categoria: string;
  sigla: string;
  media: string;
  politica: string;
  pratica: string;
  objetivo: string;
  status: string;
  tipo: "CATEGORIA";
  subcategorias: Pergunta[];
}

interface Pergunta {
  id: string;
  subcategoria: string;
  politica: string;
  pratica: string;
  objetivo: string;
  tipo: "PERGUNTA";
  info_complementar?: string;
}

interface SubcategoriaDetalhada {
  id: string;
  subcategoria: string;
  politica: number;
  pratica: number;
  objetivo: number;
  perguntas: PerguntaDetalhada[];
}

interface PerguntaDetalhada extends Pergunta {
  info_complementar: string;
}

interface MediaEmpresa {
  mediaTotal: number;
  mediaPolitica: number;
  mediaPratica: number;
}
export function calculateNistProgressWithRecommendations(
  data,
  recomendacoes: Recomendacao[]
): {
  totalObrigatorios: number;
  concluidos: number;
  percentual: number;
} {
  const perguntasContadas = new Set<string>();
  const perguntasConcluidas = new Set<string>(); // ✅ controla progresso único
  const detalhesControles: any[] = [];

  function processarPerguntas(perguntas: Pergunta[] | PerguntaDetalhada[]) {
    perguntas.forEach((pergunta, i) => {
      const politica =
        typeof pergunta.politica === "string"
          ? parseFloat(pergunta.politica)
          : pergunta.politica;
      const pratica =
        typeof pergunta.pratica === "string"
          ? parseFloat(pergunta.pratica)
          : pergunta.pratica;

      const politicaBaixa = politica !== null && politica < 3;
      const praticaBaixa = pratica !== null && pratica < 3;

      if (politicaBaixa || praticaBaixa) {
        perguntasContadas.add(pergunta.id);

        const recomendacoesDaPergunta = recomendacoes.filter(
          (rec) => rec.perguntaId === pergunta.id
        );

        const concluido = recomendacoesDaPergunta.length > 0;

        // ✅ Garante que só conte uma vez no progresso
        if (concluido && !perguntasConcluidas.has(pergunta.id)) {
          perguntasConcluidas.add(pergunta.id);
        }

        detalhesControles.push({
          id: pergunta.id,
          politica,
          pratica,
          politicaBaixa,
          praticaBaixa,
          recomendacoesCadastradas: recomendacoesDaPergunta.length,
          concluido,
        });
      }
    });
  }

  if (data.categorias && Array.isArray(data.categorias)) {
    data.categorias.forEach((categoria) => {
      categoria.subcategorias.forEach((subcat) => {
        if ("subcategorias" in subcat && Array.isArray(subcat.subcategorias)) {
          processarPerguntas(subcat.subcategorias as Pergunta[]);
        }
      });
    });
  }

  if (data.subcategorias && typeof data.subcategorias === "object") {
    Object.values(data.subcategorias).forEach((subcatArray) => {
      if (Array.isArray(subcatArray)) {
        subcatArray.forEach((subcat) => {
          if (subcat.perguntas && Array.isArray(subcat.perguntas)) {
            processarPerguntas(subcat.perguntas);
          }
        });
      }
    });
  }

  const totalObrigatorios = perguntasContadas.size;
  const concluidos = perguntasConcluidas.size;

  const percentual =
    totalObrigatorios === 0
      ? 100
      : Math.round((concluidos / totalObrigatorios) * 100);



  return { totalObrigatorios, concluidos, percentual };
}
