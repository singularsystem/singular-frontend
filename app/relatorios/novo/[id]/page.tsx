"use client";
export const dynamic = "force-dynamic";
import type React from "react";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { DetalhesEstudanteCard } from "@/components/estudante/detalhes-estudante-card";
import { OptionsWithOther } from "@/components/forms/options-with-obs";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useFetchReport } from "@/hooks/useFetchReports";
import { useCreateSocialWorkerReport } from "@/hooks/useFetchSocialWorkerReports";
import { RendaFamiliarValidacaoModal } from "@/components/relatorio/renda-familiar-validacao-modal";
import {
  AcademicPerformanceOptions,
  CommunityActivityParticipationOptions,
  CreateSocialWorkerReportDTO,
  DailyMealsOptions,
  FamilyCompositionOptions,
  FamilyIncomeSourceOptions,
  FamilyRelationshipOptions,
  FoodSecurityOptions,
  HealthConditionsOptions,
  HealthServiceAccessOptions,
  HousingConditionsOptions,
  MainSchoolDifficultiesOptions,
  mapSocialWorkerReportFormToApiPayload,
  MonthlyHouseholdIncomeOptions,
  NumberOfPeopleInTheHouseholdOptions,
  NumberOfRoomsOptions,
  ProceduresOptions,
  ReceivedGovernmentBenefitsOptions,
  RecommendationsOptions,
  SchoolAttendanceOptions,
  SocialSupportNetworkOptions,
  TypeOfHousingOptions,
} from "@/types/relatorio-assistente-social";
import {
  Activity,
  ArrowLeft,
  Brain,
  ClipboardList,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function NovoRelatorio({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showRendaModal, setShowRendaModal] = useState(false);
  const [activeTab, setActiveTab] = useState("servico-social");
  const [userAssignedTab, setUserAssignedTab] = useState<string | null>(null);
  const { user, isLoading: authLoading } = useAuth();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const { createSocialWorkerReport, loading } = useCreateSocialWorkerReport();
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

  const [formData, setFormData] = useState<CreateSocialWorkerReportDTO>({
    reportID: "",
    studentID: "",
    userID: "",
    proceduresUsed: [],
    otherProceduresUsed: "",
    familyComposition: "",
    otherFamilyComposition: "",
    numberOfPeopleInTheHousehold: "",
    otherNumberOfPeopleInTheHousehold: "",
    additionalObservationHouseholdMembers: "",
    typeOfHousing: "",
    otherTypeOfHousing: "",
    housingConditions: "",
    otherHousingConditions: "",
    numberOfRooms: "",
    otherNumberOfRooms: "",
    monthlyHouseholdIncome: "",
    otherMonthlyHouseholdIncome: "",
    familyIncomeSource: [],
    otherFamilyIncomeSource: "",
    receivedGovernmentBenefits: [],
    otherReceivedGovernmentBenefits: "",
    healthConditions: [],
    otherDetailsHealthConditions: "",
    continuousMedication: "",
    detailsContinuousMedication: "",
    otherContinuousMedication: "",
    healthServiceAccess: "",
    otherHealthServiceAccess: "",
    schoolAttendance: "",
    otherSchoolAttendance: "",
    academicPerformance: "",
    otherAcademicPerformance: "",
    mainSchoolDifficulties: [],
    otherMainSchoolDifficulties: "",
    dailyMeals: "",
    otherDailyMeals: "",
    foodSecurity: "",
    otherFoodSecurity: "",
    familyRelationship: "",
    otherFamilyRelationship: "",
    socialSupportNetwork: "",
    otherSocialSupportNetwork: "",
    communityActivityParticipation: "",
    otherCommunityActivityParticipation: "",
    recommendations: [],
    otherRecommendations: "",
    conclusion: "",
    socioeconomicContext: "",
  });

  const medicationChoice = formData.continuousMedication;
  const isYes = medicationChoice === "Sim";
  const isOther = medicationChoice === "Outra";

  const ROLE_TO_TAB_MAP: Record<string, string> = {
    SocialWork: "servico-social",
    Psychologist: "psicologico",
    Psychopedagogue: "psicopedagogico",
  };

  useEffect(() => {
    if (user && Array.isArray(user.roles) && user.roles.length > 0) {
      let defaultTabValue: string = "servico-social";

      let assignedTab: string | null = null;
      for (const role of user.roles) {
        if (ROLE_TO_TAB_MAP[role]) {
          assignedTab = ROLE_TO_TAB_MAP[role];
          break;
        }
      }

      if (assignedTab) {
        defaultTabValue = assignedTab;
      }

      setUserAssignedTab(assignedTab);
      setActiveTab(defaultTabValue);
    }
  }, [user]);

  useEffect(() => {
    if (fetchLoading) return;

    if (fetchError) {
      toast({
        title: "Erro ao buscar relatorio",
        description: fetchError.message || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    }
  }, [fetchError, fetchLoading, relatorio, toast]);

  const isTabDisabled = (tabValue: string) => {
    console.log({ tabValue, userAssignedTab });
    return userAssignedTab !== null && tabValue !== userAssignedTab;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const doSubmit = async (data: typeof formData) => {
    setIsLoading(true);

    if (!relatorio || !user) {
      toast({
        title: "Erro",
        description: "Usuário ou relatório não carregado(s).",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const payload = mapSocialWorkerReportFormToApiPayload(
        data,
        relatorio?.student.id,
        user.id,
        relatorio.id,
      );

      const created = await createSocialWorkerReport(payload);
      console.log(created);

      toast({
        title: "Questionário Social salvo",
        description: "Questionário Social foi salvo com sucesso.",
        variant: "success",
      });

      if (
        !relatorio.psychologistReport?.unifiedAt ||
        !relatorio.psychopedagogueReport?.unifiedAt
      )
        router.push(`/relatorios/${created?.id}/servico-social/`);
      else {
        router.push(`/relatorios/${relatorio?.id}`);
      }
    } catch (error) {
      console.error("Erro ao salvar Questionário Social:", error);

      toast({
        variant: "destructive",
        title: "Erro ao salvar relatório",
        description:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro ao tentar salvar o relatório.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      formData.monthlyHouseholdIncome === "Outra" &&
      !formData.socioeconomicContext
    ) {
      setShowRendaModal(true);
      return;
    }

    await doSubmit(formData);
  };

  const handleRendaModalConfirm = async (context: string) => {
    setShowRendaModal(false);
    const updatedData = { ...formData, socioeconomicContext: context };
    setFormData(updatedData);
    await doSubmit(updatedData);
  };

  if (relatorio == null) {
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
            Novo Relatório Biopsicossocial
          </h1>
        </div>
      </div>
      <DetalhesEstudanteCard obj={relatorio} />
      <form onSubmit={handleSubmit}>
        <Tabs
          value={activeTab}
          className="w-full text-brand-navy mb-10"
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3 text-brand-navy active:text-brand-navy">
            <TabsTrigger
              value="servico-social"
              disabled={isTabDisabled("servico-social")}
            >
              Serviço Social
            </TabsTrigger>
            <TabsTrigger
              value="psicologico"
              disabled={isTabDisabled("psicologico")}
            >
              Psicológico
            </TabsTrigger>
            <TabsTrigger
              value="psicopedagogico"
              disabled={isTabDisabled("psicopedagogico")}
            >
              Psicopedagógico
            </TabsTrigger>
          </TabsList>

          <TabsContent value="servico-social" className="space-y-4 mt-4">
            <Card className="pb-4">
              <CardHeader>
                <CardTitle>Relatório de Serviço Social</CardTitle>
                <CardDescription>
                  Preencha as informações da avaliação social
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-10">
                <OptionsWithOther
                  title="Procedimentos utilizados"
                  options={ProceduresOptions}
                  mode="checkbox"
                  valueArray={formData.proceduresUsed}
                  onChangeArray={(next) =>
                    setFormData((prev) => ({
                      ...prev,
                      proceduresUsed: next,
                    }))
                  }
                  otherText={formData.otherProceduresUsed}
                  onOtherTextChange={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      otherProceduresUsed: text,
                    }))
                  }
                  otherPlaceholder="Quais outros procedimentos?"
                />

                <OptionsWithOther
                  title="Composição familiar"
                  options={FamilyCompositionOptions}
                  mode="radio"
                  value={formData.familyComposition}
                  onChange={(next) =>
                    setFormData((prev) => ({
                      ...prev,
                      familyComposition: next,
                    }))
                  }
                  otherText={formData.otherFamilyComposition}
                  onOtherTextChange={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      otherFamilyComposition: text,
                    }))
                  }
                  otherPlaceholder="Especifique a composição familiar..."
                />

                <div className="space-y-5">
                  <OptionsWithOther
                    title="Número de pessoas na residência"
                    options={NumberOfPeopleInTheHouseholdOptions}
                    mode="radio"
                    value={formData.numberOfPeopleInTheHousehold}
                    onChange={(next) =>
                      setFormData((prev) => ({
                        ...prev,
                        numberOfPeopleInTheHousehold: next,
                      }))
                    }
                    otherText={formData.otherNumberOfPeopleInTheHousehold}
                    onOtherTextChange={(text) =>
                      setFormData((prev) => ({
                        ...prev,
                        otherNumberOfPeopleInTheHousehold: text,
                      }))
                    }
                    otherPlaceholder="Especifique o número de pessoas..."
                  />
                  <Textarea
                    id="additionalObservationHouseholdMembers"
                    name="additionalObservationHouseholdMembers"
                    value={formData.additionalObservationHouseholdMembers}
                    onChange={handleChange}
                    placeholder="Descreva mais detalhes sobre os membros da residência (opcional)..."
                    className="min-h-[150px]"
                  />
                </div>
                <OptionsWithOther
                  title="Tipo de moradia"
                  options={TypeOfHousingOptions}
                  mode="radio"
                  value={formData.typeOfHousing}
                  onChange={(next) =>
                    setFormData((prev) => ({
                      ...prev,
                      typeOfHousing: next,
                    }))
                  }
                  otherText={formData.otherTypeOfHousing}
                  onOtherTextChange={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      otherTypeOfHousing: text,
                    }))
                  }
                  otherPlaceholder="Especifique o tipo de moradia..."
                />
                <OptionsWithOther
                  title="Condições da moradia"
                  options={HousingConditionsOptions}
                  mode="radio"
                  value={formData.housingConditions}
                  onChange={(next) =>
                    setFormData((prev) => ({
                      ...prev,
                      housingConditions: next,
                    }))
                  }
                  otherText={formData.otherHousingConditions}
                  onOtherTextChange={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      otherHousingConditions: text,
                    }))
                  }
                  otherPlaceholder="Especifique as condições da moradia..."
                />
                <OptionsWithOther
                  title="Número de cômodos"
                  options={NumberOfRoomsOptions}
                  mode="radio"
                  value={formData.numberOfRooms}
                  onChange={(next) =>
                    setFormData((prev) => ({
                      ...prev,
                      numberOfRooms: next,
                    }))
                  }
                  otherText={formData.otherNumberOfRooms}
                  onOtherTextChange={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      otherNumberOfRooms: text,
                    }))
                  }
                  otherPlaceholder="Especifique o número de cômodos..."
                />
                <OptionsWithOther
                  title="Renda familiar mensal"
                  options={MonthlyHouseholdIncomeOptions}
                  mode="radio"
                  value={formData.monthlyHouseholdIncome}
                  onChange={(next) =>
                    setFormData((prev) => ({
                      ...prev,
                      monthlyHouseholdIncome: next,
                    }))
                  }
                  otherText={formData.otherMonthlyHouseholdIncome}
                  onOtherTextChange={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      otherMonthlyHouseholdIncome: text,
                    }))
                  }
                  otherPlaceholder="Especifique a renda familiar..."
                />
                <OptionsWithOther
                  title="Fonte de renda"
                  options={FamilyIncomeSourceOptions}
                  mode="checkbox"
                  valueArray={formData.familyIncomeSource}
                  onChangeArray={(next) =>
                    setFormData((prev) => ({
                      ...prev,
                      familyIncomeSource: next,
                    }))
                  }
                  otherText={formData.otherFamilyIncomeSource}
                  onOtherTextChange={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      otherFamilyIncomeSource: text,
                    }))
                  }
                  otherPlaceholder="Especifique outra(s) fonte(s) de renda..."
                />
                <OptionsWithOther
                  title="Benefícios governamentais"
                  options={ReceivedGovernmentBenefitsOptions}
                  mode="checkbox"
                  valueArray={formData.receivedGovernmentBenefits}
                  onChangeArray={(next) =>
                    setFormData((prev) => ({
                      ...prev,
                      receivedGovernmentBenefits: next,
                    }))
                  }
                  otherText={formData.otherReceivedGovernmentBenefits}
                  onOtherTextChange={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      otherReceivedGovernmentBenefits: text,
                    }))
                  }
                  otherPlaceholder="Especifique outro(s) benefício(s)..."
                />
                <OptionsWithOther
                  title="O aluno apresenta alguma condição de saúde?"
                  options={HealthConditionsOptions}
                  mode="checkbox"
                  valueArray={formData.healthConditions}
                  onChangeArray={(next) =>
                    setFormData((prev) => ({
                      ...prev,
                      healthConditions: next,
                    }))
                  }
                  otherText={formData.otherDetailsHealthConditions}
                  onOtherTextChange={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      otherDetailsHealthConditions: text,
                    }))
                  }
                  otherPlaceholder="Especifique outra condição de saúde..."
                />
                <div>
                  <p className="mb-2 text-base font-medium">
                    Faz uso de medicação contínua?
                  </p>
                  <div className="space-y-4">
                    <RadioGroup
                      value={formData.continuousMedication ?? ""}
                      onValueChange={(next) =>
                        setFormData((prev) => {
                          const base = { ...prev, continuousMedication: next };

                          if (next === "Sim") {
                            return {
                              ...base,
                              otherContinuousMedication: "",
                            };
                          }

                          if (next === "Outra") {
                            return {
                              ...base,
                              detailsContinuousMedication: "",
                            };
                          }

                          return {
                            ...base,
                            detailsContinuousMedication: "",
                            otherContinuousMedication: "",
                          };
                        })
                      }
                      className="grid grid-cols-2 gap-2"
                    >
                      {["Não", "Sim", "Outra"].map((opt) => (
                        <div key={opt} className="flex items-center space-x-2">
                          <RadioGroupItem id={`opt-${opt}`} value={opt} />
                          <Label
                            htmlFor={`opt-${opt}`}
                            className="text-gray-700"
                          >
                            {opt}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>

                    {isYes ? (
                      <div className="space-y-2">
                        <Label className="text-sm">
                          Qual medicação contínua?
                        </Label>
                        <Textarea
                          value={formData.detailsContinuousMedication}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              detailsContinuousMedication: e.target.value,
                            }))
                          }
                          placeholder="Descreva a medicação, dose, frequência..."
                          className="min-h-[96px]"
                        />
                      </div>
                    ) : null}

                    {isOther ? (
                      <div className="space-y-2">
                        <Label className="text-sm">Observações</Label>
                        <Textarea
                          value={formData.otherContinuousMedication}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              otherContinuousMedication: e.target.value,
                            }))
                          }
                          placeholder="Especifique outras medicações contínuas"
                          className="min-h-[96px]"
                        />
                      </div>
                    ) : null}
                  </div>
                </div>
                <OptionsWithOther
                  title="Acesso à serviços de saúde"
                  options={HealthServiceAccessOptions}
                  mode="radio"
                  value={formData.healthServiceAccess}
                  onChange={(next) =>
                    setFormData((prev) => ({
                      ...prev,
                      healthServiceAccess: next,
                    }))
                  }
                  otherText={formData.otherHealthServiceAccess}
                  onOtherTextChange={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      otherHealthServiceAccess: text,
                    }))
                  }
                  otherPlaceholder="Especifique o acesso à serviços de saúde..."
                />
                <OptionsWithOther
                  title="Frequência escolar"
                  options={SchoolAttendanceOptions}
                  mode="radio"
                  value={formData.schoolAttendance}
                  onChange={(next) =>
                    setFormData((prev) => ({
                      ...prev,
                      schoolAttendance: next,
                    }))
                  }
                  otherText={formData.otherSchoolAttendance}
                  onOtherTextChange={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      otherSchoolAttendance: text,
                    }))
                  }
                  otherPlaceholder="Especifique a frequência escolar..."
                />
                <OptionsWithOther
                  title="Desempenho acadêmico"
                  options={AcademicPerformanceOptions}
                  mode="radio"
                  value={formData.academicPerformance}
                  onChange={(next) =>
                    setFormData((prev) => ({
                      ...prev,
                      academicPerformance: next,
                    }))
                  }
                  otherText={formData.otherAcademicPerformance}
                  onOtherTextChange={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      otherAcademicPerformance: text,
                    }))
                  }
                  otherPlaceholder="Especifique o desempenho acadêmico..."
                />
                <OptionsWithOther
                  title="Principais dificuldades escolares"
                  options={MainSchoolDifficultiesOptions}
                  mode="checkbox"
                  valueArray={formData.mainSchoolDifficulties}
                  onChangeArray={(next) =>
                    setFormData((prev) => ({
                      ...prev,
                      mainSchoolDifficulties: next,
                    }))
                  }
                  otherText={formData.otherMainSchoolDifficulties}
                  onOtherTextChange={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      otherMainSchoolDifficulties: text,
                    }))
                  }
                  otherPlaceholder="Especifique outras dificuldades..."
                />
                <OptionsWithOther
                  title="Número de refeições diárias"
                  options={DailyMealsOptions}
                  mode="radio"
                  value={formData.dailyMeals}
                  onChange={(next) =>
                    setFormData((prev) => ({
                      ...prev,
                      dailyMeals: next,
                    }))
                  }
                  otherText={formData.otherDailyMeals}
                  onOtherTextChange={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      otherDailyMeals: text,
                    }))
                  }
                  otherPlaceholder="Especifique sobre o número de refeições..."
                />
                <OptionsWithOther
                  title="Segurança alimentar"
                  options={FoodSecurityOptions}
                  mode="radio"
                  value={formData.foodSecurity}
                  onChange={(next) =>
                    setFormData((prev) => ({
                      ...prev,
                      foodSecurity: next,
                    }))
                  }
                  otherText={formData.otherFoodSecurity}
                  onOtherTextChange={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      otherFoodSecurity: text,
                    }))
                  }
                  otherPlaceholder="Especifique a segurança alimentar..."
                />
                <OptionsWithOther
                  title="Relacionamento familiar"
                  options={FamilyRelationshipOptions}
                  mode="radio"
                  value={formData.familyRelationship}
                  onChange={(next) =>
                    setFormData((prev) => ({
                      ...prev,
                      familyRelationship: next,
                    }))
                  }
                  otherText={formData.otherFamilyRelationship}
                  onOtherTextChange={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      otherFamilyRelationship: text,
                    }))
                  }
                  otherPlaceholder="Especifique o relacionamento familiar..."
                />
                <OptionsWithOther
                  title="Rede de apoio social"
                  options={SocialSupportNetworkOptions}
                  mode="radio"
                  value={formData.socialSupportNetwork}
                  onChange={(next) =>
                    setFormData((prev) => ({
                      ...prev,
                      socialSupportNetwork: next,
                    }))
                  }
                  otherText={formData.otherSocialSupportNetwork}
                  onOtherTextChange={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      otherSocialSupportNetwork: text,
                    }))
                  }
                  otherPlaceholder="Especifique a rede de apoio social..."
                />
                <OptionsWithOther
                  title="Participação em atividades comunitárias"
                  options={CommunityActivityParticipationOptions}
                  mode="radio"
                  value={formData.communityActivityParticipation}
                  onChange={(next) =>
                    setFormData((prev) => ({
                      ...prev,
                      communityActivityParticipation: next,
                    }))
                  }
                  otherText={formData.otherCommunityActivityParticipation}
                  onOtherTextChange={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      otherCommunityActivityParticipation: text,
                    }))
                  }
                  otherPlaceholder="Especifique a participação em atividades comunitárias..."
                />
                <OptionsWithOther
                  title="Recomendações"
                  options={RecommendationsOptions}
                  mode="checkbox"
                  valueArray={formData.recommendations}
                  onChangeArray={(next) =>
                    setFormData((prev) => ({
                      ...prev,
                      recommendations: next,
                    }))
                  }
                  otherText={formData.otherRecommendations}
                  onOtherTextChange={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      otherRecommendations: text,
                    }))
                  }
                  otherPlaceholder="Especifique outras recomendações..."
                />
                <div className="space-y-4 pt-6">
                  <Label className="text-xl font-semibold">
                    9. Conclusão e Observações Complementares (Opcional)
                  </Label>
                  <Textarea
                    id="conclusion"
                    name="conclusion"
                    value={formData.conclusion}
                    onChange={handleChange}
                    placeholder="Adicione aqui suas conclusões e observações complementares sobre a avaliação social..."
                    className="min-h-[200px]"
                  />
                </div>
              </CardContent>
              <div className="mt-6 mx-6 flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className=" bg-brand-navy hover:bg-blue-800"
                >
                  {isLoading ? "Salvando..." : "Salvar Relatório"}
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="psicologico" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Relatório Psicológico</CardTitle>
                <CardDescription>
                  Preencha as informações da avaliação psicológica
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-6 mb-8 items-stretch">
                  <Link
                    className="block h-full"
                    href={
                      !relatorio?.psychologistReport?.snapIVQuestionnaire
                        ? `/questionarios/snapiv/novo/${relatorio?.id}`
                        : `/questionarios/snapiv/${relatorio?.psychologistReport?.id}`
                    }
                  >
                    <div className="text-card-foreground flex flex-col gap-6 rounded-xl py-20 shadow-sm cursor-pointer transition-all hover:shadow-xl border-2 border-blue-200 hover:border-blue-400 bg-blue-50">
                      <div
                        id="card-header"
                        className="grid auto-rows-min grid-rows-auto items-start gap-2 px-6 [.border-b]:pb-6 text-center"
                      >
                        <div className="mx-auto w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6">
                          <Brain className="w-10 h-10 text-blue-600"></Brain>
                        </div>
                        <div
                          id="card-title"
                          className="text-2xl font-bold text-blue-900"
                        >
                          Escala Snap IV
                        </div>
                      </div>
                      <div
                        id="card-content"
                        className="px-6 space-y-3 text-sm text-blue-800 flex items-center flex-col"
                      >
                        <p>Avaliação de TDAH</p>
                      </div>
                    </div>
                  </Link>

                  {relatorio?.student?.age !== undefined && relatorio.student.age >= 6 && (
                    <Link
                      className="block h-full"
                      href={
                        !relatorio?.psychologistReport?.adaptiveBehaviorScaleDI
                          ? `/questionarios/escala-adaptativa-di/novo/${relatorio?.id}`
                          : `/questionarios/escala-adaptativa-di/${relatorio?.psychologistReport?.id}`
                      }
                    >
                      <div className="text-card-foreground flex flex-col gap-6 rounded-xl py-20 shadow-sm cursor-pointer transition-all hover:shadow-xl border-2 border-emerald-200 hover:border-emerald-400 bg-emerald-50">
                        <div
                          id="card-header"
                          className="grid auto-rows-min grid-rows-auto items-start gap-2 px-6 [.border-b]:pb-6 text-center"
                        >
                          <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                            <FileText className="w-10 h-10 text-emerald-600"></FileText>
                          </div>
                          <div
                            id="card-title"
                            className="text-2xl font-bold text-emerald-900"
                          >
                            Escala Adaptativa-DI
                          </div>
                        </div>
                        <div
                          id="card-content"
                          className="px-6 space-y-3 text-sm text-emerald-800 flex items-center flex-col"
                        >
                          <p>Funcionamento adaptativo</p>
                        </div>
                      </div>
                    </Link>
                  )}
                  <Link
                    className="block h-full"
                    href={
                      !relatorio?.psychologistReport?.psychologistQuestionnaire
                        ? `/questionarios/psicologo/novo/${relatorio?.id}`
                        : `/questionarios/psicologo/${relatorio?.psychologistReport?.id}`
                    }
                  >
                    <div className="text-card-foreground flex flex-col gap-6 rounded-xl py-20 shadow-sm cursor-pointer transition-all hover:shadow-xl border-2 border-purple-200 hover:border-purple-400 bg-purple-50">
                      <div
                        id="card-header"
                        className="grid auto-rows-min grid-rows-auto items-start gap-2 px-6 [.border-b]:pb-6 text-center"
                      >
                        <div className="mx-auto w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                          <ClipboardList className="w-10 h-10 text-purple-600"></ClipboardList>
                        </div>
                        <div
                          id="card-title"
                          className="text-2xl font-bold text-purple-900"
                        >
                          Questionário de Triagem
                        </div>
                      </div>
                      <div
                        id="card-content"
                        className="px-6 space-y-3 text-sm text-purple-800 flex items-center flex-col"
                      >
                        <p>Ficha de triagem 1:1</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="psicopedagogico" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="mb-1">
                      Relatório Psicopedagógico
                    </CardTitle>
                    <CardDescription>
                      Preencha as informações da avaliação psicopedagógica
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-6 mb-8 items-stretch">
                  {relatorio?.student?.age !== undefined && (
                    <Link
                      className="block h-full"
                      href={
                        relatorio.student.age < 3
                          ? // 👉 MCHAT
                            relatorio?.psychopedagogueReport?.mchatQuestionnaire
                            ? `/questionarios/mchat/${relatorio.psychopedagogueReport?.id}`
                            : `/questionarios/mchat/novo/${relatorio?.id}`
                          : // 👉 CARS
                            relatorio?.psychopedagogueReport?.carsQuestionnaire
                            ? `/questionarios/cars-childhood/${relatorio.psychopedagogueReport?.id}`
                            : `/questionarios/cars-childhood/novo/${relatorio?.id}`
                      }
                    >
                      <div className="h-full text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm cursor-pointer transition-all hover:shadow-xl border-2 border-purple-200 hover:border-purple-400 bg-purple-50">
                        <div
                          id="card-header"
                          className="grid auto-rows-min grid-rows-auto items-start gap-2 px-6 [.border-b]:pb-6 text-center"
                        >
                          <div className="mx-auto w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mb-6">
                            <Brain className="w-10 h-10 text-purple-600"></Brain>
                          </div>
                          <div
                            id="card-title"
                            className="text-2xl font-bold text-purple-900"
                          >
                            TEA
                          </div>
                          <div
                            id="card-description"
                            className="text-base text-purple-700 mt-2"
                          >
                            Transtorno do Espectro Autista
                          </div>
                        </div>
                        <div
                          id="card-content"
                          className="px-6 space-y-3 text-sm text-purple-800 flex items-center flex-col"
                        >
                          <p>- MCHAT (abaixo de 36 meses)</p>
                          <p>- CARS (acima de 36 meses)</p>
                        </div>
                      </div>
                    </Link>
                  )}

                  {relatorio?.student.age !== undefined && relatorio.student.age >= 6 && (
                    <Link
                      className="block h-full"
                      href={
                        !relatorio?.psychopedagogueReport?.cognitiveAssessment
                          ? `/questionarios/avaliacao-cognitiva/novo/${relatorio?.id}`
                          : `/questionarios/avaliacao-cognitiva/${relatorio?.psychopedagogueReport?.id}`
                      }
                    >
                      <div className="h-full text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm cursor-pointer transition-all hover:shadow-xl border-2 border-indigo-200 hover:border-indigo-400 bg-indigo-50">
                        <div
                          id="card-header"
                          className="grid auto-rows-min grid-rows-auto items-start gap-2 px-6 [.border-b]:pb-6 text-center"
                        >
                          <div className="mx-auto w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
                            <Activity className="w-10 h-10 text-indigo-600"></Activity>
                          </div>
                          <div
                            id="card-title"
                            className="text-2xl font-bold text-indigo-900"
                          >
                            Funcionamento Intelectual
                          </div>
                          <div
                            id="card-description"
                            className="text-base text-indigo-700 mt-2"
                          >
                            Avaliação de Maturidade Cognitiva
                          </div>
                        </div>
                        <div
                          id="card-content"
                          className="px-6 space-y-3 text-sm text-indigo-800 flex items-center flex-col"
                        >
                          <p>- Escala de avaliação cognitiva</p>
                          <p>- Análise de funcionamento intelectual</p>
                        </div>
                      </div>
                    </Link>
                  )}
                  <Link
                    className="block h-full"
                    href={
                      !relatorio?.psychopedagogueReport?.psychopedagogueQuestionnaire
                        ? `/questionarios/psicopedagogo/novo/${relatorio?.id}`
                        : `/questionarios/psicopedagogo/${relatorio?.psychopedagogueReport?.id}`
                    }
                  >
                    <div className="h-full text-card-foreground flex flex-col gap-6 rounded-xl py-6 shadow-sm cursor-pointer transition-all hover:shadow-xl border-2 border-emerald-200 hover:border-emerald-400 bg-emerald-50">
                      <div
                        id="card-header"
                        className="grid auto-rows-min grid-rows-auto items-start gap-2 px-6 [.border-b]:pb-6 text-center"
                      >
                        <div className="mx-auto w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
                          <ClipboardList className="w-10 h-10 text-emerald-600"></ClipboardList>
                        </div>
                        <div
                          id="card-title"
                          className="text-2xl font-bold text-emerald-900"
                        >
                          Questionário Psicopedagógico
                        </div>
                        <div
                          id="card-description"
                          className="text-base text-emerald-700 mt-2"
                        >
                          Avaliação Psicopedagógica
                        </div>
                      </div>
                      <div
                        id="card-content"
                        className="px-6 space-y-3 text-sm text-emerald-800 flex items-center flex-col"
                      >
                        <p>- Avaliação de aprendizagem</p>
                        <p>- Análise pedagógica</p>
                      </div>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        actionDescription="cadastro de novo relatório"
        actionName="cadastro"
        route="/relatorios"
      />
      <RendaFamiliarValidacaoModal
        open={showRendaModal}
        onConfirm={handleRendaModalConfirm}
      />
    </main>
  );
}
