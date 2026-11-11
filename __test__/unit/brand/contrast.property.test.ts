import fc from "fast-check";
import { contrastRatio, passesWcagAA } from "@/lib/brand/contrast";
import { OFFICIAL_CONTRAST_PAIRS } from "@/lib/brand/contrast-pairs";

/**
 * Feature: modulo-2-rebranding-pdfs, Property 4: Pares de cor atendem ao contraste mínimo
 * Validates: Requirements 2.1, 2.2, 2.5, 17.7
 */
describe("Feature: modulo-2-rebranding-pdfs, Property 4: Pares de cor atendem ao contraste mínimo", () => {
  test("todos os pares oficiais atendem ao mínimo e exemplo negativo reprova", () => {
    for (const pair of OFFICIAL_CONTRAST_PAIRS) {
      const ratio = contrastRatio(pair.textColor, pair.bgColor);

      if (pair.expectedPass) {
        expect(ratio).toBeGreaterThanOrEqual(pair.minRatio);
        expect(passesWcagAA(pair.textColor, pair.bgColor, pair.isLargeText)).toBe(true);
      } else {
        // Exemplo negativo: branco sobre #FF7623 deve reprovar (< 4.5)
        expect(ratio).toBeLessThan(pair.minRatio);
        expect(passesWcagAA(pair.textColor, pair.bgColor, false)).toBe(false);
      }
    }
  });

  const hexColorArb = fc
    .tuple(
      fc.integer({ min: 0, max: 255 }),
      fc.integer({ min: 0, max: 255 }),
      fc.integer({ min: 0, max: 255 })
    )
    .map(([r, g, b]) =>
      `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
    );

  test("Property 4 (gerativa): contrastRatio é estritamente simétrica e limitada entre 1 e 21 para quaisquer cores", () => {
    fc.assert(
      fc.property(hexColorArb, hexColorArb, (colorA, colorB) => {
        const ratioAB = contrastRatio(colorA, colorB);
        const ratioBA = contrastRatio(colorB, colorA);

        // Simétrica
        expect(ratioAB).toBe(ratioBA);

        // Intervalo WCAG [1, 21]
        expect(ratioAB).toBeGreaterThanOrEqual(1.0);
        expect(ratioAB).toBeLessThanOrEqual(21.0);
      }),
      { numRuns: 100 }
    );
  });

  test("Property 4 (gerativa): cor contra si mesma sempre resulta em contraste 1.0", () => {
    fc.assert(
      fc.property(hexColorArb, (color) => {
        const ratio = contrastRatio(color, color);
        expect(ratio).toBe(1.0);
      }),
      { numRuns: 100 }
    );
  });
});
