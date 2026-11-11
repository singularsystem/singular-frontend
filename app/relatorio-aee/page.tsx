"use client";
export const dynamic = "force-dynamic";

import { ActionsBar } from "@/components/actions-bar";
import { FiltersModal, FilterValues } from "@/components/filtros/filters-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  useReportsAEEPdfDownload,
  useReportsAEEPdfPrint,
} from "@/hooks/useFetchPDFs";
import { useFetchReportAEE } from "@/hooks/useFetchReportAEE";
import { getPageNumbers } from "@/lib/utils";
import { Filters } from "@/types/filters";
import { Filter, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function RelatoriosPAEEPage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, isLoading: authLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [shouldFetchReports, setShouldFetchReports] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    state: "",
    city: "",
    schoolID: "",
    disability: [],
    disorder: [],
    searchTerm: "",
  });
  const { openDocumentPdf, isPrinting } = useReportsAEEPdfPrint(filters);
  const { downloadDocumentPdf, isGeneratingPDF } =
    useReportsAEEPdfDownload(filters);
  const {
    relatorios,
    total,
    uniqueTotal,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchReportAEE(
    shouldFetchReports ? currentPage : 1,
    itemsPerPage,
    refreshTrigger,
    filters,
  );

  useEffect(() => {
    if (!authLoading && user) {
      setShouldFetchReports(true);
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (fetchLoading) return;

    if (fetchError) {
      toast({
        title: "Erro ao buscar relatórios",
        description: fetchError.message || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    }
  }, [fetchError, fetchLoading, toast]);

  const filteredRelatorios = relatorios || [];

  const totalPages = Math.ceil(total / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.searchTerm]);

  const confirmFiltering = async (selected: FilterValues) => {
    setCurrentPage(1);
    setFilters((prev) => ({
      ...prev,
      ...selected,
      searchTerm: prev.searchTerm,
    }));
  };

  return (
    <main className="flex-1 p-6 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-brand-navy">
          Relatório Geral AEE
        </h1>
        <div className="flex gap-2">
          <Button
            onClick={() => setOpenFilterModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors shadow"
          >
            <Filter className="w-8 h-8" strokeWidth={2} />
          </Button>
          <ActionsBar
            onPrint={(win) => {
              void openDocumentPdf(win);
            }}
            onExportPDF={async () => {
              await downloadDocumentPdf();
            }}
            onSign={undefined}
            isPrinting={isPrinting}
            isGeneratingPDF={isGeneratingPDF}
            isSigning={authLoading}
            canSign={false}
            isSigned={false}
          />
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar relatórios..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value;
              setSearchTerm(value);
              setCurrentPage(1);
              setFilters((prev) => ({
                ...prev,
                searchTerm: value,
              }));
            }}
          />
        </div>
        <div className="text-sm text-gray-600 whitespace-nowrap">
          Relatórios encontrados: {" "}
          <span className="font-semibold text-brand-navy">
            {uniqueTotal ?? 0}
          </span>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aluno</TableHead>
              <TableHead>Idade</TableHead>
              <TableHead>Deficiências</TableHead>
              <TableHead>Transtornos</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Município</TableHead>
              <TableHead>Escola</TableHead>
              <TableHead>Série</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fetchLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Carregando relatórios...
                </TableCell>
              </TableRow>
            ) : filteredRelatorios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Nenhum relatório encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredRelatorios.map((relatorio) => (
                <TableRow key={relatorio.student.id}>
                  <TableCell className="font-medium">
                    {relatorio.student.fullName || "-"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {relatorio.student.age || "-"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {relatorio.disabilities?.length
                      ? relatorio.disabilities.join(", ")
                      : "N/A"}
                  </TableCell>

                  <TableCell className="font-medium">
                    {relatorio.disorders?.length
                      ? relatorio.disorders.join(", ")
                      : "N/A"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {relatorio.student.state || "-"}
                  </TableCell>
                  <TableCell className="font-medium">
                    {relatorio.student.city || "-"}
                  </TableCell>
                  <TableCell>{relatorio.student.schoolName || "-"}</TableCell>
                  <TableCell>{relatorio.student.serie || "-"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      {totalPages > 0 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                aria-disabled={currentPage === 1}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {getPageNumbers(totalPages, currentPage).map((page, i) => (
              <PaginationItem key={i}>
                {page === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    isActive={currentPage === page}
                    onClick={() => handlePageChange(page as number)}
                    href="#"
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                aria-disabled={currentPage === totalPages}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      <FiltersModal
        open={openFilterModal}
        onOpenChange={setOpenFilterModal}
        onConfirm={confirmFiltering}
        enableDisabilityFilter={true}
        enableDisorderFilter={true}
        enablePeriodFilter={true}
      />
    </main>
  );
}
