"use client";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { getPageNumbers } from "@/lib/utils";
import { Student } from "@/types/aluno";
import {
  Eye,
  FileText,
  Filter,
  Pencil,
  Plus,
  Search,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PAEEEntity } from "../../../model/entities/paee/PAEEEntity";
import { usePaeeList } from "../../hooks/paee/usePaeeList";
import { PaeeTableSkeleton } from "../../components/paee/PaeeTableSkeleton";
import { useSecureFetch } from "@/hooks/useSecureFetch";

export function PaeeScreen() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  
  const {
    state,
    setPage,
    setPageSize,
    setFilters,
    deletePAEE
  } = usePaeeList();

  const [openSelecaoStudents, setOpenSelecaoStudents] = useState(false);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { secureFetch } = useSecureFetch();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [mySummary, setMySummary] = useState({
    total: 0,
    pendingFill: 0,
    pendingSign: 0,
    signed: 0,
  });

  useEffect(() => {
    if (authLoading || !user) return;
    const fetchSummary = async () => {
      try {
        const cleanApiUrl = (apiUrl || "").replace(/\/+$/, "");
        const res = await secureFetch(`${cleanApiUrl}/api/v1/paees/my-summary`);
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
        console.error("Erro ao buscar resumo das minhas demandas PAEE", e);
      }
    };
    fetchSummary();
  }, [authLoading, user, apiUrl, secureFetch]);

  useEffect(() => {
    if (!state.filters.onlyMyDocs && !state.filters.onlyMyReports) return;
    if (state.isLoading) return;
    const count = state.uniqueTotal ?? state.total ?? 0;
    const currentStatus = state.filters.myStatus || "all";
    setMySummary((prev) => {
      if (currentStatus === "pending_fill") return { ...prev, pendingFill: count };
      if (currentStatus === "pending_sign") return { ...prev, pendingSign: count };
      if (currentStatus === "signed") return { ...prev, signed: count };
      if (currentStatus === "all") return { ...prev, total: count };
      return prev;
    });
  }, [state.filters.onlyMyDocs, state.filters.onlyMyReports, state.filters.myStatus, state.isLoading, state.uniqueTotal, state.total]);

  useEffect(() => {
    if (!state.isLoading && state.error) {
      if (!state.error.includes("Nenhum PAEE foi cadastrado ainda")) {
        toast({
          title: "Erro ao buscar planos",
          description: state.error,
          variant: "destructive",
        });
      }
    }
  }, [state.error, state.isLoading]);

  const totalPages = Math.ceil(state.total / state.pageSize);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setPage(page);
  };

  const handleSearch = (value: string) => {
    setFilters({ searchTerm: value });
  };

  const confirmFiltering = async (selected: FilterValues) => {
    setFilters(selected);
  };

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
        router.push(`/paee/novo/${aluno.id}/portage`);
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

  const handleRemove = (plano: PAEEEntity) => {
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
        await deletePAEE(selectedId);
        setShowConfirm(false);
        toast({
          title: "PAEE excluído com sucesso",
          description: "Esse PAEE foi removido da lista",
          variant: "success",
        });
      } catch (error: any) {
        toast({
          title: "Erro ao remover PAEE",
          description: error.message || "Não foi possível remover esse PAEE",
          variant: "destructive",
        });
      }
    }
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
          PAEE
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
              className="bg-[#111C4E] hover:bg-blue-800 text-white"
              disabled={state.isLoading}
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo PAEE
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
                setFilters({
                  onlyMyDocs: false,
                  onlyMyReports: false,
                  myStatus: "",
                });
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                !state.filters.onlyMyDocs && !state.filters.onlyMyReports
                  ? "bg-[#111C4E] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Todos os Alunos
            </button>

            <button
              type="button"
              onClick={() => {
                setFilters({
                  onlyMyDocs: true,
                  onlyMyReports: true,
                  myStatus: state.filters.myStatus || "all",
                });
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                state.filters.onlyMyDocs || state.filters.onlyMyReports
                  ? "bg-[#111C4E] text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>Associados a Você</span>
              {mySummary.total > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    state.filters.onlyMyDocs || state.filters.onlyMyReports
                      ? "bg-white text-[#111C4E]"
                      : "bg-[#111C4E] text-white"
                  }`}
                >
                  {mySummary.total}
                </span>
              )}
            </button>
          </div>

          {(state.filters.onlyMyDocs || state.filters.onlyMyReports) && (
            <div className="flex flex-wrap items-center gap-2 pt-1 animate-in fade-in duration-200">
              <button
                type="button"
                onClick={() => {
                  setFilters({ myStatus: "all" });
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border transition-all ${
                  !state.filters.myStatus || state.filters.myStatus === "all"
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
                  setFilters({ myStatus: "pending_fill" });
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border transition-all ${
                  state.filters.myStatus === "pending_fill"
                    ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                    : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                }`}
              >
                <span>📝 Falta eu preencher</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    state.filters.myStatus === "pending_fill"
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
                  setFilters({ myStatus: "pending_sign" });
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border transition-all ${
                  state.filters.myStatus === "pending_sign"
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100"
                }`}
              >
                <span>✍️ Falta eu assinar</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    state.filters.myStatus === "pending_sign"
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
                  setFilters({ myStatus: "signed" });
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border transition-all ${
                  state.filters.myStatus === "signed"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                }`}
              >
                <span>✅ Assinados por mim</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    state.filters.myStatus === "signed"
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
            value={state.filters.searchTerm ?? ""}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="text-sm text-gray-600 whitespace-nowrap">
          PAEEs encontrados:{" "}
          <span className="font-semibold text-[#111C4E]">
            {state.uniqueTotal ?? 0}
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
              <TableHead>Tipo de Deficiência</TableHead>
              <TableHead>Professor(a)</TableHead>
              <TableHead>Data de Criação</TableHead>
              <TableHead className="w-[160px] text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {state.isLoading ? (
              <PaeeTableSkeleton pageSize={state.pageSize} />
            ) : state.paees.length > 0 ? (
              state.paees.map((plano) => (
                <TableRow key={plano.id}>
                  <TableCell className="font-medium">
                    {plano.student?.fullName ?? "Aluno não encontrado"}
                  </TableCell>
                  <TableCell>{plano.student?.schoolName ?? "-"}</TableCell>
                  <TableCell>{plano.student?.serie ?? "-"}</TableCell>
                  <TableCell>{plano.typeOfDisability}</TableCell>
                  <TableCell>{plano.professional?.fullName ?? "-"}</TableCell>
                  <TableCell>{plano.localCreatedAt}</TableCell>

                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Link href={`/paee/plano/${plano.id}`} title="Visualizar PAEE">
                        <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      {plano.portage?.id && plano.student?.id && (
                        <Link href={`/paee/portage/${plano.student.id}`} title="Visualizar Avaliação">
                          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                      {userRole === "teacher" && (
                        <Link href={`/paee/plano/${plano.id}/editar`} title="Editar">
                          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-amber-600 hover:text-amber-800 hover:bg-amber-50">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                      {(userRole === "teacher" || userRole === "admin") && plano.teacherSign !== true && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50"
                          onClick={() => handleRemove(plano)}
                          title="Excluir"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum plano encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Mostrar</span>
          <Select
            value={String(state.pageSize)}
            onValueChange={(val) => setPageSize(Number(val))}
          >
            <SelectTrigger className="w-16 h-8">
              <SelectValue placeholder={String(state.pageSize)} />
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

        {totalPages > 0 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(state.currentPage - 1)}
                  aria-disabled={state.currentPage === 1}
                  className={
                    state.currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"
                  }
                />
              </PaginationItem>

              {getPageNumbers(totalPages, state.currentPage).map((page, i) => (
                <PaginationItem key={i}>
                  {page === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      isActive={state.currentPage === page}
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
                  onClick={() => handlePageChange(state.currentPage + 1)}
                  aria-disabled={state.currentPage === totalPages}
                  className={
                    state.currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      <SelecaoEstudanteModal
        open={openSelecaoStudents}
        onOpenChange={setOpenSelecaoStudents}
        handleStart={handleStart}
        documentName="Plano"
      />

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Confirmar Remoção</DialogTitle>
            <p>Tem certeza que deseja remover este PAEE? Essa ação não pode ser desfeita.</p>
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
