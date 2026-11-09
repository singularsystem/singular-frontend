import { ILocationRepository } from "../../../model/repositories/ILocationRepository";
import { CityEntity } from "../../../model/entities/LocationEntity";
import { env } from "../config/env";
import { getSiglaEstadoPorNome } from "@/lib/utils";

export class LocationRepositoryImpl implements ILocationRepository {
  private apiUrl = env.apiUrl;

  constructor(private secureFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>) {}

  async getCitiesByUf(uf: string): Promise<CityEntity[]> {
    const sigla = getSiglaEstadoPorNome(uf) || uf;
    const response = await this.secureFetch(`${this.apiUrl}/api/v1/ibge/by-uf/${sigla.toLowerCase()}`, {
        // @ts-ignore
        auth: false
    });

    if (!response.ok) throw new Error("Erro ao buscar cidades");
    return await response.json();
  }
}
