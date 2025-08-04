import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import axios from 'axios';
import { useFormulario } from '@/hooks/useFormulario';

// Interfaces
interface Formulario {
  id: number;
  nome: string;
  total?: number | string;
}

interface Categoria {
  id: number;
  nome: string;
  formulario: number;
}

interface FormularioEmAndamento {
  id: number;
  formulario: number;
  formulario_nome: string;
  status: string;
  atualizado_em: string;
  versao: number;
  progresso: number;
}

// Mock do axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock do getBaseUrl
vi.mock('@/util/baseUrl', () => ({
  getBaseUrl: () => 'http://localhost:8000',
}));

describe('useFormulario', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup padrão para evitar erros não tratados
    mockedAxios.get.mockResolvedValue({ data: [] });
    mockedAxios.post.mockResolvedValue({ data: {} });
    mockedAxios.patch.mockResolvedValue({ data: {} });
    
    localStorageMock.getItem.mockReturnValue(null);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('deve inicializar corretamente', async () => {
    const mockFormularios = [
      { id: 1, nome: 'Formulário A', total: 10 },
      { id: 2, nome: 'Formulário B', total: 15 },
    ];

    mockedAxios.get.mockImplementation((url) => {
      if (url.includes('/formularios/')) {
        return Promise.resolve({ data: mockFormularios });
      }
      if (url.includes('/formularios-em-analise/')) {
        return Promise.resolve({ data: {} });
      }
      return Promise.resolve({ data: [] });
    });

    const { result } = renderHook(() => useFormulario());

    await waitFor(() => {
      expect(result.current.formularios).toEqual(mockFormularios);
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'totalFormularios',
      JSON.stringify(mockFormularios)
    );
  });

  it('deve buscar categorias com sucesso', async () => {
    const mockCategorias = [
      { id: 1, nome: 'Categoria A', formulario: 1 },
      { id: 2, nome: 'Categoria B', formulario: 1 },
    ];

    mockedAxios.get.mockResolvedValue({ data: mockCategorias });

    const { result } = renderHook(() => useFormulario());

    await act(async () => {
      await result.current.getCategorias(1);
    });

    expect(result.current.categorias).toEqual(mockCategorias);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://localhost:8000/form/categorias/?formulario_id=1'
    );
  });

  it('deve lidar com erro ao buscar categorias', async () => {
    const errorMessage = 'Erro de rede';
    mockedAxios.get.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useFormulario());

    await act(async () => {
      try {
        await result.current.getCategorias(1);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(errorMessage);
      }
    });

    expect(result.current.categorias).toEqual([]);
  });

  it('deve buscar perguntas com sucesso', async () => {
    const mockPerguntas = [
      { id: 1, pergunta: 'Pergunta 1', subcategoria_id: 1 },
      { id: 2, pergunta: 'Pergunta 2', subcategoria_id: 1 },
    ];

    mockedAxios.get.mockResolvedValue({ data: mockPerguntas });

    const { result } = renderHook(() => useFormulario());

    await act(async () => {
      await result.current.getPerguntas(1);
    });

    expect(result.current.perguntas).toEqual(mockPerguntas);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://localhost:8000/form/perguntas/?subcategoria_id=1'
    );
  });

  it('deve lidar com erro ao buscar perguntas', async () => {
    const errorMessage = 'Erro de rede';
    mockedAxios.get.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useFormulario());

    await act(async () => {
      try {
        await result.current.getPerguntas(1);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(errorMessage);
      }
    });

    expect(result.current.perguntas).toEqual([]);
  });

  it('deve salvar resposta com sucesso', async () => {
    const mockResposta = { id: 1, pergunta_id: 1, resposta: 'Sim' };
    mockedAxios.post.mockResolvedValue({ data: mockResposta });

    const { result } = renderHook(() => useFormulario());

    await act(async () => {
      await result.current.salvarResposta({
        pergunta_id: 1,
        resposta: 'Sim',
        justificativa: 'Justificativa teste',
      });
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:8000/form/respostas/',
      {
        pergunta_id: 1,
        resposta: 'Sim',
        justificativa: 'Justificativa teste',
      }
    );
  });

  it('deve lidar com erro ao salvar resposta', async () => {
    const errorMessage = 'Erro ao salvar';
    mockedAxios.post.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useFormulario());

    await act(async () => {
      try {
        await result.current.salvarResposta({
          pergunta_id: 1,
          resposta: 'Sim',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(errorMessage);
      }
    });
  });

  it('deve buscar formulários em andamento', async () => {
    const mockFormulariosAndamento: FormularioEmAndamento[] = [
      {
        id: 1,
        formulario: 1,
        formulario_nome: 'NIST CSF',
        status: 'em_andamento',
        atualizado_em: '2024-01-01',
        versao: 1,
        progresso: 50,
      },
    ];

    mockedAxios.get.mockResolvedValue({ data: mockFormulariosAndamento });

    const { result } = renderHook(() => useFormulario());

    await act(async () => {
      await result.current.getFormulariosEmAndamento();
    });

    expect(result.current.formulariosEmAndamento).toEqual(mockFormulariosAndamento);
  });

  it('deve criar novo formulário respondido', async () => {
    const mockNovoFormulario = { id: 1, formulario: 1, status: 'rascunho' };
    mockedAxios.post.mockResolvedValue({ data: mockNovoFormulario });
    localStorageMock.getItem.mockReturnValue('{"id": 1, "name": "Cliente Teste"}');

    const { result } = renderHook(() => useFormulario());

    await act(async () => {
      await result.current.criarFormularioRespondido(1);
    });

    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:8000/form/formularios-respondidos/',
      {
        formulario: 1,
        cliente: 1,
      }
    );
  });
});

