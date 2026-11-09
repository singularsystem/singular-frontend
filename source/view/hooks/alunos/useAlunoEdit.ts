import { useEffect, useMemo, useState } from "react";
import { useSecureFetch } from "@/hooks/useSecureFetch";
import { AlunoRepositoryImpl } from "../../../infrastructure/alunos/AlunoRepositoryImpl";
import { AlunoEditViewModel, AlunoEditState } from "../../../view-model/alunos/AlunoEditViewModel";
import { CreateAlunoDTO } from "../../../model/entities/alunos/AlunoEntity";

export function useAlunoEdit(id: string) {
  const { secureFetch } = useSecureFetch();
  
  const repository = useMemo(() => new AlunoRepositoryImpl(secureFetch), [secureFetch]);
  const viewModel = useMemo(() => new AlunoEditViewModel(repository), [repository]);
  
  const [state, setState] = useState<AlunoEditState>(viewModel.getState());

  useEffect(() => {
    const unsubscribe = viewModel.subscribe((newState) => {
      setState(newState);
    });

    if (id) {
      viewModel.loadAluno(id);
    }

    return () => unsubscribe();
  }, [viewModel, id]);

  return {
    state,
    updateField: (field: keyof CreateAlunoDTO, value: string) => 
      viewModel.updateFormField(field, value),
    submit: () => viewModel.submit(),
  };
}
