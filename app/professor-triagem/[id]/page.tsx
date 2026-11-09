"use client";

import { DetalhesEstudanteCard } from "@/components/estudante/detalhes-estudante-card";
import { ScreeningQuestionView } from "@/components/screening-question-view";
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
import { useFetchTeacherScreeningById } from "@/hooks/useFetchTeacherScreenings";
import { screeningSections } from "@/lib/constants";
import { EvaluationScreening } from "@/types/triagem";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function TeacherEvaluationScreening({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("completo");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const back = useBack("/professor-triagem");

  const {
    screening,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchTeacherScreeningById(id);

  useEffect(() => {
    if (fetchLoading) return;

    if (fetchError) {
      toast({
        title: "Erro ao buscar triagem",
        description: fetchError.message || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    } else if (!screening) {
      toast({
        title: "Triagem não foi encontrado",
        description: "Por favor, cadastre triagem!",
        variant: "info",
      });
    }
  }, [fetchError, fetchLoading, screening, toast]);

  if (!screening) {
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
            Triagem Professor Regular
          </h1>
        </div>
        <div>
          <Button
            className="gap-2"
            variant="outline"
            onClick={() =>
              router.push(`/professor-triagem/${screening.id}/editar`)
            }
          >
            Editar
          </Button>
        </div>
      </div>
      <DetalhesEstudanteCard obj={screening} />;
      <Card className="mb-6 p-6">
        <CardHeader>
          <CardTitle>Triagem do Professor Regular</CardTitle>
          <CardDescription>
            <p className="text-muted-foreground">
              Data: {screening?.localCreatedAt}
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent id="completo-content" className="space-y-4">
          <div className="mb-10 px-10 text-justify space-y-6">
            {screeningSections.map((section) => (
              <div key={section.title} className="space-y-6">
                <h3 className="text-xl font-semibold text-[#111C4E] border-b pb-2">
                  {section.title}
                </h3>

                <div className="grid gap-6">
                  {section.questions.map((q) => (
                    <ScreeningQuestionView
                      key={q.field}
                      label={q.label}
                      fieldName={q.field as keyof EvaluationScreening}
                      observationFieldName={q.obs as keyof EvaluationScreening}
                      type={q.type}
                      options={q.options}
                      data={screening!}
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
                {screening?.additionalComments}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
