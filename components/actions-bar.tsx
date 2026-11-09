import { Button } from "@/components/ui/button";
import { Download, PenTool, Printer } from "lucide-react";

type ActionsBarProps = {
  onPrint: (win: Window) => void;
  onExportPDF: () => void;
  onSign?: () => void;

  isPrinting?: boolean;
  isGeneratingPDF?: boolean;
  isSigning?: boolean;

  canSign?: boolean;
  isSigned?: boolean;
};

export function ActionsBar({
  onPrint,
  onExportPDF,
  onSign,

  isPrinting = false,
  isGeneratingPDF = false,
  isSigning = false,

  canSign = false,
  isSigned = false,
}: ActionsBarProps) {
  return (
    <div className="flex gap-2">
      {/* Imprimir */}
      <Button
        type="button"
        variant="outline"
        className="gap-2 shadow-md"
        onClick={() => {
          console.log("[ActionsBar] CLICK PRINT");
          const win = window.open("", "_blank"); // 👈 aqui, direto no clique
          if (!win) {
            alert(
              "Pop-up bloqueado pelo navegador. Permita pop-ups para este site.",
            );
            return;
          }
          win.document.title = "Carregando PDF...";
          win.document.body.innerHTML =
            "<p style='font-family:sans-serif'>Gerando PDF...</p>";

          onPrint(win); // 👈 passa janela aberta
        }}
      >
        {isPrinting ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            Imprimindo...
          </>
        ) : (
          <>
            <Printer className="h-4 w-4" />
            Imprimir
          </>
        )}
      </Button>

      {/* Exportar PDF */}
      <Button
        variant="default"
        className="gap-2 shadow-lg"
        onClick={onExportPDF}
        disabled={isGeneratingPDF}
        type="button"
      >
        {isGeneratingPDF ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            Gerando PDF...
          </>
        ) : (
          <>
            <Download className="h-4 w-4" />
            Exportar PDF
          </>
        )}
      </Button>

      {/* Assinar */}
      {canSign && onSign && (
        <Button
          variant="outline"
          className="gap-2"
          onClick={onSign}
          disabled={isSigning}
          type="button"
        >
          <PenTool className="h-4 w-4" />
          {isSigned ? "Reassinar" : "Assinar"}
        </Button>
      )}
    </div>
  );
}
