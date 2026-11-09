import { useEffect, useMemo, useState } from "react";
import { useSecureFetch } from "@/hooks/useSecureFetch";
import { AlunoRepositoryImpl } from "../../../infrastructure/alunos/AlunoRepositoryImpl";
import { AlunoDetailsViewModel, AlunoDetailsState } from "../../../view-model/alunos/AlunoDetailsViewModel";

export function useAlunoDetails(id: string) {
  const { secureFetch } = useSecureFetch();
  
  const repository = useMemo(() => new AlunoRepositoryImpl(secureFetch), [secureFetch]);
  const viewModel = useMemo(() => new AlunoDetailsViewModel(repository), [repository]);
  
  const [state, setState] = useState<AlunoDetailsState>(viewModel.getState());

  useEffect(() => {
    const unsubscribe = viewModel.subscribe((newState) => {
      setState(newState);
    });

    if (id) {
      viewModel.loadDetails(id);
    }

    return () => unsubscribe();
  }, [viewModel, id]);

  return {
    state,
    uploadFiles: (files: FileList) => viewModel.uploadFiles(files),
    deleteAttachment: (attachmentId: string) => viewModel.deleteAttachment(attachmentId),
    refresh: () => id && viewModel.loadDetails(id),
    getDocumentUrl: (docId: string, docType: string) => viewModel.getDocumentUrl(docId, docType),
  };
}
