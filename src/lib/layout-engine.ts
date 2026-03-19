/**
 * Auto-Layout Engine para AutoBook Pro
 * Calcula la distribución de texto basada en estándares de la industria (A5).
 */

export interface PageContent {
  pageNumber: number;
  text: string;
}

export function calculateLayout(
  text: string, 
  config = { fontSize: 11, lineHeight: 1.5, margin: 25, pageWidth: 148, pageHeight: 210 }
): PageContent[] {
  // Simulación de motor de paginación (en una app real usaríamos medidas de Canvas/DOM)
  // Aproximadamente 2500 caracteres por página A5 con estos parámetros
  const charsPerPage = 2200; 
  const paragraphs = text.split('\n\n');
  const pages: PageContent[] = [];
  
  let currentPageText = "";
  let currentPageNum = 1;

  paragraphs.forEach((para) => {
    if ((currentPageText.length + para.length) > charsPerPage) {
      pages.push({ pageNumber: currentPageNum, text: currentPageText.trim() });
      currentPageNum++;
      currentPageText = para + "\n\n";
    } else {
      currentPageText += para + "\n\n";
    }
  });

  if (currentPageText.trim()) {
    pages.push({ pageNumber: currentPageNum, text: currentPageText.trim() });
  }

  return pages;
}
