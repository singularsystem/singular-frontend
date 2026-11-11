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
import { UpdateCARSDTO } from "@/types/cars";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function EditarQuestionarioCARSChildhood({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user, token } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [totalRange, setTotalRange] = useState<
    "Até 30" | "30 até 36.5" | "37 até 60" | ""
  >("");
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const back = useBack("/relatorios");
  const {
    relatorio,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchPsychopedagogueReport(id);

  const [formData, setFormData] = useState<UpdateCARSDTO>({
    id: "",
    studentID: "",
    userID: "",
    psychopedagogueReportID: "",
    totalScore: "",
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
        title: "Questionario não foi encontrado",
        description: "Por favor, cadastre relatorio!",
        variant: "info",
      });
    }
  }, [fetchError, fetchLoading, relatorio, toast]);

  useEffect(() => {
    if (relatorio) {
      setFormData({
        id: relatorio.carsQuestionnaire.id || "",
        studentID: relatorio.student.id || "",
        userID: user?.id || "",
        psychopedagogueReportID: relatorio.id || "",
        totalScore: relatorio.carsQuestionnaire.totalScore || "",
      });

      setTotalRange(
        (relatorio.carsQuestionnaire.totalScore as
          | "Até 30"
          | "30 até 36.5"
          | "37 até 60") ?? "",
      );
    }
  }, [relatorio, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!relatorio || !user) {
      toast({
        title: "Erro",
        description: "Usuário ou questionário não carregado(s).",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      formData.studentID = relatorio?.student.id;
      formData.userID = user.id;

      if (!totalRange) {
        toast({
          title: "Selecione a faixa de pontuação",
          description: "Escolha uma das opções de pontuação total do CARS.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      formData.totalScore = totalRange;

      const response = await fetch(`${apiUrl}/api/v1/cars-questionnaires`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        toast({
          variant: "destructive",
          title: "Erro ao editar questionário",
          description:
            errorData.message ||
            "Ocorreu um erro ao tentar atualizar o questionário. Por favor, tente novamente.",
        });
        return;
      }

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Questionário CARS Childhood editado",
          description: "Questionário CARS Childhood foi atualizado com sucesso",
          variant: "success",
        });
        router.push(`/relatorios/${relatorio.id}/psicopedagogo`);
      } else {
        console.error("Server reported an issue:", result.message);
        toast({
          variant: "destructive",
          title: "Erro ao editar questionário",
          description:
            result.message ||
            "Ocorreu um erro desconhecido ao atualizar o questionário.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao editar questionário",
        description: "Ocorreu um erro ao tentar atualizar o questionário",
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
            Editar Questionário CARS Childhood
          </h1>
        </div>
      </div>
      <DetalhesEstudanteCard obj={relatorio} />;
      <form>
        <Card>
          <CardHeader>
            <CardTitle>Questionário CARS Childhood</CardTitle>
            <CardDescription>
              Preencha as informações da avaliação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="border-2 rounded-lg border-blue-100 bg-blue-100 p-6 shadow-lg">
                <p className="text-blue-900">
                  A escala CARS é composta por 15 itens que avaliam diferentes
                  aspectos do comportamento relacionados ao autismo. Selecione a
                  faixa de pontuação total alcançada após a aplicação completa
                  da escala.
                </p>
              </div>
              <RadioGroup
                value={totalRange}
                onValueChange={(v) => setTotalRange(v as any)}
                className="grid gap-3"
              >
                {/* Até 30 */}
                <Label
                  htmlFor="Até 30"
                  className={`text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm border-2 transition-all cursor-pointer
            ${totalRange === "Até 30" ? "ring-2 ring-indigo-400 bg-indigo-50" : "bg-card hover:bg-slate-50"}
          `}
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <RadioGroupItem
                        id="Até 30"
                        value="Até 30"
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-lg text-slate-800 mb-2">
                          Até 30 pontos
                        </p>
                        <p className="font-semibold text-green-800 mb-2">
                          AUSÊNCIA DE INDÍCIOS DE AUTISMO
                        </p>
                        <p className="text-sm text-slate-600">
                          A pontuação indica que a criança não apresenta
                          características significativas do espectro autista.
                          Continuar com o acompanhamento de desenvolvimento
                          regular.
                        </p>
                      </div>
                    </div>
                  </div>
                </Label>

                {/* 30 até 36,5 */}
                <Label
                  htmlFor="30 até 36.5"
                  className={`text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm border-2 transition-all cursor-pointer
            ${totalRange === "30 até 36.5" ? "ring-2 ring-indigo-400 bg-indigo-50" : "bg-card hover:bg-slate-50"}
          `}
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <RadioGroupItem
                        id="30 até 36.5"
                        value="30 até 36.5"
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-lg text-slate-800 mb-2">
                          30 até 36,5 pontos
                        </p>
                        <p className="font-semibold text-yellow-800 mb-2">
                          AUTISMO LEVE A MODERADO
                        </p>
                        <p className="text-sm text-slate-600">
                          A pontuação sugere características de autismo leve a
                          moderado. É recomendada avaliação diagnóstica
                          aprofundada e intervenções terapêuticas adequadas ao
                          perfil da criança.
                        </p>
                      </div>
                    </div>
                  </div>
                </Label>

                {/* 37 até 60 */}
                <Label
                  htmlFor="37 até 60"
                  className={`text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm border-2 transition-all cursor-pointer
            ${totalRange === "37 até 60" ? "ring-2 ring-indigo-400 bg-indigo-50" : "bg-card hover:bg-slate-50"}
          `}
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <RadioGroupItem
                        id="37 até 60"
                        value="37 até 60"
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-lg text-slate-800 mb-2">
                          37 até 60 pontos
                        </p>
                        <p className="font-semibold text-red-800 mb-2">
                          AUTISMO MODERADO A SEVERO
                        </p>
                        <p className="text-sm text-slate-600">
                          A pontuação indica características de autismo moderado
                          a severo. É fundamental encaminhamento imediato para
                          avaliação diagnóstica especializada e início de
                          intervenções intensivas e multidisciplinares.
                        </p>
                      </div>
                    </div>
                  </div>
                </Label>
              </RadioGroup>
            </div>
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
