import fc from "fast-check";
import {
  classificarErro,
  formatarDataRenovacao,
} from "@/source/model/entities/neckbook/ErrorClassifier";

// Feature: neckbook-geracao-livro-professor, Property 8: Mensagem de cota formata a data de renovação em DD/MM/AAAA
describe("Property 8: Mensagem de cota formata a data de renovação em DD/MM/AAAA", () => {
  const validYearArb = fc.integer({ min: 2024, max: 2035 });
  const validMonthArb = fc.integer({ min: 1, max: 12 });
  const validDayArb = fc.integer({ min: 1, max: 28 });

  it("formata datas validas no padrao DD/MM/AAAA e inclui na mensagem de cota", () => {
    fc.assert(
      fc.property(validYearArb, validMonthArb, validDayArb, (year, month, day) => {
        const dd = String(day).padStart(2, "0");
        const mm = String(month).padStart(2, "0");
        const yyyy = String(year);
        const isoString = `${yyyy}-${mm}-${dd}T00:00:00Z`;

        const formatted = formatarDataRenovacao(isoString);
        expect(formatted).toBe(`${dd}/${mm}/${yyyy}`);

        const view = classificarErro({
          status: 429,
          code: "EXCESS_MUNICIPAL_QUOTA",
          details: { renewal_date: isoString },
        });

        expect(view.category).toBe("EXCESS_MUNICIPAL_QUOTA");
        expect(view.message).toBe(
          `A cota mensal de geração de livros do seu município foi atingida. A cota será renovada em ${dd}/${mm}/${yyyy}`,
        );
      }),
      { numRuns: 100 },
    );
  });

  it("exibe mensagem base sem data quando renewal_date estiver ausente ou vazio", () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(undefined),
          fc.constant(null),
          fc.constant(""),
          fc.constant("   "),
        ),
        (emptyDate) => {
          const view = classificarErro({
            status: 429,
            code: "EXCESS_MUNICIPAL_QUOTA",
            details: emptyDate !== undefined ? { renewal_date: emptyDate } : undefined,
          });

          expect(view.category).toBe("EXCESS_MUNICIPAL_QUOTA");
          expect(view.message).toBe(
            "A cota mensal de geração de livros do seu município foi atingida",
          );
        },
      ),
      { numRuns: 100 },
    );
  });
});
