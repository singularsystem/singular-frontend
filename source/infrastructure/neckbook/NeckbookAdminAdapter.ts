import type {
  ApiKeyEntity,
  ApiKeyTokenResult,
  MunicipioCotaEntity,
  PaginatedResult,
} from "@/source/model/entities/neckbook/NeckbookEntity";

export function computeRemaining(
  monthlyQuota: number,
  currentUsage: number,
): number {
  const safeQuota = Number.isFinite(monthlyQuota) ? Math.trunc(monthlyQuota) : 0;
  const safeUsage = Number.isFinite(currentUsage) ? Math.trunc(currentUsage) : 0;
  return Math.max(safeQuota - safeUsage, 0);
}

function maskTokenFallback(token: string): string {
  if (!token || token.length <= 8) {
    return "****";
  }
  return `${token.slice(0, 4)}...${token.slice(-4)}`;
}

export class NeckbookAdminAdapter {
  static computeRemaining(monthlyQuota: number, currentUsage: number): number {
    return computeRemaining(monthlyQuota, currentUsage);
  }

  static toMunicipioCotaEntity(raw: Record<string, unknown>): MunicipioCotaEntity {
    const id = String(raw.id ?? raw.municipality_id ?? "");
    const name = String(raw.name ?? "");
    const monthlyQuota = Number(
      raw.monthly_quota ?? raw.monthlyQuota ?? 0,
    );
    const currentUsage = Number(
      raw.current_usage ?? raw.currentUsage ?? 0,
    );

    const rawRemaining = raw.remaining;
    const remaining =
      typeof rawRemaining === "number" && Number.isFinite(rawRemaining)
        ? Math.max(Math.trunc(rawRemaining), 0)
        : computeRemaining(monthlyQuota, currentUsage);

    const rawRenewsAt = raw.quota_renews_at ?? raw.quotaRenewsAt;
    const quotaRenewsAt =
      typeof rawRenewsAt === "string" && rawRenewsAt.trim().length > 0
        ? rawRenewsAt
        : null;

    const moduleActive = Boolean(
      raw.module_active ?? raw.moduleActive ?? false,
    );

    return {
      id,
      name,
      monthlyQuota,
      currentUsage,
      remaining,
      quotaRenewsAt,
      moduleActive,
    };
  }

  static toPaginatedMunicipios(
    raw: unknown,
    params?: { page?: number; pageSize?: number; search?: string },
  ): PaginatedResult<MunicipioCotaEntity> {
    if (Array.isArray(raw)) {
      const all = raw.map((item) =>
        NeckbookAdminAdapter.toMunicipioCotaEntity(
          (item ?? {}) as Record<string, unknown>,
        ),
      );
      const search = params?.search?.trim().toLowerCase() ?? "";
      const filtered = search
        ? all.filter((m) => m.name.toLowerCase().includes(search))
        : all;
      const total = filtered.length;
      if (
        params?.page &&
        params?.pageSize &&
        params.pageSize > 0 &&
        filtered.length > params.pageSize
      ) {
        const start = (params.page - 1) * params.pageSize;
        return {
          data: filtered.slice(start, start + params.pageSize),
          total,
        };
      }
      return { data: filtered, total };
    }

    if (raw && typeof raw === "object") {
      const obj = raw as Record<string, unknown>;
      const rawList = Array.isArray(obj.data)
        ? obj.data
        : Array.isArray(obj.items)
          ? obj.items
          : [];
      const data = rawList.map((item) =>
        NeckbookAdminAdapter.toMunicipioCotaEntity(
          (item ?? {}) as Record<string, unknown>,
        ),
      );
      const total =
        typeof obj.total === "number" && Number.isFinite(obj.total)
          ? obj.total
          : data.length;
      return { data, total };
    }

    return { data: [], total: 0 };
  }

  static toApiKeyEntity(raw: Record<string, unknown>): ApiKeyEntity {
    const id = String(raw.id ?? raw.api_key_id ?? raw.apiKeyId ?? "");
    const rawPlainToken =
      typeof raw.api_key === "string"
        ? raw.api_key
        : typeof raw.token === "string"
          ? raw.token
          : "";
    const maskedKey = String(
      raw.masked_key ??
        raw.maskedKey ??
        raw.key_prefix ??
        (rawPlainToken ? maskTokenFallback(rawPlainToken) : "****"),
    );
    const isActive = Boolean(raw.is_active ?? raw.isActive ?? true);
    const createdAt = String(raw.created_at ?? raw.createdAt ?? "");
    const rawDesc = raw.description;
    const description =
      typeof rawDesc === "string" ? rawDesc : null;

    return {
      id,
      maskedKey,
      isActive,
      createdAt,
      description,
    };
  }

  static toApiKeyList(raw: unknown): ApiKeyEntity[] {
    if (Array.isArray(raw)) {
      return raw.map((item) =>
        NeckbookAdminAdapter.toApiKeyEntity(
          (item ?? {}) as Record<string, unknown>,
        ),
      );
    }
    if (raw && typeof raw === "object") {
      const obj = raw as Record<string, unknown>;
      if (Array.isArray(obj.data)) {
        return obj.data.map((item) =>
          NeckbookAdminAdapter.toApiKeyEntity(
            (item ?? {}) as Record<string, unknown>,
          ),
        );
      }
      if (Array.isArray(obj.items)) {
        return obj.items.map((item) =>
          NeckbookAdminAdapter.toApiKeyEntity(
            (item ?? {}) as Record<string, unknown>,
          ),
        );
      }
    }
    return [];
  }

  static toApiKeyTokenResult(raw: Record<string, unknown>): ApiKeyTokenResult {
    const nestedKey =
      raw.key && typeof raw.key === "object"
        ? (raw.key as Record<string, unknown>)
        : raw;
    const key = NeckbookAdminAdapter.toApiKeyEntity(nestedKey);
    const token = String(
      raw.token ?? raw.api_key ?? raw.apiKey ?? nestedKey.api_key ?? "",
    );
    return { key, token };
  }
}
