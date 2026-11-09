"use client";

import { useEscolasList } from "../../hooks/escolas/useEscolasList";
import { EscolasInlineFilters } from "../../components/escolas/EscolasInlineFilters";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { getPageNumbers } from "@/lib/utils";
import {
  Eye,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function EscolasScreen() {
  const router = useRouter();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();
  
  const {
    state: listState,
    setPage,
    setPageSize,
    setSearchTerm,
    setState,
    setCity,
    resetFilters,
    deleteEscola,
    refresh
  } = useEscolasList();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Expor erros no Toast se houver
  useEffect(() => {
    if (listState.error) {
      toast({
        title: "Erro ao buscar escolas",
        description: listState.error,
        variant: "destructive",
      });
    }
  }, [listState.error, toast]);

  const userRoles = Array.isArray(user?.roles)
    ? user!.roles.map((r) => r.toLowerCase())
    : [];
  const isAdmin = userRoles.includes("admin");
  const isSecretary = userRoles.includes("secretary");
  const isPrincipal = userRoles.includes("principal");

  const canEdit = isAdmin || isSecretary;
  const canRemove = isAdmin || isSecretary;

  const totalPages = Math.ceil(listState.total / listState.pageSize);

  const handleRemoveClick = (id: string) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const confirmRemove = async () => {
    if (selectedId) {
      await deleteEscola(selectedId);
      setShowConfirm(false);
      toast({
        title: "Escola excluída com sucesso",
        description: "Essa escola foi removida da lista.",
        variant: "success",
      });
      refresh();
    }
  };

  return (
    <main className="flex-1 p-6 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
      {/* Cabeçalho */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-[#111C4E]">
          Escolas
        </h1>
        {(isAdmin || isSecretary) && (
          <Button
            onClick={() => router.push("/escolas/cadastro")}
            className="bg-[#111C4E] hover:bg-blue-800 text-white font-medium"
          >
            <Plus className="mr-2 h-4 w-4" />
            Nova Escola
          </Button>
        )}
      </div>

      {/* Busca e Filtros */}
      <div className="mb-6 flex flex-nowrap items-center gap-3 overflow-x-auto pb-2 md:overflow-x-visible md:pb-0">
        <div className="relative w-80 md:w-96 flex-shrink-0">
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-20 pointer-events-none" />
          <Input
            id="buscaEscolas"
            type="search"
            placeholder="Buscar escolas..."
            className="pr-12 h-10"
            value={listState.searchTerm}
            autoComplete="off"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-nowrap items-center gap-2">
          <EscolasInlineFilters
            currentState={listState.state}
            currentCity={listState.city}
            cities={listState.cities}
            isLoadingCities={listState.isLoadingCities}
            onStateChange={setState}
            onCityChange={setCity}
            onReset={resetFilters}
          />
        </div>
      </div>

      {/* Tabela de Dados */}
      <div className="rounded-md border overflow-x-auto">
        <Table className="w-full min-w-[900px]">
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Município</TableHead>
              <TableHead>Diretor</TableHead>
              <TableHead>Total de Alunos</TableHead>
              <TableHead>Tipo de AEE</TableHead>
              <TableHead className="w-[100px] text-center text-[#111C4E] font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listState.isLoading ? (
              <EscolasTableSkeleton />
            ) : listState.escolas.length > 0 ? (
              listState.escolas.map((escola) => (
                <TableRow key={escola.id}>
                  <TableCell className="font-medium text-[#111C4E]">
                    {escola.name}
                  </TableCell>
                  <TableCell className="text-gray-800">{escola.city}</TableCell>
                  <TableCell className="text-gray-800">
                    {isPrincipal && escola.id === user?.schoolID ? (user?.fullName || "-") : (escola.principalName || "-")}
                  </TableCell>
                  <TableCell className="text-gray-800">
                    {escola.totalStudents}
                  </TableCell>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-[#111C4E] hover:bg-slate-50 transition-colors"
                        >
                          <Badge className="mr-2 bg-[#111C4E]">
                            {escola.totalStudentsAEE || 0}
                          </Badge>
                          Ver detalhes
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80 shadow-lg border border-slate-100 rounded-xl p-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold text-sm text-[#111C4E] leading-none">
                            Alunos por tipo de deficiência
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            Total de {escola.totalStudentsAEE || 0} aluno(s) no AEE
                          </p>
                          <div className="pt-2">
                            <Table className="w-full">
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="text-xs">Deficiência</TableHead>
                                  <TableHead className="text-right text-xs">Qtd</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {escola.disabilities && escola.disabilities.length > 0 ? (
                                  escola.disabilities.map((def, idx) => (
                                    <TableRow key={idx}>
                                      <TableCell className="text-xs py-2 text-slate-700">{def.tipo}</TableCell>
                                      <TableCell className="text-right text-xs py-2 font-medium text-[#111C4E]">{def.quantidade}</TableCell>
                                    </TableRow>
                                  ))
                                ) : (
                                  <TableRow>
                                    <TableCell
                                      colSpan={2}
                                      className="text-center text-xs py-4 text-muted-foreground"
                                    >
                                      Nenhum dado disponível
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full"
                        onClick={() => router.push(`/escolas/${escola.id}`)}
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {canEdit && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-full"
                          onClick={() => router.push(`/escolas/${escola.id}/editar`)}
                          title="Editar"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                      {canRemove && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full"
                          onClick={() => handleRemoveClick(escola.id)}
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
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                  Nenhuma escola encontrada.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação e Seletor de Page Size */}
      {totalPages > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Seletor de Page Size (Page Size Changer) */}
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <span>Mostrar</span>
            <Select
              value={String(listState.pageSize)}
              onValueChange={(val) => setPageSize(Number(val))}
            >
              <SelectTrigger className="w-16 h-8">
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

          {/* Paginação */}
          <Pagination className="justify-end flex-1 sm:w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage(listState.currentPage - 1)}
                  aria-disabled={listState.currentPage === 1}
                  className={listState.currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {getPageNumbers(totalPages, listState.currentPage).map((page, idx) => (
                <PaginationItem key={idx}>
                  {page === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      isActive={listState.currentPage === page}
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
                  onClick={() => setPage(listState.currentPage + 1)}
                  aria-disabled={listState.currentPage === totalPages}
                  className={listState.currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {/* Diálogo de Confirmação de Exclusão */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent className="rounded-2xl max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-slate-900">Confirmar Remoção</DialogTitle>
          </DialogHeader>
          <p className="text-slate-600 text-sm py-2">
            Tem certeza que deseja remover esta escola? Esta ação é definitiva e removerá a escola de todas as listagens.
          </p>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setShowConfirm(false)}
              className="rounded-xl"
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmRemove}
              className="rounded-xl font-medium"
            >
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function EscolasTableSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, idx) => (
        <TableRow key={idx}>
          <TableCell><Skeleton className="h-5 w-48 animate-pulse bg-gray-200" /></TableCell>
          <TableCell><Skeleton className="h-5 w-28 animate-pulse bg-gray-200" /></TableCell>
          <TableCell><Skeleton className="h-5 w-36 animate-pulse bg-gray-200" /></TableCell>
          <TableCell><Skeleton className="h-5 w-16 animate-pulse bg-gray-200" /></TableCell>
          <TableCell><Skeleton className="h-7 w-28 rounded-md animate-pulse bg-gray-200" /></TableCell>
          <TableCell>
            <div className="flex items-center justify-center">
              <Skeleton className="h-8 w-8 rounded-full animate-pulse bg-gray-200" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
