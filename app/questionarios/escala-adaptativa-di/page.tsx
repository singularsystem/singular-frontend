"use client";
export const dynamic = "force-dynamic";
import { SelecaoEstudanteModal } from "@/components/estudante/selecao-estudante-modal";
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
  useDeleteAdaptativeDIScale,
  useFetchAdaptativeDIScales,
} from "@/hooks/useFetchAdaptativeDIScale";
import { Student } from "@/types/aluno";
import { AdaptiveDIScale } from "@/types/escala-adaptative-di";
import {
  ArrowLeft,
  Eye,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function EscalaAdaptativaDIPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [openSelecaoStudents, setOpenSelecaoStudents] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { deleteQuestionnaire, loading } = useDeleteAdaptativeDIScale();
  const {
    questionarios,
    total,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchAdaptativeDIScales(
    currentPage,
    itemsPerPage,
    refreshTrigger,
    searchTerm,
  );

  useEffect(() => {
    if (fetchLoading) return;

    if (fetchError) {
      toast({
        title: "Erro ao buscar questionarios",
        description: fetchError.message || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    }
  }, [fetchError, fetchLoading, questionarios, searchTerm, toast]);

  const filteredQuestionarios = (questionarios || []).filter(
    (questionario) =>
      questionario.student?.fullName
        ?.toLowerCase()
        ?.includes(searchTerm.toLowerCase()) ||
      questionario.student?.schoolName
        ?.toLowerCase()
        ?.includes(searchTerm.toLowerCase()) ||
      questionario.localCreatedAt
        ?.toLowerCase()
        ?.includes(searchTerm.toLowerCase()),
  );

  const totalPages = Math.ceil(total / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const handleNewQuestionnaire = (aluno: Student) => {
    router.push(`/questionarios/escala-adaptativa-di/novo/${aluno.id}`);
    toast({
      title: "Iniciando questionário",
      description: "Você está iniciando um novo Escala Adaptativa-DI.",
      variant: "info",
    });
  };

  const canEdit =
    user?.roles[0].toLowerCase() === "admin" ||
    user?.roles[0].toLowerCase() === "psychologist";

  const handleView = (id: string) => {
    router.push(`/questionarios/escala-adaptativa-di/${id}`);
  };

  const handleEdit = (id: string) => {
    if (canEdit) {
      router.push(`/questionarios/escala-adaptativa-di/${id}/editar`);
    }
  };

  const handleRemove = (questionario: AdaptiveDIScale) => {
    if (
      user?.roles[0].toLowerCase() !== "admin" ||
      user?.roles[0].toLowerCase() !== "psychologist"
    ) {
      setSelectedId(questionario.id);
      setShowConfirm(true);
    } else {
      toast({
        title: "Você não tem permissão para isso",
        description:
          "Você está tentando acessar uma funcionalidade em que não tem permissão",
        variant: "warning",
      });
    }
  };

  const confirmRemove = async () => {
    if (selectedId) {
      try {
        const deleted = await deleteQuestionnaire(selectedId);
        console.log(deleted);

        setShowConfirm(false);
        setRefreshTrigger((prev) => prev + 1);
        toast({
          title: "Questionário excluído com sucesso",
          description: "Esse questionário foi removido da lista",
          variant: "success",
        });
        router.push("/questionarios/escala-adaptativa-di");
      } catch (error) {
        toast({
          title: "Erro ao remover questionário",
          description: String(error),
          variant: "destructive",
        });
      }
    }
  };

  return (
    <main className="flex-1 p-6 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/questionarios")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-[#111C4E]">
            Questionário Escala Adaptativa-DI
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              setOpenSelecaoStudents(true);
            }}
            className="bg-[#111C4E] hover:bg-blue-800"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Questionário
          </Button>
        </div>
      </div>

      <div className="flex items-center mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar questionários..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table className="w-full">
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
            {filteredQuestionarios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  Nenhum questionário encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredQuestionarios.map((questionario) => (
                <TableRow key={questionario.id}>
                  <TableCell className="font-medium">
                    {questionario.student?.fullName ?? "Aluno não encontrado"}
                  </TableCell>
                  <TableCell>{questionario.student?.schoolName ?? "-"}</TableCell>
                  <TableCell>{questionario.student?.serie ?? "-"}</TableCell>
                  <TableCell>
                    {questionario.localCreatedAt == null
                      ? "-"
                      : questionario.localCreatedAt}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleView(questionario.id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        {canEdit && (
                          <DropdownMenuItem
                            onClick={() => handleEdit(questionario.id)}
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Editar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem asChild>
                          <DropdownMenuItem
                            onClick={() => handleRemove(questionario)}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => handlePageChange(currentPage - 1)}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }, (_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                isActive={currentPage === i + 1}
                onClick={() => handlePageChange(i + 1)}
                href="#"
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      <SelecaoEstudanteModal
        open={openSelecaoStudents}
        onOpenChange={setOpenSelecaoStudents}
        handleStart={handleNewQuestionnaire}
        documentName="Questionário Escala Adaptativa-DI"
      />
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Remoção</DialogTitle>
            <p>Tem certeza que deseja remover este Questionário?</p>
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
    </main>
  );
}
