import fc from "fast-check";
import {
  DISCIPLINAS,
  ESTILO_VISUAL_PADRAO,
  type Disciplina,
  type FormularioGeracao,
  type ModoGeracao,
} from "@/source/model/entities/neckbook/GeracaoLivroTypes";
import { montarPayload } from "@/source/model/entities/neckbook/FormValidator";

// Feature: neckbook-geracao-livro-professor, Property 4: Montagem do payload reflete o formulário normalizado e nunca expõe dados do aluno
describe("Property 4: Montagem do payload reflete o formulário normalizado e nunca expõe dados do aluno", () => {
  const validDisciplinaArb = fc.constantFrom<Disciplina>(...DISCIPLINAS);
  const validModeArb = fc.constantFrom<ModoGeracao>("full_auto", "draft_first");
  const validStudentIdArb = fc.string({ minLength: 1 }).filter((s) => s.trim() !== "");
  const numCapitulosArb = fc.oneof(
    fc.integer({ min: 1, max: 10 }),
    fc.integer({ min: 1, max: 10 }).map(String),
  );
  const exerciciosArb = fc.oneof(
    fc.integer({ min: 1, max: 3 }),
    fc.integer({ min: 1, max: 3 }).map(String),
  );
  const estiloVisualArb = fc.string({ maxLength: 100 });
  const interessesArb = fc.array(fc.string({ minLength: 1, maxLength: 100 }), {
    maxLength: 10,
  });

  it("monta o payload correto e nunca inclui student_profile nem reports", () => {
    fc.assert(
      fc.property(
        validStudentIdArb,
        validDisciplinaArb,
        validModeArb,
        numCapitulosArb,
        exerciciosArb,
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

          const payload = montarPayload(form);

          expect(payload.studentId).toBe(studentId.trim());
          expect(payload.disciplina).toBe(disciplina);
          expect(payload.mode).toBe(mode);
          expect(payload.num_capitulos).toBe(Number(numCapitulos));
          expect(payload.exercicios_por_capitulo).toBe(Number(exerciciosPorCapitulo));
          expect(payload.suporte_caa).toBe(suporteCaa);
          expect(payload.interesses).toEqual(interesses);

          const expectedEstilo =
            estiloVisual.trim() === "" ? ESTILO_VISUAL_PADRAO : estiloVisual.trim();
          expect(payload.estilo_visual).toBe(expectedEstilo);

          // Inviolável: ausência de student_profile e reports
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          expect((payload as any).student_profile).toBeUndefined();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          expect((payload as any).reports).toBeUndefined();
          expect(Object.keys(payload)).not.toContain("student_profile");
          expect(Object.keys(payload)).not.toContain("reports");
        },
      ),
      { numRuns: 100 },
    );
  });
});
