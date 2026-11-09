import { useEffect, useMemo, useState } from "react";
import { useSecureFetch } from "@/hooks/useSecureFetch";
import { FileRepositoryImpl } from "../../../infrastructure/alunos/FileRepositoryImpl";
import { AlunoImportViewModel, AlunoImportState } from "../../../view-model/alunos/AlunoImportViewModel";

export function useAlunoImport() {
  const { secureFetch } = useSecureFetch();
  
  const repository = useMemo(() => new FileRepositoryImpl(secureFetch), [secureFetch]);
  const viewModel = useMemo(() => new AlunoImportViewModel(repository), [repository]);
  
  const [state, setState] = useState<AlunoImportState>(viewModel.getState());

  useEffect(() => {
    const unsubscribe = viewModel.subscribe((newState) => {
      setState(newState);
    });
    return () => unsubscribe();
  }, [viewModel]);

  return {
    state,
    importFile: (file: File) => viewModel.importFile(file),
    closeModal: () => viewModel.closeModal(),
    downloadFailedRows: () => viewModel.downloadFailedRows(),
  };
}
