import fc from "fast-check";
import {
  replaceLegacyColors,
  LEGACY_HEX,
  isLegacyHex,
} from "@/lib/brand/legacy-colors";

/**
 * Feature: modulo-2-rebranding-pdfs, Property 1: Substituição de cores legadas preserva o resto da classe
 * Validates: Requirements 1.4, 1.5, 1.11, 16.6
 */
describe("Feature: modulo-2-rebranding-pdfs, Property 1: Substituição de cores legadas preserva o resto da classe", () => {
  const variantsArb = fc.constantFrom(
    "",
    "hover:",
    "dark:",
    "md:",
    "focus:",
    "dark:hover:"
  );

  const prefixArb = fc.constantFrom(
    "bg",
    "text",
    "border",
    "from",
    "via",
    "to",
    "ring",
    "outline"
  );

  const opacityArb = fc.constantFrom("", "/50", "/80", "/100", "/20");

  const legacyHexArb = fc.constantFrom(...LEGACY_HEX).chain((hex) => {
    // Permutação de maiúsculas/minúsculas
    return fc.constantFrom(
      hex.toLowerCase(),
      hex.toUpperCase(),
      hex.slice(0, 4).toUpperCase() + hex.slice(4).toLowerCase()
    );
  });

  const semanticClassArb = fc.constantFrom(
    "text-blue-600",
    "text-amber-600",
    "text-red-600",
    "bg-green-500",
    "border-gray-200",
    "p-4",
    "flex",
    "items-center",
    "rounded-xl",
    "shadow-md"
  );

  test("Property 1 (gerativa): saída não contém hex legado, preserva variantes, prefixos e opacidades, mantém cores semânticas e é idempotente", () => {
    fc.assert(
      fc.property(
        variantsArb,
        prefixArb,
        legacyHexArb,
        opacityArb,
        semanticClassArb,
        (variants, prefix, hex, opacity, semanticClass) => {
          // Criar classe Tailwind com hex legado
          const legacyClass = `${variants}${prefix}-[${hex}]${opacity}`;
          const input = `${semanticClass} ${legacyClass} font-semibold`;

          const { output } = replaceLegacyColors(input);

          // 1. Saída não deve conter nenhum hex da Paleta_Legada (com # ou [#...])
          for (const lHex of LEGACY_HEX) {
            const rawHex = lHex.replace(/^#/, "");
            const regex = new RegExp(`\\[#?${rawHex}\\]`, "i");
            expect(output).not.toMatch(regex);
          }

          // 2. Cores semânticas e classes neutras permanecem idênticas
          expect(output).toContain(semanticClass);
          expect(output).toContain("font-semibold");

          // 3. Variantes e opacidades são preservadas
          if (variants) {
            expect(output).toContain(variants);
          }
          if (opacity) {
            expect(output).toContain(opacity);
          }

          // 4. Idempotência: f(f(x)) === f(x)
          const secondRun = replaceLegacyColors(output);
          expect(secondRun.output).toBe(output);
        }
      ),
      { numRuns: 100 }
    );
  });

  test("Property 1 (gradientes e estilos inline): converte gradientes legados e é idempotente", () => {
    const inlineCssArb = fc.constantFrom(
      "background: linear-gradient(45deg, #111C4E 11%, #0071CE);",
      "background-image: linear-gradient(to right, #0071CE, #19D3C5);",
      "color: #111C4E;"
    );

    fc.assert(
      fc.property(inlineCssArb, (css) => {
        const { output } = replaceLegacyColors(css);

        // Não contém hex legados
        for (const lHex of LEGACY_HEX) {
          expect(output.toLowerCase()).not.toContain(lHex.toLowerCase());
        }

        // Idempotência
        const secondRun = replaceLegacyColors(output);
        expect(secondRun.output).toBe(output);
      }),
      { numRuns: 100 }
    );
  });
});
