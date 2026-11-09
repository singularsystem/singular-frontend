import { StudentSummary } from "./aluno";
import { Portage } from "./portage";
import { ProfessionalSummary } from "./usuario";

export interface PAEE {
  id: string;
  student: StudentSummary;
  professional: ProfessionalSummary;
  portage: Portage;
  typeOfDisability: string;
  academicRecord: string;
  medicalReport: string;
  medications: string;
  followUp: string;
  organizationOfCare: PAEEType[];
  otherOrganization: string;
  weeklyFrequency: string;
  otherFrequency: string;
  assistingTimePerSession: string;
  otherServiceTime: string;
  compositionOfAssisting: string;
  otherProfessionals: PAEEProfessionals[];
  medicalSpecialty: string;
  otherProfessionalsDescription: string;
  differentiatedActivitiesInAEE: PAEEActivities[];
  workMethodology: PAEEWorkMethodology[];
  materialResourcesAndEquipment: PAEEResources[];
  criteriaInEvaluation: PAEEEvaluation[];
  resourcesAndStrategies: PAEEStrategies[];
  additionalObservations: string;
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

export interface PAEEType {
  type: string;
}

export interface PAEEProfessionals {
  professional: string;
}

export interface PAEEWorkMethodology {
  methodology: string;
}

export interface PAEEActivities {
  activity: string;
}

export interface PAEEResources {
  resource: string;
}

export interface PAEEEvaluation {
  criterion: string;
}

export interface PAEEStrategies {
  strategy: string;
}

export type CreatePAEEDTO = {
  studentID: string;
  userID: string;
  portageID: string;
  typeOfDisability: string;
  academicRecord: string;
  medicalReport: string;
  medications: string;
  followUp: string;
  organizationOfCare: PAEEType[];
  otherOrganization: string;
  weeklyFrequency: string;
  otherFrequency: string;
  assistingTimePerSession: string;
  otherServiceTime: string;
  compositionOfAssisting: string;
  otherProfessionals: PAEEProfessionals[];
  medicalSpecialty: string;
  otherProfessionalsDescription: string;
  differentiatedActivitiesInAEE: PAEEActivities[];
  workMethodology: PAEEWorkMethodology[];
  materialResourcesAndEquipment: PAEEResources[];
  criteriaInEvaluation: PAEEEvaluation[];
  resourcesAndStrategies: PAEEStrategies[];
  additionalObservations: string;
};

export type UpdatePAEEDTO = CreatePAEEDTO & {
  id: string;
};
