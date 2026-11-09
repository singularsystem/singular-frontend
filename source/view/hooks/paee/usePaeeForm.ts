import { useEffect, useMemo, useState } from "react";
import { PAEEFormViewModel } from "../../../view-model/paee/PAEEFormViewModel";
import { PAEERepositoryImpl } from "../../../infrastructure/paee/PAEERepositoryImpl";
import { PortageRepositoryImpl } from "../../../infrastructure/paee/PortageRepositoryImpl";
import { useSecureFetch } from "@/hooks/useSecureFetch";

export function usePaeeForm(id: string, isEdit: boolean) {
  const { secureFetch } = useSecureFetch();

  const viewModel = useMemo(() => {
    const paeeRepository = new PAEERepositoryImpl(secureFetch);
    const portageRepository = new PortageRepositoryImpl(secureFetch);
    return new PAEEFormViewModel(paeeRepository, portageRepository);
  }, [secureFetch]);

  const [state, setState] = useState(viewModel.getState());

  useEffect(() => {
    const unsubscribe = viewModel.subscribe(setState);
    if (isEdit) {
      viewModel.loadForEdit(id); // id is paeeId
    } else {
      viewModel.loadForCreate(id); // id is portageId
    }
    return unsubscribe;
  }, [viewModel, id, isEdit]);

  return {
    ...state,
    updateFormData: (updates: any) => viewModel.updateFormData(updates),
    savePAEE: (userId: string) => viewModel.savePAEE(userId, isEdit),
  };
}
