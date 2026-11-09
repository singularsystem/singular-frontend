import { Relatorio } from "./relatorio";

export interface DashboardSummary {
  totalStudents: number;
  totalReports: number;
  totalPAEEs: number;
  totalSchools: number;
  totalPEIsCompleted: number;
  totalPAEEsCompleted: number;
  totalCaseStudies: number;
  totalCaseStudiesCompleted: number;
  totalProcessesInProgress: number;
  totalBiopsychosocialReportsCompleted: number;
  totalBiopsychosocialReportsInProgress: number;
  totalBiopsychosocialReportsPendingSignature: number;
  psychologistFinished: number;
  psychologistInProgress: number;
  psychologistSigned: number;
  psychopedagogueFinished: number;
  psychopedagogueInProgress: number;
  psychopedagogueSigned: number;
  socialWorkerFinished: number;
  socialWorkerInProgress: number;
  socialWorkerSigned: number;
  totalStudentsLastMonth: number;
  totalReportsLast30Days: number;
  totalPAEEsLast30Days: number;
  totalPEIsLast30Days: number;
  distributionPerGenre: Record<string, number>;
  typeOfRegistration: Record<string, number>;
  typeOfDisability: Record<string, number>;
  studentsByAge: Record<string, number>;
  numberOfStudentsPerSchool: Record<string, number>;
  numberOfStudentsPerCity: Record<string, number>;
  numberOfConfiguredTotalStudentsPerCity: Record<string, number>;
  numberOfTotalRegistrationsPerMonth: Record<string, number>;
  numberOfAEERegistrationsPerMonth: Record<string, number>;
  numberOfReportsPerMonth: Record<string, number>;
  numberOfProfessionalsPerArea: Record<string, number>;
  totalConfiguredStudentsAcrossCities: number;
  selectedCityRegisteredStudents: number;
  selectedCityConfiguredStudents: number;
  selectedCityCoveragePercentage: number;
  reports: Relatorio[];
}

export interface StatisticsSummary {
  totalStudents: number;
  totalStudentsComparedToLastMonth: number;
  totalReports: number;
  totalReportsComparedToLastMonth: number;
  totalCities: number;
  totalCitiesThisMonth: number;
  reportCompletionPercentage: number;
  reportCompletionPercentageComparedToLastMonth: number;
  totalStudentsLastMonth: number;
  totalReportsLast30Days: number;
  distributionPerTypeOfDisability: Record<string, number>;
  numberOfReportsPerMonth: Record<string, number>;
  numberOfStudentsPerMonth: Record<string, number>;
  numberOfTotalRegistrationsPerCities: Record<string, number>;
  numberOfAEERegistrationsPerCities: Record<string, number>;
}
