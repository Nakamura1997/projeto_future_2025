'use client';

import { useEffect, useMemo, useState } from 'react';
import { FiAlertTriangle, FiCheckCircle, FiInfo } from 'react-icons/fi';
import useAvaliacao from '@/hooks/useAvaliacao';


interface ControleCritico {
  nome: string;
  politica: number;
  pratica: number;
  media: number;
}

export default function ResumoAvaliacao() {
const formularioId = localStorage.getItem("formularioRespondidoId");
const { data, loading, error } = useAvaliacao(Number(formularioId));
const [clienteName, setClienteName] = useState<string | null>(null);

useEffect(() => {
  // Buscar o nome do cliente do localStorage
  const form = JSON.parse(localStorage.getItem("formularioAnaliseCompleto") || '{}');
  const name = form.nome_cliente;
  if (name) {
    setClienteName(name);
  }
}, []);

// Extrai as funções principais (GV, ID, PR, DE, RS, RC)
const funcoes = useMemo(() => {
  console.log('data no resumo', data);
  if (!data?.categorias) return [];
  
  return data.categorias.map((categoria: any) => ({
    nome: categoria.categoria,
    sigla: categoria.sigla,
    media: categoria.media,
    politica: categoria.politica,
    pratica: categoria.pratica,
    status: categoria.status,
    categorias: categoria.subcategorias?.map((subcat: any) => ({
      nome: subcat.categoria,
      sigla: subcat.sigla,
      media: parseFloat(subcat.media),
      politica: parseFloat(subcat.politica),
      pratica: parseFloat(subcat.pratica),
      status: subcat.status,
    })) || []
  }));
}, [data]);

// Calcula as médias de política e prática
const mediaPolitica = useMemo(() => {
  if (funcoes.length === 0) return 0;
  const total = funcoes.reduce((sum, funcao) => sum + funcao.politica, 0);
  return total / funcoes.length;
}, [funcoes]);

const mediaPratica = useMemo(() => {
  if (funcoes.length === 0) return 0;
  const total = funcoes.reduce((sum, funcao) => sum + funcao.pratica, 0);
  return total / funcoes.length;
}, [funcoes]);

// Calcula a média geral
const mediaGeral = useMemo(() => {
  if (funcoes.length === 0) return 0;
  const total = funcoes.reduce((sum, funcao) => sum + funcao.media, 0);
  return total / funcoes.length;
}, [funcoes]);

// Encontra as categorias que precisam de mais atenção (score < 3)

// Mapeamento dos controles críticos por função
const categoriasCriticas = useMemo(() => {
  const criticas: {sigla: string; nome: string; politica: number; pratica: number; media: number}[] = [];
  
  if (!data?.categorias) return criticas;

  data.categorias.forEach((categoria: any) => {
    const politica = parseFloat(categoria.politica);
    const pratica = parseFloat(categoria.pratica);
    const media = parseFloat(categoria.media);
    
    // Verifica se política OU prática estão abaixo de 3
    if (politica < 3 || pratica < 3) {
      criticas.push({
        sigla: categoria.sigla,
        nome: categoria.categoria,
        politica,
        pratica,
        media
      });
    }
  });
  
  return criticas;
}, [data]);

if (loading) return <div>Carregando...</div>;
if (error) return <div>Erro: {error}</div>;
if (!data) return <div>Nenhum dado disponível</div>;

  return (
    <div className="resumo-avaliacao">
      <h3 className="resumo-titulo">Resumo da Avaliação NIST CSF</h3>
      
      {/* Texto padrão conforme solicitado */}
      <div className="resumo-texto-padrao">
        <p>Com base no NIST CSF, no caso específico da {clienteName}, pode-se observar um score médio da companhia de {mediaPolitica.toFixed(2)} para Políticas e {mediaPratica.toFixed(2)} para Prática para os controles avaliados.</p>
        
        <p>Portanto, observa-se que o score está {mediaGeral < 3 ? 'abaixo' : 'acima'} do valor 3.00, que representa um nível de maturidade {mediaGeral < 3 ? 'abaixo' : 'acima'} do recomendado para a organização.</p>
        
        <p>Podemos observar também que alguns controles necessitam uma atenção maior da companhia, como:</p>
        
<ul className="lista-controles-criticos">
  {categoriasCriticas.map((categoria, index) => (
    <li key={index}>
      <strong>{categoria.sigla}</strong> - {categoria.nome} 
      (Política: {categoria.politica.toFixed(2)}, 
      Prática: {categoria.pratica.toFixed(2)}, 
      Média: {categoria.media.toFixed(2)})
    </li>
  ))}
</ul>
        
        <p>O baixo score na maior parte das medidas de controle refletem a necessidade de foco e atenção na criação, políticas, normas e procedimentos para estas medidas de controles e com isto determinar a implementação dos controles e aumentar os scores das medidas associadas à prática efetivamente das medidas de controle.</p>
      </div>

      {/* Seção detalhada (opcional) */}
      <div className="resumo-secao">
        <h4 className="resumo-subtitulo">
          <FiInfo className="icon" /> Detalhes da Avaliação
        </h4>
        
        <div className="resumo-dados">
          <div className="dado-item">
            <span className="dado-label">Média Geral:</span>
            <span className={`dado-valor ${mediaGeral < 3 ? 'baixo' : mediaGeral < 4 ? 'medio' : 'alto'}`}>
              {mediaGeral.toFixed(2)}
            </span>
          </div>
          <div className="dado-item">
            <span className="dado-label">Média Políticas:</span>
            <span>{mediaPolitica.toFixed(2)}</span>
          </div>
          <div className="dado-item">
            <span className="dado-label">Média Práticas:</span>
            <span>{mediaPratica.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}