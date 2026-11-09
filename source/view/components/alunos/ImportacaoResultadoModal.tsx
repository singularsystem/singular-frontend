"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResultadoImportacaoAlunos } from "../../../model/entities/alunos/AlunoEntity";
import { CheckCircle2, CircleAlert, FileSpreadsheet } from "lucide-react";

interface ImportacaoResultadoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: ResultadoImportacaoAlunos | null;
  onDownloadFailedRows: () => void;
}

export function ImportacaoResultadoModal({
  open,
  onOpenChange,
  result,
  onDownloadFailedRows,
}: ImportacaoResultadoModalProps) {
  if (!result) return null;

  const hasFailures = (result.failedCount || 0) > 0;
  const hasSuccesses = (result.createdCount || 0) > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col gap-0 p-0">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-2xl flex items-center gap-2">
             <FileSpreadsheet className="h-6 w-6 text-indigo-600" />
             Resultado da Importação
          </DialogTitle>
          <DialogDescription>
            Confira o resumo do processamento da planilha de alunos.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="py-4 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-green-200 bg-green-50 p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-6 w-6 text-green-600" />
                  <div>
                    <p className="text-sm font-bold text-green-800 uppercase tracking-wider">Sucessos</p>
                    <p className="text-4xl font-black text-green-700 my-1">
                      {result.createdCount || 0}
                    </p>
                    <p className="text-xs text-green-600 font-medium">
                      aluno(s) cadastrados no sistema
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-red-200 bg-red-50 p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <CircleAlert className="mt-1 h-6 w-6 text-red-600" />
                  <div>
                    <p className="text-sm font-bold text-red-800 uppercase tracking-wider">Falhas</p>
                    <p className="text-4xl font-black text-red-700 my-1">
                      {result.failedCount || 0}
                    </p>
                    <p className="text-xs text-red-600 font-medium">
                      linhas com erros identificados
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Accordion
              type="multiple"
              defaultValue={["falhas"]}
              className="space-y-4"
            >
              <AccordionItem value="sucessos" className="border rounded-xl px-4 bg-white shadow-sm">
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">Alunos Cadastrados</span>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">
                      {result.createdCount || 0}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {hasSuccesses ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-4">
                      {(result.successfulStudents || []).map((student, idx) => (
                        <div
                          key={`success-${idx}-${student.fullName}`}
                          className="rounded-lg border border-slate-100 bg-slate-50 p-3 flex flex-col"
                        >
                          <p className="font-bold text-slate-800 text-sm">
                            {student.fullName || "Nome não informado"}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {student.schoolName}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-2">Linha {student.rowNumber}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic pb-4">
                      Nenhum aluno foi cadastrado.
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="falhas" className="border rounded-xl px-4 bg-white shadow-sm">
                <AccordionTrigger className="hover:no-underline">
                   <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-700">Linhas com Erro</span>
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded-full">
                      {result.failedCount || 0}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {hasFailures ? (
                    <div className="space-y-3 pb-4">
                      {(result.failedStudents || []).map((student, idx) => (
                        <div
                          key={`fail-${idx}-${student.fullName}`}
                          className="rounded-lg border border-red-100 bg-red-50/50 p-4"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                               <p className="font-bold text-slate-800 text-sm">
                                {student.fullName || "Linha com erro"}
                              </p>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Linha {student.rowNumber}
                              </p>
                            </div>
                          </div>
                          <div className="mt-3 space-y-1">
                            {(student.errors || []).map((error, eIdx) => (
                              <div key={eIdx} className="flex items-center gap-2 text-xs text-red-600 font-medium bg-red-100/50 px-2 py-1 rounded">
                                <span className="h-1 w-1 bg-red-600 rounded-full shrink-0" />
                                {error}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic pb-4">
                      Nenhuma falha encontrada.
                    </p>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </ScrollArea>

        <DialogFooter className="p-6 bg-slate-50 border-t gap-3 sm:gap-0">
          {hasFailures && (
            <Button
              type="button"
              variant="outline"
              onClick={onDownloadFailedRows}
              className="border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
            >
              Baixar Relatório de Falhas (CSV)
            </Button>
          )}
          <Button type="button" onClick={() => onOpenChange(false)} className="bg-slate-900">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
