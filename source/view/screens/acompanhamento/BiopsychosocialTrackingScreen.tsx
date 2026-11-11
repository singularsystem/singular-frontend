"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { BiopsychosocialInlineFilters } from "../../components/acompanhamento/BiopsychosocialInlineFilters";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useBiopsychosocialTracking } from "../../hooks/acompanhamento/useBiopsychosocialTracking";
import {
  useBiopsychosocialTrackingPdfDownload,
} from "@/hooks/useFetchPDFs";
import { getPageNumbers } from "@/lib/utils";
import { Relatorio } from "@/types/relatorio";
import { Search, Loader2, FileDown } from "lucide-react";

export function BiopsychosocialTrackingScreen() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // Use the MVVM hook
  const {
    state: listState,
    setPage,
    setPageSize,
    setSearchTerm,
    setFilters,
  } = useBiopsychosocialTracking();

  // Route security
  useEffect(() => {
    if (!authLoading && user) {
      const userRoles = user.roles?.map((r) => r.toLowerCase()) || [];
      const hasAccess = userRoles.includes("secretary") || userRoles.includes("admin");
      if (!hasAccess) {
        router.push("/dashboard");
      }
    }
  }, [authLoading, user, router]);

  // Handle errors
  useEffect(() => {
    if (listState.error) {
      toast({
        title: "Erro ao buscar acompanhamento biopsicossocial",
        description: listState.error || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    }
  }, [listState.error, toast]);

  const { downloadDocumentPdf, isGeneratingPDF } = useBiopsychosocialTrackingPdfDownload(listState.filters);

  const totalPages = Math.ceil(listState.total / listState.pageSize);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setPage(page);
  };

  const handleExportPDF = async () => {
    try {
      await downloadDocumentPdf();
      toast({
        title: "Sucesso",
        description: "PDF de acompanhamento baixado com sucesso.",
        variant: "success",
      });
    } catch (err: any) {
      toast({
        title: "Erro ao exportar PDF",
        description: err.message || "Não foi possível baixar o PDF.",
        variant: "destructive",
      });
    }
  };

  if (authLoading) {
    return (
      <main className="flex-1 p-6 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden animate-pulse">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-10 w-48 bg-gray-200" />
          <Skeleton className="h-64 w-full bg-gray-200" />
        </div>
      </main>
    );
  }

  const getPendingProfessionals = (relatorio: Relatorio) => {
    const pending: string[] = [];
    if (!relatorio.psychologistReport) pending.push("Psicólogo");
    if (!relatorio.psychopedagogueReport) pending.push("Psicopedagogo");
    if (!relatorio.socialWorkerReport) pending.push("Assistente Social");

    if (pending.length === 0) return "-";
    if (pending.length === 3) return "Todos pendentes";
    
    if (pending.length === 2) {
      return `${pending[0]} e ${pending[1]} pendentes`;
    }
    return `${pending[0]} pendente`;
  };

  const getStatusBadgeClass = (status: string) => {
    if (status === "Completo") {
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-none font-medium";
    }
    return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-none font-medium";
  };

  return (
    <main className="flex-1 p-8 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-brand-navy">
            Acompanhamento Biopsicossocial
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Monitore o andamento dos relatórios biopsicossociais em seu município
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            onClick={handleExportPDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-2 flex-1 sm:flex-none"
          >
            {isGeneratingPDF ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <FileDown className="w-4 h-4" />
            )}
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Busca e Filtros */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por nome do aluno..."
              className="pl-9 h-10"
              value={listState.searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
              }}
            />
          </div>
          <div className="text-sm text-gray-500 whitespace-nowrap self-end sm:self-center">
            Relatórios encontrados:{" "}
            <span className="font-semibold text-brand-navy">
              {listState.uniqueTotal ?? 0}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <BiopsychosocialInlineFilters
            filters={listState.filters}
            onApply={setFilters}
          />
        </div>
      </div>

      {/* Table section */}
      <div className="rounded-xl border border-gray-100 overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="font-semibold text-slate-700 py-4">Aluno</TableHead>
              <TableHead className="font-semibold text-slate-700">Escola</TableHead>
              <TableHead className="font-semibold text-slate-700">Status Geral</TableHead>
              <TableHead className="font-semibold text-slate-700">Profissionais Pendentes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listState.isLoading ? (
              Array.from({ length: listState.pageSize }).map((_, idx) => (
                <TableRow key={idx} className="hover:bg-transparent">
                  <TableCell className="py-4"><Skeleton className="h-5 w-40 animate-pulse bg-slate-100" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-48 animate-pulse bg-slate-100" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24 animate-pulse bg-slate-100" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-44 animate-pulse bg-slate-100" /></TableCell>
                </TableRow>
              ))
            ) : listState.relatorios && listState.relatorios.length > 0 ? (
              listState.relatorios.map((relatorio, index) => (
                <TableRow key={`${relatorio.id || relatorio.student?.id || ""}-${index}`} className="hover:bg-slate-50/30 transition-colors">
                  <TableCell className="font-medium text-slate-900 py-4">
                    {relatorio.student?.fullName ?? "Aluno não encontrado"}
                  </TableCell>
                  <TableCell className="text-slate-600">
                    {relatorio.student?.schoolName ?? "-"}
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusBadgeClass(relatorio.status)}>
                      {relatorio.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600 font-medium">
                    {getPendingProfessionals(relatorio)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-gray-400">
                  Nenhum relatório biopsicossocial encontrado para os filtros selecionados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Footer / Pagination section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Mostrar</span>
          <Select
            value={String(listState.pageSize)}
            onValueChange={(val) => {
              setPageSize(Number(val));
            }}
          >
            <SelectTrigger className="w-16 h-9">
              <SelectValue placeholder={String(listState.pageSize)} />
            </SelectTrigger>
            <SelectContent>
              {[10, 15, 30, 50].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span>itens por página</span>
        </div>

        {totalPages > 1 && (
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(listState.currentPage - 1)}
                  aria-disabled={listState.currentPage === 1}
                  className={
                    listState.currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {getPageNumbers(totalPages, listState.currentPage).map((page, i) => (
                <PaginationItem key={i}>
                  {page === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      isActive={listState.currentPage === page}
                      onClick={() => handlePageChange(page as number)}
                      className="cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(listState.currentPage + 1)}
                  aria-disabled={listState.currentPage === totalPages}
                  className={
                    listState.currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>


    </main>
  );
}
