import { CreatePortageEntity } from "../../model/entities/paee/PortageEntity";
import { IPortageRepository } from "../../model/repositories/paee/IPortageRepository";
import { Student } from "@/types/aluno";
import { useFetchStudent } from "@/hooks/useFetchStudents"; // Still need student data, or we could add it to a repository, but let's keep it simple

export interface PortageFormState {
  formData: CreatePortageEntity;
  student: Student | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  saveSuccess: boolean;
  savedId: string | null;
}

export class PortageFormViewModel {
  private state: PortageFormState = {
    formData: {
      studentID: "",
      userID: "",
      ageRange: "",
      responses: {},
    },
    student: null,
    isLoading: true,
    isSaving: false,
    error: null,
    saveSuccess: false,
    savedId: null,
  };

  private listeners: ((state: PortageFormState) => void)[] = [];

  constructor(private portageRepository: IPortageRepository) {}

  getState(): PortageFormState {
    return { ...this.state };
  }

  subscribe(listener: (state: PortageFormState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener({ ...this.state }));
  }

  setStudentData(student: Student) {
    this.state.student = student;
    this.state.formData.studentID = student.id;
    this.state.isLoading = false;
    this.notify();
  }

  setError(error: string) {
    this.state.error = error;
    this.state.isLoading = false;
    this.notify();
  }

  updateFormData(updates: Partial<CreatePortageEntity>) {
    this.state.formData = { ...this.state.formData, ...updates };
    this.notify();
  }

  async savePortage(userId: string) {
    if (!this.state.student || !userId) {
      this.state.error = "Usuário ou aluno(a) não carregado(s).";
      this.notify();
      return;
    }

    this.state.isSaving = true;
    this.state.error = null;
    this.state.saveSuccess = false;
    this.state.savedId = null;
    this.notify();

    try {
      this.state.formData.userID = userId;
      const result = await this.portageRepository.createPortage(this.state.formData);
      this.state.saveSuccess = true;
      this.state.savedId = result.id;
    } catch (error: any) {
      this.state.error = error.message || "Ocorreu um erro ao tentar salvar a avaliação";
    } finally {
      this.state.isSaving = false;
      this.notify();
    }
  }
}
