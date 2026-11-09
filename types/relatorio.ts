import { StudentSummary } from "./aluno";
import { CARSQuestionnaire } from "./cars";
import { CognitiveAssessment } from "./cognitive-assessment";
import { AdaptiveDIScale } from "./escala-adaptative-di";
import { MCHATQuestionnaire } from "./mchat";
import { PsychologistQuestionnaire } from "./questionario-psicologo";
import { PsychopedagogueQuestionnaire } from "./questionario-psicopedagogo";
import { SocialWorkerReport } from "./relatorio-assistente-social";
import { SNAPIVQuestionnaire } from "./snapiv";
import { ProfessionalSummary } from "./usuario";

export interface Relatorio {
  id: string;
  student: StudentSummary;
  professional: ProfessionalSummary;
  psychologistReport: RelatorioPsicologico;
  psychopedagogueReport: RelatorioPsicopedagogico;
  socialWorkerReport: SocialWorkerReport;
  typeOfDisability: string;
  createdAt: string;
  localCreatedAt: string;
  updatedAt: string | null;
  LocalUpdatedAt: string | null;
  unifiedAt: string | null;
  LocalUnifiedAt: string | null;
  status: string;
  reportConfirmed: boolean;
  documentToken: string;
  signedFile: string;
  documentStatus: string;
  signatureBlocked: boolean;
  socialWorkerSign: boolean;
  psychologistSign: boolean;
  psychopedagogueSign: boolean;
  socialWorkerSignUrl: string;
  psychologistSignUrl: string;
  psychopedagogueSignUrl: string;
  socialWorkerSignedAt: string;
  psychologistSignedAt: string;
  psychopedagogueSignedAt: string;
}

export interface RelatorioPsicologico {
  id: string;
  reportID: string;
  student: StudentSummary;
  professional: ProfessionalSummary;
  adaptiveBehaviorScaleDI: AdaptiveDIScale;
  snapIVQuestionnaire: SNAPIVQuestionnaire;
  psychologistQuestionnaire: PsychologistQuestionnaire;
  conclusion: string | null;
  createdAt: string;
  localCreatedAt: string;
  updatedAt: string | null;
  LocalUpdatedAt: string | null;
  unifiedAt: string | null;
  LocalUnifiedAt: string | null;
}

export interface RelatorioAssistenteSocial {
  id: string;
  reportID: string;
  student: StudentSummary;
  professional: ProfessionalSummary;
  familyContext: string;
  socioEconomicConditions: string;
  accessToServices: string;
  participateSocialProgram: string;
  socialProgram: string;
  typeOfHousing: string;
  hasBathroomInsideHouse: string;
  receivesSocialBenefits: string;
  conclusion: string;
  recommendations: string;
  createdAt: string;
  localCreatedAt: string;
  updatedAt: string | null;
  localUpdatedAt: string | null;
}

export interface RelatorioPsicopedagogico {
  id: string;
  reportID: string;
  student: StudentSummary;
  professional: ProfessionalSummary;
  mchatQuestionnaire: MCHATQuestionnaire;
  carsQuestionnaire: CARSQuestionnaire;
  cognitiveAssessment: CognitiveAssessment;
  psychopedagogueQuestionnaire: PsychopedagogueQuestionnaire;
  conclusion: string | null;
  createdAt: string;
  localCreatedAt: string;
  updatedAt: string | null;
  LocalUpdatedAt: string | null;
  unifiedAt: string | null;
  LocalUnifiedAt: string | null;
}
