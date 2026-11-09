import { ITrackingRepository } from "../../model/repositories/acompanhamento/ITrackingRepository";
import { StudentEvaluation } from "@/types/avaliacao";
import { Filters } from "@/types/filters";

export interface CaseStudiesTrackingState {
  evaluations: StudentEvaluation[];
  total: number;
  uniqueTotal: number;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  searchTerm: string;
  filters: Filters;
}

type Listener = (state: CaseStudiesTrackingState) => void;

export class CaseStudiesTrackingViewModel {
  private state: CaseStudiesTrackingState = {
    evaluations: [],
    total: 0,
    uniqueTotal: 0,
    isLoading: false,
    error: null,
    currentPage: 1,
    pageSize: 10,
    searchTerm: "",
    filters: {
      state: "",
      city: "",
      schoolID: "",
      searchTerm: "",
      status: "",
      year: "",
      month: "",
    },
  };

  private listeners: Listener[] = [];
  private abortController: AbortController | null = null;

  constructor(private repository: ITrackingRepository) {}

  restoreStateFromSession() {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("ipaags_case_studies_tracking_state");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed) {
            this.state.currentPage = parsed.currentPage ?? 1;
            this.state.pageSize = parsed.pageSize ?? 10;
            this.state.searchTerm = parsed.searchTerm ?? "";
            this.state.filters = parsed.filters ?? this.state.filters;
          }
        }
      } catch (e) {
        console.error("Erro ao restaurar estado do sessionStorage:", e);
      }
    }
  }

  private saveStateToSession() {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(
          "ipaags_case_studies_tracking_state",
          JSON.stringify({
            currentPage: this.state.currentPage,
            pageSize: this.state.pageSize,
            searchTerm: this.state.searchTerm,
            filters: this.state.filters,
          })
        );
      } catch (e) {
        console.error("Erro ao salvar estado no sessionStorage:", e);
      }
    }
  }

  getState(): CaseStudiesTrackingState {
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

  private updateState(partialState: Partial<CaseStudiesTrackingState>) {
    this.state = { ...this.state, ...partialState };
    this.saveStateToSession();
    this.notify();
  }

  async loadCaseStudies() {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();

    this.updateState({ isLoading: true, error: null });

    try {
      const result = await this.repository.getCaseStudies(
        this.state.currentPage,
        this.state.pageSize,
        this.state.filters,
        this.abortController.signal
      );

      this.updateState({
        evaluations: result.data,
        total: result.total,
        uniqueTotal: result.uniqueTotal ?? result.total,
        isLoading: false,
      });
    } catch (e: any) {
      if (e.name === "AbortError") return;
      this.updateState({
        isLoading: false,
        error: e.message || "Erro ao carregar estudos de caso",
      });
    }
  }

  setPage(page: number) {
    if (page === this.state.currentPage) return;
    this.updateState({ currentPage: page });
    this.loadCaseStudies();
  }

  setPageSize(size: number) {
    if (size === this.state.pageSize) return;
    this.updateState({ pageSize: size, currentPage: 1 });
    this.loadCaseStudies();
  }

  setSearchTerm(term: string) {
    this.updateState({ searchTerm: term, currentPage: 1 });
    this.state.filters.searchTerm = term;
    this.saveStateToSession();
    this.loadCaseStudies();
  }

  setFilters(newFilters: Filters) {
    this.updateState({
      filters: { ...this.state.filters, ...newFilters, searchTerm: this.state.searchTerm },
      currentPage: 1,
    });
    this.loadCaseStudies();
  }
}
