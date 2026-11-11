"use client";

import type { ModoGeracao } from "@/source/model/entities/neckbook/GeracaoLivroTypes";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeletorModoGeracaoProps {
  value: ModoGeracao | null;
  onChange: (mode: ModoGeracao) => void;
  error?: string;
  disabled?: boolean;
}

export function SeletorModoGeracao({
  value,
  onChange,
  error,
  disabled = false,
}: SeletorModoGeracaoProps) {
  return (
    <div className="space-y-2 w-full">
      <Label className="text-sm font-semibold text-gray-700">
        Modo de Geração <span className="text-red-500">*</span>
      </Label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange("full_auto")}
          className={cn(
            "p-3.5 rounded-lg border text-left transition-all relative flex flex-col justify-between",
            value === "full_auto"
              ? "border-brand-navy bg-blue-50/50 ring-1 ring-brand-navy"
              : "border-gray-200 hover:border-gray-300 bg-white",
            disabled && "cursor-not-allowed opacity-60",
            error && !value && "border-red-500",
          )}
        >
          <div>
            <div className="font-semibold text-sm text-gray-900">
              Gerar automaticamente (sem revisão)
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Gera texto, ilustrações e o PDF final de ponta a ponta sem pausas.
            </p>
          </div>
        </button>

        <button
          type="button"
          disabled={disabled}
          onClick={() => onChange("draft_first")}
          className={cn(
            "p-3.5 rounded-lg border text-left transition-all relative flex flex-col justify-between",
            value === "draft_first"
              ? "border-brand-navy bg-blue-50/50 ring-1 ring-brand-navy"
              : "border-gray-200 hover:border-gray-300 bg-white",
            disabled && "cursor-not-allowed opacity-60",
            error && !value && "border-red-500",
          )}
        >
          <div>
            <div className="font-semibold text-sm text-gray-900">
              Gerar e revisar antes (rascunho)
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Gera o texto dos capítulos, pausa para sua revisão e edição, e somente após sua aprovação gera ilustrações e PDF.
            </p>
          </div>
        </button>
      </div>

      <div className="flex items-start gap-1.5 text-xs text-blue-900 bg-blue-50 p-2.5 rounded-md border border-blue-100">
        <Info className="h-4 w-4 shrink-0 text-blue-600 mt-0.5" />
        <span>
          Ambos os modos consomem cota e tokens de forma equivalente, sendo a diferença apenas a etapa de revisão.
        </span>
      </div>

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}
