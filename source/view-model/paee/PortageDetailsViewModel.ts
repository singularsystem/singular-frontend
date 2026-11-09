import { PortageEntity } from "../../model/entities/paee/PortageEntity";
import { IPortageRepository } from "../../model/repositories/paee/IPortageRepository";

export interface PortageDetailsState {
  portages: PortageEntity[];
  isLoading: boolean;
  error: string | null;
}

export class PortageDetailsViewModel {
  private state: PortageDetailsState = {
    portages: [],
    isLoading: true,
    error: null,
  };

  private listeners: ((state: PortageDetailsState) => void)[] = [];

  constructor(private repository: IPortageRepository) {}

  getState(): PortageDetailsState {
    return { ...this.state };
  }

  subscribe(listener: (state: PortageDetailsState) => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach((listener) => listener({ ...this.state }));
  }

  async loadPortagesByStudent(studentId: string) {
    this.state.isLoading = true;
    this.state.error = null;
    this.notify();

    try {
      const data = await this.repository.getPortagesByStudent(studentId);
      this.state.portages = data || [];
    } catch (error: any) {
      this.state.error = error.message || "Erro ao carregar os Portages.";
    } finally {
      this.state.isLoading = false;
      this.notify();
    }
  }
}
