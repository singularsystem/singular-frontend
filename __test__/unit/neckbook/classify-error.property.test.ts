import fc from "fast-check";
import { NeckbookAdminError } from "@/source/model/entities/neckbook/NeckbookEntity";
import { classifyError } from "@/source/view-model/neckbook/MunicipiosCotasViewModel";

describe("Property 11: Classificação de status/erro em categoria de UI", () => {
  // Feature: neckbook-municipios-cotas-admin, Property 11: Classificação de status/erro em categoria de UI
  it("mapeia 401/403 -> auth, 404 -> not_found, 422 -> validation, rede/timeout -> network, SERVER_ADMIN_KEY_MISSING -> server_config e demais -> generic", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 400, max: 599 }),
        fc
          .string({ minLength: 1, maxLength: 40 })
          .filter(
            (c) =>
              ![
                "SERVER_ADMIN_KEY_MISSING",
                "NETWORK_ERROR",
                "REQUEST_TIMEOUT",
                "NECKBOOK_UNAVAILABLE",
              ].includes(c),
          ),
        fc.string({ minLength: 1, maxLength: 100 }),
        (status, code, message) => {
          const err = new NeckbookAdminError(status, code, message);
          const view = classifyError(err);

          if (status === 401 || status === 403) {
            expect(view.kind).toBe("auth");
          } else if (status === 404) {
            expect(view.kind).toBe("not_found");
          } else if (status === 422) {
            expect(view.kind).toBe("validation");
          } else if (status === 502 || status === 504) {
            expect(view.kind).toBe("network");
          } else {
            expect(view.kind).toBe("generic");
          }
        },
      ),
      { numRuns: 100 },
    );

    // SERVER_ADMIN_KEY_MISSING -> server_config
    const configErr = new NeckbookAdminError(
      500,
      "SERVER_ADMIN_KEY_MISSING",
      "Admin key ausente",
    );
    expect(classifyError(configErr).kind).toBe("server_config");

    // Rede e timeout -> network
    const timeoutErr = new NeckbookAdminError(504, "REQUEST_TIMEOUT", "Timeout");
    expect(classifyError(timeoutErr).kind).toBe("network");

    const abortErr = new Error("The operation was aborted");
    abortErr.name = "AbortError";
    expect(classifyError(abortErr).kind).toBe("network");
  });
});
