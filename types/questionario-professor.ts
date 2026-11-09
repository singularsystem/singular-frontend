import { StudentSummary } from "./aluno";
import { ProfessionalSummary } from "./usuario";

export interface NeuropsychopedagogicalQuestionnaire {
  id: string;
  student: StudentSummary;
  professional: ProfessionalSummary;
  classroomDevelopment: string;
  classroomBehavior: string;
  mainDifficulties: string;
  learningCharacteristics: string;
  readingAndWritingDescription: string;
  logicalMathematicalReasoningDescription: string;
  completesSchoolActivities: string;
  completesHomework: string;
  reactionToFrustration: string;
  inappropriateBehaviorDescription: string;
  difficultyWorkingInGroup: string;
  difficultyOrganizingTasks: string;
  peerAcceptance: string;
  behaviorTraits: BehaviorTraits[];
  behaviorObservations: string;
  developmentLevel: string;
  developmentObservations: string;
  additionalComments: string;
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

export type CreateNeuropsychopedagogicalDTO = {
  studentID: string;
  userID: string;
  classroomDevelopment: string;
  classroomBehavior: string;
  mainDifficulties: string;
  learningCharacteristics: string;
  readingAndWritingDescription: string;
  logicalMathematicalReasoningDescription: string;
  completesSchoolActivities: string;
  completesHomework: string;
  reactionToFrustration: string;
  inappropriateBehaviorDescription: string;
  difficultyWorkingInGroup: string;
  difficultyOrganizingTasks: string;
  peerAcceptance: string;
  behaviorTraits: string[];
  behaviorObservations: string;
  developmentLevel: string;
  developmentObservations: string;
  additionalComments: string;
};

type BehaviorTraits = {
  behaviorTrait: string;
};

type CreateNeuropsychopedagogicalApiPayload = Omit<
  CreateNeuropsychopedagogicalDTO,
  "behaviorTraits"
> & {
  behaviorTraits: BehaviorTraits[];
};

export type UpdateNeuropsychopedagogicalDTO =
  CreateNeuropsychopedagogicalDTO & {
    id: string;
  };

export function mapNeuropsychopedagogicalFormToApiPayload(
  data: CreateNeuropsychopedagogicalDTO,
  studentID: string,
  userID: string,
): CreateNeuropsychopedagogicalApiPayload {
  return {
    ...data,
    studentID,
    userID,
    behaviorTraits: data.behaviorTraits.map((trait) => ({
      behaviorTrait: trait,
    })),
  };
}
