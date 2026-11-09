"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Download } from "lucide-react";
import { useState } from "react";

interface PDFGeneratorProps {
  contentId: string;
  filename: string;
}

export function PDFGenerator({ contentId, filename }: PDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generatePDF = async () => {
    setIsGenerating(true);

    try {
      const jsPDF = (await import("jspdf")).default;
      const html2canvas = (await import("html2canvas")).default;

      const element = document.getElementById(contentId);
      if (!element) {
        throw new Error(`Elemento com ID ${contentId} não encontrado`);
      }

      const pdf = new jsPDF("p", "mm", "a4");

      pdf.setFontSize(16);
      pdf.text(
        "Instituto Piauiense de Assistência, Auditoria e Gestão em Saúde",
        105,
        15,
        { align: "center" }
      );
      pdf.setFontSize(14);
      pdf.text("Relatório Biopsicossocial", 105, 25, { align: "center" });
      pdf.line(20, 30, 190, 30);

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const imgWidth = 170;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 35;

      pdf.addImage(imgData, "JPEG", 20, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - position;

      while (heightLeft > 0) {
        position = 0;
        pdf.addPage();
        pdf.addImage(
          imgData,
          "JPEG",
          20,
          position - (pageHeight - 35),
          imgWidth,
          imgHeight
        );
        heightLeft -= pageHeight;
      }

      const pageCount = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Página ${i} de ${pageCount}`, 105, 290, { align: "center" });
        pdf.text(`Gerado em ${new Date().toLocaleDateString()}`, 105, 285, {
          align: "center",
        });
      }

      pdf.save(`${filename}.pdf`);

      toast({
        title: "PDF gerado com sucesso",
        description: `O arquivo ${filename}.pdf foi baixado.`,
      });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        variant: "destructive",
        title: "Erro ao gerar PDF",
        description:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro ao gerar o PDF",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button onClick={generatePDF} disabled={isGenerating} className="gap-2">
      {isGenerating ? (
        <>
          <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
          Gerando PDF...
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          Exportar PDF
        </>
      )}
    </Button>
  );
}
