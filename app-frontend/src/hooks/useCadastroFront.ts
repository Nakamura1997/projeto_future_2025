// hooks/useCadastroFront.ts
import { useState } from "react";
import { getBaseUrl } from "@/util/baseUrl";

export interface Usuario {
  id?: number;
  first_name: string;
  last_name?: string;
  email: string;
  tipo_usuario: string;
  empresa?: string;
  nist_maturidade: boolean;
  permissoes: string[];
  is_active?: boolean;
}

export interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface ApiError {
  detail?: string;
  email?: string | string[];
  non_field_errors?: string | string[];
  [key: string]: any;
}

export const useCadastroFront = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const apiBaseUrl = getBaseUrl();
  const apiUrl = `${apiBaseUrl}/api`;

  const formatErrorMessage = (errorData: ApiError): string => {
    if (errorData.detail) {
      return errorData.detail;
    }
    if (errorData.email) {
      return `Email: ${Array.isArray(errorData.email) ? errorData.email.join(", ") : errorData.email}`;
    }
    if (errorData.non_field_errors) {
      return Array.isArray(errorData.non_field_errors)
        ? errorData.non_field_errors.join(", ")
        : errorData.non_field_errors;
    }

    return Object.entries(errorData)
      .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`)
      .join("; ") || "Erro desconhecido ao processar a requisição";
  };

  // Buscar lista de usuários
  const fetchUsuarios = async (params: {
    page?: number;
    page_size?: number;
    search?: string;
    is_active?: boolean;
  }): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado. Faça login.");

      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.page_size) queryParams.append('page_size', params.page_size.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());

      const response = await fetch(`${apiUrl}/usuarios/?${queryParams.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) throw new Error(formatErrorMessage(data));

      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao buscar usuários";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Criar novo usuário
  const criarUsuario = async (usuarioData: Omit<Usuario, 'id'>): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado. Faça login.");

      const response = await fetch(`${apiUrl}/usuarios/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(usuarioData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(formatErrorMessage(data));

      setSuccess(true);
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar usuário";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Buscar usuário por ID
  const getUsuarioById = async (id: string | number): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado. Faça login.");

      const response = await fetch(`${apiUrl}/usuarios/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) throw new Error(formatErrorMessage(data));

      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao buscar usuário";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Atualizar usuário
  const atualizarUsuario = async (
    id: string | number,
    usuarioData: Partial<Usuario>
  ): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado. Faça login.");

      const response = await fetch(`${apiUrl}/usuarios/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(usuarioData),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(formatErrorMessage(data));

      setSuccess(true);
      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar usuário";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Deletar usuário
  const deletarUsuario = async (id: string | number): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado. Faça login.");

      const response = await fetch(`${apiUrl}/usuarios/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        return { success: true };
      }

      const data = await response.json();
      throw new Error(formatErrorMessage(data));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao deletar usuário";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Ativar/Desativar usuário
  const toggleStatusUsuario = async (id: string | number): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado. Faça login.");

      const response = await fetch(`${apiUrl}/usuarios/${id}/ativar/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) throw new Error(formatErrorMessage(data));

      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao alternar status";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Reenviar email de confirmação
  const reenviarEmailConfirmacao = async (email: string): Promise<ApiResponse> => {
    setLoading(true);
    setError(null);
    try {
      const site_url = window.location.origin;
      const response = await fetch(`${apiUrl}/cadastro/auth/reenviar-email-token/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, site_url }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(formatErrorMessage(data));

      return { success: true, data };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao reenviar e-mail";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  };

  return {
    // Operações CRUD
    fetchUsuarios,
    criarUsuario,
    getUsuarioById,
    atualizarUsuario,
    deletarUsuario,

    // Operações específicas
    toggleStatusUsuario,
    reenviarEmailConfirmacao,

    // Estado
    loading,
    error,
    success,
    resetState,
  };
};