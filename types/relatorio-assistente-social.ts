import { StudentSummary } from "./aluno";
import { ProfessionalSummary } from "./usuario";

export interface SocialWorkerReport {
  id: string;
  student: StudentSummary;
  professional: ProfessionalSummary;
  reportID: string;
  proceduresUsed: ProcedureUsed[];
  otherProceduresUsed: string;
  familyComposition: string;
  otherFamilyComposition: string;
  numberOfPeopleInTheHousehold: string;
  otherNumberOfPeopleInTheHousehold: string;
  additionalObservationHouseholdMembers: string;
  typeOfHousing: string;
  otherTypeOfHousing: string;
  housingConditions: string;
  otherHousingConditions: string;
  numberOfRooms: string;
  otherNumberOfRooms: string;
  monthlyHouseholdIncome: string;
  otherMonthlyHouseholdIncome: string;
  familyIncomeSource: FamilyIncomeSource[];
  otherFamilyIncomeSource: string;
  receivedGovernmentBenefits: ReceivedGovernmentBenefit[];
  otherReceivedGovernmentBenefits: string;
  healthConditions: HealthCondition[];
  otherDetailsHealthConditions: string;
  continuousMedication: string;
  detailsContinuousMedication: string;
  otherContinuousMedication: string;
  healthServiceAccess: string;
  otherHealthServiceAccess: string;
  schoolAttendance: string;
  otherSchoolAttendance: string;
  academicPerformance: string;
  otherAcademicPerformance: string;
  mainSchoolDifficulties: MainSchoolDifficulty[];
  otherMainSchoolDifficulties: string;
  dailyMeals: string;
  otherDailyMeals: string;
  foodSecurity: string;
  otherFoodSecurity: string;
  familyRelationship: string;
  otherFamilyRelationship: string;
  socialSupportNetwork: string;
  otherSocialSupportNetwork: string;
  communityActivityParticipation: string;
  otherCommunityActivityParticipation: string;
  recommendations: Recommendation[];
  otherRecommendations: string;
  conclusion: string | null;
  socioeconomicContext: string | null;
  createdAt: string;
  localCreatedAt: string;
  updatedAt: string | null;
  localUpdatedAt: string | null;
}

export type ProcedureUsed = {
  procedure: string;
};

export type FamilyIncomeSource = {
  source: string;
};

export type ReceivedGovernmentBenefit = {
  benefit: string;
};

export type HealthCondition = {
  condition: string;
};

export type MainSchoolDifficulty = {
  difficulty: string;
};

export type Recommendation = {
  recommendation: string;
};

export type CheckboxReportArrayField =
  | "proceduresUsed"
  | "incomeSource"
  | "receivedGovernmentBenefits"
  | "healthConditions"
  | "mainSchoolDifficulties"
  | "recommendations";

export type CreateSocialWorkerReportDTO = {
  studentID: string;
  userID: string;
  reportID: string;
  proceduresUsed: string[];
  otherProceduresUsed: string;
  familyComposition: string;
  otherFamilyComposition: string;
  numberOfPeopleInTheHousehold: string;
  otherNumberOfPeopleInTheHousehold: string;
  additionalObservationHouseholdMembers: string;
  typeOfHousing: string;
  otherTypeOfHousing: string;
  housingConditions: string;
  otherHousingConditions: string;
  numberOfRooms: string;
  otherNumberOfRooms: string;
  monthlyHouseholdIncome: string;
  otherMonthlyHouseholdIncome: string;
  familyIncomeSource: string[];
  otherFamilyIncomeSource: string;
  receivedGovernmentBenefits: string[];
  otherReceivedGovernmentBenefits: string;
  healthConditions: string[];
  otherDetailsHealthConditions: string;
  continuousMedication: string;
  detailsContinuousMedication: string;
  otherContinuousMedication: string;
  healthServiceAccess: string;
  otherHealthServiceAccess: string;
  schoolAttendance: string;
  otherSchoolAttendance: string;
  academicPerformance: string;
  otherAcademicPerformance: string;
  mainSchoolDifficulties: string[];
  otherMainSchoolDifficulties: string;
  dailyMeals: string;
  otherDailyMeals: string;
  foodSecurity: string;
  otherFoodSecurity: string;
  familyRelationship: string;
  otherFamilyRelationship: string;
  socialSupportNetwork: string;
  otherSocialSupportNetwork: string;
  communityActivityParticipation: string;
  otherCommunityActivityParticipation: string;
  recommendations: string[];
  otherRecommendations: string;
  conclusion: string;
  socioeconomicContext: string;
};

export type CreateSocialWorkerReportApiPayload = Omit<
  CreateSocialWorkerReportDTO,
  | "proceduresUsed"
  | "familyIncomeSource"
  | "receivedGovernmentBenefits"
  | "healthConditions"
  | "mainSchoolDifficulties"
  | "recommendations"
> & {
  proceduresUsed: ProcedureUsed[];
  familyIncomeSource: FamilyIncomeSource[];
  receivedGovernmentBenefits: ReceivedGovernmentBenefit[];
  healthConditions: HealthCondition[];
  mainSchoolDifficulties: MainSchoolDifficulty[];
  recommendations: Recommendation[];
};

