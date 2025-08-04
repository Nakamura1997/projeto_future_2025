import { useState, useEffect, useRef } from 'react';

export const useReportEditing = () => {
  const [isEditing, setIsEditing] = useState(false);
  const summaryContentRef = useRef<HTMLDivElement>(null);
  const detailsContentRef = useRef<HTMLDivElement>(null);
  const recommendationsContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (summaryContentRef.current && !summaryContentRef.current.innerHTML) {
      summaryContentRef.current.innerHTML = `
        <p>Este relatório apresenta uma análise detalhada da maturidade em cibersegurança da organização, 
        baseada no framework NIST CSF. O gráfico radar mostra o desempenho em cada categoria, enquanto 
        as tabelas detalham os resultados por função.</p>
      `;
    }

    if (detailsContentRef.current && !detailsContentRef.current.innerHTML) {
      detailsContentRef.current.innerHTML = `
        <p>A análise técnica revela os pontos fortes e as áreas que necessitam de melhoria em cada 
        categoria do framework NIST CSF. Abaixo estão os detalhes específicos para cada domínio avaliado.</p>
      `;
    }

    if (recommendationsContentRef.current && !recommendationsContentRef.current.innerHTML) {
      recommendationsContentRef.current.innerHTML = `
        <p>Com base na avaliação realizada, recomendamos as seguintes ações para melhorar a postura 
        de cibersegurança da organização:</p>
        <ul>
          <li>Implementar controles adicionais nas áreas com menor maturidade</li>
          <li>Realizar treinamentos regulares de conscientização</li>
          <li>Atualizar políticas e procedimentos de segurança</li>
        </ul>
      `;
    }
  }, []);

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  return {
    isEditing,
    toggleEditing,
    summaryContentRef,
    detailsContentRef,
    recommendationsContentRef,
  };
};