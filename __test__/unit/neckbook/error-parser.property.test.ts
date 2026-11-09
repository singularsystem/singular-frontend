import fc from "fast-check";
import {
  deriveErrorDisplayMessage,
  parseNeckbookError,
} from "@/source/infrastructure/neckbook/NeckbookAdminErrorParser";

describe("Property 10: Propagação fiel do corpo de erro padronizado", () => {
  // Feature: neckbook-municipios-cotas-admin, Property 10: Propagação fiel do corpo de erro padronizado
  it("preserva status, code, message e details de qualquer Standardized_Error_Body e deriva mensagem exibível de code e message", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 400, max: 599 }),
        fc.string({ minLength: 1, maxLength: 60 }).filter((s) => s.trim().length > 0),
        fc.string({ minLength: 1, maxLength: 200 }).filter((s) => s.trim().length > 0),
        fc.anything(),
        (status, code, message, details) => {
          const rawBody = { code, message, details };
          const err = parseNeckbookError(status, rawBody);

          expect(err.status).toBe(status);
          expect(err.code).toBe(code);
          expect(err.message).toBe(message);
          expect(err.details).toEqual(details);

          const display = deriveErrorDisplayMessage({ code: err.code, message: err.message });
          expect(display).toContain(code.trim());
          expect(display).toContain(message.trim());
        },
      ),
      { numRuns: 100 },
    );
  });
});
