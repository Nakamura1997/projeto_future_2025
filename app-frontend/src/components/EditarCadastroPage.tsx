"use client";
import styles from "@/styles/cadastro.module.css";
import { FiChevronDown, FiArrowLeft, FiEdit2 } from "react-icons/fi";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";
import Sidebar from "@/components/Sidebar";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCadastroFront } from "@/hooks/useCadastroFront";
import { useAuth } from "@/hooks/useAuth";
import Snackbar from "@/components/Snackbar";

export default function EditarCadastroPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isSidebarCollapsed = useSidebarCollapsed();
  const { getUsuarioById, atualizarUsuario, loading, error, success } =
    useCadastroFront();
  const [snack, setSnack] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const {
    tipoUsuario: tipoUsuarioLogado,
    isGestor,
    isAnalista,
    temPermissao,
  } = useAuth();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    tipo_usuario: "Cliente",
    empresa: "",
    nist_maturidade: false,
    permissoes: [] as string[],
  });

  const opcoesTipoUsuario = () => {
    if (isGestor) return ["Cliente", "Analista", "Gestor"];
    if (isAnalista && temPermissao("criar_analistas"))
      return ["Cliente", "Analista"];
    return ["Cliente"];
  };

  useEffect(() => {
    if (id) {
      const carregarUsuario = async () => {
        const result = await getUsuarioById(id);
        if (result.success && result.data) {
          setFormData({
            first_name: result.data.first_name || "",
            last_name: result.data.last_name || "",
            email: result.data.email || "",
            tipo_usuario: result.data.tipo_usuario || "Cliente",
            empresa: result.data.empresa || "",
            nist_maturidade: result.data.nist_maturidade || false,
            permissoes: result.data.permissoes || [],
          });
        }
      };
      carregarUsuario();
    }
  }, [id]);

  const handlePermissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;

    setFormData((prev) => {
      if (checked) {
        return {
          ...prev,
          permissoes: [...prev.permissoes, value],
        };
      } else {
        return {
          ...prev,
          permissoes: prev.permissoes.filter((perm) => perm !== value),
        };
      }
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const checked =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : undefined;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await atualizarUsuario(id, formData);
      alert("Cadastro atualizado com sucesso!");
      router.push("/analista/cadastros");
    } catch (error) {
      alert(
        "Erro ao atualizar cadastro. Verifique os dados e tente novamente."
      );
      console.error(error);
    }
  };

  return (
    <div>
      <Sidebar />
      <main
        className={`${
          isSidebarCollapsed ? "main-content-collapsed" : "main-content"
        }`}
      >
        <div className={`${styles.cadastroContainer}`}>
          <div className={styles.cadastroHeader}>
            <div className={styles.headerWithBack}>
              <button
                onClick={() => router.back()}
                className={styles.backButton}
                title="Voltar"
              >
                <FiArrowLeft size={20} />
              </button>
              <div>
                <h1>Editar Cadastro</h1>
                <p>Gerenciamento de usuários e cadastros</p>
              </div>
            </div>
          </div>

          <div className={styles.cadastroTabs}>
            <button className={`${styles.cadastroTab} ${styles.active}`}>
              <FiEdit2 size={18} />
              Editar Cadastro
            </button>
          </div>

          <div className={styles.cadastroDivider}></div>

          <form onSubmit={handleSubmit} className={styles.formContainer}>
            <h2 className={styles.sectionTitle}>Editar Cadastro de Usuário</h2>

            {/* {(error || hookError) && (
               <div className={styles.errorMessage}>
                 {(error || hookError)?.includes(
                   "Apenas gestores podem conceder"
                 ) ? (
                   <>
                     <strong>Restrição de permissão:</strong>{" "}
                     {error || hookError}
                     <br />
                     <small>
                       Por favor, contate o administrador do sistema.
                     </small>
                   </>
                 ) : (
                   error || hookError
                 )}
               </div>
             )}
             {success && (
               <div className={styles.successMessage}>
                 Cadastro realizado com sucesso! Um email foi enviado para o
                 usuário.
               </div>
             )} */}
            {snack && (
              <Snackbar
                message={snack.message}
                type={snack.type}
                onClose={() => setSnack(null)}
              />
            )}
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>
                  <strong>Nome *</strong>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              <div className={styles.formGroup}>
                <label>
                  <strong>Sobrenome</strong>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </label>
              </div>

              <div className={styles.formGroup}>
                <label>
                  <strong>Email *</strong>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              <div className={styles.formGroup}>
                <label>
                  <strong>Tipo de Usuário *</strong>
                  <div className={styles.selectWrapper}>
                    <select
                      name="tipoUsuario"
                      value={formData.tipo_usuario}
                      onChange={handleChange}
                      required
                    >
                      {opcoesTipoUsuario().map((opcao) => (
                        <option key={opcao} value={opcao}>
                          {opcao}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className={styles.selectIcon} />
                  </div>
                </label>
              </div>

              <div className={styles.formGroup}>
                <label>
                  <strong>Empresa</strong>
                  <input
                    type="text"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleChange}
                  />
                </label>
              </div>
            </div>

            <div className={styles.availableForms}>
              <h3 className={styles.availableFormsTitle}>
                Formulários Disponíveis
              </h3>
              <div className={styles.formCheckbox}>
                <input
                  type="checkbox"
                  id="nist-form"
                  name="nist_maturidade"
                  checked={formData.nist_maturidade}
                  onChange={handleChange}
                />
                <label htmlFor="nist-form">NIST 2.0 de Maturidade</label>
              </div>
            </div>

            {formData.tipo_usuario === "Analista" && (
              <div className={styles.availableForms}>
                <h3 className={styles.availableFormsTitle}>Permissões</h3>

                <div className={styles.formCheckbox}>
                  <input
                    type="checkbox"
                    id="aprovar-relatorios"
                    name="permissoes"
                    value="aprovar_relatorios"
                    checked={formData.permissoes.includes("aprovar_relatorios")}
                    onChange={handlePermissionChange}
                  />
                  <label htmlFor="aprovar-relatorios">Aprovar Relatórios</label>
                </div>

                <div className={styles.formCheckbox}>
                  <input
                    type="checkbox"
                    id="criar-analistas"
                    name="permissoes"
                    value="criar_analistas"
                    checked={formData.permissoes.includes("criar_analistas")}
                    onChange={handlePermissionChange}
                  />
                  <label htmlFor="criar-analistas">Criar Novos Analistas</label>
                </div>
              </div>
            )}

            <div className={styles.actionsContainer}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={() => router.push("/analista/cadastros")}
              >
                Cancelar
              </button>

              <button type="submit" className="btn-blue" disabled={loading}>
                {loading ? "Salvando..." : "Salvar Alterações"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
