import { useEffect, useMemo, useState } from "react";
import { useSecureFetch } from "@/hooks/useSecureFetch";
import { AlunoRepositoryImpl } from "../../../infrastructure/alunos/AlunoRepositoryImpl";
import { AlunoFormViewModel, AlunoFormState } from "../../../view-model/alunos/AlunoFormViewModel";
import { CreateAlunoDTO } from "../../../model/entities/alunos/AlunoEntity";

export function useAlunoForm() {
  const { secureFetch } = useSecureFetch();
  
  const repository = useMemo(() => new AlunoRepositoryImpl(secureFetch), [secureFetch]);
  const viewModel = useMemo(() => new AlunoFormViewModel(repository), [repository]);
  
  const [state, setState] = useState<AlunoFormState>(viewModel.getState());

  useEffect(() => {
    const unsubscribe = viewModel.subscribe((newState) => {
      setState(newState);
    });
    return () => unsubscribe();
  }, [viewModel]);

  return {
    state,
    updateField: (field: keyof CreateAlunoDTO, value: string) => 
      viewModel.updateFormField(field, value),
    submit: () => viewModel.submit(),
  };
}
