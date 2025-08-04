import { useCallback, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  Packer,
  ImageRun,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx";

interface ReportExportOptions {
  logo?: string;
}

export const useReportExport = (
  reportRef: React.RefObject<HTMLDivElement>,
  options?: ReportExportOptions
) => {
  const [isExporting, setIsExporting] = useState(false);

  const exportToPdf = useCallback(async () => {
    try {
      setIsExporting(true);
      if (!reportRef.current) return;

      const pdf = new jsPDF("p", "mm", "a4");
      const sections = reportRef.current.querySelectorAll(
        "section.report-page"
      );

      // Configurações iniciais para melhor renderização
      const originalStyles: { [key: string]: string } = {};
      const elementsToModify = reportRef.current.querySelectorAll(
        ".report-page, .report-section, .radar-chart-container, canvas, svg"
      );

      // Salvar estilos originais
      elementsToModify.forEach((el) => {
        const element = el as HTMLElement;
        originalStyles[`${el.tagName}_${el.className}`] = element.style.cssText;

        // Forçar fundo branco e remover transparências
        element.style.backgroundImage = "none";
        element.style.boxShadow = "none";

        // Garantir que elementos canvas/svg sejam visíveis
        if (el.tagName === "CANVAS" || el.tagName === "SVG") {
          element.style.visibility = "visible";
          element.style.display = "block";
          element.style.opacity = "1";
        }
      });

      await new Promise((resolve) => setTimeout(resolve, 1000));

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i] as HTMLElement;

        if (i > 0) {
          pdf.addPage();
        }

        // Mostrar apenas a seção atual temporariamente
        sections.forEach((s) => ((s as HTMLElement).style.display = "none"));
        section.style.display = "block";

        // Esperar pela renderização
        await new Promise((resolve) => setTimeout(resolve, 500));

        const canvas = await html2canvas(section, {
          scale: 2, // Aumentei para melhor qualidade
          logging: false,
          useCORS: true,
          ignoreElements: (element) => {
            return element.classList.contains("no-export");
          },
          onclone: (clonedDoc) => {
            // Garantir que todos os elementos estejam visíveis

            // Forçar renderização de elementos SVG/Canvas
            clonedDoc.querySelectorAll("canvas, svg").forEach((el) => {
              const element = el as HTMLElement;
              element.style.visibility = "visible";
              element.style.display = "block";
              element.style.opacity = "1";
            });
          },
        });

        // Restaurar visibilidade
        sections.forEach((s) => {
          if (s instanceof HTMLElement) {
            s.style.display = "";
          }
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95); // Aumentei a qualidade
        const imgWidth = 210; // Largura A4 em mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Adicionar imagem ao PDF
        pdf.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);

        // Lidar com conteúdo que não cabe em uma página
        let heightLeft = imgHeight;
        let position = 0;
        const pageHeight = 297; // Altura A4 em mm

        while (heightLeft > pageHeight) {
          position = heightLeft - pageHeight;
          pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, -position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
      }

      // Restaurar estilos originais
      elementsToModify.forEach((el) => {
        const element = el as HTMLElement;
        element.style.cssText =
          originalStyles[`${el.tagName}_${el.className}`] || "";
      });

      pdf.save("relatorio-maturidade-ciberseguranca.pdf");
    } catch (error) {
      console.error("Erro ao exportar relatório:", error);
    } finally {
      setIsExporting(false);
    }
  }, [reportRef]);

  const exportToWord = useCallback(async () => {
    try {
      setIsExporting(true);
      if (!reportRef.current) return;

      // Clonar o elemento para não afetar o DOM original
      const clonedElement = reportRef.current.cloneNode(true) as HTMLElement;

      // Simplificar estilos
      clonedElement.querySelectorAll("*").forEach((el) => {
        const element = el as HTMLElement;
        element.style.cssText = `
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          box-shadow: none;
          text-shadow: none;
          color: black !important;
        `;

        if (element.style.backgroundColor === "transparent") {
          element.style.backgroundColor = "white";
        }
      });

      const images: { id: string; data: string }[] = [];
      const canvases = clonedElement.querySelectorAll("canvas");

      // Processar canvases
      for (const canvas of canvases) {
        try {
          const dataUrl = await html2canvas(canvas as HTMLCanvasElement, {
            scale: 1,
            logging: false,
            useCORS: true,
          }).then((canvas) => canvas.toDataURL("image/jpeg", 0.9));

          images.push({
            id: `img_${images.length}`,
            data: dataUrl,
          });

          const img = document.createElement("img");
          img.src = dataUrl;
          img.style.maxWidth = "100%";
          img.style.display = "block";
          canvas.replaceWith(img);
        } catch (error) {
          console.error("Error processing canvas:", error);
        }
      }

      // Processar SVGs
      const svgs = clonedElement.querySelectorAll("svg");
      for (const svg of svgs) {
        try {
          const svgString = new XMLSerializer().serializeToString(svg);
          const dataUrl =
            "data:image/svg+xml;base64," +
            btoa(unescape(encodeURIComponent(svgString)));

          images.push({
            id: `img_${images.length}`,
            data: dataUrl,
          });

          const img = document.createElement("img");
          img.src = dataUrl;
          img.style.maxWidth = "100%";
          img.style.display = "block";
          svg.replaceWith(img);
        } catch (error) {
          console.error("Error processing SVG:", error);
        }
      }

      // Criar documento Word
      const doc = new Document({
        styles: {
          paragraphStyles: [
            {
              id: "Normal",
              name: "Normal",
              run: { size: 24, font: "Calibri" },
              paragraph: {
                spacing: { line: 276 },
                indent: { left: 0, firstLine: 0 },
              },
            },
            {
              id: "Heading1",
              name: "Heading 1",
              run: { size: 32, bold: true, color: "2a5885", font: "Calibri" },
              paragraph: {
                spacing: { before: 600, after: 300 },
                border: {
                  bottom: { color: "2a5885", size: 8, style: "single" },
                },
              },
            },
            {
              id: "Heading2",
              name: "Heading 2",
              run: { size: 28, bold: true, color: "2a5885", font: "Calibri" },
              paragraph: { spacing: { before: 400, after: 200 } },
            },
            {
              id: "Heading3",
              name: "Heading 3",
              run: { size: 26, bold: true, color: "2a5885", font: "Calibri" },
              paragraph: { spacing: { before: 300, after: 150 } },
            },
          ],
        },
        sections: [
          {
            properties: {
              page: {
                size: { width: 11906, height: 16838, orientation: "portrait" },
                margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
              },
            },
            children: await htmlToDocx(clonedElement.innerHTML, images),
          },
        ],
      });

      // Gerar e baixar o documento
      Packer.toBlob(doc).then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "relatorio-maturidade-ciberseguranca.docx";
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 100);
      });
    } catch (error) {
      console.error("Erro ao exportar para Word:", error);
    } finally {
      setIsExporting(false);
    }
  }, [reportRef]);

  // Adicione esta função ao seu hook useReportExport
  // Adicione esta função ao seu hook useReportExport
  const previewHtml = useCallback(() => {
    if (!reportRef.current) return;

    // Clonar o elemento e seus estilos corretamente
    const clonedElement = reportRef.current.cloneNode(true) as HTMLElement;

    // Ajustar estilos para visualização
    clonedElement.style.width = "210mm";
    clonedElement.style.minHeight = "297mm";
    clonedElement.style.margin = "0 auto";
    clonedElement.style.padding = "20mm";
    clonedElement.style.backgroundColor = "white";

    // Copiar todos os estilos do elemento original
    const originalStyles = window.getComputedStyle(reportRef.current);
    for (let i = 0; i < originalStyles.length; i++) {
      const prop = originalStyles[i];
      clonedElement.style.setProperty(
        prop,
        originalStyles.getPropertyValue(prop)
      );
    }

    // Abrir nova janela com o HTML completo
    const previewWindow = window.open("", "_blank");
    if (previewWindow) {
      previewWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Pré-visualização do Relatório</title>
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              background-color: #f5f5f5; 
              font-family: Arial, sans-serif;
            }
            .preview-container { 
              width: 210mm;
              min-height: 297mm;
              margin: 20px auto; 
              background: white; 
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }
            .preview-actions { 
              text-align: center; 
              padding: 10px; 
              background: #f0f0f0; 
              position: sticky; 
              top: 0; 
              z-index: 1000;
            }
            button { 
              padding: 10px 15px; 
              background: #2a5885; 
              color: white; 
              border: none; 
              border-radius: 4px; 
              cursor: pointer; 
              margin: 10px;
            }
            @media print {
              body { background: white; }
              .preview-actions { display: none; }
            }
            ${Array.from(document.styleSheets)
              .map((sheet) => {
                try {
                  return Array.from(sheet.cssRules)
                    .map((rule) => rule.cssText)
                    .join("\n");
                } catch (e) {
                  return "";
                }
              })
              .join("\n")}
          </style>
        </head>
        <body>
          <div class="preview-actions">
            <button onclick="window.print()">Imprimir</button>
            <button onclick="window.close()">Fechar</button>
          </div>
          <div class="preview-container">
            ${clonedElement.outerHTML}
          </div>
        </body>
      </html>
    `);
      previewWindow.document.close();
    }
  }, [reportRef]);
  return { isExporting, exportToPdf, exportToWord, previewHtml };
};

async function htmlToDocx(
  html: string,
  images: { id: string; data: string }[]
) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const elements: any[] = [];

  const processNode = (node: Node): any => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent?.trim();
      return text ? new TextRun({ text, size: 24, font: "Calibri" }) : null;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return null;

    const el = node as HTMLElement;
    const tagName = el.tagName.toLowerCase();
    const style = window.getComputedStyle(el);

    switch (tagName) {
      case "h1":
        return new Paragraph({
          children: [
            new TextRun({
              text: el.textContent || "",
              bold: true,
              size: 32,
              color: "2a5885",
            }),
          ],
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 600, after: 300 },
        });

      case "h2":
        return new Paragraph({
          children: [
            new TextRun({
              text: el.textContent || "",
              bold: true,
              size: 28,
              color: "2a5885",
            }),
          ],
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 400, after: 200 },
        });

      case "h3":
      case "h4":
        return new Paragraph({
          children: [
            new TextRun({
              text: el.textContent || "",
              bold: true,
              size: 26,
              color: "2a5885",
            }),
          ],
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 300, after: 150 },
        });

      case "p":
        return new Paragraph({
          spacing: { after: 200, line: 276 },
          children: [
            new TextRun({
              text: el.textContent || "",
              size: 24,
              bold: style.fontWeight === "bold",
              italics: style.fontStyle === "italic",
              underline: style.textDecoration.includes("underline")
                ? {}
                : undefined,
              color: style.color?.replace("#", "") || "000000",
            }),
          ],
        });

      case "ul":
      case "ol":
        const isOrdered = tagName === "ol";
        const listItems: Paragraph[] = [];

        el.childNodes.forEach((li, index) => {
          if (li.nodeName === "LI") {
            const prefix = isOrdered ? `${index + 1}. ` : "• ";

            listItems.push(
              new Paragraph({
                children: [
                  new TextRun({
                    text: prefix + (li.textContent || ""),
                    size: 24,
                  }),
                ],
                indent: { left: 720, hanging: 360 },
                spacing: { after: 100 },
              })
            );
          }
        });

        return listItems;

      case "img":
        const img = el as HTMLImageElement;
        const matchingImage = images.find(
          (i) => img.src.includes(i.id) || img.src.includes(i.data)
        );

        if (matchingImage) {
          try {
            const base64Data = matchingImage.data.split(",")[1];
            const byteCharacters = atob(base64Data);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            return new Paragraph({
              children: [
                new ImageRun({
                  data: byteArray,
                  transformation: { width: 400, height: 300 },
                  type: matchingImage.data.startsWith("data:image/jpeg")
                    ? "jpg"
                    : "png",
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 },
            });
          } catch (error) {
            console.error("Error processing image:", error);
            return null;
          }
        }
        return null;

      case "table":
        const tableRows: TableRow[] = [];

        el.querySelectorAll("tr").forEach((tr, rowIndex) => {
          const rowCells: TableCell[] = [];

          tr.querySelectorAll("td, th").forEach((td) => {
            const isHeader = td.tagName.toLowerCase() === "th";

            const textRun = new TextRun({
              text: td.textContent || "",
              bold: isHeader,
              size: isHeader ? 26 : 24,
            });

            rowCells.push(
              new TableCell({
                children: [new Paragraph({ children: [textRun] })],
                borders: {
                  top: { size: 200, color: "F4A460", style: "single" },
                  bottom: { size: 200, color: "F4A460", style: "single" },
                  left: { size: 200, color: "F4A460", style: "single" },
                  right: { size: 200, color: "F4A460", style: "single" },
                },
                shading: {
                  fill: isHeader
                    ? "FFE4C4"
                    : rowIndex % 2 === 0
                    ? "FFF5EE"
                    : "FFFFFF",
                },
              })
            );
          });

          tableRows.push(new TableRow({ children: rowCells }));
        });

        return new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: tableRows,
        });

      default:
        const children: any[] = [];
        el.childNodes.forEach((child) => {
          const result = processNode(child);
          if (Array.isArray(result)) {
            children.push(...result);
          } else if (result) {
            children.push(result);
          }
        });
        return children.length > 0 ? children : null;
    }
  };

  doc.body.childNodes.forEach((node) => {
    const result = processNode(node);
    if (result) {
      if (Array.isArray(result)) {
        elements.push(...result);
      } else {
        elements.push(result);
      }
    }
  });

  return elements;
}
