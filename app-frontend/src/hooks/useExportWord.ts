import { useCallback } from "react";
import { saveAs } from "file-saver";
import html2canvas from "html2canvas";

export function useExportWord(reportRef: React.RefObject<HTMLDivElement>) {
  const exportToWord = useCallback(async () => {
    if (!reportRef.current) {
      alert("Conteúdo não encontrado para exportar.");
      return;
    }

    try {
      const clone = reportRef.current.cloneNode(true) as HTMLElement;

      // Transformar gráficos em imagens
      const selectorsToConvert = ['#grafico-radar', '#grafico-table'];
      for (const selector of selectorsToConvert) {
        const element = clone.querySelector(selector) as HTMLElement;
        if (element) {
          const originalElement = document.querySelector(selector) as HTMLElement;
          if (originalElement) {
            const canvas = await html2canvas(originalElement, {
              scale: 2,
              backgroundColor: "#fff",
            });
            const img = document.createElement("img");
            img.src = canvas.toDataURL("image/png");
            img.style.maxWidth = "100%";
            img.style.height = "auto";
            element.innerHTML = "";
            element.appendChild(img);
          }
        }
      }

      // Converter imagens externas em base64
      const images = clone.querySelectorAll("img");
      for (const img of images) {
        if (!img.src.startsWith("data:")) {
          try {
            const res = await fetch(img.src);
            const blob = await res.blob();
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            await new Promise<void>((resolve) => {
              reader.onloadend = () => {
                img.src = reader.result as string;
                resolve();
              };
            });
          } catch (error) {
            console.warn("Erro ao converter imagem:", error);
          }
        }
      }

      // Converte canvas remanescentes
      const canvases = clone.querySelectorAll("canvas");
      for (const canvas of canvases) {
        const img = document.createElement("img");
        img.src = canvas.toDataURL("image/png");
        img.style.maxWidth = "100%";
        img.style.height = "auto";
        canvas.replaceWith(img);
      }

      // Remove elementos indesejados
      clone.querySelectorAll(".no-print, .no-export").forEach((el) => el.remove());

      // Criar HTML completo com estilos para Word
      const htmlContent = `
        <!DOCTYPE html>
        <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
          <head>
            <meta charset="UTF-8" />
            <meta name="ProgId" content="Word.Document" />
            <meta name="Generator" content="Microsoft Word 15" />
            <meta name="Originator" content="Microsoft Word 15" />
            <!--[if !mso]>
            <style>
              v\\:* {behavior:url(#default#VML);}
              o\\:* {behavior:url(#default#VML);}
              w\\:* {behavior:url(#default#VML);}
              .shape {behavior:url(#default#VML);}
            </style>
            <![endif]-->
            <style>
              @page {
                margin: 1in;
              }
              body {
                font-family: 'Calibri', sans-serif;
                font-size: 11pt;
                line-height: 1.15;
                margin: 0;
                padding: 0;
              }
              table {
                border-collapse: collapse;
                width: 100%;
                margin: 10px 0;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f2f2f2;
                font-weight: bold;
              }
              h1, h2, h3, h4, h5, h6 {
                color: #333;
                margin: 16px 0 8px 0;
              }
              h1 { font-size: 18pt; }
              h2 { font-size: 16pt; }
              h3 { font-size: 14pt; }
              p {
                margin: 6px 0;
              }
              img {
                max-width: 100%;
                height: auto;
              }
            </style>
          </head>
          <body>
            ${clone.innerHTML}
          </body>
        </html>
      `;

      // Criar blob e fazer download como arquivo HTML que pode ser aberto no Word
      const blob = new Blob([htmlContent], { type: 'application/msword' });
      saveAs(blob, `relatorio-${new Date().toISOString().slice(0, 10)}.doc`);
      
    } catch (error) {
      console.error("Erro ao exportar relatório:", error);
      alert("Erro ao exportar relatório. Tente novamente.");
    }
  }, [reportRef]);

  return { exportToWord };
}

