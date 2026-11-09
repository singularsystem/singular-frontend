import { CreateAlunoDTO, UpdateAlunoDTO } from "../../model/entities/alunos/AlunoEntity";
import { IAlunoRepository } from "../../model/repositories/alunos/IAlunoRepository";
import { maskCPF, maskRG, maskSUSCard } from "@/lib/utils";

export interface AlunoEditState {
  formData: CreateAlunoDTO;
  id: string | null;
  isLoading: boolean;
  isFetching: boolean;
  error: string | null;
  isSuccess: boolean;
}

type Listener = (state: AlunoEditState) => void;

export class AlunoEditViewModel {
  private state: AlunoEditState = {
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
    id: null,
    isLoading: false,
    isFetching: false,
    error: null,
    isSuccess: false,
  };

  private listeners: Listener[] = [];

  constructor(private repository: IAlunoRepository) {}

  getState(): AlunoEditState {
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

  private updateState(partialState: Partial<AlunoEditState>) {
    this.state = { ...this.state, ...partialState };
    this.notify();
  }

  async loadAluno(id: string) {
    this.updateState({ isFetching: true, error: null, id });
    try {
      const aluno = await this.repository.getAlunoById(id);
      this.updateState({
        formData: {
          fullName: aluno.fullName || aluno.nome || "",
          sex: aluno.sex || aluno.sexo || "",
          dateOfBirth: aluno.dataNascimento || "",
          address: aluno.address || "",
          city: aluno.city || aluno.cidade || "",
          state: aluno.state || aluno.uf || "",
          schoolName: aluno.schoolName || aluno.escolaNome || "",
          schoolCity: aluno.schoolCity || "",
          schoolState: aluno.schoolState || "",
          serie: aluno.serie || "", 
          nameOfPersonResponsible: aluno.nameOfPersonResponsible || "",
          maritalStatusParents: aluno.maritalStatusParents || "",
          skinColor: aluno.skinColor || "",
          schoolID: aluno.schoolID || aluno.escolaId || "",
          cpf: maskCPF(aluno.cpf || ""),
          rg: maskRG(aluno.rg || ""),
          susCard: maskSUSCard(aluno.susCard || ""),
        },
        isFetching: false,
      });
    } catch (error) {
      this.updateState({
        isFetching: false,
        error: error instanceof Error ? error.message : "Erro ao carregar aluno",
      });
    }
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
    if (!this.state.id) return;
    
    this.updateState({ isLoading: true, error: null, isSuccess: false });
    try {
      const dataToSubmit = { ...this.state.formData };
      
      const payload: UpdateAlunoDTO = {
        ...dataToSubmit,
        id: this.state.id,
      };
      await this.repository.updateAluno(payload);
      this.updateState({ isLoading: false, isSuccess: true });
    } catch (error) {
      this.updateState({
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro ao atualizar aluno",
      });
    }
  }
}
