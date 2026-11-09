"use client";

import React from "react";
import { Eye, KeyRound, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MunicipioCotaEntity } from "@/source/model/entities/neckbook/NeckbookEntity";
import { formatQuotaRenewsAtUtc } from "@/source/infrastructure/neckbook/NeckbookAdminErrorParser";
import { EmptyState } from "./EmptyState";

export const CALENDAR_RENEWAL_NOTICE =
  "Renovação automática mensal no dia 01 às 00:00 UTC (mês-calendário)";

export interface MunicipiosTableProps {
  municipios: MunicipioCotaEntity[];
  isLoading: boolean;
  pageSize: number;
  onViewKeys: (municipio: MunicipioCotaEntity) => void;
  onEdit: (municipio: MunicipioCotaEntity) => void;
  onGenerateKey: (municipio: MunicipioCotaEntity) => void;
}

export function MunicipiosTable({
  municipios,
  isLoading,
  pageSize,
  onViewKeys,
  onEdit,
  onGenerateKey,
}: MunicipiosTableProps) {
  if (!isLoading && municipios.length === 0) {
    return <EmptyState />;
  }

  const skeletonRowCount = Math.max(1, pageSize || 15);

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 bg-slate-50/70 px-4 py-2 text-xs text-slate-600">
        <span data-testid="calendar-renewal-notice">{CALENDAR_RENEWAL_NOTICE}</span>
      </div>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="font-semibold text-slate-700">Município</TableHead>
            <TableHead className="text-right font-semibold text-slate-700">
              Cota Mensal
            </TableHead>
            <TableHead className="text-right font-semibold text-slate-700">
              Uso Atual
            </TableHead>
            <TableHead className="text-right font-semibold text-slate-700">
              Saldo Remanescente
            </TableHead>
            <TableHead className="font-semibold text-slate-700">
              Próxima Renovação (UTC)
            </TableHead>
            <TableHead className="text-center font-semibold text-slate-700">
              Status do Módulo
            </TableHead>
            <TableHead className="text-right font-semibold text-slate-700">
              Ações
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: skeletonRowCount }).map((_, idx) => (
                <TableRow
                  key={`skeleton-${idx}`}
                  data-testid="municipio-skeleton-row"
                >
                  <TableCell>
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-16" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-16" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="text-center">
                    <Skeleton className="mx-auto h-5 w-16 rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            : municipios.map((mun) => {
                const formattedRenewal = formatQuotaRenewsAtUtc(
                  mun.quotaRenewsAt,
                );
                return (
                  <TableRow
                    key={mun.id}
                    data-testid={`municipio-row-${mun.id}`}
                  >
                    <TableCell className="font-medium text-slate-900">
                      {mun.name}
                    </TableCell>
                    <TableCell className="text-right text-slate-700">
                      {mun.monthlyQuota}
                    </TableCell>
                    <TableCell className="text-right text-slate-700">
                      {mun.currentUsage}
                    </TableCell>
                    <TableCell className="text-right font-semibold text-slate-900">
                      {mun.remaining}
                    </TableCell>
                    <TableCell
                      data-testid={`municipio-renews-at-${mun.id}`}
                      className="text-slate-700"
                    >
                      {formattedRenewal}
                    </TableCell>
                    <TableCell className="text-center">
                      {mun.moduleActive ? (
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                          Ativo
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-slate-100 text-slate-600"
                        >
                          Inativo
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => onViewKeys(mun)}
                          title="Visualizar chaves de API"
                          aria-label={`Visualizar chaves de API de ${mun.name}`}
                          data-testid={`action-view-keys-${mun.id}`}
                          className="h-8 w-8 rounded-full text-slate-600 hover:bg-slate-100 hover:text-[#111C4E]"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(mun)}
                          title="Editar cota e status"
                          aria-label={`Editar ${mun.name}`}
                          data-testid={`action-edit-${mun.id}`}
                          className="h-8 w-8 rounded-full text-slate-600 hover:bg-slate-100 hover:text-[#111C4E]"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => onGenerateKey(mun)}
                          title="Gerar nova chave de API"
                          aria-label={`Gerar chave de API para ${mun.name}`}
                          data-testid={`action-generate-key-${mun.id}`}
                          className="h-8 w-8 rounded-full text-slate-600 hover:bg-slate-100 hover:text-[#111C4E]"
                        >
                          <KeyRound className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
    </div>
  );
}
