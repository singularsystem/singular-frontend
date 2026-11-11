"use client";

import { DetalhesEstudanteCard } from "@/components/estudante/detalhes-estudante-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBack } from "@/hooks/use-back";
import { useToast } from "@/hooks/use-toast";
import { useFetchPsychopedagogueReport } from "@/hooks/useFetchReports";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function PsychopedagogueQuestionnaire({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const back = useBack("/questionarios/psicopedagogo");
  const {
    relatorio,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchPsychopedagogueReport(id);

  useEffect(() => {
    if (fetchLoading) return;

    if (fetchError) {
      toast({
        title: "Erro ao buscar questionario",
        description: fetchError.message || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    } else if (!relatorio) {
      toast({
        title: "Questionario não foi encontrado",
        description: "Por favor, cadastre questionario!",
        variant: "info",
      });
    }
  }, [fetchError, fetchLoading, relatorio, toast]);

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
          <h1 className="text-3xl font-bold tracking-tight text-brand-navy">
            Questionário Psicopedagógico
          </h1>
        </div>
        <div>
          <Button
            className="gap-2"
            variant="outline"
            onClick={() =>
              router.push(
                `/questionarios/psicopedagogo/${relatorio.reportID}/editar`,
              )
            }
          >
            Editar
          </Button>
        </div>
      </div>
      <DetalhesEstudanteCard obj={relatorio} />;
      <Card>
        <CardHeader>
          <CardTitle>Questionário Psicopedagógico</CardTitle>
          <CardDescription>
            Preencha as informações da avaliação psicopedagógica
          </CardDescription>
        </CardHeader>
        <CardContent id="completo-content" className="space-y-4">
          <div className="space-y-2 px-10 text-justify">
            <p className="text-muted-foreground">
              Data: {relatorio.psychopedagogueQuestionnaire?.localCreatedAt}
            </p>
          </div>

          <div className="space-y-2 px-10 text-justify my-4">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold  mb-4">
                1. Contexto da Avaliação
              </h4>
              <p>
                Esta avaliação NÃO se trata de laudo médico e nem tampouco
                substitui a avaliação de um profissional médico. Trata-se de uma
                triagem com intuito exclusivamente pedagógico e de fornecer
                informações para a melhoria acadêmica do estudante.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-semibold  mb-4">
                2. Metodologia Utilizada
              </h4>
              <p>{`Escalas utilizadas: MCHAT (TEA < 36 meses), CARS (TEA ≥ 36 meses), Escala de Funcionamento Intelectual.`}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-semibold  mb-4">
                3. Observações Comportamentais
              </h4>
              <p className="whitespace-pre-wrap break-words">
                {
                  relatorio.psychopedagogueQuestionnaire
                    ?.comportamentalObservations
                }
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-semibold  mb-4">
                4. Observações sobre o Caderno do Student
              </h4>
              <p className="whitespace-pre-wrap break-words">
                {relatorio.psychopedagogueQuestionnaire?.notebookObservations}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-semibold  mb-4">
                5. Outras Observações Relevantes
              </h4>
              <p className="whitespace-pre-wrap break-words">
                {relatorio.psychopedagogueQuestionnaire?.otherObservations}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-semibold  mb-4">
                7. Tipo de Deficiência
              </h4>
              <p>
                Deficiências selecionadas:{" "}
                {relatorio.psychopedagogueQuestionnaire?.typeOfDisability
                  .map((o) => o.disability.toLowerCase())
                  .join(", ")}
              </p>
              {relatorio.psychopedagogueQuestionnaire
                ?.otherTypesOfDisability !== null &&
                relatorio.psychopedagogueQuestionnaire
                  ?.otherTypesOfDisability !== "" && (
                  <p>
                    Observações:{" "}
                    {
                      relatorio.psychopedagogueQuestionnaire
                        ?.otherTypesOfDisability
                    }
                  </p>
                )}
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-semibold  mb-4">
                7. Tipo de Transtorno
              </h4>
              <p>
                Transtornos selecionados:{" "}
                {relatorio.psychopedagogueQuestionnaire?.typeOfDisorder
                  .map((o) => o.disorder.toLowerCase())
                  .join(", ")}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-semibold  mb-4">
                8. Justificativa da Classificação
              </h4>
              <p className="whitespace-pre-wrap break-words">
                {
                  relatorio.psychopedagogueQuestionnaire
                    ?.justificationForClassification
                }
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="text-lg font-semibold  mb-4">7. Recomendações</h4>
              <p>
                Deficiências selecionadas:{" "}
                {relatorio.psychopedagogueQuestionnaire?.recommendations
                  .map((o) => o.recommendation.toLowerCase())
                  .join(", ")}
              </p>
              {relatorio.psychopedagogueQuestionnaire?.otherRecommendations !==
                null &&
                relatorio.psychopedagogueQuestionnaire?.otherRecommendations !==
                  "" && (
                  <p>
                    Observações:{" "}
                    {
                      relatorio.psychopedagogueQuestionnaire
                        ?.otherRecommendations
                    }
                  </p>
                )}
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
