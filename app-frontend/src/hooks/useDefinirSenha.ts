// hooks/useDefinirSenha.ts
import { getBaseUrl } from "@/util/baseUrl";
import { useState } from "react";
import { ApiError } from "./useCadastroFront";

export const useDefinirSenha = () => {
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
      return `Email: ${
        Array.isArray(errorData.email)
          ? errorData.email.join(", ")
          : errorData.email
      }`;
    }

    if (errorData.non_field_errors) {
      return Array.isArray(errorData.non_field_errors)
        ? errorData.non_field_errors.join(", ")
        : errorData.non_field_errors;
    }

    // Para erros de validação de campos
    const fieldErrors = Object.entries(errorData)
      .map(
        ([field, errors]) =>
          `${field}: ${Array.isArray(errors) ? errors.join(", ") : errors}`
      )
      .join("; ");

    return fieldErrors || "Erro desconhecido ao processar a requisição";
  };
  const definirSenha = async (token: string, senha: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`${apiUrl}/cadastro/auth/definir-senha/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ senha }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Erro ao definir a senha.");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };
  const resetarSenhaPorEmail = async (email: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(
        `${apiUrl}/cadastro/auth/resetar-senha-por-email/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            site_url: window.location.origin,
          }),
        }
      );

      const responseText = await response.text();
      let responseData: any;

      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (e) {
        console.error("Erro ao parsear resposta JSON:", responseText);
        throw new Error(
          `Resposta inválida do servidor: ${responseText.substring(0, 100)}...`
        );
      }

      if (!response.ok) {
        const errorMessage = formatErrorMessage(responseData);
        throw new Error(errorMessage);
      }

      setSuccess(true);
      return { success: true, data: responseData };
    } catch (err) {
      let errorMessage = "Erro desconhecido";

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { definirSenha, loading, error, success, resetarSenhaPorEmail };
};
