"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";
import { useFormulario } from "@/hooks/useFormulario";
import {
  FaSearch,
  FaSortAmountDownAlt,
  FaEllipsisV,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";
import { FiHome, FiBarChart2, FiFileText, FiUsers } from "react-icons/fi";
import styles from "@/styles/analises.module.css";

export default function RelatorioPage() {
  const isSidebarCollapsed = useSidebarCollapsed();
  const {
    formulariosConcluidos,
    loadingFormulariosConcluidos,
    buscarFormulariosConcluidos,
  } = useFormulario();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openActionMenuId, setOpenActionMenuId] = useState<number | null>(null);

  useEffect(() => {
    buscarFormulariosConcluidos();
  }, []);

  const filteredData = (formulariosConcluidos ?? []).filter((item) => {
    if (!item) return false;

    const search = searchTerm.toLowerCase();
    const nomeFormulario = String(item.nome_formulario ?? "").toLowerCase();
    const nomeCliente = String(item.nome_cliente ?? "").toLowerCase();

    return nomeFormulario.includes(search) || nomeCliente.includes(search);
  });

  const sortedData = React.useMemo(() => {
    let sortableItems = [...filteredData];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredData, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const goToFirstPage = () => paginate(1);
  const goToLastPage = () => paginate(totalPages);
  const goToNextPage = () =>
    currentPage < totalPages && paginate(currentPage + 1);
  const goToPreviousPage = () => currentPage > 1 && paginate(currentPage - 1);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(`.${styles.actionsDropdown}`)) {
        setOpenActionMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <main
        className={
          isSidebarCollapsed ? "main-content-collapsed" : "main-content"
        }
      >
        <div className={styles.dashboardMain}>
          <div className={styles.dashboardHeaderSection}>
            <header className={styles.dashboardHeader}>
              <h1 className={styles.dashboardTitle}>Relatórios Concluídos</h1>
            </header>
          </div>

          <section className={styles.dashboardCards}>
            <div className={styles.dashboardCard}>
              <p className={styles.dashboardCardLabel}>
                Total de Relatórios Concluídos
              </p>
              <h2 className={styles.dashboardCardValue}>
                {formulariosConcluidos.length}
              </h2>
            </div>
          </section>

          <section className={styles.dashboardTableSection}>
            <div className={styles.dashboardTableControls}>
              <div className={styles.dashboardSearchBox}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Buscar relatórios..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <button
                className={styles.btnSort}
                onClick={() => requestSort("data_resposta")}
              >
                <FaSortAmountDownAlt /> Ordenar por Data
              </button>
            </div>

            {loadingFormulariosConcluidos ? (
              <p>Carregando...</p>
            ) : (
              <>
                <table className={styles.dashboardTable}>
                  <thead>
                    <tr>
                      <th onClick={() => requestSort("nome_formulario")}>
                        Nome
                      </th>
                      <th onClick={() => requestSort("nome_cliente")}>
                        Empresa
                      </th>
                      <th>Status</th>
                      <th onClick={() => requestSort("data_finalizado")}>
                        Data Finalização
                      </th>
                      <th onClick={() => requestSort("data_aprovado")}>
                        Data Aprovação
                      </th>
                      <th>Analista</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((rel) => (
                        <tr key={rel.id_formulario_respondido}>
                          <td>
                            <strong>{rel.nome_formulario}</strong>
                          </td>
                          <td>{rel.nome_cliente}</td>
                          <td>
                            <span
                              className={`${styles.statusTag} ${styles.statusFinished}`}
                            >
                              Concluído
                            </span>
                          </td>
                          <td>{rel.data_finalizado || "-"}</td>
                          <td>{rel.data_aprovado || "-"}</td>
                          <td>{rel.analista_responsavel || "-"}</td>
                          <td>
                            <div className={styles.actionsDropdown}>
                              <button
                                className={styles.btnView}
                                onClick={() => {
                                  localStorage.setItem(
                                    "formularioRespondidoId",
                                    rel.id_formulario_respondido.toString()
                                  );
                                  localStorage.setItem(
                                    "formularioAnaliseCompleto",
                                    JSON.stringify(rel)
                                  );
                                  window.location.href = `/analista/analises/analiseDetalhada/${rel.id_formulario_respondido}`;
                                }}
                              >
                                Ver
                              </button>
                              <button
                                className={styles.btnDropdown}
                                onClick={() =>
                                  setOpenActionMenuId(
                                    openActionMenuId ===
                                      rel.id_formulario_respondido
                                      ? null
                                      : rel.id_formulario_respondido
                                  )
                                }
                              >
                                <FaEllipsisV />
                              </button>
                              {openActionMenuId ===
                                rel.id_formulario_respondido && (
                                <div className={styles.actionsMenu}>
                                  <button
                                    onClick={() => {
                                      alert(
                                        `Aprovar relatório ID ${rel.id_formulario_respondido}`
                                      );
                                      setOpenActionMenuId(null);
                                    }}
                                    className={styles.menuItem}
                                  >
                                    Aprovar
                                  </button>
                                  <button
                                    onClick={() => {
                                      alert(
                                        `Importar Word para ID ${rel.id_formulario_respondido}`
                                      );
                                      setOpenActionMenuId(null);
                                    }}
                                    className={styles.menuItem}
                                  >
                                    Importar Word
                                  </button>
                                  <button
                                    onClick={() => {
                                      alert(
                                        `Exportar Word do ID ${rel.id_formulario_respondido}`
                                      );
                                      setOpenActionMenuId(null);
                                    }}
                                    className={styles.menuItem}
                                  >
                                    Exportar Word
                                  </button>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className={styles.noResults}>
                          Nenhum relatório encontrado.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {sortedData.length > 0 && (
                  <div className={styles.paginationContainer}>
                    <button
                      onClick={goToFirstPage}
                      disabled={currentPage === 1}
                    >
                      <FaAngleDoubleLeft />
                    </button>
                    <button
                      onClick={goToPreviousPage}
                      disabled={currentPage === 1}
                    >
                      <FaAngleLeft />
                    </button>
                    <span>
                      Página {currentPage} de {totalPages}
                    </span>
                    <button
                      onClick={goToNextPage}
                      disabled={currentPage === totalPages}
                    >
                      <FaAngleRight />
                    </button>
                    <button
                      onClick={goToLastPage}
                      disabled={currentPage === totalPages}
                    >
                      <FaAngleDoubleRight />
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
