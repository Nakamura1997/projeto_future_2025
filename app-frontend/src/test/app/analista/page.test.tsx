import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AnalistaDashboard from "@/app/analista/page";

// Mock do localStorage (se necessário futuramente)
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock dos hooks
vi.mock("@/hooks/useFormulario", () => ({
  useFormulario: () => ({
    getFormulariosRecentes: vi.fn().mockResolvedValue({
      rascunhos: [
        {
          id: 1,
          nome_formulario: "Formulário Rascunho",
          nome_cliente: "Cliente A",
          status: "rascunho",
          atualizado_em: "2025-07-30T10:00:00Z",
        },
      ],
      em_analise: [
        {
          id: 2,
          nome_formulario: "Formulário em Análise",
          nome_cliente: "Cliente B",
          status: "em_analise",
          atualizado_em: "2025-07-30T12:00:00Z",
        },
      ],
      concluidos: [
        {
          id: 3,
          nome_formulario: "Formulário Concluído",
          nome_cliente: "Cliente C",
          status: "concluido",
          atualizado_em: "2025-07-30T14:00:00Z",
        },
      ],
    }),
  }),
}));

vi.mock("@/components/Sidebar", () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}));
vi.mock("@/components/FloatingSocialMenu", () => ({
  default: () => <div data-testid="floating-menu">Menu</div>,
}));

describe("AnalistaDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve renderizar títulos e contadores corretamente", async () => {
    render(<AnalistaDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Dashboard do Analista")).toBeInTheDocument();

      expect(
        screen.getByText((text) => text.includes("Formulários em Rascunho"))
      ).toBeInTheDocument();

      expect(
        screen.getByText((text) => text.includes("Formulários em Análise"))
      ).toBeInTheDocument();

      expect(
        screen.getByText((text) => text.includes("Formulários Concluídos"))
      ).toBeInTheDocument();
    });
  });

  it("deve renderizar as tabelas com dados dos formulários", async () => {
    render(<AnalistaDashboard />);

    await waitFor(() => {
      expect(screen.getByText("Formulário Rascunho")).toBeInTheDocument();
      expect(screen.getByText("Formulário em Análise")).toBeInTheDocument();
      expect(screen.getByText("Formulário Concluído")).toBeInTheDocument();
    });
  });
});
