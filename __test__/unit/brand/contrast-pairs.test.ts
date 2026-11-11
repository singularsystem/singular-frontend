import { contrastRatio, passesWcagAA } from "@/lib/brand/contrast";
import { OFFICIAL_CONTRAST_PAIRS } from "@/lib/brand/contrast-pairs";

describe("Requirement 2: Acessibilidade de contraste da interface e contrast-pairs", () => {
  test("percorre contrast-pairs.ts e valida que todo par oficial atende ao mínimo especificado", () => {
    const passedPairs: string[] = [];
    const failedPairs: string[] = [];

    for (const pair of OFFICIAL_CONTRAST_PAIRS) {
      const ratio = contrastRatio(pair.textColor, pair.bgColor);

      if (pair.expectedPass) {
        expect(ratio).toBeGreaterThanOrEqual(pair.minRatio);
        expect(passesWcagAA(pair.textColor, pair.bgColor, pair.isLargeText)).toBe(true);
        passedPairs.push(`${pair.name}: ${ratio}:1 >= ${pair.minRatio}:1`);
      } else {
        // Exemplo negativo: branco sobre laranja #FF7623
        expect(ratio).toBeLessThan(pair.minRatio);
        expect(passesWcagAA(pair.textColor, pair.bgColor, false)).toBe(false);
        failedPairs.push(`${pair.name}: ${ratio}:1 < ${pair.minRatio}:1 (reprovado conforme especificação)`);
      }
    }

    expect(passedPairs.length).toBe(8);
    expect(failedPairs.length).toBe(1);
  });

  test("Requisito 2.3: texto sobre fundo laranja #FF7623 usa navy #111E42 com contraste >= 4.5:1", () => {
    const ratio = contrastRatio("#111E42", "#FF7623");
    expect(ratio).toBeGreaterThanOrEqual(4.5);
    expect(passesWcagAA("#111E42", "#FF7623")).toBe(true);
  });

  test("Requisito 2.4: link sobre fundo branco usa #C2410C com contraste >= 4.5:1", () => {
    const ratio = contrastRatio("#C2410C", "#FFFFFF");
    expect(ratio).toBeGreaterThanOrEqual(4.5);
    expect(passesWcagAA("#C2410C", "#FFFFFF")).toBe(true);
  });

  test("Requisito 2.5: branco sobre laranja #FF7623 é proibido e reprova (< 4.5:1)", () => {
    const ratio = contrastRatio("#FFFFFF", "#FF7623");
    expect(ratio).toBeLessThan(4.5);
    expect(passesWcagAA("#FFFFFF", "#FF7623")).toBe(false);
  });
});
