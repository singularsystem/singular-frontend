import fc from "fast-check";
import type { StatusJob } from "@/source/model/entities/neckbook/GeracaoLivroTypes";
import { calcularProgresso } from "@/source/model/entities/neckbook/ProgressBar";

// Feature: neckbook-geracao-livro-professor, Property 6: Valor da barra de progresso é sempre inteiro entre 0 e 100
describe("Property 6: Valor da barra de progresso é sempre inteiro entre 0 e 100", () => {
  const statusArb = fc.constantFrom<StatusJob>(
    "QUEUED",
    "GENERATING_TEXT",
    "AWAITING_TEACHER_REVIEW",
    "GENERATING_IMAGES",
    "RENDERING_PDF",
    "COMPLETED",
    "FAILED",
  );

  const rawProgressArb = fc.oneof(
    fc.integer({ min: -500, max: 500 }),
    fc.double({ min: -500, max: 500, noNaN: false }),
    fc.constant(Infinity),
    fc.constant(-Infinity),
    fc.constant(NaN),
  );

  it("sempre retorna um inteiro no intervalo [0, 100]", () => {
    fc.assert(
      fc.property(statusArb, rawProgressArb, (status, rawProgress) => {
        const result = calcularProgresso(status, rawProgress);

        expect(Number.isInteger(result)).toBe(true);
        expect(result).toBeGreaterThanOrEqual(0);
        expect(result).toBeLessThanOrEqual(100);

        if (typeof rawProgress === "number" && !Number.isNaN(rawProgress)) {
          if (rawProgress <= 0) {
            expect(result).toBe(0);
          } else if (rawProgress >= 100) {
            expect(result).toBe(100);
          }
        } else {
          expect(result).toBe(0);
        }
      }),
      { numRuns: 100 },
    );
  });
});
