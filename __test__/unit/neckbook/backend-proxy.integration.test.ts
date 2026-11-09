/** @jest-environment node */
import { ADMIN_ROLE } from "@/source/infrastructure/common/config/roles";
import {
  DEFAULT_NECKBOOK_API_URL,
  forwardToNeckbook,
  setCallerResolverForTests,
} from "@/app/api/neckbook/admin/_lib/forward";
import {
  GET as listMunicipalitiesRoute,
  POST as createMunicipalityRoute,
} from "@/app/api/neckbook/admin/municipalities/route";
import { PATCH as updateMunicipalityRoute } from "@/app/api/neckbook/admin/municipalities/[id]/route";
import {
  GET as listApiKeysRoute,
  POST as generateApiKeyRoute,
} from "@/app/api/neckbook/admin/municipalities/[id]/api-keys/route";
import {
  PATCH as toggleApiKeyRoute,
  DELETE as revokeApiKeyRoute,
} from "@/app/api/neckbook/admin/municipalities/[id]/api-keys/[keyId]/route";

function buildFakeJwt(payload: Record<string, unknown>): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString(
    "base64url",
  );
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${header}.${body}.signature`;
}

describe("Backend_Proxy integration tests (Task 4.5)", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    setCallerResolverForTests(null);
    jest.restoreAllMocks();
  });

  afterAll(() => {
    process.env = originalEnv;
    setCallerResolverForTests(null);
  });

  it("retorna 401 sem encaminhar e sem checar/injetar Admin_Key quando chamador não está autenticado", async () => {
    delete process.env.NECKBOOK_ADMIN_KEY;
    const fetchMock = jest.fn();

    const req = new Request("http://localhost:3000/api/neckbook/admin/municipalities", {
      method: "GET",
    });

    const res = await forwardToNeckbook(req, "/v1/admin/municipalities", {
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    expect(res.status).toBe(401);
    expect(fetchMock).not.toHaveBeenCalled();
    const body = await res.json();
    expect(body.code).toBe("UNAUTHORIZED");
  });

  it("retorna 403 sem encaminhar quando chamador é autenticado mas não possui ADMIN_ROLE", async () => {
    process.env.NECKBOOK_ADMIN_KEY = "secret-admin-key";
    const fetchMock = jest.fn();
    const nonAdminJwt = buildFakeJwt({ sub: "u1", roles: ["PROFESSOR", "GESTOR"] });

    const req = new Request("http://localhost:3000/api/neckbook/admin/municipalities", {
      method: "GET",
      headers: { Authorization: `Bearer ${nonAdminJwt}` },
    });

    const res = await forwardToNeckbook(req, "/v1/admin/municipalities", {
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    expect(res.status).toBe(403);
    expect(fetchMock).not.toHaveBeenCalled();
    const body = await res.json();
    expect(body.code).toBe("FORBIDDEN");
  });

  it("retorna 500 SERVER_ADMIN_KEY_MISSING quando chamador é admin mas NECKBOOK_ADMIN_KEY está ausente", async () => {
    delete process.env.NECKBOOK_ADMIN_KEY;
    const fetchMock = jest.fn();
    const adminJwt = buildFakeJwt({ sub: "admin-1", roles: [ADMIN_ROLE] });

    const req = new Request("http://localhost:3000/api/neckbook/admin/municipalities", {
      method: "GET",
      headers: { Authorization: `Bearer ${adminJwt}` },
    });

    const res = await forwardToNeckbook(req, "/v1/admin/municipalities", {
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    expect(res.status).toBe(500);
    expect(fetchMock).not.toHaveBeenCalled();
    const body = await res.json();
    expect(body.code).toBe("SERVER_ADMIN_KEY_MISSING");
  });

  it("injeta Authorization: AdminKey <key>, usa URL base default e repassa query string no encaminhamento", async () => {
    delete process.env.NECKBOOK_API_URL;
    process.env.NECKBOOK_ADMIN_KEY = "test-server-admin-key";
    const adminJwt = buildFakeJwt({ sub: "admin-1", roles: [ADMIN_ROLE] });

    const upstreamPayload = {
      data: [
        {
          id: "m-1",
          name: "Fortaleza",
          monthly_quota: 500,
          current_usage: 120,
          remaining: 380,
          quota_renews_at: "2026-11-01T00:00:00Z",
          module_active: true,
        },
      ],
      total: 1,
    };

    const fetchMock = jest.fn().mockResolvedValue(
      new Response(JSON.stringify(upstreamPayload), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const req = new Request(
      "http://localhost:3000/api/neckbook/admin/municipalities?page=2&pageSize=15&search=Fort",
      {
        method: "GET",
        headers: { Authorization: `Bearer ${adminJwt}` },
      },
    );

    const res = await forwardToNeckbook(req, "/v1/admin/municipalities", {
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    expect(res.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [calledUrl, calledInit] = fetchMock.mock.calls[0];
    expect(calledUrl).toBe(
      `${DEFAULT_NECKBOOK_API_URL}/v1/admin/municipalities?page=2&pageSize=15&search=Fort`,
    );
    expect(calledInit.headers).toEqual({
      Authorization: "AdminKey test-server-admin-key",
      "Content-Type": "application/json",
    });

    const json = await res.json();
    expect(json).toEqual(upstreamPayload);
  });

  it.each([
    [401, { code: "INVALID_ADMIN_KEY", message: "Admin key inválida", details: null }],
    [403, { code: "CLIENT_INACTIVE", message: "Cliente inativo", details: null }],
    [404, { code: "MUNICIPALITY_NOT_FOUND", message: "Não encontrado", details: { id: "x" } }],
    [
      422,
      {
        code: "VALIDATION_ERROR",
        message: "Dados inválidos",
        details: [{ loc: ["body", "monthly_quota"], msg: "Deve ser >= 0" }],
      },
    ],
  ])("repassa fielmente status %i e Standardized_Error_Body do NeckBook", async (status, errorBody) => {
    process.env.NECKBOOK_ADMIN_KEY = "test-server-admin-key";
    const adminJwt = buildFakeJwt({ sub: "admin-1", roles: [ADMIN_ROLE] });

    const fetchMock = jest.fn().mockResolvedValue(
      new Response(JSON.stringify(errorBody), {
        status,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const req = new Request("http://localhost:3000/api/neckbook/admin/municipalities", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${adminJwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "Teste", monthly_quota: -1, module_active: true }),
    });

    const res = await forwardToNeckbook(req, "/v1/admin/municipalities", {
      fetchImpl: fetchMock as unknown as typeof fetch,
    });

    expect(res.status).toBe(status);
    const received = await res.json();
    expect(received).toEqual(errorBody);
  });

  it("route handlers encaminham corretamente para os paths do NeckBook", async () => {
    process.env.NECKBOOK_ADMIN_KEY = "test-key";
    process.env.NECKBOOK_API_URL = "https://custom.neckbook.test";
    const adminJwt = buildFakeJwt({ sub: "admin-1", roles: [ADMIN_ROLE] });

    const fetchMock = jest
      .fn()
      .mockImplementation(async (_url: string, init?: RequestInit) => {
        if (init?.method === "DELETE") {
          return new Response(null, { status: 204 });
        }
        return new Response(JSON.stringify({ ok: true }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      });
    global.fetch = fetchMock as unknown as typeof fetch;

    const headers = { Authorization: `Bearer ${adminJwt}` };

    await listMunicipalitiesRoute(
      new Request("http://localhost:3000/api/neckbook/admin/municipalities?page=1", {
        method: "GET",
        headers,
      }),
    );
    expect(fetchMock).toHaveBeenLastCalledWith(
      "https://custom.neckbook.test/v1/admin/municipalities?page=1",
      expect.objectContaining({ method: "GET" }),
    );

    await createMunicipalityRoute(
      new Request("http://localhost:3000/api/neckbook/admin/municipalities", {
        method: "POST",
        headers,
        body: JSON.stringify({ name: "Sobral", monthly_quota: 100, module_active: true }),
      }),
    );
    expect(fetchMock).toHaveBeenLastCalledWith(
      "https://custom.neckbook.test/v1/admin/municipalities",
      expect.objectContaining({ method: "POST" }),
    );

    await updateMunicipalityRoute(
      new Request("http://localhost:3000/api/neckbook/admin/municipalities/mun-123", {
        method: "PATCH",
        headers,
        body: JSON.stringify({ monthly_quota: 200 }),
      }),
      { params: { id: "mun-123" } },
    );
    expect(fetchMock).toHaveBeenLastCalledWith(
      "https://custom.neckbook.test/v1/admin/municipalities/mun-123",
      expect.objectContaining({ method: "PATCH" }),
    );

    await listApiKeysRoute(
      new Request(
        "http://localhost:3000/api/neckbook/admin/municipalities/mun-123/api-keys",
        { method: "GET", headers },
      ),
      { params: { id: "mun-123" } },
    );
    expect(fetchMock).toHaveBeenLastCalledWith(
      "https://custom.neckbook.test/v1/admin/municipalities/mun-123/api-keys",
      expect.objectContaining({ method: "GET" }),
    );

    await generateApiKeyRoute(
      new Request(
        "http://localhost:3000/api/neckbook/admin/municipalities/mun-123/api-keys",
        { method: "POST", headers, body: JSON.stringify({ description: "Chave 1" }) },
      ),
      { params: { id: "mun-123" } },
    );
    expect(fetchMock).toHaveBeenLastCalledWith(
      "https://custom.neckbook.test/v1/admin/municipalities/mun-123/api-keys",
      expect.objectContaining({ method: "POST" }),
    );

    await toggleApiKeyRoute(
      new Request(
        "http://localhost:3000/api/neckbook/admin/municipalities/mun-123/api-keys/key-99",
        { method: "PATCH", headers, body: JSON.stringify({ is_active: false }) },
      ),
      { params: { id: "mun-123", keyId: "key-99" } },
    );
    expect(fetchMock).toHaveBeenLastCalledWith(
      "https://custom.neckbook.test/v1/admin/municipalities/mun-123/api-keys/key-99",
      expect.objectContaining({ method: "PATCH" }),
    );

    const delRes = await revokeApiKeyRoute(
      new Request(
        "http://localhost:3000/api/neckbook/admin/municipalities/mun-123/api-keys/key-99",
        { method: "DELETE", headers },
      ),
      { params: { id: "mun-123", keyId: "key-99" } },
    );
    expect(delRes.status).toBe(204);
    expect(fetchMock).toHaveBeenLastCalledWith(
      "https://custom.neckbook.test/v1/admin/municipalities/mun-123/api-keys/key-99",
      expect.objectContaining({ method: "DELETE" }),
    );
  });
});
