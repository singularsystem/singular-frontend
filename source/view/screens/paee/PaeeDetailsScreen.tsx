import { ActionsBar } from "@/components/actions-bar";
import { PlanSignatureCard } from "@/components/assinatura-digital/plan-sign-card";
import { DetalhesEstudanteCard } from "@/components/estudante/detalhes-estudante-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useBack } from "@/hooks/use-back";
import { toast } from "@/hooks/use-toast";
import { usePdfDownload, usePdfPrint } from "@/hooks/useFetchPDFs";
import { portageData } from "@/lib/portage-data";
import { PortageResponse } from "@/types/portage";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { usePaeeDetails } from "../../hooks/paee/usePaeeDetails";

interface PaeeDetailsScreenProps {
  id: string; // paeeId
}

export function PaeeDetailsScreen({ id }: PaeeDetailsScreenProps) {
  const { user, isLoading: authLoading } = useAuth();
  const { openDocumentPdf, isPrinting } = usePdfPrint();
  const { downloadDocumentPdf, isGeneratingPDF } = usePdfDownload();
  const back = useBack("/paee");

  const { paee: plano, error, isLoading } = usePaeeDetails(id);

  useEffect(() => {
    if (isLoading) return;

    if (error) {
      toast({
        title: "Erro ao buscar plano",
        description: error || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    }
  }, [error, isLoading, plano]);

  const canAssinar =
    !authLoading &&
    user?.roles[0].toLowerCase() === "teacher" &&
    user?.id === plano?.professional.id;

  if (authLoading || isLoading) {
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

  const categorias = [
    {
      label: "Ainda Não",
      emoji: "🔴",
      corTexto: "text-red-600",
      corFundo: "bg-red-100",
      corDescricao: "text-red-800",
      corPorcentagem: "text-red-700",
      corBarra: "bg-red-500",
      bg: "bg-red-50",
      border: "border-red-500",
      text: "text-red-800",
      description:
        "Habilidades que a criança ainda não desenvolveu. Estas áreas necessitam de intervenção direta e estruturada.",
      descriptionText: "text-red-700",
    },
    {
      label: "Com Mediação",
      corTexto: "text-yellow-600",
      corFundo: "bg-yellow-100",
      corDescricao: "text-yellow-800",
      corPorcentagem: "text-yellow-700",
      corBarra: "bg-yellow-500",
      emoji: "🟡",
      bg: "bg-yellow-50",
      border: "border-yellow-500",
      text: "text-yellow-800",
      description:
        "Habilidades emergentes que a criança demonstra com apoio. Foco na redução gradual da mediação.",
      descriptionText: "text-yellow-700",
    },
    {
      label: "Sozinho",
      corTexto: "text-green-600",
      corFundo: "bg-green-100",
      corDescricao: "text-green-800",
      corPorcentagem: "text-green-700",
      corBarra: "bg-green-500",
      emoji: "🟢",
      bg: "bg-green-50",
      border: "border-green-500",
      text: "text-green-800",
      description:
        "Habilidades consolidadas que a criança realiza independentemente. Manter e expandir estas competências.",
      descriptionText: "text-green-700",
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

  function mapAgeRangeLabelToKey(
    label: string | undefined,
  ): string | undefined {
    if (label != undefined) {
      switch (label) {
        case "0 a 1 ano":
          return "0-1";
        case "1 a 2 anos":
          return "1-2";
        case "2 a 3 anos":
          return "2-3";
        case "3 a 4 anos":
          return "3-4";
        case "4 a 5 anos":
          return "4-5";
        case "5 a 6 anos":
          return "5-6";
        case "7 anos ou mais":
          return "7-mais";
        default:
          throw new Error("Faixa etária inválida");
      }
    }
  }

  if (!plano) {
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

  const respostas = Object.values(
    (plano?.portage?.responses ?? {}) as Record<number, PortageResponse>,
  ).map((item) => ({
    resposta: item.response,
    categoria: item.category,
  }));

  const dominiosMap = respostas.reduce<
    Record<string, { [key: string]: number }>
  >((acc, { categoria, resposta }) => {
    if (!acc[categoria]) {
      acc[categoria] = {
        "Ainda Não": 0,
        "Com Mediação": 0,
        Sozinho: 0,
      };
    }
    acc[categoria][resposta] += 1;
    return acc;
  }, {});

  const selectedAgeRange = mapAgeRangeLabelToKey(plano?.portage?.ageRange);

  const respostasPorCategoria: Record<
    string,
    { index: number; suggestion: string }[]
  > = {};

  const ageQuestions =
    selectedAgeRange != null ? (portageData[selectedAgeRange] ?? []) : [];

  ageQuestions.forEach((question, idx) => {
    const resp = respostas[idx];
    if (!resp) return;
    const { resposta, categoria } = resp;
    if (!categoria) return;
    if (resposta !== "Ainda Não" && resposta !== "Com Mediação") return;

    const suggestion =
      resposta === "Ainda Não"
        ? question.suggestion_ainda_nao
        : question.suggestion_com_mediacao;

    if (!suggestion) return;

    if (!respostasPorCategoria[categoria]) {
      respostasPorCategoria[categoria] = [];
    }

    respostasPorCategoria[categoria].push({ index: idx, suggestion });
  });

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

  return (
    <main className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={back}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight ">
            Plano de Atendimento Educacional Especializado (PAEE)
          </h1>
        </div>
        <div className="flex gap-2">
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
          professionalName={plano?.professional?.fullName}
          documentToken={plano?.documentToken}
          teacherSign={plano?.teacherSign}
          signedAt={plano?.signedAt}
          documentStatus={plano?.documentStatus}
        />
      </div>
      <Card className="mb-6">
        <CardHeader>
          <h3 className="text-2xl font-semibold leading-none tracking-tight ">
            Plano Pedagógico Especializado
          </h3>
          <p className="text-sm text-muted-foreground">
            Data: {plano?.localCreatedAt}
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <div id="PAEE-content" className="space-y-6">
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

            <div className="mb-10 px-10 text-justify">
              <div className="space-y-2">
                <h4 className="text-lg font-semibold  mb-4">
                  Histórico Escolar
                </h4>
                <p className="whitespace-pre-wrap break-words">
                  {plano?.academicRecord}
                </p>
              </div>
            </div>

            <div className="mb-10 px-10 text-justify">
              <div className="space-y-2">
                <h4 className="text-lg font-semibold  mb-4">
                  Tem Laudo Médico? Qual CID-10?
                </h4>
                <p className="whitespace-pre-wrap break-words">
                  {plano?.medicalReport}
                </p>
              </div>
            </div>

            <div className="mb-10 px-10 text-justify">
              <div className="space-y-2">
                <h4 className="text-lg font-semibold  mb-4">
                  Usa Medicação? Quais?
                </h4>
                <p className="whitespace-pre-wrap break-words">
                  {plano?.medications}
                </p>
              </div>
            </div>

            <div className="mb-10 px-10 text-justify">
              <div className="space-y-2">
                <h4 className="text-lg font-semibold mb-4">
                  Faz Acompanhamento? Reabilitação?
                </h4>
                <p>{plano?.followUp}</p>
              </div>
            </div>

            <div className="mb-10 px-10 text-justify">
              <h4 className="text-lg font-semibold mb-4">
                Sugestões de Intervenção Pedagógica por Área de Desenvolvimento
              </h4>

              {Object.entries(respostasPorCategoria).map(([cat, items]) => (
                <div key={cat} className="mb-4">
                  <h4 className="text-xl font-bold mb-2">{cat}</h4>
                  <ul className="list-disc list-inside text-gray-900">
                    {items.map(({ index, suggestion }) => (
                      <li key={index}>{suggestion}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-10 px-10 text-justify">
              <h4 className="text-lg font-semibold ">
                Tipo de Atendimento Educacional Especializado
              </h4>
              <ul className="list-disc list-inside">
                {plano?.organizationOfCare?.map((option: any) =>
                  option.type === "Outro" ? (
                    <li key={option.type}>
                      {option.type} - {plano?.otherOrganization}
                    </li>
                  ) : (
                    <li key={option.type}>{option.type}</li>
                  ),
                )}
              </ul>
            </div>

            <div className="space-y-2 mb-10 px-10 text-justify">
              <h4 className="text-lg font-semibold ">Frequência Semanal</h4>
              <p className="whitespace-pre-wrap break-words">
                {plano?.weeklyFrequency === "Outra"
                  ? plano?.otherFrequency
                  : plano?.weeklyFrequency}
              </p>
            </div>

            <div className="space-y-2 mb-10 px-10 text-justify">
              <h4 className="text-lg font-semibold ">
                Tempo de Atendimento por Sessão
              </h4>
              <p className="whitespace-pre-wrap break-words">
                {plano?.assistingTimePerSession === "Outro"
                  ? plano?.otherServiceTime
                  : plano?.assistingTimePerSession}
              </p>
            </div>

            <div className="space-y-2 mb-10 px-10 text-justify">
              <h4 className="text-lg font-semibold ">
                Composição do Atendimento
              </h4>
              <p className="whitespace-pre-wrap break-words">
                {plano?.compositionOfAssisting}
              </p>
            </div>

            <div className="space-y-2 mb-10 px-10 text-justify">
              <h4 className="text-lg font-semibold ">
                Outros Profissionais Envolvidos
              </h4>
              <ul className="list-disc list-inside">
                {plano?.otherProfessionals?.map((option: any) =>
                  option.professional === "Outro" ? (
                    <li key={option.professional}>
                      {option.professional} -{" "}
                      {plano?.otherProfessionalsDescription}
                    </li>
                  ) : (
                    <li key={option.professional}>{option.professional}</li>
                  ),
                )}
              </ul>
            </div>

            <div className="space-y- mb-10 px-10 text-justify">
              <h4 className="text-lg font-semibold ">
                Atividades Diferenciadas
              </h4>
              <ul className="list-disc list-inside">
                {plano?.differentiatedActivitiesInAEE?.map((option: any) => (
                  <li key={option.activity}>{option.activity}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 mb-10 px-10 text-justify">
              <h4 className="text-lg font-semibold ">
                Metodologia de Trabalho
              </h4>
              <ul className="list-disc list-inside">
                {plano?.workMethodology?.map((option: any) => (
                  <li key={option.methodology}>{option.methodology}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 mb-10 px-10 text-justify">
              <h4 className="text-lg font-semibold ">
                Recursos Materiais e Equipamentos
              </h4>
              <ul className="list-disc list-inside">
                {plano?.materialResourcesAndEquipment?.map((option: any) => (
                  <li key={option.resource}>{option.resource}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 mb-10 px-10 text-justify">
              <h4 className="text-lg font-semibold ">Critérios de Avaliação</h4>
              <ul className="list-disc list-inside">
                {plano?.criteriaInEvaluation?.map((option: any) => (
                  <li key={option.criterion}>{option.criterion}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 mb-10 px-10 text-justify">
              <h4 className="text-lg font-semibold ">Recursos e Estratégias</h4>
              <ul className="list-disc list-inside">
                {plano?.resourcesAndStrategies?.map((option: any) => (
                  <li key={option.strategy}>{option.strategy}</li>
                ))}
              </ul>
            </div>

            <div className="space-y-2 mb-10 px-10 text-justify">
              <h4 className="text-lg font-semibold ">Observações Adicionais</h4>
              <p className="whitespace-pre-wrap break-words">
                {plano?.additionalObservations}
              </p>
            </div>
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
