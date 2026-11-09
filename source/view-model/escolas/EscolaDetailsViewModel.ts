import { IEscolaRepository } from "../../model/repositories/escolas/IEscolaRepository";
import { EscolaEntity } from "../../model/entities/escolas/EscolaEntity";

export interface EscolaDetailsState {
  school: EscolaEntity | null;
  isLoading: boolean;
  error: string | null;
}

export class EscolaDetailsViewModel {
  private state: EscolaDetailsState = {
    school: null,
    isLoading: false,
    error: null,
  };

  private listeners: ((state: EscolaDetailsState) => void)[] = [];

  constructor(private repository: IEscolaRepository) {}

  subscribe(listener: (state: EscolaDetailsState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  async loadSchool(id: string, signal?: AbortSignal) {
    this.state = { ...this.state, isLoading: true, error: null };
    this.notify();

    try {
      const school = await this.repository.getEscolaById(id, signal);
      this.state = { school, isLoading: false, error: null };
    } catch (err: any) {
      if (err.name !== "AbortError") {
        this.state = { school: null, isLoading: false, error: err.message || "Erro ao carregar detalhes da escola" };
      }
    }
    this.notify();
  }

  getState() {
    return this.state;
  }
}
