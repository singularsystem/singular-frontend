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

export interface AlunoEntity {
  id: string;
  nome: string;
  fullName: string;
  cpf: string;
  rg: string;
  susCard: string;
  dataNascimento: string;
  formattedDateOfBirth?: string;
  age?: number;
  sexo: string;
  sex: string;
  email: string;
  telefone: string;
  status: boolean;
  escolaId: string;
  schoolID: string;
  escolaNome?: string;
  schoolName?: string;
  cidade: string;
  city: string;
  uf: string;
  state: string;
  address: string;
  serie: string;
  nameOfPersonResponsible: string;
  maritalStatusParents: string;
  skinColor: string;
  schoolCity?: string;
  schoolState?: string;
  
  // IDs de documentos relacionados (da interface Student original)
  reportID?: string;
  socialWorkerReportID?: string;
  psychologistReportID?: string;
  psychopedagogueReportID?: string;
  snapIVQuestionnaireID?: string;
  neuropsychopedagogicalQuestionnaireID?: string;
  mchatrQuestionnaireID?: string;
  mchatrQuestionnaireScore?: number;
  mchatrfQuestionnaireID?: string;
  carsChildhoodQuestionnaireID?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export interface AlunoFilters {
  state?: string;
  city?: string;
  schoolID?: string;
  searchTerm?: string;
  serie?: string;
}

export interface CreateAlunoDTO {
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
  susCard?: string;
  rg?: string;
  cpf?: string;
  schoolID: string;
}

export interface UpdateAlunoDTO extends CreateAlunoDTO {
  id: string;
}

export interface AlunoDocument {
  id: string;
  type: string;
  documentType: string; // Adicionado para compatibilidade
  date: string;
  localCreatedAt?: string; // Adicionado para compatibilidade
  status?: string;
}

export interface AlunoAttachment {
  id: string;
  name: string;
  fileName?: string; // Adicionado para compatibilidade
  url: string;
  uploadDate: string;
  localCreatedAt?: string; // Adicionado para compatibilidade
  type?: string;
}

// Tipos para Importação (mantendo funcionalidade original)
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

// Funções estáticas de validação (Task 1.1)
export function isValidCPF(cpf: string): boolean {
  if (!cpf) return false;
  const cleanCPF = cpf.replace(/[^\d]/g, "");
  if (cleanCPF.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;

  return true;
}

export function validateBirthDate(dateStr: string): string | null {
  if (!dateStr) return "Data de nascimento é obrigatória.";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Data de nascimento inválida.";
  if (date > new Date()) return "A data de nascimento não pode ser no futuro.";
  
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 100);
  if (date < minDate) return "A data de nascimento é muito antiga.";
  
  return null;
}

