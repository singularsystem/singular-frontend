import { EscolaEntity } from "../../model/entities/escolas/EscolaEntity";
import { IEscolaRepository } from "../../model/repositories/escolas/IEscolaRepository";
import { ILocationRepository } from "../../model/repositories/ILocationRepository";
import { CityEntity } from "../../model/entities/LocationEntity";
import { getNomeEstadoPorNome } from "@/lib/utils";

export interface EscolasListState {
  escolas: EscolaEntity[];
  total: number;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  searchTerm: string;
  state: string;
  city: string;
  cities: CityEntity[];
  isLoadingCities: boolean;
}

type Listener = (state: EscolasListState) => void;

export class EscolasListViewModel {
  private state: EscolasListState = {
    escolas: [],
    total: 0,
    isLoading: false,
    error: null,
    currentPage: 1,
    pageSize: 10,
    searchTerm: "",
    state: "",
    city: "",
    cities: [],
    isLoadingCities: false,
  };

  private listeners: Listener[] = [];
  private abortController: AbortController | null = null;

  constructor(
    private repository: IEscolaRepository,
    private locationRepository?: ILocationRepository
  ) {}

  restoreStateFromSession() {
    if (typeof window !== "undefined") {
      try {
        const saved = sessionStorage.getItem("ipaags_escolas_list_state");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed) {
            this.state.currentPage = parsed.currentPage ?? 1;
            this.state.pageSize = parsed.pageSize ?? 10;
            this.state.searchTerm = parsed.searchTerm ?? "";
            this.state.state = parsed.state ?? "";
            this.state.city = parsed.city ?? "";
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
        sessionStorage.setItem("ipaags_escolas_list_state", JSON.stringify({
          currentPage: this.state.currentPage,
          pageSize: this.state.pageSize,
          searchTerm: this.state.searchTerm,
          state: this.state.state,
          city: this.state.city,
        }));
      } catch (e) {
        console.error("Erro ao salvar estado no sessionStorage:", e);
      }
    }
  }

  getState(): EscolasListState {
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

  private updateState(partialState: Partial<EscolasListState>) {
    this.state = { ...this.state, ...partialState };
    this.saveStateToSession();
    this.notify();
  }

  async loadEscolas() {
    if (this.abortController) {
      this.abortController.abort();
    }
    this.abortController = new AbortController();

    this.updateState({ isLoading: true, error: null });

    // Se temos um estado selecionado do sessionStorage mas a lista de cidades está vazia, carrega-as
    if (this.state.state && this.state.cities.length === 0 && !this.state.isLoadingCities && this.locationRepository) {
      this.updateState({ isLoadingCities: true });
      try {
        const cities = await this.locationRepository.getCitiesByUf(this.state.state);
        this.updateState({ cities, isLoadingCities: false });
      } catch (error) {
        this.updateState({ isLoadingCities: false });
      }
    }

    try {
      const result = await this.repository.getEscolas(
        this.state.currentPage,
        this.state.pageSize,
        this.state.searchTerm,
        this.state.state,
        this.state.city,
        this.abortController.signal
      );
      this.updateState({
        escolas: result.data,
        total: result.total,
        isLoading: false
      });
    } catch (error: any) {
      if (error.name === "AbortError") return;
      this.updateState({
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro desconhecido ao carregar escolas"
      });
    } finally {
      this.abortController = null;
    }
  }

  setPage(page: number) {
    this.updateState({ currentPage: page });
    this.loadEscolas();
  }

  setPageSize(size: number) {
    this.updateState({ pageSize: size, currentPage: 1 });
    this.loadEscolas();
  }

  setSearchTerm(term: string) {
    const hasChanged = term !== this.state.searchTerm;
    if (hasChanged) {
      this.updateState({ searchTerm: term, currentPage: 1 });
      this.loadEscolas();
    }
  }

  async setState(stateName: string) {
    const normalizedState = getNomeEstadoPorNome(stateName) ?? stateName;
    const hasChanged = normalizedState !== this.state.state;
    if (hasChanged) {
      this.updateState({
        state: normalizedState,
        city: "",
        cities: [],
        currentPage: 1
      });

      if (normalizedState && this.locationRepository) {
        this.updateState({ isLoadingCities: true });
        try {
          const cities = await this.locationRepository.getCitiesByUf(normalizedState);
          this.updateState({ cities, isLoadingCities: false });
        } catch (error) {
          this.updateState({ isLoadingCities: false });
        }
      }

      this.loadEscolas();
    }
  }

  setCity(cityName: string) {
    const hasChanged = cityName !== this.state.city;
    if (hasChanged) {
      this.updateState({ city: cityName, currentPage: 1 });
      this.loadEscolas();
    }
  }

  resetFilters() {
    const hasFilters = this.state.state !== "" || this.state.city !== "";
    if (hasFilters) {
      this.updateState({
        state: "",
        city: "",
        cities: [],
        currentPage: 1
      });
      this.loadEscolas();
    }
  }

  async deleteEscola(id: string) {
    this.updateState({ isLoading: true, error: null });
    try {
      await this.repository.deleteEscola(id);
      this.loadEscolas();
    } catch (error) {
      this.updateState({
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro ao excluir escola"
      });
    }
  }
}
