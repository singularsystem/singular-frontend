"use client";
export const dynamic = "force-dynamic";
import { ActionsBar } from "@/components/actions-bar";
import { StatusBadge } from "@/components/assinatura-digital/render-status-badge";
import { ReportSignaturesCard } from "@/components/assinatura-digital/report-sign-card";
import { DetalhesEstudanteCard } from "@/components/estudante/detalhes-estudante-card";
import { TabPsicologico } from "@/components/relatorio/psychologist-report";
import { TabPsicopedagogico } from "@/components/relatorio/psychopedagogue-report";
import { TabSocial } from "@/components/relatorio/social-worker-report";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/auth-context";
import { useBack } from "@/hooks/use-back";
import { useToast } from "@/hooks/use-toast";
import { usePdfDownload, usePdfPrint } from "@/hooks/useFetchPDFs";
import { useFetchReport } from "@/hooks/useFetchReports";
import { scoreCARSRanges } from "@/lib/questionarios";
import {
  calculateEmotionalPercentage,
  generateCognitiveText,
  generateConclusionText,
  generateRecommendationsText,
  generateSocialText,
  getEmotionalDevelopment,
} from "@/lib/relatorio-psicologo";
import {
  formatContinuousMedication,
  formatHealthConditions,
  formatList,
  formatOther,
} from "@/lib/utils";
import { AlertCircle, ArrowLeft, Check, Info, Loader2, FileQuestion, XCircle, Home } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function RelatorioDetalhes({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("completo");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { openDocumentPdf, isPrinting } = usePdfPrint();
  const { downloadDocumentPdf, isGeneratingPDF } = usePdfDownload();
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const unwrappedParams = use(params);
  const { user, token, isLoading: authLoading } = useAuth();
  const id = unwrappedParams.id;
  const back = useBack("/relatorios");

  const {
    relatorio,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchReport(id);

  useEffect(() => {
    if (!authLoading && user) {
      const userRoles = user.roles?.map((r) => r.toLowerCase()) || [];
      if (userRoles.includes("secretary")) {
        router.push("/acompanhamento-biopsicossocial");
      }
    }
  }, [authLoading, user, router]);

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



  const canAssinar =
    (user?.roles[0].toLowerCase() === "socialwork" &&
      user?.id === relatorio?.socialWorkerReport?.professional?.id) ||
    (user?.roles[0].toLowerCase() === "psychologist" &&
      user?.id === relatorio?.psychologistReport?.professional?.id) ||
    (user?.roles[0].toLowerCase() === "psychopedagogue" &&
      user?.id === relatorio?.psychopedagogueReport?.professional?.id);

  const isAnyCreator =
    user?.roles[0]?.toLowerCase() === "admin" ||
    (user?.roles[0]?.toLowerCase() === "socialwork" &&
      user?.id === relatorio?.socialWorkerReport?.professional?.id) ||
    (user?.roles[0]?.toLowerCase() === "psychologist" &&
      user?.id === relatorio?.psychologistReport?.professional?.id) ||
    (user?.roles[0]?.toLowerCase() === "psychopedagogue" &&
      user?.id === relatorio?.psychopedagogueReport?.professional?.id);

  const handleAssinar = () => {
    if (user?.roles[0].toLowerCase() == "socialwork") {
      if (
        relatorio?.socialWorkerSignUrl &&
        relatorio?.socialWorkerSignUrl != ""
      ) {
        window.open(relatorio.socialWorkerSignUrl, "_blank");
      } else {
        console.warn("URL de assinatura não disponível");
        toast({
          variant: "destructive",
          title: "Erro ao gerar link para assinatura",
          description: "Error",
        });
      }
    } else if (user?.roles[0].toLowerCase() == "psychologist") {
      if (
        relatorio?.psychologistSignUrl &&
        relatorio?.psychologistSignUrl != ""
      ) {
        window.open(relatorio.psychologistSignUrl, "_blank");
      } else {
        console.warn("URL de assinatura não disponível");
        toast({
          variant: "destructive",
          title: "Erro ao gerar link para assinatura",
          description: "Error",
        });
      }
    } else {
      if (
        relatorio?.psychopedagogueSignUrl &&
        relatorio?.psychopedagogueSignUrl != ""
      ) {
        window.open(relatorio.psychopedagogueSignUrl, "_blank");
      } else {
        console.warn("URL de assinatura não disponível");
        toast({
          variant: "destructive",
          title: "Erro ao gerar link para assinatura",
          description: "Error",
        });
      }
    }
  };

  if (fetchLoading) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-6 min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-center max-w-sm">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
          <h2 className="text-xl font-semibold text-slate-800">Carregando Relatório</h2>
          <p className="text-sm text-slate-500">
            Aguarde um momento enquanto buscamos as informações no servidor...
          </p>
        </div>
      </main>
    );
  }

  if (fetchError) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-6 min-h-[60vh]">
        <Card className="w-full max-w-md shadow-lg border-red-100">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl text-red-700 font-bold">
              Erro ao buscar relatório
            </CardTitle>
            <CardDescription className="text-slate-500">
              Ocorreu um problema ao tentar carregar este documento.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-red-50/50 rounded-lg border border-red-100 text-xs text-red-800 font-mono break-all whitespace-pre-wrap">
              {fetchError.message || "Erro de conexão ou dados inválidos."}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.push("/relatorios")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Ver Relatórios
            </Button>
            <Button className="w-full sm:w-auto bg-brand-navy hover:bg-blue-800 text-white" onClick={() => router.push("/dashboard")}>
              <Home className="h-4 w-4 mr-2" />
              Ir para o Início
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  if (!relatorio) {
    return (
      <main className="flex-1 flex flex-col items-center justify-center p-6 min-h-[60vh]">
        <Card className="w-full max-w-md shadow-lg border-slate-100">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <FileQuestion className="h-6 w-6 text-slate-500" />
            </div>
            <CardTitle className="text-xl text-slate-800 font-bold">
              Relatório não encontrado
            </CardTitle>
            <CardDescription className="text-slate-500">
              O documento solicitado não pôde ser encontrado no sistema.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center text-sm text-slate-600 px-6 pb-6">
            Por favor, verifique se o ID está correto ou se o relatório foi excluído recentemente.
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
            <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.push("/relatorios")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Ver Relatórios
            </Button>
            <Button className="w-full sm:w-auto bg-brand-navy hover:bg-blue-800 text-white" onClick={() => router.push("/dashboard")}>
              <Home className="h-4 w-4 mr-2" />
              Ir para o Início
            </Button>
          </CardFooter>
        </Card>
      </main>
    );
  }

  const selectedHealthCondition =
    relatorio.socialWorkerReport?.healthConditions?.map((r) => r.condition) || [];

  const q = relatorio?.psychopedagogueReport?.psychopedagogueQuestionnaire;

  const checkedDisabilities = q?.typeOfDisability?.length
    ? q.typeOfDisability.map((x: any) => x.disability)
    : [];
  const otherDisability = q?.otherTypesOfDisability;
  const disabilitiesText = [
    ...checkedDisabilities,
    ...(otherDisability ? [otherDisability] : [])
  ].join(", ") || "N/A";

  const disordersText = q?.typeOfDisorder?.length
    ? q.typeOfDisorder.map((x: any) => x.disorder).join(", ")
    : "N/A";

  let result = relatorio.psychologistReport?.psychologistQuestionnaire
    ? calculateEmotionalPercentage(
        relatorio.psychologistReport.psychologistQuestionnaire,
      )
    : null;

  const getSelectedResult = () => {
    if (!relatorio.psychopedagogueReport?.carsQuestionnaire) return null;
    return scoreCARSRanges.find(
      (range) =>
        range.label ===
        relatorio.psychopedagogueReport?.carsQuestionnaire?.totalScore,
    );
  };

  const result_psychopedagogue = getSelectedResult();

  const hasMCHAT = !!relatorio?.psychopedagogueReport?.mchatQuestionnaire;
  console.log(canAssinar);
  return (
    <main className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={back}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">
            Relatório Biopsicossocial
          </h1>
        </div>
        <div className="flex gap-2">
          <ActionsBar
            onPrint={(win) => {
              void openDocumentPdf(relatorio.id, win);
            }}
            onExportPDF={async () => {
              await downloadDocumentPdf(relatorio.id);
            }}
            isPrinting={isPrinting}
            isGeneratingPDF={isGeneratingPDF}
            isSigning={isLoading}
            canSign={canAssinar && !!relatorio?.documentToken}
            isSigned={
              relatorio?.socialWorkerSign &&
              relatorio.psychologistSign &&
              relatorio.psychopedagogueSign
            }
            onSign={handleAssinar}
          />
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Erro</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {!isAnyCreator && (
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <Info className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Visualização somente leitura</AlertTitle>
          <AlertDescription className="text-amber-700">
            Você está visualizando este relatório. Apenas os profissionais que criaram cada seção podem editá-lo.
            <div className="mt-2 space-y-0.5">
              <p>• Serviço Social: <span className="font-medium">{relatorio?.socialWorkerReport?.professional?.fullName || "Nenhum assistente social iniciou o relatório"}</span></p>
              <p>• Psicológico: <span className="font-medium">{relatorio?.psychologistReport?.professional?.fullName || "Nenhum psicólogo iniciou o relatório"}</span></p>
              <p>• Psicopedagógico: <span className="font-medium">{relatorio?.psychopedagogueReport?.professional?.fullName || "Nenhum psicopedagogo iniciou o relatório"}</span></p>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {relatorio?.signatureBlocked && user?.roles?.[0]?.toLowerCase() === "admin" && (
        <Alert className="mb-6 border-amber-300 bg-amber-50">
          <Info className="h-4 w-4 text-amber-700" />
          <AlertTitle className="text-amber-900 font-semibold">
            🔒 Assinatura Bloqueada (visível apenas para administradores)
          </AlertTitle>
          <AlertDescription className="text-amber-800">
            Este relatório foi marcado administrativamente como <strong>&quot;Assinatura Bloqueada&quot;</strong>.
            Ele estava completo antes de 18/08/2026 e nunca passou pelo fluxo de assinatura digital.
            Para os demais usuários do sistema, este relatório aparece como <strong>Assinado</strong>.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6 items-stretch">
        <DetalhesEstudanteCard obj={relatorio} />
        <Card className="h-full flex flex-col">
          <CardHeader>
            <CardTitle>Informações do Relatório</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Data de Criação
              </p>
              <p>{relatorio?.localCreatedAt}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Status
              </p>
              <StatusBadge status={relatorio.status} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Tipo de Deficiência
              </p>
            </div>
          </CardContent>
        </Card>
        <ReportSignaturesCard
          socialWorkerName={
            relatorio?.socialWorkerReport?.professional?.fullName ||
            "Nenhum assistente social iniciou o relatório"
          }
          socialWorkerSign={relatorio?.socialWorkerSign}
          socialWorkerSignedAt={relatorio?.socialWorkerSignedAt}
          psychologistName={
            relatorio?.psychologistReport?.professional?.fullName ||
            "Nenhum psicólogo iniciou o relatório"
          }
          psychologistSign={relatorio?.psychologistSign}
          psychologistSignedAt={relatorio?.psychologistSignedAt}
          psychopedagogueName={
            relatorio?.psychopedagogueReport?.professional?.fullName ||
            "Nenhum psicopedagogo iniciou o relatório"
          }
          psychopedagogueSign={relatorio?.psychopedagogueSign}
          psychopedagogueSignedAt={relatorio?.psychopedagogueSignedAt}
          documentToken={relatorio?.documentToken}
          documentStatus={relatorio?.documentStatus}
          reportStatus={relatorio?.status}
          signatureBlocked={relatorio?.signatureBlocked}
          createdAt={relatorio?.createdAt || relatorio?.localCreatedAt}
          onDownloadPdf={async () => {
            if (relatorio?.id) {
              await downloadDocumentPdf(relatorio.id);
            }
          }}
          isDownloadingPdf={isGeneratingPDF}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Conteúdo do Relatório</CardTitle>
          <CardDescription>
            Relatório Biopsicossocial completo do aluno{" "}
            {relatorio?.student.fullName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            defaultValue="completo"
            className="w-full"
            onValueChange={(value) => setActiveTab(value)}
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="completo">Relatório Completo</TabsTrigger>
              <TabsTrigger value="psicologico">Psicológico</TabsTrigger>
              <TabsTrigger value="social">Serviço Social</TabsTrigger>
              <TabsTrigger value="psicopedagogico">Psicopedagógico</TabsTrigger>
            </TabsList>

            <TabsContent value="completo" className="space-y-4 mt-4">
              <div id="completo-content" className="space-y-6">
                <div className="space-y-2 px-10 text-justify">
                  <h3 className="text-xl font-bold">
                    Relatório Biopsicossocial
                  </h3>
                  <p className="text-muted-foreground">
                    Data: {relatorio?.localCreatedAt}
                  </p>
                </div>

                <div className="space-y-4 my-4 px-10 text-justify">
                  <h4 className="text-xl font-semibold">
                    1. Contexto do Relatório
                  </h4>
                  <p className="whitespace-pre-wrap break-words">
                    Este relatório NÃO se trata de um laudo médico e nem
                    tampouco substitui a avaliação de um profissional médico.
                    Trata-se de uma triagem com intuito exclusivamente
                    pedagógico e de fornecer informações para a melhoria
                    acadêmica do estudante.
                  </p>
                </div>
                <div className="space-y-4 mt-4">
                  {(!relatorio.socialWorkerReport ||
                    !relatorio.psychologistReport ||
                    !relatorio.psychopedagogueReport) && (
                    <Alert className="mb-6 border-blue-200 bg-blue-50">
                      <Info className="h-4 w-4 text-blue-600" />
                      <AlertTitle className="text-blue-800">
                        Relatório em Andamento
                      </AlertTitle>
                      <AlertDescription className="text-blue-700">
                        Este relatório biopsicossocial está sendo preenchido.
                        Abaixo estão as informações disponíveis no momento. Seções
                        pendentes:
                        <div className="mt-2 space-y-0.5 font-medium">
                          {!relatorio.socialWorkerReport && (
                            <p>• Serviço Social (Pendente)</p>
                          )}
                          {!relatorio.psychologistReport && (
                            <p>• Psicológico (Pendente)</p>
                          )}
                          {!relatorio.psychopedagogueReport && (
                            <p>• Psicopedagógico (Pendente)</p>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-4 my-4 px-10 text-justify">
                    <h4 className="text-xl font-semibold">
                      2. Instrumentos Utilizados
                    </h4>
                    <ul className="pl-4">
                      {relatorio.psychologistReport && (
                        <>
                          <li>
                            <strong>ESCALA SNAP-IV</strong>: Instrumento de
                            rastreamento para Transtorno de Déficit de Atenção e
                            Hiperatividade (TDAH), composto por 18 itens que avaliam
                            sintomas de desatenção e hiperatividade/impulsividade.
                          </li>
                          {relatorio.psychologistReport.adaptiveBehaviorScaleDI && (
                            <li>
                              <strong>ESCALA ADAPTATIVA-DI</strong>: Avalia o
                              funcionamento adaptativo do estudante em três domínios
                              principais: habilidades conceituais, sociais e práticas,
                              permitindo identificar o nível de independência e adaptação
                              ao ambiente.
                            </li>
                          )}
                        </>
                      )}
                      <li>
                        <strong>QUESTIONÁRIO DE TRIAGEM MULTIPROFISSIONAL (Ficha de Triagem 1.1)</strong>: Instrumento de triagem abrangente que avalia múltiplas
                        áreas do desenvolvimento, incluindo linguagem, escrita,
                        leitura, raciocínio lógico, autonomia, memória, atenção
                        e interação socioemocional.
                      </li>
                      {relatorio.psychopedagogueReport && (
                        <>
                          {relatorio.psychopedagogueReport.mchatQuestionnaire !==
                          null ? (
                            <li>
                              <strong>ESCALA M-CHAT (Modified Checklist for Autism in Toddlers)</strong>: é um instrumento de rastreamento precoce para sinais do Transtorno do Espectro Autista (TEA), aplicado a crianças pequenas, especialmente entre 16 e 30 meses de idade.
                            </li>
                          ) : (
                            <li>
                              <strong>ESCALA CARS (Childhood Autism Rating Scale)</strong>: é uma escala comportamental de 15 itens usada para avaliar a presença e a intensidade de características do Transtorno do Espectro Autista (TEA).
                            </li>
                          )}
                          {relatorio.psychopedagogueReport.cognitiveAssessment && (
                            <li>
                              <strong>ESCALA de Funcionamento Intelectual</strong>: Instrumento composto por 10 itens que avalia o funcionamento cognitivo geral, considerando habilidades como raciocínio, memória, atenção, linguagem, aprendizagem e resolução de problemas.
                            </li>
                          )}
                          <li>
                            <strong>Questionário Psicopedagógico</strong>: Instrumento destinado à investigação do perfil de aprendizagem, avaliando habilidades acadêmicas, cognitivas, comportamentais e fatores que podem interferir no desempenho escolar.
                          </li>
                        </>
                      )}
                    </ul>
                  </div>

                  <div className="space-y-4 my-4 px-10 text-justify">
                    <h4 className="text-xl font-semibold">3. Resultados</h4>
                    <div className="ml-4">
                      {relatorio.psychologistReport && (
                        <div className="mb-4">
                          <p className="text-xl font-semibold text-gray-700 mb-4">
                            3.1 Escala SNAP-IV
                          </p>
                          <p>
                            Resultado: Sugestivo de{" "}
                            {
                              relatorio.psychologistReport.snapIVQuestionnaire
                                ?.result
                            }
                          </p>
                        </div>
                      )}
                      {relatorio.psychologistReport?.adaptiveBehaviorScaleDI && (
                        <div className="mb-4">
                          <p className="text-xl font-semibold  text-gray-700 mb-4">
                            3.2 Escala Adaptativa-DI
                          </p>
                          <p>
                            Pontuação:{" "}
                            {
                              relatorio.psychologistReport.adaptiveBehaviorScaleDI
                                ?.score
                            }{" "}
                            pontos
                          </p>
                          <p>
                            Resultado: Sugestivo de{" "}
                            {relatorio.psychologistReport.adaptiveBehaviorScaleDI?.result?.toLowerCase()}
                          </p>
                        </div>
                      )}
                      {relatorio.psychopedagogueReport && (
                        <div className="mb-4">
                          <p className="text-xl font-semibold text-gray-700 mb-4">
                            3.3 Avaliação de TEA (Transtorno do Espectro Autista)
                          </p>
                          {hasMCHAT ? (
                            <>
                              <p>
                                Pontuação:{" "}
                                {
                                  relatorio.psychopedagogueReport
                                    .mchatQuestionnaire?.score
                                }{" "}
                                pontos
                              </p>
                              <p>
                                Resultado:{" "}
                                {
                                  relatorio.psychopedagogueReport
                                    .mchatQuestionnaire?.result
                                }
                              </p>
                            </>
                          ) : (
                            <>
                              <p>
                                Pontuação:{" "}
                                {
                                  relatorio.psychopedagogueReport
                                    ?.carsQuestionnaire?.totalScore
                                }{" "}
                                pontos
                              </p>
                              <p>Resultado: {result_psychopedagogue?.result}</p>
                            </>
                          )}
                        </div>
                      )}
                      {relatorio.psychopedagogueReport?.cognitiveAssessment && (
                        <div className="mb-4">
                          <p className="text-xl font-semibold  text-gray-700 mb-4">
                            3.4 Avaliação de Funcionamento Intelectual
                          </p>
                          <p>
                            Pontuação Total:{" "}
                            {
                              relatorio.psychopedagogueReport.cognitiveAssessment
                                ?.score
                            }{" "}
                            pontos
                          </p>
                          <p>
                            Percentual de Acertos:{" "}
                            {
                              relatorio.psychopedagogueReport.cognitiveAssessment
                                ?.percentage
                            }
                            %
                          </p>
                          <p>
                            Resultado:{" "}
                            {relatorio.psychopedagogueReport.cognitiveAssessment?.result?.toUpperCase()}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {relatorio.socialWorkerReport && (
                    <>
                      <div className="space-y-4 my-4 px-10 text-justify">
                        <h4 className="text-xl font-semibold">
                          4. Procedimentos Utilizados na Avaliação Social
                        </h4>
                        <p className="whitespace-pre-wrap break-words">
                          Para a elaboração deste relatório, foram utilizados os
                          seguintes procedimentos:
                        </p>

                        <ul className="list-disc pl-5">
                          {relatorio.socialWorkerReport?.proceduresUsed?.map(
                            (opt: any) => (
                              <li key={opt.procedure}>
                                {opt.procedure === "Outro"
                                  ? `${opt.procedure}: ${relatorio.socialWorkerReport?.otherProceduresUsed || ""}`
                                  : opt.procedure}
                              </li>
                            ),
                          )}
                        </ul>
                      </div>

                      <div className="space-y-4 my-4 px-10 text-justify">
                        <h4 className="text-xl font-semibold">
                          5. Condições Socioeconômicas e Familiares
                        </h4>
                        <p className="whitespace-pre-wrap break-words">
                          IDENTIFICAÇÃO: {relatorio.student.fullName},{" "}
                          {relatorio.student.age} anos, nascido(a) em{" "}
                          {relatorio.student.formattedDateOfBirth}, cursando o{" "}
                          {relatorio.student.serie} na{" "}
                          {relatorio.student.schoolName}. Responsável:{" "}
                          {relatorio.student.nameOfPersonResponsible}.
                        </p>
                        <p className="whitespace-pre-wrap break-words">
                          COMPOSIÇÃO FAMILIAR: A família apresenta composição{" "}
                          {formatOther(
                            relatorio.socialWorkerReport?.familyComposition,
                            relatorio.socialWorkerReport?.otherFamilyComposition,
                          )}
                          . A residência é composta por{" "}
                          {formatOther(
                            relatorio.socialWorkerReport
                              ?.numberOfPeopleInTheHousehold,
                            relatorio.socialWorkerReport
                              ?.otherNumberOfPeopleInTheHousehold,
                          )}
                          .
                        </p>
                        {relatorio.socialWorkerReport
                          ?.additionalObservationHouseholdMembers && (
                          <p className="whitespace-pre-wrap break-words">
                            OBSERVAÇÕES SOBRE OS MEMBROS DA RESIDÊNCIA:{" "}
                            {relatorio.socialWorkerReport
                              ?.additionalObservationHouseholdMembers}
                          </p>
                        )}
                        <p className="whitespace-pre-wrap break-words">
                          MORADIA: A família reside em casa{" "}
                          {formatOther(
                            relatorio.socialWorkerReport?.typeOfHousing,
                            relatorio.socialWorkerReport?.otherTypeOfHousing,
                          )}
                          , com condição considerada{" "}
                          {formatOther(
                            relatorio.socialWorkerReport?.housingConditions,
                            relatorio.socialWorkerReport?.otherHousingConditions,
                          )}
                          . A moradia possui{" "}
                          {formatOther(
                            relatorio.socialWorkerReport?.numberOfRooms,
                            relatorio.socialWorkerReport?.otherNumberOfRooms,
                          )}
                          .
                        </p>
                        <p className="whitespace-pre-wrap break-words">
                          RENDA FAMILIAR: A renda familiar mensal é de{" "}
                          {formatOther(
                            relatorio.socialWorkerReport?.monthlyHouseholdIncome,
                            relatorio.socialWorkerReport
                              ?.otherMonthlyHouseholdIncome,
                          )}
                          , proveniente de{" "}
                          {formatList(
                            relatorio.socialWorkerReport?.familyIncomeSource?.map(
                              (opt: any) => opt.source,
                            ) || [],
                            relatorio.socialWorkerReport?.otherFamilyIncomeSource,
                          )}
                          . Benefícios:{" "}
                          {formatList(
                            relatorio.socialWorkerReport?.receivedGovernmentBenefits?.map(
                              (opt: any) => opt.benefit,
                            ) || [],
                            relatorio.socialWorkerReport
                              ?.otherReceivedGovernmentBenefits,
                          )}
                          .
                        </p>
                        <p className="whitespace-pre-wrap break-words">
                          CONDIÇÕES DE SAÚDE:{" "}
                          {formatHealthConditions(
                            selectedHealthCondition,
                            relatorio.socialWorkerReport
                              ?.otherDetailsHealthConditions,
                          )}{" "}
                          {formatContinuousMedication(
                            relatorio.socialWorkerReport?.continuousMedication,
                            relatorio.socialWorkerReport
                              ?.detailsContinuousMedication,
                            relatorio.socialWorkerReport?.otherContinuousMedication,
                          )}{" "}
                          . O acesso a serviços de saúde é{" "}
                          {formatOther(
                            relatorio.socialWorkerReport?.healthServiceAccess,
                            relatorio.socialWorkerReport?.otherHealthServiceAccess,
                          )}
                          .
                        </p>
                        <p className="whitespace-pre-wrap break-words">
                          EDUCAÇÃO: A frequência escolar é{" "}
                          {formatOther(
                            relatorio.socialWorkerReport?.schoolAttendance,
                            relatorio.socialWorkerReport?.otherSchoolAttendance,
                          )}
                          , e o desempenho acadêmico é considerado{" "}
                          {formatOther(
                            relatorio.socialWorkerReport?.academicPerformance,
                            relatorio.socialWorkerReport?.otherAcademicPerformance,
                          )}
                          . Principais dificuldades:{" "}
                          {formatList(
                            relatorio.socialWorkerReport?.mainSchoolDifficulties?.map(
                              (opt: any) => opt.difficulty,
                            ) || [],
                            relatorio.socialWorkerReport
                              ?.otherMainSchoolDifficulties,
                          )}
                          .
                        </p>
                        <p className="whitespace-pre-wrap break-words">
                          ALIMENTAÇÃO: O(a) aluno(a) realiza{" "}
                          {formatOther(
                            relatorio.socialWorkerReport?.dailyMeals,
                            relatorio.socialWorkerReport?.otherDailyMeals,
                          )}{" "}
                          diariamente. A situação de segurança alimentar é
                          caracterizada como{" "}
                          {formatOther(
                            relatorio.socialWorkerReport?.foodSecurity,
                            relatorio.socialWorkerReport?.otherFoodSecurity,
                          )}
                          .
                        </p>
                        <p className="whitespace-pre-wrap break-words">
                          CONVIVÊNCIA SOCIAL: O relacionamento familiar é descrito
                          como{" "}
                          {formatOther(
                            relatorio.socialWorkerReport?.familyRelationship,
                            relatorio.socialWorkerReport?.otherFamilyRelationship,
                          )}
                          . A rede de apoio social é{" "}
                          {formatOther(
                            relatorio.socialWorkerReport?.socialSupportNetwork,
                            relatorio.socialWorkerReport?.otherSocialSupportNetwork,
                          )}
                          . A participação em atividades comunitárias é{" "}
                          {formatOther(
                            relatorio.socialWorkerReport?.communityActivityParticipation,
                            relatorio.socialWorkerReport
                              ?.otherCommunityActivityParticipation,
                          )}
                          .
                        </p>
                      </div>
                    </>
                  )}

                  {relatorio.psychologistReport?.adaptiveBehaviorScaleDI && (
                    <div className="space-y-4 my-4 px-10 text-justify">
                      <h4 className="text-xl font-semibold">
                        4. Desenvolvimento Cognitivo
                      </h4>
                      <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {generateCognitiveText(relatorio.psychologistReport)}
                      </div>
                    </div>
                  )}

                  {result && (
                    <div className="space-y-4 my-4 px-10 text-justify">
                      <h4 className="text-xl font-semibold">
                        6. Desenvolvimento Emocional
                      </h4>
                      <p className="whitespace-pre-wrap break-words">
                        {getEmotionalDevelopment(result?.percentage)}
                      </p>
                    </div>
                  )}

                  {relatorio.psychologistReport && (
                    <div className="space-y-4 my-4 px-10 text-justify">
                      <h4 className="text-xl font-semibold">
                        7. Desenvolvimento Social
                      </h4>
                      <p className="whitespace-pre-wrap break-words">
                        {generateSocialText(relatorio.psychologistReport)}
                      </p>
                    </div>
                  )}

                  {relatorio.psychopedagogueReport && (
                    <>
                      <div className="space-y-4 my-4 px-10 text-justify">
                        <h4 className="text-xl font-semibold">
                          8. Observações Comportamentais
                        </h4>
                        <p className="whitespace-pre-wrap break-words">
                          {q?.comportamentalObservations ?? "N/A"}
                        </p>
                      </div>

                      <div className="space-y-2 px-10 text-justify">
                        <h4 className="text-xl font-semibold">
                          9. Observações sobre o Caderno do Aluno
                        </h4>
                        <p className="whitespace-pre-wrap break-words">
                          {q?.notebookObservations ?? "N/A"}
                        </p>
                      </div>

                      <div className="space-y-2 px-10 text-justify">
                        <h4 className="text-xl font-semibold">
                          10. Outras Observações Relevantes
                        </h4>
                        <p className="whitespace-pre-wrap break-words">
                          {q?.otherObservations ?? "N/A"}
                        </p>
                      </div>

                      <div className="space-y-4 my-6 px-10 text-justify">
                        <h4 className="text-xl font-semibold">
                          11. Tipo de Deficiência
                        </h4>
                        <p className="whitespace-pre-wrap break-words">
                          {disabilitiesText}
                        </p>
                      </div>

                      <div className="space-y-4 my-6 px-10 text-justify">
                        <h4 className="text-xl font-semibold">
                          12. Tipo de Transtorno
                        </h4>
                        <p className="whitespace-pre-wrap break-words">
                          {disordersText}
                        </p>
                      </div>
                    </>
                  )}

                  {relatorio.socialWorkerReport && (
                    <div className="space-y-4 my-4 px-10 text-justify">
                      <h4 className="text-xl font-semibold">
                        13. Recomendações da(o) Assistente Social
                      </h4>
                      <ul className="list-disc pl-5">
                        {(
                          relatorio.socialWorkerReport?.recommendations ?? []
                        ).map((opt: any) => (
                          <li key={opt.recommendation}>
                            {["outro", "outra", "outros", "outras"].includes(
                              opt.recommendation.trim().toLowerCase(),
                            ) &&
                            relatorio.socialWorkerReport?.otherRecommendations
                              ? `${opt.recommendation}: ${relatorio.socialWorkerReport.otherRecommendations}`
                              : opt.recommendation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {relatorio.psychologistReport && (
                    <div className="space-y-4 my-4 px-10 text-justify">
                      <h4 className="text-xl font-semibold">
                        14. Recomendações da(o) Psicóloga(o)
                      </h4>
                      <p className="whitespace-pre-wrap break-words">
                        {generateRecommendationsText(
                          relatorio.psychologistReport,
                        )}
                      </p>
                    </div>
                  )}

                  {relatorio.psychopedagogueReport && (
                    <div className="space-y-4 my-4 px-10 text-justify">
                      <h4 className="text-xl font-semibold">
                        15. Recomendações do(a) Psicopedagogo(a)
                      </h4>

                      <ul className="list-decimal pl-5">
                        {(q?.recommendations ?? []).map((opt: any) => (
                          <li key={opt.recommendation}>
                            {opt.recommendation === "Outro"
                              ? `${opt.recommendation}: ${q?.otherRecommendations ?? ""}`
                              : opt.recommendation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="space-y-4 my-4 px-10 text-justify">
                  <h4 className="text-xl font-semibold">
                    16. Conclusão da Avaliação
                  </h4>
                  <div className="space-y-6">
                    {/* Textos Automáticos Agrupados */}
                    <div className="space-y-4">
                      {relatorio.socialWorkerReport && (
                        <p className="whitespace-pre-wrap break-words">
                          {(() => {
                            const income =
                              relatorio.socialWorkerReport?.monthlyHouseholdIncome;
                            const otherIncome =
                              relatorio.socialWorkerReport
                                ?.otherMonthlyHouseholdIncome;
                            const foodSecurity =
                              relatorio.socialWorkerReport?.foodSecurity;
                            const otherFoodSecurity =
                              relatorio.socialWorkerReport?.otherFoodSecurity;
                            const housing =
                              relatorio.socialWorkerReport?.housingConditions;
                            const otherHousing =
                              relatorio.socialWorkerReport?.otherHousingConditions;
                            const typeOfHousing =
                              relatorio.socialWorkerReport?.typeOfHousing;
                            const otherTypeOfHousing =
                              relatorio.socialWorkerReport?.otherTypeOfHousing;
                            const dailyMeals =
                              relatorio.socialWorkerReport?.dailyMeals;
                            const incomeSources =
                              relatorio.socialWorkerReport?.familyIncomeSource?.map(
                                (s: any) => s.source,
                              ) || [];
                            const otherIncomeSource =
                              relatorio.socialWorkerReport
                                ?.otherFamilyIncomeSource;
                            const benefits =
                              relatorio.socialWorkerReport?.receivedGovernmentBenefits?.map(
                                (b: any) => b.benefit,
                              ) || [];
                            const otherBenefits =
                              relatorio.socialWorkerReport
                                ?.otherReceivedGovernmentBenefits;

                            // 1. Fatores Críticos de Vulnerabilidade (Sempre indicam desafios)
                            const hasCriticalChallenge =
                              income === "Até 1 salário mínimo" ||
                              incomeSources.includes("Desempregado") ||
                              housing ===
                                "Precária (problemas estruturais ou falta de saneamento)" ||
                              housing === "Insalubre (risco à saúde)" ||
                              foodSecurity ===
                                "Insegurança alimentar (falta de alimentos frequente)" ||
                              dailyMeals === "1 refeição ou menos" ||
                              otherHousing?.toLowerCase().includes("risco") ||
                              otherFoodSecurity
                                ?.toLowerCase()
                                .includes("insegurança") ||
                              otherFoodSecurity?.toLowerCase().includes("falta");

                            // 2. Fatores de Risco (Indicam desafios se não houver estabilidade)
                            const hasRiskFactors =
                              income === "De 1 a 2 salários mínimos" ||
                              incomeSources.includes("Trabalho informal") ||
                              incomeSources.includes("Benefícios sociais") ||
                              benefits.some(
                                (b: string) =>
                                  b !== "Nenhum" &&
                                  b !== "" &&
                                  b !== "Nenhum(a)",
                              ) ||
                              typeOfHousing ===
                                "Cedida (por familiares ou outros)" ||
                              dailyMeals === "2 refeições" ||
                              otherIncomeSource
                                ?.toLowerCase()
                                .includes("instável") ||
                              otherIncomeSource
                                ?.toLowerCase()
                                .includes("bico") ||
                              otherIncomeSource
                                ?.toLowerCase()
                                .includes("auxílio");

                            // 3. Indicadores de Estabilidade (Podem compensar fatores de risco)
                            const hasStabilityFactors =
                              income === "De 2 a 3 salários mínimos" ||
                              income === "Acima de 3 salários mínimos" ||
                              incomeSources.includes(
                                "Trabalho formal (carteira assinada)",
                              ) ||
                              housing ===
                                "Adequada (estrutura segura, água, luz, esgoto)";

                            // Lógica Final: Desafio se tiver fator crítico OU (fator de risco SEM estabilidade)
                            let hasSocioEconomicChallenges =
                              hasCriticalChallenge ||
                              (hasRiskFactors && !hasStabilityFactors);

                            // Quando renda é "Outra", a classificação manual tem prioridade sobre a lógica automática
                            if (
                              income === "Outra" &&
                              relatorio.socialWorkerReport?.socioeconomicContext
                            ) {
                              hasSocioEconomicChallenges =
                                relatorio.socialWorkerReport.socioeconomicContext ===
                                "Com desafios socioeconômicos";
                            }

                            let text = "";
                            if (hasSocioEconomicChallenges) {
                              text = `Com base nas informações coletadas, observa-se que ${relatorio.student.fullName} está inserido(a) em um contexto familiar que apresenta desafios socioeconômicos que podem impactar seu desenvolvimento e aprendizagem. `;
                            } else {
                              text = `Com base nas informações coletadas, observa-se que ${relatorio.student.fullName} está inserido(a) em um contexto familiar que não apresenta desafios socioeconômicos significativos no momento, o que favorece seu desenvolvimento. `;
                            }

                            text +=
                              "A família demonstra interesse no acompanhamento escolar, e o(a) aluno(a) apresenta potencial para desenvolvimento pleno, desde que receba o suporte adequado. ";

                            if (hasSocioEconomicChallenges) {
                              text +=
                                "É fundamental que sejam implementadas ações integradas entre escola, família e rede de proteção social para garantir os direitos e promover o bem-estar do(a) aluno(a).";
                            }

                            return text;
                          })()}
                        </p>
                      )}

                      {relatorio.psychologistReport && (
                        <p className="whitespace-pre-wrap break-words">
                          {generateConclusionText(relatorio.psychologistReport)}
                        </p>
                      )}

                      {relatorio.psychopedagogueReport && (
                        <p className="whitespace-pre-wrap break-words">
                          {q?.justificationForClassification ?? "N/A"}
                        </p>
                      )}
                    </div>

                    {/* Caixas de Observações Manuais Agrupadas */}
                    <div className="space-y-4">
                      {relatorio.socialWorkerReport?.conclusion && (
                        <div className="p-3 bg-slate-50 border-l-4 border-slate-300">
                          <p className="font-semibold text-slate-700 text-sm mb-1">
                            Observações do(a) Assistente Social:
                          </p>
                          <p className="whitespace-pre-wrap break-words text-slate-600">
                            {relatorio.socialWorkerReport.conclusion}
                          </p>
                        </div>
                      )}

                      {relatorio.psychopedagogueReport?.conclusion && (
                        <div className="p-3 bg-slate-50 border-l-4 border-slate-300">
                          <p className="font-semibold text-slate-700 text-sm mb-1">
                            Observações do(a) Psicopedagogo(a):
                          </p>
                          <p className="whitespace-pre-wrap break-words text-slate-600">
                            {relatorio.psychopedagogueReport.conclusion}
                          </p>
                        </div>
                      )}

                      {relatorio.psychologistReport?.conclusion && (
                        <div className="p-3 bg-slate-50 border-l-4 border-slate-300">
                          <p className="font-semibold text-slate-700 text-sm mb-1">
                            Observações do(a) Psicólogo(a):
                          </p>
                          <p className="whitespace-pre-wrap break-words text-slate-600">
                            {relatorio.psychologistReport.conclusion}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="psicologico" className="space-y-4 mt-4">
              {relatorio.psychologistReport ? (
                <TabPsicologico relatorio={relatorio.psychologistReport} />
              ) : (
                <div className="p-8 text-center border border-dashed rounded-lg bg-slate-50/50 my-6">
                  <Info className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-1">
                    Avaliação Psicológica Pendente
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">
                    A seção psicológica deste relatório ainda não foi preenchida pelo profissional responsável.
                  </p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="social" className="space-y-4 mt-4">
              {relatorio.socialWorkerReport ? (
                <TabSocial
                  relatorio={relatorio.socialWorkerReport}
                  selectedHealthCondition={selectedHealthCondition}
                  formatOther={formatOther}
                  formatList={formatList}
                  formatHealthConditions={formatHealthConditions}
                  formatContinuousMedication={formatContinuousMedication}
                />
              ) : (
                <div className="p-8 text-center border border-dashed rounded-lg bg-slate-50/50 my-6">
                  <Info className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-1">
                    Avaliação de Serviço Social Pendente
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">
                    A seção de Serviço Social deste relatório ainda não foi preenchida pelo profissional responsável.
                  </p>
                </div>
              )}
            </TabsContent>
            <TabsContent value="psicopedagogico" className="space-y-4 mt-4">
              {relatorio.psychopedagogueReport ? (
                <TabPsicopedagogico relatorio={relatorio.psychopedagogueReport} />
              ) : (
                <div className="p-8 text-center border border-dashed rounded-lg bg-slate-50/50 my-6">
                  <Info className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-slate-700 mb-1">
                    Avaliação Psicopedagógica Pendente
                  </h3>
                  <p className="text-sm text-slate-500 max-w-md mx-auto">
                    A seção psicopedagógica deste relatório ainda não foi preenchida pelo profissional responsável.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-sm text-muted-foreground">
            Este relatório foi gerado automaticamente pela Singular System
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
