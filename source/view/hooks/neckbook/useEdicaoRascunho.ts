"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useSecureFetch } from "@/hooks/useSecureFetch";
import { NeckbookBooksRepositoryImpl } from "@/source/infrastructure/neckbook/NeckbookBooksRepositoryImpl";
import type {
  ChapterDiffResult,
  ChapterDraft,
  DraftResponse,
} from "@/source/model/entities/neckbook/GeracaoLivroTypes";
import { calcularDiffRascunho } from "@/source/model/entities/neckbook/DraftDiff";

export interface UseEdicaoRascunhoReturn {
  original: DraftResponse | null;
  editado: DraftResponse | null;
  diff: ChapterDiffResult[];
  isLoading: boolean;
  isSaving: boolean;
  isApproving: boolean;
  errorMessage: string | null;
  successMessage: string | null;
  actions: {
    loadDraft: () => Promise<void>;
    updateTitle: (title: string) => void;
    updateChapter: (chapterId: string, patch: Partial<ChapterDraft>) => void;
    addExercise: (chapterId: string, exercise: string) => void;
    removeExercise: (chapterId: string, index: number) => void;
    updateExercise: (chapterId: string, index: number, text: string) => void;
    reorderChapters: (chapterIdsInOrder: string[]) => void;
    salvar: () => Promise<boolean>;
    aprovar: () => Promise<boolean>;
    clearMessages: () => void;
  };
}

export function useEdicaoRascunho(bookId: string | null): UseEdicaoRascunhoReturn {
  const { secureFetch } = useSecureFetch();
  const repository = useMemo(() => new NeckbookBooksRepositoryImpl(secureFetch), [secureFetch]);

  const [original, setOriginal] = useState<DraftResponse | null>(null);
  const [editado, setEditado] = useState<DraftResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const diff = useMemo(() => {
    if (!original || !editado) {
      return [];
    }
    return calcularDiffRascunho(original, editado);
  }, [original, editado]);

  const loadDraft = useCallback(async () => {
    if (!bookId) return;
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await repository.getDraft(bookId);
      const clonedOriginal: DraftResponse = JSON.parse(JSON.stringify(data));
      const clonedEditado: DraftResponse = JSON.parse(JSON.stringify(data));
      setOriginal(clonedOriginal);
      setEditado(clonedEditado);
    } catch {
      setErrorMessage("Não foi possível carregar o rascunho. Tente novamente");
    } finally {
      setIsLoading(false);
    }
  }, [bookId, repository]);

  useEffect(() => {
    if (bookId) {
      loadDraft();
    }
  }, [bookId, loadDraft]);

  const updateTitle = useCallback((title: string) => {
    setEditado((prev) => (prev ? { ...prev, title } : null));
  }, []);

  const updateChapter = useCallback((chapterId: string, patch: Partial<ChapterDraft>) => {
    setEditado((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        chapters: prev.chapters.map((ch) =>
          ch.id === chapterId ? { ...ch, ...patch } : ch,
        ),
      };
    });
  }, []);

  const addExercise = useCallback((chapterId: string, exercise: string) => {
    const trimmed = exercise.trim();
    if (!trimmed) return;
    setEditado((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        chapters: prev.chapters.map((ch) => {
          if (ch.id === chapterId) {
            if (ch.exercises.length >= 3) return ch;
            return { ...ch, exercises: [...ch.exercises, trimmed] };
          }
          return ch;
        }),
      };
    });
  }, []);

  const removeExercise = useCallback((chapterId: string, index: number) => {
    setEditado((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        chapters: prev.chapters.map((ch) => {
          if (ch.id === chapterId) {
            return {
              ...ch,
              exercises: ch.exercises.filter((_, i) => i !== index),
            };
          }
          return ch;
        }),
      };
    });
  }, []);

  const updateExercise = useCallback((chapterId: string, index: number, text: string) => {
    setEditado((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        chapters: prev.chapters.map((ch) => {
          if (ch.id === chapterId) {
            const nextExercises = [...ch.exercises];
            nextExercises[index] = text;
            return { ...ch, exercises: nextExercises };
          }
          return ch;
        }),
      };
    });
  }, []);

  const reorderChapters = useCallback((chapterIdsInOrder: string[]) => {
    setEditado((prev) => {
      if (!prev) return null;
      const chapterMap = new Map(prev.chapters.map((c) => [c.id, c]));
      const reordered: ChapterDraft[] = [];
      chapterIdsInOrder.forEach((id, idx) => {
        const ch = chapterMap.get(id);
        if (ch) {
          reordered.push({ ...ch, order: idx + 1 });
        }
      });
      return {
        ...prev,
        chapters: reordered,
      };
    });
  }, []);

  const salvar = useCallback(async (): Promise<boolean> => {
    if (!bookId || !editado) return false;
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      await repository.saveDraft(bookId, {
        title: editado.title,
        chapters: editado.chapters,
      });
      setOriginal(JSON.parse(JSON.stringify(editado)));
      setSuccessMessage("Alterações salvas com sucesso!");
      return true;
    } catch {
      setErrorMessage("Não foi possível salvar as alterações. Tente novamente");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [bookId, editado, repository]);

  const aprovar = useCallback(async (): Promise<boolean> => {
    if (!bookId) return false;
    setIsApproving(true);
    setErrorMessage(null);
    try {
      await repository.approve(bookId);
      return true;
    } catch {
      setErrorMessage("Não foi possível aprovar o rascunho. Tente novamente");
      return false;
    } finally {
      setIsApproving(false);
    }
  }, [bookId, repository]);

  const clearMessages = useCallback(() => {
    setErrorMessage(null);
    setSuccessMessage(null);
  }, []);

  return {
    original,
    editado,
    diff,
    isLoading,
    isSaving,
    isApproving,
    errorMessage,
    successMessage,
    actions: {
      loadDraft,
      updateTitle,
      updateChapter,
      addExercise,
      removeExercise,
      updateExercise,
      reorderChapters,
      salvar,
      aprovar,
      clearMessages,
    },
  };
}
