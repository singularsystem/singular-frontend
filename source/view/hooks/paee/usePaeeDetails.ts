import { useEffect, useMemo, useState } from "react";
import { PAEEDetailsViewModel } from "../../../view-model/paee/PAEEDetailsViewModel";
import { PAEERepositoryImpl } from "../../../infrastructure/paee/PAEERepositoryImpl";
import { useSecureFetch } from "@/hooks/useSecureFetch";

export function usePaeeDetails(id: string) {
  const { secureFetch } = useSecureFetch();
  const viewModel = useMemo(() => {
    const repository = new PAEERepositoryImpl(secureFetch);
    return new PAEEDetailsViewModel(repository);
  }, [secureFetch]);

  const [state, setState] = useState(viewModel.getState());

  useEffect(() => {
    const unsubscribe = viewModel.subscribe(setState);
    viewModel.loadPAEE(id);
    return unsubscribe;
  }, [viewModel, id]);

  return {
    ...state,
    reload: () => viewModel.loadPAEE(id),
  };
}
