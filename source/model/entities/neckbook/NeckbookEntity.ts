export interface MunicipioCotaEntity {
  id: string;
  name: string;
  monthlyQuota: number;
  currentUsage: number;
  remaining: number;
  quotaRenewsAt: string | null;
  moduleActive: boolean;
}

export interface ApiKeyEntity {
  id: string;
  maskedKey: string;
  isActive: boolean;
  createdAt: string;
  description: string | null;
}

export interface ApiKeyTokenResult {
  key: ApiKeyEntity;
  token: string;
}

export interface CreateMunicipioDTO {
  name: string;
  monthlyQuota: number;
  moduleActive: boolean;
}

export interface UpdateMunicipioDTO {
  monthlyQuota?: number;
  moduleActive?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export interface StandardizedErrorBody {
  code: string;
  message: string;
  details?: unknown;
}

export class NeckbookAdminError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "NeckbookAdminError";
    Object.setPrototypeOf(this, NeckbookAdminError.prototype);
  }
}

export type AdminErrorKind =
  | "auth"
  | "not_found"
  | "validation"
  | "network"
  | "server_config"
  | "generic";

export interface AdminErrorView {
  kind: AdminErrorKind;
  message: string;
  fieldErrors?: Record<string, string>;
}
