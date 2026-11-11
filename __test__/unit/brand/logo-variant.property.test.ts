import fc from "fast-check";
import {
  selectLogoVariant,
  Background,
  LogoVariant,
} from "@/lib/brand/logo-variant";

/**
 * Feature: modulo-2-rebranding-pdfs, Property 5: Escolha de variante do logotipo
 * Validates: Requirements 1.6, 1.7
 */
describe("Feature: modulo-2-rebranding-pdfs, Property 5: Escolha de variante do logotipo", () => {
  const backgroundArb = fc.constantFrom<Background>("navy", "orange", "light");
  const widthArb = fc.integer({ min: 1, max: 2000 });

  test("Property 5 (gerativa): escolha de variante respeita largura e contraste do fundo", () => {
    fc.assert(
      fc.property(widthArb, backgroundArb, (width, bg) => {
        const variant = selectLogoVariant(width, bg);

        if (width < 140) {
          // Largura < 140 px sempre devolve ícone
          if (bg === "navy") {
            expect(variant).toBe("icone-branco-sobre-azul");
          } else if (bg === "orange") {
            expect(variant).toBe("icone-azul-mono");
          } else {
            expect(variant).toBe("icone");
          }
        } else {
          // Largura >= 140 px devolve logomarca ou ícone mono sobre fundo laranja
          if (bg === "navy") {
            expect(variant).toBe("logomarca-branca");
          } else if (bg === "light") {
            expect(variant).toBe("logomarca-laranja");
          } else if (bg === "orange") {
            expect(variant).toBe("icone-azul-mono");
          }
        }
      }),
      { numRuns: 100 }
    );
  });

  test("Property 5 (função pura e determinística): chamadas repetidas produzem exatamente o mesmo resultado", () => {
    fc.assert(
      fc.property(widthArb, backgroundArb, (width, bg) => {
        const result1 = selectLogoVariant(width, bg);
        const result2 = selectLogoVariant(width, bg);
        expect(result1).toBe(result2);
      }),
      { numRuns: 100 }
    );
  });
});
