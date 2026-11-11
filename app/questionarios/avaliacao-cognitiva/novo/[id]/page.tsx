"use client";

import type React from "react";

import { CognitiveAssessmentQuestion } from "@/components/cognitive-assessment-question";
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
import { useCreateCognitiveAssessment } from "@/hooks/useFetchCognitiveAssessment";
import { useFetchReport } from "@/hooks/useFetchReports";
import { CognitiveAssessmentSections } from "@/lib/constants";
import {
  CognitiveAssessment,
  CreateCognitiveAssessmentDTO,
} from "@/types/cognitive-assessment";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function NovaAvaliacaoCognitiva({
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
  const { createQuestionnaire, loading } = useCreateCognitiveAssessment();
  const {
    relatorio,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchReport(id);

  const [formData, setFormData] = useState<CreateCognitiveAssessmentDTO>({
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
    }
  }, [fetchError, fetchLoading, relatorio, toast]);

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
      const campos = Object.keys(formData).filter(
        (key) => !["studentID", "userID", "id"].includes(key),
      );

      const novoFormData: CreateCognitiveAssessmentDTO = {
        ...formData,
        studentID: relatorio.student.id,
        userID: user.id,
        psychopedagogueReportID: relatorio.psychopedagogueReport?.id || "",
      };

      const created = await createQuestionnaire(novoFormData);
      console.log(created);

      toast({
        title: "Avaliação Cognitiva salva",
        description: "Avaliação Cognitiva foi salva com sucesso.",
        variant: "success",
      });

      router.push(`/relatorios/novo/${relatorio?.id}`);
    } catch (error) {
      console.error("Erro ao salvar Avaliação Cognitiva:", error);

      toast({
        variant: "destructive",
        title: "Erro ao salvar questionário",
        description:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro ao tentar salvar a escala.",
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
            Novo Avaliação Cognitiva
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
                    <CognitiveAssessmentQuestion
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
        actionDescription="cadastro de nova escala"
        actionName="cadastro"
        route={back}
      />
    </main>
  );
}
