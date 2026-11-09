import { CityEntity } from "../entities/LocationEntity";

export interface ILocationRepository {
  getCitiesByUf(uf: string): Promise<CityEntity[]>;
}
