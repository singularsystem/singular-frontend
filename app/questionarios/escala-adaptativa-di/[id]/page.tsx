"use client";

import { DetalhesEstudanteCard } from "@/components/estudante/detalhes-estudante-card";
import { AdaptativeDIResultCard } from "@/components/questionario/adaptative-di-result";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useBack } from "@/hooks/use-back";
import { useToast } from "@/hooks/use-toast";
import { useFetchPsychologistReport } from "@/hooks/useFetchReports";
import {
  opcoesAdaptativeDIScale,
  perguntasAdaptativeDIScale,
} from "@/lib/constants";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function AdaptativeDIScale({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const back = useBack("/questionarios/escala-adaptativa-di");
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
    } else if (!relatorio) {
      toast({
        title: "Questionario não foi encontrado",
        description: "Por favor, cadastre relatorio!",
        variant: "info",
      });
    }
  }, [fetchError, fetchLoading, relatorio, toast]);

  const respostas = [
    relatorio?.adaptiveBehaviorScaleDI?.ageAppropriateReadingComprehension,
    relatorio?.adaptiveBehaviorScaleDI?.performsBasicMathematicalCalculations,
    relatorio?.adaptiveBehaviorScaleDI?.understandsTimeConcepts,
    relatorio?.adaptiveBehaviorScaleDI?.followsMultiStepInstructions,
    relatorio?.adaptiveBehaviorScaleDI?.interactsAppropriatelyWithPeers,
    relatorio?.adaptiveBehaviorScaleDI?.recognizesOwnAndOthersEmotions,
    relatorio?.adaptiveBehaviorScaleDI?.followsBasicSocialRules,
    relatorio?.adaptiveBehaviorScaleDI?.resolvesConflictsAppropriately,
    relatorio?.adaptiveBehaviorScaleDI?.maintainsPersonalHygieneIndependently,
    relatorio?.adaptiveBehaviorScaleDI?.organizesSchoolMaterials,
    relatorio?.adaptiveBehaviorScaleDI?.dressesAppropriately,
    relatorio?.adaptiveBehaviorScaleDI?.showsConfidenceInFamiliarEnvironments,
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
            Escala Adaptativa-DI
          </h1>
        </div>
        <Button
          className="gap-2"
          variant="outline"
          onClick={() =>
            router.push(
              `/questionarios/escala-adaptativa-di/${relatorio.id}/editar`,
            )
          }
        >
          Editar
        </Button>
      </div>

      <DetalhesEstudanteCard obj={relatorio} />
      <AdaptativeDIResultCard
        questionario={relatorio.adaptiveBehaviorScaleDI}
      />

      <Card>
        {perguntasAdaptativeDIScale.map((pergunta, index) => (
          <div key={index} className="mb-8 p-4 border-b border-gray-200">
            <p className="font-medium mb-4">{pergunta}</p>

            <div className="space-y-2">
              <RadioGroup value={respostas[index]}>
                <div className="flex flex-col space-y-2">
                  {opcoesAdaptativeDIScale.map((opcao, opcaoIndex) => (
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
