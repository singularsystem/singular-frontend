import { useEffect, useMemo, useState } from "react";
import { useSecureFetch } from "@/hooks/useSecureFetch";
import { DashboardRepositoryImpl } from "../../../infrastructure/dashboard/DashboardRepositoryImpl";
import { LocationRepositoryImpl } from "../../../infrastructure/common/http/LocationRepositoryImpl";
import { SchoolRepositoryImpl } from "../../../infrastructure/alunos/SchoolRepositoryImpl";
import { DashboardViewModel, DashboardState } from "../../../view-model/dashboard/DashboardViewModel";
import { DashBoardFilters } from "@/lib/constants";

export function useDashboard() {
  const { secureFetch } = useSecureFetch();

  const repository = useMemo(
    () => new DashboardRepositoryImpl(secureFetch),
    [secureFetch]
  );
  
  const locationRepository = useMemo(
    () => new LocationRepositoryImpl(secureFetch),
    [secureFetch]
  );

  const schoolRepository = useMemo(
    () => new SchoolRepositoryImpl(secureFetch),
    [secureFetch]
  );

  const viewModel = useMemo(
    () => new DashboardViewModel(repository, locationRepository, schoolRepository),
    [repository, locationRepository, schoolRepository]
  );

  const [state, setState] = useState<DashboardState>(viewModel.getState());

  useEffect(() => {
    // Inicializa carregando o sessionStorage e estatísticas correspondentes
    viewModel.initialize().then(() => {
      setState(viewModel.getState());
    });

    const unsubscribe = viewModel.subscribe((newState) => {
      setState(newState);
    });

    return () => unsubscribe();
  }, [viewModel]);

  return {
    state,
    updateFilter: (key: keyof DashBoardFilters, value: any) =>
      viewModel.updateFilter(key, value),
    resetFilters: () => viewModel.resetFilters(),
    setMunicipalityTotalInput: (val: string) =>
      viewModel.setMunicipalityTotalInput(val),
    saveMunicipalityTotal: () => viewModel.saveMunicipalityTotal(),
    setActiveTab: (tab: string) => viewModel.setActiveTab(tab),
    setIsGeneratingPDF: (val: boolean) => viewModel.setIsGeneratingPDF(val),
    clearError: () => viewModel.clearError(),
    clearCitiesError: () => viewModel.clearCitiesError(),
    clearSchoolsError: () => viewModel.clearSchoolsError(),
    refresh: () => viewModel.loadDashboardStatistics(),
  };
}
