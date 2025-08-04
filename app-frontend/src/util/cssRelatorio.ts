export const CSS = `

body, html {
  background: white !important;
  box-shadow: none !important;
  color-adjust: exact !important;
  -webkit-print-color-adjust: exact !important;
  margin: 0;
}

.categoria-detalhes{
  background: white !important;
  box-shadow: none !important;
  color-adjust: exact !important;
  -webkit-print-color-adjust: exact !important;
}

* {
  box-shadow: none !important;
  border: none !important;
}
.detalhes-tecnicos,
.categoria-section {
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-size: 14pt;
  line-height: 1.6;
  color: #333;
  background-color: white;
}

/* Estilo geral da seção de detalhes */
.detalhes-tecnicos {
  margin-top: 2rem;
  padding: 0;
}



/* Cabeçalho da categoria */
.categoria-header {
  margin-bottom: 1rem;
}

.categoria-header h2 {
  margin: 0;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.introducao-categoria p {
  margin: 1rem 0;
  font-style: normal;
  font-size: 18px !important;
  text-align: justify;

}

.definicao-lista h3 {
  margin-bottom: 0.5rem;
}

.definicao-lista ul {
  list-style-type: disc;
  margin: 0;
  padding-left: 70px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 10px;
  text-align: justify;
}

/* Métricas (política, prática, objetivo) */
.categoria-metricas {
  display: flex;
  gap: 2rem;
  margin: 1rem 0;
}

.metrica {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.metrica-label {
  font-weight: bold;
}

.metrica-valor {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.metrica-valor.baixo {
  background: white;
  color: #ff4d4f;
  font-weight: bold;
}

/* Status geral da categoria */
.status {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
}

.status.critico {
  background: white;
  color: #ff4d4f;
}

.status.insuficiente {
  background: #fffbe6;
  color: #faad14;
}

.status.adequado {
  background: #f6ffed;
  color: #52c41a;
}

.status.avancado {
  background: #e6f7ff;
  color: #1890ff;
}

.subcategoria {
}
/* Subcategorias e controles */
.subcategorias-nist {
  margin-top: 1rem;
}

.subcategorias-nist .subcategoria {
  margin-bottom: 1.5rem;
}

.subcategorias-nist h4 {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.subcategorias-nist ul {
  list-style-type: square;
  padding-left: 1.5rem;
  margin: 0;
  list-style-type: disc;
  margin: 0;
  padding-left: 70px;
  padding-top: 10px;
  padding-bottom: 10px;
  padding-right: 10px;
  text-align: justify;
}

.subcategorias-nist li {
  margin: 0.25rem 0;
}

/* Observações e recomendações */
.observacoes-criticas {
  margin-top: 1rem;
  padding: 1rem;
  background: #fff2f0;
  border-radius: 4px;
}

.observacoes-criticas h3 {
  margin: 0 0 0.5rem;
  color: #ff4d4f;
}
.score-table {
  width: 100%;
  border-collapse: collapse;
  margin: 15px 0;
  border: 1px solid #ddd;
}

.score-table td {
  padding: 8px 12px;
  border: 1px solid #ddd;
}

.score-table strong {
  font-weight: bold;
}

.low-score-text {
  font-size: 16px;
  margin-top: 20px;
}

.low-score-text strong {
  font-weight: bold;
  color: #d35400; /* Tom mais escuro de laranja para o texto em negrito */
}

.low-score-table {
  margin-top: 15px;
  overflow-x: auto;
}

.low-score-table table {
  width: 100%;
  border-collapse: collapse;
}

.low-score-table th,
.low-score-table td {
  padding: 8px 12px;
  border: 1px solid var(--categoria-color);
  text-align: left;
}

.low-score-table th {
  background-color: rgba(0, 0, 0, 0.1);
  font-weight: bold;
  color: inherit;
}

.low-score-text {
  font-size: 14px;
  margin: 20px 0;
}

/* Table styles */
.low-score-table {
  width: 100%;
  overflow-x: auto;
  margin: 20px 0;
}

.low-score-table table {
  width: 100%;
  border-collapse: collapse;
}

.low-score-table th,
.low-score-table td {
  padding: 10px;
  text-align: left;
}

.low-score-table th {
  font-weight: bold;
  color: black;
}

.low-score-table tr:nth-child(even) {
  background-color: rgba(0, 0, 0, 0.05);
}

.score-bar-container {
  width: 100%;
  height: 24px;
  background-color: #f0f0f0;
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.score-bar {
  height: 100%;
  border-radius: 12px;
  transition: width 0.5s ease;
}

.score-value {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-weight: bold;
  font-size: 12px;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  z-index: 1;
}

.score-table {
  width: 100%;
  border-collapse: collapse;
}

.score-table td {
  padding: 8px 12px;
  border: 1px solid #ddd;
}

.score-table strong {
  color: #333;
}

.td-categoria {
  width: 200px;
  font-weight: bold;
}
.td-politica {
  width: 150px;
}

    .modal-overlay-report {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-report {
      background-color: white;
      width: 80%;
      margin-top: 50px;
      margin-left: 10%;
      max-height: 80vh;
      overflow-y: auto;
    }
    .modal-report::-webkit-scrollbar {
      width: 12px;
    }
    .modal-report::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    .modal-report::-webkit-scrollbar-thumb {
      background-color: #ff8c00;
      border-radius: 10px;
      border: 3px solid #f1f1f1;
    }
    .modal-report::-webkit-scrollbar-thumb:hover {
      background-color: #e67e00;
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 40px;
      padding: 0 16px;
    }
    .report-actions {
      display: flex;
      justify-content: space-between;
    }
    .btn-close {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ff9900;
      transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out;
      border-radius: 4px;
    }
    .btn-close:hover {
      color: #cc6600;
      background-color: rgba(255, 153, 0, 0.1);
    }
    .btn-close:focus {
      outline: 2px solid #ff9900;
      outline-offset: 2px;
    }
    .modal-body {
      padding: 10px;
    }
    .report-content {
      margin: 10px;
      padding: 20px;
    }
    .editable-content {
      min-height: 150px;
      padding: 1rem;
      background-color: white;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 1rem;
      line-height: 1.6;
      color: #222;
      transition: border-color 0.3s, box-shadow 0.3s;
      white-space: pre-wrap;
      word-wrap: break-word;
    }
    .editable-content.editing {
      border-color: #0070f3;
      box-shadow: 0 0 0 3px rgba(0, 112, 243, 0.2);
      outline: none;
    }
.report-section {
  border: none !important;
  box-shadow: none !important;
}
    .report-section h4 {
      font-weight: 700;
      font-size: 1.4rem;
      margin-bottom: 1rem;
      color: #0078d4;
    }
    .report-section > div:first-child {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }
    .report-section > div:first-child img {
      width: 80px;
      height: 80px;
      object-fit: contain;
      border-radius: 50%;
      border: 2px solid #0078d4;
      background-color: rgb(190, 42, 42);
      padding: 5px;
    }
    .report-section p {
      line-height: 1.5;
      font-size: 1rem;
    }
    .report-section h5, .report-section h3 {
      margin-top: 1.5rem;
      margin-bottom: 0.75rem;
      font-weight: 600;
      color: #005a9e;
    }
    .report-section ul, .report-section ol {
      list-style: disc inside;
      margin-left: 1rem;
      color: #444;
      line-height: 1.4;
      font-size: 0.95rem;
    }

    .report-section strong {
      color: #004b8d;
    }
    .justify {
      text-align: justify;
    }
    .maturity-table {
      width: 100%;
      border-collapse: collapse;
    }
    .maturity-table th,
    .maturity-table td {
      border: 1px solid #f4a460;
      padding: 12px;
    }
    .maturity-table th {
      background-color: #ffe4c4;
    }
    .maturity-table tr:nth-child(even) {
      background-color: #fff5ee;
    }
    .table-niveis {
      background-color: white;
      border: none;
    }
    .resumo-avaliacao {
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      color: #333;
      max-width: 1000px;
      margin: 0 auto;
      padding: 20px;
      border: none;
    }
    .resumo-titulo {
      color: #2c3e50;
      border-bottom: 2px solid #3498db;
      padding-bottom: 10px;
    }
    .resumo-subtitulo {
      color: #2980b9;
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 25px 0 15px;
    }
    .resumo-subtitulo .icon {
      font-size: 1.2em;
    }
    .resumo-dados {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      margin-bottom: 15px;
    }
    .dado-item {
      display: flex;
      gap: 5px;
      align-items: center;
    }
    .dado-label {
      font-weight: 600;
    }
    .dado-valor {
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 4px;
    }
    .dado-valor.baixo {
      background-color: #ffdddd;
      color: #d63031;
    }
    .dado-valor.medio {
      background-color: #fff4dd;
      color: #f39c12;
    }
    .dado-valor.alto {
      background-color: #ddffdd;
      color: #27ae60;
    }
    .funcoes-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }
    .funcao-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .funcao-cabecalho {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }
    .funcao-cabecalho h5 {
      margin: 0;
      color: #2c3e50;
    }
    .status-badge {
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 0.8em;
      font-weight: 600;
    }
    .status-badge.bom {
      background-color: #d5f5e3;
      color: #27ae60;
    }
    .status-badge.regular {
      background-color: #fef9e7;
      color: #f39c12;
    }
    .status-badge.excelente {
      background-color: #e8f8f5;
      color: #16a085;
    }
    .funcao-dados {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .lista-critica {
      list-style-type: none;
      padding: 0;
      margin: 10px 0 20px;
    }
    .lista-critica li {
      padding: 8px 12px;
      margin-bottom: 5px;
      background-color: #fff8e1;
      border-left: 4px solid #ffc107;
    }
    .controles-criticos {
      margin: 10px 0 20px;
    }
    .controle-item {
      padding: 12px;
      margin-bottom: 10px;
      background-color: #ffebee;
      border-left: 4px solid #e53935;
      border-radius: 4px;
    }
    .controle-cabecalho {
      display: flex;
      justify-content: space-between;
      margin-bottom: 5px;
      font-size: 0.9em;
    }
    .controle-score {
      color: #e53935;
      font-weight: 600;
    }
    .controle-descricao {
      font-size: 0.9em;
      color: #555;
    }
    .sem-criticos {
      padding: 10px;
      background-color: #e8f5e9;
      color: #2e7d32;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 10px 0 20px;
    }
    .lista-recomendacoes {
      padding-left: 20px;
    }
    .lista-recomendacoes li {
      margin-bottom: 8px;
    }
    .detalhes-tecnicos {
      margin-top: 2rem;
      background: #f9f9f9;
    }

    .categoria-header {
      margin-bottom: 1rem;
    }
    .categoria-header h4 {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .descricao {
      color: #666;
      font-style: italic;
      margin: 0.5rem 0 0;
    }
    .categoria-metricas {
      display: flex;
      gap: 2rem;
      margin: 1rem 0;
    }
    .metrica {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    .metrica-label {
      font-weight: bold;
    }
    .metrica-valor {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
    }
    .metrica-valor.baixo {
      background: #fff2f0;
      color: #ff4d4f;
      font-weight: bold;
    }
    .status {
      display: inline-flex;
      align-items: center;
      gap: 0.3rem;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.9rem;
    }
    .status.critico {
      background: #fff2f0;
      color: #ff4d4f;
    }
    .status.insuficiente {
      background: #fffbe6;
      color: #faad14;
    }
    .status.adequado {
      background: #f6ffed;
      color: #52c41a;
    }
    .status.avancado {
      background: #e6f7ff;
      color: #1890ff;
    }
    .subcategorias {
      margin-top: 1rem;
    }
    .subcategorias ul {
      list-style: none;
      padding: 0;
      margin: 0.5rem 0 0;
    }
    .subcategorias li {
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;
    }
    .observacoes-criticas {
      margin-top: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 4px;
    }
    .observacoes-criticas h5 {
      margin: 0 0 0.5rem;
      color: #ff4d4f;
    }
    .introducao-categoria {
      margin: 1rem 0;
      line-height: 1.6;
    }
    .definicao-lista ul {
      list-style-type: disc;
      padding-left: 1.5rem;
    }
    .subcategorias-nist .subcategoria {
      margin-bottom: 1.5rem;
    }
    .subcategorias-nist ul {
      list-style-type: square;
      padding-left: 1.5rem;
    }

    .pageA4 {
      width: 21cm;
      height: 29.7cm;
      padding: 2cm;
      background-color: white;
      border: 1px solid #ccc;
      margin: auto;
      box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
      box-sizing: border-box;
    }
    .pageA4Intro {
      box-shadow: 0 0 5px rgba(187, 18, 18, 0.1);
      box-sizing: border-box;
      background-color: #005a9e;
    }
.report-page {
  page-break-before: always !important;
  break-before: page !important;

  page-break-after: always !important;
  break-after: page !important;

  page-break-inside: avoid !important;
  break-inside: avoid !important;

  min-height: auto; /* ou até remova */
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.detalhes-tecnicos .report-page:not(:first-child) {
  page-break-before: always;
}
    .report-page:first-child {
      page-break-before: auto !important;
      break-before: auto !important;
    }

    .report-page:last-child {
      page-break-after: auto !important;
      break-after: auto !important;
    }

    .report-section {
      break-inside: avoid !important;
      page-break-inside: avoid !important;
    }

    .footer {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 40px;
      box-sizing: border-box;
      font-size: 10pt;
      padding-top: 5px;
    }
    .footer-logo {
      width: 100px;
    }
    .footer-logo img {
      max-width: 80px;
      height: auto;
    }
    .footer-text {
      text-align: center;
      color: rgb(180, 117, 1);
    }
    .footer-page-number {
      width: 100px;
      text-align: right;
    }
    .force-white-bg {
      background-color: white !important;
      background-image: none !important;
    }
    .container {
      display: flex;
    }
    .main {
      flex: 1;
      padding: 24px;
    }
    .collapsed {
      margin-left: 80px;
    }
    .header-relatorio {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    h1 {
      font-size: 24px;
      font-weight: bold;
    }
    .generate-button {
      background-color: orange;
      color: white;
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .generate-button:hover {
      background-color: darkorange;
    }
    .generate-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .error {
      background-color: #fdd;
      color: #a00;
      padding: 10px;
      border: 1px solid #a00;
      margin-bottom: 20px;
      border-radius: 5px;
    }
    .loading,
    .no-reports {
      color: #666;
      margin-top: 16px;
    }
    .report-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 16px;
    }
    .report-table th,
    .report-table td {
      padding: 12px;
      border: 1px solid #ccc;
      text-align: left;
    }
    .report-table th {
      background-color: #f5f5f5;
    }
    .capitalize {
      text-transform: capitalize;
    }
    .action-button {
      background-color: #3498db;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
      cursor: pointer;
    }
    .action-button:hover {
      background-color: #2980b9;
    }
    .action-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .recomendacoes-container {
      margin-top: 1.5rem;
      border-top: 1px solid #e2e8f0;
      padding-top: 1rem;
    }
    .recomendacoes-container h6 {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 1rem;
      color: #2d3748;
    }
    .recomendacao-card {
      background-color: white;
      border-radius: 0.5rem;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 1.5rem;
      overflow: hidden;
    }
    .recomendacao-header {
      padding: 1rem;
      background-color: #f7fafc;
      border-bottom: 1px solid #e2e8f0;
    }
    .recomendacao-id-prioridade {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }
    .recomendacao-id {
      font-weight: 600;
      color: #4a5568;
    }
    .recomendacao-prioridade {
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.8rem;
      font-weight: 600;
    }
    .recomendacao-prioridade.alta {
      background-color: #fff5f5;
      color: #c53030;
    }
    .recomendacao-prioridade.media {
      background-color: #fffaf0;
      color: #c05621;
    }
    .recomendacao-prioridade.baixa {
      background-color: #f0fff4;
      color: #2f855a;
    }
    .recomendacao-titulo {
      font-size: 1.1rem;
      font-weight: 600;
      color: #2d3748;
      margin: 0;
    }
    .recomendacao-body {
      padding: 1rem;
    }
    .recomendacao-meta {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #edf2f7;
    }
    .meta-item {
      display: flex;
      flex-direction: column;
    }
    .meta-label {
      font-size: 0.8rem;
      color: #718096;
      margin-bottom: 0.25rem;
    }
    .meta-value {
      font-weight: 500;
      color: #4a5568;
    }
    .recomendacao-detalhes h6,
    .recomendacao-riscos h6,
    .recomendacao-justificativa h6,
    .recomendacao-observacoes h6 {
      font-size: 0.9rem;
      font-weight: 600;
      color: #4a5568;
      margin-bottom: 0.5rem;
    }
    .recomendacao-detalhes p,
    .recomendacao-riscos p,
    .recomendacao-justificativa p,
    .recomendacao-observacoes p {
      font-size: 0.9rem;
      color: #4a5568;
      line-height: 1.5;
    }
    .recomendacao-footer {
      padding: 1rem;
      background-color: #f7fafc;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: flex-end;
    }
    .recomendacao-acoes {
      display: flex;
      gap: 0.5rem;
    }
    .btn-view, .btn-edit, .btn-delete {
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      font-size: 0.8rem;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 0.25rem;
      transition: all 0.2s;
    }
    .btn-view {
      background-color: #ebf8ff;
      color: #3182ce;
      border: 1px solid #bee3f8;
    }
    .btn-view:hover {
      background-color: #bee3f8;
    }
    .btn-edit {
      background-color: #fffaf0;
      color: #dd6b20;
      border: 1px solid #feebc8;
    }
    .btn-edit:hover {
      background-color: #feebc8;
    }
    .btn-delete {
      background-color: #fff5f5;
      color: #e53e3e;
      border: 1px solid #fed7d7;
    }
    .btn-delete:hover {
      background-color: #fed7d7;
    }
    .sem-recomendacoes {
      font-size: 0.9rem;
      color: #718096;
      font-style: italic;
      text-align: center;
      padding: 1rem;
    }
    .img-intro {
    }
    .coverContainer {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      padding: 50px;
      box-sizing: border-box;
      font-family: sans-serif;
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      margin-bottom: 80px;
    }
    .subtitulo-capa{
      margin-top: 200px;
    }
    .logo-report{
      margin-top: -10px;
      position: relative;
    }
    .metrics {
      display: flex;
      flex-direction: column;
      font-size: 0.9em;
      color: #666;
      text-transform: uppercase;
      margin-left: 20px;
    }
    .metricItem {
      margin-bottom: 5px;
    }
    .titleSection {
      text-align: center;
      margin-bottom: auto;
    }
    .mainTitle {
      font-size: 1.5em;
      color: #f17b35;
      margin-bottom: 10px;
      line-height: 1.2;
    }
    .subtitle {
      font-size: 1em;
      color: #f17b35;
      margin-top: 0;
    }
    .footer-capa {
      text-align: center;
      font-size: 1em;
      color: #666;
    }
    .date, .version {
      margin: 5px 0;
    }
    .img{
        border: 3px solid orange;
    }
    .nist-csf-container {
      width: 100%;
      margin: 1rem 0;
      font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .nist-csf-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #2c3e50;
      text-align: center;
    }
    .table-container-nist {
      width: 100%;
      margin: 0;
      padding: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      background-color: white;
      overflow: hidden;
    }
    .nist-csf-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.8rem;
      table-layout: fixed;
    }
    .nist-csf-table th,
    .nist-csf-table td {
      border: 1px solid #e0e0e0;
      padding: 0.3rem;
      text-align: left;
      vertical-align: middle;
      word-wrap: break-word;
    }
    .nist-csf-table th {
      background-color: #34495e;
      color: white;
      font-weight: 600;
      text-align: center;
    }
    .nist-csf-table tr:nth-child(even):not([data-category]) {
      background-color: #f8f9fa;
    }
    .nist-csf-table .category-cell {
      font-weight: 600;
      color: white;
      text-align: center;
      vertical-align: middle;
      width: 80px;
      writing-mode: vertical-rl;
      transform: rotate(180deg);
      white-space: nowrap;
    }
    .nist-csf-table th:nth-child(1),
    .nist-csf-table td:nth-child(1) {
      width: 5%;
    }
    .nist-csf-table th:nth-child(2),
    .nist-csf-table td:nth-child(2) {
      width: 50%;
    }
    .nist-csf-table th:nth-child(3),
    .nist-csf-table td:nth-child(3),
    .nist-csf-table th:nth-child(4),
    .nist-csf-table td:nth-child(4),
    .nist-csf-table th:nth-child(5),
    .nist-csf-table td:nth-child(5) {
      width: 15%;
      text-align: center;
    }
    .nist-csf-table tr[data-category="GV"] .category-cell {
      background-color: #db7134;
    }
    .nist-csf-table tr[data-category="ID"] .category-cell {
      background-color: #2ecc71;
    }
    .nist-csf-table tr[data-category="PR"] .category-cell {
      background-color: #9b59b6;
    }
    .nist-csf-table tr[data-category="DE"] .category-cell {
      background-color: #e67e22;
    }
    .nist-csf-table tr[data-category="RS"] .category-cell {
      background-color: #e74c3c;
    }
    .nist-csf-table tr[data-category="RC"] .category-cell {
      background-color: #1abc9c;
    }
    .nist-csf-table .text-center {
      text-align: center;
      font-weight: 600;
    }
    .nist-csf-table .score-5 {
      background-color: #27ae60;
      color: white;
    }
    .nist-csf-table .score-4 {
      background-color: #2ecc71;
      color: white;
    }
    .nist-csf-table .score-3 {
      background-color: #f1c40f;
      color: #2c3e50;
    }
    .nist-csf-table .score-2 {
      background-color: #e67e22;
      color: white;
    }
    .nist-csf-table .score-1 {
      background-color: #e74c3c;
      color: white;
    }
    .nist-csf-table tr[data-category="GV"] {
      background-color: #ecf6fc;
    }
    .nist-csf-table tr[data-category="ID"] {
      background-color: #e9fbe8;
    }
    .nist-csf-table tr[data-category="PR"] {
      background-color: #f3e8f9;
    }
    .nist-csf-table tr[data-category="DE"] {
      background-color: #fcefe4;
    }
    .nist-csf-table tr[data-category="RS"] {
      background-color: #fdecea;
    }
    .nist-csf-table tr[data-category="RC"] {
      background-color: #e6f9f6;
    }
    .nist-loading,
    .nist-error,
    .nist-no-data {
      padding: 1rem;
      text-align: center;
      font-size: 1rem;
    }
    .nist-loading {
      color: #3498db;
    }
    .nist-error {
      color: #e74c3c;
    }
    .nist-no-data {
      color: #7f8c8d;
    }
.radar-nist-container {
  width:1000px;
  margin-left: auto;
  margin-right: auto;
}
    .graficos {
      display: flex;
      flex-direction: column;
    }
    .nist-csf-table .score-high {
      background-color: #2ecc71;
      color: white;
    }
    .nist-csf-table .score-medium {
      background-color: #f39c12;
      color: white;
    }
    .nist-csf-table .score-low {
      background-color: #e67e22;
      color: white;
    }
    .nist-csf-table .score-critical {
      background-color: #e74c3c;
      color: white;
    }
    .score-excellent {
      background-color: #2e7d32;
      font-weight: bold;
      color: white;
    }
    .score-good {
      background-color: #2e7d32;
      color: white;
    }
    .score-ok {
      background-color: #66bb6a;
    }
    .score-low {
      background-color: #fb8c00;
    }
    .score-critical {
      background-color: #e53935;
    }


.summary-container {
  font-family: "Arial", sans-serif;
  margin: 20px 0;
  padding: 10px;
}
    .summary-title {
      font-size: 18px;
      font-weight: bold;
      margin-bottom: 20px;
      text-align: center;
      text-transform: uppercase;
    }
    .summary-list {
      list-style-type: none;
      padding: 0;
      margin: 0;
    }
    .summary-item {
      margin: 8px 0;
      cursor: pointer;
      font-size: 14px;
      line-height: 1.4;
    }
    .summary-item:hover {
      color: #2a5885;
    }
    .summary-link {
      display: flex;
      justify-content: space-between;
      width: 100%;
    }
    .summary-dots {
      flex-grow: 1;
      overflow: hidden;
      white-space: nowrap;
      color: #ccc;
      margin: 0 4px;
    }
    .summary-page-number {
      font-weight: normal;
    }
    .summary-item.level-1 {
      margin-left: 20px;
    }
    .summary-item.active {
      color: #2a5885;
      font-weight: bold;
    }
    .analises-section {
      border-radius: 8px;
      padding: 4rem;
      width: 100%;
      height: 100%;
      margin-left: -50px;
    }
    .section-title {
      font-size: 1.5rem;
      color: #2c3e50;
      margin-bottom: 1.5rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #eee;
      font-weight: 600;
    }
    .analises-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 1.5rem;
    }
    .analise-card {
      background: #fff;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      padding: 1.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .analise-card:hover {
      transform: translateY(-3px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border-color: #3498db;
    }
    .card-header {
      display: flex;
      align-items: center;
      margin-bottom: 1rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #f5f5f5;
    }
    .card-icon {
      color: #3498db;
      margin-right: 0.75rem;
      font-size: 1.25rem;
    }
    .card-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #2c3e50;
      margin: 0;
    }
    .card-body {
      padding: 0.5rem 0;
    }
    .card-info {
      color: #34495e;
      margin: 0.5rem 0;
      font-size: 0.95rem;
    }
    .card-id {
      color: #7f8c8d;
      font-size: 0.85rem;
      margin-top: 0.75rem;
    }
    .loading-message, .empty-message {
      color: #7f8c8d;
      text-align: center;
      padding: 2rem;
      font-size: 1rem;
    }
    .button-icone {
      background-color: transparent;
      border: 1px solid #ccc;
      border-radius: 50%;
      padding: 1px;
      font-size: 10px;
      cursor: pointer;
      width: 20px;
      height: 20px;
    }
    .button-icone:hover {
      background-color: #f0f0f0;
      border-color: #888;
      color: #e60cd3
    }
    .button-icone:active {
      transform: scale(0.95);
    }
    .button-icone:focus {
      outline: none;
    }
    .custom-table {
      width: 100%;
      background-color: white;
      border-radius: 8px;
      overflow: hidden;
      border-collapse: collapse;
    }
    .custom-table thead {
      background-color: #f3f4f6;
    }
    .custom-table th,
    .custom-table td {
      padding: 0.5rem 1rem;
      text-align: left;
      border-bottom: 1px solid #e5e7eb;
    }
    .custom-table tbody tr:hover {
      background-color: #f9fafb;
    }
    .tag {
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      display: inline-block;
    }
    .tag.alta {
      background-color: #fee2e2;
      color: #b91c1c;
    }
    .tag.media {
      background-color: #fef3c7;
      color: #92400e;
    }
    .tag.baixa {
      background-color: #d1fae5;
      color: #065f46;
    }
    .action-buttons {
      display: flex;
      gap: 0.5rem;
    }
    .no-data {
      color: #6b7280;
      font-style: italic;
    }
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modal-content {
      background-color: white;
      padding: 2rem;
      border-radius: 8px;
      width: 100%;
      max-width: 500px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      animation: modalFadeIn 0.3s ease-out;
    }
    @keyframes modalFadeIn {
      from {
        opacity: 0;
        transform: translateY(-20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .modal-header h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a1a1a;
      margin: 0;
    }
    .modal-body {
      margin-bottom: 1.5rem;
    }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }
    .modal-select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.875rem;
      margin-top: 0.5rem;
      background-color: #f9fafb;
      transition: border-color 0.2s;
    }
    .modal-select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    .modal-textarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #d1d5db;
      border-radius: 6px;
      font-size: 0.875rem;
      margin-top: 0.5rem;
      min-height: 120px;
      background-color: #f9fafb;
      transition: border-color 0.2s;
    }
    .modal-textarea:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid transparent;
    }
    .btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .btn-cancel {
      background-color: #f3f4f6;
      color: #4b5563;
      border-color: #e5e7eb;
    }
    .btn-cancel:hover:not(:disabled) {
      background-color: #e5e7eb;
    }
    .btn-confirm {
      background-color: #f59e0b;
      color: white;
    }
    .btn-confirm:hover:not(:disabled) {
      background-color: #d97706;
    }
    .action-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      border: none;
      color: white;
      gap: 0.5rem;
    }
    .action-btn-success {
      background-color: #10b981;
    }
    .action-btn-success:hover {
      background-color: #059669;
    }
    .action-btn-warning {
      background-color: #f59e0b;
    }
    .action-btn-warning:hover {
      background-color: #d97706;
    }
    .action-btn-primary {
      background-color: #3b82f6;
    }
    .action-btn-primary:hover {
      background-color: #2563eb;
    }
    .edit-btn {
      color: #3b82f6;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    .edit-btn:hover {
      background-color: rgba(59, 130, 246, 0.1);
    }
    .delete-btn {
      color: #ef4444;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    .delete-btn:hover {
      background-color: rgba(239, 68, 68, 0.1);
    }
    .tag {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
    }
    .tag.alta {
      background-color: #fee2e2;
      color: #b91c1c;
    }
    .tag.media {
      background-color: #fef3c7;
      color: #92400e;
    }
    .tag.baixa {
      background-color: #dcfce7;
      color: #166534;
    }
    .categorias-container {
      margin-bottom: 1rem;
    }
    .categorias-container label.title {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      margin-bottom: 0.25rem;
    }
    .categorias-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .categoria-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      cursor: pointer;
    }
    .categoria-item input[type="checkbox"] {
      accent-color: #3b82f6;
      width: 1rem;
      height: 1rem;
      cursor: pointer;
    }
    .categoria-item span {
      user-select: none;
    }
    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .header-actions .btn {
      display: flex;
      align-items: center;
      padding: 0.5rem 0.75rem;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: white;
      cursor: pointer;
      transition: background-color 0.2s ease-in-out;
    }
    .btn svg {
      margin-right: 0.5rem;
    }
    .btn-success {
      background-color: #10b981;
    }
    .btn-success:hover {
      background-color: #059669;
    }
    .btn-warning {
      background-color: #f59e0b;
    }
    .btn-warning:hover {
      background-color: #d97706;
    }
    .btn-primary {
      background-color: #3b82f6;
    }
    .btn-primary:hover {
      background-color: #2563eb;
    }
    .nota-baixa {
      background-color: #ffebee;
      color: #c62828;
      font-weight: bold;
    }
    .nota-baixa-card{
      background-color: #ffebee;
      color: #c62828;
    }
    .sem-recomendacoes {
      font-size: 0.9rem;
      color: #757575;
      font-style: italic;
    }
    .formulario-recomendacao-container {
      margin-top: 1rem;
      padding: 1rem;
      background-color: #f5f5f5;
      border-radius: 8px;
    }
    .nota-baixa {
      color: #d32f2f;
      font-weight: bold;
    }
    .container-avaliacao {
      width: 100%;
    }
    .tituloPagina {
      background-color: #464242;
      color: #ffffff;
      padding: 1rem 2rem;
      border-radius: 0.5rem;
      margin-bottom: 1.5rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
      display: flex;
      align-items: center;
    }
    .header-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      width: 100%;
      gap: 1.5rem;
    }
    .header-actions h3 {
      margin: 0;
      font-size: 1.8rem;
      color: inherit;
      display: flex;
      align-items: center;
    }
    .header-actions h3 .cliente-name {
      font-size: 1.1rem;
      color: #cccccc;
      font-weight: normal;
      margin-left: 0.8rem;
      opacity: 0.9;
    }
    .headerButtons {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      justify-content: flex-end;
      align-items: center;
    }
    .headerButtons button {
      display: flex;
      align-items: center;
      padding: 0.7rem 1.2rem;
      border: none;
      border-radius: 0.3rem;
      font-size: 0.95rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease;
      text-decoration: none;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .headerButtons .btn-pendencia {
        background-color: #ffc107;
        color: #212529;
    }
    .headerButtons .btn-pendencia:hover {
        background-color: #e0a800;
        box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
    }
    .headerButtons .btn-finalizar {
        background-color: #007bff;
        color: white;
    }
    .headerButtons .btn-finalizar:hover {
        background-color: #0056b3;
        box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
    }
    .headerButtons button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    .headerButtons button svg {
      margin-right: 0.5rem;
      font-size: 1.1rem;
    }
    .btnSuccess {
      background-color: #28a745;
    }
    .btnSuccess:hover:not(:disabled) {
      background-color: #218838;
    }
    .btnWarning {
      background-color: #ffc107;
      color: #212529;
    }
    .btnWarning:hover:not(:disabled) {
      background-color: #e0a800;
    }
    .btnPrimary {
      background-color: #007bff;
    }
    .btnPrimary:hover:not(:disabled) {
      background-color: #0056b3;
    }
    .card {
      background: #fff;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
      margin-bottom: 1.5rem;
      border: 1px solid #dee2e6;
    }
    .tituloSecao {
      font-size: 1.3rem;
      color: #333;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #eee;
      font-weight: 600;
    }
    .graficosContainer {
        display: flex;
        gap: 2rem;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }
    .graficosContainer > div {
        flex: 1 1 300px;
        min-width: 300px;
        max-width: 100%;
    }
    .tabelaestilo {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
      font-size: 0.95rem;
    }
    .tabelaestilo thead {
      background-color: #e9ecef;
    }
    .tabelaestilo th,
    .tabelaestilo td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid #dee2e6;
    }
    .tabelaestilo th {
        font-weight: 600;
        color: #495057;
    }
    .tabelaestilo tbody tr:hover {
      background-color: #f8f9fa;
    }
    .notaBaixaTexto {
        color: #dc3545;
        font-weight: bold;
    }
    .clickableRow {
        cursor: pointer;
        transition: background-color 0.2s ease;
    }
    .clickableRow:hover {
        background-color: #e9ecef !important;
    }
    .tabContainer {
      display: flex;
      flex-wrap: wrap;
      margin-bottom: 1.5rem;
      border-bottom: 2px solid #e0e0e0;
      gap: 0.5rem;
    }
    .tabContainer::-webkit-scrollbar { 
        display: none;
    }
    .tabButton {
      padding: 0.75rem 1.2rem;
      border: none;
      border-bottom: 3px solid transparent;
      background-color: transparent;
      color: #555;
      font-size: 1rem;
      cursor: pointer;
      transition: color 0.3s ease, border-bottom-color 0.3s ease;
      font-weight: 500;
      outline: none;
    }
    .tabButton:hover:not(.activeTab) {
      color: #007bff;
      background-color: #f8f9fa;
    }
    .activeTab {
      color: #007bff;
      border-bottom: 2px solid #007bff;
      background-color: #fff;
      font-weight: 600;
    }
    .tabContent {
      padding-top: 1rem; 
    }
    .notaBaixa {
      background-color: #f8d7da;
      color: #721c24;
      border-color: #f5c6cb;
      font-weight: bold;
    }
    .notaAlta {
      background-color: #d4edda;
      color: #155724;
      border-color: #c3e6cb;
      font-weight: bold;
    }
    .nota:not(.notaBaixa) {
        background-color: #d4edda;
        color: #155724;
        border-color: #c3e6cb;
    }
    .recomendacoesContainer {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e9ecef;
    }
    .recomendacoesContainer h6 {
      font-size: 1rem;
      color: #495057;
      margin-bottom: 1rem;
      font-weight: 600;
    }
    .recomendacoesList {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .recomendacaoItem {
      background-color: #f1f3f5;
      border-radius: 6px;
      padding: 1rem;
      border: 1px solid #dee2e6;
    }
    .recomendacaoHeader {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.8rem;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .recomendacaoNome {
      font-weight: bold;
      color: #343a40;
      font-size: 1rem;
      flex-grow: 1;
    }
    .recomendacaoDetalhes {
        margin-bottom: 1rem;
    }
    .recomendacaoDetalhes p {
      margin: 0;
      font-size: 0.95rem;
      color: #5a5a5a;
      line-height: 1.5;
    }
    .recomendacaoAcoes {
      display: flex;
      gap: 0.75rem;
      margin-top: 0.5rem;
      flex-wrap: wrap;
    }
    .btnEdit, .btnDelete {
      padding: 0.4rem 0.8rem;
      border-radius: 4px;
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.4rem;
      cursor: pointer;
      transition: background-color 0.2s ease, opacity 0.2s ease;
      border: 1px solid transparent;
      text-decoration: none;
    }
    .btnEdit {
      background-color: #e9ecef;
      color: #007bff;
      border-color: #ced4da;
    }
    .btnEdit:hover {
      background-color: #ced4da;
    }
    .btnDelete {
      background-color: #f8d7da;
      color: #dc3545;
      border-color: #f5c6cb;
    }
    .btnDelete:hover {
      background-color: #f5c6cb;
    }
    .btnAddRecomendacao {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
      margin-top: 1.5rem;
      padding: 0.6rem 1.2rem;
      font-size: 0.9rem;
      font-weight: 500;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: background-color 0.2s ease, opacity 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    .btnAddRecomendacao:hover {
      background-color: #c3e6cb;
    }
    .semRecomendacoes {
      font-size: 0.95rem;
      color: #6c757d;
      font-style: italic;
      margin-top: 0.5rem;
    }
    .formularioRecomendacaoContainer {
      margin-top: 1.5rem;
      padding: 1.5rem;
      background-color: #e9ecef;
      border-radius: 8px;
      border: 1px dashed #ced4da;
    }
    .modalOverlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    }
    .modalContent {
      background-color: white;
      padding: 2rem;
      border-radius: 8px;
      width: 100%;
      max-width: 500px;
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      animation: modalFadeIn 0.3s ease-out;
    }
    @keyframes modalFadeIn {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .modalHeader {
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }
    .modalHeader h3 {
      font-size: 1.3rem;
      font-weight: 600;
      color: #333;
      margin: 0;
    }
    .modalBody {
      margin-bottom: 1.5rem;
    }
    .modalFooter {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }
    .modalLabel {
      display: block;
      font-size: 0.9rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: #495057;
    }
    .modalTextarea {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ced4da;
      border-radius: 6px;
      font-size: 0.9rem;
      min-height: 100px;
      background-color: #f8f9fa;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      resize: vertical;
    }
    .modalTextarea:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
      background-color: #fff;
    }
    .categoriasContainer {
      margin-bottom: 1.5rem;
    }
    .categoriasContainer label.title {
      display: block;
      font-size: 0.9rem;
      font-weight: 500;
      margin-bottom: 0.75rem;
      color: #495057;
    }
    .categoriasList {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 0.75rem;
    }
    .categoriaItem {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
      cursor: pointer;
      background-color: #e9ecef;
      padding: 0.5rem 0.75rem;
      border-radius: 4px;
      border: 1px solid #dee2e6;
      transition: background-color 0.2s ease, border-color 0.2s ease;
    }
    .categoriaItem:hover {
        background-color: #dee2e6;
    }
    .categoriaItem input[type="checkbox"] {
      accent-color: #007bff;
      width: 1.1rem;
      height: 1.1rem;
      cursor: pointer;
      flex-shrink: 0;
    }
    .categoriaItem span {
      user-select: none;
      flex-grow: 1;
    }
    .btnCancel {
      background-color: #6c757d;
      color: white;
    }
    .btnCancel:hover:not(:disabled) {
      background-color: #5a6268;
    }
    .btnConfirm {
      background-color: #28a745;
      color: white;
    }
    .btnConfirm:hover:not(:disabled) {
      background-color: #218838;
    }
    .tag {
      display: inline-block;
      padding: 0.25rem 0.6rem;
      border-radius: 9999px;
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      margin-left: 0.5rem;
    }
    .alta {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
    .media {
      background-color: #fff3cd;
      color: #856404;
      border: 1px solid #ffeeba;
    }
    .baixa {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }
    .noData, .emptyMessage {
        color: #6c757d;
        font-style: italic;
        text-align: center;
        padding: 1.5rem;
        width: 100%;
        display: block;
    }
    .buttonIcone {
      background-color: transparent;
      border: 1px solid #ced4da;
      border-radius: 50%;
      padding: 1px;
      font-size: 10px;
      cursor: pointer;
      width: 20px;
      height: 20px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      margin-right: 0.5rem;
      color: #555;
    }
    .buttonIcone:hover {
      background-color: #e9ecef;
      border-color: #adb5bd;
      color: #333;
    }
    .buttonIcone:active {
      transform: scale(0.9);
    }
    .buttonIcone:focus {
      outline: none;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }
    .filter-options {
      margin-bottom: 1.5rem;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
    }
    .toggle-container {
      display: flex;
      align-items: center;
      cursor: pointer;
      user-select: none;
      margin-right: 1.5rem;
    }
    .toggle-checkbox {
      display: none;
    }
    .toggle-slider {
      position: relative;
      display: inline-block;
      width: 40px;
      height: 20px;
      background-color: #ccc;
      border-radius: 20px;
      transition: background-color 0.4s;
      margin-right: 10px;
      flex-shrink: 0;
    }
    .toggle-slider::before {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      left: 2px;
      bottom: 2px;
      background-color: white;
      transition: transform 0.4s;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
    }
    .toggle-checkbox:checked + .toggle-slider {
      background-color: #007bff;
    }
    .toggle-checkbox:checked + .toggle-slider::before {
      transform: translateX(20px);
    }
    .toggle-text {
      font-size: 0.95rem;
      color: #333;
    }
    .btn-voltar {
      margin-bottom: 1rem;
      padding: 0.5rem 1rem;
      background-color: #e5e7eb;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      transition: background-color 0.2s ease;
    }
    .btn-voltar:hover {
      background-color: #d1d5db;
    }
    .dashboardContainer {
      display: flex;
      min-height: 100vh;
      font-family: 'Segoe UI', sans-serif;
      background-color: #f9fafb;
    }
    .dashboardMain {
      flex: 1;
      padding: 24px;
      background-color: #f3f4f6;
    }
    .dashboardHeaderSection {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .f53mTitle {
      font-size: 28px;
      font-weight: bold;
      margin: 0;
    }
    .f53mSubtitle {
      font-size: 14px;
      color: #666;
      margin: 4px 0 0 0;
    }
    .userInfo {
      font-size: 14px;
      color: #444;
    }
    .dashboardHeader {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .dashboardTitle {
      font-size: 24px;
      font-weight: bold;
    }
    .dashboardHeaderButtons {
      display: flex;
      gap: 12px;
    }
    .btnOutline,
    .btnPrimary,
    .btnSort {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 16px;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
      border: none;
    }
    .btnOutline {
      border: 1px solid #ccc;
      background-color: white;
      color: #444;
    }
    .btnOutline:hover {
      background-color: #f0f0f0;
    }
    .btnPrimary {
      background-color: #f97316;
      color: white;
    }
    .btnPrimary:hover {
      background-color: #ea580c;
    }
    .dashboardCards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .dashboardCard {
      background: white;
      padding: 16px;
      border-radius: 10px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.08);
    }
    .dashboardCardLabel {
      color: #666;
      font-size: 14px;
    }
    .dashboardCardValue {
      font-size: 28px;
      font-weight: bold;
      margin: 8px 0;
    }
    .dashboardCardPositive {
      color: #16a34a;
      font-size: 12px;
    }
    .dashboardCardNegative {
      color: #dc2626;
      font-size: 12px;
    }
    .dashboardTableSection {
      background-color: white;
      padding: 16px;
      border-radius: 10px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
    }
    .tableDescription {
      color: #666;
      font-size: 14px;
      margin-bottom: 16px;
    }
    .dashboardTableControls {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;
      flex-wrap: wrap;
      gap: 12px;
    }
    .dashboardSearchBox {
      display: flex;
      align-items: center;
      border: 1px solid #ccc;
      padding: 6px 12px;
      border-radius: 25px;
      background-color: white;
      flex-grow: 1;
      max-width: 400px;
    }
    .dashboardSearchBox input {
      border: none;
      outline: none;
      margin-left: 8px;
      flex-grow: 1;
      font-size: 14px;
    }
    .searchIcon {
      color: #aaa;
    }
    .dashboardFilterBox {
      display: flex;
      gap: 8px;
    }
    .dashboardFilterBox select {
      padding: 8px 12px;
      border: 1px solid #ccc;
      border-radius: 25px;
      background-color: white;
      font-size: 14px;
    }
    .btnSort {
      background-color: white;
      border: 1px solid #ccc;
      color: #444;
    }
    .dashboardTable {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }
    .dashboardTable th,
    .dashboardTable td {
      padding: 12px 8px;
      border-top: 1px solid #eee;
      text-align: left;
    }
    .dashboardTable th {
      color: #666;
      font-weight: 600;
    }
    .dashboardTable tr:hover {
      background-color: #f9f9f9;
    }
    .statusTag {
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
      display: inline-block;
    }
    .statusFinished {
      background-color: #dcfce7;
      color: #166534;
    }
    .statusProgress {
      background-color: #fef9c3;
      color: #92400e;
    }
    .actionsDropdown {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btnView {
      color: #f97316;
      background: none;
      border: none;
      cursor: pointer;
      font-weight: bold;
      padding: 6px 12px;
    }
    .btnView:hover {
      color: #ea580c;
    }
    .btnDropdown {
      background: none;
      border: none;
      cursor: pointer;
      color: #666;
      padding: 6px;
    }
    .btnDropdown:hover {
      background-color: #f0f0f0;
      border-radius: 4px;
    }
    .paginationContainer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      padding: 10px 0;
      flex-wrap: wrap;
      gap: 15px;
    }
    .itemsPerPageSelector {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      color: #555;
    }
    .pageSizeSelect {
      padding: 6px 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      background-color: white;
      cursor: pointer;
    }
    .pageSizeSelect:hover {
      border-color: #aaa;
    }
    .pageInfo {
      font-size: 14px;
      color: #555;
    }
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      margin-top: 24px;
      padding: 12px 0;
      flex-wrap: wrap;
    }
    .pageButton {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      background-color: white;
      color: #333;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .pageButton:not(:disabled):hover {
      background-color: #f5f5f5;
      border-color: #d0d0d0;
    }
    .activePage {
      background-color: #ff9800;
      color: white;
      border-color: #fb8c00;
      font-weight: 500;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .pageButton:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .pageButton svg {
      width: 14px;
      height: 14px;
    }
    .pageButton[name="firstPageButton"],
    .pageButton[name="lastPageButton"] {
      background-color: #f8f9fa;
    }
    .pageButton:not(:disabled):not(.activePage):hover {
      transform: translateY(-1px);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    .pagination {
      transition: opacity 0.3s ease;
    }
    @media (max-width: 768px) {
        .header-actions {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
        }
        .headerButtons {
            justify-content: flex-start;
            width: 100%;
        }
        .headerButtons button {
            width: auto;
            padding: 0.5rem 0.75rem;
            font-size: 0.85rem;
        }
        .header-actions h3 {
            font-size: 1.5rem;
        }
        .header-actions h3 span {
            font-size: 1rem;
        }
        .card {
            padding: 1rem;
        }
        .tituloSecao {
            font-size: 1.2rem;
        }
        .tabelaestilo th,
        .tabelaestilo td {
            padding: 0.5rem 0.75rem;
            font-size: 0.9rem;
        }
        .tabButton {
            padding: 0.75rem 0.75rem;
            font-size: 0.9rem;
        }
        .perguntaCard {
            padding: 1rem;
        }
        .perguntaHeader {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
            padding-bottom: 0.5rem;
        }
        .perguntaTexto {
            font-size: 1rem;
        }
        .perguntaNotas {
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        .recomendacaoItem {
            padding: 0.8rem;
        }
        .recomendacaoHeader {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
        }
        .recomendacaoNome {
            font-size: 0.9rem;
        }
        .tag {
            font-size: 0.65rem;
            padding: 0.1rem 0.4rem;
            margin-left: 0;
        }
        .recomendacaoDetalhes p {
            font-size: 0.9rem;
        }
        .recomendacaoAcoes {
            flex-wrap: wrap;
            gap: 0.5rem;
        }
        .btnEdit, .btnDelete, .btnAddRecomendacao {
            padding: 0.3rem 0.6rem;
            font-size: 0.8rem;
            gap: 0.3rem;
        }
        .btnAddRecomendacao {
            padding: 0.5rem 1rem;
            font-size: 0.85rem;
            gap: 0.4rem;
            margin-top: 1rem;
        }
        .modalContent {
            padding: 1.5rem;
        }
        .modalHeader h3 {
            font-size: 1.1rem;
        }
        .modalLabel {
            font-size: 0.85rem;
        }
        .modalTextarea {
            font-size: 0.85rem;
            padding: 0.6rem;
        }
        .categoriasList {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 0.5rem;
        }
        .categoriaItem {
            font-size: 0.85rem;
            padding: 0.4rem 0.6rem;
        }
        .categoriaItem input[type="checkbox"] {
            width: 1rem;
            height: 1rem;
        }
        .btn {
            padding: 0.4rem 0.8rem;
            font-size: 0.8rem;
        }
        .pagination {
            gap: 4px;
        }
        .pageButton {
            width: 32px;
            height: 32px;
            font-size: 12px;
        }
        .paginationContainer {
            flex-direction: column;
            align-items: center;
        }
        .itemsPerPageSelector {
            order: 1;
        }
        .pagination {
            order: 2;
            margin: 5px;
        }
        .pageInfo {
            order: 3;
        }
    }
    @media print {

        body .report-actions,
        body .report-filters-panel,
        body .report-footer-actions,
        .no-print-button {
            display: none !important;
        }
        body, html {
            width: 100%;
            height: 100%;
            background: #fff;
            color: #000;
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
        }
        .report-content {
            margin: 0;
            padding: 0;
            border: none;
            box-shadow: none;
        }
   
        .page-footer {
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            padding: 0 2cm;
            height: 1.5cm;
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 10px;
            border-top: 1px solid #ccc;
        }
        .footer-logo img {
            max-width: 80px;
        }
        .footer-text {
            text-align: center;
        }
        .footer-page-number {
            text-align: right;
        }
    }

    /* =========================
   PlanoDeAcaoReportPage
   ========================= */
.plano-acao-report {
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
}

.plano-acao-report h2 {
  font-size: 1.8rem;
  color: #005a9e;
  margin-bottom: 1rem;
  font-weight: 700;
  text-align: center;
}

.observacoes-box {
  background-color: #f9f9f9;
  border-left: 4px solid #ff8c00;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
}

.plano-acao-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.recomendacao-card {
  background-color: #ffffff;
  border: 1px solid #d8e1e9;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  transition: box-shadow 0.3s ease;
}

.recomendacao-card:hover {
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

.recomendacao-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.recomendacao-header .icon-alert {
  color: #f39c12;
  font-size: 1.8rem;
}

.recomendacao-titles {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.recomendacao-titles h3 {
  font-size: 1.2rem;
  color: #0078d4;
  font-weight: 600;
  margin: 0;
}

.badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 4px;
  text-transform: uppercase;
}

.badge-alta {
  background-color: #ffe4e1;
  color: #d63031;
}

.badge-media {
  background-color: #fff4e1;
  color: #f39c12;
}

.badge-baixa {
  background-color: #e8f5e9;
  color: #27ae60;
}

.badge-na {
  background-color: #e0e0e0;
  color: #555;
}

.recomendacao-body p {
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 0.4rem;
}

.recomendacao-body p strong {
  color: #004b8d;
}

.footer-capa {
  text-align: center;
  margin-top: 2rem;
}

.footer-capa .date {
  font-size: 0.85rem;
  color: #777;
}

.footer-capa .version {
  font-size: 0.85rem;
  font-weight: 600;
  color: #444;
  margin-top: 0.2rem;
}

@media print {
  .plano-acao-report {
    page-break-before: always;
  }
}

  @page {
    size: A4;
    margin: 1cm 1.5cm 2.8cm 1.5cm;
  }

  @page:first {
  margin-bottom: 0 !important;
}

@media print {
  .hide-on-first,
  .hide-on-second {
    display: none !important;
  }

  .page-1 .footer,
  .page-2 .footer {
    display: none !important;
  }
}

  `;
