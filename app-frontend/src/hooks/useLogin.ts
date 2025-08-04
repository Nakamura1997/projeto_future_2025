import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { getBaseUrl } from "@/util/baseUrl";

const API_URL = `${getBaseUrl()}/api/token/`;

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [cadastro, setCadastro] = useState(null); // Novo estado para cadastro
  const router = useRouter();

  const login = async (email, password) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(API_URL, {
        email,
        password,
      });

      const { access, refresh, user, cadastro } = response.data;

      if (!user.is_active) {
        setError(
          "Seu acesso ainda não foi ativado. Aguarde aprovação ou contate o suporte."
        );
        setLoading(false);
        return;
      }

      setToken(access);
      setUser(user);
      setCadastro(cadastro); // Atualiza estado

      localStorage.setItem("token", access);
      localStorage.setItem("refreshToken", refresh);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("cadastro", JSON.stringify(cadastro)); // Salva no localStorage

      switch (user.role) {
        case "gestor":
          router.push("/gestor");
          break;
        case "funcionario":
          router.push("/analista");
          break;
        case "subcliente":
        case "cliente":
        default:
          localStorage.setItem("cliente_formulario_analise_id", user.id);
          router.push("/cliente");
      }
    } catch (err) {
      const data = err.response?.data;

      if (typeof data === "object") {
        if (data.error) {
          setError(data.error);
        } else if (data.detail) {
          setError(data.detail);
        } else if (data.password) {
          setError(data.password);
        } else {
          const fallback = Object.values(data).flat().join(" ");
          setError(fallback || "Erro ao fazer login.");
        }
      } else {
        setError(err.message || "Erro inesperado ao fazer login.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error, token, user, cadastro };
}
