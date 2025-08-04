// src/app/login/redefinir-senha/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDefinirSenha } from "@/hooks/useDefinirSenha";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { resetarSenhaPorEmail } = useDefinirSenha();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); // Impede o comportamento padrão do formulário

    const response = await resetarSenhaPorEmail(email);

    if (response.success) {
      setMessage(
        "Um e-mail foi enviado com instruções para redefinir sua senha."
      );
    } else {
      setMessage(response.error || "Erro ao enviar o e-mail. Tente novamente.");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1>
          <span className="letter">F</span>
          <span className="letter">S</span>
          <span className="letter-3">3</span>
          <span className="letter">M</span>
        </h1>

        <h2 className="text-xl text-center mb-6">Redefina a sua senha</h2>
        <p className="text-gray-600 mb-4 text-center">
          Insira seu email para recuperar sua conta.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Coloque o seu email cadastrado aqui!"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Link
              href="/login"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Enviar
            </button>
          </div>
        </form>

        {message && (
          <div className="mt-4 p-3 text-center text-sm text-gray-600">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
