import fc from "fast-check";
import { extractFieldErrorsFromDetails } from "@/source/infrastructure/neckbook/NeckbookAdminErrorParser";

describe("Property 12: Extração de erros de validação por campo (422)", () => {
  // Feature: neckbook-municipios-cotas-admin, Property 12: Extração de erros de validação por campo (422)
  it("produz mapa campo -> mensagem contendo exatamente os campos violados em details e nenhum campo não violado", () => {
    const fieldNameArb = fc
      .stringMatching(/^[a-zA-Z_][a-zA-Z0-9_]{0,30}$/)
      .filter((s) => s.length > 0);
    const errorMsgArb = fc
      .string({ minLength: 1, maxLength: 100 })
      .filter((s) => s.trim().length > 0);

    fc.assert(
      fc.property(
        fc.dictionary(fieldNameArb, errorMsgArb, { minKeys: 0, maxKeys: 10 }),
        fc.array(fieldNameArb, { minLength: 0, maxLength: 5 }),
        (violatedMap, untouchedFields) => {
          const details = Object.entries(violatedMap).map(([field, msg]) => ({
            loc: ["body", field],
            msg,
            type: "value_error",
          }));

          const extracted = extractFieldErrorsFromDetails(details);

          expect(Object.keys(extracted).sort()).toEqual(
            Object.keys(violatedMap).sort(),
          );
          for (const [field, msg] of Object.entries(violatedMap)) {
            expect(extracted[field]).toBe(msg);
          }
          for (const candidate of untouchedFields) {
            if (!(candidate in violatedMap)) {
              expect(extracted[candidate]).toBeUndefined();
            }
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
