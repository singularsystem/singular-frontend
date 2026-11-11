"use client";

import type React from "react";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { DetalhesEstudanteCard } from "@/components/estudante/detalhes-estudante-card";
import { PsychologistQuestion } from "@/components/psychologist-question";
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
import { useCreatePsychologistQuestionnaire } from "@/hooks/useFetchPsychologistQuestionnaire";
import { useFetchReport } from "@/hooks/useFetchReports";
import { screeningSections } from "@/lib/constants";
import {
  CreatePsychologistQuestionnaireDTO,
  PsychologistQuestionnaire,
} from "@/types/questionario-psicologo";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function NovoQuestionarioPsicologo({
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
  const { createQuestionnaire, loading } = useCreatePsychologistQuestionnaire();
  const {
    relatorio,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchReport(id);

  const [formData, setFormData] = useState<CreatePsychologistQuestionnaireDTO>({
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
    }
  }, [fetchError, fetchLoading, relatorio, toast]);

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

    if (!relatorio || !user) {
      toast({
        title: "Erro",
        description: "Usuário ou relatório não carregado(s).",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      formData.studentID = relatorio.student.id;
      formData.userID = user.id;
      formData.psychologistReportID = relatorio?.psychologistReport?.id || "";

      const created = await createQuestionnaire(formData);
      console.log(created);

      toast({
        title: "Questionário de Triagem salvo",
        description: "Questionário de Triagem foi salvo com sucesso.",
        variant: "success",
      });

      router.push(`/relatorios/novo/${relatorio?.id}`);
    } catch (error) {
      console.error("Erro ao salvar Questionário de Triagem:", error);

      toast({
        variant: "destructive",
        title: "Erro ao salvar questionário",
        description:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro ao tentar salvar o questionário.",
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
          <h1 className="text-3xl font-bold tracking-tight">
            Novo Questionário de Triagem
          </h1>
        </div>
      </div>
      <DetalhesEstudanteCard obj={relatorio} />;
      <form>
        <Card>
          <CardHeader>
            <CardTitle>Questionário de Triagem</CardTitle>
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
                  <h3 className="text-xl font-semibold text-brand-navy border-b pb-2">
                    {section.title}
                  </h3>

                  <div className="grid gap-6">
                    {section.questions.map((q) => (
                      <PsychologistQuestion
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
                className="bg-brand-navy hover:bg-blue-800"
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
        actionDescription="cadastro de nova escala"
        actionName="cadastro"
        route={back}
      />
    </main>
  );
}
