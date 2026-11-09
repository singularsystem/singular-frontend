"use client";

import type React from "react";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { DetalhesEstudanteCard } from "@/components/estudante/detalhes-estudante-card";
import { ScreeningQuestion } from "@/components/screening-question";
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
import { useFetchStudent } from "@/hooks/useFetchStudents";
import { screeningSections } from "@/lib/constants";
import {
  CreateEvaluationScreeningDTO,
  EvaluationScreening,
} from "@/types/triagem";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function NovoEvaluationScreening({
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
    aluno,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchStudent(id);

  const [formData, setFormData] = useState<CreateEvaluationScreeningDTO>({
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
        title: "Erro ao buscar aluno",
        description: fetchError.message || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    } else if (!aluno) {
      toast({
        title: "Aluno não foi encontrado",
        description: "Por favor, cadastre aluno!",
        variant: "info",
      });
    }
  }, [fetchError, fetchLoading, aluno, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (
    field: keyof EvaluationScreening,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!aluno || !user) {
      toast({
        title: "Erro",
        description: "Usuário ou aluno(a) não carregado(s).",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      formData.studentID = aluno.id;
      formData.userID = user.id;

      const response = await fetch(
        `${apiUrl}/api/v1/regular-teacher-screenings`,
        {
          method: "POST",
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

  if (!aluno) {
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
          <h1 className="text-3xl font-bold tracking-tight text-[#111C4E]">
            Nova Triagem
          </h1>
        </div>
      </div>
      <DetalhesEstudanteCard obj={aluno} />;
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
                <h3 className="text-xl font-semibold text-[#111C4E] border-b pb-2">
                  {section.title}
                </h3>

                <div className="grid gap-6">
                  {section.questions.map((q) => (
                    <ScreeningQuestion
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
                className="bg-[#111C4E] hover:bg-blue-800"
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
        actionDescription="cadastro de nova triagem"
        actionName="cadastro"
        route="/professor-triagem"
      />
    </main>
  );
}
