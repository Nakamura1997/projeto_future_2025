import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import RelatorioPage from "@/app/analista/relatorios/page";

// Mock da Sidebar
vi.mock("@/components/Sidebar", () => {
  return {
    default: vi.fn(() => <div data-testid="sidebar">Sidebar Component</div>),
  };
});

// Mock do hook useSidebarCollapsed
vi.mock("@/hooks/useSidebarCollapsed", () => ({
  useSidebarCollapsed: () => false,
}));

// Mock dinâmico do hook useFormulario
let hookState: {
  formulariosConcluidos: any[];
  loadingFormulariosConcluidos: boolean;
  buscarFormulariosConcluidos: () => void;
} = {
  formulariosConcluidos: [],
  loadingFormulariosConcluidos: false,
  buscarFormulariosConcluidos: vi.fn(),
};

vi.mock("@/hooks/useFormulario", () => ({
  useFormulario: () => hookState,
}));

describe("Página de Relatórios Concluídos", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    hookState = {
      formulariosConcluidos: [
        {
          id_formulario_respondido: 1,
          nome_formulario: "Formulário de Segurança",
          nome_cliente: "Cliente A",
          data_finalizado: "2025-07-31",
          data_aprovado: "2025-08-01",
          analista_responsavel: "Michelle",
        },
      ],
      loadingFormulariosConcluidos: false,
      buscarFormulariosConcluidos: vi.fn(),
    };
  });

  it("deve exibir o título da página", () => {
    render(<RelatorioPage />);
    expect(screen.getByText("Relatórios Concluídos")).toBeInTheDocument();
  });

  it("deve renderizar a tabela com os dados do relatório", () => {
    render(<RelatorioPage />);
    expect(
      screen.getAllByText("Formulário de Segurança").length
    ).toBeGreaterThan(0);
    expect(screen.getByText("Cliente A")).toBeInTheDocument();
    expect(screen.getByText("Michelle")).toBeInTheDocument();
    expect(screen.getAllByText("2025-07-31")[0]).toBeInTheDocument();
    expect(screen.getAllByText("2025-08-01")[0]).toBeInTheDocument();
    expect(screen.getAllByText("Ver")[0]).toBeInTheDocument();
  });

  it("deve mostrar a mensagem de carregamento se estiver carregando", () => {
    hookState.loadingFormulariosConcluidos = true;
    hookState.formulariosConcluidos = [];

    render(<RelatorioPage />);
    expect(screen.getByText("Carregando...")).toBeInTheDocument();
  });

  it("deve mostrar mensagem se nenhum relatório for encontrado", () => {
    hookState.formulariosConcluidos = [];
    render(<RelatorioPage />);
    expect(
      screen.getByText("Nenhum relatório encontrado.")
    ).toBeInTheDocument();
  });
});
