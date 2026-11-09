import { isAdmin } from "@/source/infrastructure/common/config/roles";
import type { StandardizedErrorBody } from "@/source/model/entities/neckbook/NeckbookEntity";

export const DEFAULT_NECKBOOK_API_URL = "https://api.neckbook.com.br";
export const PROXY_TIMEOUT_MS = 30_000;

export interface ServerEnvLike {
  NECKBOOK_API_URL?: string;
  NECKBOOK_ADMIN_KEY?: string;
  NEXT_PUBLIC_API_URL?: string;
}

export interface AuthenticatedCaller {
  id?: string;
  email?: string;
  roles: string[];
}

export type CallerResolver = (
  token: string,
  req: Request,
) => Promise<AuthenticatedCaller | null> | AuthenticatedCaller | null;

export interface ForwardOptions {
  env?: ServerEnvLike;
  fetchImpl?: typeof fetch;
  resolveCaller?: CallerResolver;
  timeoutMs?: number;
}

let customCallerResolver: CallerResolver | null = null;

export function setCallerResolverForTests(resolver: CallerResolver | null): void {
  customCallerResolver = resolver;
}

export function resolveBaseUrl(
  env: ServerEnvLike = process.env as ServerEnvLike,
): string {
  const raw = env?.NECKBOOK_API_URL;
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (trimmed.length > 0) {
      return trimmed;
    }
  }
  return DEFAULT_NECKBOOK_API_URL;
}

export function readServerAdminKey(
  env: ServerEnvLike = process.env as ServerEnvLike,
): string | null {
  const raw = env?.NECKBOOK_ADMIN_KEY;
  if (typeof raw === "string") {
    const trimmed = raw.trim();
    if (trimmed.length > 0) {
      return trimmed;
    }
  }
  return null;
}

function decodeBase64Url(input: string): string | null {
  try {
    const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
    const padLength = (4 - (normalized.length % 4)) % 4;
    const padded = normalized + "=".repeat(padLength);
    if (typeof Buffer !== "undefined") {
      return Buffer.from(padded, "base64").toString("utf-8");
    }
    if (typeof atob === "function") {
      return atob(padded);
    }
    return null;
  } catch {
    return null;
  }
}

export function tryDecodeJwtCaller(token: string): AuthenticatedCaller | null {
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }
  const payloadJson = decodeBase64Url(parts[1]);
  if (!payloadJson) {
    return null;
  }
  try {
    const payload = JSON.parse(payloadJson) as Record<string, unknown>;
    if (typeof payload.exp === "number" && payload.exp * 1000 <= Date.now()) {
      return null;
    }
    const dotnetRoleClaim =
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    let roles: string[] | null = null;
    if (Array.isArray(payload.roles)) {
      roles = payload.roles.map((r) => String(r));
    } else if (typeof payload.role === "string") {
      roles = [payload.role];
    } else if (Array.isArray(payload.role)) {
      roles = payload.role.map((r) => String(r));
    } else if (typeof dotnetRoleClaim === "string") {
      roles = [dotnetRoleClaim];
    } else if (Array.isArray(dotnetRoleClaim)) {
      roles = dotnetRoleClaim.map((r) => String(r));
    } else if (
      payload.user &&
      typeof payload.user === "object" &&
      Array.isArray((payload.user as Record<string, unknown>).roles)
    ) {
      roles = ((payload.user as Record<string, unknown>).roles as unknown[]).map((r) =>
        String(r),
      );
    }
    if (!roles) {
      return null;
    }
    return {
      id: typeof payload.sub === "string" ? payload.sub : undefined,
      email: typeof payload.email === "string" ? payload.email : undefined,
      roles,
    };
  } catch {
    return null;
  }
}

