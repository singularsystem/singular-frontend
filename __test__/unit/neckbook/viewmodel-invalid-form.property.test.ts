import fc from "fast-check";
import type {
  Disciplina,
  FormularioGeracao,
  ModoGeracao,
} from "@/source/model/entities/neckbook/GeracaoLivroTypes";
import { DISCIPLINAS } from "@/source/model/entities/neckbook/GeracaoLivroTypes";
import { GeracaoLivroViewModel } from "@/source/view-model/neckbook/GeracaoLivroViewModel";
import type { INeckbookBooksRepository } from "@/source/model/repositories/neckbook/INeckbookBooksRepository";

// Feature: neckbook-geracao-livro-professor, Property 5: Formulário inválido não dispara requisição
describe("Property 5: Formulário inválido não dispara requisição", () => {
  const badStudentIdArb = fc.oneof(
    fc.constant(null),
    fc.constant(""),
    fc.constant("   "),
  );

  const badDisciplinaArb = fc.oneof(
    fc.constant(null),
    fc.constant(""),
    fc.string().filter((d) => !DISCIPLINAS.includes(d as Disciplina)),
  );

  const badModeArb = fc.oneof(
    fc.constant(null),
    fc.string().filter((m) => m !== "full_auto" && m !== "draft_first"),
  );

  const badNumCapitulosArb = fc.oneof(
    fc.integer({ min: -50, max: 0 }),
    fc.integer({ min: 11, max: 100 }),
    fc.constant(""),
    fc.constant(NaN),
  );

  const badExerciciosArb = fc.oneof(
    fc.integer({ min: -50, max: 0 }),
    fc.integer({ min: 4, max: 100 }),
    fc.constant(""),
    fc.constant(NaN),
  );

  const validStudentId = "student-valid-1";
  const validDisciplina = DISCIPLINAS[0];
  const validMode: ModoGeracao = "full_auto";
  const validNum = 4;
  const validEx = 1;

  // Arbitrary que garante pelo menos um campo inválido
  const invalidFormArb = fc.oneof(
    // 1. Aluno inválido
    badStudentIdArb.map(
      (studentId): FormularioGeracao => ({
        studentId,
        disciplina: validDisciplina,
        mode: validMode,
        numCapitulos: validNum,
        exerciciosPorCapitulo: validEx,
        estiloVisual: "aquarela_infantil",
        interesses: [],
        suporteCaa: false,
      }),
    ),
    // 2. Disciplina inválida
    badDisciplinaArb.map(
      (disciplina): FormularioGeracao => ({
        studentId: validStudentId,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        disciplina: disciplina as any,
        mode: validMode,
        numCapitulos: validNum,
        exerciciosPorCapitulo: validEx,
        estiloVisual: "aquarela_infantil",
        interesses: [],
        suporteCaa: false,
      }),
    ),
    // 3. Modo inválido
    badModeArb.map(
      (mode): FormularioGeracao => ({
        studentId: validStudentId,
        disciplina: validDisciplina,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mode: mode as any,
        numCapitulos: validNum,
        exerciciosPorCapitulo: validEx,
        estiloVisual: "aquarela_infantil",
        interesses: [],
        suporteCaa: false,
      }),
    ),
    // 4. Num capítulos inválido
    badNumCapitulosArb.map(
      (numCapitulos): FormularioGeracao => ({
        studentId: validStudentId,
        disciplina: validDisciplina,
        mode: validMode,
        numCapitulos,
        exerciciosPorCapitulo: validEx,
        estiloVisual: "aquarela_infantil",
        interesses: [],
        suporteCaa: false,
      }),
    ),
    // 5. Exercícios inválidos
    badExerciciosArb.map(
      (exerciciosPorCapitulo): FormularioGeracao => ({
        studentId: validStudentId,
        disciplina: validDisciplina,
        mode: validMode,
        numCapitulos: validNum,
        exerciciosPorCapitulo,
        estiloVisual: "aquarela_infantil",
        interesses: [],
        suporteCaa: false,
      }),
    ),
  );

  it("quando o formulário é inválido, gerar() nunca chama o repositório e expõe fieldErrors", async () => {
    await fc.assert(
      fc.asyncProperty(invalidFormArb, async (invalidForm) => {
        let generateCalled = false;
        const mockRepo: INeckbookBooksRepository = {
          generate: jest.fn(async () => {
            generateCalled = true;
            return { jobId: "j-1", bookId: "b-1" };
          }),
          getJobStatus: jest.fn(),
          getDraft: jest.fn(),
          saveDraft: jest.fn(),
          approve: jest.fn(),
        };

        const vm = new GeracaoLivroViewModel(mockRepo);
        vm.updateState({ form: invalidForm });

        await vm.gerar();

        const state = vm.getState();
        expect(generateCalled).toBe(false);
        expect(mockRepo.generate).not.toHaveBeenCalled();
        expect(state.jobId).toBeNull();
        expect(state.isGenerating).toBe(false);
        expect(Object.keys(state.fieldErrors).length).toBeGreaterThan(0);
      }),
      { numRuns: 100 },
    );
  });
});
