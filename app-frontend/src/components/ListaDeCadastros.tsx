"use client";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";
import styles from "@/styles/cadastro.module.css";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCadastroFront } from "@/hooks/useCadastroFront";
import {
  FiMail,
  FiEdit,
  FiTrash2,
  FiClock,
  FiMoreVertical,
} from "react-icons/fi";
import { getBaseUrl } from "@/util/baseUrl";
import ConfirmDialog from "@/components/ConfirmDialog";
// Badge de tipo
const TipoBadge = ({ tipo }: { tipo: string }) => {
  const badgeClass =
    tipo.toLowerCase() === "cliente" ? "cliente-badge" : "subcliente-badge";
  return <span className={`tipo-badge ${badgeClass}`}>{tipo}</span>;
};

// Toggle status
const StatusSwitch = ({
  ativo,
  onToggle,
}: {
  ativo: boolean;
  onToggle: () => void;
}) => {
  return (
    <div className="status-switch-container">
      <span className={`status-label ${ativo ? "ativo" : "inativo"}`}>
        {ativo ? "Ativo" : "Inativo"}
      </span>
      <label className="status-toggle">
        <input type="checkbox" checked={ativo} onChange={onToggle} />
        <span className="toggle-slider"></span>
      </label>
    </div>
  );
};

