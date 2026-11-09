import { useEffect, useMemo, useState } from "react";
import { useSecureFetch } from "@/hooks/useSecureFetch";
import { EscolaRepositoryImpl } from "../../../infrastructure/escolas/EscolaRepositoryImpl";
import { LocationRepositoryImpl } from "../../../infrastructure/common/http/LocationRepositoryImpl";
import { EscolasListViewModel, EscolasListState } from "../../../view-model/escolas/EscolasListViewModel";

export function useEscolasList() {
  const { secureFetch } = useSecureFetch();

  const repository = useMemo(() => new EscolaRepositoryImpl(secureFetch), [secureFetch]);
  const locationRepository = useMemo(() => new LocationRepositoryImpl(secureFetch), [secureFetch]);
  const viewModel = useMemo(() => new EscolasListViewModel(repository, locationRepository), [repository, locationRepository]);

  const [state, setState] = useState<EscolasListState>(viewModel.getState());

  useEffect(() => {
    viewModel.restoreStateFromSession();
    setState(viewModel.getState());

    const unsubscribe = viewModel.subscribe((newState) => {
      setState(newState);
    });

    viewModel.loadEscolas();

    return () => unsubscribe();
  }, [viewModel]);

  return {
    state,
    setPage: (page: number) => viewModel.setPage(page),
    setPageSize: (size: number) => viewModel.setPageSize(size),
    setSearchTerm: (term: string) => viewModel.setSearchTerm(term),
    setState: (stateName: string) => viewModel.setState(stateName),
    setCity: (cityName: string) => viewModel.setCity(cityName),
    resetFilters: () => viewModel.resetFilters(),
    deleteEscola: (id: string) => viewModel.deleteEscola(id),
    refresh: () => viewModel.loadEscolas(),
  };
}
