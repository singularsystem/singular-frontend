"use client";

// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";

type FetchLike = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

type OpenPdfOptions = {
  revokeAfterMs?: number;
  autoPrint?: boolean;
  focusAfterLoad?: boolean;
};

export async function openPdfInExistingWindow(
  fetcher: FetchLike,
  url: string,
  win: Window,
  options: OpenPdfOptions = {},
) {
  const {
    revokeAfterMs = 60_000,
    autoPrint = false,
    focusAfterLoad = true,
  } = options;

  const res = await fetcher(url, {
    method: "GET",
    headers: { Accept: "application/pdf" },
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Falha ao gerar PDF (${res.status})`);
  }

  const blob = await res.blob();
  const blobUrl = URL.createObjectURL(blob);

  win.location.href = blobUrl;

  if (focusAfterLoad) {
    setTimeout(() => {
      try {
        win.focus();
      } catch {}
    }, 200);
  }

  if (autoPrint) {
    setTimeout(() => {
      try {
        win.focus();
        win.print();
      } catch {}
    }, 900);
  }

  setTimeout(() => URL.revokeObjectURL(blobUrl), revokeAfterMs);
}

// export async function generatePDFGraph(elementId: string, filename: string) {
//   try {
//     const element = document.getElementById(elementId);
//     if (!element) {
//       console.error(`Element with id ${elementId} not found`);
//       return {
//         success: false,
//         message: `Elemento com ID ${elementId} não encontrado`,
//       };
//     }

//     const pdf = new jsPDF({
//       orientation: "portrait",
//       unit: "mm",
//       format: "a4",
//     });

//     pdf.setFontSize(16);
//     pdf.setTextColor(0, 0, 0);
//     pdf.text(
//       "Instituto Piauiense de Assistência, Auditoria e Gestão em Saúde",
//       105,
//       15,
//       { align: "center" },
//     );
//     pdf.setFontSize(14);
//     pdf.text("Relatório Biopsicossocial", 105, 25, { align: "center" });
//     pdf.line(20, 30, 190, 30);

//     const canvas = await html2canvas(element, {
//       scale: 2,
//       useCORS: true,
//       allowTaint: true,
//       backgroundColor: "#ffffff",
//       logging: false,
//     });

//     const imgData = canvas.toDataURL("image/jpeg", 1.0);

//     const imgWidth = 170;
//     const pageHeight = 295;
//     const imgHeight = (canvas.height * imgWidth) / canvas.width;
//     let heightLeft = imgHeight;
//     let position = 35;

//     pdf.addImage(imgData, "JPEG", 20, position, imgWidth, imgHeight);
//     heightLeft -= pageHeight - position;

//     while (heightLeft > 0) {
//       position = 0;
//       pdf.addPage();
//       pdf.addImage(
//         imgData,
//         "JPEG",
//         20,
//         position - (pageHeight - 35),
//         imgWidth,
//         imgHeight,
//       );
//       heightLeft -= pageHeight;
//     }

//     const pageCount = pdf.getNumberOfPages
//       ? pdf.getNumberOfPages()
//       : pdf.internal.pages.length;

//     for (let i = 1; i <= pageCount; i++) {
//       pdf.setPage(i);
//       pdf.setFontSize(10);
//       pdf.setTextColor(100, 100, 100);
//       pdf.text(`Página ${i} de ${pageCount}`, 105, 290, { align: "center" });
//       pdf.text(`Gerado em ${new Date().toLocaleDateString()}`, 105, 285, {
//         align: "center",
//       });
//     }

//     // Salvar o PDF
//     pdf.save(`${filename}.pdf`);
//     return { success: true, message: "PDF gerado com sucesso" };
//   } catch (error) {
//     console.error("Error generating PDF:", error);
//     return {
//       success: false,
//       message:
//         error instanceof Error
//           ? error.message
//           : "Ocorreu um erro ao gerar o PDF",
//     };
//   }
// }
