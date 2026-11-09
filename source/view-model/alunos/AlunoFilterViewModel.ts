import { AlunoFilters } from "../../model/entities/alunos/AlunoEntity";
import { CityEntity, SchoolSummaryEntity } from "../../model/entities/LocationEntity";
import { ILocationRepository } from "../../model/repositories/ILocationRepository";
import { ISchoolRepository } from "../../model/repositories/ISchoolRepository";
import { getNomeEstadoPorNome } from "@/lib/utils";

export interface AlunoFilterState {
  filters: AlunoFilters;
  cities: CityEntity[];
  schools: SchoolSummaryEntity[];
  isLoadingCities: boolean;
  isLoadingSchools: boolean;
}

type Listener = (state: AlunoFilterState) => void;

export class AlunoFilterViewModel {
  private state: AlunoFilterState = {
    filters: {
      state: "",
      city: "",
      schoolID: "",
      serie: "",
    },
    cities: [],
    schools: [],
    isLoadingCities: false,
    isLoadingSchools: false,
  };

  private listeners: Listener[] = [];

  constructor(
    private locationRepository: ILocationRepository,
    private schoolRepository: ISchoolRepository,
    initialFilters: AlunoFilters
  ) {
    const rawState = initialFilters.state ?? "";
    const normalizedState = getNomeEstadoPorNome(rawState) ?? rawState;
    this.state.filters = {
      ...initialFilters,
      state: normalizedState,
    };
  }

  getState(): AlunoFilterState {
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

  private updateState(partialState: Partial<AlunoFilterState>) {
    this.state = { ...this.state, ...partialState };
    this.notify();
  }

  async loadInitialData() {
    const stateName = this.state.filters.state;
    const cityName = this.state.filters.city;

    if (stateName) {
      this.updateState({ isLoadingCities: true });
      try {
        const cities = await this.locationRepository.getCitiesByUf(stateName);
        this.updateState({ cities, isLoadingCities: false });

        if (cityName) {
          this.updateState({ isLoadingSchools: true });
          try {
            const schools = await this.schoolRepository.getSchoolsByCity(cityName, stateName);
            this.updateState({ schools, isLoadingSchools: false });
          } catch (error) {
            this.updateState({ isLoadingSchools: false });
          }
        }
      } catch (error) {
        this.updateState({ isLoadingCities: false });
      }
    }
  }

  async setState(stateName: string) {
    const normalizedState = getNomeEstadoPorNome(stateName) ?? stateName;
    this.updateState({ 
      filters: { ...this.state.filters, state: normalizedState, city: "", schoolID: "" },
      cities: [],
      schools: []
    });
    
    if (normalizedState) {
      this.updateState({ isLoadingCities: true });
      try {
        const cities = await this.locationRepository.getCitiesByUf(normalizedState);
        this.updateState({ cities, isLoadingCities: false });
      } catch (error) {
        this.updateState({ isLoadingCities: false });
      }
    }
  }

  async setCity(cityName: string) {
    this.updateState({ 
      filters: { ...this.state.filters, city: cityName, schoolID: "" },
      schools: []
    });

    if (cityName && this.state.filters.state) {
      this.updateState({ isLoadingSchools: true });
      try {
        const schools = await this.schoolRepository.getSchoolsByCity(cityName, this.state.filters.state);
        this.updateState({ schools, isLoadingSchools: false });
      } catch (error) {
        this.updateState({ isLoadingSchools: false });
      }
    }
  }

  setSchool(schoolID: string) {
    this.updateState({ 
      filters: { ...this.state.filters, schoolID } 
    });
  }

  setSerie(serieName: string) {
    this.updateState({
      filters: { ...this.state.filters, serie: serieName }
    });
  }

  reset() {
    this.updateState({
      filters: { state: "", city: "", schoolID: "", serie: "" },
      cities: [],
      schools: []
    });
  }
}
