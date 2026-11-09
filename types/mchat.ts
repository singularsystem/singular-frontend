import { StudentSummary } from "./aluno";
import { ProfessionalSummary } from "./usuario";

export interface MCHATQuestionnaire {
  id: string;
  student: StudentSummary;
  professional: ProfessionalSummary;
  psychopedagogueReportID: string;
  followsPointingGesture: string;
  suspectedDeafness: string;
  pretendPlay: string;
  climbsObjects: string;
  unusualFingerMovementsNearEyes: string;
  pointsToRequest: string;
  pointsToShowInterest: string;
  interestedInOtherChildren: string;
  sharesObjectsForAttention: string;
  respondsToName: string;
  smilesBack: string;
  sensitiveToNoise: string;
  canWalk: string;
  maintainsEyeContact: string;
  imitatesActions: string;
  followsGaze: string;
  seeksAttention: string;
  understandsVerbalInstructions: string;
  checksFacialReactionToEvents: string;
  enjoysMovementActivities: string;
  status: string;
  score: number;
  result: string;
  createdAt: string;
  localCreatedAt: string;
  updatedAt: string | null;
  localUpdatedAt: string | null;
}

export type CreateMCHATDTO = {
  studentID: string;
  userID: string;
  psychopedagogueReportID: string;
  followsPointingGesture: string;
  suspectedDeafness: string;
  pretendPlay: string;
  climbsObjects: string;
  unusualFingerMovementsNearEyes: string;
  pointsToRequest: string;
  pointsToShowInterest: string;
  interestedInOtherChildren: string;
  sharesObjectsForAttention: string;
  respondsToName: string;
  smilesBack: string;
  sensitiveToNoise: string;
  canWalk: string;
  maintainsEyeContact: string;
  imitatesActions: string;
  followsGaze: string;
  seeksAttention: string;
  understandsVerbalInstructions: string;
  checksFacialReactionToEvents: string;
  enjoysMovementActivities: string;
};

export type UpdateMCHATDTO = CreateMCHATDTO & {
  id: string;
};
