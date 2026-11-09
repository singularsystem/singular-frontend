import { CreateAlunoDTO } from "../../model/entities/alunos/AlunoEntity";
import { IAlunoRepository } from "../../model/repositories/alunos/IAlunoRepository";
import { maskCPF, maskRG, maskSUSCard } from "@/lib/utils";

export interface AlunoFormState {
  formData: CreateAlunoDTO;
  isLoading: boolean;
  error: string | null;
  isSuccess: boolean;
}

type Listener = (state: AlunoFormState) => void;

export class AlunoFormViewModel {
  private state: AlunoFormState = {
    formData: {
      fullName: "",
      sex: "",
      dateOfBirth: "",
      address: "",
      city: "",
      state: "",
      schoolName: "",
      schoolCity: "",
      schoolState: "",
      serie: "",
      nameOfPersonResponsible: "",
      maritalStatusParents: "",
      skinColor: "",
      schoolID: "",
      susCard: "",
      rg: "",
      cpf: "",
    },
    isLoading: false,
    error: null,
    isSuccess: false,
  };

  private listeners: Listener[] = [];

  constructor(private repository: IAlunoRepository) {}

  getState(): AlunoFormState {
    return { ...this.state };
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l(this.getState()));
  }

  private updateState(partialState: Partial<AlunoFormState>) {
    this.state = { ...this.state, ...partialState };
    this.notify();
  }

  updateFormField(field: keyof CreateAlunoDTO, value: string) {
    let maskedValue = value;
    if (field === "cpf") maskedValue = maskCPF(value);
    if (field === "rg") maskedValue = maskRG(value);
    if (field === "susCard") maskedValue = maskSUSCard(value);

    this.updateState({
      formData: { ...this.state.formData, [field]: maskedValue },
    });
  }

  async submit() {
    this.updateState({ isLoading: true, error: null, isSuccess: false });
    try {
      // Limpeza de campos mascarados antes de enviar
      const dataToSubmit = { ...this.state.formData };
      if (dataToSubmit.cpf === "000.000.000-00") dataToSubmit.cpf = "";
      if (dataToSubmit.rg === "0.000.000") dataToSubmit.rg = "";
      if (dataToSubmit.susCard === "000 0000 0000 000") dataToSubmit.susCard = "";

      await this.repository.createAluno(dataToSubmit);
      this.updateState({ isLoading: false, isSuccess: true });
    } catch (error) {
      this.updateState({
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro ao cadastrar aluno",
      });
    }
  }
}
