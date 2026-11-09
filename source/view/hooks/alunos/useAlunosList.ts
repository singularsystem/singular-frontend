import { useEffect, useMemo, useState } from "react";
import { useSecureFetch } from "@/hooks/useSecureFetch";
import { AlunoRepositoryImpl } from "../../../infrastructure/alunos/AlunoRepositoryImpl";
import { FileRepositoryImpl } from "../../../infrastructure/alunos/FileRepositoryImpl";
import { AlunosListViewModel, AlunosListState } from "../../../view-model/alunos/AlunosListViewModel";
import { AlunoFilters } from "../../../model/entities/alunos/AlunoEntity";

export function useAlunosList() {
  const { secureFetch } = useSecureFetch();
  
  const repository = useMemo(() => new AlunoRepositoryImpl(secureFetch), [secureFetch]);
  const fileRepository = useMemo(() => new FileRepositoryImpl(secureFetch), [secureFetch]);
  const viewModel = useMemo(() => new AlunosListViewModel(repository, fileRepository), [repository, fileRepository]);
  
  const [state, setState] = useState<AlunosListState>(viewModel.getState());

  useEffect(() => {
    viewModel.restoreStateFromSession();
    setState(viewModel.getState());

    const unsubscribe = viewModel.subscribe((newState) => {
      setState(newState);
    });

    viewModel.loadAlunos();

    return () => unsubscribe();
  }, [viewModel]);

  return {
    state,
    setPage: (page: number) => viewModel.setPage(page),
    setPageSize: (size: number) => viewModel.setPageSize(size),
    setFilters: (filters: AlunoFilters) => viewModel.setFilters(filters),
    deleteAluno: (id: string) => viewModel.deleteAluno(id),
    refresh: () => viewModel.loadAlunos(),
    exportToExcel: () => viewModel.exportToExcel(),
    downloadTemplate: () => viewModel.downloadTemplate(),
  };
}
