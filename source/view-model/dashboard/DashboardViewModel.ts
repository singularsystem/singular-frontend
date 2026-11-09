import { DashboardEntity } from "../../model/entities/dashboard/DashboardEntity";
import { IDashboardRepository } from "../../model/repositories/dashboard/IDashboardRepository";
import { ILocationRepository } from "../../model/repositories/ILocationRepository";
import { ISchoolRepository } from "../../model/repositories/ISchoolRepository";
import { DashBoardFilters } from "@/lib/constants";
import { CityEntity, SchoolSummaryEntity } from "../../model/entities/LocationEntity";
import { getSiglaEstadoPorNome } from "@/lib/utils";

export interface DashboardState {
  activeTab: string;
  isLoading: boolean;
  isSavingMunicipalityTotal: boolean;
  isGeneratingPDF: boolean;
  refreshKey: number;
  municipalityTotalInput: string;
  filters: DashBoardFilters;
  cities: CityEntity[];
  isLoadingCities: boolean;
  errorCities: string | null;
  schools: SchoolSummaryEntity[];
  isLoadingSchools: boolean;
  errorSchools: string | null;
  estatisticas: DashboardEntity | null;
  error: string | null;
  porcentagemStudents: number;
}

type Listener = (state: DashboardState) => void;

export class DashboardViewModel {
  private state: DashboardState = {
    activeTab: "overview",
    isLoading: true,
    isSavingMunicipalityTotal: false,
    isGeneratingPDF: false,
    refreshKey: 0,
    municipalityTotalInput: "",
    filters: {
      sex: undefined,
      state: undefined,
      city: undefined,
      schoolID: undefined,
      minimalAge: undefined,
      maximumAge: undefined,
      registrationType: undefined,
      disability: undefined,
      month: undefined,
      year: undefined,
    },
    cities: [],
    isLoadingCities: false,
    errorCities: null,
    schools: [],
    isLoadingSchools: false,
    errorSchools: null,
    estatisticas: null,
    error: null,
    porcentagemStudents: 0,
  };

  private listeners: Listener[] = [];
  private statsAbortController: AbortController | null = null;
  private citiesAbortController: AbortController | null = null;
  private schoolsAbortController: AbortController | null = null;

  constructor(
    private repository: IDashboardRepository,
    private locationRepository: ILocationRepository,
    private schoolRepository: ISchoolRepository
  ) {}

