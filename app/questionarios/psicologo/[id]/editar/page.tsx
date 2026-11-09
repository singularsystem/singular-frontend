"use client";

import type React from "react";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { DetalhesEstudanteCard } from "@/components/estudante/detalhes-estudante-card";
import { PsychologistEditQuestion } from "@/components/psychologist-question-edit";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { useBack } from "@/hooks/use-back";
import { useToast } from "@/hooks/use-toast";
import { useUpdatePsychologistQuestionnaire } from "@/hooks/useFetchPsychologistQuestionnaire";
import { useFetchReport } from "@/hooks/useFetchReports";
import { screeningSections } from "@/lib/constants";
import {
  PsychologistQuestionnaire,
  UpdatePsychologistQuestionnaireDTO,
} from "@/types/questionario-psicologo";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function EditarAdaptativeDIScale({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user } = useAuth();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const back = useBack("/relatorios");
  const { updateQuestionnaire, loading } = useUpdatePsychologistQuestionnaire();
  const {
    relatorio,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchReport(id);

  const [formData, setFormData] = useState<UpdatePsychologistQuestionnaireDTO>({
    id: "",
    studentID: "",
    userID: "",
    psychologistReportID: "",

    limitedVocabulary: "",
    limitedVocabularyObservation: "",
    childlikeSpeech: "",
    childlikeSpeechObservation: "",
    difficultyFollowingCommands: "",
    difficultyFollowingCommandsObservation: "",
    delayedResponse: "",
    delayedResponseObservation: "",
    avoidsTalking: "",
    avoidsTalkingObservation: "",

    difficultyCopying: "",
    difficultyCopyingObservation: "",
    excessiveSpellingErrors: "",
    excessiveSpellingErrorsObservation: "",
    writingIssues: "",
    writingIssuesObservation: "",
    phoneticAssociationDifficulty: "",
    phoneticAssociationDifficultyObservation: "",
    writingLevel: "",
    writingLevelObservation: "",
    recognizesLettersOrWords: "",
    recognizesLettersOrWordsObservation: "",

    readingFluencyIssues: "",
    readingFluencyIssuesObservation: "",
    answersReadingQuestions: "",
    answersReadingQuestionsObservation: "",
    avoidsReading: "",
    avoidsReadingObservation: "",

    numberRecognitionIssues: "",
    numberRecognitionIssuesObservation: "",
    comparisonConceptDifficulty: "",
    comparisonConceptDifficultyObservation: "",
    basicOperationDifficulty: "",
    basicOperationDifficultyObservation: "",
    timeSpaceConceptDifficulty: "",
    timeSpaceConceptDifficultyObservation: "",

    difficultyOrganizingMaterials: "",
    difficultyOrganizingMaterialsObservation: "",
    needsHelpWithBasicActivities: "",
    needsHelpWithBasicActivitiesObservation: "",
    difficultyWithRoutines: "",
    difficultyWithRoutinesObservation: "",
    doesNotInitiateTasks: "",
    doesNotInitiateTasksObservation: "",
    immatureBehavior: "",
    immatureBehaviorObservation: "",
    prefersYoungerChildren: "",
    prefersYoungerChildrenObservation: "",

    belowAgeLevelPerformance: "",
    belowAgeLevelPerformanceObservation: "",
    earlyChildhoodSkillLevel: "",
    earlyChildhoodSkillLevelObservation: "",
    forgetsContent: "",
    forgetsContentObservation: "",
    attentionDifficulty: "",
    attentionDifficultyObservation: "",
    easilyDistracted: "",
    easilyDistractedObservation: "",
    needsRepeatedExplanations: "",
    needsRepeatedExplanationsObservation: "",

    friendshipDifficulty: "",
    friendshipDifficultyObservation: "",
    easilyFrustrated: "",
    easilyFrustratedObservation: "",
    lowSelfEsteem: "",
    lowSelfEsteemObservation: "",
    dependsOnAdults: "",
    dependsOnAdultsObservation: "",

    additionalComments: "",
  });

  useEffect(() => {
    if (fetchLoading) return;

    if (fetchError) {
      toast({
        title: "Erro ao buscar relatorio",
        description: fetchError.message || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    } else if (!relatorio) {
      toast({
        title: "Questionario não foi encontrado",
        description: "Por favor, cadastre relatorio!",
        variant: "info",
      });
    }
  }, [fetchError, fetchLoading, relatorio, toast]);

  useEffect(() => {
    const questionnaire =
      relatorio?.psychologistReport?.psychologistQuestionnaire;

    if (!questionnaire) return;

    setFormData({
      id: questionnaire.id,
      studentID: relatorio.student?.id,
      userID: relatorio.professional?.id,
      psychologistReportID: relatorio.psychologistReport?.id,

      limitedVocabulary: questionnaire.limitedVocabulary ?? "",
      limitedVocabularyObservation:
        questionnaire.limitedVocabularyObservation ?? "",
      childlikeSpeech: questionnaire.childlikeSpeech ?? "",
      childlikeSpeechObservation:
        questionnaire.childlikeSpeechObservation ?? "",
      difficultyFollowingCommands:
        questionnaire.difficultyFollowingCommands ?? "",
      difficultyFollowingCommandsObservation:
        questionnaire.difficultyFollowingCommandsObservation ?? "",
      delayedResponse: questionnaire.delayedResponse ?? "",
      delayedResponseObservation:
        questionnaire.delayedResponseObservation ?? "",
      avoidsTalking: questionnaire.avoidsTalking ?? "",
      avoidsTalkingObservation: questionnaire.avoidsTalkingObservation ?? "",

      difficultyCopying: questionnaire.difficultyCopying ?? "",
      difficultyCopyingObservation:
        questionnaire.difficultyCopyingObservation ?? "",
      excessiveSpellingErrors: questionnaire.excessiveSpellingErrors ?? "",
      excessiveSpellingErrorsObservation:
        questionnaire.excessiveSpellingErrorsObservation ?? "",
      writingIssues: questionnaire.writingIssues ?? "",
      writingIssuesObservation: questionnaire.writingIssuesObservation ?? "",
      phoneticAssociationDifficulty:
        questionnaire.phoneticAssociationDifficulty ?? "",
      phoneticAssociationDifficultyObservation:
        questionnaire.phoneticAssociationDifficultyObservation ?? "",
      writingLevel: questionnaire.writingLevel ?? "",
      writingLevelObservation: questionnaire.writingLevelObservation ?? "",
      recognizesLettersOrWords: questionnaire.recognizesLettersOrWords ?? "",
      recognizesLettersOrWordsObservation:
        questionnaire.recognizesLettersOrWordsObservation ?? "",

      readingFluencyIssues: questionnaire.readingFluencyIssues ?? "",
      readingFluencyIssuesObservation:
        questionnaire.readingFluencyIssuesObservation ?? "",
      answersReadingQuestions: questionnaire.answersReadingQuestions ?? "",
      answersReadingQuestionsObservation:
        questionnaire.answersReadingQuestionsObservation ?? "",
      avoidsReading: questionnaire.avoidsReading ?? "",
      avoidsReadingObservation: questionnaire.avoidsReadingObservation ?? "",

      numberRecognitionIssues: questionnaire.numberRecognitionIssues ?? "",
      numberRecognitionIssuesObservation:
        questionnaire.numberRecognitionIssuesObservation ?? "",
      comparisonConceptDifficulty:
        questionnaire.comparisonConceptDifficulty ?? "",
      comparisonConceptDifficultyObservation:
        questionnaire.comparisonConceptDifficultyObservation ?? "",
      basicOperationDifficulty: questionnaire.basicOperationDifficulty ?? "",
      basicOperationDifficultyObservation:
        questionnaire.basicOperationDifficultyObservation ?? "",
      timeSpaceConceptDifficulty:
        questionnaire.timeSpaceConceptDifficulty ?? "",
      timeSpaceConceptDifficultyObservation:
        questionnaire.timeSpaceConceptDifficultyObservation ?? "",

      difficultyOrganizingMaterials:
        questionnaire.difficultyOrganizingMaterials ?? "",
      difficultyOrganizingMaterialsObservation:
        questionnaire.difficultyOrganizingMaterialsObservation ?? "",
      needsHelpWithBasicActivities:
        questionnaire.needsHelpWithBasicActivities ?? "",
      needsHelpWithBasicActivitiesObservation:
        questionnaire.needsHelpWithBasicActivitiesObservation ?? "",
      difficultyWithRoutines: questionnaire.difficultyWithRoutines ?? "",
      difficultyWithRoutinesObservation:
        questionnaire.difficultyWithRoutinesObservation ?? "",
      doesNotInitiateTasks: questionnaire.doesNotInitiateTasks ?? "",
      doesNotInitiateTasksObservation:
        questionnaire.doesNotInitiateTasksObservation ?? "",
      immatureBehavior: questionnaire.immatureBehavior ?? "",
      immatureBehaviorObservation:
        questionnaire.immatureBehaviorObservation ?? "",
      prefersYoungerChildren: questionnaire.prefersYoungerChildren ?? "",
      prefersYoungerChildrenObservation:
        questionnaire.prefersYoungerChildrenObservation ?? "",

      belowAgeLevelPerformance: questionnaire.belowAgeLevelPerformance ?? "",
      belowAgeLevelPerformanceObservation:
        questionnaire.belowAgeLevelPerformanceObservation ?? "",
      earlyChildhoodSkillLevel: questionnaire.earlyChildhoodSkillLevel ?? "",
      earlyChildhoodSkillLevelObservation:
        questionnaire.earlyChildhoodSkillLevelObservation ?? "",
      forgetsContent: questionnaire.forgetsContent ?? "",
      forgetsContentObservation: questionnaire.forgetsContentObservation ?? "",
      attentionDifficulty: questionnaire.attentionDifficulty ?? "",
      attentionDifficultyObservation:
        questionnaire.attentionDifficultyObservation ?? "",
      easilyDistracted: questionnaire.easilyDistracted ?? "",
      easilyDistractedObservation:
        questionnaire.easilyDistractedObservation ?? "",
      needsRepeatedExplanations: questionnaire.needsRepeatedExplanations ?? "",
      needsRepeatedExplanationsObservation:
        questionnaire.needsRepeatedExplanationsObservation ?? "",

      friendshipDifficulty: questionnaire.friendshipDifficulty ?? "",
      friendshipDifficultyObservation:
        questionnaire.friendshipDifficultyObservation ?? "",
      easilyFrustrated: questionnaire.easilyFrustrated ?? "",
      easilyFrustratedObservation:
        questionnaire.easilyFrustratedObservation ?? "",
      lowSelfEsteem: questionnaire.lowSelfEsteem ?? "",
      lowSelfEsteemObservation: questionnaire.lowSelfEsteemObservation ?? "",
      dependsOnAdults: questionnaire.dependsOnAdults ?? "",
      dependsOnAdultsObservation:
        questionnaire.dependsOnAdultsObservation ?? "",

      additionalComments: questionnaire.additionalComments ?? "",
    });
  }, [relatorio]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (
    field: keyof PsychologistQuestionnaire,
    value: "Sim" | "Não",
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!user || !relatorio) {
      toast({
        title: "Erro",
        description: "Usuário ou questionário não carregado(s).",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const updated = await updateQuestionnaire(formData);
      console.log(updated);

      toast({
        title: "Questionário IPAAGS editado",
        description: "Questionário IPAAGS foi atualizado com sucesso",
        variant: "success",
      });
      router.push(`/relatorios/${relatorio.psychologistReport.id}/psicologo`);
    } catch (error) {
      console.error("Erro ao atualizar Escala Adaptativa-DI:", error);

      toast({
        variant: "destructive",
        title: "Erro ao atualizar questionário",
        description:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro ao tentar atualizar o questionário.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!relatorio) {
    return;
  }

  return (
    <main className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowConfirm(true)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-[#111C4E]">
            Editar Questionário IPAAGS
          </h1>
        </div>
      </div>
      <DetalhesEstudanteCard obj={relatorio} />
      <form>
        <Card>
          <CardHeader>
            <CardTitle>Questionário IPAAGS</CardTitle>
            <CardDescription>
              Preencha as informações da avaliação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {screeningSections
              .filter(
                (section) =>
                  section.title !== "Histórico Educacional e Funcional",
              )
              .map((section) => (
                <div key={section.title} className="space-y-6">
                  <h3 className="text-xl font-semibold text-[#111C4E] border-b pb-2">
                    {section.title}
                  </h3>

                  <div className="grid gap-6">
                    {section.questions.map((q) => (
                      <PsychologistEditQuestion
                        key={q.field}
                        label={q.label}
                        fieldName={q.field as keyof PsychologistQuestionnaire}
                        observationFieldName={
                          q.obs as keyof PsychologistQuestionnaire
                        }
                        type={q.type}
                        options={q.options}
                        formData={formData}
                        handleCheckboxChange={handleCheckboxChange}
                        setFormData={setFormData}
                      />
                    ))}
                  </div>
                </div>
              ))}

            <div className="space-y-4 ">
              <Label
                htmlFor="additionalComments"
                className="block text-lg font-medium leading-relaxed text-slate-900"
              >
                Observações adicionais
              </Label>
              <Textarea
                id="additionalComments"
                name="additionalComments"
                value={formData.additionalComments}
                onChange={handleChange}
                placeholder="Escreva qualquer informação adicional que julgue importante..."
                className="min-h-[150px]"
              />
            </div>
            <div className="mt-6 mb-20 flex justify-end">
              <Button
                type="submit"
                className="bg-[#111C4E] hover:bg-blue-800"
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? "Salvando..." : "Salvar Questionário"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        actionDescription="edição de questinário"
        actionName="edição"
        route={back}
      />
    </main>
  );
}
