import { renderHook, act } from '@testing-library/react';
import { useLogin } from '@/hooks/useLogin';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';

// Mock do axios
vi.mock('axios');
const mockedAxios = vi.mocked(axios, true);

// Mock do useRouter
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}));

// Mock do localStorage
const localStorageMock = {
  setItem: vi.fn(),
  getItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('useLogin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedAxios.post.mockResolvedValue({ data: {} });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('deve fazer login com sucesso e redirecionar baseado na role', async () => {
    const mockResponse = {
      data: {
        access: 'token-de-acesso',
        refresh: 'token-de-refresh',
        user: { id: 1, name: 'Michelle', role: 'gestor' },
      },
    };

    mockedAxios.post.mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      await result.current.login('michelle@example.com', 'senha123');
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.token).toBe('token-de-acesso');
    expect(result.current.user).toEqual({ 
      id: 1, 
      name: 'Michelle', 
      role: 'gestor' 
    });

    // Verificar se os tokens foram salvos no localStorage
    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'token-de-acesso');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('refreshToken', 'token-de-refresh');
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'user',
      JSON.stringify({ id: 1, name: 'Michelle', role: 'gestor' })
    );

    // Verificar redirecionamento
    expect(mockPush).toHaveBeenCalledWith('/gestor');
  });

  it('deve redirecionar para página correta baseado na role do usuário', async () => {
    const testCases = [
      { role: 'cliente', expectedPath: '/cliente' },
      { role: 'analista', expectedPath: '/analista' },
      { role: 'gestor', expectedPath: '/gestor' },
    ];

    for (const testCase of testCases) {
      vi.clearAllMocks();
      
      const mockResponse = {
        data: {
          access: 'token',
          refresh: 'refresh-token',
          user: { id: 1, name: 'User', role: testCase.role },
        },
      };

      mockedAxios.post.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useLogin());

      await act(async () => {
        await result.current.login('user@example.com', 'password');
      });

      expect(mockPush).toHaveBeenCalledWith(testCase.expectedPath);
    }
  });

  it('deve lidar com erro de login', async () => {
    const errorMessage = 'Credenciais inválidas';
    mockedAxios.post.mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useLogin());

    await act(async () => {
      try {
        await result.current.login('user@example.com', 'wrong-password');
      } catch (error) {
        // Erro é tratado internamente pelo hook
      }
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
    expect(result.current.token).toBe(null);
    expect(result.current.user).toBe(null);
  });

  it('deve definir estado de loading durante o login', async () => {
    let resolvePromise: (value: any) => void;
    const loginPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    mockedAxios.post.mockReturnValue(loginPromise);

    const { result } = renderHook(() => useLogin());

    // Iniciar login
    act(() => {
      result.current.login('user@example.com', 'password');
    });

    // Verificar que loading está true
    expect(result.current.loading).toBe(true);

    // Resolver promise
    await act(async () => {
      resolvePromise!({
        data: {
          access: 'token',
          refresh: 'refresh',
          user: { id: 1, name: 'User', role: 'cliente' },
        },
      });
      await loginPromise;
    });

    // Verificar que loading voltou para false
    expect(result.current.loading).toBe(false);
  });

  it('deve limpar erro ao fazer novo login', async () => {
    const { result } = renderHook(() => useLogin());

    // Primeiro login com erro
    mockedAxios.post.mockRejectedValueOnce(new Error('Erro inicial'));

    await act(async () => {
      try {
        await result.current.login('user@example.com', 'wrong-password');
      } catch (error) {
        // Erro tratado internamente
      }
    });

    expect(result.current.error).toBe('Erro inicial');

    // Segundo login com sucesso
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        access: 'token',
        refresh: 'refresh',
        user: { id: 1, name: 'User', role: 'cliente' },
      },
    });

    await act(async () => {
      await result.current.login('user@example.com', 'correct-password');
    });

    expect(result.current.error).toBe(null);
  });
});

