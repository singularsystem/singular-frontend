"use client";

import React, { useEffect, useRef, useState } from "react";
import { AlertTriangle, Check, Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  AdminErrorView,
  MunicipioCotaEntity,
} from "@/source/model/entities/neckbook/NeckbookEntity";

export const COPY_CONFIRMATION_DURATION_MS = 3_000; // Entre 2s e 5s (Req 4.4)
export const SINGLE_DISPLAY_WARNING =
  "Atenção: este token em texto puro é exibido uma única vez. Copie e armazene-o em local seguro antes de fechar.";

export interface GenerateApiKeyModalProps {
  open: boolean;
  municipio: MunicipioCotaEntity | null;
  token: string | null;
  isGenerating: boolean;
  error: AdminErrorView | null;
  onRetry: () => void;
  onClose: () => void;
}

export function GenerateApiKeyModal({
  open,
  municipio,
  token,
  isGenerating,
  error,
  onRetry,
  onClose,
}: GenerateApiKeyModalProps) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!open) {
      setCopied(false);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [open]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  if (!open || !municipio) {
    return null;
  }

  const handleCopy = async () => {
    if (!token) {
      return;
    }
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(token);
      }
    } catch {
      // fallback silencioso se clipboard API não estiver disponível no ambiente
    }
    setCopied(true);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      setCopied(false);
      timerRef.current = null;
    }, COPY_CONFIRMATION_DURATION_MS);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="generate-api-key-modal-title"
      data-testid="generate-api-key-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
        <h2
          id="generate-api-key-modal-title"
          className="text-lg font-bold text-slate-900"
        >
          Chave de API — {municipio.name}
        </h2>

        {isGenerating && (
          <div
            data-testid="generating-key-loading"
            className="my-6 flex flex-col items-center justify-center py-6 text-sm text-slate-600"
          >
            Gerando nova chave de API...
          </div>
        )}

        {!isGenerating && error && !token && (
          <div
            data-testid="generate-key-error"
            className="my-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900"
          >
            <p className="font-semibold">Não foi possível gerar a chave</p>
            <p className="mt-1 text-red-800">{error.message}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRetry}
              data-testid="generate-key-retry"
              className="mt-3 border-red-300 bg-white text-red-800 hover:bg-red-100"
            >
              <RefreshCw className="mr-1.5 h-4 w-4" />
              Tentar novamente
            </Button>
          </div>
        )}

        {!isGenerating && token && (
          <div className="my-4 space-y-4">
            <div
              data-testid="single-display-warning"
              className="flex items-start gap-2.5 rounded-lg border border-amber-300 bg-amber-50 p-3 text-xs font-medium text-amber-900"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              <span>{SINGLE_DISPLAY_WARNING}</span>
            </div>

            <div className="flex items-center justify-between gap-2 rounded-lg border border-slate-200 bg-slate-900 px-3 py-2.5 text-slate-50">
              <code
                data-testid="generated-plain-token"
                className="break-all font-mono text-xs"
              >
                {token}
              </code>
              <Button
                type="button"
                size="sm"
                onClick={handleCopy}
                data-testid="copy-token-button"
                className="shrink-0 bg-[#111C4E] hover:bg-blue-800 text-white"
              >
                {copied ? (
                  <>
                    <Check className="mr-1 h-4 w-4" />
                    <span data-testid="copy-confirmation">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="mr-1 h-4 w-4" />
                    Copiar
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            data-testid="close-generate-key-modal"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
