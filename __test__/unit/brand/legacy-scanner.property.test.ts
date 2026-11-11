import fc from "fast-check";
import {
  scan,
  LEGACY_TERMS,
  LEGACY_HEX_COLORS,
  BrandException,
} from "@/lib/brand/legacy-scanner";

/**
 * Feature: modulo-2-rebranding-pdfs, Property 2: O detector de marca legada encontra qualquer variação
 * Validates: Requirements 3.1, 17.1, 17.2
 */
describe("Feature: modulo-2-rebranding-pdfs, Property 2: O detector de marca legada encontra qualquer variação", () => {
  // Gerador de variações de caixa para um termo
  const caseVariantArb = (term: string) => {
    return fc
      .array(fc.boolean(), { minLength: term.length, maxLength: term.length })
      .map((flags) =>
        term
          .split("")
          .map((ch, i) => (flags[i] ? ch.toUpperCase() : ch.toLowerCase()))
          .join("")
      );
  };

  const legacyTermArb = fc
    .constantFrom(...LEGACY_TERMS)
    .chain((term) => caseVariantArb(term));

  const legacyHexArb = fc
    .constantFrom(...LEGACY_HEX_COLORS)
    .chain((hex) =>
      fc.tuple(fc.boolean(), caseVariantArb(hex)).map(([hash, h]) => (hash ? `#${h}` : h))
    );

  const safePrefixArb = fc.constantFrom("const title = '", "<div>", "/* nota: ", "class = '");
  const safeSuffixArb = fc.constantFrom("' ;", "</div>", " */", "';");

  test("Property 2 (gerativa): encontra qualquer variação de caixa de termos legados inseridos em posição arbitrária", () => {
    fc.assert(
      fc.property(
        safePrefixArb,
        legacyTermArb,
        safeSuffixArb,
        fc.integer({ min: 1, max: 20 }),
        (prefix, term, suffix, paddingLines) => {
          const linesBefore = Array(paddingLines).fill("console.log('safe');");
          const targetLine = `${prefix}${term}${suffix}`;
          const fullText = [...linesBefore, targetLine].join("\n");

          const violations = scan(fullText, "app/test-component.tsx", []);

          expect(violations.length).toBeGreaterThanOrEqual(1);
          const found = violations.find((v) => v.termType === "term");
          expect(found).toBeDefined();
          expect(found!.line).toBe(paddingLines + 1);
          expect(found!.match.toLowerCase()).toContain(term.toLowerCase());
        }
      ),
      { numRuns: 100 }
    );
  });

  test("Property 2 (gerativa): encontra qualquer variação de cor da Paleta_Legada com ou sem #", () => {
    fc.assert(
      fc.property(
        safePrefixArb,
        legacyHexArb,
        safeSuffixArb,
        (prefix, hex, suffix) => {
          const text = `${prefix}${hex}${suffix}`;
          const violations = scan(text, "components/widget.tsx", []);

          expect(violations.length).toBeGreaterThanOrEqual(1);
          const found = violations.find((v) => v.termType === "color");
          expect(found).toBeDefined();
        }
      ),
      { numRuns: 100 }
    );
  });

  test("Property 2 (gerativa): exceção válida suprime a violação no arquivo e padrão correspondentes", () => {
    fc.assert(
      fc.property(legacyTermArb, (term) => {
        const text = `const info = '${term}';`;
        const filePath = "public/data/faq.json";

        const exceptions: BrandException[] = [
          {
            glob: "public/data/faq.json",
            pattern: term,
            reason: "Exceção justificada para teste",
          },
        ];

        const violations = scan(text, filePath, exceptions);
        expect(violations.length).toBe(0);
      }),
      { numRuns: 100 }
    );
  });
});
