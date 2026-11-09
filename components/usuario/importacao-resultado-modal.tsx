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
import { roleLabels } from "@/lib/constants";
import { ResultadoImportacaoUsuarios } from "@/types/usuario";
import { CheckCircle2, CircleAlert, Download } from "lucide-react";

interface ImportacaoResultadoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: ResultadoImportacaoUsuarios | null;
  onDownloadFailedRows: () => void;
}

export function ImportacaoResultadoModal({
  open,
  onOpenChange,
  result,
  onDownloadFailedRows,
}: ImportacaoResultadoModalProps) {
  if (!result) return null;

  const hasFailures = result.failedCount > 0;
  const hasSuccesses = result.createdCount > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Resultado da importação</DialogTitle>
          <DialogDescription>
            Confira quantos usuários foram cadastrados e quais linhas precisam
            de correção antes de reenviar.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">Sucessos</p>
                <p className="text-3xl font-bold text-green-700">
                  {result.createdCount}
                </p>
                <p className="text-sm text-green-700">
                  usuário(s) criado(s) com a senha padrão `{
                    result.defaultPassword
                  }`
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-start gap-3">
              <CircleAlert className="mt-0.5 h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-800">Falhas</p>
                <p className="text-3xl font-bold text-red-700">
                  {result.failedCount}
                </p>
                <p className="text-sm text-red-700">
                  linha(s) com erro para revisar e reenviar
                </p>
              </div>
            </div>
          </div>
        </div>

        <Accordion
          type="multiple"
          defaultValue={["sucessos", "falhas"]}
          className="rounded-lg border px-4"
        >
          <AccordionItem value="sucessos">
            <AccordionTrigger>
              <span>
                Expandir usuários cadastrados com sucesso ({result.createdCount}
                )
              </span>
            </AccordionTrigger>
            <AccordionContent>
              {hasSuccesses ? (
                <ScrollArea className="h-[220px] pr-4">
                  <div className="space-y-3">
                    {result.successfulUsers.map((user) => (
                      <div
                        key={`${user.rowNumber}-${user.email}`}
                        className="rounded-md border border-green-200 bg-green-50 p-3"
                      >
                        <p className="font-medium text-slate-900">
                          {user.fullName || "Nome não informado"}
                        </p>
                        <p className="text-sm text-slate-600">
                          {user.email || "Email não informado"}
                        </p>
                        <p className="text-xs text-slate-500">
                          Linha {user.rowNumber}
                        </p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum usuário foi cadastrado nesta importação.
                </p>
              )}
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="falhas">
            <AccordionTrigger>
              <span>
                Expandir usuários com erro ({result.failedCount})
              </span>
            </AccordionTrigger>
            <AccordionContent>
              {hasFailures ? (
                <ScrollArea className="h-[260px] pr-4">
                  <div className="space-y-3">
                    {result.failedUsers.map((user) => (
                      <div
                        key={`${user.rowNumber}-${user.email}-${user.fullName}`}
                        className="rounded-md border border-red-200 bg-red-50 p-3"
                      >
                        <div className="flex flex-col gap-1">
                          <p className="font-medium text-slate-900">
                            {user.fullName || "Nome não informado"}
                          </p>
                          <p className="text-sm text-slate-600">
                            {user.email || "Email não informado"}
                          </p>
                          <p className="text-xs text-slate-500">
                            Linha {user.rowNumber}
                          </p>
                        </div>
                        <div className="mt-3 space-y-1 text-sm text-red-700">
                          {user.errors.map((error, index) => (
                            <p key={`${user.rowNumber}-error-${index}`}>
                              {error}
                            </p>
                          ))}
                        </div>
                        <div className="mt-3 rounded-md border border-red-100 bg-white/70 p-3 text-xs text-slate-600">
                          <p>
                            Perfil:{" "}
                            {roleLabels[user.rowData.type] || user.rowData.type || "-"}
                          </p>
                          <p>Municipio: {user.rowData.city}</p>
                          <p>Estado: {user.rowData.state || "-"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhuma falha encontrada nesta importação.
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <DialogFooter className="gap-2">
          {hasFailures && (
            <Button
              type="button"
              variant="outline"
              onClick={onDownloadFailedRows}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Baixar falhas para corrigir
            </Button>
          )}
          <Button type="button" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