export function mapSocialWorkerReportFormToApiPayload(
  data: CreateSocialWorkerReportDTO,
  studentID: string,
  userID: string,
  reportID: string,
): CreateSocialWorkerReportApiPayload {
  return {
    ...data,
    studentID,
    userID,
    reportID,
    proceduresUsed: data.proceduresUsed.map((procedure) => ({
      procedure: procedure,
    })),
    familyIncomeSource: data.familyIncomeSource.map((source) => ({
      source: source,
    })),
    receivedGovernmentBenefits: data.receivedGovernmentBenefits.map(
      (benefit) => ({
        benefit: benefit,
      }),
    ),
    healthConditions: data.healthConditions.map((condition) => ({
      condition: condition,
    })),
    mainSchoolDifficulties: data.mainSchoolDifficulties.map((difficulty) => ({
      difficulty: difficulty,
    })),
    recommendations: data.recommendations.map((recommendation) => ({
      recommendation: recommendation,
    })),
  };
}

export type UpdateSocialWorkerReportDTO = CreateSocialWorkerReportDTO & {
  id: string;
};

export type UpdateSocialWorkerReportApiPayload =
  CreateSocialWorkerReportApiPayload & {
    id: string;
  };

export function mapSocialWorkerReportUpdateToApiPayload(
  data: UpdateSocialWorkerReportDTO,
  studentID: string,
  userID: string,
  reportID: string,
): UpdateSocialWorkerReportApiPayload {
  return {
    id: data.id,
    ...mapSocialWorkerReportFormToApiPayload(data, studentID, userID, reportID),
  };
}

export const ProceduresOptions = [
  "Entrevista com a família",
  "Visita domiciliar",
  "Contato com a escola",
  "Análise de documentos",
  "Consulta a outros serviços (saúde, assistência social)",
  "Outro",
];

export const FamilyCompositionOptions = [
  "Nuclear (pais e filhos)",
  "Monoparental (mãe ou pai com filhos)",
  "Extensa (avós, tios, primos convivendo)",
  "Outro",
];

export const NumberOfPeopleInTheHouseholdOptions = [
  "2 a 3 pessoas",
  "4 a 5 pessoas",
  "6 ou mais pessoas",
  "Outro",
];

export const TypeOfHousingOptions = [
  "Própria",
  "Alugada",
  "Cedida (por familiares ou outros)",
  "Outra",
];

export const HousingConditionsOptions = [
  "Adequada (estrutura segura, água, luz, esgoto)",
  "Precária (problemas estruturais ou falta de saneamento)",
  "Insalubre (risco à saúde)",
  "Outra",
];

export const NumberOfRoomsOptions = [
  "1 a 2 cômodos",
  "3 a 4 cômodos",
  "5 ou mais cômodos",
  "Outro",
];

export const MonthlyHouseholdIncomeOptions = [
  "Até 1 salário mínimo",
  "De 1 a 2 salários mínimos",
  "De 2 a 3 salários mínimos",
  "Acima de 3 salários mínimos",
  "Outra",
];

export const FamilyIncomeSourceOptions = [
  "Trabalho formal (carteira assinada)",
  "Trabalho informal",
  "Autônomo",
  "Benefícios sociais",
  "Desempregado",
  "Outra",
];

export const ReceivedGovernmentBenefitsOptions = [
  "Bolsa Família",
  "BPC (Benefício de Prestação Continuada)",
  "Cesta básica",
  "Nenhum",
  "Outro",
];

export const HealthConditionsOptions = [
  "Não",
  "Doença crônica (diabetes, asma, etc.)",
  "Deficiência física ou intelectual",
  "Transtorno mental ou emocional",
  "Outra",
];

export const ContinuousMedicationDescriptionOptions = ["Não", "Sim", "Outro"];

export const HealthServiceAccessOptions = [
  "Regular (UBS, posto de saúde)",
  "Difícil (longe, falta transporte)",
  "Privado (plano de saúde)",
  "Outro",
];

export const SchoolAttendanceOptions = [
  "Regular",
  "Irregular (faltas frequentes)",
  "Evadido",
  "Outro",
];

export const AcademicPerformanceOptions = [
  "Satisfatório",
  "Com dificuldades",
  "Necessita de acompanhamento especializado",
  "Outra",
];

export const MainSchoolDifficultiesOptions = [
  "Leitura e escrita",
  "Matemática",
  "Concentração",
  "Comportamento",
  "Nenhuma",
  "Outra",
];

export const DailyMealsOptions = [
  "3 ou mais refeições",
  "2 refeições",
  "1 refeição ou menos",
  "Outro",
];

export const FoodSecurityOptions = [
  "Alimentação regular",
  "Insegurança alimentar (falta de alimentos frequente)",
  "Depende de programas sociais (merenda escolar, cestas básicas)",
  "Outra",
];

export const FamilyRelationshipOptions = [
  "Harmonioso",
  "Com conflitos frequentes",
  "Indícios de violência doméstica",
  "Outro",
];

export const SocialSupportNetworkOptions = [
  "Presente (familiares, vizinhos, amigos)",
  "Frágil ou inexistente",
  "Outro",
];

export const CommunityActivityParticipationOptions = [
  "Ativa (igreja, esportes, projetos sociais)",
  "Pouca ou nenhuma participação",
  "Outra",
];

export const RecommendationsOptions = [
  "Acompanhamento psicológico",
  "Encaminhamento para serviços de saúde",
  "Apoio material (cestas básicas, auxílios)",
  "Orientação familiar",
  "Acompanhamento escolar especializado",
  "Inclusão em programas sociais",
  "Participação em atividades comunitárias",
  "Outra",
];
