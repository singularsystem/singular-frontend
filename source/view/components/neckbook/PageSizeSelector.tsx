"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ALLOWED_PAGE_SIZES,
  DEFAULT_PAGE_SIZE,
} from "@/source/view-model/neckbook/MunicipiosCotasViewModel";

export const PAGE_SIZE_OPTIONS = ALLOWED_PAGE_SIZES;
export { DEFAULT_PAGE_SIZE };

export interface PageSizeSelectorProps {
  currentPage: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  disabled?: boolean;
}

export function PageSizeSelector({
  currentPage,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  disabled = false,
}: PageSizeSelectorProps) {
  const totalPages = Math.max(1, Math.ceil(total / Math.max(pageSize, 1)));
  const canPrev = currentPage > 1 && !disabled;
  const canNext = currentPage < totalPages && !disabled;

  return (
    <div
      data-testid="pagination-footer"
      className="flex flex-col items-center justify-between gap-4 border-t border-slate-200 bg-white px-4 py-3 sm:flex-row"
    >
      {/* Seletor de quantidade de itens por página posicionado à esquerda do bloco de paginação */}
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <label htmlFor="neckbook-page-size-select" className="font-medium">
          Itens por página:
        </label>
        <select
          id="neckbook-page-size-select"
          data-testid="page-size-selector"
          value={pageSize}
          disabled={disabled}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-sm font-medium text-slate-800 shadow-sm focus:border-brand-navy focus:outline-none focus:ring-1 focus:ring-brand-navy"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span className="ml-2 text-xs text-slate-500">
          Total: {total} {total === 1 ? "município" : "municípios"}
        </span>
      </div>

      {/* Bloco de paginação à direita */}
      <div className="flex items-center gap-2" data-testid="pagination-controls">
        <span className="text-sm text-slate-600">
          Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canPrev}
          onClick={() => onPageChange(currentPage - 1)}
          aria-label="Página anterior"
          data-testid="prev-page-button"
        >
          <ChevronLeft className="h-4 w-4" />
          Anterior
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canNext}
          onClick={() => onPageChange(currentPage + 1)}
          aria-label="Próxima página"
          data-testid="next-page-button"
        >
          Próxima
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
