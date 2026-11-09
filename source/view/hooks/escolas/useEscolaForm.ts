import { useEffect, useMemo, useState } from "react";
import { useSecureFetch } from "@/hooks/useSecureFetch";
import { EscolaRepositoryImpl } from "../../../infrastructure/escolas/EscolaRepositoryImpl";
import { EscolaFormViewModel, EscolaFormState } from "../../../view-model/escolas/EscolaFormViewModel";

export function useEscolaForm(id?: string) {
  const { secureFetch } = useSecureFetch();
  const repository = useMemo(() => new EscolaRepositoryImpl(secureFetch), [secureFetch]);
  const viewModel = useMemo(() => new EscolaFormViewModel(repository), [repository]);
  const [state, setState] = useState<EscolaFormState>(viewModel.getState());

  useEffect(() => {
    const controller = new AbortController();
    const unsubscribe = viewModel.subscribe((newState) => {
      setState(newState);
    });

    if (id) {
      viewModel.loadSchoolForEdit(id, controller.signal);
    }

    return () => {
      unsubscribe();
      controller.abort();
    };
  }, [viewModel, id]);

  return {
    state,
    updateFields: (fields: Partial<Omit<EscolaFormState, "isLoading" | "isSaving" | "error" | "success">>) =>
      viewModel.updateFields(fields),
    submit: (isEdit: boolean) => viewModel.submit(isEdit),
  };
}
