"use client";

import { DetalhesEstudanteCard } from "@/components/estudante/detalhes-estudante-card";
import { MCHATResultCard } from "@/components/questionario/mchat-result";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useBack } from "@/hooks/use-back";
import { useToast } from "@/hooks/use-toast";
import { useFetchPsychopedagogueReport } from "@/hooks/useFetchReports";
import { opcoesMCHATR, perguntasMCHATR } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function QuestionarioMCHATR({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const back = useBack("/relatorios");
  const {
    relatorio,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchPsychopedagogueReport(id);

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
        title: "Relatorio não foi encontrado",
        description: "Por favor, cadastre relatorio!",
        variant: "info",
      });
    }
  }, [fetchError, fetchLoading, relatorio, toast]);

  const respostas = [
    relatorio?.mchatQuestionnaire?.followsPointingGesture,
    relatorio?.mchatQuestionnaire?.suspectedDeafness,
    relatorio?.mchatQuestionnaire?.pretendPlay,
    relatorio?.mchatQuestionnaire?.climbsObjects,
    relatorio?.mchatQuestionnaire?.unusualFingerMovementsNearEyes,
    relatorio?.mchatQuestionnaire?.pointsToRequest,
    relatorio?.mchatQuestionnaire?.pointsToShowInterest,
    relatorio?.mchatQuestionnaire?.interestedInOtherChildren,
    relatorio?.mchatQuestionnaire?.sharesObjectsForAttention,
    relatorio?.mchatQuestionnaire?.respondsToName,
    relatorio?.mchatQuestionnaire?.smilesBack,
    relatorio?.mchatQuestionnaire?.sensitiveToNoise,
    relatorio?.mchatQuestionnaire?.canWalk,
    relatorio?.mchatQuestionnaire?.maintainsEyeContact,
    relatorio?.mchatQuestionnaire?.imitatesActions,
    relatorio?.mchatQuestionnaire?.followsGaze,
    relatorio?.mchatQuestionnaire?.seeksAttention,
    relatorio?.mchatQuestionnaire?.understandsVerbalInstructions,
    relatorio?.mchatQuestionnaire?.checksFacialReactionToEvents,
    relatorio?.mchatQuestionnaire?.enjoysMovementActivities,
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
            Questionário M-CHAT-R
          </h1>
        </div>
        <div>
          <Button
            className="gap-2"
            variant="outline"
            onClick={() =>
              router.push(
                `/questionarios/mchat/${relatorio.id}/editar`,
              )
            }
          >
            Editar
          </Button>
        </div>
      </div>
      <DetalhesEstudanteCard obj={relatorio} />;
      <Card>
        {perguntasMCHATR.map((pergunta, index) => (
          <div key={index} className="mb-8 p-4 border-b border-gray-200">
            <p className="font-medium mb-4">{pergunta}</p>

            <div className="space-y-2">
              <RadioGroup value={respostas[index]}>
                <div className="flex flex-col space-y-2">
                  {opcoesMCHATR.map((opcao, opcaoIndex) => (
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

        <div>
          <MCHATResultCard questionario={relatorio.mchatQuestionnaire} />
        </div>
      </Card>
    </main>
  );
}
