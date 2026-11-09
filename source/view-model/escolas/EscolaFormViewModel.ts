import { IEscolaRepository } from "../../model/repositories/escolas/IEscolaRepository";
import { CreateEscolaDTO, UpdateEscolaDTO } from "../../model/entities/escolas/EscolaEntity";

export interface EscolaFormState {
  id?: string;
  name: string;
  state: string;
  city: string;
  principalID: string;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  success: boolean;
}

export class EscolaFormViewModel {
  private state: EscolaFormState = {
    name: "",
    state: "",
    city: "",
    principalID: "",
    isLoading: false,
    isSaving: false,
    error: null,
    success: false,
  };

  private listeners: ((state: EscolaFormState) => void)[] = [];

  constructor(private repository: IEscolaRepository) {}

  subscribe(listener: (state: EscolaFormState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  getState() {
    return this.state;
  }

  updateFields(fields: Partial<Omit<EscolaFormState, "isLoading" | "isSaving" | "error" | "success">>) {
    this.state = {
      ...this.state,
      ...fields,
      error: null,
      success: false,
    };
    this.notify();
  }

  async loadSchoolForEdit(id: string, signal?: AbortSignal) {
    this.state = { ...this.state, isLoading: true, error: null, id };
    this.notify();

    try {
      const school = await this.repository.getEscolaById(id, signal);
      this.state = {
        ...this.state,
        id: school.id,
        name: school.name,
        state: school.state,
        city: school.city,
        principalID: school.principalID || "",
        isLoading: false,
      };
    } catch (err: any) {
      if (err.name !== "AbortError") {
        this.state = {
          ...this.state,
          isLoading: false,
          error: err.message || "Erro ao carregar dados da escola para edição",
        };
      }
    }
    this.notify();
  }

  async submit(isEdit: boolean): Promise<boolean> {
    if (!this.state.name.trim()) {
      this.state = { ...this.state, error: "O nome da escola é obrigatório." };
      this.notify();
      return false;
    }
    if (!this.state.state) {
      this.state = { ...this.state, error: "O estado é obrigatório." };
      this.notify();
      return false;
    }
    if (!this.state.city) {
      this.state = { ...this.state, error: "A cidade é obrigatória." };
      this.notify();
      return false;
    }

    this.state = { ...this.state, isSaving: true, error: null, success: false };
    this.notify();

    try {
      if (isEdit) {
        if (!this.state.id) throw new Error("ID da escola inválido para edição");
        const dto: UpdateEscolaDTO = {
          id: this.state.id,
          name: this.state.name,
          state: this.state.state,
          city: this.state.city,
          principalID: this.state.principalID,
        };
        await this.repository.updateEscola(dto);
      } else {
        const dto: CreateEscolaDTO = {
          name: this.state.name,
          state: this.state.state,
          city: this.state.city,
          principalID: this.state.principalID,
        };
        await this.repository.createEscola(dto);
      }
      this.state = { ...this.state, isSaving: false, success: true };
      this.notify();
      return true;
    } catch (err: any) {
      this.state = {
        ...this.state,
        isSaving: false,
        error: err.message || "Ocorreu um erro ao salvar os dados da escola.",
      };
      this.notify();
      return false;
    }
  }
}
