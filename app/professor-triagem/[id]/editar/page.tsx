"use client";

import type React from "react";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { DetalhesEstudanteCard } from "@/components/estudante/detalhes-estudante-card";
import { ScreeningEditQuestion } from "@/components/screening-question-edit";
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
import { useToast } from "@/hooks/use-toast";
import { useFetchTeacherScreeningById } from "@/hooks/useFetchTeacherScreenings";
import { screeningSections } from "@/lib/constants";
import {
  EvaluationScreening,
  UpdateEvaluationScreeningDTO,
} from "@/types/triagem";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function EditarEvaluationScreening({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user, token } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const {
    screening,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchTeacherScreeningById(id);

  const [formData, setFormData] = useState<UpdateEvaluationScreeningDTO>({
    id: "",
    studentID: "",
    userID: "",
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
    lowAcademicHistory: "",
    lowAcademicHistoryObservation: "",
    noProgressWithSupport: "",
    noProgressWithSupportObservation: "",
    previousReportsIndicateImpairment: "",
    previousReportsIndicateImpairmentObservation: "",
    curricularAdaptations: "",
    curricularAdaptationsObservation: "",
    additionalComments: "",
  });

  useEffect(() => {
    if (fetchLoading) return;

    if (fetchError) {
      toast({
        title: "Erro ao buscar triagem",
        description: fetchError.message || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    } else if (!screening) {
      toast({
        title: "Triagem não foi encontrado",
        description: "Por favor, cadastre triagem!",
        variant: "info",
      });
    }
  }, [fetchError, fetchLoading, screening, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (
    field: keyof EvaluationScreening,
    value: boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value ? "Sim" : "Não",
    }));
  };

  useEffect(() => {
    if (screening) {
      setFormData({
        id: screening.id || "",
        studentID: screening.student.id || "",
        userID: user?.id || "",
        limitedVocabulary: screening.limitedVocabulary || "",
        limitedVocabularyObservation:
          screening.limitedVocabularyObservation || "",
        childlikeSpeech: screening.childlikeSpeech || "",
        childlikeSpeechObservation: screening.childlikeSpeechObservation || "",
        difficultyFollowingCommands:
          screening.difficultyFollowingCommands || "",
        difficultyFollowingCommandsObservation:
          screening.difficultyFollowingCommandsObservation || "",
        delayedResponse: screening.delayedResponse || "",
        delayedResponseObservation: screening.delayedResponseObservation || "",
        avoidsTalking: screening.avoidsTalking || "",
        avoidsTalkingObservation: screening.avoidsTalkingObservation || "",
        difficultyCopying: screening.difficultyCopying || "",
        difficultyCopyingObservation:
          screening.difficultyCopyingObservation || "",
        excessiveSpellingErrors: screening.excessiveSpellingErrors || "",
        excessiveSpellingErrorsObservation:
          screening.excessiveSpellingErrorsObservation || "",
        writingIssues: screening.writingIssues || "",
        writingIssuesObservation: screening.writingIssuesObservation || "",
        phoneticAssociationDifficulty:
          screening.phoneticAssociationDifficulty || "",
        phoneticAssociationDifficultyObservation:
          screening.phoneticAssociationDifficultyObservation || "",
        writingLevel: screening.writingLevel || "",
        writingLevelObservation: screening.writingLevelObservation || "",
        recognizesLettersOrWords: screening.recognizesLettersOrWords || "",
        recognizesLettersOrWordsObservation:
          screening.recognizesLettersOrWordsObservation || "",
        readingFluencyIssues: screening.readingFluencyIssues || "",
        readingFluencyIssuesObservation:
          screening.readingFluencyIssuesObservation || "",
        answersReadingQuestions: screening.answersReadingQuestions || "",
        answersReadingQuestionsObservation:
          screening.answersReadingQuestionsObservation || "",
        avoidsReading: screening.avoidsReading || "",
        avoidsReadingObservation: screening.avoidsReadingObservation || "",
        numberRecognitionIssues: screening.numberRecognitionIssues || "",
        numberRecognitionIssuesObservation:
          screening.numberRecognitionIssuesObservation || "",
        comparisonConceptDifficulty:
          screening.comparisonConceptDifficulty || "",
        comparisonConceptDifficultyObservation:
          screening.comparisonConceptDifficultyObservation || "",
        basicOperationDifficulty: screening.basicOperationDifficulty || "",
        basicOperationDifficultyObservation:
          screening.basicOperationDifficultyObservation || "",
        timeSpaceConceptDifficulty: screening.timeSpaceConceptDifficulty || "",
        timeSpaceConceptDifficultyObservation:
          screening.timeSpaceConceptDifficultyObservation || "",
        difficultyOrganizingMaterials:
          screening.difficultyOrganizingMaterials || "",
        difficultyOrganizingMaterialsObservation:
          screening.difficultyOrganizingMaterialsObservation || "",
        needsHelpWithBasicActivities:
          screening.needsHelpWithBasicActivities || "",
        needsHelpWithBasicActivitiesObservation:
          screening.needsHelpWithBasicActivitiesObservation || "",
        difficultyWithRoutines: screening.difficultyWithRoutines || "",
        difficultyWithRoutinesObservation:
          screening.difficultyWithRoutinesObservation || "",
        doesNotInitiateTasks: screening.doesNotInitiateTasks || "",
        doesNotInitiateTasksObservation:
          screening.doesNotInitiateTasksObservation || "",
        immatureBehavior: screening.immatureBehavior || "",
        immatureBehaviorObservation:
          screening.immatureBehaviorObservation || "",
        prefersYoungerChildren: screening.prefersYoungerChildren || "",
        prefersYoungerChildrenObservation:
          screening.prefersYoungerChildrenObservation || "",
        belowAgeLevelPerformance: screening.belowAgeLevelPerformance || "",
        belowAgeLevelPerformanceObservation:
          screening.belowAgeLevelPerformanceObservation || "",
        earlyChildhoodSkillLevel: screening.earlyChildhoodSkillLevel || "",
        earlyChildhoodSkillLevelObservation:
          screening.earlyChildhoodSkillLevelObservation || "",
        forgetsContent: screening.forgetsContent || "",
        forgetsContentObservation: screening.forgetsContentObservation || "",
        attentionDifficulty: screening.attentionDifficulty || "",
        attentionDifficultyObservation:
          screening.attentionDifficultyObservation || "",
        easilyDistracted: screening.easilyDistracted || "",
        easilyDistractedObservation:
          screening.easilyDistractedObservation || "",
        needsRepeatedExplanations: screening.needsRepeatedExplanations || "",
        needsRepeatedExplanationsObservation:
          screening.needsRepeatedExplanationsObservation || "",
        friendshipDifficulty: screening.friendshipDifficulty || "",
        friendshipDifficultyObservation:
          screening.friendshipDifficultyObservation || "",
        easilyFrustrated: screening.easilyFrustrated || "",
        easilyFrustratedObservation:
          screening.easilyFrustratedObservation || "",
        lowSelfEsteem: screening.lowSelfEsteem || "",
        lowSelfEsteemObservation: screening.lowSelfEsteemObservation || "",
        dependsOnAdults: screening.dependsOnAdults || "",
        dependsOnAdultsObservation: screening.dependsOnAdultsObservation || "",
        lowAcademicHistory: screening.lowAcademicHistory || "",
        lowAcademicHistoryObservation:
          screening.lowAcademicHistoryObservation || "",
        noProgressWithSupport: screening.noProgressWithSupport || "",
        noProgressWithSupportObservation:
          screening.noProgressWithSupportObservation || "",
        previousReportsIndicateImpairment:
          screening.previousReportsIndicateImpairment || "",
        previousReportsIndicateImpairmentObservation:
          screening.previousReportsIndicateImpairmentObservation || "",
        curricularAdaptations: screening.curricularAdaptations || "",
        curricularAdaptationsObservation:
          screening.curricularAdaptationsObservation || "",
        additionalComments: screening.additionalComments || "",
      });
    }
  }, [screening, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!screening || !user) {
      toast({
        title: "Erro",
        description: "Usuário ou triagem não carregado(s).",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      formData.studentID = screening.student.id;
      formData.userID = user.id;

      const response = await fetch(
        `${apiUrl}/api/v1/regular-teacher-screenings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        toast({
          variant: "destructive",
          title: "Erro ao salvar triagem",
          description:
            errorData.message ||
            "Ocorreu um erro ao tentar salvar a triagem. Por favor, tente novamente.",
        });
        return;
      }

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Triagem salva",
          description: "A triagem foi salva com sucesso",
          variant: "success",
        });
        router.push(`/professor-triagem`);
      } else {
        console.error("Server reported an issue:", result.message);
        toast({
          variant: "destructive",
          title: "Erro ao salvar triagem",
          description:
            result.message ||
            "Ocorreu um erro desconhecido ao salvar a triagem.",
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar triagem",
        description: "Ocorreu um erro ao tentar salvar a triagem",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!screening) {
    return;
  }

  return (
    <main className="flex-1 p-6 items-center">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowConfirm(true)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-brand-navy">
            Editar Triagem
          </h1>
        </div>
      </div>
      <DetalhesEstudanteCard obj={screening} />;
      <form onSubmit={handleSubmit}>
        <Card className="mb-6 p-6">
          <CardHeader>
            <CardTitle>Triagem do Professor Regular</CardTitle>
            <CardDescription>
              Preencha as informações da triagem
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {screeningSections.map((section) => (
              <div key={section.title} className="space-y-6">
                <h3 className="text-xl font-semibold text-brand-navy border-b pb-2">
                  {section.title}
                </h3>

                <div className="grid gap-6">
                  {section.questions.map((q) => (
                    <ScreeningEditQuestion
                      key={q.field}
                      label={q.label}
                      fieldName={q.field as keyof EvaluationScreening}
                      observationFieldName={q.obs as keyof EvaluationScreening}
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
                Observações adicionais do Professor
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
                className="bg-brand-navy hover:bg-blue-800"
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? "Salvando..." : "Salvar Triagem"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        actionDescription="edição de triagem"
        actionName="edição"
        route="/professor-triagem"
      />
    </main>
  );
}
