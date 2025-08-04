// app/analista/cadastros/page.tsx
import { Suspense } from "react";
import ListaDeCadastros from "@/components/ListaDeCadastros";

export default function Page() {
  return (
    <Suspense fallback={<div>Carregando lista de cadastros...</div>}>
      <ListaDeCadastros />
    </Suspense>
  );
}
