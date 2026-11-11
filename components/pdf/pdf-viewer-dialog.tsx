"use client";

import type React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Printer, Download, ExternalLink, AlertCircle } from "lucide-react";

interface PdfViewerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  blobUrl: string | null;
  isLoading: boolean;
  error: string | null;
  onPrint?: () => void;
  onDownload?: () => void;
  onOpenInNewTab?: () => void;
  title?: string;
}

export function PdfViewerDialog({
  isOpen,
  onClose,
  blobUrl,
  isLoading,
  error,
  onPrint,
  onDownload,
  onOpenInNewTab,
  title = "Visualização do Documento",
}: PdfViewerDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className="max-w-4xl w-[95vw] h-[90vh] flex flex-col p-6"
        aria-label="Diálogo de visualização do documento"
      >
        <DialogHeader className="flex flex-row items-center justify-between pb-2 border-b">
          <div>
            <DialogTitle className="text-xl font-bold text-brand-navy">
              {title}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Visualização prévia do documento gerado em conformidade oficial.
            </DialogDescription>
          </div>

          <div className="flex items-center gap-2">
            {onPrint && (
              <Button
                variant="outline"
                size="sm"
                onClick={onPrint}
                disabled={isLoading}
                title="Imprimir com alta resolução (300 DPI)"
              >
                <Printer className="h-4 w-4 mr-1" />
                Imprimir
              </Button>
            )}

            {onDownload && (
              <Button
                variant="outline"
                size="sm"
                onClick={onDownload}
                disabled={!blobUrl || isLoading}
                title="Baixar arquivo PDF"
              >
                <Download className="h-4 w-4 mr-1" />
                Baixar
              </Button>
            )}

            {onOpenInNewTab && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenInNewTab}
                disabled={!blobUrl || isLoading}
                title="Abrir visualização em nova aba"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 w-full relative min-h-[300px] flex items-center justify-center bg-slate-100 rounded-md overflow-hidden my-2">
          {isLoading && (
            <div className="flex flex-col items-center gap-2 text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin text-brand-navy" />
              <p className="text-sm font-medium">Carregando documento...</p>
            </div>
          )}

          {!isLoading && error && (
            <div className="flex items-center gap-2 p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!isLoading && !error && blobUrl && (
            <iframe
              src={blobUrl}
              title="Visualização do documento"
              className="w-full h-full border-0"
            />
          )}
        </div>

        <DialogFooter className="pt-2 border-t flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
