export const DISCIPLINAS = [
  "Língua Portuguesa",
  "Matemática",
  "Ciências",
  "História",
  "Geografia",
  "Inglês",
  "Educação Infantil",
] as const;

export type Disciplina = (typeof DISCIPLINAS)[number];

export type ModoGeracao = "full_auto" | "draft_first";

export type StatusJob =
  | "QUEUED"
  | "GENERATING_TEXT"
  | "AWAITING_TEACHER_REVIEW"
  | "GENERATING_IMAGES"
  | "RENDERING_PDF"
  | "COMPLETED"
  | "FAILED";

export const ESTILO_VISUAL_PADRAO = "aquarela_infantil";

export const OPCOES_ESTILO_VISUAL = [
  {
    value: "aquarela_infantil",
    label: "Aquarela Infantil (Padrão)",
    description: "Cores suaves e traços leves, acolhedor para histórias infantis em geral.",
  },
  {
    value: "vetor_ludico",
    label: "Vetor Lúdico",
    description: "Arte vetorial moderna com cores vibrantes e figuras bem definidas.",
  },
  {
    value: "alto_contraste",
    label: "Alto Contraste (Acessibilidade)",
    description: "Contornos pretos reforçados e alto contraste, indicado para baixa visão.",
  },
] as const;

export type EstiloVisualPredefinido = (typeof OPCOES_ESTILO_VISUAL)[number]["value"];
export const NUM_CAPITULOS_PADRAO = 4;
export const EXERCICIOS_POR_CAPITULO_PADRAO = 1;

export const MIN_NUM_CAPITULOS = 1;
export const MAX_NUM_CAPITULOS = 10;
export const MIN_EXERCICIOS = 1;
export const MAX_EXERCICIOS = 3;
export const MAX_INTERESSES = 10;
export const MAX_INTERESSE_LEN = 100;
export const MAX_ESTILO_VISUAL_LEN = 100;

export const REQUEST_TIMEOUT_MS = 30_000;
export const POLLING_INTERVAL_MS = 3_000;
export const POLLING_TOTAL_TIMEOUT_MS = 600_000;

export interface FormularioGeracao {
  studentId: string | null;
  disciplina: Disciplina | "" | null;
  interesses: string[];
  numCapitulos: number | string;
  exerciciosPorCapitulo: number | string;
  estiloVisual: string;
  suporteCaa: boolean;
  mode: ModoGeracao | null;
}

export type CampoFormulario =
  | "studentId"
  | "disciplina"
  | "numCapitulos"
  | "exerciciosPorCapitulo"
  | "mode";

export interface ResultadoValidacao {
  valid: boolean;
  fieldErrors: Partial<Record<CampoFormulario, string>>;
}

export interface GenerateBookPayload {
  studentId: string;
  disciplina: Disciplina;
  interesses: string[];
  num_capitulos: number;
  exercicios_por_capitulo: number;
  suporte_caa: boolean;
  estilo_visual: string;
  mode: ModoGeracao;
}

export interface GenerateBookResult {
  jobId: string;
  bookId: string;
}

export interface JobStatusEntity {
  status: StatusJob;
  progress: number;
  current_step: string;
  pdf_url?: string | null;
  error_message?: string | null;
}

export interface ChapterDraft {
  id: string;
  order: number;
  title: string;
  content: string;
  exercises: string[];
  image_prompt: string;
  caa_symbols?: string[];
}

export interface DraftResponse {
  title: string;
  chapters: ChapterDraft[];
}

export interface DraftUpdatePayload {
  title: string;
  chapters: ChapterDraft[];
}

export type ErrorCategory =
  | "MUNICIPALITY_NOT_ENABLED"
  | "MODULE_NOT_ACTIVE"
  | "EXCESS_MUNICIPAL_QUOTA"
  | "VALIDATION"
  | "SERVICE_UNAVAILABLE"
  | "NETWORK"
  | "UNEXPECTED";

export interface ErrorView {
  category: ErrorCategory;
  message: string;
  fieldErrors?: Record<string, string>;
}

export interface BackendErrorResponse {
  status?: number;
  code?: string;
  message?: string;
  details?: Record<string, unknown> | Array<unknown>;
}

export type ChapterChangeKind =
  | "added"
  | "removed"
  | "changed"
  | "reordered"
  | "unchanged";

export interface ChapterDiffResult {
  id: string;
  kind: ChapterChangeKind;
}
