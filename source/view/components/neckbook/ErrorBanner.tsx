"use client";

import React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AdminErrorView } from "@/source/model/entities/neckbook/NeckbookEntity";

export interface ErrorBannerProps {
  error: AdminErrorView | null;
  onRetry?: () => void;
  onDismiss?: () => void;
}

const KIND_TITLES: Record<AdminErrorView["kind"], string> = {
  auth: "Credencial ou permissão inválida",
  not_found: "Recurso não encontrado",
  validation: "Erro de validação",
  network: "Falha de comunicação com o servidor",
  server_config: "Servidor não configurado (Admin_Key ausente)",
  generic: "Falha ao carregar a listagem",
};

export function ErrorBanner({ error, onRetry, onDismiss }: ErrorBannerProps) {
  if (!error) {
    return null;
  }

  const title = KIND_TITLES[error.kind] ?? KIND_TITLES.generic;

  return (
    <div
      role="alert"
      data-testid="neckbook-error-banner"
      data-error-kind={error.kind}
      className="flex flex-col gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-900 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="mt-0.5 text-sm text-red-800">{error.message}</p>
          {error.kind === "server_config" && (
            <p className="mt-1 text-xs text-red-700">
              Contate o administrador da infraestrutura para configurar a chave{" "}
              <code>NECKBOOK_ADMIN_KEY</code> no servidor.
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 self-end sm:self-center">
        {onRetry && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRetry}
            data-testid="error-retry-button"
            className="border-red-300 bg-white text-red-800 hover:bg-red-100"
          >
            <RefreshCw className="mr-1.5 h-4 w-4" aria-hidden="true" />
            Tentar novamente
          </Button>
        )}
        {onDismiss && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-red-700 hover:bg-red-100"
          >
            Fechar
          </Button>
        )}
      </div>
    </div>
  );
}
