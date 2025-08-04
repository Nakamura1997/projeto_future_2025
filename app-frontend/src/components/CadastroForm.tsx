"use client";

import {
  FiUserPlus,
  FiEdit2,
  FiChevronDown,
  FiArrowLeft,
} from "react-icons/fi";
import { useSidebarCollapsed } from "@/hooks/useSidebarCollapsed";
import { useCadastroFront } from "@/hooks/useCadastroFront";
import Sidebar from "@/components/Sidebar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Snackbar from "@/components/Snackbar";

export default function CadastroPage() {
  const router = useRouter();
  const [snack, setSnack] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const isSidebarCollapsed = useSidebarCollapsed();
  const {
    criarUsuario,
    loading,
    error: hookError,
    success,
  } = useCadastroFront();
  const {
    tipoUsuario: tipoUsuarioLogado,
    isGestor,
    isAnalista,
    temPermissao,
  } = useAuth();

  const [formData, setFormData] = useState({
    responsavel: "",
    email: "",
    tipoUsuario: "Cliente",
    empresa: "",
    nistMaturidade: false,
    permissoes: [] as string[],
  });

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

  const opcoesTipoUsuario = () => {
    if (isGestor) return ["Cliente", "Analista", "Gestor"];
    if (isAnalista && temPermissao("criar_analistas"))
      return ["Cliente", "Analista"];
    return ["Cliente"];
  };

  const handlePermissionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      permissoes: checked
        ? [...prev.permissoes, value]
        : prev.permissoes.filter((perm) => perm !== value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const usuarioPayload = {
        first_name: formData.responsavel,
        email: formData.email,
        tipo_usuario: formData.tipoUsuario,
        empresa: formData.empresa,
        nist_maturidade: formData.nistMaturidade,
        permissoes: formData.permissoes,
      };

      const result = await criarUsuario(usuarioPayload);

      if (result.success) {
        setFormData({
          responsavel: "",
          email: "",
          tipoUsuario: "Cliente",
          empresa: "",
          nistMaturidade: false,
          permissoes: [],
        });

        setSnack({
          message:
            "Cadastro realizado com sucesso! Um e-mail foi enviado ao usuário.",
          type: "success",
        });
      } else {
        let errorMessage =
          "Ocorreu um erro ao enviar o cadastro. Por favor, tente novamente.";

        const raw = result.error;

        if (typeof raw === "string") {
          // Erros conhecidos
          if (raw.includes("Apenas gestores podem conceder")) {
            errorMessage =
              "Você não tem permissão para conceder essas permissões. Apenas gestores podem fazer isso.";
          } else if (raw.includes("Apenas gestores podem criar")) {
            errorMessage = "Apenas gestores podem criar novos analistas.";
          } else if (raw.includes("email") && raw.includes("already exists")) {
            errorMessage = "Este e-mail já está cadastrado.";
          } else {
            // Tenta limpar texto com aspas simples
            const match = raw.match(/'([^']+)'/g);
            if (match) {
              errorMessage = match.join(" ").replaceAll("'", "");
            } else {
              errorMessage = raw;
            }
          }
        }

        setSnack({
          message: errorMessage,
          type: "error",
        });
      }
    } catch (error: any) {
      // Erro inesperado fora da API
      setSnack({
        message: "Erro inesperado ao enviar o cadastro.",
        type: "error",
      });
    }
  };

  return (
    <div>
      <Sidebar />
      <main
        className={`${isSidebarCollapsed ? "main-content-collapsed" : "main-content"
          }`}
      >
        <div className="cadastroContainer">
          <div className="cadastroHeader">
            <div className="headerWithBack">
              <button
                onClick={() => router.back()}
                className="backButton"
                title="Voltar"
              >
                <FiArrowLeft size={20} />
              </button>
              <div>
                <h1>Cadastros</h1>
                <p>Gerenciamento de usuários e cadastros</p>
              </div>
            </div>
          </div>

          <div className="cadastroDivider"></div>

          <div className="cadastroTabs">
            <button className="cadastroTab active">
              <FiUserPlus size={18} />
              Novo Cadastro
            </button>
          </div>

          <div className="cadastroDivider"></div>

          <form onSubmit={handleSubmit} className="formContainer">
            <h2 className="sectionTitle">Novo Cadastro de Usuário</h2>

            <div className="formGrid">
              <div className="formGroup">
                <label>
                  <strong>Responsável *</strong>
                  <input
                    type="text"
                    name="responsavel"
                    value={formData.responsavel}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>

              <div className="formGroup">
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

              <div className="formGroup">
                <label>
                  <strong>Tipo de Usuário *</strong>
                  <div className="selectWrapper">
                    <select
                      name="tipoUsuario"
                      value={formData.tipoUsuario}
                      onChange={handleChange}
                      required
                    >
                      {opcoesTipoUsuario().map((opcao) => (
                        <option key={opcao} value={opcao}>
                          {opcao}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown className="selectIcon" />
                  </div>
                </label>
              </div>

              <div className="formGroup">
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

            <div className="availableForms">
              <h3 className="availableFormsTitle">Formulários Disponíveis</h3>
              <div className="formCheckbox">
                <input
                  type="checkbox"
                  id="nist-form"
                  name="nistMaturidade"
                  checked={formData.nistMaturidade}
                  onChange={handleChange}
                />
                <label htmlFor="nist-form">NIST 2.0 de Maturidade</label>
              </div>
            </div>

            {formData.tipoUsuario === "Analista" && (
              <div className="availableForms">
                <h3 className="availableFormsTitle">Permissões</h3>

                <div className="formCheckbox">
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

                <div className="formCheckbox">
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

            <div className="actionsContainer">
              <button
                type="button"
                className="cancelButton"
                onClick={() =>
                  setFormData({
                    responsavel: "",
                    email: "",
                    tipoUsuario: "Cliente",
                    empresa: "",
                    nistMaturidade: false,
                    permissoes: [],
                  })
                }
              >
                Cancelar
              </button>

             <button type="submit" className="btn-blue" disabled={loading}>
                       {loading ? (   "Enviando...") : (
              <>
              <i className="animation"></i>
              Salvar
              <i className="animation"></i>
              </>
             )}
            </button>
            </div>

            <div className="footerNote">
              <strong>Nota:</strong> Após criar o cadastro, será enviado um
              e-mail para o usuário completar o registro com senha e informações
              adicionais.
            </div>
          </form>
        </div>
      </main>

      {snack && (
        <Snackbar
          message={snack.message}
          type={snack.type}
          onClose={() => setSnack(null)}
        />
      )}
    </div>
  );
}
