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
import { IoMdAdd } from "react-icons/io";
import { BsDownload } from "react-icons/bs";
import styles from "@/styles/analises.module.css";
import { FiUsers } from "react-icons/fi";

const DashboardRelatorios = () => {
  const isSidebarCollapsed = useSidebarCollapsed();
  const [openActionMenuId, setOpenActionMenuId] = useState(null);

  const {
    formulariosEmAnalise,
    loadingFormulariosEmAnalise,
    formulariosTodos,
    buscarFormulariosEmAnalise,
    getFormulariosTodos,
  } = useFormulario();

  // Estados para filtros e paginação
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    getFormulariosTodos({ page: 1, ordering: "nome" });
    buscarFormulariosEmAnalise();
  }, []);

  const filteredData = (formulariosEmAnalise ?? []).filter((item) => {
    if (!item) return false; // descarta entradas nulas

    const search = searchTerm.toLowerCase();
    const status = statusFilter.toLowerCase();

    const nomeFormulario = String(item.nome_formulario ?? "").toLowerCase();
    const nomeCliente = String(item.nome_cliente ?? "").toLowerCase();
    const itemStatus = String(item.status ?? "").toLowerCase();

    const matchesSearch =
      nomeFormulario.includes(search) || nomeCliente.includes(search);

    const matchesStatus = statusFilter === "todos" || itemStatus === status;

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(`.${styles.actionsDropdown}`)) {
        setOpenActionMenuId(null);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Função para ordenar os dados
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

  // Função para solicitar ordenação
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Lógica de paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  // Função para mudar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Funções auxiliares de navegação
  const goToFirstPage = () => paginate(1);
  const goToLastPage = () => paginate(totalPages);
  const goToNextPage = () =>
    currentPage < totalPages && paginate(currentPage + 1);
  const goToPreviousPage = () => currentPage > 1 && paginate(currentPage - 1);

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <main
        className={`${
          isSidebarCollapsed ? "main-content-collapsed" : "main-content"
        }`}
      >
        <div className={styles.dashboardMain}>
          <div className={styles.dashboardHeaderSection}>
            <header className={styles.dashboardHeader}>
              <div>
                <h1 className={styles.dashboardTitle}>Análises</h1>
              </div>
            </header>
          </div>

          <section className={styles.dashboardCards}>
            <div className={styles.dashboardCard}>
              <p className={styles.dashboardCardLabel}>
                Total de Relatórios em Analise
              </p>
              <h2 className={styles.dashboardCardValue}>
                {formulariosEmAnalise.length}
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
                    setCurrentPage(1); // Resetar para a primeira página ao pesquisar
                  }}
                />
              </div>
              <div className={styles.dashboardFilterBox}>
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1); // Resetar para a primeira página ao filtrar
                  }}
                >
                  <option value="todos">Todos os status</option>
                  <option value="Finalizado">Analisados</option>
                  <option value="Em progresso">Em progresso</option>
                </select>
                <button
                  className={styles.btnSort}
                  onClick={() => requestSort("data_resposta")}
                >
                  <FaSortAmountDownAlt /> Ordenar por Data
                </button>
              </div>
            </div>

            <div className={styles.tableDescription}>
              Lista de todos os relatórios de análise de cibersegurança.
              {searchTerm || statusFilter !== "todos" ? (
                <span className={styles.filterInfo}>
                  (Filtrado: {filteredData.length} itens encontrados)
                </span>
              ) : null}
            </div>

            {loadingFormulariosEmAnalise ? (
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
                      <th onClick={() => requestSort("status")}>Status</th>
                      <th onClick={() => requestSort("data_finalizado")}>
                        Data Finalização
                      </th>
                      <th onClick={() => requestSort("data_aprovado")}>
                        Data Aprovação
                      </th>
                      <th onClick={() => requestSort("analista")}>Analista</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map(
                        (rel) => (
                          console.log("rell", rel),
                          (
                            <tr key={rel.id_formulario_respondido}>
                              <td>
                                <strong>{rel.nome_formulario}</strong>
                              </td>
                              <td>{rel.nome_cliente}</td>

                              <td>
                                {rel.aprovado ? (
                                  <span
                                    className={`${styles.statusTag} ${styles.statusApproved}`}
                                  >
                                    Aprovado Supervisor
                                  </span>
                                ) : rel.finalizado ? (
                                  <span
                                    className={`${styles.statusTag} ${styles.statusFinished}`}
                                  >
                                    Finalizado Análise
                                  </span>
                                ) : (
                                  <span
                                    className={`${styles.statusTag} ${styles.statusProgress}`}
                                  >
                                    Em Progresso
                                  </span>
                                )}
                              </td>

                              <td>
                                {rel.data_finalizado
                                  ? rel.data_finalizado instanceof Date
                                    ? rel.data_finalizado.toLocaleDateString()
                                    : rel.data_finalizado
                                  : "-"}
                              </td>
                              <td>
                                {rel.data_aprovado
                                  ? rel.data_aprovado instanceof Date
                                    ? rel.data_aprovado.toLocaleDateString()
                                    : rel.data_aprovado
                                  : "-"}
                              </td>
                              <td>{rel.analista_responsavel}</td>
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
                                    name="btnDropdown"
                                    className={styles.btnDropdown}
                                    aria-label="Abrir menu de ações"
                                    title="Mais opções"
                                    onClick={() =>
                                      setOpenActionMenuId(
                                        openActionMenuId ===
                                          rel.id_formulario_respondido
                                          ? null
                                          : rel.id_formulario_respondido
                                      )
                                    }
                                  >
                                    <FaEllipsisV
                                      aria-hidden="true"
                                      focusable="false"
                                    />
                                  </button>

                                  {openActionMenuId ===
                                    rel.id_formulario_respondido && (
                                    <div
                                      className={styles.actionsMenu}
                                      role="menu"
                                      aria-label="Menu de ações"
                                    >
                                      <button
                                        onClick={() => {
                                          alert(
                                            `Aprovar relatório ID ${rel.id_formulario_respondido}`
                                          );
                                          setOpenActionMenuId(null);
                                        }}
                                        className={styles.menuItem}
                                        role="menuitem"
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
                                        role="menuitem"
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
                                        role="menuitem"
                                      >
                                        Exportar Word
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )
                        )
                      )
                    ) : (
                      <tr>
                        <td className={styles.noResults}>
                          Nenhum resultado encontrado com os filtros atuais.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Paginação */}
                {filteredData.length > 0 && (
                  <div className={styles.paginationContainer}>
                    <div className={styles.itemsPerPageSelector}>
                      <span>Itens por página:</span>
                      <select
                        value={itemsPerPage}
                        onChange={(e) => {
                          setItemsPerPage(Number(e.target.value));
                          setCurrentPage(1); // Resetar para a primeira página ao mudar o tamanho
                        }}
                        className={styles.pageSizeSelect}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={30}>30</option>
                        <option value={50}>50</option>
                      </select>
                    </div>

                    <div className={styles.pagination}>
                      <button
                        onClick={goToFirstPage}
                        disabled={currentPage === 1}
                        className={styles.pageButton}
                        title="Primeira página"
                      >
                        <FaAngleDoubleLeft />
                      </button>
                      <button
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1}
                        className={styles.pageButton}
                        title="Página anterior"
                      >
                        <FaAngleLeft />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (number) => (
                          <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`${styles.pageButton} ${
                              currentPage === number ? styles.activePage : ""
                            }`}
                          >
                            {number}
                          </button>
                        )
                      )}

                      <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages}
                        className={styles.pageButton}
                        title="Próxima página"
                      >
                        <FaAngleRight />
                      </button>
                      <button
                        onClick={goToLastPage}
                        disabled={currentPage === totalPages}
                        className={styles.pageButton}
                        title="Última página"
                      >
                        <FaAngleDoubleRight />
                      </button>
                    </div>

                    <div className={styles.pageInfo}>
                      Mostrando {indexOfFirstItem + 1}-
                      {Math.min(indexOfLastItem, filteredData.length)} de{" "}
                      {filteredData.length} itens
                    </div>
                  </div>
                )}
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
};

export default DashboardRelatorios;
