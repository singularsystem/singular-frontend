"use client";

import type React from "react";

import { CognitiveAssessmentQuestionEdit } from "@/components/cognitive-assessment-question-edit";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { DetalhesEstudanteCard } from "@/components/estudante/detalhes-estudante-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useBack } from "@/hooks/use-back";
import { useToast } from "@/hooks/use-toast";
import { useUpdateCognitiveAssessment } from "@/hooks/useFetchCognitiveAssessment";
import { useFetchPsychopedagogueReport } from "@/hooks/useFetchReports";
import { CognitiveAssessmentSections } from "@/lib/constants";
import {
  CognitiveAssessment,
  UpdateCognitiveAssessmentDTO,
} from "@/types/cognitive-assessment";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function EditarAvaliacaoCognitiva({
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
  const { updateQuestionnaire, loading } = useUpdateCognitiveAssessment();
  const {
    relatorio,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchPsychopedagogueReport(id);

  const [formData, setFormData] = useState<UpdateCognitiveAssessmentDTO>({
    id: "",
    studentID: "",
    userID: "",
    psychopedagogueReportID: "",
    identifiedBasicColors: "",
    identifiedBasicShapes: "",
    completesAgeAppropriatePuzzles: "",
    groupsObjectsBySimilarCharacteristics: "",
    identifiesVisualSequencePatterns: "",
    understandsSimpleVerbalInstructions: "",
    namesCommonEverydayObjects: "",
    formsAgeAppropriateSentences: "",
    answersQuestionsAboutFamilyInformation: "",
    understandsBasicAbstractConcepts: "",
    remembersTwoToThreeStepInstructions: "",
    maintainsAttentionForAppropriateDuration: "",
    recognizesFamiliarPeopleAndPlaces: "",
    recallsRecentEvents: "",
    repeatsSimpleSequences: "",
    seeksSolutionsToSimpleEverydayProblems: "",
    demonstratesCreativityInPlay: "",
    learnsFromExperience: "",
    understandsCauseAndEffectRelationships: "",
    adaptsStrategiesWhenSomethingDoesNotWork: "",
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
    if (relatorio?.cognitiveAssessment) {
      setFormData({
        id: relatorio?.cognitiveAssessment.id || "",
        studentID: relatorio?.student.id || "",
        userID: user?.id || "",
        psychopedagogueReportID:
          relatorio?.cognitiveAssessment.psychopedagogueReportID || "",
        identifiedBasicColors:
          relatorio?.cognitiveAssessment.identifiedBasicColors || "",
        identifiedBasicShapes:
          relatorio?.cognitiveAssessment.identifiedBasicShapes || "",
        completesAgeAppropriatePuzzles:
          relatorio?.cognitiveAssessment.completesAgeAppropriatePuzzles || "",
        groupsObjectsBySimilarCharacteristics:
          relatorio?.cognitiveAssessment
            .groupsObjectsBySimilarCharacteristics || "",
        identifiesVisualSequencePatterns:
          relatorio?.cognitiveAssessment.identifiesVisualSequencePatterns || "",
        understandsSimpleVerbalInstructions:
          relatorio?.cognitiveAssessment.understandsSimpleVerbalInstructions ||
          "",
        namesCommonEverydayObjects:
          relatorio?.cognitiveAssessment.namesCommonEverydayObjects || "",
        formsAgeAppropriateSentences:
          relatorio?.cognitiveAssessment.formsAgeAppropriateSentences || "",
        answersQuestionsAboutFamilyInformation:
          relatorio?.cognitiveAssessment
            .answersQuestionsAboutFamilyInformation || "",
        understandsBasicAbstractConcepts:
          relatorio?.cognitiveAssessment.understandsBasicAbstractConcepts || "",
        remembersTwoToThreeStepInstructions:
          relatorio?.cognitiveAssessment.remembersTwoToThreeStepInstructions ||
          "",
        maintainsAttentionForAppropriateDuration:
          relatorio?.cognitiveAssessment
            .maintainsAttentionForAppropriateDuration || "",
        recognizesFamiliarPeopleAndPlaces:
          relatorio?.cognitiveAssessment.recognizesFamiliarPeopleAndPlaces ||
          "",
        recallsRecentEvents:
          relatorio?.cognitiveAssessment.recallsRecentEvents || "",
        repeatsSimpleSequences:
          relatorio?.cognitiveAssessment.repeatsSimpleSequences || "",
        seeksSolutionsToSimpleEverydayProblems:
          relatorio?.cognitiveAssessment
            .seeksSolutionsToSimpleEverydayProblems || "",
        demonstratesCreativityInPlay:
          relatorio?.cognitiveAssessment.demonstratesCreativityInPlay || "",
        learnsFromExperience:
          relatorio?.cognitiveAssessment.learnsFromExperience || "",
        understandsCauseAndEffectRelationships:
          relatorio?.cognitiveAssessment
            .understandsCauseAndEffectRelationships || "",
        adaptsStrategiesWhenSomethingDoesNotWork:
          relatorio?.cognitiveAssessment
            .adaptsStrategiesWhenSomethingDoesNotWork || "",
      });
    }
  }, [relatorio, user]);

  const handleCheckboxChange = (
    field: keyof CognitiveAssessment,
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
      const novoFormData: UpdateCognitiveAssessmentDTO = {
        ...formData,
      };

      const created = await updateQuestionnaire(novoFormData);
      console.log(created);

      toast({
        title: "Avaliação Cognitiva editada",
        description: "Avaliação Cognitiva foi atualizada com sucesso",
        variant: "success",
      });
      router.push(`/relatorios/${relatorio.id}/psicopedagogo`);
    } catch (error) {
      console.error("Erro ao atualizar Avaliação Cognitiva:", error);

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
          <h1 className="text-3xl font-bold tracking-tight text-brand-navy">
            Editar Avaliação Cognitiva
          </h1>
        </div>
      </div>
      <DetalhesEstudanteCard obj={relatorio} />;
      <form>
        <Card>
          <CardHeader>
            <CardTitle>Avaliação Cognitiva</CardTitle>
            <CardDescription>
              Preencha as informações da avaliação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {CognitiveAssessmentSections.map((section) => (
              <div key={section.title} className="space-y-6">
                <h3 className="text-xl font-semibold text-brand-navy border-b pb-2">
                  {section.title}
                </h3>

                <div className="grid gap-6">
                  {section.questions.map((q) => (
                    <CognitiveAssessmentQuestionEdit
                      key={q.field}
                      label={q.label}
                      fieldName={q.field as keyof CognitiveAssessment}
                      formData={formData}
                      handleCheckboxChange={handleCheckboxChange}
                    />
                  ))}
                </div>
              </div>
            ))}

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
        actionDescription="edição de questinário"
        actionName="edição"
        route={back}
      />
    </main>
  );
}
