"use client";
export const dynamic = "force-dynamic";
import { FiltersModal, FilterValues } from "@/components/filtros/filters-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { useFetchTeacherEvaluations } from "@/hooks/useFetchTeacherEvaluations";
import { useSecureFetch } from "@/hooks/useSecureFetch";
import { getPageNumbers } from "@/lib/utils";
import { Filters } from "@/types/filters";
import { Eye, Filter, MoreHorizontal, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TeachersEvaluation() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [openSelecaoStudents, setOpenSelecaoStudents] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const { user, token, isLoading: authLoading } = useAuth();
  const { secureFetch } = useSecureFetch();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [shouldFetchEvaluations, setShouldFetchEvaluations] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    state: "",
    city: "",
    schoolID: "",
    searchTerm: "",
    status: "",
  });

  const {
    evaluations,
    total,
    uniqueTotal,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchTeacherEvaluations(
    shouldFetchEvaluations ? currentPage : 1,
    itemsPerPage,
    refreshTrigger,
    filters,
  );

const [mySummary, setMySummary] = useState({
    total: 0,
    pendingFill: 0,
    pendingSign: 0,
    signed: 0,
  });

  useEffect(() => {
    if (!token || authLoading) return;
    const fetchSummary = async () => {
      try {
        const cleanApiUrl = (apiUrl || "").replace(/\/+$/, "");
        const res = await secureFetch(`${cleanApiUrl}/api/v1/regular-teacher-evaluations/my-summary`);
        if (res.ok) {
          const json = await res.json();
          const d = json?.data ?? json?.Data;
          const isSuccess = json?.success ?? json?.Success;
          if (isSuccess && d) {
            setMySummary({
              total: Number(d.total ?? d.Total ?? 0),
              pendingFill: Number(d.pendingFill ?? d.PendingFill ?? 0),
              pendingSign: Number(d.pendingSign ?? d.PendingSign ?? 0),
              signed: Number(d.signed ?? d.Signed ?? 0),
            });
          }
        }
      } catch (e) {
        console.error("Erro ao buscar resumo das minhas demandas Avaliação", e);
      }
    };
    fetchSummary();
  }, [token, authLoading, refreshTrigger, apiUrl, secureFetch]);

  useEffect(() => {
    if (!filters.onlyMyDocs || fetchLoading) return;
    const count = uniqueTotal ?? total ?? 0;
    const currentStatus = filters.myStatus || "all";
    setMySummary((prev) => {
      if (currentStatus === "pending_fill") return { ...prev, pendingFill: count };
      if (currentStatus === "pending_sign") return { ...prev, pendingSign: count };
      if (currentStatus === "signed") return { ...prev, signed: count };
      if (currentStatus === "all") return { ...prev, total: count };
      return prev;
    });
  }, [filters.onlyMyDocs, filters.myStatus, fetchLoading, uniqueTotal, total]);

  useEffect(() => {
    if (!authLoading && user) {
      setShouldFetchEvaluations(true);
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (!authLoading && user) {
      const userRoles = user.roles?.map((r) => r.toLowerCase()) || [];
      if (userRoles.includes("secretary")) {
        router.push("/acompanhamento-estudos-caso");
      }
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (fetchLoading) return;
    if (fetchError) {
      if (
        !fetchError.message.includes("Nenhuma avaliação foi cadastrado ainda")
      )
        toast({
          title: "Erro ao buscar avaliações",
          description: fetchError.message || "Ocorreu um erro desconhecido.",
          variant: "destructive",
        });
    }
  }, [fetchError, fetchLoading, toast]);

  const filteredEvaluations = evaluations || [];

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

  if (authLoading) {
    return (
      <main className="flex-1 p-6 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
        <div className="flex items-center justify-center h-64">
          <p>Carregando...</p>
        </div>
      </main>
    );
  }

  const userRole = !authLoading ? user?.roles?.[0]?.toLowerCase() : "";
  const isTeacherOrAdmin =
    !authLoading &&
    user?.roles?.some((r) => ["admin", "teacher"].includes(r.toLowerCase()));

  return (
    <main className="flex-1 p-6 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#111C4E]">
          Estudos de Caso
        </h1>
        <div className="flex gap-2">
          <Button
            onClick={() => setOpenFilterModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors shadow"
          >
            <Filter className="w-8 h-8" strokeWidth={2} />
          </Button>
        </div>
      </div>

      {isTeacherOrAdmin && (
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <button
              type="button"
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  onlyMyDocs: false,
                  onlyMyReports: false,
                  myStatus: "",
                }));
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                !filters.onlyMyDocs
                  ? "bg-[#111C4E] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Todos os Alunos
            </button>

            <button
              type="button"
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  onlyMyDocs: true,
                  onlyMyReports: true,
                  myStatus: prev.myStatus || "all",
                }));
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                filters.onlyMyDocs
                  ? "bg-[#111C4E] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>Associados a Você</span>
              {mySummary.total > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    filters.onlyMyDocs
                      ? "bg-white text-[#111C4E]"
                      : "bg-[#111C4E] text-white"
                  }`}
                >
                  {mySummary.total}
                </span>
              )}
            </button>
          </div>

          {filters.onlyMyDocs && (
            <div className="flex flex-wrap items-center gap-2 pt-1 animate-in fade-in duration-200">
              <button
                type="button"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, myStatus: "all" }));
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border transition-all ${
                  !filters.myStatus || filters.myStatus === "all"
                    ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span>Todos os meus</span>
                <span className="bg-slate-200/50 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                  {mySummary.total}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, myStatus: "pending_fill" }));
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border transition-all ${
                  filters.myStatus === "pending_fill"
                    ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                    : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                }`}
              >
                <span>📝 Falta eu preencher</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    filters.myStatus === "pending_fill"
                      ? "bg-amber-700 text-white"
                      : "bg-amber-200 text-amber-900"
                  }`}
                >
                  {mySummary.pendingFill}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, myStatus: "pending_sign" }));
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border transition-all ${
                  filters.myStatus === "pending_sign"
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100"
                }`}
              >
                <span>✍️ Falta eu assinar</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    filters.myStatus === "pending_sign"
                      ? "bg-blue-700 text-white"
                      : "bg-blue-200 text-blue-900"
                  }`}
                >
                  {mySummary.pendingSign}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, myStatus: "signed" }));
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border transition-all ${
                  filters.myStatus === "signed"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                }`}
              >
                <span>✅ Assinados por mim</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    filters.myStatus === "signed"
                      ? "bg-emerald-700 text-white"
                      : "bg-emerald-200 text-emerald-900"
                  }`}
                >
                  {mySummary.signed}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar estudos de caso..."
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
          Estudos encontrados: {" "}
          <span className="font-semibold text-[#111C4E]">
            {uniqueTotal ?? 0}
          </span>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aluno</TableHead>
              <TableHead>Escola</TableHead>
              <TableHead>Série</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fetchLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Carregando avaliações...
                </TableCell>
              </TableRow>
            ) : filteredEvaluations.length > 0 ? (
              filteredEvaluations.map((evaluation) => (
                <TableRow key={evaluation.id || evaluation.student?.id}>
                  <TableCell className="font-medium">
                    {evaluation.student?.fullName ?? "Aluno não encontrado"}
                  </TableCell>
                  <TableCell>{evaluation.student?.schoolName ?? "-"}</TableCell>
                  <TableCell>{evaluation.student?.serie ?? "-"}</TableCell>
                  <TableCell>{evaluation.localCreatedAt}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        evaluation.status === "Completo"
                          ? "default"
                          : "outline"
                      }
                      className={
                        evaluation.status === "Completo"
                          ? "bg-green-500 text-white"
                          : evaluation.status === "Incompleto"
                            ? "bg-yellow-500 text-black border-none"
                            : "bg-gray-200 text-gray-700 border-none"
                      }
                    >
                      {evaluation.status}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    {evaluation.id !== "00000000-0000-0000-0000-000000000000" ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/professor-avaliacao/${evaluation.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar Avaliação
                            </Link>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum avaliação encontrado.
                </TableCell>
              </TableRow>
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
        enableCaseStudyStatusFilter={true}
        enablePeriodFilter={true}
      />
    </main>
  );
}
