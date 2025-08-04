import { useMemo } from "react";

export function useAuth() {
  if (typeof window === "undefined") return {};

  const user = useMemo(() => {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  }, []);

  const cadastro = useMemo(() => {
    const raw = localStorage.getItem("cadastro");
    return raw ? JSON.parse(raw) : null;
  }, []);

  const tipoUsuario = cadastro?.tipo_usuario || "Cliente";
  const permissoes: string[] = cadastro?.permissoes || [];

  const temPermissao = (permissao: string) => permissoes.includes(permissao);

  const isGestor = tipoUsuario === "Gestor";
  const isAnalista = tipoUsuario === "Analista";
  const isCliente = tipoUsuario === "Cliente";
  const isSubcliente = user?.role === "subcliente";

  return {
    user,
    cadastro,
    tipoUsuario,
    permissoes,
    temPermissao,
    isGestor,
    isAnalista,
    isCliente,
    isSubcliente,
  };
}
