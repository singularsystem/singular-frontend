import { AlunoEntity, AlunoFilters } from "../../model/entities/alunos/AlunoEntity";
import { IAlunoRepository } from "../../model/repositories/alunos/IAlunoRepository";
import { IFileRepository } from "../../model/repositories/alunos/IFileRepository";
import { getNomeEstadoPorNome } from "@/lib/utils";

export interface AlunosListState {
  alunos: AlunoEntity[];
  total: number;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  filters: AlunoFilters;
}

type Listener = (state: AlunosListState) => void;

export class AlunosListViewModel {
  private state: AlunosListState = {
    alunos: [],
    total: 0,
    isLoading: false,
    error: null,
    currentPage: 1,
    pageSize: 15,
    filters: {
      state: "",
      city: "",
      schoolID: "",
      searchTerm: "",
      serie: "",
    }
  };

  private listeners: Listener[] = [];
  private abortController: AbortController | null = null;

  constructor(
    private repository: IAlunoRepository,
    private fileRepository: IFileRepository
  ) {}

  restoreStateFromSession() {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("singular_alunos_list_state");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed) {
            const rawState = parsed.filters?.state ?? "";
            const normalizedState = getNomeEstadoPorNome(rawState) ?? rawState;
            this.state.currentPage = parsed.currentPage ?? 1;
            this.state.pageSize = parsed.pageSize ?? 15;
            this.state.filters = {
              state: normalizedState,
              city: parsed.filters?.city ?? "",
              schoolID: parsed.filters?.schoolID ?? "",
              searchTerm: parsed.filters?.searchTerm ?? "",
              serie: parsed.filters?.serie ?? "",
            };
          }
        }
      } catch (e) {
        console.error("Erro ao carregar estado do sessionStorage:", e);
      }
    }
  }

  private saveStateToSession() {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem("singular_alunos_list_state", JSON.stringify({
          currentPage: this.state.currentPage,
          pageSize: this.state.pageSize,
          filters: this.state.filters,
        }));
      } catch (e) {
        console.error("Erro ao salvar estado no sessionStorage:", e);
      }
    }
  }

  getState(): AlunosListState {
    return { ...this.state };
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.getState()));
  }

  private updateState(partialState: Partial<AlunosListState>) {
    this.state = { ...this.state, ...partialState };
    this.saveStateToSession();
    this.notify();
  }

  async loadAlunos() {
    // Cancela requisição anterior se existir
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();

    this.updateState({ isLoading: true, error: null });
    try {
      const result = await this.repository.getAlunos(
        this.state.currentPage,
        this.state.pageSize,
        this.state.filters,
        this.abortController.signal
      );
      this.updateState({
        alunos: result.data,
        total: result.total,
        isLoading: false
      });
    } catch (error: any) {
      if (error.name === "AbortError") return;
      this.updateState({
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro desconhecido ao carregar alunos"
      });
    } finally {
      this.abortController = null;
    }
  }

  setPage(page: number) {
    this.updateState({ currentPage: page });
    this.loadAlunos();
  }

  setPageSize(size: number) {
    this.updateState({ pageSize: size, currentPage: 1 });
    this.loadAlunos();
  }

  setFilters(filters: AlunoFilters) {
    const hasChanged = 
      (filters.state ?? "") !== (this.state.filters.state ?? "") ||
      (filters.city ?? "") !== (this.state.filters.city ?? "") ||
      (filters.schoolID ?? "") !== (this.state.filters.schoolID ?? "") ||
      (filters.serie ?? "") !== (this.state.filters.serie ?? "") ||
      (filters.searchTerm ?? "") !== (this.state.filters.searchTerm ?? "");

    if (hasChanged) {
      this.updateState({ filters: { ...this.state.filters, ...filters }, currentPage: 1 });
      this.loadAlunos();
    }
  }

  async deleteAluno(id: string) {
    this.updateState({ isLoading: true, error: null });
    try {
      await this.repository.deleteAluno(id);
      this.loadAlunos();
    } catch (error) {
      this.updateState({
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro ao deletar aluno"
      });
    }
  }

  async exportToExcel() {
    this.updateState({ isLoading: true, error: null });
    try {
      const allAlunos = await this.repository.fetchAllStudents(this.state.filters);
      // Aqui poderíamos ter um serviço de Excel, mas por enquanto retornamos os dados
      // para que a View decida como formatar (ex: via XLSX library se necessário)
      this.updateState({ isLoading: false });
      return allAlunos;
    } catch (error) {
      this.updateState({
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro ao exportar dados"
      });
      return [];
    }
  }

  async downloadTemplate() {
    this.updateState({ isLoading: true, error: null });
    try {
      const blob = await this.fileRepository.downloadTemplate();
      this.updateState({ isLoading: false });
      return blob;
    } catch (error) {
      this.updateState({
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro ao baixar template"
      });
      return null;
    }
  }
}
