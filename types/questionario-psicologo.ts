import { StudentSummary } from "./aluno";
import { ProfessionalSummary } from "./usuario";

export interface PsychologistQuestionnaire {
  id: string;
  student: StudentSummary;
  professional: ProfessionalSummary;
  psychologistReportID: string;
  // Vocabulário e Fala
  limitedVocabulary: string;
  limitedVocabularyObservation: string;
  childlikeSpeech: string;
  childlikeSpeechObservation: string;
  difficultyFollowingCommands: string;
  difficultyFollowingCommandsObservation: string;
  delayedResponse: string;
  delayedResponseObservation: string;
  avoidsTalking: string;
  avoidsTalkingObservation: string;

  // Escrita e Alfabetização
  difficultyCopying: string;
  difficultyCopyingObservation: string;
  excessiveSpellingErrors: string;
  excessiveSpellingErrorsObservation: string;
  writingIssues: string;
  writingIssuesObservation: string;
  phoneticAssociationDifficulty: string;
  phoneticAssociationDifficultyObservation: string;
  writingLevel: string;
  writingLevelObservation: string;
  recognizesLettersOrWords: string;
  recognizesLettersOrWordsObservation: string;

  // Leitura
  readingFluencyIssues: string;
  readingFluencyIssuesObservation: string;
  answersReadingQuestions: string;
  answersReadingQuestionsObservation: string;
  avoidsReading: string;
  avoidsReadingObservation: string;

  // Matemática e Conceitos
  numberRecognitionIssues: string;
  numberRecognitionIssuesObservation: string;
  comparisonConceptDifficulty: string;
  comparisonConceptDifficultyObservation: string;
  basicOperationDifficulty: string;
  basicOperationDifficultyObservation: string;
  timeSpaceConceptDifficulty: string;
  timeSpaceConceptDifficultyObservation: string;

  // Autonomia e Comportamento
  difficultyOrganizingMaterials: string;
  difficultyOrganizingMaterialsObservation: string;
  needsHelpWithBasicActivities: string;
  needsHelpWithBasicActivitiesObservation: string;
  difficultyWithRoutines: string;
  difficultyWithRoutinesObservation: string;
  doesNotInitiateTasks: string;
  doesNotInitiateTasksObservation: string;
  immatureBehavior: string;
  immatureBehaviorObservation: string;
  prefersYoungerChildren: string;
  prefersYoungerChildrenObservation: string;

  // Desempenho Global e Atenção
  belowAgeLevelPerformance: string;
  belowAgeLevelPerformanceObservation: string;
  earlyChildhoodSkillLevel: string;
  earlyChildhoodSkillLevelObservation: string;
  forgetsContent: string;
  forgetsContentObservation: string;
  attentionDifficulty: string;
  attentionDifficultyObservation: string;
  easilyDistracted: string;
  easilyDistractedObservation: string;
  needsRepeatedExplanations: string;
  needsRepeatedExplanationsObservation: string;

  // Social e Emocional
  friendshipDifficulty: string;
  friendshipDifficultyObservation: string;
  easilyFrustrated: string;
  easilyFrustratedObservation: string;
  lowSelfEsteem: string;
  lowSelfEsteemObservation: string;
  dependsOnAdults: string;
  dependsOnAdultsObservation: string;

  // Observações Finais
  additionalComments: string;
  createdAt: string;
  localCreatedAt: string;
  updatedAt: string | null;
  localUpdatedAt: string | null;
}

export type CreatePsychologistQuestionnaireDTO = {
  studentID: string;
  userID: string;
  psychologistReportID: string;

  // Vocabulário e Fala
  limitedVocabulary: string;
  limitedVocabularyObservation: string;
  childlikeSpeech: string;
  childlikeSpeechObservation: string;
  difficultyFollowingCommands: string;
  difficultyFollowingCommandsObservation: string;
  delayedResponse: string;
  delayedResponseObservation: string;
  avoidsTalking: string;
  avoidsTalkingObservation: string;

  // Escrita e Alfabetização
  difficultyCopying: string;
  difficultyCopyingObservation: string;
  excessiveSpellingErrors: string;
  excessiveSpellingErrorsObservation: string;
  writingIssues: string;
  writingIssuesObservation: string;
  phoneticAssociationDifficulty: string;
  phoneticAssociationDifficultyObservation: string;
  writingLevel: string;
  writingLevelObservation: string;
  recognizesLettersOrWords: string;
  recognizesLettersOrWordsObservation: string;

  // Leitura
  readingFluencyIssues: string;
  readingFluencyIssuesObservation: string;
  answersReadingQuestions: string;
  answersReadingQuestionsObservation: string;
  avoidsReading: string;
  avoidsReadingObservation: string;

  // Matemática e Conceitos
  numberRecognitionIssues: string;
  numberRecognitionIssuesObservation: string;
  comparisonConceptDifficulty: string;
  comparisonConceptDifficultyObservation: string;
  basicOperationDifficulty: string;
  basicOperationDifficultyObservation: string;
  timeSpaceConceptDifficulty: string;
  timeSpaceConceptDifficultyObservation: string;

  // Autonomia e Comportamento
  difficultyOrganizingMaterials: string;
  difficultyOrganizingMaterialsObservation: string;
  needsHelpWithBasicActivities: string;
  needsHelpWithBasicActivitiesObservation: string;
  difficultyWithRoutines: string;
  difficultyWithRoutinesObservation: string;
  doesNotInitiateTasks: string;
  doesNotInitiateTasksObservation: string;
  immatureBehavior: string;
  immatureBehaviorObservation: string;
  prefersYoungerChildren: string;
  prefersYoungerChildrenObservation: string;

  // Desempenho Global e Atenção
  belowAgeLevelPerformance: string;
  belowAgeLevelPerformanceObservation: string;
  earlyChildhoodSkillLevel: string;
  earlyChildhoodSkillLevelObservation: string;
  forgetsContent: string;
  forgetsContentObservation: string;
  attentionDifficulty: string;
  attentionDifficultyObservation: string;
  easilyDistracted: string;
  easilyDistractedObservation: string;
  needsRepeatedExplanations: string;
  needsRepeatedExplanationsObservation: string;

  // Social e Emocional
  friendshipDifficulty: string;
  friendshipDifficultyObservation: string;
  easilyFrustrated: string;
  easilyFrustratedObservation: string;
  lowSelfEsteem: string;
  lowSelfEsteemObservation: string;
  dependsOnAdults: string;
  dependsOnAdultsObservation: string;

  // Observações Finais
  additionalComments: string;
};

export type UpdatePsychologistQuestionnaireDTO =
  CreatePsychologistQuestionnaireDTO & {
    id: string;
  };
