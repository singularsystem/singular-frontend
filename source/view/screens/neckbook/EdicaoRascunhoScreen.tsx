"use client";

import { useRouter } from "next/navigation";
import { useEdicaoRascunho } from "@/source/view/hooks/neckbook/useEdicaoRascunho";
import { EditorCapitulo } from "@/source/view/components/neckbook/EditorCapitulo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Edit3,
  Loader2,
  Save,
  Send,
} from "lucide-react";

interface EdicaoRascunhoScreenProps {
  bookId: string;
}

export function EdicaoRascunhoScreen({ bookId }: EdicaoRascunhoScreenProps) {
  const router = useRouter();
  const {
    original,
    editado,
    diff,
    isLoading,
    isSaving,
    isApproving,
    errorMessage,
    successMessage,
    actions,
  } = useEdicaoRascunho(bookId);

  const handleMoveUp = (index: number) => {
    if (!editado || index === 0) return;
    const ids = editado.chapters.map((c) => c.id);
    const temp = ids[index - 1];
    ids[index - 1] = ids[index];
    ids[index] = temp;
    actions.reorderChapters(ids);
  };

  const handleMoveDown = (index: number) => {
    if (!editado || index >= editado.chapters.length - 1) return;
    const ids = editado.chapters.map((c) => c.id);
    const temp = ids[index + 1];
    ids[index + 1] = ids[index];
    ids[index] = temp;
    actions.reorderChapters(ids);
  };

  const handleAprovar = async () => {
    const success = await actions.aprovar();
    if (success) {
      router.push("/livros/gerar");
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <div className="space-y-4 pt-4">
          <Skeleton className="h-48 w-full rounded-xl" />
          <Skeleton className="h-48 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (errorMessage && !editado) {
    return (
      <div className="p-8 max-w-2xl mx-auto space-y-4">
        <div className="p-6 rounded-xl border border-red-200 bg-red-50 text-red-800 flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-base">Falha ao Carregar</h3>
            <p className="text-sm mt-1">{errorMessage}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/livros/gerar")}
          >
            Voltar
          </Button>
          <Button
            type="button"
            onClick={actions.loadDraft}
            className="bg-[#111C4E] hover:bg-[#111C4E]/90 text-white"
          >
            Tentar Novamente
          </Button>
        </div>
      </div>
    );
  }

  if (!editado) {
    return null;
  }

  const isBusy = isSaving || isApproving;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      {/* Top navigation & info */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => router.push("/livros/gerar")}
          className="text-gray-600 hover:text-gray-900 gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Geração
        </Button>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Edit3 className="h-7 w-7 text-[#111C4E]" />
          Revisão e Edição do Rascunho
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Ajuste o texto, as ilustrações e os exercícios do livro antes de gerar as imagens definitivas e o arquivo PDF.
        </p>
      </div>

      {/* Mensagens de feedback */}
      {errorMessage && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{errorMessage}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={actions.clearMessages}
            className="text-red-700 hover:text-red-900 h-7 text-xs px-2"
          >
            Fechar
          </Button>
        </div>
      )}

      {successMessage && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{successMessage}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={actions.clearMessages}
            className="text-emerald-700 hover:text-emerald-900 h-7 text-xs px-2"
          >
            Fechar
          </Button>
        </div>
      )}

      {/* Título do Livro */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
        <Label className="text-sm font-semibold text-gray-800">
          Título Geral do Livro <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          value={editado.title}
          maxLength={200}
          disabled={isBusy}
          onChange={(e) => actions.updateTitle(e.target.value)}
          className="text-base font-medium"
        />
        <div className="text-xs text-gray-400 text-right">
          {editado.title.length}/200
        </div>
      </div>

      {/* Lista de Capítulos */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            Capítulos ({editado.chapters.length})
          </h2>
          {diff.length > 0 && original && (
            <span className="text-xs font-medium text-gray-500">
              Modificações pendentes de envio
            </span>
          )}
        </div>

        {editado.chapters.map((ch, idx) => (
          <EditorCapitulo
            key={ch.id}
            chapter={ch}
            index={idx}
            totalChapters={editado.chapters.length}
            onUpdateChapter={(patch) => actions.updateChapter(ch.id, patch)}
            onAddExercise={(ex) => actions.addExercise(ch.id, ex)}
            onRemoveExercise={(exIdx) => actions.removeExercise(ch.id, exIdx)}
            onUpdateExercise={(exIdx, text) =>
              actions.updateExercise(ch.id, exIdx, text)
            }
            onMoveUp={() => handleMoveUp(idx)}
            onMoveDown={() => handleMoveDown(idx)}
            disabled={isBusy}
          />
        ))}
      </div>

      {/* Barra de Ações Fixa no Rodapé */}
      <div className="pt-4 border-t flex items-center justify-between bg-white/80 backdrop-blur sticky bottom-0 p-4 rounded-xl border shadow-sm">
        <Button
          type="button"
          variant="outline"
          disabled={isBusy}
          onClick={() => actions.salvar()}
          className="gap-2"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Salvar Alterações
            </>
          )}
        </Button>

        <Button
          type="button"
          disabled={isBusy}
          onClick={handleAprovar}
          className="bg-[#111C4E] hover:bg-[#111C4E]/90 text-white font-medium gap-2 px-6 shadow-sm"
        >
          {isApproving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Aprovando...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Aprovar e Gerar Livro
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
