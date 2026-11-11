"use client";

import { DetalhesEstudanteCard } from "@/components/estudante/detalhes-estudante-card";
import { PsychologistQuestionView } from "@/components/psychologist-question-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBack } from "@/hooks/use-back";
import { useToast } from "@/hooks/use-toast";
import { useFetchPsychologistReport } from "@/hooks/useFetchReports";
import { screeningSections } from "@/lib/constants";
import { PsychologistQuestionnaire } from "@/types/questionario-psicologo";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function QuestionarioPsicologo({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const back = useBack("/questionarios/psicologo");
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
            Questionário de Triagem
          </h1>
        </div>
        <div>
          <Button
            className="gap-2"
            variant="outline"
            onClick={() =>
              router.push(
                `/questionarios/psicologo/${relatorio.reportID}/editar`,
              )
            }
          >
            Editar
          </Button>
        </div>
      </div>
      <DetalhesEstudanteCard obj={relatorio} />
      <Card className="mb-6 p-6">
        <CardHeader>
          <CardTitle>Questionário</CardTitle>
        </CardHeader>
        <CardContent id="completo-content" className="space-y-4">
          <div className="space-y-2 px-10 text-justify">
            <p className="text-muted-foreground">
              Data: {relatorio?.psychologistQuestionnaire.localCreatedAt}
            </p>
          </div>

          <div className="mb-10 px-10 text-justify space-y-6">
            {screeningSections
              .filter(
                (section) =>
                  section.title !== "Histórico Educacional e Funcional",
              )
              .map((section) => (
                <div key={section.title} className="space-y-6">
                  <h3 className="text-xl font-semibold text-brand-navy border-b pb-2">
                    {section.title}
                  </h3>

                  <div className="grid gap-6">
                    {section.questions.map((q) => (
                      <PsychologistQuestionView
                        key={q.field}
                        label={q.label}
                        fieldName={q.field as keyof PsychologistQuestionnaire}
                        observationFieldName={
                          q.obs as keyof PsychologistQuestionnaire
                        }
                        type={q.type}
                        options={q.options}
                        data={relatorio!.psychologistQuestionnaire}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>

          <div className="mb-10 px-10 text-justify">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold  mb-4">
                18. Relate qualquer informação que não tenha sido abordada ou
                que julgue importantes.
              </h4>
              <p className="whitespace-pre-wrap break-words">
                {relatorio?.psychologistQuestionnaire.additionalComments}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
