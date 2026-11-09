import fc from "fast-check";
import {
  DEFAULT_NECKBOOK_API_URL,
  resolveBaseUrl,
} from "@/app/api/neckbook/admin/_lib/forward";

describe("Property 9: Resolução da URL base do NeckBook", () => {
  // Feature: neckbook-municipios-cotas-admin, Property 9: Resolução da URL base do NeckBook
  it("retorna DEFAULT_NECKBOOK_API_URL quando NECKBOOK_API_URL é ausente ou vazia, e o próprio valor quando preenchido", () => {
    fc.assert(
      fc.property(
        fc.option(fc.string(), { nil: undefined }),
        (rawUrl) => {
          const result = resolveBaseUrl({ NECKBOOK_API_URL: rawUrl });
          const trimmed = rawUrl?.trim() ?? "";
          if (trimmed.length === 0) {
            expect(result).toBe(DEFAULT_NECKBOOK_API_URL);
            expect(result).toBe("https://api.neckbook.com.br");
          } else {
            expect(result).toBe(trimmed);
          }
        },
      ),
      { numRuns: 100 },
    );

    fc.assert(
      fc.property(fc.webUrl(), (validUrl) => {
        expect(resolveBaseUrl({ NECKBOOK_API_URL: validUrl })).toBe(validUrl);
      }),
      { numRuns: 100 },
    );
  });
});
