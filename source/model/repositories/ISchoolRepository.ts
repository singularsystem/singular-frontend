import { SchoolSummaryEntity } from "../entities/LocationEntity";

export interface ISchoolRepository {
  getSchoolsByCity(city: string, state: string): Promise<SchoolSummaryEntity[]>;
}
