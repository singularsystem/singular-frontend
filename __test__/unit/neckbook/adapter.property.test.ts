import fc from "fast-check";
import {
  NeckbookAdminAdapter,
  computeRemaining,
} from "@/source/infrastructure/neckbook/NeckbookAdminAdapter";

describe("Property 1: Cálculo de saldo remanescente nunca negativo", () => {
  // Feature: neckbook-municipios-cotas-admin, Property 1: Cálculo de saldo remanescente nunca negativo
  it("remaining calculado é igual a max(monthlyQuota - currentUsage, 0) e nunca negativo", () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -1_000_000_000, max: 2_000_000_000 }),
        fc.integer({ min: -1_000_000_000, max: 2_000_000_000 }),
        (monthlyQuota, currentUsage) => {
          const expected = Math.max(monthlyQuota - currentUsage, 0);
          const computed = computeRemaining(monthlyQuota, currentUsage);
          expect(computed).toBe(expected);
          expect(computed).toBeGreaterThanOrEqual(0);

          const entity = NeckbookAdminAdapter.toMunicipioCotaEntity({
            id: "mun-1",
            name: "Município Teste",
            monthly_quota: monthlyQuota,
            current_usage: currentUsage,
            quota_renews_at: "2026-11-01T00:00:00Z",
            module_active: true,
          });
          expect(entity.remaining).toBe(expected);
          expect(entity.remaining).toBeGreaterThanOrEqual(0);
        },
      ),
      { numRuns: 100 },
    );
  });
});
