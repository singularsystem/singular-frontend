"use client";
export const dynamic = "force-dynamic";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetchStudents } from "@/hooks/useFetchStudents";
import { useFetchSchools } from "@/hooks/useFetchSchools";
import { Student } from "@/types/aluno";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import { useToast } from "../ui/use-toast";
import { getPageNumbers } from "@/lib/utils";

interface SelecaoEstudanteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleStart: (aluno: Student) => void;
  documentName: string;
}

export function SelecaoEstudanteModal({
  open,
  onOpenChange,
  handleStart,
  documentName,
}: SelecaoEstudanteModalProps) {
  const [scrollIndicator, setScrollIndicator] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSchoolID, setSelectedSchoolID] = useState<string>("all");
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const effectiveServerSearchTerm =
    searchTerm.trim().length >= 3 ? searchTerm.trim() : "";

  const { escolas: schoolsList, loading: loadingSchools } = useFetchSchools(
    1,
    100,
    0,
    "",
    { enabled: open }
  );

  const {
    alunos,
    total,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchStudents(
    currentPage,
    itemsPerPage,
    refreshTrigger,
    {
      searchTerm: effectiveServerSearchTerm,
      schoolID: selectedSchoolID === "all" ? "" : selectedSchoolID,
    },
    {
      enabled: open,
    }
  );

  useEffect(() => {
    if (fetchLoading) return;

    if (fetchError) {
      toast({
        title: "Erro ao buscar alunos",
        description: fetchError.message || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    }
  }, [fetchError, fetchLoading, alunos, total, toast]);

  useEffect(() => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight } = scrollRef.current;
      setScrollIndicator(scrollHeight > clientHeight);
    }
  }, [open]);

  const filteredStudents = (alunos || []).filter((aluno) => {
    const matchesSearch =
      aluno.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      aluno.schoolName.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (documentName === "Questionário MCHAT-R/F") {
      return (
        aluno.mchatrQuestionnaireID != null &&
        aluno.mchatrQuestionnaireScore >= 3 &&
        aluno.mchatrQuestionnaireScore <= 7
      );
    }

    return true;
  });

  const totalPages = Math.ceil(total / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedSchoolID]);

  useEffect(() => {
    if (!open) return;
    setCurrentPage(1);
    setSelectedSchoolID("all");
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[80vh] flex flex-col p-0 gap-0">
        {/* Header */}
        <div className="px-6 pt-4 pb-4 border-b shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl text-[#111C4E]">
              Lista de Estudantes
            </DialogTitle>
          </div>
          <DialogDescription>
            Selecione um estudante para criar um novo {documentName}
          </DialogDescription>
        </div>

        {/* Lista com scroll */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar alunos..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full sm:w-72">
              <Select value={selectedSchoolID} onValueChange={setSelectedSchoolID}>
                <SelectTrigger className="w-full bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Filtrar por Escola" />
                </SelectTrigger>
                <SelectContent className="max-h-60 overflow-y-auto">
                  <SelectItem value="all">Todas as Escolas</SelectItem>
                  {loadingSchools ? (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground text-center">
                      Carregando escolas...
                    </div>
                  ) : schoolsList && schoolsList.length > 0 ? (
                    schoolsList.map((school) => (
                      <SelectItem key={school.id} value={school.id}>
                        {school.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground text-center">
                      Nenhuma escola encontrada
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Data de Nascimento</TableHead>
                  <TableHead>Escola</TableHead>
                  <TableHead>Série</TableHead>
                  <TableHead>Município</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((aluno) => (
                    <TableRow key={aluno.id}>
                      <TableCell className="font-medium text-[#111C4E]">
                        {aluno.fullName}
                      </TableCell>
                      <TableCell className="text-gray-800">
                        {aluno.formattedDateOfBirth}
                      </TableCell>
                      <TableCell className="text-gray-800">
                        {aluno.schoolName}
                      </TableCell>
                      <TableCell className="text-gray-800">
                        {aluno.serie}
                      </TableCell>
                      <TableCell className="text-gray-800">
                        {aluno.schoolCity}
                      </TableCell>
                      <TableCell>
                        <Button
                          className="text-blue-400 hover:underline bg-white hover:bg-slate-300"
                          onClick={() => handleStart(aluno)}
                        >
                          Selecione
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Nenhum aluno encontrado.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
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
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center gap-2 p-3 border-t bg-background shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
