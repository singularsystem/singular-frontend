import { ITrackingRepository, PaginatedResult } from "../../model/repositories/acompanhamento/ITrackingRepository";
import { StudentEvaluation } from "@/types/avaliacao";
import { Relatorio } from "@/types/relatorio";
import { Filters } from "@/types/filters";
import { env } from "../common/config/env";

export class TrackingRepositoryImpl implements ITrackingRepository {
  private apiUrl = env.apiUrl;

  constructor(
    private secureFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>
  ) {}

  async getCaseStudies(
    page: number,
    pageSize: number,
    filters: Filters,
    signal?: AbortSignal
  ): Promise<PaginatedResult<StudentEvaluation>> {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      ...(filters.state ? { state: filters.state } : {}),
      ...(filters.city ? { city: filters.city } : {}),
      ...(filters.schoolID ? { schoolID: filters.schoolID } : {}),
      ...(filters.searchTerm ? { searchTerm: filters.searchTerm } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.year ? { year: filters.year } : {}),
      ...(filters.month ? { month: filters.month } : {}),
    });

    const response = await this.secureFetch(
      `${this.apiUrl}/api/v1/regular-teacher-evaluations?${params.toString()}`,
      { method: "GET", signal }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao buscar estudos de caso");
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "Erro ao buscar estudos de caso");
    }

    return {
      data: result.data || [],
      total: result.total ?? 0,
      uniqueTotal: result.uniqueTotal ?? result.total ?? 0,
    };
  }

  async getBiopsychosocialReports(
    page: number,
    pageSize: number,
    filters: Filters,
    signal?: AbortSignal
  ): Promise<PaginatedResult<Relatorio>> {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
      ...(filters.state ? { state: filters.state } : {}),
      ...(filters.city ? { city: filters.city } : {}),
      ...(filters.schoolID ? { schoolID: filters.schoolID } : {}),
      ...(filters.searchTerm ? { searchTerm: filters.searchTerm } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.pendingProfessional ? { pendingProfessional: filters.pendingProfessional } : {}),
      ...(filters.year ? { year: filters.year } : {}),
      ...(filters.month ? { month: filters.month } : {}),
    });

    const response = await this.secureFetch(
      `${this.apiUrl}/api/v1/reports?${params.toString()}`,
      { method: "GET", signal }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Erro ao buscar relatórios biopsicossociais");
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || "Erro ao buscar relatórios biopsicossociais");
    }

    return {
      data: result.data || [],
      total: result.total ?? 0,
      uniqueTotal: result.uniqueTotal ?? result.total ?? 0,
    };
  }
}
