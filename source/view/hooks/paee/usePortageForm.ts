import { useEffect, useMemo, useState } from "react";
import { PortageFormViewModel } from "../../../view-model/paee/PortageFormViewModel";
import { PortageRepositoryImpl } from "../../../infrastructure/paee/PortageRepositoryImpl";
import { useSecureFetch } from "@/hooks/useSecureFetch";
import { useFetchStudent } from "@/hooks/useFetchStudents"; // Still use this internally to bridge the student fetch for now

export function usePortageForm(studentId: string) {
  const { secureFetch } = useSecureFetch();

  const viewModel = useMemo(() => {
    const repository = new PortageRepositoryImpl(secureFetch);
    return new PortageFormViewModel(repository);
  }, [secureFetch]);

  const [state, setState] = useState(viewModel.getState());
  
  // We fetch student using the existing hook, then feed it to the view model
  const { aluno, error: fetchError, loading: fetchLoading } = useFetchStudent(studentId);

  useEffect(() => {
    if (aluno) {
      viewModel.setStudentData(aluno);
    }
  }, [aluno, viewModel]);

  useEffect(() => {
    if (fetchError) {
      viewModel.setError(fetchError.message || "Erro ao buscar aluno");
    }
  }, [fetchError, viewModel]);

  useEffect(() => {
    const unsubscribe = viewModel.subscribe(setState);
    return unsubscribe;
  }, [viewModel]);

  return {
    ...state,
    fetchLoading,
    updateFormData: (updates: any) => viewModel.updateFormData(updates),
    savePortage: (userId: string) => viewModel.savePortage(userId),
  };
}
