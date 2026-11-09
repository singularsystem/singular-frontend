"use client";

import { CognitiveAssessmentQuestionView } from "@/components/cognitive-assessment-question-view";
import { DetalhesEstudanteCard } from "@/components/estudante/detalhes-estudante-card";
import { CognitiveAssessmentResultCard } from "@/components/questionario/cognitive-result";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useBack } from "@/hooks/use-back";
import { useToast } from "@/hooks/use-toast";
import { useFetchPsychopedagogueReport } from "@/hooks/useFetchReports";
import { CognitiveAssessmentSections } from "@/lib/constants";
import { CognitiveAssessment } from "@/types/cognitive-assessment";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function PageCognitiveAssessment({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const back = useBack("/questionarios/avaliacao-cognitiva");
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
        title: "Questionario não foi encontrado",
        description: "Por favor, cadastre relatorio!",
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
          <h1 className="text-3xl font-bold tracking-tight text-[#111C4E]">
            Avaliação Cognitiva
          </h1>
        </div>
        <div>
          <Button
            className="gap-2"
            variant="outline"
            onClick={() =>
              router.push(
                `/questionarios/avaliacao-cognitiva/${relatorio.id}/editar`,
              )
            }
          >
            Editar
          </Button>
        </div>
      </div>
      <DetalhesEstudanteCard obj={relatorio} />
      <CognitiveAssessmentResultCard
        questionario={relatorio.cognitiveAssessment}
      />
      <Card>
        <div className="mx-10 p-10 text-justify space-y-6">
          {CognitiveAssessmentSections.map((section) => (
            <div key={section.title} className="space-y-6">
              <h3 className="text-xl font-semibold text-[#111C4E] border-b pb-2">
                {section.title}
              </h3>

              <div className="grid gap-6">
                {section.questions.map((q) => (
                  <CognitiveAssessmentQuestionView
                    key={q.field}
                    label={q.label}
                    fieldName={q.field as keyof CognitiveAssessment}
                    data={relatorio.cognitiveAssessment!}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </main>
  );
}
