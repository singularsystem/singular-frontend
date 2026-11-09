import type {
  ApiKeyEntity,
  ApiKeyTokenResult,
  CreateMunicipioDTO,
  MunicipioCotaEntity,
  PaginatedResult,
  UpdateMunicipioDTO,
} from "@/source/model/entities/neckbook/NeckbookEntity";
import { NeckbookAdminError } from "@/source/model/entities/neckbook/NeckbookEntity";
import type {
  INeckbookAdminRepository,
  ListMunicipiosParams,
} from "@/source/model/repositories/neckbook/INeckbookAdminRepository";
import { NeckbookAdminAdapter } from "./NeckbookAdminAdapter";
import { parseNeckbookError } from "./NeckbookAdminErrorParser";

export const REPOSITORY_TIMEOUT_MS = 30_000;
export const PROXY_ADMIN_BASE_PATH = "/api/neckbook/admin";

export type SecureFetchFn = (
  url: string,
  options?: RequestInit,
) => Promise<Response>;

export class NeckbookAdminRepositoryImpl implements INeckbookAdminRepository {
  private readonly secureFetch: SecureFetchFn;
  private readonly timeoutMs: number;

  constructor(
    secureFetch: SecureFetchFn,
    timeoutMs: number = REPOSITORY_TIMEOUT_MS,
  ) {
    this.secureFetch = secureFetch;
    this.timeoutMs = timeoutMs;
  }

  private createTimeoutSignal(externalSignal?: AbortSignal): {
    signal: AbortSignal;
    cleanup: () => void;
  } {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
    }, this.timeoutMs);

    const onExternalAbort = () => {
      controller.abort();
    };

    if (externalSignal) {
      if (externalSignal.aborted) {
        controller.abort();
      } else {
        externalSignal.addEventListener("abort", onExternalAbort, { once: true });
      }
    }

    return {
      signal: controller.signal,
      cleanup: () => {
        clearTimeout(timer);
        if (externalSignal) {
          externalSignal.removeEventListener("abort", onExternalAbort);
        }
      },
    };
  }

  private async requestJson<T = unknown>(
    path: string,
    init: RequestInit = {},
    externalSignal?: AbortSignal,
  ): Promise<T> {
    const { signal, cleanup } = this.createTimeoutSignal(externalSignal);
    try {
      const response = await this.secureFetch(path, {
        ...init,
        signal,
      });

      if (!response.ok) {
        let errorPayload: unknown = null;
        try {
          const text = await response.text();
          errorPayload = text ? JSON.parse(text) : null;
        } catch {
          errorPayload = null;
        }
        throw parseNeckbookError(response.status, errorPayload);
      }

      if (response.status === 204) {
        return undefined as unknown as T;
      }

      const text = await response.text();
      if (!text) {
        return undefined as unknown as T;
      }
      return JSON.parse(text) as T;
    } catch (error: unknown) {
      if (error instanceof NeckbookAdminError) {
        throw error;
      }
      const isAbort =
        error instanceof Error &&
        (error.name === "AbortError" ||
          error.message.toLowerCase().includes("abort"));
      throw new NeckbookAdminError(
        isAbort ? 504 : 0,
        isAbort ? "REQUEST_TIMEOUT" : "NETWORK_ERROR",
        "Falha de comunicação com o servidor",
        error instanceof Error ? error.message : String(error),
      );
    } finally {
      cleanup();
    }
  }

  async listMunicipios(
    pageOrParams: number | ListMunicipiosParams,
    pageSizeArg?: number,
    searchTermArg?: string,
    signalArg?: AbortSignal,
  ): Promise<PaginatedResult<MunicipioCotaEntity>> {
    const params: ListMunicipiosParams =
      typeof pageOrParams === "number"
        ? {
            page: pageOrParams,
            pageSize: pageSizeArg ?? 15,
            search: searchTermArg ?? "",
            signal: signalArg,
          }
        : pageOrParams;

    const query = new URLSearchParams();
    query.set("page", String(params.page));
    query.set("pageSize", String(params.pageSize));
    if (params.search && params.search.trim().length > 0) {
      query.set("search", params.search.trim());
    }

    const url = `${PROXY_ADMIN_BASE_PATH}/municipalities?${query.toString()}`;
    const raw = await this.requestJson<unknown>(
      url,
      { method: "GET" },
      params.signal,
    );
    return NeckbookAdminAdapter.toPaginatedMunicipios(raw, params);
  }

  async createMunicipio(
    dto: CreateMunicipioDTO,
    signal?: AbortSignal,
  ): Promise<MunicipioCotaEntity> {
    const payload = {
      name: dto.name,
      monthly_quota: dto.monthlyQuota,
      module_active: dto.moduleActive,
    };
    const raw = await this.requestJson<Record<string, unknown>>(
      `${PROXY_ADMIN_BASE_PATH}/municipalities`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
      signal,
    );
    return NeckbookAdminAdapter.toMunicipioCotaEntity(raw ?? {});
  }

  async updateMunicipio(
    id: string,
    dto: UpdateMunicipioDTO,
    signal?: AbortSignal,
  ): Promise<MunicipioCotaEntity> {
    const payload: Record<string, unknown> = {};
    if (dto.monthlyQuota !== undefined) {
      payload.monthly_quota = dto.monthlyQuota;
    }
    if (dto.moduleActive !== undefined) {
      payload.module_active = dto.moduleActive;
    }

    const raw = await this.requestJson<Record<string, unknown>>(
      `${PROXY_ADMIN_BASE_PATH}/municipalities/${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
      signal,
    );
    return NeckbookAdminAdapter.toMunicipioCotaEntity(raw ?? {});
  }

  async listApiKeys(
    municipioId: string,
    signal?: AbortSignal,
  ): Promise<ApiKeyEntity[]> {
    const raw = await this.requestJson<unknown>(
      `${PROXY_ADMIN_BASE_PATH}/municipalities/${encodeURIComponent(municipioId)}/api-keys`,
      { method: "GET" },
      signal,
    );
    return NeckbookAdminAdapter.toApiKeyList(raw);
  }

  async generateApiKey(
    municipioId: string,
    signal?: AbortSignal,
  ): Promise<ApiKeyTokenResult> {
    const raw = await this.requestJson<Record<string, unknown>>(
      `${PROXY_ADMIN_BASE_PATH}/municipalities/${encodeURIComponent(municipioId)}/api-keys`,
      {
        method: "POST",
        body: JSON.stringify({}),
      },
      signal,
    );
    return NeckbookAdminAdapter.toApiKeyTokenResult(raw ?? {});
  }

  async toggleApiKey(
    municipioId: string,
    keyId: string,
    isActive: boolean,
    signal?: AbortSignal,
  ): Promise<ApiKeyEntity> {
    const raw = await this.requestJson<Record<string, unknown>>(
      `${PROXY_ADMIN_BASE_PATH}/municipalities/${encodeURIComponent(municipioId)}/api-keys/${encodeURIComponent(keyId)}`,
      {
        method: "PATCH",
        body: JSON.stringify({ is_active: isActive }),
      },
      signal,
    );
    return NeckbookAdminAdapter.toApiKeyEntity(raw ?? {});
  }

  async revokeApiKey(
    municipioId: string,
    keyId: string,
    signal?: AbortSignal,
  ): Promise<void> {
    await this.requestJson<void>(
      `${PROXY_ADMIN_BASE_PATH}/municipalities/${encodeURIComponent(municipioId)}/api-keys/${encodeURIComponent(keyId)}`,
      {
        method: "DELETE",
      },
      signal,
    );
  }
}
