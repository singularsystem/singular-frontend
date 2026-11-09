import type {
  ChapterDiffResult,
  ChapterDraft,
  DraftResponse,
} from "./GeracaoLivroTypes";

function arraysEqual(
  a: readonly string[] = [],
  b: readonly string[] = [],
): boolean {
  if (a.length !== b.length) {
    return false;
  }
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }
  return true;
}

export function calcularDiffRascunho(
  original: DraftResponse,
  editado: DraftResponse,
): ChapterDiffResult[] {
  const origMap = new Map<string, ChapterDraft>();
  for (const ch of original?.chapters || []) {
    if (ch && typeof ch.id === "string") {
      origMap.set(ch.id, ch);
    }
  }

  const editMap = new Map<string, ChapterDraft>();
  for (const ch of editado?.chapters || []) {
    if (ch && typeof ch.id === "string") {
      editMap.set(ch.id, ch);
    }
  }

  const results: ChapterDiffResult[] = [];
  const processedIds = new Set<string>();

  for (const chEdit of editado?.chapters || []) {
    const id = chEdit?.id;
    if (!id || processedIds.has(id)) {
      continue;
    }
    processedIds.add(id);

    const chOrig = origMap.get(id);
    if (!chOrig) {
      results.push({ id, kind: "added" });
      continue;
    }

    const titleDiff = chOrig.title !== chEdit.title;
    const contentDiff = chOrig.content !== chEdit.content;
    const promptDiff = chOrig.image_prompt !== chEdit.image_prompt;
    const exercisesDiff = !arraysEqual(chOrig.exercises, chEdit.exercises);

    if (titleDiff || contentDiff || promptDiff || exercisesDiff) {
      results.push({ id, kind: "changed" });
    } else if (chOrig.order !== chEdit.order) {
      results.push({ id, kind: "reordered" });
    } else {
      results.push({ id, kind: "unchanged" });
    }
  }

  for (const chOrig of original?.chapters || []) {
    const id = chOrig?.id;
    if (!id || processedIds.has(id)) {
      continue;
    }
    processedIds.add(id);
    results.push({ id, kind: "removed" });
  }

  return results;
}
