import { StudentSummary } from "./aluno";
import { NeuropsychopedagogicalQuestionnaire } from "./questionario-professor";
import { EvaluationScreening } from "./triagem";
import { ProfessionalSummary } from "./usuario";

export interface StudentEvaluation {
  id: string;
  student: StudentSummary;
  professional: ProfessionalSummary;
  screening: EvaluationScreening;
  questionnaire: NeuropsychopedagogicalQuestionnaire;
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
  status: string;
}

