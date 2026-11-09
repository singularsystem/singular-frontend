import {
  questionsCiencias1Ano,
  questionsCiencias2Ano,
  questionsCiencias3Ano,
  questionsCiencias4Ano,
  questionsCiencias5Ano,
  questionsCiencias6Ano,
  questionsCiencias7Ano,
  questionsCiencias8Ano,
  questionsCiencias9Ano,
} from "@/lib/pei-ciencias";
import {
  questionsGeografia1Ano,
  questionsGeografia2Ano,
  questionsGeografia3Ano,
  questionsGeografia4Ano,
  questionsGeografia5Ano,
  questionsGeografia6Ano,
  questionsGeografia7Ano,
  questionsGeografia8Ano,
  questionsGeografia9Ano,
} from "@/lib/pei-geografia";
import {
  questionsHistoria1Ano,
  questionsHistoria2Ano,
  questionsHistoria3Ano,
  questionsHistoria4Ano,
  questionsHistoria5Ano,
  questionsHistoria6Ano,
  questionsHistoria7Ano,
  questionsHistoria8Ano,
  questionsHistoria9Ano,
} from "@/lib/pei-historia";
import {
  questionsIngles6Ano,
  questionsIngles7Ano,
  questionsIngles8Ano,
  questionsIngles9Ano,
} from "@/lib/pei-ingles";
import {
  questionsLinguaPortuguesa1Ano,
  questionsLinguaPortuguesa2Ano,
  questionsLinguaPortuguesa3Ano,
  questionsLinguaPortuguesa4Ano,
  questionsLinguaPortuguesa5Ano,
  questionsLinguaPortuguesa6Ano,
  questionsLinguaPortuguesa7Ano,
  questionsLinguaPortuguesa8Ano,
  questionsLinguaPortuguesa9Ano,
} from "@/lib/pei-lingua-portuguesa";
import {
  questionsMatematica1Ano,
  questionsMatematica2Ano,
  questionsMatematica3Ano,
  questionsMatematica4Ano,
  questionsMatematica5Ano,
  questionsMatematica6Ano,
  questionsMatematica7Ano,
  questionsMatematica8Ano,
  questionsMatematica9Ano,
} from "@/lib/pei-matematica";
import { StudentSummary } from "./aluno";
import { ProfessionalSummary } from "./usuario";

export interface PEI {
  id: string;
  student: StudentSummary;
  professional: ProfessionalSummary;
  schoolYear: string;
  serie: string;
  academicRecord: string;
  medicalReport: string;
  medications: string;
  followUp: string;
  additionalObservations: string;
  subjects: PEISubject[];
  createdAt: string;
  localCreatedAt: string;
  updatedAt: string;
  localUpdatedAt: string;
  documentToken: string;
  signedFile: string;
  documentStatus: string;
  teacherSign: boolean;
  signUrl: string;
  signedAt: string;
}

export type PEIResponse = {
  id: string;
  key: string;
  category: string;
  response: string;
};

export type PEISubject = {
  id: string;
  subject: string;
  responses: PEIResponse[];
};

export type PEISubjectPayload = {
  subject: string;
  responses: PEIResponsePayload[];
};

export type PEIResponsePayload = {
  key: string;
  category: string;
  response: string;
};

export type PEIAnswerMapPayload = Record<
  string,
  { response: string; category: string; disciplina: string; tipo: string }
>;

export function mapAnswersToSubjectsPayload(
  respostas: PEIAnswerMapPayload,
): PEISubjectPayload[] {
  const grouped: Record<string, PEIResponsePayload[]> = {};

  for (const [key, v] of Object.entries(respostas)) {
    const subjectName = v.disciplina ?? "Sem disciplina";

    if (!grouped[subjectName]) grouped[subjectName] = [];

    grouped[subjectName].push({
      key,
      response: v.response,
      category: v.category,
    });
  }

  return Object.entries(grouped).map(([subject, responses]) => ({
    subject,
    responses: responses.sort((a, b) => a.key.localeCompare(b.key)),
  }));
}

export type CreatePEIDTO = {
  studentID: string;
  userID: string;
  schoolYear: string;
  serie: string;
  academicRecord?: string;
  medicalReport?: string;
  medications?: string;
  followUp?: string;
  additionalObservations?: string;
  subjects: string[];
};

export type CreatePEIApiPayload = Omit<CreatePEIDTO, "subjects"> & {
  subjects: PEISubjectPayload[];
};