  getState(): DashboardState {
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

  private updateState(partialState: Partial<DashboardState>) {
    this.state = { ...this.state, ...partialState };
    this.saveStateToSession();
    this.notify();
  }

  restoreStateFromSession() {
    // Não persistir filtros do dashboard entre recarregamentos/navegações de acordo com a solicitação do usuário
  }

  private saveStateToSession() {
    // Não persistir filtros do dashboard entre recarregamentos/navegações de acordo com a solicitação do usuário
  }

  async loadDashboardStatistics() {
    if (this.statsAbortController) {
      this.statsAbortController.abort();
    }
    this.statsAbortController = new AbortController();

    this.updateState({ isLoading: true, error: null });

    // Se temos estado e cidade selecionados, sincroniza a meta do município
    this.syncMunicipalityTotalInput();

    try {
      const data = await this.repository.getDashboardStatistics(
        this.state.filters,
        this.statsAbortController.signal
      );

      const totalStudents = data.totalStudents ?? 0;
      const totalStudentsLastMonth = data.totalStudentsLastMonth ?? 0;
      const porcentagem =
        totalStudents > 0
          ? Math.round((totalStudentsLastMonth / totalStudents) * 100)
          : 0;

      this.updateState({
        estatisticas: data,
        porcentagemStudents: porcentagem,
        isLoading: false,
      });

      // Se temos estado e cidade selecionados, sincroniza a meta do município após carregamento das estatísticas
      this.syncMunicipalityTotalInput(data);
    } catch (error: any) {
      if (error.name === "AbortError") return;
      this.updateState({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro desconhecido ao carregar estatísticas",
      });
    } finally {
      this.statsAbortController = null;
    }
  }

  async loadCities(stateName: string) {
    if (!stateName) {
      this.updateState({ cities: [], errorCities: null });
      return;
    }

    if (this.citiesAbortController) {
      this.citiesAbortController.abort();
    }
    this.citiesAbortController = new AbortController();

    this.updateState({ isLoadingCities: true, errorCities: null });

    try {
      const citiesList = await this.locationRepository.getCitiesByUf(stateName);
      this.updateState({
        cities: citiesList,
        isLoadingCities: false,
      });
    } catch (error: any) {
      if (error.name === "AbortError") return;
      this.updateState({
        isLoadingCities: false,
        errorCities:
          error instanceof Error ? error.message : "Erro ao carregar cidades",
        cities: [],
      });
    } finally {
      this.citiesAbortController = null;
    }
  }

  async loadSchools(cityName: string, stateName: string) {
    if (!cityName || !stateName) {
      this.updateState({ schools: [], errorSchools: null });
      return;
    }

    if (this.schoolsAbortController) {
      this.schoolsAbortController.abort();
    }
    this.schoolsAbortController = new AbortController();

    this.updateState({ isLoadingSchools: true, errorSchools: null });

    try {
      const schoolsList = await this.schoolRepository.getSchoolsByCity(
        cityName,
        stateName
      );
      this.updateState({
        schools: schoolsList,
        isLoadingSchools: false,
      });
    } catch (error: any) {
      if (error.name === "AbortError") return;
      this.updateState({
        isLoadingSchools: false,
        errorSchools:
          error instanceof Error ? error.message : "Erro ao carregar escolas",
        schools: [],
      });
    } finally {
      this.schoolsAbortController = null;
    }
  }

  updateFilter(key: keyof DashBoardFilters, value: any) {
    const updatedFilters = { ...this.state.filters, [key]: value };

    // Regras de negócio ao alterar filtros
    if (key === "state") {
      updatedFilters.city = undefined;
      updatedFilters.schoolID = undefined;
      this.updateState({
        filters: updatedFilters,
        schools: [],
      });
      // Carrega as cidades para o novo estado
      if (value && value !== "todos") {
        this.loadCities(value);
      } else {
        this.updateState({ cities: [] });
      }
    } else if (key === "city") {
      updatedFilters.schoolID = undefined;
      this.updateState({
        filters: updatedFilters,
      });
      // Carrega as escolas para a nova cidade
      if (value && value !== "todos" && this.state.filters.state) {
        this.loadSchools(value, this.state.filters.state);
      } else {
        this.updateState({ schools: [] });
      }
    } else if (key === "registrationType") {
      // Reseta deficiência se não for AEE
      if (value !== "AEE") {
        updatedFilters.disability = undefined;
      }
      this.updateState({ filters: updatedFilters });
    } else {
      this.updateState({ filters: updatedFilters });
    }

    this.loadDashboardStatistics();
  }

  resetFilters() {
    this.updateState({
      filters: {
        sex: undefined,
        state: undefined,
        city: undefined,
        schoolID: undefined,
        minimalAge: undefined,
        maximumAge: undefined,
        registrationType: undefined,
        disability: undefined,
        month: undefined,
        year: undefined,
      },
      cities: [],
      schools: [],
    });
    this.loadDashboardStatistics();
  }

  setMunicipalityTotalInput(val: string) {
    this.updateState({ municipalityTotalInput: val });
  }

  async saveMunicipalityTotal() {
    const { state, city } = this.state.filters;
    if (!state || !city) {
      throw new Error("Selecione estado e município.");
    }

    const parsedValue = Number(this.state.municipalityTotalInput);
    if (!Number.isInteger(parsedValue) || parsedValue < 0) {
      throw new Error("Informe uma quantidade inteira maior ou igual a zero.");
    }

    this.updateState({ isSavingMunicipalityTotal: true });

    try {
      await this.repository.upsertMunicipalityStudentTarget({
        state,
        city,
        totalStudents: parsedValue,
      });

      this.updateState({
        refreshKey: this.state.refreshKey + 1,
        isSavingMunicipalityTotal: false,
      });

      // Recarrega estatísticas para atualizar o dashboard
      await this.loadDashboardStatistics();
    } catch (err: any) {
      this.updateState({ isSavingMunicipalityTotal: false });
      throw err;
    }
  }

  setActiveTab(tab: string) {
    this.updateState({ activeTab: tab });
  }

  setIsGeneratingPDF(val: boolean) {
    this.updateState({ isGeneratingPDF: val });
  }

  clearError() {
    this.updateState({ error: null });
  }

  clearCitiesError() {
    this.updateState({ errorCities: null });
  }

  clearSchoolsError() {
    this.updateState({ errorSchools: null });
  }

  private syncMunicipalityTotalInput(stats = this.state.estatisticas) {
    const { state, city } = this.state.filters;
    if (!state || !city) {
      this.updateState({ municipalityTotalInput: "" });
      return;
    }

    const key = `${city} - ${state}`;
    const savedValue =
      stats?.numberOfConfiguredTotalStudentsPerCity?.[key] ?? 0;
    this.updateState({
      municipalityTotalInput: savedValue > 0 ? savedValue.toString() : "",
    });
  }

  // Método auxiliar para inicializar dados dependentes salvos no sessionStorage
  async initialize() {
    this.restoreStateFromSession();
    
    // Se o estado foi restaurado do sessionStorage e possui filtros de estado/cidade, carrega as listas correspondentes
    const { state, city } = this.state.filters;
    
    if (state) {
      await this.loadCities(state);
      if (city) {
        await this.loadSchools(city, state);
      }
    }
    
    await this.loadDashboardStatistics();
  }
}
