import {
  DISCIPLINAS,
  ESTILO_VISUAL_PADRAO,
  EXERCICIOS_POR_CAPITULO_PADRAO,
  MAX_EXERCICIOS,
  MAX_INTERESSE_LEN,
  MAX_INTERESSES,
  MAX_NUM_CAPITULOS,
  MIN_EXERCICIOS,
  MIN_NUM_CAPITULOS,
  NUM_CAPITULOS_PADRAO,
  type CampoFormulario,
  type Disciplina,
  type FormularioGeracao,
  type GenerateBookPayload,
  type ModoGeracao,
  type ResultadoValidacao,
} from "./GeracaoLivroTypes";

function parseStrictInteger(value: number | string | null | undefined): number | null {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value === "number") {
    if (Number.isFinite(value) && Number.isInteger(value)) {
      return value;
    }
    return null;
  }
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed === "" || !/^-?\d+$/.test(trimmed)) {
      return null;
    }
    const parsed = Number(trimmed);
    return Number.isSafeInteger(parsed) ? parsed : null;
  }
  return null;
}

export function validarFormulario(form: FormularioGeracao): ResultadoValidacao {
  const fieldErrors: Partial<Record<CampoFormulario, string>> = {};

  if (
    !form.studentId ||
    typeof form.studentId !== "string" ||
    form.studentId.trim() === ""
  ) {
    fieldErrors.studentId = "Selecione um aluno";
  }

  if (
    !form.disciplina ||
    !DISCIPLINAS.includes(form.disciplina as Disciplina)
  ) {
    fieldErrors.disciplina = "Selecione uma disciplina";
  }

  if (
    !form.mode ||
    (form.mode !== "full_auto" && form.mode !== "draft_first")
  ) {
    fieldErrors.mode = "Selecione o modo de geração";
  }

  const parsedNumCapitulos = parseStrictInteger(form.numCapitulos);
  if (
    parsedNumCapitulos === null ||
    parsedNumCapitulos < MIN_NUM_CAPITULOS ||
    parsedNumCapitulos > MAX_NUM_CAPITULOS
  ) {
    fieldErrors.numCapitulos = "A quantidade de capítulos deve estar entre 1 e 10";
  }

  const parsedExercicios = parseStrictInteger(form.exerciciosPorCapitulo);
  if (
    parsedExercicios === null ||
    parsedExercicios < MIN_EXERCICIOS ||
    parsedExercicios > MAX_EXERCICIOS
  ) {
    fieldErrors.exerciciosPorCapitulo =
      "O número de exercícios por capítulo deve estar entre 1 e 3";
  }

  return {
    valid: Object.keys(fieldErrors).length === 0,
    fieldErrors,
  };
}

export function addInteresse(
  lista: readonly string[],
  candidato: string,
): string[] {
  if (typeof candidato !== "string") {
    return [...lista];
  }
  const trimmed = candidato.trim();
  if (trimmed === "") {
    return [...lista];
  }
  if (trimmed.length > MAX_INTERESSE_LEN || lista.length >= MAX_INTERESSES) {
    return [...lista];
  }
  return [...lista, trimmed];
}

export function montarPayload(form: FormularioGeracao): GenerateBookPayload {
  const parsedCapitulos = parseStrictInteger(form.numCapitulos);
  const parsedExercicios = parseStrictInteger(form.exerciciosPorCapitulo);

  const num_capitulos =
    parsedCapitulos !== null ? parsedCapitulos : NUM_CAPITULOS_PADRAO;
  const exercicios_por_capitulo =
    parsedExercicios !== null ? parsedExercicios : EXERCICIOS_POR_CAPITULO_PADRAO;

  const estiloVisualTrim =
    typeof form.estiloVisual === "string" ? form.estiloVisual.trim() : "";
  const estilo_visual =
    estiloVisualTrim === "" ? ESTILO_VISUAL_PADRAO : estiloVisualTrim;

  const interesses =
    Array.isArray(form.interesses) && form.interesses.length > 0
      ? [...form.interesses]
      : [];

  return {
    studentId: (form.studentId || "").trim(),
    disciplina: form.disciplina as Disciplina,
    interesses,
    num_capitulos,
    exercicios_por_capitulo,
    suporte_caa: Boolean(form.suporteCaa),
    estilo_visual,
    mode: form.mode as ModoGeracao,
  };
}