export function mapPEIFormToApiPayload(
  data: CreatePEIDTO,
  studentID: string,
  userID: string,
): CreatePEIApiPayload {
  return {
    ...data,
    studentID,
    userID,
    subjects: data.subjects.map((s) => ({
      subject: s,
      responses: [],
    })),
  };
}

export type UpdatePEIDTO = Omit<CreatePEIDTO, "subjects"> & {
  id: string;
  subjects: PEISubjectPayload[];
};

export function mapCurrentSubjectPayload(
  disciplina: string,
  respostas: PEIAnswerMap,
) {
  return {
    subject: disciplina,
    responses: Object.entries(respostas).map(([key, v]) => ({
      key,
      response: v.response,
      category: v.category,
    })),
  };
}

export const ORDEM_SERIES = [
  "1º Ano",
  "2º Ano",
  "3º Ano",
  "4º Ano",
  "5º Ano",
  "6º Ano",
  "7º Ano",
  "8º Ano",
  "9º Ano",
];

const DISCIPLINAS = [
  "Ciências",
  "Geografia",
  "História",
  "Matemática",
  "Língua Portuguesa",
  "Inglês",
];

export type PEIQuestionStep = {
  id: string;
  tipo: string;
  pergunta: string;
  disciplina: string;
};

export interface PEIQuestion {
  id: string;
  tipo: string;
  pergunta: string;
  sugestaoNao: string;
  sugestaoSimComMediacao: string;
}

export type PEIAnswerValue = "Ainda Não" | "Com Mediação" | "Sozinho";

export type PEIAnswerMap = Record<
  string,
  {
    response: PEIAnswerValue;
    category: string;
    disciplina: string;
    tipo: string;
  }
>;

export const disciplinasDisponiveis = {
  "1º Ano": {
    "Língua Portuguesa": questionsLinguaPortuguesa1Ano,
    Matemática: questionsMatematica1Ano,
    Ciências: questionsCiencias1Ano,
    História: questionsHistoria1Ano,
    Geografia: questionsGeografia1Ano,
  },
  "2º Ano": {
    "Língua Portuguesa": questionsLinguaPortuguesa2Ano,
    Matemática: questionsMatematica2Ano,
    Ciências: questionsCiencias2Ano,
    História: questionsHistoria2Ano,
    Geografia: questionsGeografia2Ano,
  },
  "3º Ano": {
    "Língua Portuguesa": questionsLinguaPortuguesa3Ano,
    Matemática: questionsMatematica3Ano,
    Ciências: questionsCiencias3Ano,
    História: questionsHistoria3Ano,
    Geografia: questionsGeografia3Ano,
  },
  "4º Ano": {
    "Língua Portuguesa": questionsLinguaPortuguesa4Ano,
    Matemática: questionsMatematica4Ano,
    Ciências: questionsCiencias4Ano,
    História: questionsHistoria4Ano,
    Geografia: questionsGeografia4Ano,
  },
  "5º Ano": {
    "Língua Portuguesa": questionsLinguaPortuguesa5Ano,
    Matemática: questionsMatematica5Ano,
    Ciências: questionsCiencias5Ano,
    Geografia: questionsGeografia5Ano,
    História: questionsHistoria5Ano,
  },
  "6º Ano": {
    "Língua Portuguesa": questionsLinguaPortuguesa6Ano,
    Matemática: questionsMatematica6Ano,
    Ciências: questionsCiencias6Ano,
    História: questionsHistoria6Ano,
    Geografia: questionsGeografia6Ano,
    Inglês: questionsIngles6Ano,
  },
  "7º Ano": {
    "Língua Portuguesa": questionsLinguaPortuguesa7Ano,
    Matemática: questionsMatematica7Ano,
    Ciências: questionsCiencias7Ano,
    História: questionsHistoria7Ano,
    Geografia: questionsGeografia7Ano,
    Inglês: questionsIngles7Ano,
  },
  "8º Ano": {
    "Língua Portuguesa": questionsLinguaPortuguesa8Ano,
    Matemática: questionsMatematica8Ano,
    Ciências: questionsCiencias8Ano,
    História: questionsHistoria8Ano,
    Geografia: questionsGeografia8Ano,
    Inglês: questionsIngles8Ano,
  },
  "9º Ano": {
    "Língua Portuguesa": questionsLinguaPortuguesa9Ano,
    Matemática: questionsMatematica9Ano,
    Ciências: questionsCiencias9Ano,
    História: questionsHistoria9Ano,
    Geografia: questionsGeografia9Ano,
    Inglês: questionsIngles9Ano,
  },
};
