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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/auth-context";
import { useBack } from "@/hooks/use-back";
import { useToast } from "@/hooks/use-toast";
import { useFetchPsychologistReport } from "@/hooks/useFetchReports";
import { useUpdateQuestionnaireSNAPIV } from "@/hooks/useFetchSnapIVQuestionnaire";
import { opcoesSnapIV, perguntasSNAPIV } from "@/lib/constants";
import { UpdateSNAPIVDTO } from "@/types/snapiv";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function EditarQuestionarioSNAPIV({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user } = useAuth();
  const back = useBack("/relatorios");
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const { updateQuestionnaire, loading } = useUpdateQuestionnaireSNAPIV();
  const {
    relatorio,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchPsychologistReport(id);

  type SnapIVAnswersOnly = Omit<
    UpdateSNAPIVDTO,
    "id" | "studentID" | "userID" | "psychologistReportID"
  >;

  const QUESTION_FIELDS: (keyof SnapIVAnswersOnly)[] = [
    "hasCarelessMistakes",
    "hasDifficultySustainingAttention",
    "appearsNotToListenWhenSpokenToDirectly",
    "failsToFollowThroughOnInstructions",
    "hasDifficultyOrganizingTasksAndActivities",
    "avoidsTasksRequiringSustainedMentalEffort",
    "oftenLosesItemsNecessaryForTasks",
    "easilyDistractedByExternalStimuli",
    "forgetfulInDailyActivities",
    "fidgetsWithHandsOrFeet",
    "leavesSeatInSituationsRequiringSitting",
    "runsOrClimbsInappropriately",
    "hasDifficultyPlayingQuietly",
    "oftenOnTheGoOrActsAsDrivenByAMotor",
    "talksExcessively",
    "blurtsOutAnswers",
    "hasDifficultyWaitingTurn",
    "interruptsOrIntrudesOnOthers",
  ];
  type SnapIVField = (typeof QUESTION_FIELDS)[number];
  type RespostasSnapIV = Partial<Record<SnapIVField, string>>;
  const [respostas, setRespostas] = useState<RespostasSnapIV>({});

  useEffect(() => {
    if (fetchLoading) return;

    if (fetchError) {
      toast({
        title: "Erro ao buscar relatorio",
        description: fetchError.message || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    } else if (relatorio == null) {
      toast({
        title: "Questionario não foi encontrado",
        description: "Por favor, cadastre relatorio!",
        variant: "info",
      });
    }
  }, [fetchError, fetchLoading, relatorio, toast]);

  useEffect(() => {
    if (!relatorio) return;

    const respostasIniciais: RespostasSnapIV = {};

    QUESTION_FIELDS.forEach((field) => {
      respostasIniciais[field] = relatorio.snapIVQuestionnaire[field] ?? "";
    });

    setRespostas(respostasIniciais);
  }, [relatorio]);

  const handleRespostaChange = (field: SnapIVField, value: string) => {
    setRespostas((prev) => ({
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
      const novoFormData: UpdateSNAPIVDTO = {
        studentID: relatorio.student.id,
        userID: user.id,
        psychologistReportID: relatorio.id,
        id: relatorio.snapIVQuestionnaire.id,
        hasCarelessMistakes: "",
        hasDifficultySustainingAttention: "",
        appearsNotToListenWhenSpokenToDirectly: "",
        failsToFollowThroughOnInstructions: "",
        hasDifficultyOrganizingTasksAndActivities: "",
        avoidsTasksRequiringSustainedMentalEffort: "",
        oftenLosesItemsNecessaryForTasks: "",
        easilyDistractedByExternalStimuli: "",
        forgetfulInDailyActivities: "",
        fidgetsWithHandsOrFeet: "",
        leavesSeatInSituationsRequiringSitting: "",
        runsOrClimbsInappropriately: "",
        hasDifficultyPlayingQuietly: "",
        oftenOnTheGoOrActsAsDrivenByAMotor: "",
        talksExcessively: "",
        blurtsOutAnswers: "",
        hasDifficultyWaitingTurn: "",
        interruptsOrIntrudesOnOthers: "",
      };

      QUESTION_FIELDS.forEach((field) => {
        novoFormData[field] = respostas[field] ?? "";
      });

      const created = await updateQuestionnaire(novoFormData);

      toast({
        title: "Questionário SNAP IV editado",
        description: "Questionário SNAP IV foi atualizado com sucesso",
        variant: "success",
      });
      router.push(`/relatorios/${relatorio.id}/psicologo`);
    } catch (error) {
      console.error("Erro ao atualizar SNAP-IV:", error);

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
            Editar Questionário SNAP IV
          </h1>
        </div>
      </div>
      <DetalhesEstudanteCard obj={relatorio} />;
      <form>
        <Card>
          <CardHeader>
            <CardTitle>Questionário SNAP IV</CardTitle>
            <CardDescription>
              Preencha as informações da avaliação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {QUESTION_FIELDS.map((field, index) => (
              <div key={field} className="mb-8 p-4 border-b border-gray-200">
                <p className="font-medium mb-4">
                  {index + 1}. {perguntasSNAPIV[index]}
                </p>

                <RadioGroup
                  value={respostas[field] ?? ""}
                  onValueChange={(value) => handleRespostaChange(field, value)}
                >
                  <div className="flex flex-col space-y-2">
                    {opcoesSnapIV.map((opcao) => (
                      <div key={opcao} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={opcao}
                          id={`${field}-${opcao}`}
                        />
                        <Label htmlFor={`${field}-${opcao}`}>
                          <span className="text-gray-700">{opcao}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
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
