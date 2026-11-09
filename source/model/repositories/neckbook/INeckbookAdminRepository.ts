import type {
  ApiKeyEntity,
  ApiKeyTokenResult,
  CreateMunicipioDTO,
  MunicipioCotaEntity,
  PaginatedResult,
  UpdateMunicipioDTO,
} from "@/source/model/entities/neckbook/NeckbookEntity";

export interface ListMunicipiosParams {
  page: number;
  pageSize: number;
  search?: string;
  signal?: AbortSignal;
}

export interface INeckbookAdminRepository {
  listMunicipios(
    pageOrParams: number | ListMunicipiosParams,
    pageSize?: number,
    searchTerm?: string,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<MunicipioCotaEntity>>;

  createMunicipio(
    dto: CreateMunicipioDTO,
    signal?: AbortSignal,
  ): Promise<MunicipioCotaEntity>;

  updateMunicipio(
    id: string,
    patch: UpdateMunicipioDTO,
    signal?: AbortSignal,
  ): Promise<MunicipioCotaEntity>;

  listApiKeys(
    municipioId: string,
    signal?: AbortSignal,
  ): Promise<ApiKeyEntity[]>;

  generateApiKey(
    municipioId: string,
    signal?: AbortSignal,
  ): Promise<ApiKeyTokenResult>;

  toggleApiKey(
    municipioId: string,
    keyId: string,
    active: boolean,
    signal?: AbortSignal,
  ): Promise<ApiKeyEntity>;

  revokeApiKey(
    municipioId: string,
    keyId: string,
    signal?: AbortSignal,
  ): Promise<void>;
}
