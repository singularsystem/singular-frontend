"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useSecureFetch } from "@/hooks/useSecureFetch";
import { NeckbookBooksRepositoryImpl } from "@/source/infrastructure/neckbook/NeckbookBooksRepositoryImpl";
import {
  GeracaoLivroViewModel,
  type GeracaoLivroState,
} from "@/source/view-model/neckbook/GeracaoLivroViewModel";
import type {
  Disciplina,
  ModoGeracao,
} from "@/source/model/entities/neckbook/GeracaoLivroTypes";

export interface UseGeracaoLivroReturn {
  state: GeracaoLivroState;
  actions: {
    gerar: () => Promise<void>;
    setStudentId: (id: string | null) => void;
    setDisciplina: (disciplina: Disciplina | "" | null) => void;
    addInteresse: (candidato: string) => void;
    removeInteresse: (index: number) => void;
    setNumCapitulos: (val: number | string) => void;
    setExerciciosPorCapitulo: (val: number | string) => void;
    setEstiloVisual: (val: string) => void;
    setSuporteCaa: (val: boolean) => void;
    setMode: (mode: ModoGeracao | null) => void;
    clearError: () => void;
    stopPolling: () => void;
    startPolling: (jobId: string) => void;
  };
}

export function useGeracaoLivro(): UseGeracaoLivroReturn {
  const { secureFetch } = useSecureFetch();

  const repository = useMemo(() => {
    return new NeckbookBooksRepositoryImpl(secureFetch);
  }, [secureFetch]);

  const viewModel = useMemo(() => {
    return new GeracaoLivroViewModel(repository);
  }, [repository]);

  const [state, setState] = useState<GeracaoLivroState>(() => viewModel.getState());

  useEffect(() => {
    const unsubscribe = viewModel.subscribe((nextState) => {
      setState(nextState);
    });
    return () => {
      unsubscribe();
      viewModel.stopPolling();
    };
  }, [viewModel]);

  const gerar = useCallback(async () => {
    await viewModel.gerar();
  }, [viewModel]);

  const setStudentId = useCallback((id: string | null) => {
    viewModel.setStudentId(id);
  }, [viewModel]);

  const setDisciplina = useCallback((disciplina: Disciplina | "" | null) => {
    viewModel.setDisciplina(disciplina);
  }, [viewModel]);

  const addInteresse = useCallback((candidato: string) => {
    viewModel.addInteresseItem(candidato);
  }, [viewModel]);

  const removeInteresse = useCallback((index: number) => {
    viewModel.removeInteresseItem(index);
  }, [viewModel]);

  const setNumCapitulos = useCallback((val: number | string) => {
    viewModel.setNumCapitulos(val);
  }, [viewModel]);

  const setExerciciosPorCapitulo = useCallback((val: number | string) => {
    viewModel.setExerciciosPorCapitulo(val);
  }, [viewModel]);

  const setEstiloVisual = useCallback((val: string) => {
    viewModel.setEstiloVisual(val);
  }, [viewModel]);

  const setSuporteCaa = useCallback((val: boolean) => {
    viewModel.setSuporteCaa(val);
  }, [viewModel]);

  const setMode = useCallback((mode: ModoGeracao | null) => {
    viewModel.setMode(mode);
  }, [viewModel]);

  const clearError = useCallback(() => {
    viewModel.clearError();
  }, [viewModel]);

  const stopPolling = useCallback(() => {
    viewModel.stopPolling();
  }, [viewModel]);

  const startPolling = useCallback((jobId: string) => {
    viewModel.startPolling(jobId);
  }, [viewModel]);

  return {
    state,
    actions: {
      gerar,
      setStudentId,
      setDisciplina,
      addInteresse,
      removeInteresse,
      setNumCapitulos,
      setExerciciosPorCapitulo,
      setEstiloVisual,
      setSuporteCaa,
      setMode,
      clearError,
      stopPolling,
      startPolling,
    },
  };
}
