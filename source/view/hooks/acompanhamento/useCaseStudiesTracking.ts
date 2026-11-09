import { useEffect, useMemo, useState } from "react";
import { useSecureFetch } from "@/hooks/useSecureFetch";
import { TrackingRepositoryImpl } from "../../../infrastructure/acompanhamento/TrackingRepositoryImpl";
import { CaseStudiesTrackingViewModel, CaseStudiesTrackingState } from "../../../view-model/acompanhamento/CaseStudiesTrackingViewModel";
import { Filters } from "@/types/filters";

export function useCaseStudiesTracking() {
  const { secureFetch } = useSecureFetch();

  const repository = useMemo(() => new TrackingRepositoryImpl(secureFetch), [secureFetch]);
  const viewModel = useMemo(() => new CaseStudiesTrackingViewModel(repository), [repository]);

  const [state, setState] = useState<CaseStudiesTrackingState>(viewModel.getState());

  useEffect(() => {
    viewModel.restoreStateFromSession();
    setState(viewModel.getState());

    const unsubscribe = viewModel.subscribe((newState) => {
      setState(newState);
    });

    viewModel.loadCaseStudies();

    return () => unsubscribe();
  }, [viewModel]);

  return {
    state,
    setPage: (page: number) => viewModel.setPage(page),
    setPageSize: (size: number) => viewModel.setPageSize(size),
    setSearchTerm: (term: string) => viewModel.setSearchTerm(term),
    setFilters: (filters: Filters) => viewModel.setFilters(filters),
    refresh: () => viewModel.loadCaseStudies(),
  };
}
