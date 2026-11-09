import { useEffect, useMemo, useState } from "react";
import { useSecureFetch } from "@/hooks/useSecureFetch";
import { PAEERepositoryImpl } from "../../../infrastructure/paee/PAEERepositoryImpl";
import { PAEEListViewModel, PAEEListState } from "../../../view-model/paee/PAEEListViewModel";
import { PAEEFilters } from "../../../model/entities/paee/PAEEEntity";

export function usePaeeList() {
  const { secureFetch } = useSecureFetch();
  
  const repository = useMemo(() => new PAEERepositoryImpl(secureFetch), [secureFetch]);
  const viewModel = useMemo(() => new PAEEListViewModel(repository), [repository]);
  
  const [state, setState] = useState<PAEEListState>(viewModel.getState());

  useEffect(() => {
    viewModel.restoreStateFromSession();
    setState(viewModel.getState());

    const unsubscribe = viewModel.subscribe((newState) => {
      setState(newState);
    });

    viewModel.loadPAEEs();

    return () => unsubscribe();
  }, [viewModel]);

  return {
    state,
    setPage: (page: number) => viewModel.setPage(page),
    setPageSize: (size: number) => viewModel.setPageSize(size),
    setFilters: (filters: PAEEFilters) => viewModel.setFilters(filters),
    deletePAEE: (id: string) => viewModel.deletePAEE(id),
    refresh: () => viewModel.loadPAEEs(),
  };
}
