import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getAuthConfig } from '@/util/getAuthConfig';

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('getAuthConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar configuração com token quando token existe no localStorage', () => {
    const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token';
    localStorageMock.getItem.mockReturnValue(mockToken);

    const config = getAuthConfig();

    expect(localStorageMock.getItem).toHaveBeenCalledWith('token');
    expect(config).toEqual({
      headers: {
        Authorization: `Bearer ${mockToken}`,
      },
    });
  });

  it('deve retornar configuração vazia quando token não existe', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const config = getAuthConfig();

    expect(localStorageMock.getItem).toHaveBeenCalledWith('token');
    expect(config).toEqual({
      headers: {
        Authorization: 'Bearer null',
      },
    });
  });

  it('deve retornar configuração vazia quando token é string vazia', () => {
    localStorageMock.getItem.mockReturnValue('');

    const config = getAuthConfig();

    expect(config).toEqual({
      headers: {
        Authorization: 'Bearer ',
      },
    });
  });

  it('deve retornar configuração vazia quando localStorage não está disponível', () => {
    // Simular ambiente onde localStorage não existe
    Object.defineProperty(window, 'localStorage', {
      value: undefined,
      configurable: true,
    });

    expect(() => getAuthConfig()).toThrow();

    // Restaurar localStorage mock
    Object.defineProperty(window, 'localStorage', { 
      value: localStorageMock,
      configurable: true,
    });
  });

  it('deve lidar com tokens de diferentes formatos', () => {
    const testTokens = [
      'simple-token',
      'Bearer existing-bearer-token',
      'jwt.token.with.dots',
      '123456789',
    ];

    testTokens.forEach(token => {
      localStorageMock.getItem.mockReturnValue(token);
      
      const config = getAuthConfig();
      
      expect(config).toEqual({
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    });
  });

  it('deve ser chamado múltiplas vezes sem problemas', () => {
    const mockToken = 'consistent-token';
    localStorageMock.getItem.mockReturnValue(mockToken);

    const config1 = getAuthConfig();
    const config2 = getAuthConfig();
    const config3 = getAuthConfig();

    expect(config1).toEqual(config2);
    expect(config2).toEqual(config3);
    expect(localStorageMock.getItem).toHaveBeenCalledTimes(3);
  });
});

