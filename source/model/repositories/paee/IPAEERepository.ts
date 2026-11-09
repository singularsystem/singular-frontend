import { PAEEEntity, PAEEFilters, PaginatedResult, CreatePAEEEntity, UpdatePAEEEntity } from "../../entities/paee/PAEEEntity";

export interface IPAEERepository {
  getPAEEs(page: number, pageSize: number, filters: PAEEFilters, signal?: AbortSignal): Promise<PaginatedResult<PAEEEntity>>;
  getPAEEById(id: string, signal?: AbortSignal): Promise<PAEEEntity>;
  createPAEE(data: CreatePAEEEntity): Promise<void>;
  updatePAEE(data: UpdatePAEEEntity): Promise<void>;
  deletePAEE(id: string): Promise<void>;
}