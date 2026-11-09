"use client";
export const dynamic = "force-dynamic";
import { SelecaoEstudanteModal } from "@/components/estudante/selecao-estudante-modal";
import { FiltersModal, FilterValues } from "@/components/filtros/filters-modal";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { useDeletePEI, useFetchPEIs } from "@/hooks/useFetchPEI";
import { useSecureFetch } from "@/hooks/useSecureFetch";
import { getPageNumbers } from "@/lib/utils";
import { Student } from "@/types/aluno";
import { Filters } from "@/types/filters";
import { PEI } from "@/types/pei";
import { Eye, Filter, MoreHorizontal, Plus, Search, Trash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Pei() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [openSelecaoStudents, setOpenSelecaoStudents] = useState(false);
  const { user, token, isLoading: authLoading } = useAuth();
  const { secureFetch } = useSecureFetch();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [shouldFetchPEIs, setShouldFetchPEIs] = useState(false);
  const { deletePEI, loading } = useDeletePEI();
  const [filters, setFilters] = useState<Filters>({
    state: "",
    city: "",
    schoolID: "",
    searchTerm: "",
  });
  const {
    planos,
    total,
    uniqueTotal,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchPEIs(
    shouldFetchPEIs ? currentPage : 1,
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
        const res = await secureFetch(`${cleanApiUrl}/api/v1/peis/my-summary`);
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
        console.error("Erro ao buscar resumo das minhas demandas PEI", e);
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
      setShouldFetchPEIs(true);
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (fetchLoading) return;
    if (fetchError) {
      if (!fetchError.message.includes("Nenhum PEI foi cadastrado ainda"))
        toast({
          title: "Erro ao buscar planos",
          description: fetchError.message || "Ocorreu um erro desconhecido.",
          variant: "destructive",
        });
    }
  }, [fetchError, fetchLoading, toast]);

  const filteredPlanos = planos || [];

  const totalPages = Math.ceil(total / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.searchTerm]);

  const handleStart = (aluno: Student) => {
    if (!user) return;

    const role = user.roles?.[0]?.toLowerCase();

    if (aluno.reportStatus === "Não Iniciado") {
      toast({
        title: "Essa operação não é permitida!",
        description:
          "É necessário criar o relatório biopsicossocial desse aluno antes",
        variant: "warning",
      });

      setTimeout(() => {
        setOpenSelecaoStudents(false);
      }, 300);
    } else {
      if (role === "teacher") {
        router.push(`/pei/novo/${aluno.id}`);
        toast({
          title: "Iniciando plano",
          description: "Você está iniciando um novo plano de aula.",
          variant: "info",
        });
      } else {
        setOpenSelecaoStudents(false);
        toast({
          title: "Você não tem permissão para isso",
          description: "Você não tem permissão para criar planos",
          variant: "warning",
        });
      }
    }
  };

  const handleRemove = (plano: PEI) => {
    const userRole = user?.roles?.[0]?.toLowerCase();
    if (userRole === "admin" || userRole === "teacher") {
      setSelectedId(plano.id);
      setShowConfirm(true);
    } else {
      toast({
        title: "Você não tem permissão para isso",
        description: "Você não tem permissão para excluir planos",
        variant: "warning",
      });
    }
  };

  const confirmRemove = async () => {
    if (selectedId) {
      try {
        const deleted = await deletePEI(selectedId);
        console.log(deleted);

        setShowConfirm(false);
        setRefreshTrigger((prev) => prev + 1);

        toast({
          title: "PEI excluído com sucesso",
          description: "Esse PEI foi removido da lista",
          variant: "success",
        });
      } catch (error) {
        toast({
          title: "Erro ao remover PEI",
          description:
            error instanceof Error ? error.message : "Erro desconhecido",
          variant: "destructive",
        });
      }
    }
  };

  const confirmFiltering = async (selected: FilterValues) => {
    setCurrentPage(1);
    setFilters((prev) => ({
      ...prev,
      ...selected,
      searchTerm: prev.searchTerm,
    }));
  };

  const isTeacher = !authLoading && user?.roles?.[0] === "Teacher";
  const isTeacherOrAdmin =
    !authLoading &&
    user?.roles?.some((r) => ["admin", "teacher"].includes(r.toLowerCase()));
  const userRole = !authLoading ? user?.roles?.[0]?.toLowerCase() : "";

  if (authLoading) {
    return (
      <main className="flex-1 p-6 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
        <div className="flex items-center justify-center h-64">
          <p>Carregando...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#111C4E]">
          PEI
        </h1>
        <div className="flex gap-2">
          <Button
            onClick={() => setOpenFilterModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors shadow"
          >
            <Filter className="w-8 h-8" strokeWidth={2} />
          </Button>
          {isTeacher && (
            <Button
              onClick={() => setOpenSelecaoStudents(true)}
              className="bg-[#111C4E] hover:bg-blue-800"
              disabled={fetchLoading}
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo PEI
            </Button>
          )}
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
            placeholder="Buscar planos..."
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
          PEIs encontrados: {" "}
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
              <TableHead>Professor(a)</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fetchLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Carregando planos...
                </TableCell>
              </TableRow>
            ) : filteredPlanos.length > 0 ? (
              filteredPlanos.map((plano) => (
                <TableRow key={plano.id}>
                  <TableCell className="font-medium">
                    {plano.student?.fullName ?? "Aluno não encontrado"}
                  </TableCell>
                  <TableCell>{plano.student?.schoolName ?? "-"}</TableCell>
                  <TableCell>{plano.student?.serie ?? "-"}</TableCell>
                  <TableCell>{plano.professional?.fullName ?? "-"}</TableCell>
                  <TableCell>{plano.localCreatedAt}</TableCell>

                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/pei/${plano.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar PEI
                          </Link>
                        </DropdownMenuItem>
                        {plano.student?.id && (
                          <DropdownMenuItem asChild>
                            <Link href={`/pei/${plano.student.id}/avaliacao`}>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar Avaliação
                            </Link>
                          </DropdownMenuItem>
                        )}
                        {(userRole === "teacher" || userRole === "admin") &&
                          plano.teacherSign !== true && (
                            <DropdownMenuItem
                              onClick={() => handleRemove(plano)}
                            >
                              <Trash className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhum plano encontrado.
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

      <SelecaoEstudanteModal
        open={openSelecaoStudents}
        onOpenChange={setOpenSelecaoStudents}
        handleStart={handleStart}
        documentName="PEI"
      />

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Remoção</DialogTitle>
            <p>Tem certeza que deseja remover este PEI?</p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmRemove}>
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <FiltersModal
        open={openFilterModal}
        onOpenChange={setOpenFilterModal}
        onConfirm={confirmFiltering}
      />
    </main>
  );
}
