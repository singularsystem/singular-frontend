import { DashboardEntity } from "../../entities/dashboard/DashboardEntity";
import { DashBoardFilters } from "@/lib/constants";

export interface IDashboardRepository {
  getDashboardStatistics(
    filters: DashBoardFilters,
    signal?: AbortSignal
  ): Promise<DashboardEntity>;

  upsertMunicipalityStudentTarget(payload: {
    state: string;
    city: string;
    totalStudents: number;
  }): Promise<any>;
}