// Componente de Dropdown de Ações
const ActionsDropdown = ({
  usuario,
  onReenviarEmail,
  onUsuarioDeletado,
}: {
  usuario: any;
  onReenviarEmail: (email: string) => void;
  onUsuarioDeletado: () => void;
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEditar = () => {
    router.push(`/analista/cadastros/editar-cadastro?id=${usuario.id}`);
    setIsOpen(false);
  };

  const handleDeletar = () => {
    setShowDialog(true);
    setIsOpen(false);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${getBaseUrl()}/api/usuarios/${usuario.id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Erro ao deletar usuário.");

      setShowDialog(false);
      onUsuarioDeletado();
    } catch (error) {
      console.error(error);
      alert("Erro ao deletar usuário.");
      setShowDialog(false);
    }
  };

  return (
    <div className={styles.actionsDropdown} ref={dropdownRef}>
      <button
        className={styles.actionsButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FiMoreVertical size={16} />
      </button>

      {isOpen && (
        <div className={styles.actionsMenu}>
          <button onClick={() => onReenviarEmail(usuario.email)}>
            <FiMail size={14} /> Reenviar E-mail
          </button>
          <button onClick={handleEditar}>
            <FiEdit size={14} /> Editar Cadastro
          </button>
          <button onClick={handleDeletar}>
            <FiTrash2 size={14} /> Deletar Cadastro
          </button>
          {/* <button
            onClick={() => console.log("Ver último acesso de:", usuario.email)}
          >
            <FiClock size={14} /> Último Acesso
          </button> */}
        </div>
      )}

      {/* Confirm Dialog dentro do Dropdown */}
      {showDialog && (
        <ConfirmDialog
          message={`Tem certeza que deseja deletar o usuário ${usuario.email}?`}
          onConfirm={confirmDelete}
          onCancel={() => setShowDialog(false)}
        />
      )}
    </div>
  );
};

export default function CadastrosPage() {
  const isSidebarCollapsed = useSidebarCollapsed();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [pagina, setPagina] = useState(1);
  const [total, setTotal] = useState(0);
  const [porPagina, setPorPagina] = useState(10);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const apiBaseUrl = getBaseUrl();
  const apiUrl = `${apiBaseUrl}/api`;
  const [showDialog, setShowDialog] = useState(false);

  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const params = new URLSearchParams({
        page: String(pagina),
        page_size: String(porPagina),
        search: searchTerm,
      });
      if (statusFilter !== "todos") {
        params.append("is_active", statusFilter === "ativo" ? "true" : "false");
      }

      const res = await fetch(`${apiUrl}/usuarios/?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setUsuarios(data.results || data);
      setTotal(data.count || data.length || 0);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, [pagina, searchTerm, statusFilter, porPagina]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target as Node)) {
        setIsStatusDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsStatusDropdownOpen((prev) => !prev);
  const handleStatusSelect = (value: string) => {
    setStatusFilter(value);
    setPagina(1);
    setIsStatusDropdownOpen(false);
  };

  const handleToggleStatus = async (id: number) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/usuarios/${id}/ativar/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Erro ao alternar status.");
      await fetchUsuarios();
    } catch (err) {
      console.error(err);
      alert("Erro ao alternar status.");
    }
  };

  const handleReenviarEmail = async (email: string) => {
    if (
      !confirm(
        `Deseja reenviar o e-mail de redefinição de senha para ${email}?`
      )
    )
      return;

    try {
      const site_url = window.location.origin;
      const res = await fetch(`${apiUrl}/cadastro/auth/reenviar-email-token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, site_url }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Erro ao reenviar e-mail.");
      }

      alert("E-mail reenviado com sucesso.");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Erro ao reenviar e-mail.");
    }
  };

  return (
    <div
      className={`main-app-container ${
        isSidebarCollapsed ? "sidebar-collapsed" : ""
      }`}
    >
      <Sidebar />

      <main className="main-content">
        <div className="cadastros-container">
          <div className="header-container">
            <h1 className="cadastros-title">Cadastros</h1>
            <Link href="/analista/cadastros/new-cadastro">
              <button className="new-button">+ NOVO CADASTRO</button>
            </Link>
          </div>

          <div className="filters-container">
            <p className="total-cadastros">Total: {total}</p>
            <div className="searchContainer">
              <svg
                className="searchIcon"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                width={18}
                height={18}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
                />
              </svg>
              <input
                type="text"
                placeholder="Buscar por nome, email ou empresa..."
                className="searchInput"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPagina(1);
                }}
              />
            </div>
            <div className="status-dropdown-container" ref={dropdownRef}>
              <div className="select-wrapper">
                <select
                  className="status-select"
                  value={statusFilter}
                  onChange={(e) => handleStatusSelect(e.target.value)}
                >
                  <option value="todos">Todos os status</option>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
                <svg
                  className="select-arrow"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {isStatusDropdownOpen && (
                <div className="status-dropdown-content">
                  {["todos", "ativo", "inativo"].map((status) => (
                    <div
                      key={status}
                      className={`status-option ${
                        statusFilter === status ? "selected" : ""
                      }`}
                      onClick={() => handleStatusSelect(status)}
                    >
                      {statusFilter === status && (
                        <span className="checkmark">✓</span>
                      )}
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="table-container">
            <table className="cadastros-table">
              <thead>
                <tr>
                  <th>NOME</th>
                  <th>EMAIL</th>
                  <th>EMPRESA</th>
                  <th>TIPO</th>
                  <th>STATUS</th>
                  <th>AÇÕES</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id}>
                    <td>{u.first_name}</td>
                    <td>{u.email}</td>
                    <td>{u.empresa || "—"}</td>
                    <td>
                      <TipoBadge tipo={u.tipo_usuario || "Cliente"} />
                    </td>
                    <td>
                      <StatusSwitch
                        ativo={u.is_active}
                        onToggle={() => handleToggleStatus(u.id)}
                      />
                    </td>
                    <td>
                      <ActionsDropdown
                        usuario={u}
                        onReenviarEmail={handleReenviarEmail}
                        onUsuarioDeletado={fetchUsuarios}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="pagination-controls">
            <div className="pagination-left">
              <label htmlFor="pageSizeSelect">Exibir:</label>
              <select
                id="pageSizeSelect"
                value={porPagina}
                onChange={(e) => {
                  setPagina(1);
                  setPorPagina(Number(e.target.value));
                }}
                className="page-size-select"
              >
                {[5, 10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <span>por página</span>
            </div>

            <div className="pagination-right">
              <button
                onClick={() => setPagina((p) => Math.max(1, p - 1))}
                disabled={pagina === 1}
                className="pagination-button"
                title="Página anterior"
              >
                <FiChevronLeft />
              </button>
              <span>
                Página {pagina} de {Math.max(1, Math.ceil(total / porPagina))}
              </span>
              <button
                onClick={() =>
                  setPagina((p) =>
                    p < Math.ceil(total / porPagina) ? p + 1 : p
                  )
                }
                disabled={pagina >= Math.ceil(total / porPagina)}
                className="pagination-button"
                title="Próxima página"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
