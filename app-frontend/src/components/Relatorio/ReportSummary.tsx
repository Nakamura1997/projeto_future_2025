// components/Relatorio/ReportSummary.tsx
import React from 'react';

type ReportSummaryProps = {
  data: any; // Dados do useAvaliacao
  isEditing: boolean;
};

const ReportSummary: React.FC<ReportSummaryProps> = ({ data, isEditing }) => {
  const summaryContentRef = React.useRef<HTMLDivElement>(null);
  const mainTitleContentRef = React.useRef<HTMLDivElement>(null);
  const subtitleContentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Conteúdo padrão para o sumário executivo
    if (summaryContentRef.current && !summaryContentRef.current.innerHTML) {
      summaryContentRef.current.innerHTML = `
        <p>Este relatório apresenta uma análise detalhada da maturidade em cibersegurança da organização, 
        baseada no framework NIST CSF (versão 2.0). O objetivo é fornecer uma abordagem abrangente e adaptável para gerenciar riscos, otimizar recursos e proteger ativos críticos.</p>
        <p>Com base na avaliação, a Empresa X obteve um score médio de <strong>${data?.mediaEmpresa?.mediaPolitica?.toFixed(2)}</strong> para Políticas e <strong>${data?.mediaEmpresa?.mediaPratica?.toFixed(2)}</strong> para Práticas nos controles avaliados. Observa-se que este score está abaixo do valor objetivo de 3.00, indicando um nível de maturidade inferior ao recomendado para a organização.</p>
        <p>As áreas que demandam maior atenção incluem:</p>
        <ul>
          <li><strong>GOVERNAR:</strong> nas medidas de controles de Política e Supervisão. </li>
          <li><strong>IDENTIFICAR:</strong> nas medidas de controles de Melhoria. </li>
          <li><strong>PROTEGER:</strong> nas medidas de controles de Conscientização e Treinamento. </li>
          <li><strong>DETECTAR:</strong> nas medidas de controles de Análise de Eventos Adversos. </li>
          <li><strong>RESPONDER:</strong> nas medidas de controles de Gerenciamento de Incidentes, Análise de Incidentes, Comunicação e Relatórios de Resposta à Incidentes e Mitigação de Incidentes. </li>
          <li><strong>RECUPERAR:</strong> nas medidas de controles de Comunicação de Recuperação de Incidentes. </li>
        </ul>
        <p>O baixo score na maioria das medidas de controle reflete a necessidade de foco e atenção na criação de políticas, normas e procedimentos, visando a implementação efetiva dos controles e o aumento dos scores de prática.</p>
      `;
    }

    if (mainTitleContentRef.current && !mainTitleContentRef.current.innerHTML) {
        mainTitleContentRef.current.innerHTML = `SUMÁRIO EXECUTIVO`;
    }
    if (subtitleContentRef.current && !subtitleContentRef.current.innerHTML) {
        subtitleContentRef.current.innerHTML = `Visão Geral da Avaliação de Maturidade em Cibersegurança`;
    }
  }, [data]);

  return (
    <div className="report-section">
      <h3
        ref={mainTitleContentRef}
        className={`editable-title ${isEditing ? 'editing' : ''}`}
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
      />
      <h4
        ref={subtitleContentRef}
        className={`editable-subtitle ${isEditing ? 'editing' : ''}`}
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
      />
      <div
        ref={summaryContentRef}
        className={`editable-content ${isEditing ? 'editing' : ''}`}
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
      />
    </div>
  );
};

export default ReportSummary;