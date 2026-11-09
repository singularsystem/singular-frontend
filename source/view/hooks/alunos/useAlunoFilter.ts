import { useEffect, useMemo, useState } from "react";
import { useSecureFetch } from "@/hooks/useSecureFetch";
import { LocationRepositoryImpl } from "../../../infrastructure/common/http/LocationRepositoryImpl";
import { SchoolRepositoryImpl } from "../../../infrastructure/alunos/SchoolRepositoryImpl";
import { AlunoFilterViewModel, AlunoFilterState } from "../../../view-model/alunos/AlunoFilterViewModel";
import { AlunoFilters } from "../../../model/entities/alunos/AlunoEntity";

export function useAlunoFilter(initialFilters: AlunoFilters) {
  const { secureFetch } = useSecureFetch();
  
  const locationRepository = useMemo(() => new LocationRepositoryImpl(secureFetch), [secureFetch]);
  const schoolRepository = useMemo(() => new SchoolRepositoryImpl(secureFetch), [secureFetch]);
  
  const viewModel = useMemo(() => 
    new AlunoFilterViewModel(locationRepository, schoolRepository, initialFilters), 
    [
      locationRepository, 
      schoolRepository,
      initialFilters.state,
      initialFilters.city,
      initialFilters.schoolID,
      initialFilters.serie
    ]
  );
  
  const [state, setState] = useState<AlunoFilterState>(viewModel.getState());

  useEffect(() => {
    setState(viewModel.getState());

    const unsubscribe = viewModel.subscribe((newState) => {
      setState(newState);
    });

    viewModel.loadInitialData();

    return () => unsubscribe();
  }, [viewModel]);

  return {
    state,
    setState: (name: string) => viewModel.setState(name),
    setCity: (name: string) => viewModel.setCity(name),
    setSchool: (id: string) => viewModel.setSchool(id),
    setSerie: (serieName: string) => viewModel.setSerie(serieName),
    reset: () => viewModel.reset(),
  };
}
