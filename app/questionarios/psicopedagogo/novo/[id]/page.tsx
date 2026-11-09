"use client";

import type React from "react";

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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { useBack } from "@/hooks/use-back";
import { useToast } from "@/hooks/use-toast";
import { useCreatePsychopedagogueQuestionnaire } from "@/hooks/useFetchPsychopedagogueQuestionnaire";
import { useFetchReport } from "@/hooks/useFetchReports";
import {
  CheckboxArrayField,
  CreatePsychopedagogueQuestionnaireDTO,
  mapPsychopedagogueQuestionnaireFormToApiPayload,
} from "@/types/questionario-psicopedagogo";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function NovoQuestionarioPsicopedagogo({
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
  const back = useBack("/relatorios");
  const id = unwrappedParams.id;
  const { createQuestionnaire, loading } =
    useCreatePsychopedagogueQuestionnaire();
  const {
    relatorio,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchReport(id);

  const [formData, setFormData] =
    useState<CreatePsychopedagogueQuestionnaireDTO>({
      studentID: "",
      userID: "",
      psychopedagogueReportID: "",
      comportamentalObservations: "",
      notebookObservations: "",
      otherObservations: "",
      typeOfDisability: [],
      otherTypesOfDisability: "",
      typeOfDisorder: [],
      justificationForClassification: "",
      recommendations: [],
      otherRecommendations: "",
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

  useEffect(() => {
    const isAdaptivePositive =
      !!relatorio?.psychologistReport?.adaptiveBehaviorScaleDI &&
      relatorio.psychologistReport.adaptiveBehaviorScaleDI.result !==
        "Sem atraso no desenvolvimento" &&
      relatorio.psychologistReport.adaptiveBehaviorScaleDI.result !==
        "Nenhum(a)";

    const isCognitivePositive =
      !!relatorio?.psychopedagogueReport?.cognitiveAssessment &&
      relatorio.psychopedagogueReport.cognitiveAssessment.percentage <= 55;

    const isBothPositive = isAdaptivePositive && isCognitivePositive;
    const hasIntellectualDisability = formData.typeOfDisability.includes(
      "Deficiência Intelectual",
    );

    if (isBothPositive && !hasIntellectualDisability && (relatorio?.student?.age ?? 0) >= 6) {
      setFormData((prev) => ({
        ...prev,
        typeOfDisability: [...prev.typeOfDisability, "Deficiência Intelectual"],
      }));
    } else if (!isBothPositive && hasIntellectualDisability) {
      setFormData((prev) => ({
        ...prev,
        typeOfDisability: prev.typeOfDisability.filter(
          (item) => item !== "Deficiência Intelectual",
        ),
      }));
    }
  }, [
    relatorio?.psychologistReport?.adaptiveBehaviorScaleDI?.result,
    relatorio?.psychopedagogueReport?.cognitiveAssessment?.percentage,
    relatorio?.student?.age,
  ]);

  useEffect(() => {
    const hasCARSAutism = relatorio?.psychopedagogueReport.carsQuestionnaire &&
      relatorio.psychopedagogueReport.carsQuestionnaire.totalScore !== "Até 30";

    const hasMCHATAutism = relatorio?.psychopedagogueReport.mchatQuestionnaire &&
      relatorio.psychopedagogueReport.mchatQuestionnaire.result !== "Baixo Risco";

    const shouldHaveTEA = hasCARSAutism || hasMCHATAutism;
    const TEA_CONST = "TEA (Transtorno do Espectro Autista)";

    setFormData((prev) => {
      const alreadyHas = prev.typeOfDisability.includes(TEA_CONST);
      if (shouldHaveTEA && !alreadyHas) {
        return {
          ...prev,
          typeOfDisability: [...prev.typeOfDisability, TEA_CONST],
        };
      } else if (!shouldHaveTEA && alreadyHas) {
        return {
          ...prev,
          typeOfDisability: prev.typeOfDisability.filter((t) => t !== TEA_CONST),
        };
      }
      return prev;
    });
  }, [
    relatorio?.psychopedagogueReport.carsQuestionnaire?.totalScore,
    relatorio?.psychopedagogueReport.mchatQuestionnaire?.result,
  ]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxArrayChange = (
    field: CheckboxArrayField,
    value: string,
    checked: boolean,
  ) => {
    setFormData((prev) => {
      const currentValues = prev[field];

      const updated = checked
        ? [...currentValues, value]
        : currentValues.filter((item) => item !== value);

      return {
        ...prev,
        [field]: updated,
      };
    });
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
      const payload = mapPsychopedagogueQuestionnaireFormToApiPayload(
        formData,
        relatorio?.student.id,
        user.id,
        relatorio.psychopedagogueReport?.id || "",
      );

      const created = await createQuestionnaire(payload);
      console.log(created);

      toast({
        title: "Questionário Psicopedagógico salvo",
        description: "Questionário Psicopedagógico foi salvo com sucesso.",
        variant: "success",
      });

      router.push(`/relatorios/novo/${relatorio?.id}`);
    } catch (error) {
      console.error("Erro ao salvar Questionário Psicopedagógico:", error);

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

  if (relatorio === null) {
    return;
  }

  const INTELLECTUAL_DISABILITY = "Deficiência Intelectual";
  const isIntellectualDisabilityMandatory =
    relatorio.psychopedagogueReport.cognitiveAssessment?.percentage <= 55;

  const TEA = "TEA (Transtorno do Espectro Autista)";
  const isTEAMandatory =
    relatorio.psychopedagogueReport.carsQuestionnaire?.totalScore !==
      "Até 30" ||
    relatorio.psychopedagogueReport.mchatQuestionnaire?.result !==
      "Baixo Risco";

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
            Novo Questionário Psicopedagógico
          </h1>
        </div>
      </div>
      <DetalhesEstudanteCard obj={relatorio} />;
      <form>
        <Card>
          <CardHeader>
            <CardTitle>Questionário Psicopedagógico</CardTitle>
            <CardDescription>
              Preencha as informações da avaliação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="comportamentalObservations">
                1. Observações Comportamentais
              </Label>
              <Textarea
                id="comportamentalObservations"
                name="comportamentalObservations"
                value={formData.comportamentalObservations}
                onChange={handleChange}
                placeholder="Descreva as observações comportamentais..."
                className="min-h-[150px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notebookObservations">
                2. Observações sobre o Caderno do Student
              </Label>
              <Textarea
                id="notebookObservations"
                name="notebookObservations"
                value={formData.notebookObservations}
                onChange={handleChange}
                placeholder="Descreva as observações sobre o caderno do(a) aluno(a)..."
                className="min-h-[150px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otherObservations">
                3. Outras Observações Relevantes
              </Label>
              <Textarea
                id="otherObservations"
                name="otherObservations"
                value={formData.otherObservations}
                onChange={handleChange}
                placeholder="Descreva outras observações relevantes..."
                className="min-h-[150px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="typeOfDisability">4. Tipo de Deficiência</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "TEA (Transtorno do Espectro Autista)",
                  "Deficiência Intelectual",
                  "Deficiência Física",
                  "Surdez",
                  "Baixa Visão",
                  "Deficiências Múltiplas",
                ]
                  .filter((type) => type !== "Deficiência Intelectual" || relatorio.student.age >= 6)
                  .map((typeOfDisability) => (
                  <div
                    key={typeOfDisability}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`typeOfDisability-${typeOfDisability}`}
                      checked={formData.typeOfDisability.includes(
                        typeOfDisability,
                      )}
                      disabled={
                        typeOfDisability === TEA ||
                        typeOfDisability === INTELLECTUAL_DISABILITY
                      }
                      onCheckedChange={(checked) => {
                        if (
                          typeOfDisability === TEA ||
                          typeOfDisability === INTELLECTUAL_DISABILITY
                        ) {
                          return;
                        }

                        handleCheckboxArrayChange(
                          "typeOfDisability",
                          typeOfDisability,
                          Boolean(checked),
                        );
                      }}
                    />
                    <Label
                      htmlFor={`typeOfDisability-${typeOfDisability}`}
                      className="text-gray-700"
                    >
                      {typeOfDisability}
                    </Label>
                  </div>
                ))}
              </div>
              <div className="pt-4 space-y-2">
                <Textarea
                  id="otherTypesOfDisability"
                  name="otherTypesOfDisability"
                  value={formData.otherTypesOfDisability}
                  onChange={handleChange}
                  placeholder="Outras deficiências não listadas..."
                  className="min-h-[150px]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="typeOfDisorder">5. Tipo de Transtorno</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  "Dislexia",
                  "Disgrafia",
                  "Disortografia",
                  "Discalculia",
                  "Apraxia de Fala",
                ].map((typeOfDisorder) => (
                  <div
                    key={typeOfDisorder}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`typeOfDisorder-${typeOfDisorder}`}
                      checked={formData.typeOfDisorder.includes(typeOfDisorder)}
                      onCheckedChange={(checked) =>
                        handleCheckboxArrayChange(
                          "typeOfDisorder",
                          typeOfDisorder,
                          Boolean(checked),
                        )
                      }
                    />
                    <Label
                      htmlFor={`typeOfDisorder-${typeOfDisorder}`}
                      className="text-gray-700"
                    >
                      {typeOfDisorder}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="justificationForClassification">
                6. Justificativa da Classificação
              </Label>
              <Textarea
                id="justificationForClassification"
                name="justificationForClassification"
                value={formData.justificationForClassification}
                onChange={handleChange}
                placeholder="Justifique a classificação..."
                className="min-h-[150px]"
              />
            </div>
            <div className="space-y-4">
              <Label htmlFor="recommendations" className="block">
                7. Recomendações
              </Label>

              <div className="grid grid-cols-2 gap-2">
                {[
                  "Encaminhamento para avaliação médica especializada",
                  "Acompanhamento psicopedagógico regular",
                  "Adaptações curriculares necessárias",
                  "Recursos de tecnologia assistiva",
                  "Apoio de professor auxiliar/mediador",
                  "Atividades diferenciadas em sala de aula",
                  "Mais tempo para realização de atividades e avaliações",
                  "Material pedagógico adaptado",
                  "Comunicação alternativa",
                  "Trabalho colaborativo com equipe multidisciplinar",
                  "Orientação familiar",
                  "Elaboração de PEI (Plano Educacional Individualizado)",
                  "Elaboração de PAEE (Plano de Atendimento Educacional Especializado)",
                ].map((recommendation) => (
                  <div
                    key={recommendation}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={`recommendation-${recommendation}`}
                      checked={formData.recommendations.includes(
                        recommendation,
                      )}
                      onCheckedChange={(checked) =>
                        handleCheckboxArrayChange(
                          "recommendations",
                          recommendation,
                          Boolean(checked),
                        )
                      }
                    />
                    <Label
                      htmlFor={`recommendation-${recommendation}`}
                      className="text-gray-700"
                    >
                      {recommendation}
                    </Label>
                  </div>
                ))}
              </div>

              <div className="pt-4 space-y-2">
                <Textarea
                  id="otherRecommendations"
                  name="otherRecommendations"
                  value={formData.otherRecommendations}
                  onChange={handleChange}
                  placeholder="Escreva observações complementares aqui..."
                  className="min-h-[150px]"
                />
              </div>
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
        actionDescription="cadastro de nova escala"
        actionName="cadastro"
        route={back}
      />
    </main>
  );
}
