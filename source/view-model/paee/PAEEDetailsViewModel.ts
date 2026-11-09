import { PAEEEntity } from "../../model/entities/paee/PAEEEntity";
import { IPAEERepository } from "../../model/repositories/paee/IPAEERepository";

export interface PAEEDetailsState {
  paee: PAEEEntity | null;
  isLoading: boolean;
  error: string | null;
}

export class PAEEDetailsViewModel {
  private state: PAEEDetailsState = {
    paee: null,
    isLoading: true,
    error: null,
  };
  private listeners: ((state: PAEEDetailsState) => void)[] = [];

  constructor(private repository: IPAEERepository) {}

  getState(): PAEEDetailsState {
    return { ...this.state };
  }

  subscribe(listener: (state: PAEEDetailsState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener({ ...this.state }));
  }

  async loadPAEE(id: string) {
    this.state.isLoading = true;
    this.state.error = null;
    this.notify();

    try {
      const data = await this.repository.getPAEEById(id);
      this.state.paee = data;
    } catch (error: any) {
      this.state.error = error.message || "Erro ao carregar o PAEE.";
    } finally {
      this.state.isLoading = false;
      this.notify();
    }
  }
}
