import { PAEE, CreatePAEEDTO, UpdatePAEEDTO } from "@/types/paee";

export type PAEEEntity = PAEE;
export type CreatePAEEEntity = CreatePAEEDTO;
export type UpdatePAEEEntity = UpdatePAEEDTO;

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  uniqueTotal?: number;
}

export interface PAEEFilters {
  state?: string;
  city?: string;
  schoolID?: string;
  searchTerm?: string;
  onlyMyDocs?: boolean;
  onlyMyReports?: boolean;
  myStatus?: string;
}
