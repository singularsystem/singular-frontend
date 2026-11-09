"use client";

import { useAlunosList } from "../../hooks/alunos/useAlunosList";
import { useAlunoImport } from "../../hooks/alunos/useAlunoImport";
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
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis
} from "@/components/ui/pagination";
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
import { useAuth } from "@/contexts/auth-context";
import {
  Eye,
  Pencil,
  Plus,
  Search,
  Trash,
  Download,
  Upload,
  Printer,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getPageNumbers } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ImportacaoResultadoModal } from "../../components/alunos/ImportacaoResultadoModal";
import { InlineFilters } from "../../components/alunos/InlineFilters";
import {
  useStudentsListPdfDownload,
  useStudentsListPdfPrint,
} from "@/hooks/useFetchPDFs";
import { AlunosFilterModal } from "../../components/AlunosFilterModal";
import { Skeleton } from "@/components/ui/skeleton";

export function AlunosScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { 
    state: listState, 
    setPage, 
    setPageSize,
    setFilters, 
    deleteAluno, 
    downloadTemplate,
    refresh: refreshList 
  } = useAlunosList();

  const { openDocumentPdf, isPrinting } = useStudentsListPdfPrint(listState.filters);
  const { downloadDocumentPdf, isGeneratingPDF } = useStudentsListPdfDownload(listState.filters);

  const {
    state: importState,
    importFile,
    closeModal: closeImportModal,
    downloadFailedRows
  } = useAlunoImport();

  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openFilterModal, setOpenFilterModal] = useState(false);

  // Efeitos para toasts no processamento de planilhas (Task 4.2)
  useEffect(() => {
    if (importState.result) {
      toast({
        title: "Importação finalizada",
        description: importState.result.failedCount > 0
          ? `${importState.result.createdCount} aluno(s) criado(s) e ${importState.result.failedCount} linha(s) com erro. Veja os detalhes no modal.`
          : `${importState.result.createdCount} aluno(s) criado(s) com sucesso.`,
        variant: importState.result.failedCount > 0 ? "warning" : "success",
      });
    }
  }, [importState.result, toast]);

  useEffect(() => {
    if (importState.error) {
      toast({
        title: "Erro ao importar planilha",
        description: importState.error,
        variant: "destructive",
      });
    }
  }, [importState.error, toast]);


  const userRoles = Array.isArray(user?.roles)
    ? user!.roles.map((r) => r.toLowerCase())
    : [];
  const isAdmin = userRoles.includes("admin");
  const isSecretary = userRoles.includes("secretary");

  const totalPages = Math.ceil(listState.total / listState.pageSize);

  const handleRemove = (id: string) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const confirmRemove = async () => {
    if (selectedId) {
      await deleteAluno(selectedId);
      setShowConfirm(false);
      toast({ title: "Sucesso", description: "Aluno excluído com sucesso." });
      refreshList();
    }
  };

  const handleDownloadTemplate = async () => {
    const blob = await downloadTemplate();
    if (blob) {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "modelo-cadastro-alunos.xls";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await importFile(file);
      refreshList();
    }
    e.target.value = "";
  };

  return (
    <main className="flex-1 p-6 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold tracking-tight text-[#111C4E]">
          Alunos
        </h1>
        <div className="flex flex-wrap gap-2">
          {(isAdmin || isSecretary) && (
            <>
              <Button
                type="button"
                onClick={handleDownloadTemplate}
                variant="outline"
                className="flex items-center gap-2"
                disabled={importState.isLoading}
              >
                <Download className="h-4 w-4" />
                Baixar Modelo XLS
              </Button>
              <div className="relative">
                <input
                  type="file"
                  id="import-file"
                  className="hidden"
                  onChange={handleImportFile}
                  accept=".xls,.xlsx"
                />
                <Button
                  type="button"
                  variant="outline"
                  asChild
                  className="flex items-center gap-2 cursor-pointer"
                  disabled={importState.isLoading}
                >
                  <label htmlFor="import-file">
                    <Upload className="w-4 h-4" />
                    Enviar Planilha
                  </label>
                </Button>
              </div>
            </>
          )}

          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => {
              const win = window.open("", "_blank");
              if (!win) {
                alert("Pop-up bloqueado pelo navegador. Permita pop-ups para este site.");
                return;
              }
              win.document.title = "Carregando PDF...";
              win.document.body.innerHTML = "<p style='font-family:sans-serif'>Gerando PDF...</p>";
              void openDocumentPdf(win);
            }}
          >
            {isPrinting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Imprimindo...
              </>
            ) : (
              <>
                <Printer className="h-4 w-4" />
                Imprimir
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="flex items-center gap-2"
            onClick={downloadDocumentPdf}
            disabled={isGeneratingPDF}
          >
            {isGeneratingPDF ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Gerando PDF...
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Exportar PDF
              </>
            )}
          </Button>

          {(isAdmin || isSecretary) && (
            <Button
              onClick={() => router.push("/alunos/cadastro")}
              className="bg-[#111C4E] hover:bg-blue-800"
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Aluno
            </Button>
          )}
        </div>
      </div>

      <div className="mb-6 flex flex-nowrap items-center gap-3 overflow-x-auto pb-2 md:overflow-x-visible md:pb-0">
        <div className="relative w-80 md:w-96 flex-shrink-0">
          <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 z-20 pointer-events-none" />
          <Input
            type="search"
            placeholder="Buscar alunos..."
            className="pr-12 h-10"
            value={listState.filters.searchTerm}
            onChange={(e) => setFilters({ ...listState.filters, searchTerm: e.target.value })}
          />
        </div>

        <div className="flex flex-nowrap items-center gap-2">
          <InlineFilters 
            currentFilters={listState.filters}
            onApply={setFilters}
          />
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table className="w-full min-w-[900px]">
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Data de Nascimento</TableHead>
              <TableHead>Escola</TableHead>
              <TableHead>Série</TableHead>
              <TableHead>Município</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="w-[150px] text-center text-[#111C4E] font-bold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {listState.isLoading ? (
              <AlunosTableSkeleton />
            ) : listState.alunos.length > 0 ? (
              listState.alunos.map((aluno) => (
                <TableRow key={aluno.id}>
                  <TableCell className="font-medium text-[#111C4E]">{aluno.fullName}</TableCell>
                  <TableCell className="text-gray-800">{aluno.dataNascimento}</TableCell>
                  <TableCell className="text-gray-800">{aluno.schoolName}</TableCell>
                  <TableCell className="text-gray-800">{aluno.serie}</TableCell>
                  <TableCell className="text-gray-800">{aluno.city}</TableCell>
                  <TableCell className="text-gray-800">{aluno.state}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        onClick={() => router.push(`/alunos/${aluno.id}`)}
                        title="Visualizar"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      {(isAdmin || isSecretary) && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-amber-600 hover:text-amber-800 hover:bg-amber-50"
                            onClick={() => router.push(`/alunos/${aluno.id}/editar`)}
                            title="Editar"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-800 hover:bg-red-50"
                            onClick={() => handleRemove(aluno.id)}
                            title="Excluir"
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  Nenhum aluno encontrado.
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
              {getPageNumbers(totalPages, listState.currentPage).map((page, index) => (
                <PaginationItem key={index}>
                  {page === "ellipsis" ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      onClick={() => setPage(Number(page))}
                      isActive={listState.currentPage === page}
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

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p>Tem certeza que deseja excluir este aluno?</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmRemove}>
              Confirmar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ImportacaoResultadoModal
        open={importState.showResultModal}
        onOpenChange={closeImportModal}
        result={importState.result}
        onDownloadFailedRows={() => downloadFailedRows()}
      />

      <AlunosFilterModal
        open={openFilterModal}
        onOpenChange={setOpenFilterModal}
        currentFilters={listState.filters}
        onApply={setFilters}
      />
    </main>
  );
}

function AlunosTableSkeleton() {
  return (
    <>
      {[...Array(5)].map((_, i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-5 w-36 animate-pulse bg-gray-200" /></TableCell>
          <TableCell><Skeleton className="h-5 w-24 animate-pulse bg-gray-200" /></TableCell>
          <TableCell><Skeleton className="h-5 w-48 animate-pulse bg-gray-200" /></TableCell>
          <TableCell><Skeleton className="h-5 w-16 animate-pulse bg-gray-200" /></TableCell>
          <TableCell><Skeleton className="h-5 w-28 animate-pulse bg-gray-200" /></TableCell>
          <TableCell><Skeleton className="h-5 w-12 animate-pulse bg-gray-200" /></TableCell>
          <TableCell>
            <div className="flex items-center justify-center gap-1">
              <Skeleton className="h-7 w-7 rounded-full animate-pulse bg-gray-200" />
              <Skeleton className="h-7 w-7 rounded-full animate-pulse bg-gray-200" />
              <Skeleton className="h-7 w-7 rounded-full animate-pulse bg-gray-200" />
            </div>
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}

