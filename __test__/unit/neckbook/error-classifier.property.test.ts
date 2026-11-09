import fc from "fast-check";
import type { BackendErrorResponse } from "@/source/model/entities/neckbook/GeracaoLivroTypes";
import { classificarErro } from "@/source/model/entities/neckbook/ErrorClassifier";

// Feature: neckbook-geracao-livro-professor, Property 7: Classificação de erros é total e determinística
describe("Property 7: Classificação de erros é total e determinística", () => {
  const knownStatusArb = fc.constantFrom(0, 403, 422, 429, 500, 503);
  const unknownStatusArb = fc.integer({ min: 100, max: 599 }).filter(
    (s) => ![403, 422, 429, 500, 503].includes(s),
  );
  const statusArb = fc.oneof(knownStatusArb, unknownStatusArb, fc.constant(undefined));
  const codeArb = fc.oneof(
    fc.constant("MUNICIPALITY_NOT_ENABLED"),
    fc.constant("MODULE_NOT_ACTIVE"),
    fc.constant("EXCESS_MUNICIPAL_QUOTA"),
    fc.string(),
    fc.constant(undefined),
  );

  it("sempre retorna exatamente uma ErrorView com category e message definidas (totalidade e determinismo)", () => {
    fc.assert(
      fc.property(
        statusArb,
        codeArb,
        fc.string(),
        fc.oneof(
          fc.constant(undefined),
          fc.dictionary(fc.string(), fc.string()),
          fc.array(fc.dictionary(fc.string(), fc.string())),
        ),
        (status, code, message, details) => {
          const resp: BackendErrorResponse = {
            status,
            code,
            message,
            details,
          };

          const view1 = classificarErro(resp);
          const view2 = classificarErro(resp);

          // Determinismo
          expect(view1).toEqual(view2);

          // Totalidade
          expect(view1).toBeDefined();
          expect(typeof view1.category).toBe("string");
          expect(typeof view1.message).toBe("string");
          expect(view1.message.length).toBeGreaterThan(0);
          expect([
            "MUNICIPALITY_NOT_ENABLED",
            "MODULE_NOT_ACTIVE",
            "EXCESS_MUNICIPAL_QUOTA",
            "VALIDATION",
            "SERVICE_UNAVAILABLE",
            "NETWORK",
            "UNEXPECTED",
          ]).toContain(view1.category);

          // Verificações específicas
          if (status === 0 || status === undefined) {
            expect(view1.category).toBe("NETWORK");
          } else if (status === 403 && code === "MUNICIPALITY_NOT_ENABLED") {
            expect(view1.category).toBe("MUNICIPALITY_NOT_ENABLED");
            expect(view1.message).toBe(
              "Seu município não está habilitado para geração de livros",
            );
          } else if (status === 403 && code === "MODULE_NOT_ACTIVE") {
            expect(view1.category).toBe("MODULE_NOT_ACTIVE");
            expect(view1.message).toBe(
              "O módulo de geração de livros não está contratado para o seu município",
            );
          } else if (status === 403) {
            expect(view1.category).toBe("UNEXPECTED");
          } else if (status === 429 && code === "EXCESS_MUNICIPAL_QUOTA") {
            expect(view1.category).toBe("EXCESS_MUNICIPAL_QUOTA");
          } else if (status === 422) {
            expect(view1.category).toBe("VALIDATION");
          } else if (status === 503) {
            expect(view1.category).toBe("SERVICE_UNAVAILABLE");
          } else if (status === 500) {
            expect(view1.category).toBe("UNEXPECTED");
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
