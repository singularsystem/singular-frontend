import fs from "fs";
import path from "path";
import fc from "fast-check";
import {
  validateExceptions,
  BrandException,
} from "@/lib/brand/legacy-scanner";

/**
 * Feature: modulo-2-rebranding-pdfs, Property 3: Toda exceção é justificada e restrita
 * Validates: Requirements 4.10
 */
describe("Feature: modulo-2-rebranding-pdfs, Property 3: Toda exceção é justificada e restrita", () => {
  test("o arquivo oficial brand-exceptions.json passa na validação sem nenhum erro", () => {
    const exceptionsPath = path.resolve(process.cwd(), "brand-exceptions.json");
    expect(fs.existsSync(exceptionsPath)).toBe(true);

    const raw = fs.readFileSync(exceptionsPath, "utf-8");
    const parsed = JSON.parse(raw);

    const errors = validateExceptions(parsed);
    expect(errors).toEqual([]);
  });

  test("Property 3 (gerativa): rejeita entradas inválidas com razão vazia, glob universal ou padrão vazio", () => {
    const invalidReasonArb = fc.constantFrom("", "   ", "\t\n");
    const universalGlobArb = fc.constantFrom("*", "**", "**/*", "");
    const validGlobArb = fc.constantFrom(
      "lib/pei-historia.ts",
      "public/data/faq.json",
      "Resources/term.txt",
      "app/relatorios/**"
    );
    const validPatternArb = fc.constantFrom("prefeitura", "ipaag", "0071ce");
    const validReasonArb = fc.constantFrom("Histórico de migração", "Conteúdo pedagógico da BNCC");

    // Gerador de exceções propositalmente defeituosas
    const invalidEntryArb = fc.oneof(
      // Razão inválida
      fc.record({
        glob: validGlobArb,
        pattern: validPatternArb,
        reason: invalidReasonArb,
      }),
      // Glob universal
      fc.record({
        glob: universalGlobArb,
        pattern: validPatternArb,
        reason: validReasonArb,
      }),
      // Padrão vazio
      fc.record({
        glob: validGlobArb,
        pattern: invalidReasonArb,
        reason: validReasonArb,
      })
    );

    fc.assert(
      fc.property(fc.array(invalidEntryArb, { minLength: 1, maxLength: 5 }), (invalidEntries) => {
        const errors = validateExceptions(invalidEntries);
        expect(errors.length).toBeGreaterThan(0);
      }),
      { numRuns: 100 }
    );
  });

  test("Property 3 (gerativa): aceita entradas válidas que cumprem todos os critérios", () => {
    const validGlobArb = fc.constantFrom(
      "lib/pei-historia.ts",
      "public/data/faq.json",
      "Resources/term.txt"
    );
    const validPatternArb = fc.constantFrom("prefeitura", "ipaag", "0071ce");
    const validReasonArb = fc.constantFrom("Justificativa válida A", "Justificativa válida B");

    const validEntryArb: fc.Arbitrary<BrandException> = fc.record({
      glob: validGlobArb,
      pattern: validPatternArb,
      reason: validReasonArb,
    });

    fc.assert(
      fc.property(fc.array(validEntryArb, { minLength: 1, maxLength: 5 }), (validEntries) => {
        const errors = validateExceptions(validEntries);
        expect(errors).toEqual([]);
      }),
      { numRuns: 100 }
    );
  });
});
