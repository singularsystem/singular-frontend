"use client";

import { useEffect, useState, useTransition, useCallback } from "react";
import { useSecureFetch } from "@/hooks/useSecureFetch";
import { AlunoRepositoryImpl } from "@/source/infrastructure/alunos/AlunoRepositoryImpl";
import type { AlunoEntity } from "@/source/model/entities/alunos/AlunoEntity";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SeletorAlunoProps {
  selectedStudentId: string | null;
  onSelectStudent: (studentId: string | null) => void;
  error?: string;
  disabled?: boolean;
}

export function SeletorAluno({
  selectedStudentId,
  onSelectStudent,
  error,
  disabled = false,
}: SeletorAlunoProps) {
  const { secureFetch } = useSecureFetch();
  const [alunos, setAlunos] = useState<AlunoEntity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [, startTransition] = useTransition();

  const fetchAlunos = useCallback(
    async (term: string) => {
      setIsLoading(true);
      setHasError(false);
      try {
        const repo = new AlunoRepositoryImpl(secureFetch);
        const res = await repo.getAlunos(1, 50, {
          searchTerm: term.trim().length >= 1 ? term.trim() : undefined,
        });
        setAlunos(res.data || []);
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [secureFetch],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        fetchAlunos(searchTerm);
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchAlunos]);

  const selectedAluno = alunos.find((a) => a.id === selectedStudentId);

  return (
    <div className="space-y-1.5 w-full">
      <Label className="text-sm font-semibold text-gray-700">
        Aluno <span className="text-red-500">*</span>
      </Label>

      {isLoading && alunos.length === 0 ? (
        <Skeleton className="h-10 w-full rounded-md" />
      ) : (
        <div className="relative">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
                disabled && "cursor-not-allowed opacity-50",
                error && "border-red-500",
              )}
            >
              {selectedAluno ? (
                <div className="flex items-center justify-between w-full">
                  <span className="font-medium text-gray-900 truncate">
                    {selectedAluno.fullName} {selectedAluno.schoolName ? `(${selectedAluno.schoolName})` : ""}
                  </span>
                  {!disabled && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:bg-gray-100"
                      onClick={() => onSelectStudent(null)}
                    >
                      <X className="h-3.5 w-3.5 text-gray-500" />
                    </Button>
                  )}
                </div>
              ) : (
                <Input
                  type="text"
                  placeholder="Buscar aluno por nome (mín. 1 caractere)..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (!isOpen) setIsOpen(true);
                  }}
                  onFocus={() => setIsOpen(true)}
                  disabled={disabled}
                  className="border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto"
                />
              )}
              {!selectedAluno && (
                <button
                  type="button"
                  onClick={() => setIsOpen((prev) => !prev)}
                  disabled={disabled}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <ChevronsUpDown className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {isOpen && !selectedAluno && (
            <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md bg-white">
              {isLoading && (
                <div className="p-3 text-sm text-gray-500 text-center">
                  <Skeleton className="h-4 w-3/4 mx-auto mb-2" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </div>
              )}

              {hasError && !isLoading && (
                <div className="p-3 text-sm text-red-600 text-center flex items-center justify-center gap-1.5">
                  <AlertCircle className="h-4 w-4" />
                  <span>Não foi possível carregar a lista de alunos. Tente novamente</span>
                </div>
              )}

              {!isLoading && !hasError && alunos.length === 0 && (
                <div className="p-3 text-sm text-gray-500 text-center">
                  Nenhum aluno encontrado
                </div>
              )}

              {!isLoading &&
                !hasError &&
                alunos.map((aluno) => (
                  <button
                    key={aluno.id}
                    type="button"
                    className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 px-3 text-sm outline-none hover:bg-gray-100 text-left justify-between"
                    onClick={() => {
                      onSelectStudent(aluno.id);
                      setIsOpen(false);
                    }}
                  >
                    <div>
                      <div className="font-medium text-gray-800">
                        {aluno.fullName}
                      </div>
                      {aluno.schoolName && (
                        <div className="text-xs text-gray-500">
                          {aluno.schoolName}
                        </div>
                      )}
                    </div>
                    {selectedStudentId === aluno.id && (
                      <Check className="h-4 w-4 text-emerald-600" />
                    )}
                  </button>
                ))}
            </div>
          )}
        </div>
      )}

      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}
