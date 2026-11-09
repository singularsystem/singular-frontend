import { StudentEvaluation } from "@/types/avaliacao";
import { Relatorio } from "@/types/relatorio";
import { Filters } from "@/types/filters";

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  uniqueTotal?: number;
}

export interface ITrackingRepository {
  getCaseStudies(
    page: number,
    pageSize: number,
    filters: Filters,
    signal?: AbortSignal
  ): Promise<PaginatedResult<StudentEvaluation>>;

  getBiopsychosocialReports(
    page: number,
    pageSize: number,
    filters: Filters,
    signal?: AbortSignal
  ): Promise<PaginatedResult<Relatorio>>;
}
