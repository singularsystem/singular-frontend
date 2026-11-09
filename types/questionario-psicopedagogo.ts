import { uniqueStrings } from "@/lib/utils";
import { StudentSummary } from "./aluno";
import { RelatorioPsicopedagogico } from "./relatorio";
import { ProfessionalSummary } from "./usuario";

export interface PsychopedagogueQuestionnaire {
  id: string;
  student: StudentSummary;
  professional: ProfessionalSummary;
  psychopedagogueReportID: string;
  comportamentalObservations: string;
  notebookObservations: string;
  otherObservations: string;
  typeOfDisability: TypeOfDisability[];
  otherTypesOfDisability: string;
  typeOfDisorder: TypeOfDisorder[];
  justificationForClassification: string;
  recommendations: Recommendation[];
  otherRecommendations: string;
  score: number;
  result: string;
  createdAt: string;
  localCreatedAt: string;
  updatedAt: string | null;
  localUpdatedAt: string | null;
}

export type TypeOfDisability = {
  disability: string;
};

export type TypeOfDisorder = {
  disorder: string;
};

type Recommendation = {
  recommendation: string;
};

export type CheckboxArrayField =
  | "typeOfDisability"
  | "typeOfDisorder"
  | "recommendations";

export type CreatePsychopedagogueQuestionnaireDTO = {
  studentID: string;
  userID: string;
  psychopedagogueReportID: string;
  comportamentalObservations: string;
  notebookObservations: string;
  otherObservations: string;
  typeOfDisability: string[];
  otherTypesOfDisability: string;
  typeOfDisorder: string[];
  justificationForClassification: string;
  recommendations: string[];
  otherRecommendations: string;
};

export type CreatePsychopedagogueQuestionnaireApiPayload = Omit<
  CreatePsychopedagogueQuestionnaireDTO,
  "typeOfDisability" | "typeOfDisorder" | "recommendations"
> & {
  typeOfDisability: TypeOfDisability[];
  typeOfDisorder: TypeOfDisorder[];
  recommendations: Recommendation[];
};

export type UpdatePsychopedagogueQuestionnaireDTO =
  CreatePsychopedagogueQuestionnaireDTO & {
    id: string;
  };

export type UpdatePsychopedagogueQuestionnaireApiPayload = Omit<
  UpdatePsychopedagogueQuestionnaireDTO,
  "typeOfDisability" | "typeOfDisorder" | "recommendations"
> & {
  typeOfDisability: TypeOfDisability[];
  typeOfDisorder: TypeOfDisorder[];
  recommendations: Recommendation[];
};

export function mapPsychopedagogueQuestionnaireFormToApiPayload(
  data: CreatePsychopedagogueQuestionnaireDTO,
  studentID: string,
  userID: string,
  psychopedagogueReportID: string,
): CreatePsychopedagogueQuestionnaireApiPayload {
  return {
    ...data,
    studentID,
    userID,
    psychopedagogueReportID,
    typeOfDisability: data.typeOfDisability.map((disability) => ({
      disability: disability,
    })),
    typeOfDisorder: data.typeOfDisorder.map((disorder) => ({
      disorder: disorder,
    })),
    recommendations: data.recommendations.map((recommendation) => ({
      recommendation: recommendation,
    })),
  };
}

export function mapPsychopedagogueQuestionnaireUpdateFormToApiPayload(
  data: UpdatePsychopedagogueQuestionnaireDTO,
  studentID: string,
  userID: string,
  psychopedagogueReportID: string,
): UpdatePsychopedagogueQuestionnaireApiPayload {
  return {
    ...data,
    id: data.id,
    studentID,
    userID,
    psychopedagogueReportID,

    typeOfDisability: data.typeOfDisability.map((disability) => ({
      disability,
    })),

    typeOfDisorder: data.typeOfDisorder.map((disorder) => ({
      disorder,
    })),

    recommendations: data.recommendations.map((recommendation) => ({
      recommendation,
    })),
  };
}

export function mapPsychopedagogueQuestionnaireApiToUpdateForm(
  q: RelatorioPsicopedagogico,
): UpdatePsychopedagogueQuestionnaireDTO {
  return {
    id: q.psychopedagogueQuestionnaire.id,
    studentID: q.student.id,
    userID: q.professional.id,
    psychopedagogueReportID: q.id,

    comportamentalObservations:
      q.psychopedagogueQuestionnaire.comportamentalObservations ?? "",
    notebookObservations:
      q.psychopedagogueQuestionnaire.notebookObservations ?? "",
    otherObservations: q.psychopedagogueQuestionnaire.otherObservations ?? "",

    typeOfDisability: uniqueStrings(
      (q.psychopedagogueQuestionnaire?.typeOfDisability ?? []).map(
        (x: any) => x.disability,
      ),
    ),
    otherTypesOfDisability:
      q.psychopedagogueQuestionnaire.otherTypesOfDisability ?? "",

    typeOfDisorder: uniqueStrings(
      (q.psychopedagogueQuestionnaire.typeOfDisorder ?? []).map(
        (x) => x.disorder,
      ),
    ),

    justificationForClassification:
      q.psychopedagogueQuestionnaire.justificationForClassification ?? "",

    recommendations: uniqueStrings(
      (q.psychopedagogueQuestionnaire.recommendations ?? []).map(
        (x) => x.recommendation,
      ),
    ),
    otherRecommendations:
      q.psychopedagogueQuestionnaire.otherRecommendations ?? "",
  };
}
