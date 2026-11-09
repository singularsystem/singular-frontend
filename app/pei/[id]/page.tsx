"use client";
export const dynamic = "force-dynamic";
import { ActionsBar } from "@/components/actions-bar";
import { PlanSignatureCard } from "@/components/assinatura-digital/plan-sign-card";
import { DetalhesEstudanteCard } from "@/components/estudante/detalhes-estudante-card";
import { AddSubjectsButton } from "@/components/pei/add-subject-button";
import { SubjectSuggestionsCard } from "@/components/pei/subject-sugestions-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { useBack } from "@/hooks/use-back";
import { toast } from "@/hooks/use-toast";
import { usePdfDownload, usePdfPrint } from "@/hooks/useFetchPDFs";
import { useFetchPEIByID, useUpdatePEI } from "@/hooks/useFetchPEI";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";

export default function PlanoPEI({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { openDocumentPdf, isPrinting } = usePdfPrint();
  const { downloadDocumentPdf, isGeneratingPDF } = usePdfDownload();
  const id = unwrappedParams.id;
  const [shouldFetchPEI, setShouldFetchPEI] = useState(false);
  const back = useBack("/pei");
  const {
    plano,
    error: fetchPlanError,
    loading: fetchPlanLoading,
  } = useFetchPEIByID(id, {
    enabled: shouldFetchPEI,
  });
  const { updatePEI, loading: savingReportFields } = useUpdatePEI();

  useEffect(() => {
    if (!authLoading && id) {
      setShouldFetchPEI(true);
    }
  }, [authLoading, id]);

  useEffect(() => {
    if (fetchPlanLoading) return;

    if (fetchPlanError) {
      toast({
        title: "Erro ao buscar plano",
        description: fetchPlanError.message || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    }
  }, [fetchPlanError, fetchPlanLoading, plano, toast]);

  const canAssinar =
    !authLoading &&
    user?.roles[0].toLowerCase() === "teacher" &&
    user?.id === plano?.professional.id;

  const handleAssinar = () => {
    if (plano?.signUrl && plano?.signUrl != "") {
      window.open(plano.signUrl, "_blank");
    } else {
      console.warn("URL de assinatura não disponível");
      toast({
        variant: "destructive",
        title: "Erro ao gerar link para assinatura",
        description: "Error",
      });
    }
  };

  const dominiosMap = useMemo(() => {
    if (!plano) return null;
    if (plano.serie !== "Educação Infantil") return null;

    const respostas = plano.subjects
      .filter((s) => s.subject === "Educação Infantil")
      .flatMap((s) =>
        s.responses.map((r) => ({
          resposta: r.response,
          categoria:
            r.category?.split("•")[1]?.trim() || (r.category ?? "").trim(),
        })),
      )
      .filter((r) => r.categoria);

    return respostas.reduce<Record<string, Record<string, number>>>(
      (acc, { categoria, resposta }) => {
        if (!acc[categoria]) {
          acc[categoria] = { "Ainda Não": 0, "Com Mediação": 0, Sozinho: 0 };
        }
        acc[categoria][resposta] += 1;
        return acc;
      },
      {},
    );
  }, [plano]);

  const [academicRecord, setAcademicRecord] = useState("");
  const [medicalReport, setMedicalReport] = useState("");
  const [medications, setMedications] = useState("");
  const [followUp, setFollowUp] = useState("");
  const [additionalObservations, setAdditionalObservations] = useState("");

  useEffect(() => {
    if (!plano) return;
    setAcademicRecord(plano.academicRecord ?? "");
    setMedicalReport(plano.medicalReport ?? "");
    setMedications(plano.medications ?? "");
    setFollowUp(plano.followUp ?? "");
    setAdditionalObservations(plano.additionalObservations ?? "");
  }, [plano]);

  if (authLoading || fetchPlanLoading) {
    return (
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Carregando...</h1>
          <Button variant="outline" onClick={back}>
            Voltar
          </Button>
        </div>
      </main>
    );
  }

  if (plano == null) {
    return (
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">
            Plano não encontrado
          </h1>
          <Button variant="outline" onClick={back}>
            Voltar
          </Button>
        </div>
      </main>
    );
  }

  const handleSaveReportFields = async () => {
    try {
      await updatePEI({
        id: plano.id,
        studentID: plano.student.id,
        userID: plano.professional.id,
        schoolYear: plano.schoolYear,
        serie: plano.serie,
        academicRecord,
        medicalReport,
        medications,
        followUp,
        additionalObservations,
        subjects: plano.subjects.map((s) => ({
          subject: s.subject,
          responses: s.responses.map((r) => ({
            key: r.key,
            category: r.category,
            response: r.response,
          })),
        })),
      });

      toast({
        title: "Relatório atualizado",
        description: "As informações adicionais foram salvas com sucesso.",
        variant: "success",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description:
          error instanceof Error ? error.message : "Erro desconhecido.",
        variant: "destructive",
      });
    }
  };

  const categorias = [
    {
      label: "Ainda Não",
      corTexto: "text-red-600",
      corPorcentagem: "text-red-700",
      bg: "bg-red-50",
    },
    {
      label: "Com Mediação",
      corTexto: "text-yellow-600",
      corPorcentagem: "text-yellow-700",
      bg: "bg-yellow-50",
    },
    {
      label: "Sozinho",
      corTexto: "text-green-600",
      corPorcentagem: "text-green-700",
      bg: "bg-green-50",
    },
  ];

  function getColorDot(dominio: string): string {
    switch (dominio) {
      case "Socialização":
        return "bg-blue-500";
      case "Linguagem":
        return "bg-green-500";
      case "Cognição":
        return "bg-purple-500";
      case "Auto-cuidados":
        return "bg-orange-500";
      case "Desenvolvimento Motor":
        return "bg-pink-500";
      case "Percepção":
        return "bg-yellow-500";
      case "Atenção":
        return "bg-red-800";
      case "Memória":
        return "bg-stone-600";
      case "Funções Psicomotoras":
        return "bg-blue-400";
      case "Raciocínio Lógico":
        return "bg-amber-950";
      case "Pensamento Operatório":
        return "bg-rose-500";
      case "Leitura e Escrita":
        return "bg-fuchsia-500";
      default:
        return "bg-gray-500";
    }
  }

  return (
    <main className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={back}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight ">
            Plano Educacional Individualizado (PEI)
          </h1>
        </div>
        <div className="flex gap-2">
          {plano.serie !== "Educação Infantil" && (
            <AddSubjectsButton peiId={plano.id} />
          )}
          <ActionsBar
            onPrint={(win) => {
              void openDocumentPdf(plano.id, win);
            }}
            onExportPDF={async () => {
              await downloadDocumentPdf(plano.id);
            }}
            isPrinting={isPrinting}
            isGeneratingPDF={isGeneratingPDF}
            isSigning={isLoading}
            canSign={canAssinar}
            isSigned={plano?.teacherSign}
            onSign={handleAssinar}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <DetalhesEstudanteCard obj={plano} />
        </div>
        <PlanSignatureCard
          professionalName={plano?.professional.fullName}
          documentToken={plano?.documentToken}
          teacherSign={plano?.teacherSign}
          signedAt={plano?.signedAt}
          documentStatus={plano?.documentStatus}
        />
      </div>
      <Card className="mb-6">
        <CardHeader>
          <h3 className="text-2xl font-semibold leading-none tracking-tight ">
            Plano Educacional Individualizado
          </h3>
          <p className="text-sm text-muted-foreground">
            Data: {plano?.localCreatedAt}
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {plano.serie === "Educação Infantil" && dominiosMap && (
              <div className="mb-10 px-10">
                <h4 className="text-lg font-semibold  mb-4">
                  Resumo da Avaliação
                </h4>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 print-cards-grid">
                  {Object.entries(dominiosMap).map(
                    ([dominio, respostasCategoria]) => {
                      const total = Object.values(respostasCategoria).reduce(
                        (sum, val) => sum + val,
                        0,
                      );

                      return (
                        <div
                          key={dominio}
                          className="rounded-lg border bg-card text-card-foreground shadow-sm border-l-4 print-card"
                        >
                          <div className="flex flex-col space-y-1.5 p-3 pb-3 card-head">
                            <div className="font-semibold tracking-tight text-lg flex items-center gap-2 card-title">
                              <div
                                className={`w-3 h-3 rounded-full dot ${getColorDot(
                                  dominio,
                                )}`}
                                data-print-dot
                              ></div>
                              {dominio}
                            </div>
                            <div className="text-sm text-gray-600 card-sub">
                              {total} questões avaliadas
                            </div>
                          </div>

                          <div className="p-3 pt-0">
                            <div className="mb-2">
                              {categorias.map((categoria) => {
                                const count =
                                  respostasCategoria[categoria.label] || 0;
                                return (
                                  <div
                                    key={categoria.label}
                                    className={`flex items-center justify-between text-center p-3 ${categoria.bg} rounded category-row`}
                                  >
                                    <div
                                      className={`text-xs ${categoria.corPorcentagem} category-label`}
                                    >
                                      {categoria.label}:
                                    </div>
                                    <div
                                      className={`text-xl font-bold ${categoria.corTexto} category-count`}
                                    >
                                      {count}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      );
                    },
                  )}
                </div>
              </div>
            )}

            <div className="mb-10 px-10 space-y-6">
              <h4 className="text-lg font-semibold">Relatório</h4>

                <div className="space-y-2">
                  <Label htmlFor="academicRecord">Histórico Escolar</Label>
                  <Textarea
                    id="academicRecord"
                    value={academicRecord}
                    onChange={(e) => setAcademicRecord(e.target.value)}
                    placeholder="Descreva o histórico escolar do estudante, evolução de aprendizagem, principais dificuldades e estratégias já utilizadas."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medicalReport">
                    Tem Laudo Médico? Qual CID-10?
                  </Label>
                  <Textarea
                    id="medicalReport"
                    value={medicalReport}
                    onChange={(e) => setMedicalReport(e.target.value)}
                    placeholder="Informe se há laudo médico, qual o CID-10, data do laudo e orientações clínicas que impactam o processo pedagógico."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="medications">Usa Medicações? Quais?</Label>
                  <Textarea
                    id="medications"
                    value={medications}
                    onChange={(e) => setMedications(e.target.value)}
                    placeholder="Registre medicações em uso, dosagem/frequência e possíveis efeitos observados no desempenho e comportamento escolar."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="followUp">
                    Faz Acompanhamento? Reabilitação?
                  </Label>
                  <Textarea
                    id="followUp"
                    value={followUp}
                    onChange={(e) => setFollowUp(e.target.value)}
                    placeholder="Descreva acompanhamentos e reabilitações em andamento (fono, psicologia, TO, etc.), frequência e encaminhamentos."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additionalObservations">
                    Observações Adicionais
                  </Label>
                  <Textarea
                    id="additionalObservations"
                    value={additionalObservations}
                    onChange={(e) => setAdditionalObservations(e.target.value)}
                    placeholder="Adicione observações complementares relevantes para o planejamento pedagógico individualizado."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={handleSaveReportFields}
                    disabled={savingReportFields}
                    className=" bg-[#111C4E] hover:bg-blue-800"
                  >
                    {savingReportFields ? "Salvando..." : "Salvar Relatório"}
                  </Button>
                </div>
            </div>
            {plano.subjects.map((s) => (
              <SubjectSuggestionsCard
                key={s.id}
                serie={plano.serie as any}
                peiSubject={s}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            {plano?.localUpdatedAt === ""
              ? ""
              : `Última atualização: ${plano?.localUpdatedAt}`}
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
