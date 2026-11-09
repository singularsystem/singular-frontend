"use client";

import { DetalhesEstudanteCard } from "@/components/estudante/detalhes-estudante-card";
import { SNAPIVResultCard } from "@/components/questionario/snapiv-result";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/auth-context";
import { useBack } from "@/hooks/use-back";
import { useToast } from "@/hooks/use-toast";
import { useFetchPsychologistReport } from "@/hooks/useFetchReports";
import { useFetchQuestionnaireSNAPIV } from "@/hooks/useFetchSnapIVQuestionnaire";
import { opcoesSnapIV, perguntasSNAPIV } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function QuestionarioSNAPIV({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const back = useBack("/questionarios/snapiv");
  const {
    relatorio,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchPsychologistReport(id);

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

  const respostas = [
    relatorio?.snapIVQuestionnaire?.hasCarelessMistakes,
    relatorio?.snapIVQuestionnaire?.hasDifficultySustainingAttention,
    relatorio?.snapIVQuestionnaire?.appearsNotToListenWhenSpokenToDirectly,
    relatorio?.snapIVQuestionnaire?.failsToFollowThroughOnInstructions,
    relatorio?.snapIVQuestionnaire?.hasDifficultyOrganizingTasksAndActivities,
    relatorio?.snapIVQuestionnaire?.avoidsTasksRequiringSustainedMentalEffort,
    relatorio?.snapIVQuestionnaire?.oftenLosesItemsNecessaryForTasks,
    relatorio?.snapIVQuestionnaire?.easilyDistractedByExternalStimuli,
    relatorio?.snapIVQuestionnaire?.forgetfulInDailyActivities,
    relatorio?.snapIVQuestionnaire?.fidgetsWithHandsOrFeet,
    relatorio?.snapIVQuestionnaire?.leavesSeatInSituationsRequiringSitting,
    relatorio?.snapIVQuestionnaire?.runsOrClimbsInappropriately,
    relatorio?.snapIVQuestionnaire?.hasDifficultyPlayingQuietly,
    relatorio?.snapIVQuestionnaire?.oftenOnTheGoOrActsAsDrivenByAMotor,
    relatorio?.snapIVQuestionnaire?.talksExcessively,
    relatorio?.snapIVQuestionnaire?.blurtsOutAnswers,
    relatorio?.snapIVQuestionnaire?.hasDifficultyWaitingTurn,
    relatorio?.snapIVQuestionnaire?.interruptsOrIntrudesOnOthers,
  ];

  if (!relatorio) {
    return;
  }

  return (
    <main className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={back}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-[#111C4E]">
            Questionário SNAP IV
          </h1>
        </div>
        <div>
          <Button
            className="gap-2"
            variant="outline"
            onClick={() =>
              router.push(`/questionarios/snapiv/${relatorio.id}/editar`)
            }
          >
            Editar
          </Button>
        </div>
      </div>
      <DetalhesEstudanteCard obj={relatorio} />
      <SNAPIVResultCard questionario={relatorio.snapIVQuestionnaire} />
      <Card>
        {perguntasSNAPIV.map((pergunta, index) => (
          <div key={index} className="mb-8 p-4 border-b border-gray-200">
            <p className="font-medium mb-4">{pergunta}</p>

            <div className="space-y-2">
              <RadioGroup value={respostas[index]}>
                <div className="flex flex-col space-y-2">
                  {opcoesSnapIV.map((opcao, opcaoIndex) => (
                    <div className="flex items-center space-x-2" key={opcao}>
                      <RadioGroupItem
                        value={opcao}
                        id={`pergunta-${index}-opcao-${opcaoIndex}`}
                        className="mt-0.5"
                        disabled
                      />
                      <Label htmlFor={`pergunta-${index}-opcao-${opcaoIndex}`}>
                        <span className="text-gray-700">{opcao}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>
        ))}
      </Card>
    </main>
  );
}
