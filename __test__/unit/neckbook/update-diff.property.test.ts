import fc from "fast-check";
import {
  MunicipiosCotasViewModel,
  buildUpdateMunicipioPatch,
} from "@/source/view-model/neckbook/MunicipiosCotasViewModel";
import type { INeckbookAdminRepository } from "@/source/model/repositories/neckbook/INeckbookAdminRepository";

describe("Property 5: Diff de atualização contém somente campos alterados", () => {
  // Feature: neckbook-municipios-cotas-admin, Property 5: Diff de atualização contém somente campos alterados
  it("gera UpdateMunicipioDTO contendo exatamente os campos cujo valor mudou e bloqueia envio quando nenhum valor mudou", async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 0, max: 999_999_999 }),
        fc.boolean(),
        fc.integer({ min: 0, max: 999_999_999 }),
        fc.boolean(),
        async (origQuota, origActive, newQuota, newActive) => {
          const patch = buildUpdateMunicipioPatch(
            { monthlyQuota: origQuota, moduleActive: origActive },
            { monthlyQuota: newQuota, moduleActive: newActive },
          );

          if (newQuota !== origQuota) {
            expect(patch.monthlyQuota).toBe(newQuota);
          } else {
            expect("monthlyQuota" in patch).toBe(false);
          }

          if (newActive !== origActive) {
            expect(patch.moduleActive).toBe(newActive);
          } else {
            expect("moduleActive" in patch).toBe(false);
          }

          if (newQuota === origQuota && newActive === origActive) {
            expect(Object.keys(patch)).toHaveLength(0);
            const updateSpy = jest.fn();
            const vm = new MunicipiosCotasViewModel({
              updateMunicipio: updateSpy,
            } as unknown as INeckbookAdminRepository);
            const ok = await vm.updateMunicipio("mun-1", patch);
            expect(ok).toBe(false);
            expect(updateSpy).not.toHaveBeenCalled();
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
