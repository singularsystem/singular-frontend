import fc from "fast-check";
import {
  TEACHER_ROLE,
  isTeacher,
} from "@/source/infrastructure/common/config/roles";

// Feature: neckbook-geracao-livro-professor, Property 1: Reconhecimento de papel de professor
describe("Property 1: Reconhecimento de papel de professor", () => {
  it("retorna false para valores que nao sao arranjo ou arranjo vazio", () => {
    expect(isTeacher(null)).toBe(false);
    expect(isTeacher(undefined)).toBe(false);
    expect(isTeacher([])).toBe(false);

    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant(null),
          fc.constant(undefined),
          fc.string(),
          fc.integer(),
          fc.boolean(),
          fc.dictionary(fc.string(), fc.string()),
        ),
        (nonArray) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          expect(isTeacher(nonArray as any)).toBe(false);
        },
      ),
      { numRuns: 100 },
    );
  });

  it("retorna false se o arranjo nao contem TEACHER", () => {
    const nonTeacherArb = fc
      .string()
      .filter((r) => r.toUpperCase() !== TEACHER_ROLE);

    fc.assert(
      fc.property(fc.array(nonTeacherArb), (roles) => {
        expect(isTeacher(roles)).toBe(false);
      }),
      { numRuns: 100 },
    );
  });

  it("retorna true se o arranjo contem pelo menos uma variacao de TEACHER", () => {
    const nonTeacherArb = fc
      .string()
      .filter((r) => r.toUpperCase() !== TEACHER_ROLE);

    const teacherVariantArb = fc
      .array(fc.boolean(), { minLength: 7, maxLength: 7 })
      .map((casing) =>
        "TEACHER"
          .split("")
          .map((ch, idx) => (casing[idx] ? ch.toLowerCase() : ch.toUpperCase()))
          .join(""),
      );

    fc.assert(
      fc.property(
        fc.array(nonTeacherArb),
        fc.array(nonTeacherArb),
        teacherVariantArb,
        (prefix, suffix, teacherRole) => {
          const roles = [...prefix, teacherRole, ...suffix];
          expect(isTeacher(roles)).toBe(true);
        },
      ),
      { numRuns: 100 },
    );
  });
});
