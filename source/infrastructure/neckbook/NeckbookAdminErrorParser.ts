import {
  NeckbookAdminError,
  type StandardizedErrorBody,
} from "@/source/model/entities/neckbook/NeckbookEntity";

export const QUOTA_RENEWS_AT_UNAVAILABLE = "Indisponível";

const ISO_DATE_PREFIX_REGEX = /^\d{4}-\d{2}-\d{2}(?:[T\s].*)?$/;

export function formatQuotaRenewsAtUtc(
  iso: string | null | undefined,
): string {
  if (typeof iso !== "string") {
    return QUOTA_RENEWS_AT_UNAVAILABLE;
  }
  const trimmed = iso.trim();
  if (!trimmed || !ISO_DATE_PREFIX_REGEX.test(trimmed)) {
    return QUOTA_RENEWS_AT_UNAVAILABLE;
  }
  const date = new Date(trimmed);
  if (Number.isNaN(date.getTime())) {
    return QUOTA_RENEWS_AT_UNAVAILABLE;
  }
  const year = String(date.getUTCFullYear()).padStart(4, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function extractFieldErrorsFromDetails(
  details: unknown,
): Record<string, string> {
  const result: Record<string, string> = {};
  if (!details) {
    return result;
  }

  if (Array.isArray(details)) {
    for (const item of details) {
      if (!item || typeof item !== "object") {
        continue;
      }
      const entry = item as Record<string, unknown>;
      const msg =
        typeof entry.msg === "string"
          ? entry.msg
          : typeof entry.message === "string"
            ? entry.message
            : null;
      if (!msg) {
        continue;
      }
      if (Array.isArray(entry.loc) && entry.loc.length > 0) {
        const lastSegment = entry.loc[entry.loc.length - 1];
        const fieldName = String(lastSegment ?? "").trim();
        if (fieldName.length > 0) {
          result[fieldName] = msg;
        }
      } else if (typeof entry.field === "string" && entry.field.trim().length > 0) {
        result[entry.field.trim()] = msg;
      }
    }
    return result;
  }

  if (typeof details === "object") {
    const obj = details as Record<string, unknown>;
    if (Array.isArray(obj.errors)) {
      return extractFieldErrorsFromDetails(obj.errors);
    }
    if (Array.isArray(obj.detail)) {
      return extractFieldErrorsFromDetails(obj.detail);
    }
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "string" && key.trim().length > 0) {
        result[key.trim()] = value;
      } else if (
        Array.isArray(value) &&
        value.length > 0 &&
        typeof value[0] === "string" &&
        key.trim().length > 0
      ) {
        result[key.trim()] = value[0];
      }
    }
  }

  return result;
}

export function deriveErrorDisplayMessage(
  body: Pick<StandardizedErrorBody, "code" | "message">,
): string {
  const trimmedMessage = typeof body.message === "string" ? body.message.trim() : "";
  const trimmedCode = typeof body.code === "string" ? body.code.trim() : "";
  if (trimmedMessage && trimmedCode) {
    return `${trimmedMessage} [${trimmedCode}]`;
  }
  return trimmedMessage || trimmedCode || "Erro desconhecido";
}

export function parseNeckbookError(
  status: number,
  raw: unknown,
): NeckbookAdminError {
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;

    if (typeof obj.code === "string" && typeof obj.message === "string") {
      return new NeckbookAdminError(
        status,
        obj.code,
        obj.message,
        obj.details,
      );
    }

    if (
      obj.error &&
      typeof obj.error === "object" &&
      typeof (obj.error as Record<string, unknown>).code === "string" &&
      typeof (obj.error as Record<string, unknown>).message === "string"
    ) {
      const inner = obj.error as Record<string, unknown>;
      return new NeckbookAdminError(
        status,
        String(inner.code),
        String(inner.message),
        inner.details,
      );
    }

    if ("detail" in obj) {
      const detail = obj.detail;
      if (typeof detail === "string") {
        return new NeckbookAdminError(
          status,
          status === 422 ? "VALIDATION_ERROR" : `HTTP_${status}`,
          detail,
          detail,
        );
      }
      if (detail && typeof detail === "object" && !Array.isArray(detail)) {
        const detailObj = detail as Record<string, unknown>;
        if (typeof detailObj.code === "string" && typeof detailObj.message === "string") {
          return new NeckbookAdminError(
            status,
            detailObj.code,
            detailObj.message,
            detailObj.details ?? detailObj,
          );
        }
      }
      return new NeckbookAdminError(
        status,
        status === 422 ? "VALIDATION_ERROR" : `HTTP_${status}`,
        status === 422 ? "Erro de validação nos campos informados" : `Erro HTTP ${status}`,
        detail,
      );
    }
  }

  if (typeof raw === "string" && raw.trim().length > 0) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return parseNeckbookError(status, parsed);
      }
    } catch {
      // ignore JSON parse error and fall through
    }
    return new NeckbookAdminError(status, `HTTP_${status}`, raw, undefined);
  }

  return new NeckbookAdminError(
    status,
    `HTTP_${status}`,
    `Erro na requisição (${status})`,
    raw,
  );
}
