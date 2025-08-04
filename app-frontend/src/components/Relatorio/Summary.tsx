// Summary.tsx
import { useEffect, useState } from "react";

export default function Summary() {
  const [pageNumbers, setPageNumbers] = useState<Record<string, number>>({});

  useEffect(() => {
    // Carregar números de página do localStorage (se existirem)
    const savedPageNumbers = localStorage.getItem('reportPageNumbers');
    if (savedPageNumbers) {
      setPageNumbers(JSON.parse(savedPageNumbers));
    }
  }, []);

  // Fixed sections in the order you want - TUDO EM UPPERCASE
  const fixedSections = [
    { id: "introducao", title: "INTRODUÇÃO" },
    { id: "resumo", title: "RESUMO" },
    { id: "grafico", title: "CSF – CYBERSECURITY FRAMEWORK – VERSÃO 2.0" },
    { id: "detalhesTecnicos", title: "CSF – CYBERSECURITY FRAMEWORK" },
    { id: "GV", title: "GOVERNAR (GV)", level: 1 },
    { id: "ID", title: "IDENTIFICAR (ID)", level: 1 },
    { id: "PR", title: "PROTEGER (PR)", level: 1 },
    { id: "DE", title: "DETECTAR (DE)", level: 1 },
    { id: "RS", title: "RESPONDER (RS)", level: 1 },
    { id: "RC", title: "RECUPERAR (RC)", level: 1 },
    { id: "plano-acao", title: "PLANO DE AÇÃO INICIAL – 6 MESES" }
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  // Function to generate dots between title and page number
  const generateDots = (title: string) => {
    const containerWidth = 600; // Largura aproximada do container
    const titleWidth = title.length * 8; // Largura aproximada do título
    const pageNumWidth = 30; // Largura aproximada do número da página
    const availableSpace = containerWidth - titleWidth - pageNumWidth;
    const dotCount = Math.floor(availableSpace / 4); // Largura aproximada por ponto
    
    return Array(dotCount).fill('.').join('');
  };

  return (
    <div className="summary-container">
      <h2 className="summary-title">SUMMARY</h2>
      <ul className="summary-list">
        {fixedSections.map((section) => (
          <li 
            key={section.id} 
            className={`summary-item ${section.level ? 'level-' + section.level : ''}`}
            onClick={() => scrollToSection(section.id)}
          >
            <span className="summary-link">
              {section.title}
              {pageNumbers[section.id] && (
                <>
                  <span className="summary-dots">
                    {generateDots(section.title)}
                  </span>
                  <span className="summary-page-number">
                    {pageNumbers[section.id]}
                  </span>
                </>
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}