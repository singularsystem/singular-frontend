import { StudentSummary } from "./aluno";
import { ProfessionalSummary } from "./usuario";

export interface CognitiveAssessment {
  id: string;
  student: StudentSummary;
  professional: ProfessionalSummary;
  psychopedagogueReportID: string;
  identifiedBasicColors: "";
  identifiedBasicShapes: "";
  completesAgeAppropriatePuzzles: "";
  groupsObjectsBySimilarCharacteristics: "";
  identifiesVisualSequencePatterns: "";
  understandsSimpleVerbalInstructions: "";
  namesCommonEverydayObjects: "";
  formsAgeAppropriateSentences: "";
  answersQuestionsAboutFamilyInformation: "";
  understandsBasicAbstractConcepts: "";
  remembersTwoToThreeStepInstructions: "";
  maintainsAttentionForAppropriateDuration: "";
  recognizesFamiliarPeopleAndPlaces: "";
  recallsRecentEvents: "";
  repeatsSimpleSequences: "";
  seeksSolutionsToSimpleEverydayProblems: "";
  demonstratesCreativityInPlay: "";
  learnsFromExperience: "";
  understandsCauseAndEffectRelationships: "";
  adaptsStrategiesWhenSomethingDoesNotWork: "";
  score: number;
  scorePerceptualReasoning: number;
  scoreVerbalReasoning: number;
  scoreMemoryAndAttention: number;
  scoreProblemSolving: number;
  percentage: number;
  percentagePerceptualReasoning: number;
  percentageVerbalReasoning: number;
  percentageMemoryAndAttention: number;
  percentageProblemSolving: number;
  result: string;
  createdAt: string;
  localCreatedAt: string;
  updatedAt: string | null;
  localUpdatedAt: string | null;
}

export type CreateCognitiveAssessmentDTO = {
  studentID: string;
  userID: string;
  psychopedagogueReportID: string;
  identifiedBasicColors: "";
  identifiedBasicShapes: "";
  completesAgeAppropriatePuzzles: "";
  groupsObjectsBySimilarCharacteristics: "";
  identifiesVisualSequencePatterns: "";
  understandsSimpleVerbalInstructions: "";
  namesCommonEverydayObjects: "";
  formsAgeAppropriateSentences: "";
  answersQuestionsAboutFamilyInformation: "";
  understandsBasicAbstractConcepts: "";
  remembersTwoToThreeStepInstructions: "";
  maintainsAttentionForAppropriateDuration: "";
  recognizesFamiliarPeopleAndPlaces: "";
  recallsRecentEvents: "";
  repeatsSimpleSequences: "";
  seeksSolutionsToSimpleEverydayProblems: "";
  demonstratesCreativityInPlay: "";
  learnsFromExperience: "";
  understandsCauseAndEffectRelationships: "";
  adaptsStrategiesWhenSomethingDoesNotWork: "";
};

export type UpdateCognitiveAssessmentDTO = CreateCognitiveAssessmentDTO & {
  id: string;
};
