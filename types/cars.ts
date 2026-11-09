import { StudentSummary } from "./aluno";
import { ProfessionalSummary } from "./usuario";

export interface CARSQuestionnaire {
  id: string;
  student: StudentSummary;
  professional: ProfessionalSummary;
  psychopedagogueReportID: string;
  totalScore: string;
  result: string;
  createdAt: string;
  localCreatedAt: string;
  updatedAt: string | null;
  localUpdatedAt: string | null;
}

export type CreateCARSDTO = {
  studentID: string;
  userID: string;
  psychopedagogueReportID: string;
  totalScore: string;
};

export type UpdateCARSDTO = CreateCARSDTO & {
  id: string;
};
