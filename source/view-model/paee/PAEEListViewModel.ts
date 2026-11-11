import { PAEEEntity, PAEEFilters } from "../../model/entities/paee/PAEEEntity";
import { IPAEERepository } from "../../model/repositories/paee/IPAEERepository";
import { getNomeEstadoPorNome } from "@/lib/utils";

export interface PAEEListState {
  paees: PAEEEntity[];
  total: number;
  uniqueTotal: number;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  filters: PAEEFilters;
}

type Listener = (state: PAEEListState) => void;

export class PAEEListViewModel {
  private state: PAEEListState = {
    paees: [],
    total: 0,
    uniqueTotal: 0,
    isLoading: false,
    error: null,
    currentPage: 1,
    pageSize: 15,
    filters: {
      state: "",
      city: "",
      schoolID: "",
      searchTerm: "",
      onlyMyDocs: false,
      onlyMyReports: false,
      myStatus: "all",
    }
  };

  private listeners: Listener[] = [];
  private abortController: AbortController | null = null;

  constructor(private repository: IPAEERepository) {}

  restoreStateFromSession() {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("singular_paee_list_state");
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
              onlyMyDocs: parsed.filters?.onlyMyDocs ?? false,
              onlyMyReports: parsed.filters?.onlyMyReports ?? false,
              myStatus: parsed.filters?.myStatus ?? "all",
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
        sessionStorage.setItem("singular_paee_list_state", JSON.stringify({
          currentPage: this.state.currentPage,
          pageSize: this.state.pageSize,
          filters: this.state.filters,
        }));
      } catch (e) {
        console.error("Erro ao salvar estado no sessionStorage:", e);
      }
    }
  }

  getState(): PAEEListState {
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

  private updateState(partialState: Partial<PAEEListState>) {
    this.state = { ...this.state, ...partialState };
    this.saveStateToSession();
    this.notify();
  }

  async loadPAEEs() {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();

    this.updateState({ isLoading: true, error: null });
    try {
      const result = await this.repository.getPAEEs(
        this.state.currentPage,
        this.state.pageSize,
        this.state.filters,
        this.abortController.signal
      );
      this.updateState({
        paees: result.data,
        total: result.total,
        uniqueTotal: result.uniqueTotal ?? result.total,
        isLoading: false
      });
    } catch (error: any) {
      if (error.name === "AbortError") return;
      this.updateState({
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro desconhecido ao carregar PAEEs"
      });
    } finally {
      this.abortController = null;
    }
  }

  setPage(page: number) {
    this.updateState({ currentPage: page });
    this.loadPAEEs();
  }

  setPageSize(size: number) {
    this.updateState({ pageSize: size, currentPage: 1 });
    this.loadPAEEs();
  }

  setFilters(filters: PAEEFilters) {
    const hasChanged = 
      (filters.state ?? "") !== (this.state.filters.state ?? "") ||
      (filters.city ?? "") !== (this.state.filters.city ?? "") ||
      (filters.schoolID ?? "") !== (this.state.filters.schoolID ?? "") ||
      (filters.searchTerm ?? "") !== (this.state.filters.searchTerm ?? "") ||
      filters.onlyMyDocs !== this.state.filters.onlyMyDocs ||
      filters.onlyMyReports !== this.state.filters.onlyMyReports ||
      (filters.myStatus ?? "") !== (this.state.filters.myStatus ?? "");

    if (hasChanged) {
      this.updateState({ filters: { ...this.state.filters, ...filters }, currentPage: 1 });
      this.loadPAEEs();
    }
  }

  async deletePAEE(id: string) {
    this.updateState({ isLoading: true, error: null });
    try {
      await this.repository.deletePAEE(id);
      this.loadPAEEs();
    } catch (error) {
      this.updateState({
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro ao deletar PAEE"
      });
      throw error;
    }
  }
}
