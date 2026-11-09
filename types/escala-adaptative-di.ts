import { StudentSummary } from "./aluno";
import { ProfessionalSummary } from "./usuario";

export interface AdaptiveDIScale {
  id: string;
  student: StudentSummary;
  professional: ProfessionalSummary;
  psychologistReportID: string;
  ageAppropriateReadingComprehension: string;
  performsBasicMathematicalCalculations: string;
  understandsTimeConcepts: string;
  followsMultiStepInstructions: string;
  interactsAppropriatelyWithPeers: string;
  recognizesOwnAndOthersEmotions: string;
  followsBasicSocialRules: string;
  resolvesConflictsAppropriately: string;
  maintainsPersonalHygieneIndependently: string;
  organizesSchoolMaterials: string;
  dressesAppropriately: string;
  showsConfidenceInFamiliarEnvironments: string;
  score: number;
  percentage: number;
  result: string;
  scoreConceptualSkills: number;
  percentageConceptualSkills: number;
  maxPointsConceptualSkills: number;
  scoreSocialSkills: number;
  percentageSocialSkills: number;
  maxPointsSocialSkills: number;
  scorePracticalSkills: number;
  percentagePracticalSkills: number;
  maxPointsPracticalSkills: number;
  maxPoints: number;
  createdAt: string;
  localCreatedAt: string;
  updatedAt: string | null;
  localUpdatedAt: string | null;
}

export type CreateAdaptiveDIScaleDTO = {
  studentID: string;
  userID: string;
  psychologistReportID: string;
  ageAppropriateReadingComprehension: string;
  performsBasicMathematicalCalculations: string;
  understandsTimeConcepts: string;
  followsMultiStepInstructions: string;
  interactsAppropriatelyWithPeers: string;
  recognizesOwnAndOthersEmotions: string;
  followsBasicSocialRules: string;
  resolvesConflictsAppropriately: string;
  maintainsPersonalHygieneIndependently: string;
  organizesSchoolMaterials: string;
  dressesAppropriately: string;
  showsConfidenceInFamiliarEnvironments: string;
};

export type UpdateAdaptiveDIScaleDTO = CreateAdaptiveDIScaleDTO & {
  id: string;
};
