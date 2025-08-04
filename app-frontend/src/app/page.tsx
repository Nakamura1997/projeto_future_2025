"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";
import { getBaseUrl } from "@/util/baseUrl";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const validateTokenAndRedirect = async () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        const userString = localStorage.getItem("user");

        if (!token || !userString) {
          router.push("/login");
          return;
        }

        try {
    
          await axios.get(`${getBaseUrl()}/auth/validate-token/`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const user = JSON.parse(userString);

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
              router.push("/cliente");
          }
        } catch (error) {
          console.error("Token inválido ou expirado:", error);
          router.push("/login");
        }
      }
    };

    validateTokenAndRedirect();
  }, [router]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f3f4f6",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
        Verificando autenticação...
      </h1>
    </div>
  );
}
