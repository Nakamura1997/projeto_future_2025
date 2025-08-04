import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import NistTable from '@/components/NistTable';

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('NistTable', () => {
  const mockData = [
    {
      categoria: 'Governança',
      subcategoria: 'GV.OC',
      descricao: 'Contexto organizacional',
      nivel: 3,
      pontuacao: 75,
    },
    {
      categoria: 'Identificar',
      subcategoria: 'ID.AM',
      descricao: 'Gestão de ativos',
      nivel: 2,
      pontuacao: 50,
    },
    {
      categoria: 'Proteger',
      subcategoria: 'PR.AC',
      descricao: 'Controle de acesso',
      nivel: 4,
      pontuacao: 90,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockData));
  });

  it('deve renderizar a tabela com dados do localStorage', () => {
    render(<NistTable />);

    expect(screen.getByText('Categoria')).toBeInTheDocument();
    expect(screen.getByText('Subcategoria')).toBeInTheDocument();
    expect(screen.getByText('Descrição')).toBeInTheDocument();
    expect(screen.getByText('Nível')).toBeInTheDocument();
    expect(screen.getByText('Pontuação')).toBeInTheDocument();

    expect(screen.getByText('Governança')).toBeInTheDocument();
    expect(screen.getByText('GV.OC')).toBeInTheDocument();
    expect(screen.getByText('Contexto organizacional')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
  });

  it('deve renderizar mensagem quando não há dados', () => {
    localStorageMock.getItem.mockReturnValue(null);

    render(<NistTable />);

    expect(screen.getByText('Nenhum dado disponível')).toBeInTheDocument();
  });

  it('deve renderizar mensagem quando dados estão vazios', () => {
    localStorageMock.getItem.mockReturnValue(JSON.stringify([]));

    render(<NistTable />);

    expect(screen.getByText('Nenhum dado disponível')).toBeInTheDocument();
  });

  it('deve aplicar classes CSS corretas baseadas no nível', () => {
    render(<NistTable />);

    const nivel2 = screen.getByText('2').closest('td');
    const nivel3 = screen.getByText('3').closest('td');
    const nivel4 = screen.getByText('4').closest('td');

    expect(nivel2).toHaveClass('bg-red-100', 'text-red-800');
    expect(nivel3).toHaveClass('bg-yellow-100', 'text-yellow-800');
    expect(nivel4).toHaveClass('bg-green-100', 'text-green-800');
  });

  it('deve aplicar classes CSS corretas baseadas na pontuação', () => {
    render(<NistTable />);

    const pontuacao50 = screen.getByText('50').closest('td');
    const pontuacao75 = screen.getByText('75').closest('td');
    const pontuacao90 = screen.getByText('90').closest('td');

    expect(pontuacao50).toHaveClass('bg-red-50', 'text-red-700');
    expect(pontuacao75).toHaveClass('bg-yellow-50', 'text-yellow-700');
    expect(pontuacao90).toHaveClass('bg-green-50', 'text-green-700');
  });

  it('deve ordenar dados por categoria por padrão', () => {
    render(<NistTable />);

    const rows = screen.getAllByRole('row');
    // Primeira linha é o cabeçalho, então começamos da segunda
    expect(rows[1]).toHaveTextContent('Governança');
    expect(rows[2]).toHaveTextContent('Identificar');
    expect(rows[3]).toHaveTextContent('Proteger');
  });

  it('deve permitir ordenação por diferentes colunas', () => {
    render(<NistTable />);

    // Clicar no cabeçalho da coluna Nível
    const nivelHeader = screen.getByText('Nível');
    fireEvent.click(nivelHeader);

    // Verificar se a ordenação mudou
    const rows = screen.getAllByRole('row');
    // Após ordenação por nível, deve estar em ordem crescente
    expect(rows[1]).toHaveTextContent('2'); // ID.AM
    expect(rows[2]).toHaveTextContent('3'); // GV.OC
    expect(rows[3]).toHaveTextContent('4'); // PR.AC
  });

  it('deve filtrar dados quando termo de busca é fornecido', () => {
    render(<NistTable />);

    const searchInput = screen.getByPlaceholderText('Buscar...');
    fireEvent.change(searchInput, { target: { value: 'Governança' } });

    expect(screen.getByText('Governança')).toBeInTheDocument();
    expect(screen.queryByText('Identificar')).not.toBeInTheDocument();
    expect(screen.queryByText('Proteger')).not.toBeInTheDocument();
  });

  it('deve mostrar todas as linhas quando busca é limpa', () => {
    render(<NistTable />);

    const searchInput = screen.getByPlaceholderText('Buscar...');
    
    // Filtrar primeiro
    fireEvent.change(searchInput, { target: { value: 'Governança' } });
    expect(screen.queryByText('Identificar')).not.toBeInTheDocument();

    // Limpar filtro
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getByText('Identificar')).toBeInTheDocument();
    expect(screen.getByText('Proteger')).toBeInTheDocument();
  });

  it('deve lidar com dados malformados no localStorage', () => {
    localStorageMock.getItem.mockReturnValue('dados-inválidos');

    render(<NistTable />);

    expect(screen.getByText('Nenhum dado disponível')).toBeInTheDocument();
  });

  it('deve exibir indicador de carregamento inicialmente', () => {
    // Simular delay no localStorage
    localStorageMock.getItem.mockImplementation(() => {
      return new Promise(resolve => setTimeout(() => resolve(JSON.stringify(mockData)), 100));
    });

    render(<NistTable />);

    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });
});

