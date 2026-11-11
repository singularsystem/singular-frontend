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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { toast } from "@/hooks/use-toast";
import {
  atividadesAEEOptions,
  composicaoOptions,
  criteriosOptions,
  estrategiasOptions,
  frequencialSemanalOptions,
  metodologiaOptions,
  profissionaisOptions,
  recursosOptions,
  tempoAtendimentoOptions,
  tipoAeeOptions,
} from "@/lib/constants";
import { portageData } from "@/lib/portage-data";
import { PortageResponse } from "@/types/portage";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePaeeForm } from "../../hooks/paee/usePaeeForm";

interface PaeeFormScreenProps {
  id: string; // portageId se !isEdit, paeeId se isEdit
  isEdit: boolean;
}

export function PaeeFormScreen({ id, isEdit }: PaeeFormScreenProps) {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const { user } = useAuth();

  const {
    formData,
    plano,
    portage,
    isSaving,
    error,
    saveSuccess,
    isLoading: fetchLoading,
    updateFormData,
    savePAEE,
  } = usePaeeForm(id, isEdit);

  const entityObj = isEdit ? plano : portage;

  useEffect(() => {
    if (error) {
      toast({
        title: "Erro",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  useEffect(() => {
    if (saveSuccess) {
      toast({
        title: "PAEE salvo com sucesso",
        description: isEdit ? "O PAEE foi atualizado com sucesso." : "O PAEE foi criado com sucesso.",
        variant: "success",
      });
      router.push(`/paee`);
    }
  }, [saveSuccess, isEdit, router]);

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
      case "Raciocínio Lógico-Matemático":
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

  const _portage = isEdit ? (entityObj as any)?.portage : entityObj;

  const respostas = Object.values(
    (_portage?.responses ?? {}) as Record<number, PortageResponse>,
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

  const selectedAgeRange = mapAgeRangeLabelToKey(_portage?.ageRange);

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

  const handleOrganizationChange = (option: string) => {
    const prev = formData.organizationOfCare;
    const alreadySelected = prev.some((item: any) => item.type === option);

    updateFormData({
      organizationOfCare: alreadySelected
        ? prev.filter((item: any) => item.type !== option)
        : [...prev, { type: option }],
    });
  };

  const handleProfessionalsChange = (option: string) => {
    const prev = formData.otherProfessionals;
    const alreadySelected = prev.some((item: any) => item.professional === option);

    updateFormData({
      otherProfessionals: alreadySelected
        ? prev.filter((item: any) => item.professional !== option)
        : [...prev, { professional: option }],
    });
  };

  const handleAtividadesAEEChange = (option: string) => {
    const prev = formData.differentiatedActivitiesInAEE;
    const isSelected = prev.some((item: any) => item.activity === option);

    updateFormData({
      differentiatedActivitiesInAEE: isSelected
        ? prev.filter((item: any) => item.activity !== option)
        : [...prev, { activity: option }],
    });
  };

  const handleMetodologiaChange = (option: string) => {
    const prev = formData.workMethodology;
    const isSelected = prev.some((item: any) => item.methodology === option);

    updateFormData({
      workMethodology: isSelected
        ? prev.filter((item: any) => item.methodology !== option)
        : [...prev, { methodology: option }],
    });
  };

  const handleRecursosChange = (option: string) => {
    const prev = formData.materialResourcesAndEquipment;
    const isSelected = prev.some((item: any) => item.resource === option);

    updateFormData({
      materialResourcesAndEquipment: isSelected
        ? prev.filter((item: any) => item.resource !== option)
        : [...prev, { resource: option }],
    });
  };

  const handleCriteriosChange = (option: string) => {
    const prev = formData.criteriaInEvaluation;
    const isSelected = prev.some((item: any) => item.criterion === option);

    updateFormData({
      criteriaInEvaluation: isSelected
        ? prev.filter((item: any) => item.criterion !== option)
        : [...prev, { criterion: option }],
    });
  };

  const handleStrategiesChange = (option: string) => {
    const prev = formData.resourcesAndStrategies;
    const isSelected = prev.some((item: any) => item.strategy === option);

    updateFormData({
      resourcesAndStrategies: isSelected
        ? prev.filter((item: any) => item.strategy !== option)
        : [...prev, { strategy: option }],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não logado.",
        variant: "destructive",
      });
      return;
    }
    savePAEE(user.id);
  };

  if (fetchLoading || !entityObj) {
    return (
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Carregando...</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 max-w-screen-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => (isEdit ? router.push("/paee") : setShowConfirm(true))}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-brand-navy">
            PAEE
          </h1>
        </div>
      </div>
      <DetalhesEstudanteCard obj={entityObj} />
      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Plano Pedagógico Especializado</CardTitle>
            <CardDescription>
              Preencha as informações do Plano Especializado Individual
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-blue-950 mb-4">
                Resumo da Avaliação
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 ">
                {Object.entries(dominiosMap).map(
                  ([dominio, respostasCategoria]) => {
                    const total = Object.values(respostasCategoria).reduce(
                      (sum, val) => sum + val,
                      0,
                    );

                    return (
                      <div
                        key={dominio}
                        className="rounded-lg border bg-card text-card-foreground shadow-sm border-l-4"
                      >
                        <div className="flex flex-col space-y-1.5 p-6 pb-3">
                          <div className="font-semibold tracking-tight text-lg flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${getColorDot(
                                dominio,
                              )}`}
                            ></div>
                            {dominio}
                          </div>
                          <div className="text-sm text-gray-600">
                            {total} questões avaliadas
                          </div>
                        </div>

                        <div className="p-6 pt-0">
                          <div className="mb-4">
                            {categorias.map((categoria) => {
                              const count =
                                respostasCategoria[categoria.label] || 0;
                              return (
                                <div
                                  key={categoria.label}
                                  className={`flex items-center justify-between text-center p-3 ${categoria.bg} rounded`}
                                >
                                  <div
                                    className={`text-xs ${categoria.corPorcentagem}`}
                                  >
                                    {categoria.label}:
                                  </div>
                                  <div
                                    className={`text-xl font-bold ${categoria.corTexto}`}
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
            <div className="mb-10">
              <div className="space-y-2">
                <Label
                  className="text-lg font-semibold text-blue-950 mb-4"
                  htmlFor="academicRecord"
                >
                  Histórico Escolar
                </Label>
                <Textarea
                  id="academicRecord"
                  name="academicRecord"
                  value={formData.academicRecord}
                  onChange={(e) => updateFormData({ academicRecord: e.target.value })}
                  placeholder="Descreva o histórico escolar da criança, marcos do desenvolvimento, diagnósticos anteriores, tratamentos realizados e outras informações relevantes..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <div className="mb-10">
              <div className="space-y-2">
                <Label
                  className="text-lg font-semibold text-blue-950 mb-4"
                  htmlFor="medicalReport"
                >
                  Tem Laudo Médico? Qual CID-10?
                </Label>
                <Textarea
                  id="medicalReport"
                  name="medicalReport"
                  value={formData.medicalReport}
                  onChange={(e) => updateFormData({ medicalReport: e.target.value })}
                  placeholder="Descreva o histórico escolar da criança, marcos do desenvolvimento, diagnósticos anteriores, tratamentos realizados e outras informações relevantes..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <div className="mb-10">
              <div className="space-y-2">
                <Label
                  className="text-lg font-semibold text-blue-950 mb-4"
                  htmlFor="medications"
                >
                  Usa Medicação? Quais?
                </Label>
                <Textarea
                  id="medications"
                  name="medications"
                  value={formData.medications}
                  onChange={(e) => updateFormData({ medications: e.target.value })}
                  placeholder="Descreva o histórico escolar da criança, marcos do desenvolvimento, diagnósticos anteriores, tratamentos realizados e outras informações relevantes..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <div className="mb-10">
              <div className="space-y-2">
                <Label
                  className="text-lg font-semibold text-blue-950 mb-4"
                  htmlFor="followUp"
                >
                  Faz Acompanhamento? Reabilitação?
                </Label>
                <Textarea
                  id="followUp"
                  name="followUp"
                  value={formData.followUp}
                  onChange={(e) => updateFormData({ followUp: e.target.value })}
                  placeholder="Descreva o histórico escolar da criança, marcos do desenvolvimento, diagnósticos anteriores, tratamentos realizados e outras informações relevantes..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <div className="mb-10">
              <h3 className="text-lg font-semibold text-blue-950 mb-4">
                Sugestões de Intervenção Pedagógica por Área de Desenvolvimento
              </h3>

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
            <div className="mb-10">
              <h3 className="text-base font-semibold text-blue-950 mb-4">
                Tipo de Atendimento Educacional Especializado
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {tipoAeeOptions.map((option) => (
                  <div
                    key={`tipo-${option}`}
                    className="flex items-center gap-2"
                  >
                    <Checkbox
                      id={`tipo-${option}`}
                      className="mt-1"
                      value={option}
                      checked={formData.organizationOfCare?.some(
                        (item: any) => item.type === option,
                      )}
                      onCheckedChange={() => handleOrganizationChange(option)}
                    />
                    <Label
                      className="text-gray-800 text-sm font-medium"
                      htmlFor={`tipo-${option}`}
                    >
                      {option}
                    </Label>
                  </div>
                ))}

                {formData.organizationOfCare?.some(
                  (item: any) => item.type === "Outro",
                ) && (
                  <div className="col-span-full mt-2 space-y-2">
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="outroTexto"
                    >
                      Qual?
                    </label>
                    <Textarea
                      id="outroTexto"
                      name="outroTexto"
                      value={formData.otherOrganization}
                      onChange={(e) => updateFormData({ otherOrganization: e.target.value })}
                      className="min-h-[100px]"
                      placeholder="Informe o(s) outro(s) tipo(s)..."
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="mb-10">
              <h3 className="text-base font-semibold text-blue-950 mb-4">
                Frequência Semanal *
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <RadioGroup
                  value={formData.weeklyFrequency}
                  onValueChange={(value) => updateFormData({ weeklyFrequency: value })}
                >
                  <div className="flex flex-col space-y-2">
                    {frequencialSemanalOptions.map((opcao, opcaoIndex) => (
                      <div
                        key={`frequencia-${opcao}`}
                        className="flex gap-2 items-center"
                      >
                        <RadioGroupItem
                          value={opcao}
                          id={`frequencia-${opcaoIndex}`}
                          className="mt-0.5"
                        />
                        <Label htmlFor={`frequencia-${opcaoIndex}`}>
                          <span className="text-gray-700">{opcao}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                {formData.weeklyFrequency === "Outra" && (
                  <div className="col-span-full mt-2 space-y-2">
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="otherFrequency"
                    >
                      Qual?
                    </label>
                    <Textarea
                      id="otherFrequency"
                      name="otherFrequency"
                      value={formData.otherFrequency}
                      onChange={(e) => updateFormData({ otherFrequency: e.target.value })}
                      className="min-h-[100px]"
                      placeholder="Informe qual é a frequência semanal..."
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="mb-10">
              <h3 className="text-base font-semibold text-blue-950 mb-4">
                Tempo de Atendimento por Sessão *
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <RadioGroup
                  value={formData.assistingTimePerSession}
                  onValueChange={(value) => updateFormData({ assistingTimePerSession: value })}
                >
                  <div className="flex flex-col space-y-2">
                    {tempoAtendimentoOptions.map((opcao, opcaoIndex) => (
                      <div
                        className="flex gap-2 items-center"
                        key={`tempo-sessao-${opcao}`}
                      >
                        <RadioGroupItem
                          value={opcao}
                          id={`tempo-sessao-${opcaoIndex}`}
                          className="mt-0.5"
                        />
                        <Label htmlFor={`tempo-sessao-${opcaoIndex}`}>
                          <span className="text-gray-700">{opcao}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                {formData.assistingTimePerSession === "Outro" && (
                  <div className="col-span-full mt-2 space-y-2">
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="otherServiceTime"
                    >
                      Qual?
                    </label>
                    <Textarea
                      id="otherServiceTime"
                      name="otherServiceTime"
                      value={formData.otherServiceTime}
                      onChange={(e) => updateFormData({ otherServiceTime: e.target.value })}
                      className="min-h-[100px]"
                      placeholder="Informe qual é o tempo de atendimento..."
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-base font-semibold text-blue-950 mb-4">
                Composição do Atendimento *
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <RadioGroup
                  value={formData.compositionOfAssisting}
                  onValueChange={(value) => updateFormData({ compositionOfAssisting: value })}
                >
                  <div className="flex flex-col space-y-2">
                    {composicaoOptions.map((opcao, opcaoIndex) => (
                      <div
                        className="flex gap-2 items-center"
                        key={`comportamento-${opcao}`}
                      >
                        <RadioGroupItem
                          value={opcao}
                          id={`comportamento-${opcaoIndex}`}
                          className="mt-0.5"
                        />
                        <Label htmlFor={`comportamento-${opcaoIndex}`}>
                          <span className="text-gray-700">{opcao}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-base font-semibold text-blue-950 mb-4">
                Outros Profissionais Envolvidos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {profissionaisOptions.map((option) => (
                  <div
                    key={`profissional-${option}`}
                    className="flex items-center gap-2"
                  >
                    <Checkbox
                      id={`profissional-${option}`}
                      className="mt-1"
                      value={option}
                      checked={formData.otherProfessionals?.some(
                        (item: any) => item.professional === option,
                      )}
                      onCheckedChange={() => handleProfessionalsChange(option)}
                    />
                    <Label
                      className="text-gray-800 text-sm font-medium"
                      htmlFor={`profissional-${option}`}
                    >
                      {option}
                    </Label>
                  </div>
                ))}

                {formData.otherProfessionals?.some(
                  (item: any) => item.professional === "Outro",
                ) && (
                  <div className="col-span-full mt-2 space-y-2">
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="otherProfessionalsDescription"
                    >
                      Qual?
                    </label>
                    <Textarea
                      id="otherProfessionalsDescription"
                      name="otherProfessionalsDescription"
                      value={formData.otherProfessionalsDescription}
                      onChange={(e) => updateFormData({ otherProfessionalsDescription: e.target.value })}
                      className="min-h-[100px]"
                      placeholder="Informe qual é(são) o(s) outro(s) profissional(is) envolvidos(s)..."
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="mb-10">
              <h3 className="text-base font-semibold text-blue-950 mb-4">
                Atividades Diferenciadas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {atividadesAEEOptions.map((option) => (
                  <div
                    key={`atividade-${option}`}
                    className="flex items-center gap-2"
                  >
                    <Checkbox
                      id={`atividade-${option}`}
                      className="mt-1"
                      value={option}
                      checked={formData.differentiatedActivitiesInAEE?.some(
                        (item: any) => item.activity === option,
                      )}
                      onCheckedChange={() => handleAtividadesAEEChange(option)}
                    />
                    <Label
                      className="text-gray-800 text-sm font-medium"
                      htmlFor={`atividade-${option}`}
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-base font-semibold text-blue-950 mb-4">
                Metodologia de Trabalho
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {metodologiaOptions.map((option) => (
                  <div
                    key={`metodologia-${option}`}
                    className="flex items-center gap-2"
                  >
                    <Checkbox
                      id={`metodologia-${option}`}
                      className="mt-1"
                      value={option}
                      checked={formData.workMethodology?.some(
                        (item: any) => item.methodology === option,
                      )}
                      onCheckedChange={() => handleMetodologiaChange(option)}
                    />
                    <Label
                      className="text-gray-800 text-sm font-medium"
                      htmlFor={`metodologia-${option}`}
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-base font-semibold text-blue-950 mb-4">
                Recursos Materiais e Equipamentos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {recursosOptions.map((option) => (
                  <div
                    key={`recurso-${option}`}
                    className="flex items-center gap-2"
                  >
                    <Checkbox
                      id={`recurso-${option}`}
                      className="mt-1"
                      value={option}
                      checked={formData.materialResourcesAndEquipment?.some(
                        (item: any) => item.resource === option,
                      )}
                      onCheckedChange={() => handleRecursosChange(option)}
                    />
                    <Label
                      className="text-gray-800 text-sm font-medium"
                      htmlFor={`recurso-${option}`}
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-base font-semibold text-blue-950 mb-4">
                Critérios de Avaliação
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {criteriosOptions.map((option) => (
                  <div
                    key={`criterio-${option}`}
                    className="flex items-center gap-2"
                  >
                    <Checkbox
                      id={`criterio-${option}`}
                      className="mt-1"
                      value={option}
                      checked={formData.criteriaInEvaluation?.some(
                        (item: any) => item.criterion === option,
                      )}
                      onCheckedChange={() => handleCriteriosChange(option)}
                    />
                    <Label
                      className="text-gray-800 text-sm font-medium"
                      htmlFor={`criterio-${option}`}
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <h3 className="text-base font-semibold text-blue-950 mb-4">
                Recursos e Estratégias
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {estrategiasOptions.map((option) => (
                  <div
                    key={`estrategia-${option}`}
                    className="flex items-center gap-2"
                  >
                    <Checkbox
                      id={`estrategia-${option}`}
                      className="mt-1"
                      value={option}
                      checked={formData.resourcesAndStrategies?.some(
                        (item: any) => item.strategy === option,
                      )}
                      onCheckedChange={() => handleStrategiesChange(option)}
                    />
                    <Label
                      className="text-gray-800 text-sm font-medium"
                      htmlFor={`estrategia-${option}`}
                    >
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <div className="space-y-2">
                <Label
                  className="text-base font-semibold text-blue-950 mb-4"
                  htmlFor="additionalObservations"
                >
                  Observações Adicionais
                </Label>
                <Textarea
                  id="additionalObservations"
                  name="additionalObservations"
                  value={formData.additionalObservations}
                  onChange={(e) => updateFormData({ additionalObservations: e.target.value })}
                  placeholder="Espaço para observações específicas do psicopedagogo..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <div className="mt-16 mb-6 flex justify-end">
              <Button
                type="submit"
                disabled={isSaving}
                className=" bg-brand-navy hover:bg-blue-800"
              >
                {isSaving ? "Salvando..." : "Salvar Plano"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
      {!isEdit && (
        <ConfirmDialog
          open={showConfirm}
          onOpenChange={setShowConfirm}
          actionDescription="cadastro de novo PAEE"
          actionName="cadastro"
          route="/paee"
        />
      )}
    </main>
  );
}
