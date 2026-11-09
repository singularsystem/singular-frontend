import { useEffect, useMemo, useState } from "react";
import { PortageDetailsViewModel } from "../../../view-model/paee/PortageDetailsViewModel";
import { PortageRepositoryImpl } from "../../../infrastructure/paee/PortageRepositoryImpl";
import { useSecureFetch } from "@/hooks/useSecureFetch";

export function usePortageDetails(studentId: string) {
  const { secureFetch } = useSecureFetch();
  const viewModel = useMemo(() => {
    const repository = new PortageRepositoryImpl(secureFetch);
    return new PortageDetailsViewModel(repository);
  }, [secureFetch]);

  const [state, setState] = useState(viewModel.getState());

  useEffect(() => {
    const unsubscribe = viewModel.subscribe(setState);
    viewModel.loadPortagesByStudent(studentId);
    return unsubscribe;
  }, [viewModel, studentId]);

  return {
    ...state,
    reload: () => viewModel.loadPortagesByStudent(studentId),
  };
}
