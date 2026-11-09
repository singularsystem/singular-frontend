import { useEffect, useMemo, useState } from "react";
import { useSecureFetch } from "@/hooks/useSecureFetch";
import { EscolaRepositoryImpl } from "../../../infrastructure/escolas/EscolaRepositoryImpl";
import { EscolaDetailsViewModel, EscolaDetailsState } from "../../../view-model/escolas/EscolaDetailsViewModel";

export function useEscolaDetails(id: string) {
  const { secureFetch } = useSecureFetch();
  const repository = useMemo(() => new EscolaRepositoryImpl(secureFetch), [secureFetch]);
  const viewModel = useMemo(() => new EscolaDetailsViewModel(repository), [repository]);
  const [state, setState] = useState<EscolaDetailsState>(viewModel.getState());

  useEffect(() => {
    const controller = new AbortController();
    const unsubscribe = viewModel.subscribe((newState) => {
      setState(newState);
    });

    if (id) {
      viewModel.loadSchool(id, controller.signal);
    }

    return () => {
      unsubscribe();
      controller.abort();
    };
  }, [viewModel, id]);

  return {
    state,
  };
}
