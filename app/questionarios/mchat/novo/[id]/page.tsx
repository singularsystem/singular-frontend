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
import { useCreateQuestionnaireMCHAT } from "@/hooks/useFetchMCHATQuestionnaire";
import { useFetchReport } from "@/hooks/useFetchReports";
import { opcoesMCHATR, perguntasMCHATR } from "@/lib/constants";
import { CreateMCHATDTO } from "@/types/mchat";
import { RespostasType } from "@/types/questionario";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function NovoQuestionarioMCHATR({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user, token } = useAuth();
  const [respostas, setRespostas] = useState<RespostasType>({});
  const unwrappedParams = use(params);
  const back = useBack("/relatorios");
  const id = unwrappedParams.id;
  const { createQuestionnaire, loading } = useCreateQuestionnaireMCHAT();
  const {
    relatorio,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchReport(id);

  const [formData, setFormData] = useState<CreateMCHATDTO>({
    studentID: "",
    userID: "",
    psychopedagogueReportID: "",
    followsPointingGesture: "",
    suspectedDeafness: "",
    pretendPlay: "",
    climbsObjects: "",
    unusualFingerMovementsNearEyes: "",
    pointsToRequest: "",
    pointsToShowInterest: "",
    interestedInOtherChildren: "",
    sharesObjectsForAttention: "",
    respondsToName: "",
    smilesBack: "",
    sensitiveToNoise: "",
    canWalk: "",
    maintainsEyeContact: "",
    imitatesActions: "",
    followsGaze: "",
    seeksAttention: "",
    understandsVerbalInstructions: "",
    checksFacialReactionToEvents: "",
    enjoysMovementActivities: "",
  });

  const mchatKeys: (keyof CreateMCHATDTO)[] = [
    "followsPointingGesture",
    "suspectedDeafness",
    "pretendPlay",
    "climbsObjects",
    "unusualFingerMovementsNearEyes",
    "pointsToRequest",
    "pointsToShowInterest",
    "interestedInOtherChildren",
    "sharesObjectsForAttention",
    "respondsToName",
    "smilesBack",
    "sensitiveToNoise",
    "canWalk",
    "maintainsEyeContact",
    "imitatesActions",
    "followsGaze",
    "seeksAttention",
    "understandsVerbalInstructions",
    "checksFacialReactionToEvents",
    "enjoysMovementActivities",
  ];

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

  const handleRespostaChange = (perguntaIndex: number, value: string) => {
    setRespostas((prev) => ({
      ...prev,
      [perguntaIndex]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!relatorio || !user) {
      toast({
        title: "Erro",
        description: "Usuário ou relatorio não carregado(s).",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const novoFormData: CreateMCHATDTO = { ...formData };

      mchatKeys.forEach((key, index) => {
        novoFormData[key] = respostas[index] ?? "";
      });

      novoFormData.studentID = relatorio.student.id;
      novoFormData.userID = user.id;
      novoFormData.psychopedagogueReportID = relatorio.psychopedagogueReport?.id || "";

      const created = await createQuestionnaire(novoFormData);
      console.log(created);

      toast({
        title: "Questionário M-CHAT salvo",
        description: "Questionário M-CHAT foi salvo com sucesso",
        variant: "success",
      });
      router.push(`/relatorios/novo/${relatorio?.id}`);
    } catch (error) {
      console.error("Erro ao salvar SNAP-IV:", error);

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
          <h1 className="text-3xl font-bold tracking-tight text-[#111C4E]">
            Novo Questionário M-CHAT-R
          </h1>
        </div>
      </div>
      <DetalhesEstudanteCard obj={relatorio} />;
      <form>
        <Card>
          <CardHeader>
            <CardTitle>Questionário MCHAT-R</CardTitle>
            <CardDescription>
              Preencha as informações da avaliação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {perguntasMCHATR.map((pergunta, index) => (
              <div key={index} className="mb-8 p-4 border-b border-gray-200">
                <p className="font-medium mb-4">
                  {index + 1}. {pergunta}
                </p>

                <div className="space-y-2">
                  <RadioGroup
                    value={respostas[index]?.toString()}
                    onValueChange={(value) =>
                      handleRespostaChange(index, value)
                    }
                  >
                    <div className="flex flex-col space-y-2">
                      {opcoesMCHATR.map((opcao, opcaoIndex) => (
                        <div
                          className="flex items-center space-x-2"
                          key={opcao}
                        >
                          <RadioGroupItem
                            value={opcao}
                            id={`pergunta-${index}-opcao-${opcaoIndex}`}
                            className="mt-0.5"
                          />
                          <Label
                            htmlFor={`pergunta-${index}-opcao-${opcaoIndex}`}
                          >
                            <span className="text-gray-700">{opcao}</span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </div>
            ))}

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
        actionDescription="cadastro de novo questinário"
        actionName="cadastro"
        route={back}
      />
    </main>
  );
}
