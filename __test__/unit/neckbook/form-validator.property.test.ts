import fc from "fast-check";
import {
  DISCIPLINAS,
  type Disciplina,
  type FormularioGeracao,
  type ModoGeracao,
} from "@/source/model/entities/neckbook/GeracaoLivroTypes";
import {
  addInteresse,
  validarFormulario,
} from "@/source/model/entities/neckbook/FormValidator";

// Feature: neckbook-geracao-livro-professor, Property 2: Validade do formulário reflete exatamente campos obrigatórios e limites
describe("Property 2: Validade do formulário reflete exatamente campos obrigatórios e limites", () => {
  const validDisciplinaArb = fc.constantFrom<Disciplina>(...DISCIPLINAS);
  const validModeArb = fc.constantFrom<ModoGeracao>("full_auto", "draft_first");
  const validStudentIdArb = fc.string({ minLength: 1 }).filter((s) => s.trim() !== "");
  const validNumCapitulosArb = fc.integer({ min: 1, max: 10 });
  const validExerciciosArb = fc.integer({ min: 1, max: 3 });
  const estiloVisualArb = fc.string({ maxLength: 100 });
  const interessesArb = fc.array(fc.string({ maxLength: 100 }), { maxLength: 10 });

  it("retorna valid === true quando todos os campos obrigatorios e limites estao corretos", () => {
    fc.assert(
      fc.property(
        validStudentIdArb,
        validDisciplinaArb,
        validModeArb,
        validNumCapitulosArb,
        validExerciciosArb,
        estiloVisualArb,
        interessesArb,
        fc.boolean(),
        (
          studentId,
          disciplina,
          mode,
          numCapitulos,
          exerciciosPorCapitulo,
          estiloVisual,
          interesses,
          suporteCaa,
        ) => {
          const form: FormularioGeracao = {
            studentId,
            disciplina,
            mode,
            numCapitulos,
            exerciciosPorCapitulo,
            estiloVisual,
            interesses,
            suporteCaa,
          };

          const res = validarFormulario(form);
          expect(res.valid).toBe(true);
          expect(Object.keys(res.fieldErrors)).toHaveLength(0);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("invalida studentId quando vazio, nulo ou espacos", () => {
    fc.assert(
      fc.property(
        fc.oneof(fc.constant(null), fc.constant(""), fc.constant("   ")),
        validDisciplinaArb,
        validModeArb,
        validNumCapitulosArb,
        validExerciciosArb,
        (badStudentId, disciplina, mode, numCapitulos, exerciciosPorCapitulo) => {
          const form: FormularioGeracao = {
            studentId: badStudentId,
            disciplina,
            mode,
            numCapitulos,
            exerciciosPorCapitulo,
            estiloVisual: "aquarela_infantil",
            interesses: [],
            suporteCaa: false,
          };
          const res = validarFormulario(form);
          expect(res.valid).toBe(false);
          expect(res.fieldErrors.studentId).toBe("Selecione um aluno");
        },
      ),
      { numRuns: 100 },
    );
  });

  it("invalida disciplina quando ausente ou nao pertencente aos 7 canonicos", () => {
    const invalidDisciplinaArb = fc
      .string()
      .filter((d) => !DISCIPLINAS.includes(d as Disciplina));

    fc.assert(
      fc.property(
        validStudentIdArb,
        invalidDisciplinaArb,
        validModeArb,
        validNumCapitulosArb,
        validExerciciosArb,
        (studentId, badDisciplina, mode, numCapitulos, exerciciosPorCapitulo) => {
          const form: FormularioGeracao = {
            studentId,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            disciplina: badDisciplina as any,
            mode,
            numCapitulos,
            exerciciosPorCapitulo,
            estiloVisual: "aquarela_infantil",
            interesses: [],
            suporteCaa: false,
          };
          const res = validarFormulario(form);
          expect(res.valid).toBe(false);
          expect(res.fieldErrors.disciplina).toBe("Selecione uma disciplina");
        },
      ),
      { numRuns: 100 },
    );
  });

  it("invalida mode quando nao for full_auto nem draft_first", () => {
    const invalidModeArb = fc
      .string()
      .filter((m) => m !== "full_auto" && m !== "draft_first");

    fc.assert(
      fc.property(
        validStudentIdArb,
        validDisciplinaArb,
        invalidModeArb,
        validNumCapitulosArb,
        validExerciciosArb,
        (studentId, disciplina, badMode, numCapitulos, exerciciosPorCapitulo) => {
          const form: FormularioGeracao = {
            studentId,
            disciplina,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            mode: badMode as any,
            numCapitulos,
            exerciciosPorCapitulo,
            estiloVisual: "aquarela_infantil",
            interesses: [],
            suporteCaa: false,
          };
          const res = validarFormulario(form);
          expect(res.valid).toBe(false);
          expect(res.fieldErrors.mode).toBe("Selecione o modo de geração");
        },
      ),
      { numRuns: 100 },
    );
  });

  it("invalida numCapitulos fora de [1,10], floats, string vazia e NaN", () => {
    const badNumCapitulosArb = fc.oneof(
      fc.integer({ min: -100, max: 0 }),
      fc.integer({ min: 11, max: 200 }),
      fc.double().filter((d) => !Number.isInteger(d)),
      fc.constant(""),
      fc.constant("   "),
      fc.constant("abc"),
      fc.constant(NaN),
    );

    fc.assert(
      fc.property(
        validStudentIdArb,
        validDisciplinaArb,
        validModeArb,
        badNumCapitulosArb,
        validExerciciosArb,
        (studentId, disciplina, mode, badNum, exerciciosPorCapitulo) => {
          const form: FormularioGeracao = {
            studentId,
            disciplina,
            mode,
            numCapitulos: badNum,
            exerciciosPorCapitulo,
            estiloVisual: "aquarela_infantil",
            interesses: [],
            suporteCaa: false,
          };
          const res = validarFormulario(form);
          expect(res.valid).toBe(false);
          expect(res.fieldErrors.numCapitulos).toBe(
            "A quantidade de capítulos deve estar entre 1 e 10",
          );
        },
      ),
      { numRuns: 100 },
    );
  });

  it("invalida exerciciosPorCapitulo fora de [1,3], floats, string vazia e NaN", () => {
    const badExerciciosArb = fc.oneof(
      fc.integer({ min: -100, max: 0 }),
      fc.integer({ min: 4, max: 100 }),
      fc.double().filter((d) => !Number.isInteger(d)),
      fc.constant(""),
      fc.constant("   "),
      fc.constant("xyz"),
      fc.constant(NaN),
    );

    fc.assert(
      fc.property(
        validStudentIdArb,
        validDisciplinaArb,
        validModeArb,
        validNumCapitulosArb,
        badExerciciosArb,
        (studentId, disciplina, mode, numCapitulos, badEx) => {
          const form: FormularioGeracao = {
            studentId,
            disciplina,
            mode,
            numCapitulos,
            exerciciosPorCapitulo: badEx,
            estiloVisual: "aquarela_infantil",
            interesses: [],
            suporteCaa: false,
          };
          const res = validarFormulario(form);
          expect(res.valid).toBe(false);
          expect(res.fieldErrors.exerciciosPorCapitulo).toBe(
            "O número de exercícios por capítulo deve estar entre 1 e 3",
          );
        },
      ),
      { numRuns: 100 },
    );
  });
});

// Feature: neckbook-geracao-livro-professor, Property 3: Adição de interesse preserva invariantes da lista
describe("Property 3: Adição de interesse preserva invariantes da lista", () => {
  it("preserva invariantes de tamanho (max 10 itens) e comprimento (max 100 chars)", () => {
    const existingListArb = fc.array(
      fc
        .string({ minLength: 1, maxLength: 100 })
        .map((s) => s.trim())
        .filter((s) => s.length > 0 && s.length <= 100),
      { maxLength: 12 },
    );
    const candidateArb = fc.string();

    fc.assert(
      fc.property(existingListArb, candidateArb, (lista, candidato) => {
        const trimmed = candidato.trim();
        const result = addInteresse(lista, candidato);

        // Invariantes absolutas
        expect(result.length).toBeLessThanOrEqual(10);
        for (const item of result) {
          expect(item.length).toBeLessThanOrEqual(100);
          expect(item.trim()).toBe(item);
          expect(item).not.toBe("");
        }

        // Casos de rejeição
        if (trimmed === "") {
          expect(result).toEqual(lista);
        } else if (trimmed.length > 100 || lista.length >= 10) {
          expect(result).toEqual(lista);
        } else {
          expect(result).toEqual([...lista, trimmed]);
        }
      }),
      { numRuns: 100 },
    );
  });
});
