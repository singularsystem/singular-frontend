"use client";

import React from "react";
import { Building2 } from "lucide-react";

export interface EmptyStateProps {
  message?: string;
  description?: string;
}

export function EmptyState({
  message = "Nenhum município encontrado",
  description = "Não há municípios correspondentes aos filtros atuais ou cadastrados no momento.",
}: EmptyStateProps) {
  return (
    <div
      data-testid="municipios-empty-state"
      className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white py-12 px-6 text-center"
    >
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Building2 className="h-6 w-6" aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-slate-900">{message}</h3>
      <p className="mt-1 max-w-md text-sm text-slate-500">{description}</p>
    </div>
  );
}
