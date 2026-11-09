"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useSecureFetch } from "@/hooks/useSecureFetch";
import { useAuth } from "@/contexts/auth-context";
import { NeckbookAdminRepositoryImpl } from "@/source/infrastructure/neckbook/NeckbookAdminRepositoryImpl";
import {
  MunicipiosCotasViewModel,
  type MunicipiosCotasState,
} from "@/source/view-model/neckbook/MunicipiosCotasViewModel";
import type {
  CreateMunicipioDTO,
  UpdateMunicipioDTO,
} from "@/source/model/entities/neckbook/NeckbookEntity";

export interface UseMunicipiosCotasReturn {
  state: MunicipiosCotasState;
  auth: ReturnType<typeof useAuth>;
  actions: {
    loadMunicipios: () => Promise<void>;
    setPage: (page: number) => Promise<void>;
    setPageSize: (size: number) => Promise<void>;
    setSearchTerm: (term: string) => Promise<void>;
    createMunicipio: (dto: CreateMunicipioDTO) => Promise<boolean>;
    updateMunicipio: (id: string, patch: UpdateMunicipioDTO) => Promise<boolean>;
    generateApiKey: (municipioId: string) => Promise<void>;
    clearGeneratedToken: () => void;
    loadApiKeys: (municipioId: string) => Promise<void>;
    toggleApiKey: (
      municipioId: string,
      keyId: string,
      active: boolean,
    ) => Promise<void>;
    revokeApiKey: (municipioId: string, keyId: string) => Promise<void>;
    clearError: () => void;
    clearFormErrors: () => void;
  };
}

export function useMunicipiosCotas(): UseMunicipiosCotasReturn {
  const { secureFetch } = useSecureFetch();
  const auth = useAuth();

  const repository = useMemo(
    () => new NeckbookAdminRepositoryImpl(secureFetch),
    [secureFetch],
  );

  const viewModel = useMemo(
    () => new MunicipiosCotasViewModel(repository),
    [repository],
  );

  const [state, setState] = useState<MunicipiosCotasState>(() =>
    viewModel.getState(),
  );
  const initializedRef = useRef(false);

  useEffect(() => {
    setState(viewModel.getState());
    const unsubscribe = viewModel.subscribe((nextState) => {
      setState(nextState);
    });
    return unsubscribe;
  }, [viewModel]);

  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      viewModel.restoreStateFromSession();
      void viewModel.loadMunicipios();
    }
  }, [viewModel]);

  const loadMunicipios = useCallback(async () => {
    await viewModel.loadMunicipios();
  }, [viewModel]);

  const setPage = useCallback(
    async (page: number) => {
      viewModel.setPage(page);
      await viewModel.loadMunicipios();
    },
    [viewModel],
  );

  const setPageSize = useCallback(
    async (size: number) => {
      viewModel.setPageSize(size);
      await viewModel.loadMunicipios();
    },
    [viewModel],
  );

  const setSearchTerm = useCallback(
    async (term: string) => {
      const before = viewModel.getState().searchTerm;
      viewModel.setSearchTerm(term);
      if (term !== before) {
        await viewModel.loadMunicipios();
      }
    },
    [viewModel],
  );

  const createMunicipio = useCallback(
    async (dto: CreateMunicipioDTO) => {
      return viewModel.createMunicipio(dto);
    },
    [viewModel],
  );

  const updateMunicipio = useCallback(
    async (id: string, patch: UpdateMunicipioDTO) => {
      return viewModel.updateMunicipio(id, patch);
    },
    [viewModel],
  );

  const generateApiKey = useCallback(
    async (municipioId: string) => {
      await viewModel.generateApiKey(municipioId);
    },
    [viewModel],
  );

  const clearGeneratedToken = useCallback(() => {
    viewModel.clearGeneratedToken();
  }, [viewModel]);

  const loadApiKeys = useCallback(
    async (municipioId: string) => {
      await viewModel.loadApiKeys(municipioId);
    },
    [viewModel],
  );

  const toggleApiKey = useCallback(
    async (municipioId: string, keyId: string, active: boolean) => {
      await viewModel.toggleApiKey(municipioId, keyId, active);
    },
    [viewModel],
  );

  const revokeApiKey = useCallback(
    async (municipioId: string, keyId: string) => {
      await viewModel.revokeApiKey(municipioId, keyId);
    },
    [viewModel],
  );

  const clearError = useCallback(() => {
    viewModel.clearError();
  }, [viewModel]);

  const clearFormErrors = useCallback(() => {
    viewModel.clearFormErrors();
  }, [viewModel]);

  const actions = useMemo(
    () => ({
      loadMunicipios,
      setPage,
      setPageSize,
      setSearchTerm,
      createMunicipio,
      updateMunicipio,
      generateApiKey,
      clearGeneratedToken,
      loadApiKeys,
      toggleApiKey,
      revokeApiKey,
      clearError,
      clearFormErrors,
    }),
    [
      loadMunicipios,
      setPage,
      setPageSize,
      setSearchTerm,
      createMunicipio,
      updateMunicipio,
      generateApiKey,
      clearGeneratedToken,
      loadApiKeys,
      toggleApiKey,
      revokeApiKey,
      clearError,
      clearFormErrors,
    ],
  );

  return {
    state,
    auth,
    actions,
  };
}
