import fc from "fast-check";
import {
  MAX_MONTHLY_QUOTA,
  MAX_MUNICIPIO_NAME_LENGTH,
  validateCreateMunicipio,
} from "@/source/view-model/neckbook/MunicipiosCotasViewModel";

describe("Property 4: Validação do formulário de criação de município", () => {
  // Feature: neckbook-municipios-cotas-admin, Property 4: Validação do formulário de criação de município
  it("aceita sse name tem comprimento 1..120 e monthlyQuota é inteiro em [0, 999999999]; caso contrário rejeita associando mensagem ao campo inválido", () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(""),
          fc.string({ minLength: 1, maxLength: MAX_MUNICIPIO_NAME_LENGTH }),
          fc.string({ minLength: MAX_MUNICIPIO_NAME_LENGTH + 1, maxLength: 200 }),
        ),
        fc.oneof(
          fc.integer({ min: 0, max: MAX_MONTHLY_QUOTA }),
          fc.integer({ min: -1_000_000, max: -1 }),
          fc.integer({ min: MAX_MONTHLY_QUOTA + 1, max: MAX_MONTHLY_QUOTA + 1_000_000 }),
          fc.double({ min: -1000, max: 1000, noInteger: true, noNaN: true }),
        ),
        (name, monthlyQuota) => {
          const isNameValid =
            name.length >= 1 && name.length <= MAX_MUNICIPIO_NAME_LENGTH;
          const isQuotaValid =
            Number.isInteger(monthlyQuota) &&
            monthlyQuota >= 0 &&
            monthlyQuota <= MAX_MONTHLY_QUOTA;

          const result = validateCreateMunicipio({ name, monthlyQuota });

          expect(result.valid).toBe(isNameValid && isQuotaValid);

          if (!isNameValid) {
            expect(typeof result.fieldErrors.name).toBe("string");
            expect(result.fieldErrors.name.length).toBeGreaterThan(0);
          } else {
            expect(result.fieldErrors.name).toBeUndefined();
          }

          if (!isQuotaValid) {
            expect(typeof result.fieldErrors.monthlyQuota).toBe("string");
            expect(result.fieldErrors.monthlyQuota.length).toBeGreaterThan(0);
          } else {
            expect(result.fieldErrors.monthlyQuota).toBeUndefined();
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
