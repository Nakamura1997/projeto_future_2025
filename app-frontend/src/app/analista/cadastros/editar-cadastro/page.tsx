// app/analista/cadastros/editar-cadastro/page.tsx
import { Suspense } from "react";
import EditarCadastroPage from "@/components/EditarCadastroPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando formulário...</div>}>
      <EditarCadastroPage />
    </Suspense>
  );
}
