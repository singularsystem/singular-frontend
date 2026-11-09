import { IDashboardRepository } from "../../model/repositories/dashboard/IDashboardRepository";
import { DashboardEntity } from "../../model/entities/dashboard/DashboardEntity";
import { DashBoardFilters } from "@/lib/constants";
import { env } from "../common/config/env";

export class DashboardRepositoryImpl implements IDashboardRepository {
  private apiUrl = env.apiUrl;

  constructor(
    private secureFetch: (
      input: RequestInfo,
      init?: RequestInit
    ) => Promise<Response>
  ) {}

  async getDashboardStatistics(
    filters: DashBoardFilters,
    signal?: AbortSignal
  ): Promise<DashboardEntity> {
    const params = new URLSearchParams();

    if (filters.sex) params.append("sex", filters.sex);
    if (filters.state) params.append("state", filters.state);
    if (filters.city) params.append("city", filters.city);
    if (filters.schoolID) params.append("schoolID", filters.schoolID);
    if (filters.minimalAge) params.append("minimalAge", filters.minimalAge);
    if (filters.maximumAge) params.append("maximumAge", filters.maximumAge);
    if (filters.registrationType) {
      params.append("registrationType", filters.registrationType);
    }
    if (filters.disability) params.append("disability", filters.disability);
    if (filters.month) params.append("month", filters.month);
    if (filters.year) params.append("year", filters.year);

    const queryString = params.toString();
    const url = `${this.apiUrl}/api/v1/statistics?${queryString}`;

    const response = await this.secureFetch(url, {
      method: "GET",
      signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Erro HTTP! Status: ${response.status}`
      );
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "Erro ao buscar dados estatísticos.");
    }

    return result.data;
  }

  async upsertMunicipalityStudentTarget(payload: {
    state: string;
    city: string;
    totalStudents: number;
  }): Promise<any> {
    const url = `${this.apiUrl}/api/v1/statistics/municipality-total`;

    const response = await this.secureFetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[DashboardRepository] Error response data:", errorData);
      const errorMessage = errorData.message || errorData.Message || `Erro HTTP! Status: ${response.status}`;
      throw new Error(errorMessage);
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "Erro ao salvar meta do município.");
    }

    return result;
  }
}
