import { describe, it, expect } from 'vitest';
import { calculateProgress } from '@/util/calculateProgress';

describe('calculateProgress', () => {
  const mockFormularioData = {
    categorias: [
      { id: 1, sigla: 'GV', categoria: 'Governança' },
      { id: 2, sigla: 'ID', categoria: 'Identificar' },
    ],
    subcategorias: {
      GV: [
        {
          id: 1,
          subcategoria: 'GV.OC',
          perguntas: [
            { id: 1, obrigatoria: true, resposta: 'Sim' },
            { id: 2, obrigatoria: true, resposta: null },
            { id: 3, obrigatoria: false, resposta: 'Não' },
          ],
        },
        {
          id: 2,
          subcategoria: 'GV.RM',
          perguntas: [
            { id: 4, obrigatoria: true, resposta: 'Sim' },
            { id: 5, obrigatoria: true, resposta: 'Parcialmente' },
          ],
        },
      ],
      ID: [
        {
          id: 3,
          subcategoria: 'ID.AM',
          perguntas: [
            { id: 6, obrigatoria: true, resposta: null },
            { id: 7, obrigatoria: true, resposta: 'Sim' },
          ],
        },
      ],
    },
  };

  it('deve calcular progresso corretamente com dados válidos', () => {
    const result = calculateProgress(mockFormularioData);

    expect(result).toEqual({
      percentage: 66.67, // 4 de 6 perguntas obrigatórias respondidas
      completed: 4,
      total: 6,
      byCategory: {
        GV: 75, // 3 de 4 perguntas respondidas
        ID: 50, // 1 de 2 perguntas respondidas
      },
    });
  });

  it('deve retornar 0% quando não há dados', () => {
    const result = calculateProgress({});

    expect(result).toEqual({
      percentage: 0,
      completed: 0,
      total: 0,
      byCategory: {},
    });
  });

  it('deve retornar 0% quando não há subcategorias', () => {
    const result = calculateProgress({
      categorias: [{ id: 1, sigla: 'GV', categoria: 'Governança' }],
      subcategorias: {},
    });

    expect(result).toEqual({
      percentage: 0,
      completed: 0,
      total: 0,
      byCategory: {},
    });
  });

  it('deve ignorar perguntas não obrigatórias no cálculo', () => {
    const dataComNaoObrigatorias = {
      categorias: [{ id: 1, sigla: 'GV', categoria: 'Governança' }],
      subcategorias: {
        GV: [
          {
            id: 1,
            subcategoria: 'GV.OC',
            perguntas: [
              { id: 1, obrigatoria: true, resposta: 'Sim' },
              { id: 2, obrigatoria: false, resposta: null },
              { id: 3, obrigatoria: false, resposta: 'Não' },
            ],
          },
        ],
      },
    };

    const result = calculateProgress(dataComNaoObrigatorias);

    expect(result).toEqual({
      percentage: 100,
      completed: 1,
      total: 1,
      byCategory: {
        GV: 100,
      },
    });
  });

  it('deve lidar com subcategorias sem perguntas', () => {
    const dataSemPerguntas = {
      categorias: [{ id: 1, sigla: 'GV', categoria: 'Governança' }],
      subcategorias: {
        GV: [
          {
            id: 1,
            subcategoria: 'GV.OC',
            perguntas: [],
          },
        ],
      },
    };

    const result = calculateProgress(dataSemPerguntas);

    expect(result).toEqual({
      percentage: 0,
      completed: 0,
      total: 0,
      byCategory: {
        GV: 0,
      },
    });
  });

  it('deve considerar resposta vazia como não respondida', () => {
    const dataComRespostasVazias = {
      categorias: [{ id: 1, sigla: 'GV', categoria: 'Governança' }],
      subcategorias: {
        GV: [
          {
            id: 1,
            subcategoria: 'GV.OC',
            perguntas: [
              { id: 1, obrigatoria: true, resposta: '' },
              { id: 2, obrigatoria: true, resposta: '   ' },
              { id: 3, obrigatoria: true, resposta: 'Sim' },
            ],
          },
        ],
      },
    };

    const result = calculateProgress(dataComRespostasVazias);

    expect(result).toEqual({
      percentage: 33.33,
      completed: 1,
      total: 3,
      byCategory: {
        GV: 33.33,
      },
    });
  });

  it('deve lidar com diferentes tipos de resposta', () => {
    const dataComTiposVariados = {
      categorias: [{ id: 1, sigla: 'GV', categoria: 'Governança' }],
      subcategorias: {
        GV: [
          {
            id: 1,
            subcategoria: 'GV.OC',
            perguntas: [
              { id: 1, obrigatoria: true, resposta: 'Sim' },
              { id: 2, obrigatoria: true, resposta: 0 },
              { id: 3, obrigatoria: true, resposta: 5 },
              { id: 4, obrigatoria: true, resposta: false },
              { id: 5, obrigatoria: true, resposta: true },
            ],
          },
        ],
      },
    };

    const result = calculateProgress(dataComTiposVariados);

    expect(result).toEqual({
      percentage: 80, // 4 de 5 respondidas (0 e false são considerados respondidos)
      completed: 4,
      total: 5,
      byCategory: {
        GV: 80,
      },
    });
  });

  it('deve arredondar percentuais para 2 casas decimais', () => {
    const dataParaArredondamento = {
      categorias: [{ id: 1, sigla: 'GV', categoria: 'Governança' }],
      subcategorias: {
        GV: [
          {
            id: 1,
            subcategoria: 'GV.OC',
            perguntas: [
              { id: 1, obrigatoria: true, resposta: 'Sim' },
              { id: 2, obrigatoria: true, resposta: null },
              { id: 3, obrigatoria: true, resposta: null },
            ],
          },
        ],
      },
    };

    const result = calculateProgress(dataParaArredondamento);

    expect(result.percentage).toBe(33.33);
    expect(result.byCategory.GV).toBe(33.33);
  });
});

