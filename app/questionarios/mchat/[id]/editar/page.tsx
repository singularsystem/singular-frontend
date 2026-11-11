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
import { useFetchPsychopedagogueReport } from "@/hooks/useFetchReports";
import { opcoesMCHATR, perguntasMCHATR } from "@/lib/constants";
import { UpdateMCHATDTO } from "@/types/mchat";
import { RespostasType } from "@/types/questionario";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function EditarQuestionarioMCHATR({
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
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const unwrappedParams = use(params);
  const back = useBack("/relatorios");
  const id = unwrappedParams.id;
  const {
    relatorio,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchPsychopedagogueReport(id);

  const [formData, setFormData] = useState<UpdateMCHATDTO>({
    id: "",
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

  useEffect(() => {
    if (relatorio) {
      const respostasIniciais = [
        relatorio.mchatQuestionnaire?.followsPointingGesture,
        relatorio.mchatQuestionnaire?.suspectedDeafness,
        relatorio.mchatQuestionnaire?.pretendPlay,
        relatorio.mchatQuestionnaire?.climbsObjects,
        relatorio.mchatQuestionnaire?.unusualFingerMovementsNearEyes,
        relatorio.mchatQuestionnaire?.pointsToRequest,
        relatorio.mchatQuestionnaire?.pointsToShowInterest,
        relatorio.mchatQuestionnaire?.interestedInOtherChildren,
        relatorio.mchatQuestionnaire?.sharesObjectsForAttention,
        relatorio.mchatQuestionnaire?.respondsToName,
        relatorio.mchatQuestionnaire?.smilesBack,
        relatorio.mchatQuestionnaire?.sensitiveToNoise,
        relatorio.mchatQuestionnaire?.canWalk,
        relatorio.mchatQuestionnaire?.maintainsEyeContact,
        relatorio.mchatQuestionnaire?.imitatesActions,
        relatorio.mchatQuestionnaire?.followsGaze,
        relatorio.mchatQuestionnaire?.seeksAttention,
        relatorio.mchatQuestionnaire?.understandsVerbalInstructions,
        relatorio.mchatQuestionnaire?.checksFacialReactionToEvents,
        relatorio.mchatQuestionnaire?.enjoysMovementActivities,
      ];

      const respostasObj: RespostasType = {};
      respostasIniciais.forEach((resposta, index) => {
        respostasObj[index] = resposta || "";
      });

      setRespostas(respostasObj);
    }
  }, [relatorio]);

  const handleRespostaChange = (perguntaIndex: number, value: string) => {
    setRespostas((prev) => ({
      ...prev,
      [perguntaIndex]: value,
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
      const campos = Object.keys(formData).filter(
        (key) => !["studentID", "userID", "id", "psychopedagogueReportID"].includes(key),
      );

      const novoFormData: UpdateMCHATDTO = {
        ...formData,
      };

      campos.forEach((campo, index) => {
        const resposta = respostas[index];
        novoFormData[campo as keyof UpdateMCHATDTO] = resposta ?? "";
      });

      novoFormData.id = relatorio.mchatQuestionnaire.id;
      novoFormData.studentID = relatorio.student.id;
      novoFormData.userID = user.id;
      novoFormData.psychopedagogueReportID = relatorio.id;

      const response = await fetch(`${apiUrl}/api/v1/mchat-questionnaires`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(novoFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        toast({
          variant: "destructive",
          title: "Erro ao editar questionário",
          description:
            errorData.message ||
            "Ocorreu um erro ao tentar editar o questionário. Por favor, tente novamente.",
        });
        return;
      }

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Questionário M-CHAT-R editado",
          description: "Questionário M-CHAT-R foi atualizado com sucesso",
          variant: "success",
        });
        router.push(`/questionarios/mchat/${relatorio.id}`);
      } else {
        console.error("Server reported an issue:", result.message);
        toast({
          variant: "destructive",
          title: "Erro ao salvar questionário",
          description:
            result.message ||
            "Ocorreu um erro desconhecido ao salvar o questionário.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar questionário",
        description: "Ocorreu um erro ao tentar salvar o questionário",
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
            Editar Questionário M-CHAT-R
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
                    onValueChange={(value) =>
                      handleRespostaChange(index, value)
                    }
                    value={respostas[index]}
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
