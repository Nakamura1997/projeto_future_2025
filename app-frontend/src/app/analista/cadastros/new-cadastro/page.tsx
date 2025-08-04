// app/gestor/cadastros/novo/page.tsx
import { Suspense } from "react";
import CadastroForm from "@/components/CadastroForm";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando formulário de cadastro...</div>}>
      <CadastroForm />
    </Suspense>
  );
}