export async function defaultResolveCaller(
  token: string,
  _req: Request,
  env: ServerEnvLike = process.env as ServerEnvLike,
  fetchImpl: typeof fetch = fetch,
): Promise<AuthenticatedCaller | null> {
  const jwtCaller = tryDecodeJwtCaller(token);
  if (jwtCaller) {
    return jwtCaller;
  }

  const apiBase = env?.NEXT_PUBLIC_API_URL?.trim();
  if (!apiBase) {
    return null;
  }

  try {
    const response = await fetchImpl(`${apiBase.replace(/\/+$/, "")}/api/v1/users/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      return null;
    }
    const json = (await response.json()) as Record<string, unknown>;
    const userData = (json.data ?? json) as Record<string, unknown>;
    const rawRoles = userData?.roles;
    if (!Array.isArray(rawRoles)) {
      return null;
    }
    return {
      id: typeof userData.id === "string" ? userData.id : undefined,
      email: typeof userData.email === "string" ? userData.email : undefined,
      roles: rawRoles.map((r) => String(r)),
    };
  } catch {
    return null;
  }
}

function jsonResponse(body: StandardizedErrorBody, status: number): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export function extractBearerToken(authHeader: string | null): string | null {
  if (!authHeader) {
    return null;
  }
  const match = authHeader.match(/^Bearer\s+(.+)$/i);
  if (!match) {
    return null;
  }
  const token = match[1].trim();
  return token.length > 0 ? token : null;
}

export async function authorizeAdminCaller(
  req: Request,
  options: ForwardOptions = {},
): Promise<Response | null> {
  const token = extractBearerToken(req.headers.get("authorization"));
  if (!token) {
    return jsonResponse(
      {
        code: "UNAUTHORIZED",
        message: "Token de autenticação ausente ou inválido",
        details: null,
      },
      401,
    );
  }

  const env = options.env ?? (process.env as ServerEnvLike);
  const fetchImpl = options.fetchImpl ?? fetch;
  const resolver = options.resolveCaller ?? customCallerResolver;

  const caller = resolver
    ? await resolver(token, req)
    : await defaultResolveCaller(token, req, env, fetchImpl);

  if (!caller || !Array.isArray(caller.roles)) {
    return jsonResponse(
      {
        code: "UNAUTHORIZED",
        message: "Sessão inválida ou expirada",
        details: null,
      },
      401,
    );
  }

  if (!isAdmin(caller.roles)) {
    return jsonResponse(
      {
        code: "FORBIDDEN",
        message: "Acesso permitido apenas para administradores",
        details: null,
      },
      403,
    );
  }

  return null;
}

export async function forwardToNeckbook(
  req: Request,
  targetPath: string,
  options: ForwardOptions = {},
): Promise<Response> {
  // (1) Autorizar o chamador admin PRIMEIRO (Task 3.4)
  const authErrorResponse = await authorizeAdminCaller(req, options);
  if (authErrorResponse) {
    return authErrorResponse;
  }

  // (2) Só então checar presença de NECKBOOK_ADMIN_KEY (Task 3.3)
  const env = options.env ?? (process.env as ServerEnvLike);
  const adminKey = readServerAdminKey(env);
  if (!adminKey) {
    return jsonResponse(
      {
        code: "SERVER_ADMIN_KEY_MISSING",
        message: "Servidor não configurado (Admin_Key ausente)",
        details: null,
      },
      500,
    );
  }

  // (3) Injetar Admin_Key e encaminhar com timeout de 30s
  const baseUrl = resolveBaseUrl(env).replace(/\/+$/, "");
  const incomingUrl = new URL(req.url);
  const normalizedPath = targetPath.startsWith("/") ? targetPath : `/${targetPath}`;
  const targetUrl = `${baseUrl}${normalizedPath}${incomingUrl.search}`;

  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? PROXY_TIMEOUT_MS;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    let bodyText: string | undefined;
    if (req.method !== "GET" && req.method !== "HEAD") {
      const rawBody = await req.text();
      if (rawBody.length > 0) {
        bodyText = rawBody;
      }
    }

    const upstream = await fetchImpl(targetUrl, {
      method: req.method,
      headers: {
        Authorization: `AdminKey ${adminKey}`,
        "Content-Type": "application/json",
      },
      body: bodyText,
      signal: controller.signal,
    });

    if (upstream.status === 204) {
      return new Response(null, { status: 204 });
    }

    const responseText = await upstream.text();
    const contentType = upstream.headers.get("content-type") || "application/json";

    return new Response(responseText, {
      status: upstream.status,
      headers: { "Content-Type": contentType },
    });
  } catch (err: unknown) {
    const isAbort =
      err instanceof Error &&
      (err.name === "AbortError" || err.message.toLowerCase().includes("abort"));
    const status = isAbort ? 504 : 502;
    return jsonResponse(
      {
        code: "NECKBOOK_UNAVAILABLE",
        message: "Falha de comunicação com o servidor",
        details: err instanceof Error ? err.message : String(err),
      },
      status,
    );
  } finally {
    clearTimeout(timer);
  }
}
