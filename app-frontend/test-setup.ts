import { afterEach, beforeEach, vi } from 'vitest';
import '@testing-library/jest-dom';

// Configurar mocks globais
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
});

// Mock do IntersectionObserver apenas se não existir
if (!window.IntersectionObserver) {
  Object.defineProperty(window, 'IntersectionObserver', {
    value: vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    })),
    writable: true,
  });
}

// Mock do ResizeObserver apenas se não existir
if (!window.ResizeObserver) {
  Object.defineProperty(window, 'ResizeObserver', {
    value: vi.fn().mockImplementation(() => ({
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    })),
    writable: true,
  });
}

// Mock do matchMedia
Object.defineProperty(window, 'matchMedia', {
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
  writable: true,
});

// Suprimir warnings de console durante os testes
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  console.error = vi.fn();
  console.warn = vi.fn();
});

afterEach(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

