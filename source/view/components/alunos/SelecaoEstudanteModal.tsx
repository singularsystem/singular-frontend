"use client";

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
import { useAlunosList } from "../../hooks/alunos/useAlunosList";
import { AlunoEntity } from "../../../model/entities/alunos/AlunoEntity";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
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
import { getPageNumbers } from "@/lib/utils";

interface SelecaoEstudanteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  handleStart: (aluno: AlunoEntity) => void;
  documentName: string;
}

export function SelecaoEstudanteModal({
  open,
  onOpenChange,
  handleStart,
  documentName,
}: SelecaoEstudanteModalProps) {
  const { state, setPage, setFilters } = useAlunosList();
  const [searchTerm, setSearchTerm] = useState("");

  const totalPages = Math.ceil(state.total / state.pageSize);

  // Sincroniza busca local com ViewModel
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ ...state.filters, searchTerm });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Filtro específico para MCHAT (lógica de negócio preservada)
  const filteredAlunos = state.alunos.filter((aluno) => {
    if (documentName === "Questionário MCHAT-R/F") {
      return (
        aluno.mchatrQuestionnaireID != null &&
        (aluno.mchatrQuestionnaireScore || 0) >= 3 &&
        (aluno.mchatrQuestionnaireScore || 0) <= 7
      );
    }
    return true;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[80vh] flex flex-col p-0 gap-0">
        <div className="px-6 pt-4 pb-4 border-b shrink-0">
          <DialogTitle className="text-2xl text-[#111C4E]">
            Lista de Estudantes
          </DialogTitle>
          <DialogDescription>
            Selecione um estudante para criar um novo {documentName}
          </DialogDescription>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-6">
          <div className="flex items-center mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="search"
                placeholder="Buscar alunos..."
                className="pl-10 h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="overflow-x-auto rounded-md border">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Data de Nascimento</TableHead>
                  <TableHead>Escola</TableHead>
                  <TableHead>Série</TableHead>
                  <TableHead>Município</TableHead>
                  <TableHead className="w-[100px] text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAlunos.length > 0 ? (
                  filteredAlunos.map((aluno) => (
                    <TableRow key={aluno.id}>
                      <TableCell className="font-medium text-[#111C4E]">
                        {aluno.fullName}
                      </TableCell>
                      <TableCell className="text-gray-800">
                        {aluno.formattedDateOfBirth || aluno.dataNascimento}
                      </TableCell>
                      <TableCell className="text-gray-800">
                        {aluno.schoolName}
                      </TableCell>
                      <TableCell className="text-gray-800">
                        {aluno.serie}
                      </TableCell>
                      <TableCell className="text-gray-800">
                        {aluno.city}
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                          onClick={() => {
                            handleStart(aluno);
                            onOpenChange(false);
                          }}
                        >
                          Selecionar
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground italic">
                      {state.isLoading ? "Carregando alunos..." : "Nenhum aluno encontrado."}
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
                    onClick={() => setPage(state.currentPage - 1)}
                    aria-disabled={state.currentPage === 1}
                    className={state.currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                {getPageNumbers(totalPages, state.currentPage).map((page, i) => (
                  <PaginationItem key={i}>
                    {page === "ellipsis" ? (
                      <PaginationEllipsis />
                    ) : (
                      <PaginationLink
                        isActive={state.currentPage === page}
                        onClick={() => setPage(page as number)}
                        className="cursor-pointer"
                      >
                        {page}
                      </PaginationLink>
                    )}
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => setPage(state.currentPage + 1)}
                    aria-disabled={state.currentPage === totalPages}
                    className={state.currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>

        <div className="flex justify-end items-center gap-2 p-4 border-t bg-gray-50 shrink-0">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
