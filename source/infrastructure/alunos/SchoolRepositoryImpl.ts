import { ISchoolRepository } from "../../model/repositories/ISchoolRepository";
import { SchoolSummaryEntity } from "../../model/entities/LocationEntity";
import { env } from "../common/config/env";

export class SchoolRepositoryImpl implements ISchoolRepository {
  private apiUrl = env.apiUrl;

  constructor(private secureFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>) {}

  async getSchoolsByCity(city: string, state: string): Promise<SchoolSummaryEntity[]> {
    const cityParam = encodeURIComponent(city);
    const stateParam = encodeURIComponent(state);
    const response = await this.secureFetch(`${this.apiUrl}/api/v1/schools/city/${cityParam}?state=${stateParam}`);

    if (!response.ok) throw new Error("Erro ao buscar escolas");
    const result = await response.json();
    return result.data || [];
  }
}
