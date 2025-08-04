import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { useReports } from '@/hooks/useReports';

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

describe('useReports', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('mock-token');
    mockedAxios.get.mockResolvedValue({ data: [] });
    mockedAxios.post.mockResolvedValue({ data: {} });
  });

  it('deve buscar todos os relatórios', async () => {
    const mockReports = [
      {
        id: 1,
        tipo: 'completo',
        status: 'concluido',
        data_criacao: '2024-01-01',
        pdf_file: 'relatorio1.pdf',
      },
      {
        id: 2,
        tipo: 'resumo',
        status: 'em_processamento',
        data_criacao: '2024-01-02',
        pdf_file: null,
      },
    ];

    mockedAxios.get.mockResolvedValue({ data: mockReports });

    const { result } = renderHook(() => useReports());

    let reports;
    await act(async () => {
      reports = await result.current.getAllReports();
    });

    expect(reports).toEqual(mockReports);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://localhost:8000/reports/',
      {
        headers: {
          Authorization: 'Bearer mock-token',
        },
      }
    );
  });

  it('deve gerar todos os relatórios', async () => {
    const formularioId = 123;
    const mockResponse = {
      message: 'Relatórios gerados com sucesso',
      reports: [
        { id: 1, tipo: 'completo' },
        { id: 2, tipo: 'resumo' },
      ],
    };

    mockedAxios.post.mockResolvedValue({ data: mockResponse });

    const { result } = renderHook(() => useReports());

    let response;
    await act(async () => {
      response = await result.current.generateAllReports(formularioId);
    });

    expect(response).toEqual(mockResponse);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      'http://localhost:8000/reports/generate-all/',
      { formulario_id: formularioId },
      {
        headers: {
          Authorization: 'Bearer mock-token',
        },
      }
    );
  });

  it('deve fazer download de relatório PDF', async () => {
    const reportId = 1;
    const mockBlob = new Blob(['PDF content'], { type: 'application/pdf' });
    
    // Mock do URL.createObjectURL e revokeObjectURL
    const mockCreateObjectURL = vi.fn(() => 'blob:mock-url');
    const mockRevokeObjectURL = vi.fn();
    Object.defineProperty(window, 'URL', {
      value: {
        createObjectURL: mockCreateObjectURL,
        revokeObjectURL: mockRevokeObjectURL,
      },
    });

    // Mock do createElement e click
    const mockClick = vi.fn();
    const mockAnchor = {
      href: '',
      download: '',
      click: mockClick,
    };
    const mockCreateElement = vi.fn(() => mockAnchor);
    Object.defineProperty(document, 'createElement', {
      value: mockCreateElement,
    });

    mockedAxios.get.mockResolvedValue({ data: mockBlob });

    const { result } = renderHook(() => useReports());

    await act(async () => {
      await result.current.downloadPdfReport(reportId);
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `http://localhost:8000/reports/${reportId}/download/`,
      {
        headers: {
          Authorization: 'Bearer mock-token',
        },
        responseType: 'blob',
      }
    );

    expect(mockCreateObjectURL).toHaveBeenCalledWith(mockBlob);
    expect(mockCreateElement).toHaveBeenCalledWith('a');
    expect(mockAnchor.href).toBe('blob:mock-url');
    expect(mockAnchor.download).toBe(`relatorio_${reportId}.pdf`);
    expect(mockClick).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
  });

  it('deve lidar com erro ao buscar relatórios', async () => {
    const errorMessage = 'Erro de rede';
    mockedAxios.get.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useReports());

    await act(async () => {
      try {
        await result.current.getAllReports();
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(errorMessage);
      }
    });
  });

  it('deve lidar com erro ao gerar relatórios', async () => {
    const errorMessage = 'Erro ao gerar relatórios';
    mockedAxios.post.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useReports());

    await act(async () => {
      try {
        await result.current.generateAllReports(123);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(errorMessage);
      }
    });
  });

  it('deve lidar com erro ao fazer download', async () => {
    const errorMessage = 'Erro ao baixar arquivo';
    mockedAxios.get.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useReports());

    await act(async () => {
      try {
        await result.current.downloadPdfReport(1);
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe(errorMessage);
      }
    });
  });

  it('deve usar token do localStorage para autenticação', async () => {
    localStorageMock.getItem.mockReturnValue('custom-token');

    const { result } = renderHook(() => useReports());

    await act(async () => {
      await result.current.getAllReports();
    });

    expect(mockedAxios.get).toHaveBeenCalledWith(
      'http://localhost:8000/reports/',
      {
        headers: {
          Authorization: 'Bearer custom-token',
        },
      }
    );
  });
});

