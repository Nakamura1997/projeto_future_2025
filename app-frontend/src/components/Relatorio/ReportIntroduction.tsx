// components/Relatorio/ReportIntroduction.tsx
import React from 'react';

type ReportIntroductionProps = {
  isEditing: boolean;
};

const ReportIntroduction: React.FC<ReportIntroductionProps> = ({ isEditing }) => {
  const introContentRef = React.useRef<HTMLDivElement>(null);
  const mainTitleContentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (introContentRef.current && !introContentRef.current.innerHTML) {
      introContentRef.current.innerHTML = `
        <p>A Estrutura de Segurança Cibernética (CSF) 2.0 do NIST (National Institute of Standards and Technology) fornece orientação ao setor, aos órgãos governamentais e a outras organizações para gerenciar os riscos de segurança cibernética. É um guia completo e flexível que auxilia organizações de qualquer porte ou setor a gerenciar e reduzir seus riscos de segurança cibernética.</p>
        <p>O NIST CSF 2.0 oferece uma taxonomia de resultados de segurança cibernética de alto nível que pode ser usada por qualquer organização, independentemente de seu tamanho, setor ou maturidade, para entender, avaliar, priorizar e comunicar melhor seus esforços de segurança cibernética. Ele oferece uma estrutura padronizada para entender, avaliar e aprimorar a postura de segurança cibernética de uma organização, promovendo a comunicação e a colaboração entre as partes interessadas.</p>
        <h3>Como o NIST CSF 2.0 funciona? </h3>
        <p>O framework se estrutura em cinco funções principais, e uma nova função introduzida na versão 2.0:</p>
        <ul>
          <li><strong>Identificar:</strong> Compreender o ambiente, os sistemas, ativos, dados e capacidades da organização relacionados à segurança cibernética. </li>
          <li><strong>Proteger:</strong> Implementar salvaguardas para garantir a continuidade dos serviços críticos, como controles de acesso, criptografia e gerenciamento de vulnerabilidades. </li>
          <li><strong>Detectar:</strong> Identificar eventos de segurança cibernética por meio de monitoramento contínuo, detecção de intrusões e análise de logs. </li>
          <li><strong>Responder:</strong> Desenvolver e implementar ações para lidar com eventos de segurança cibernética, como contenção, erradicação e recuperação de dados. </li>
          <li><strong>Recuperar:</strong> Restaurar serviços e capacidades afetados por um incidente de segurança cibernética, incluindo planos de recuperação de desastres e continuidade de negócios. </li>
        </ul>
        <p>Além disso, o NIST CSF 2.0 introduziu a função <strong>Governar</strong>, que destaca a importância da liderança e da tomada de decisões estratégicas na segurança cibernética.  Isso inclui:</p>
        <ol>
          <li>Definir prioridades: Identificar ativos críticos, ameaças relevantes e riscos prioritários. </li>
          <li>Estabelecer estruturas de gerenciamento de riscos: Criar processos e responsabilidades para lidar com os riscos de segurança cibernética. </li>
          <li>Promover uma cultura de segurança cibernética: Conscientizar e treinar colaboradores, incentivando a responsabilidade compartilhada pela segurança. </li>
          <li>Supervisionar e avaliar: Monitorar a eficácia das práticas de segurança cibernética e realizar ajustes quando necessário. </li>
        </ol>
        <h3>Benefícios do NIST CSF 2.0:</h3>
        <ul>
          <li>Redução de riscos: Minimiza a probabilidade e o impacto de incidentes de segurança cibernética. </li>
          <li>Comunicação e colaboração: Facilita o diálogo sobre segurança cibernética entre as partes interessadas. </li>
          <li>Conformidade regulatória: Auxilia no atendimento a requisitos de conformidade, como a LGPD. </li>
          <li>Confiança das partes interessadas: Demonstra o compromisso da organização com a segurança cibernética. </li>
          <li>Resiliência cibernética: Fortalece a capacidade da organização de se preparar, responder e se recuperar de incidentes. </li>
        </ul>
        <p>O NIST CSF 2.0 é um recurso valioso para qualquer organização que busca fortalecer sua postura de segurança cibernética.  Ele oferece uma abordagem abrangente e adaptável para gerenciar riscos, otimizar recursos e proteger ativos críticos.  Na avaliação de maturidade proposta neste documento, foram capturados os níveis de cada medida de controle conforme os níveis de maturidade estabelecidos na tabela a seguir.  A meta é que a organização tenha pelo menos nível de maturidade nível 3 definido tanto para a Política, quanto para a Prática. </p>
      `;
    }
    if (mainTitleContentRef.current && !mainTitleContentRef.current.innerHTML) {
        mainTitleContentRef.current.innerHTML = `INTRODUÇÃO`;
    }
  }, []);

  return (
    <div className="report-section">
      <h3
        ref={mainTitleContentRef}
        className={`editable-title ${isEditing ? 'editing' : ''}`}
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
      />
      <div
        ref={introContentRef}
        className={`editable-content ${isEditing ? 'editing' : ''}`}
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
      />
    </div>
  );
};

export default ReportIntroduction;