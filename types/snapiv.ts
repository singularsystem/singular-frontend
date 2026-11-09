import { StudentSummary } from "./aluno";
import { ProfessionalSummary } from "./usuario";

export interface SNAPIVQuestionnaire {
  id: string;
  student: StudentSummary;
  professional: ProfessionalSummary;
  psychologistReportID: string;
  hasCarelessMistakes: string;
  hasDifficultySustainingAttention: string;
  appearsNotToListenWhenSpokenToDirectly: string;
  failsToFollowThroughOnInstructions: string;
  hasDifficultyOrganizingTasksAndActivities: string;
  avoidsTasksRequiringSustainedMentalEffort: string;
  oftenLosesItemsNecessaryForTasks: string;
  easilyDistractedByExternalStimuli: string;
  forgetfulInDailyActivities: string;
  fidgetsWithHandsOrFeet: string;
  leavesSeatInSituationsRequiringSitting: string;
  hasDifficultyPlayingQuietly: string;
  runsOrClimbsInappropriately: string;
  oftenOnTheGoOrActsAsDrivenByAMotor: string;
  talksExcessively: string;
  blurtsOutAnswers: string;
  hasDifficultyWaitingTurn: string;
  interruptsOrIntrudesOnOthers: string;
  status: string;
  score: number;
  result: string;
  hyperactivityCount: number;
  desattentionCount: number;
  createdAt: string;
  localCreatedAt: string;
  updatedAt: string | null;
  localUpdatedAt: string | null;
}

export type CreateSNAPIVDTO = {
  studentID: string;
  userID: string;
  psychologistReportID: string;
  hasCarelessMistakes: string;
  hasDifficultySustainingAttention: string;
  appearsNotToListenWhenSpokenToDirectly: string;
  failsToFollowThroughOnInstructions: string;
  hasDifficultyOrganizingTasksAndActivities: string;
  avoidsTasksRequiringSustainedMentalEffort: string;
  oftenLosesItemsNecessaryForTasks: string;
  easilyDistractedByExternalStimuli: string;
  forgetfulInDailyActivities: string;
  fidgetsWithHandsOrFeet: string;
  leavesSeatInSituationsRequiringSitting: string;
  hasDifficultyPlayingQuietly: string;
  runsOrClimbsInappropriately: string;
  oftenOnTheGoOrActsAsDrivenByAMotor: string;
  talksExcessively: string;
  blurtsOutAnswers: string;
  hasDifficultyWaitingTurn: string;
  interruptsOrIntrudesOnOthers: string;
};

export type UpdateSNAPIVDTO = CreateSNAPIVDTO & {
  id: string;
};
