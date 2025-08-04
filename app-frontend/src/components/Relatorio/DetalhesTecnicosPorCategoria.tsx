"use client";

import { useMemo } from "react";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { DATA_CATEGORIAS } from "@/util/dataRelatorio";

interface CategoriaDetalhesProps {
  data: any;
}

export default function DetalhesTecnicosPorCategoria({
  data,
}: CategoriaDetalhesProps) {
  // Organiza as categorias na ordem do NIST CSF 2.0
  const categoriasOrdenadas = useMemo(() => {
    if (!data?.categorias) return [];
    const ordem = ["GV", "ID", "PR", "DE", "RS", "RC"];
    return [...data.categorias].sort(
      (a, b) => ordem.indexOf(a.sigla) - ordem.indexOf(b.sigla)
    );
  }, [data]);

  const categoriaCores = {
    GV: "laranja",
    ID: "azul",
    PR: "roxo",
    DE: "amarelo",
    RS: "vermelho",
    RC: "verde",
  };

  const getCategoriaColor = (sigla, transparente = false) => {
    const cores = {
      GV: transparente ? "rgba(255, 165, 0, 0.2)" : "orange", // Laranja
      ID: transparente ? "rgba(0, 0, 255, 0.2)" : "blue", // Azul
      PR: transparente ? "rgba(128, 0, 128, 0.2)" : "purple", // Roxo
      DE: transparente ? "rgba(255, 255, 0, 0.2)" : "yellow", // Amarelo
      RS: transparente ? "rgba(255, 0, 0, 0.2)" : "red", // Vermelho
      RC: transparente ? "rgba(0, 128, 0, 0.2)" : "green", // Verde
    };
    return (
      cores[sigla] ||
      (transparente ? "rgba(240, 212, 240, 0.2)" : "rgb(240, 212, 240)")
    );
  };
  // Função para determinar o status com base na média
  const getStatus = (media: number) => {
    if (media < 2)
      return {
        texto: "Crítico",
        classe: "critico",
        icone: <FiAlertTriangle />,
      };
    if (media < 3)
      return {
        texto: "Insuficiente",
        classe: "insuficiente",
        icone: <FiAlertTriangle />,
      };
    if (media < 4)
      return {
        texto: "Adequado",
        classe: "adequado",
        icone: <FiCheckCircle />,
      };
    return { texto: "Avançado", classe: "avancado", icone: <FiCheckCircle /> };
  };

  const getLowScoreControls = (categoriaSigla: string) => {
    console.log("data", data);
    return [];
  };

  // Extrai os dados do NIST (GV, ID, PR, etc.) do objeto importado
  const getNistData = (sigla: string) => {
    return DATA_CATEGORIAS[sigla as keyof typeof DATA_CATEGORIAS];
  };

  const getProgressBarColor = (value: number) => {
    if (value < 2) return "#FF3D57"; // Vermelho para crítico
    if (value < 3) return "#FF9F43"; // Laranja para insuficiente
    if (value < 4) return "#28C76F"; // Verde para adequado
    return "#00CFE8"; // Azul para avançado
  };

  const ScoreBar = ({ score }) => {
    const percentage = (score / 5) * 100;
    const isLowScore = score < 3;

    return (
      <div className="score-bar-container">
        <div
          className="score-bar"
          style={{
            width: `${percentage}%`,
            backgroundColor: isLowScore ? "#FF6B35" : "#4CB944",
          }}
        ></div>
        <span className="score-value">{score.toFixed(2)}</span>
      </div>
    );
  };

  return (
    <div className="detalhes-tecnicos">
      {categoriasOrdenadas.map((categoria: any, index) => {
        const status = getStatus(categoria.media);
        const nistData = getNistData(categoria.sigla);
        const categoriaColor = getCategoriaColor(categoria.sigla);

        const tdCategoriaStyle = {
          backgroundColor: getCategoriaColor(categoria.sigla, true), // Versão transparente
          width: "200px",
          borderLeft: `4px solid ${getCategoriaColor(categoria.sigla)}`, // Borda com a cor sólida
          fontWeight: "bold",
        };

        const lowScoreTableStyle = {
          borderColor: categoriaColor,
          "--categoria-color": categoriaColor, // CSS custom property
        };
        return (
          <section
            key={categoria.sigla}
            id={categoria.sigla}
            className="report-page"
          >
            {index === 0 && (
              <h4 style={{ marginTop: 0 }}>CSF – Cybersecurity Framework</h4>
            )}
            <div className="categoria-detalhes">
              <div className="categoria-header">
                <h2>
                  {categoria.sigla} - {categoria.categoria}
                  <span className={`status ${status.classe}`}>
                    {status.icone} {status.texto} (Média:{" "}
                    {categoria.media.toFixed(2)})
                  </span>
                </h2>
                {/* Introdução da categoria (do NIST) */}
                {nistData?.introducao && (
                  <div className="introducao-categoria">
                    <p>{nistData.introducao}</p>
                  </div>
                )}
                {/* Lista ordenada das definições (se existir) */}
                {nistData?.definicao_list && (
                  <div className="definicao-lista">
                    <ul>
                      {nistData.definicao_list
                        .split("\n")
                        .map((item: string, index: number) => {
                          if (!item.trim()) return null;

                          // Divide o texto no primeiro ":"
                          const parts = item.split(":");
                          const firstPart = parts[0]; // Texto antes do ":"
                          const rest = parts.slice(1).join(":"); // Texto depois do ":"

                          return (
                            <li key={index}>
                              <strong>{firstPart}:</strong>
                              {rest}
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                )}
                <div className="introducao-categoria">
                  <p>{nistData?.texto}</p>
                </div>
              </div>
              <br />
              <br />
              <div className="score-section">
                <p className="score-text">
                  O score médio medido nesta categoria foi:
                </p>

                {/* Tabela de scores */}
                <table className="score-table">
                  <tbody>
                    <tr>
                      <td rowSpan={2} style={tdCategoriaStyle}>
                        <strong>
                          {categoria.categoria.toUpperCase()} ({categoria.sigla}
                          )
                        </strong>
                      </td>

                      <td className="td-politica">Política</td>
                      <td>
                        <ScoreBar score={categoria.politica} />
                      </td>
                    </tr>
                    <tr>
                      <td>Prática</td>
                      <td>
                        <ScoreBar score={categoria.pratica} />
                      </td>
                    </tr>
                  </tbody>
                </table>
                {/* Filtra subcategorias com média < 3 */}
                {categoria.subcategorias &&
                  categoria.subcategorias.filter(
                    (sub: any) => parseFloat(sub.media) < 3
                  ).length > 0 && (
                    <>
                      <div
                        className="low-score-table"
                        style={{
                          ...lowScoreTableStyle,
                        }}
                      >
                        <table>
                          <thead>
                            <tr
                              style={{
                                backgroundColor: getCategoriaColor(
                                  categoria.sigla,
                                  true
                                ),
                                color: categoriaColor,
                              }}
                            >
                              <th>Controle</th>
                              <th>Subcategoria</th>
                              <th>Política</th>
                              <th>Prática</th>
                            </tr>
                          </thead>
                          <tbody>
                            {categoria.subcategorias
                              .filter((sub: any) => parseFloat(sub.media) < 3)
                              .map((sub: any, index: number) => (
                                <tr
                                  key={index}
                                  style={
                                    index % 2 === 0
                                      ? {
                                          backgroundColor: getCategoriaColor(
                                            categoria.sigla,
                                            true
                                          ),
                                        }
                                      : {}
                                  }
                                >
                                  <td>{sub.sigla}</td>
                                  <td>{sub.categoria}</td>
                                  <td>{parseFloat(sub.politica).toFixed(1)}</td>
                                  <td>{parseFloat(sub.pratica).toFixed(1)}</td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}

                {categoria.subcategorias && (
                  <>
                    {/* Encontrar todos os controles com política ou prática abaixo de 3 */}
                    {(() => {
                      const lowScoreControls = categoria.subcategorias.flatMap(
                        (sub) =>
                          sub.subcategorias?.filter(
                            (control) =>
                              parseFloat(control.politica) < 3 ||
                              parseFloat(control.pratica) < 3
                          ) || []
                      );

                      if (lowScoreControls.length > 0) {
                        return (
                          <>
                            <p className="low-score-text">
                              De todos os controles desta capacidade,{" "}
                              <strong>
                                {lowScoreControls.length} controles
                              </strong>{" "}
                              possuem score menor que 3 e, portanto, foram
                              avaliados controles internos, procedimentos e
                              políticas a serem aplicadas nestes controles com o
                              objetivo de melhorar o nível de maturidade.
                            </p>

                            <div
                              className="low-score-table"
                              style={{
                                ...lowScoreTableStyle,
                              }}
                            >
                              <table>
                                <thead>
                                  <tr
                                    style={{
                                      backgroundColor: getCategoriaColor(
                                        categoria.sigla,
                                        true
                                      ),
                                      color: categoriaColor,
                                    }}
                                  >
                                    <th>ID Controle</th>
                                    <th>Descrição</th>
                                    <th>Política</th>
                                    <th>Prática</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {lowScoreControls.map(
                                    (control: any, index: number) => (
                                      <tr
                                        key={control.id}
                                        style={
                                          index % 2 === 0
                                            ? {
                                                backgroundColor:
                                                  getCategoriaColor(
                                                    categoria.sigla,
                                                    true
                                                  ),
                                              }
                                            : {}
                                        }
                                      >
                                        <td>{control.id}</td>
                                        <td>{control.subcategoria}</td>
                                        <td>
                                          <span
                                            style={{
                                              color:
                                                parseFloat(control.politica) < 3
                                                  ? "red"
                                                  : "inherit",
                                            }}
                                          >
                                            {parseFloat(
                                              control.politica
                                            ).toFixed(1)}
                                          </span>
                                        </td>
                                        <td>
                                          <span
                                            style={{
                                              color:
                                                parseFloat(control.pratica) < 3
                                                  ? "red"
                                                  : "inherit",
                                            }}
                                          >
                                            {parseFloat(
                                              control.pratica
                                            ).toFixed(1)}
                                          </span>
                                        </td>
                                      </tr>
                                    )
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </>
                        );
                      }
                      return null;
                    })()}
                  </>
                )}
              </div>
              <br />
              <br />
              <br />
              <br />

              {/* Subcategorias e controles (do NIST) */}
              {nistData?.subcategorias && (
                <div className="subcategorias-nist">
                  {Object.entries(nistData.subcategorias).map(
                    ([subcatKey, subcat]: [string, any]) => (
                      <div key={subcatKey} className="subcategoria">
                        <h4>
                          {subcatKey} - {subcat.descricao}
                        </h4>
                        <ul>
                          {Object.entries(subcat)
                            .filter(([key]) => key.startsWith(subcatKey)) // Filtra apenas os controles (ex: GV.OC-01)
                            .map(
                              ([controleKey, descricao]: [string, string]) => (
                                <li key={controleKey}>
                                  <strong>{controleKey}</strong>: {descricao}
                                </li>
                              )
                            )}
                        </ul>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
