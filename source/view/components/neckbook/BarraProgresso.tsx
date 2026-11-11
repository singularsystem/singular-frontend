"use client";

import type { StatusJob } from "@/source/model/entities/neckbook/GeracaoLivroTypes";
import { calcularProgresso } from "@/source/model/entities/neckbook/ProgressBar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

interface BarraProgressoProps {
  status: StatusJob;
  progress: number;
  currentStep?: string;
  pdfUrl?: string | null;
  errorMessage?: string | null;
}

const STATUS_LABELS: Record<StatusJob, { label: string; color: string }> = {
  QUEUED: { label: "Na fila", color: "bg-gray-100 text-gray-700 border-gray-300" },
  GENERATING_TEXT: { label: "Gerando texto", color: "bg-blue-100 text-blue-800 border-blue-300" },
  AWAITING_TEACHER_REVIEW: { label: "Aguardando revisão", color: "bg-amber-100 text-amber-800 border-amber-300" },
  GENERATING_IMAGES: { label: "Gerando ilustrações", color: "bg-purple-100 text-purple-800 border-purple-300" },
  RENDERING_PDF: { label: "Montando PDF", color: "bg-indigo-100 text-indigo-800 border-indigo-300" },
  COMPLETED: { label: "Concluído", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  FAILED: { label: "Falhou", color: "bg-red-100 text-red-800 border-red-300" },
};

export function BarraProgresso({
  status,
  progress,
  currentStep,
  pdfUrl,
  errorMessage,
}: BarraProgressoProps) {
  const percent = calcularProgresso(status, progress);
  const statusConfig = STATUS_LABELS[status] || {
    label: status,
    color: "bg-gray-100 text-gray-800 border-gray-200",
  };

  const isCompleted = status === "COMPLETED";
  const isFailed = status === "FAILED";

  return (
    <div className="w-full bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!isCompleted && !isFailed && (
            <Loader2 className="h-5 w-5 animate-spin text-brand-navy" />
          )}
          {isCompleted && (
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          )}
          {isFailed && (
            <AlertTriangle className="h-5 w-5 text-red-600" />
          )}
          <span className="font-semibold text-gray-800 text-sm">
            {currentStep || statusConfig.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={`text-xs px-2.5 py-0.5 font-medium border ${statusConfig.color}`}
          >
            {statusConfig.label}
          </Badge>
          <span className="font-bold text-sm text-brand-navy">{percent}%</span>
        </div>
      </div>

      <Progress value={percent} className="h-2.5 bg-gray-100" />

      {isCompleted && pdfUrl && (
        <div className="pt-2 flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg p-3.5">
          <div className="flex items-center gap-2 text-emerald-900 text-sm font-medium">
            <FileText className="h-5 w-5 text-emerald-700" />
            <span>Livro gerado com sucesso!</span>
          </div>
          <Button
            asChild
            className="bg-brand-navy hover:bg-brand-navy/90 text-white font-medium text-xs px-4"
          >
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4 mr-1.5" />
              Baixar Livro (PDF)
            </a>
          </Button>
        </div>
      )}

      {isFailed && errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
          {errorMessage}
        </div>
      )}
    </div>
  );
}
