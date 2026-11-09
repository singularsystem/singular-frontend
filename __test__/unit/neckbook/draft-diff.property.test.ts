import fc from "fast-check";
import type {
  ChapterDraft,
  DraftResponse,
} from "@/source/model/entities/neckbook/GeracaoLivroTypes";
import { calcularDiffRascunho } from "@/source/model/entities/neckbook/DraftDiff";

// Feature: neckbook-geracao-livro-professor, Property 9: Diff do rascunho classifica corretamente cada capítulo
describe("Property 9: Diff do rascunho classifica corretamente cada capítulo", () => {
  const chapterArb = (id: string, order: number) =>
    fc.record({
      id: fc.constant(id),
      order: fc.constant(order),
      title: fc.string({ minLength: 1, maxLength: 50 }),
      content: fc.string({ minLength: 1, maxLength: 200 }),
      exercises: fc.array(fc.string({ minLength: 1, maxLength: 50 }), {
        maxLength: 3,
      }),
      image_prompt: fc.string({ maxLength: 100 }),
    });

  it("classifica cada capitulo como added, removed, changed, reordered ou unchanged exatamente uma vez", () => {
    fc.assert(
      fc.property(
        chapterArb("c1", 1),
        chapterArb("c2", 2),
        chapterArb("c3", 3),
        chapterArb("c4", 4),
        chapterArb("c_added", 5),
        fc.string({ minLength: 1, maxLength: 20 }),
        (ch1, ch2, ch3, ch4, chAdded, titleDiff) => {
          const original: DraftResponse = {
            title: "Original",
            chapters: [
              { ...ch1 }, // will be unchanged
              { ...ch2 }, // will be reordered
              { ...ch3 }, // will be changed
              { ...ch4 }, // will be removed
            ],
          };

          const edited: DraftResponse = {
            title: "Edited",
            chapters: [
              { ...ch1 }, // unchanged
              { ...ch2, order: 99 }, // reordered
              { ...ch3, title: ch3.title + titleDiff }, // changed
              { ...chAdded }, // added
            ],
          };

          const diff = calcularDiffRascunho(original, edited);

          // Todo ID presente no original ou no editado aparece exatamente uma vez
          const allIds = ["c1", "c2", "c3", "c4", "c_added"];
          const diffIds = diff.map((d) => d.id);
          expect(diffIds.sort()).toEqual(allIds.sort());
          expect(new Set(diffIds).size).toBe(5);

          const getKind = (id: string) => diff.find((d) => d.id === id)?.kind;

          expect(getKind("c1")).toBe("unchanged");
          expect(getKind("c2")).toBe("reordered");
          expect(getKind("c3")).toBe("changed");
          expect(getKind("c4")).toBe("removed");
          expect(getKind("c_added")).toBe("added");
        },
      ),
      { numRuns: 100 },
    );
  });
});
