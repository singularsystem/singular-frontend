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
import { useFetchQuestionnairesNeuropsychopedagogical } from "@/hooks/useFetchTeacherQuestionnaire";
import { getPageNumbers } from "@/lib/utils";
import { Student } from "@/types/aluno";
import { Filters } from "@/types/filters";
import { NeuropsychopedagogicalQuestionnaire } from "@/types/questionario-professor";
import {
  Eye,
  Filter,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TeachersQuestionnaire() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [openSelecaoStudents, setOpenSelecaoStudents] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const { user, token, isLoading: authLoading } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [shouldFetchQuestionnaires, setShouldFetchQuestionnaires] =
    useState(false);
  const [filters, setFilters] = useState<Filters>({
    state: "",
    city: "",
    schoolID: "",
    searchTerm: "",
  });
  const {
    questionarios,
    total,
    uniqueTotal,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchQuestionnairesNeuropsychopedagogical(
    shouldFetchQuestionnaires ? currentPage : 1,
    itemsPerPage,
    refreshTrigger,
    filters,
  );

  useEffect(() => {
    if (!authLoading && user) {
      setShouldFetchQuestionnaires(true);
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (fetchLoading) return;
    if (fetchError) {
      if (
        !fetchError.message.includes("Nenhum questionário foi cadastrado ainda")
      )
        toast({
          title: "Erro ao buscar questionários",
          description: fetchError.message || "Ocorreu um erro desconhecido.",
          variant: "destructive",
        });
    }
  }, [fetchError, fetchLoading, toast]);

  const filteredQuestionnaires = questionarios || [];

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

    if (role === "teacher") {
      router.push(`/professor-questionario/novo/${aluno.id}`);
      toast({
        title: "Iniciando plano",
        description: "Você está iniciando um novo questionário.",
        variant: "info",
      });
    } else {
      setOpenSelecaoStudents(false);
      toast({
        title: "Você não tem permissão para isso",
        description: "Você não tem permissão para criar questionários",
        variant: "warning",
      });
    }
  };

  const handleRemove = (questionario: NeuropsychopedagogicalQuestionnaire) => {
    const userRole = user?.roles?.[0]?.toLowerCase();
    if (userRole === "admin" || userRole === "teacher") {
      setSelectedId(questionario.id);
      setShowConfirm(true);
    } else {
      toast({
        title: "Você não tem permissão para isso",
        description: "Você não tem permissão para excluir questionários",
        variant: "warning",
      });
    }
  };

  const confirmRemove = async () => {
    if (selectedId && token) {
      try {
        const response = await fetch(
          `${apiUrl}/api/v1/regular-teacher-questionnaires/${selectedId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Erro ao remover questionário");
        }

        const result = await response.json();

        if (result.success) {
          setShowConfirm(false);
          setRefreshTrigger((prev) => prev + 1);
          toast({
            title: "Questionário excluído com sucesso",
            description: "Esse questionário foi removido da lista",
            variant: "success",
          });
        } else {
          toast({
            title: "Erro ao remover questionário",
            description: "Não foi possível remover esse questionário",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Erro ao remover questionário",
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
          Questionários do Professor Regular
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
              Novo Questionário
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar questionários..."
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
          Questionários encontrados:{" "}
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
              <TableHead className="w-[100px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fetchLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Carregando questionários...
                </TableCell>
              </TableRow>
            ) : filteredQuestionnaires.length > 0 ? (
              filteredQuestionnaires.map((questionario) => (
                <TableRow key={questionario.id}>
                  <TableCell className="font-medium">
                    {questionario.student?.fullName ?? "Aluno não encontrado"}
                  </TableCell>
                  <TableCell>{questionario.student?.schoolName ?? "-"}</TableCell>
                  <TableCell>{questionario.student?.serie ?? "-"}</TableCell>
                  <TableCell>{questionario.localCreatedAt}</TableCell>

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
                          <Link
                            href={`/professor-questionario/${questionario.id}`}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Visualizar Questionário
                          </Link>
                        </DropdownMenuItem>
                        {userRole === "teacher" && (
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/professor-questionario/${questionario.id}/editar`}
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Editar
                            </Link>
                          </DropdownMenuItem>
                        )}
                        {(userRole === "teacher" || userRole === "admin") && (
                          <DropdownMenuItem
                            onClick={() => handleRemove(questionario)}
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
                  Nenhum questionário encontrado.
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
        documentName="Questionário"
      />

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Remoção</DialogTitle>
            <p>Tem certeza que deseja remover este questionário?</p>
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
