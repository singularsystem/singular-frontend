"use client";

import React, { useState } from "react";
import { KeyRound, Power, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  AdminErrorView,
  ApiKeyEntity,
  MunicipioCotaEntity,
} from "@/source/model/entities/neckbook/NeckbookEntity";
import { formatQuotaRenewsAtUtc } from "@/source/infrastructure/neckbook/NeckbookAdminErrorParser";

export interface ApiKeysDialogProps {
  open: boolean;
  municipio: MunicipioCotaEntity | null;
  apiKeys: ApiKeyEntity[];
  isLoading: boolean;
  error: AdminErrorView | null;
  onClose: () => void;
  onToggleKey: (keyId: string, nextActive: boolean) => Promise<void>;
  onRevokeKey: (keyId: string) => Promise<void>;
}

interface PendingConfirmAction {
  type: "deactivate" | "revoke";
  key: ApiKeyEntity;
}

export function ApiKeysDialog({
  open,
  municipio,
  apiKeys,
  isLoading,
  error,
  onClose,
  onToggleKey,
  onRevokeKey,
}: ApiKeysDialogProps) {
  const [pendingConfirm, setPendingConfirm] =
    useState<PendingConfirmAction | null>(null);
  const [isProcessingAction, setIsProcessingAction] = useState(false);

  if (!open || !municipio) {
    return null;
  }

  const handleToggleRequest = async (key: ApiKeyEntity) => {
    if (key.isActive) {
      // Desativar requer confirmação destrutiva (Req 5.4)
      setPendingConfirm({ type: "deactivate", key });
    } else {
      setIsProcessingAction(true);
      try {
        await onToggleKey(key.id, true);
      } finally {
        setIsProcessingAction(false);
      }
    }
  };

  const handleRevokeRequest = (key: ApiKeyEntity) => {
    setPendingConfirm({ type: "revoke", key });
  };

  const handleConfirmDestructive = async () => {
    if (!pendingConfirm) {
      return;
    }
    setIsProcessingAction(true);
    try {
      if (pendingConfirm.type === "deactivate") {
        await onToggleKey(pendingConfirm.key.id, false);
      } else {
        await onRevokeKey(pendingConfirm.key.id);
      }
    } finally {
      setIsProcessingAction(false);
      setPendingConfirm(null);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-keys-dialog-title"
      data-testid="api-keys-dialog"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="w-full max-w-2xl rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2
              id="api-keys-dialog-title"
              className="text-lg font-bold text-slate-900"
            >
              Chaves de API — {municipio.name}
            </h2>
            <p className="text-xs text-slate-500">
              Apenas identificadores mascarados são exibidos após a criação.
            </p>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            data-testid="api-keys-error"
            className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-800"
          >
            {error.message}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-2 py-4" data-testid="api-keys-loading">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : apiKeys.length === 0 ? (
          <div
            data-testid="api-keys-empty"
            className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 py-8 text-center"
          >
            <KeyRound className="mb-2 h-6 w-6 text-slate-400" />
            <p className="text-sm font-medium text-slate-700">
              Nenhuma chave de API cadastrada para este município.
            </p>
          </div>
        ) : (
          <div className="max-h-80 space-y-2 overflow-y-auto">
            {apiKeys.map((key) => (
              <div
                key={key.id}
                data-testid={`api-key-item-${key.id}`}
                className="flex flex-col justify-between gap-3 rounded-lg border border-slate-200 p-3 sm:flex-row sm:items-center"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <code
                      data-testid={`api-key-masked-${key.id}`}
                      className="rounded bg-slate-100 px-2 py-0.5 font-mono text-xs font-semibold text-slate-800"
                    >
                      {key.maskedKey}
                    </code>
                    {key.isActive ? (
                      <Badge
                        data-testid={`api-key-status-${key.id}`}
                        className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100"
                      >
                        Ativa
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        data-testid={`api-key-status-${key.id}`}
                        className="bg-slate-100 text-slate-600"
                      >
                        Inativa
                      </Badge>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span>
                      Criada em: {formatQuotaRenewsAtUtc(key.createdAt)}
                    </span>
                    {key.description && <span>Descrição: {key.description}</span>}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={isProcessingAction}
                    onClick={() => handleToggleRequest(key)}
                    data-testid={`toggle-api-key-${key.id}`}
                  >
                    <Power className="mr-1.5 h-3.5 w-3.5" />
                    {key.isActive ? "Desativar" : "Ativar"}
                  </Button>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    disabled={isProcessingAction}
                    onClick={() => handleRevokeRequest(key)}
                    data-testid={`revoke-api-key-${key.id}`}
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Revogar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Diálogo de confirmação destrutivo para desativar ou revogar (Req 5.4, 5.6) */}
        {pendingConfirm && (
          <div
            role="alertdialog"
            aria-modal="true"
            data-testid="destructive-confirm-dialog"
            className="mt-4 rounded-lg border border-red-300 bg-red-50 p-4"
          >
            <h3 className="text-sm font-bold text-red-900">
              {pendingConfirm.type === "revoke"
                ? "Confirmar revogação permanente da chave"
                : "Confirmar desativação da chave"}
            </h3>
            <p className="mt-1 text-xs text-red-800">
              {pendingConfirm.type === "revoke"
                ? `A chave ${pendingConfirm.key.maskedKey} será revogada de forma permanente e irreversível. Integrações que utilizam esta chave perderão o acesso imediatamente.`
                : `A chave ${pendingConfirm.key.maskedKey} será desativada e não poderá autenticar chamadas até ser reativada.`}
            </p>
            <div className="mt-3 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isProcessingAction}
                onClick={() => setPendingConfirm(null)}
                data-testid="cancel-destructive-action"
              >
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={isProcessingAction}
                onClick={handleConfirmDestructive}
                data-testid="confirm-destructive-action"
              >
                {pendingConfirm.type === "revoke"
                  ? "Confirmar Revogação Permanente"
                  : "Confirmar Desativação"}
              </Button>
            </div>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            data-testid="close-api-keys-dialog"
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
}
