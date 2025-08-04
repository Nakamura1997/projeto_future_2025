import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSidebarCollapsed } from '@/hooks/useSidebarCollapsed';

// Mock do MutationObserver
const mockObserver = {
  observe: vi.fn(),
  disconnect: vi.fn(),
};

const mockMutationObserver = vi.fn().mockImplementation(() => mockObserver);
Object.defineProperty(window, 'MutationObserver', {
  value: mockMutationObserver,
});

describe('useSidebarCollapsed', () => {
  let sidebarElement: HTMLElement;

  beforeEach(() => {
    // Criar elemento sidebar no DOM
    sidebarElement = document.createElement('div');
    sidebarElement.id = 'sidebar';
    document.body.appendChild(sidebarElement);
    
    // Limpar mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Limpar DOM
    document.body.innerHTML = '';
  });

  it('deve retornar false quando sidebar não tem classe collapsed', () => {
    const { result } = renderHook(() => useSidebarCollapsed());
    
    expect(result.current).toBe(false);
  });

  it('deve retornar true quando sidebar tem classe collapsed', () => {
    sidebarElement.classList.add('collapsed');
    
    const { result } = renderHook(() => useSidebarCollapsed());
    
    expect(result.current).toBe(true);
  });

  it('deve usar ID personalizado quando fornecido', () => {
    // Criar sidebar com ID personalizado
    const customSidebar = document.createElement('div');
    customSidebar.id = 'custom-sidebar';
    customSidebar.classList.add('collapsed');
    document.body.appendChild(customSidebar);
    
    const { result } = renderHook(() => useSidebarCollapsed('custom-sidebar'));
    
    expect(result.current).toBe(true);
  });

  it('deve configurar MutationObserver para observar mudanças de classe', () => {
    renderHook(() => useSidebarCollapsed());
    
    expect(mockMutationObserver).toHaveBeenCalledWith(expect.any(Function));
    expect(mockObserver.observe).toHaveBeenCalledWith(
      sidebarElement,
      { attributes: true, attributeFilter: ['class'] }
    );
  });

  it('deve desconectar observer na limpeza', () => {
    const { unmount } = renderHook(() => useSidebarCollapsed());
    
    unmount();
    
    expect(mockObserver.disconnect).toHaveBeenCalled();
  });

  it('deve lidar com sidebar inexistente', () => {
    // Remover sidebar do DOM
    document.body.innerHTML = '';
    
    const { result } = renderHook(() => useSidebarCollapsed());
    
    expect(result.current).toBe(false);
    expect(mockObserver.observe).not.toHaveBeenCalled();
  });

  it('deve reagir a mudanças na classe do sidebar', () => {
    let mutationCallback: MutationCallback;
    
    mockMutationObserver.mockImplementation((callback) => {
      mutationCallback = callback;
      return mockObserver;
    });
    
    const { result } = renderHook(() => useSidebarCollapsed());
    
    // Estado inicial
    expect(result.current).toBe(false);
    
    // Simular mudança de classe
    act(() => {
      sidebarElement.classList.add('collapsed');
      // Simular callback do MutationObserver
      mutationCallback([], mockObserver as any);
    });
    
    expect(result.current).toBe(true);
  });
});

