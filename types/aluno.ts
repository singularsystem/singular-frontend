export interface Student {
  id: string;
  reportID: string;
  socialWorkerReportID: string;
  psychologistReportID: string;
  psychopedagogueReportID: string;
  snapIVQuestionnaireID: string;
  neuropsychopedagogicalQuestionnaireID: string;
  mchatrQuestionnaireID: string;
  mchatrQuestionnaireScore: number;
  mchatrfQuestionnaireID: string;
  carsChildhoodQuestionnaireID: string;
  fullName: string;
  dateOfBirth: string;
  schoolName: string;
  serie: string;
  schoolCity: string;
  schoolState: string;
  sex: string;
  address: string;
  state: string;
  city: string;
  formattedDateOfBirth: string;
  nameOfPersonResponsible: string;
  maritalStatusParents: string;
  skinColor: string;
  susCard: string;
  rg: string;
  cpf: string;
  reportCreationDate: string;
  localReportCreationDate: string;
  typeOfDisability: string;
  reportStatus: string;
  age: number;
}

export interface StudentSummary {
  id: string;
  fullName: string;
  dateOfBirth: string;
  schoolName: string;
  serie: string;
  schoolCity: string;
  schoolState: string;
  sex: string;
  address: string;
  state: string;
  city: string;
  nameOfPersonResponsible: string;
  formattedDateOfBirth: string;
  age: number;
}

export interface StudentDocument {
  id: string;
  documentType: string;
  createdAt: string;
  localCreatedAt: string;
  updatedAt: string;
  localUpdatedAt: string;
  unifiedAt: string;
  localUnifiedAt: string;
}

export type CreateStudentDTO = {
  fullName: string;
  dateOfBirth: string;
  schoolName: string;
  schoolCity: string;
  schoolState: string;
  serie: string;
  sex: string;
  address: string;
  state: string;
  city: string;
  nameOfPersonResponsible: string;
  maritalStatusParents: string;
  skinColor: string;
  susCard: string;
  rg: string;
  cpf: string;
};

export type UpdateStudentDTO = CreateStudentDTO & {
  id: string;
};

export type DocumentType =
  | "RegularTeacherEvaluationDocument"
  | "RegularTeacherQuestionnaire"
  | "RegularTeacherScreening"
  | "PEI"
  | "PAEE"
  | "PortageGuide"
  | "Report"
  | "SocialWorkerReport"
  | "PsychologistReport"
  | "PsychopedagogueReport"
  | "PsychologistQuestionnaire"
  | "PsychopedagogueQuestionnaire"
  | "CARSQuestionnaire"
  | "MCHATQuestionnaire"
  | "CognitiveAssessment"
  | "SnapIVQuestionnaire"
  | "AdaptiveBehaviorScaleDI";

export const DOCUMENT_TYPE_LABEL: Record<DocumentType, string> = {
  RegularTeacherEvaluationDocument: "Avaliação do Professor (Regular)",
  RegularTeacherQuestionnaire: "Questionário do Professor (Regular)",
  RegularTeacherScreening: "Triagem do Professor (Regular)",
  PEI: "PEI",
  PAEE: "PAEE",
  PortageGuide: "Guia Portage",
  Report: "Relatório Biopsicossocial",
  SocialWorkerReport: "Relatório - Serviço Social",
  PsychologistReport: "Relatório - Psicólogo(a)",
  PsychopedagogueReport: "Relatório - Psicopedagogo(a)",
  PsychologistQuestionnaire: "Questionário - Psicólogo(a)",
  PsychopedagogueQuestionnaire: "Questionário - Psicopedagogo(a)",
  CARSQuestionnaire: "Questionário CARS",
  MCHATQuestionnaire: "Questionário M-CHAT",
  CognitiveAssessment: "Avaliação Cognitiva",
  SnapIVQuestionnaire: "Questionário SNAP-IV",
  AdaptiveBehaviorScaleDI: "Escala de Comportamento Adaptativo (DI)",
};

export function getDocumentTypeLabel(documentType?: string) {
  return (
    DOCUMENT_TYPE_LABEL[documentType as DocumentType] ??
    documentType ??
    "Documento"
  );
}

export type LinhaImportacaoAluno = {
  fullName: string;
  sex: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  schoolName: string;
  schoolCity: string;
  schoolState: string;
  serie: string;
  nameOfPersonResponsible: string;
  maritalStatusParents: string;
  skinColor: string;
  susCard: string | null;
  rg: string | null;
  cpf: string | null;
};

export type AlunoImportadoComSucesso = {
  rowNumber: number;
  fullName: string;
  schoolName: string;
};

export type AlunoImportadoComErro = {
  rowNumber: number;
  fullName: string;
  errors: string[];
  rowData: LinhaImportacaoAluno;
};

export type ResultadoImportacaoAlunos = {
  createdCount: number;
  failedCount: number;
  successfulStudents: AlunoImportadoComSucesso[];
  failedStudents: AlunoImportadoComErro[];
};
