"use client";
export const dynamic = "force-dynamic";
import { DetalhesEstudanteCard } from "@/components/estudante/detalhes-estudante-card";
import { TabPsicopedagogico } from "@/components/relatorio/psychopedagogue-report";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBack } from "@/hooks/use-back";
import { useToast } from "@/hooks/use-toast";
import { useFetchPsychopedagogueReport } from "@/hooks/useFetchReports";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function RelatoriosPsicopedagogico({
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
    } else if (relatorio === null) {
      toast({
        title: "Relatorio não foi encontrado",
        description: "Por favor, cadastre relatorio!",
        variant: "info",
      });
    }
  }, [fetchError, fetchLoading, relatorio, toast]);

  if (relatorio === null) {
    return;
  }

  return (
    <main className="flex-1 p-6">
      <div className="flex flex-col space-y-6">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={back}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight text-brand-navy">
              Relatório Psicopedagógico
            </h1>
          </div>

          <div>
            <Button
              className="gap-2"
              variant="outline"
              onClick={() =>
                router.push(`/relatorios/${relatorio.reportID}/editar`)
              }
            >
              Editar
            </Button>
          </div>
        </div>
        <DetalhesEstudanteCard obj={relatorio} />;
        <Card>
          <CardHeader>
            <CardTitle>Avaliação Psicopedagógica</CardTitle>
            <CardDescription>Data: {relatorio?.localCreatedAt}</CardDescription>
          </CardHeader>
          <CardContent>
            <TabPsicopedagogico relatorio={relatorio} />
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-muted-foreground">
              Última atualização: {new Date().toLocaleString()}
            </p>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
