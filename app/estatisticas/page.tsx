"use client";
export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
// import { generatePDFGraph } from "@/lib/pdf-utils";
import { BarChart, Download, LineChart, Loader2, PieChart } from "lucide-react";
import { useEffect, useState } from "react";

import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/auth-context";
import { useFetchCitiesByUf } from "@/hooks/useFetchCitiesByUf";
import { useFetchSchoolsByCity } from "@/hooks/useFetchSchools";
import { useFetchStatistics } from "@/hooks/useFetchStatistics";
import { estados, StatisticsFilters } from "@/lib/constants";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar, Line, Pie } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
);

const backgroundColors = [
  "rgba(255, 99, 132, 0.6)",
  "rgba(54, 162, 235, 0.6)",
  "rgba(255, 206, 86, 0.6)",
  "rgba(75, 192, 192, 0.6)",
  "rgba(153, 102, 255, 0.6)",
  "rgba(255, 159, 64, 0.6)",
  "rgba(199, 199, 199, 0.6)",
];

const borderColors = [
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
  "rgba(199, 199, 199, 1)",
];

export default function Estatisticas() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("distribuicao");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isLoading: authLoading } = useAuth();

  const [shouldFetchCities, setShouldFetchCities] = useState(false);
  const [shouldFetchSchools, setShouldFetchSchools] = useState(false);

  const [filters, setFilters] = useState<StatisticsFilters>({
    sex: "",
    state: "",
    city: "",
    schoolID: "",
    ageGroup: "",
    year: "",
    registrationType: "",
    disability: "",
  });

  const {
    cities,
    error: fetchErrorCities,
    loading: fetchLoadingCities,
  } = useFetchCitiesByUf(shouldFetchCities ? filters.state : "");

  const {
    schools,
    error: fetchErrorSchools,
    loading: fetchLoadingSchools,
  } = useFetchSchoolsByCity(shouldFetchSchools ? filters.city : "");

  const {
    estatisticas,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchStatistics(filters);

  useEffect(() => {
    if (filters.state) {
      setShouldFetchCities(true);
    }
  }, [filters.state]);

  useEffect(() => {
    if (filters.city) {
      setShouldFetchSchools(true);
    }
  }, [filters.city]);

  useEffect(() => {
    if (fetchErrorCities) {
      toast({
        title: "Erro ao buscar cidades",
        description:
          fetchErrorCities.message || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    }
  }, [fetchErrorCities, toast]);

  useEffect(() => {
    if (fetchErrorSchools) {
      toast({
        title: "Erro ao buscar escolas",
        description:
          fetchErrorSchools.message || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    }
  }, [fetchErrorSchools, toast]);

  useEffect(() => {
    if (fetchError) {
      toast({
        title: "Erro ao buscar estatisticas",
        description: fetchError.message || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    }
  }, [fetchError, toast]);

  const anoInicial = 2025;
  const anoAtual = new Date().getFullYear();
  const anos = Array.from(
    { length: anoAtual - anoInicial + 1 },
    (_, i) => anoInicial + i,
  );

  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  const monthMap: Record<string, string> = {
    Jan: "janeiro",
    Fev: "fevereiro",
    Mar: "março",
    Abr: "abril",
    Mai: "maio",
    Jun: "junho",
    Jul: "julho",
    Ago: "agosto",
    Set: "setembro",
    Out: "outubro",
    Nov: "novembro",
    Dez: "dezembro",
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleExportPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      const contentId = "estatisticas-export";
      const now = new Date();
      const datePart = now.toLocaleDateString("pt-BR").replaceAll("/", "-");
      const timePart = now
        .toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
        .replaceAll(":", "-");
      const filename = `Estatisticas-${datePart}_${timePart}`;

      const jsPDF = (await import("jspdf")).default;
      const html2canvas = (await import("html2canvas")).default;

      const element = document.getElementById(contentId);
      if (!element) {
        throw new Error(`Elemento com ID ${contentId} não encontrado`);
      }

      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
      await new Promise<void>((resolve) => setTimeout(resolve, 300));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const pdf = new jsPDF("p", "mm", "a4");

      const imgData = canvas.toDataURL("image/jpeg", 1.0);

      const marginX = 10;
      const marginTop = 10;
      const marginBottom = 10;
      const imgWidth = 210 - marginX * 2;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = marginTop;

      pdf.addImage(imgData, "JPEG", marginX, position, imgWidth, imgHeight);
      heightLeft -= pageHeight - marginBottom - position;

      while (heightLeft > 0) {
        position = marginTop;
        pdf.addPage();
        pdf.addImage(
          imgData,
          "JPEG",
          marginX,
          position - (pageHeight - marginBottom - marginTop),
          imgWidth,
          imgHeight,
        );
        heightLeft -= pageHeight - marginBottom - marginTop;
      }

      const pageCount =
        (pdf as unknown as { getNumberOfPages?: () => number }).getNumberOfPages?.() ??
        (pdf as unknown as { internal?: { getNumberOfPages?: () => number } })
          .internal?.getNumberOfPages?.() ??
        (pdf as unknown as { internal?: { pages?: unknown[] } }).internal?.pages
          ?.length ??
        1;
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(10);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Página ${i} de ${pageCount}`, 105, 290, { align: "center" });
        pdf.text(`Gerado em ${now.toLocaleDateString("pt-BR")}`, 105, 285, {
          align: "center",
        });
      }

      pdf.save(`${filename}.pdf`);

      toast({
        title: "PDF gerado com sucesso",
        description: `O arquivo ${filename}.pdf foi baixado.`,
        variant: "success",
      });
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Ocorreu um erro ao gerar o arquivo PDF.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const renderChartContent = (chartType: string, forExport = false) => {
    if (fetchLoading) {
      return (
        <div className="h-[400px] w-full flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">
            Carregando dados...
          </span>
        </div>
      );
    }

    if (!estatisticas) {
      return (
        <div className="h-[400px] w-full flex items-center justify-center">
          <span className="text-muted-foreground">
            Nenhum dado disponível para os filtros selecionados
          </span>
        </div>
      );
    }

    const valueLabelPlugin = {
      id: "valueLabels",
      afterDatasetsDraw: (chart: any) => {
        if (!forExport) return;

        const { ctx } = chart;
        ctx.save();
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const chartType = chart.config?.type;

        chart.data.datasets.forEach((dataset: any, datasetIndex: number) => {
          const meta = chart.getDatasetMeta(datasetIndex);
          if (meta?.hidden) return;

          const values = (dataset.data || []).map((v: any) => Number(v) || 0);
          const total = values.reduce((acc: number, v: number) => acc + v, 0);

          meta.data.forEach((element: any, index: number) => {
            const value = values[index];
            if (!Number.isFinite(value) || value === 0) return;

            const pos = element.tooltipPosition
              ? element.tooltipPosition()
              : { x: element.x, y: element.y };

            const isPie = chartType === "pie" || chartType === "doughnut";
            const label = isPie
              ? total > 0
                ? `${value} (${((value / total) * 100).toFixed(1)}%)`
                : `${value}`
              : `${value}`;

            const y = isPie ? pos.y : pos.y - 12;

            ctx.fillStyle = isPie ? "#111827" : "#111827";
            ctx.fillText(label, pos.x, y);
          });
        });

        ctx.restore();
      },
    };

    const normalizeLabel = (value: string) =>
      value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();

    const distributionEntries = Object.entries(
      estatisticas.distributionPerTypeOfDisability || {},
    )
      .map(([key, value]) => [key, Number(value)] as const)
      .filter(([, value]) => Number.isFinite(value));

    const distributionNonZeroEntries = distributionEntries.filter(
      ([, value]) => value > 0,
    );

    const disabilityBuckets = [
      { label: "Deficiência Intelectual", match: ["deficiencia intelectual"] },
      { label: "Deficiência Física", match: ["deficiencia fisica"] },
      {
        label: "Deficiência Auditiva",
        match: ["deficiencia auditiva", "surdez"],
      },
      {
        label: "Deficiência Visual",
        match: ["deficiencia visual", "baixa visao", "cegueira"],
      },
      {
        label: "Deficiência Múltipla",
        match: ["deficiencia multipla", "deficiencias multiplas"],
      },
      {
        label: "Transtorno do Espectro Autista",
        match: [
          "transtorno do espectro autista",
          "tea",
          "tea (transtorno do espectro autista)",
        ],
      },
      {
        label: "Altas Habilidades/Superdotação",
        match: ["altas habilidades", "superdotacao"],
      },
      { label: "TDAH", match: ["tdah"] },
    ];

    const bucketValues = disabilityBuckets.map(({ match }) =>
      distributionEntries.reduce((acc, [key, value]) => {
        const normalized = normalizeLabel(key);
        const isMatch = match.some(
          (m) => normalized === m || normalized.includes(m),
        );
        return isMatch ? acc + value : acc;
      }, 0),
    );

    const bucketSum = bucketValues.reduce((acc, v) => acc + v, 0);

    const dataDisabilities =
      bucketSum > 0
        ? {
            labels: disabilityBuckets.map((b) => b.label),
            datasets: [
              {
                label: "Quantidade de Alunos",
                data: bucketValues,
                backgroundColor: disabilityBuckets.map(
                  (_, i) => backgroundColors[i % backgroundColors.length],
                ),
                borderColor: disabilityBuckets.map(
                  (_, i) => borderColors[i % borderColors.length],
                ),
                borderWidth: 1,
              },
            ],
          }
        : {
            labels: distributionNonZeroEntries.map(([key]) => key),
            datasets: [
              {
                label: "Quantidade de Alunos",
                data: distributionNonZeroEntries.map(([, value]) => value),
                backgroundColor: distributionNonZeroEntries.map(
                  (_, i) => backgroundColors[i % backgroundColors.length],
                ),
                borderColor: distributionNonZeroEntries.map(
                  (_, i) => borderColors[i % borderColors.length],
                ),
                borderWidth: 1,
              },
            ],
          };

    const chartDataEvolution = {
      labels: months,
      datasets: [
        {
          label: "Relatórios por mês",
          data: months.map(
            (abbr) =>
              estatisticas.numberOfReportsPerMonth?.[monthMap[abbr]] ?? 0,
          ),
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.3,
        },
        {
          label: "Estudantes por mês",
          data: months.map(
            (abbr) =>
              estatisticas.numberOfStudentsPerMonth?.[monthMap[abbr]] ?? 0,
          ),
          borderColor: "rgba(255, 99, 132, 1)",
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          tension: 0.3,
        },
      ],
    };

    const optionsEvolution = {
      responsive: true,
      plugins: {
        legend: {
          position: "top" as const,
        },
        tooltip: {
          mode: "index" as const,
          intersect: false,
        },
      },
      interaction: {
        mode: "nearest" as const,
        axis: "x" as const,
        intersect: false,
      },
      scales: {
        y: {
          beginAtZero: true,
          precision: 0,
        },
      },
    };

    const citiesList = Array.from(
      new Set([
        ...Object.keys(estatisticas.numberOfTotalRegistrationsPerCities || {}),
        ...Object.keys(estatisticas.numberOfAEERegistrationsPerCities || {}),
      ]),
    );

    const chartDataComparativo = {
      labels: citiesList,
      datasets: [
        {
          label: "Alunos Totais",
          data: citiesList.map(
            (city) =>
              estatisticas.numberOfTotalRegistrationsPerCities?.[city] ?? 0,
          ),
          backgroundColor: "rgba(75, 192, 192, 0.7)",
        },
        {
          label: "Alunos AEE",
          data: citiesList.map(
            (city) =>
              estatisticas.numberOfAEERegistrationsPerCities?.[city] ?? 0,
          ),
          backgroundColor: "rgba(255, 99, 132, 0.7)",
        },
      ],
    };

    const barOptions = {
      responsive: true,
      plugins: {
        legend: { position: "top" as const },
        tooltip: { mode: "index" as const, intersect: false },
      },
      interaction: {
        mode: "nearest" as const,
        axis: "x" as const,
        intersect: false,
      },
      scales: {
        y: { beginAtZero: true, precision: 0 },
      },
    };

    const pieOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom" as const,
        },
        title: {
          display: true,
          text: "Distribuição por Tipo de Deficiência",
        },
      },
    };

    switch (chartType) {
      case "distribuicao":
        if (distributionNonZeroEntries.length === 0) {
          return (
            <div className="h-[400px] w-full flex items-center justify-center">
              <span className="text-muted-foreground">
                Nenhum dado de distribuição por deficiência para os filtros
                selecionados
              </span>
            </div>
          );
        }
        return (
          <div className="w-full h-full max-h-[400px]">
            <Pie
              data={dataDisabilities}
              options={pieOptions}
              plugins={forExport ? [valueLabelPlugin] : []}
            />
          </div>
        );
      case "evolucao":
        return (
          <div className="w-full h-full max-h-[400px]">
            <Line
              data={chartDataEvolution}
              options={optionsEvolution}
              plugins={forExport ? [valueLabelPlugin] : []}
            />
          </div>
        );
      case "comparativo":
        if (citiesList.length === 0) {
          return (
            <div className="h-[400px] w-full flex items-center justify-center">
              <span className="text-muted-foreground">
                Nenhum dado de municípios disponível para os filtros selecionados
              </span>
            </div>
          );
        }
        return (
          <div className="w-full h-full max-h-[400px]">
            <Bar
              data={chartDataComparativo}
              options={barOptions}
              plugins={forExport ? [valueLabelPlugin] : []}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const shouldShowFilter = (value: string | undefined) => {
    const v = value?.trim();
    if (!v) return false;
    const normalized = v.toLowerCase();
    if (normalized === "todos" || normalized === "todas") return false;
    return true;
  };

  const selectedSchoolName = schools.find((s) => s.id === filters.schoolID)
    ?.name;

  const exportFilters = [
    { label: "Sexo", value: filters.sex },
    { label: "UF", value: filters.state },
    { label: "Cidade", value: filters.city },
    { label: "Escola", value: selectedSchoolName },
    { label: "Faixa etária", value: filters.ageGroup },
    { label: "Ano", value: filters.year },
    { label: "Tipo de matrícula", value: filters.registrationType },
    { label: "Deficiência", value: filters.disability },
  ].filter((f) => shouldShowFilter(f.value));

  const exportGeneratedAt = new Date().toLocaleString("pt-BR");

  if (authLoading) {
    return (
      <main className="flex-1 p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando...</span>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6">
      <div
        id="estatisticas-export"
        className="fixed left-[-10000px] top-0 w-[1100px] bg-white p-6 space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Estatísticas</h1>
            <p className="text-sm text-muted-foreground">
              Gerado em {exportGeneratedAt}
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Filtros aplicados no relatório</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
            {exportFilters.length > 0 ? (
              exportFilters.map((f) => (
                <div key={f.label}>
                  <span className="font-medium">{f.label}: </span>
                  {f.value}
                </div>
              ))
            ) : (
              <span className="text-muted-foreground">
                Nenhum filtro aplicado
              </span>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Alunos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {estatisticas?.totalStudents || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                +{estatisticas?.totalStudentsComparedToLastMonth || 0}% em
                relação ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Relatórios Gerados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {estatisticas?.totalReports || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                +{estatisticas?.totalReportsComparedToLastMonth || 0}% em relação
                ao mês anterior
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Municípios Atendidos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {estatisticas?.totalCities || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                +{estatisticas?.totalCitiesThisMonth || 0} novos municípios este
                mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Taxa de Conclusão
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(estatisticas?.reportCompletionPercentage || 0).toFixed(1)}%
              </div>
              <p className="text-xs text-muted-foreground">
                +{estatisticas?.reportCompletionPercentageComparedToLastMonth ||
                  0}
                % em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Tipo de Deficiência</CardTitle>
              <CardDescription>
                Distribuição dos alunos por tipo de deficiência
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[400px] w-full flex items-center justify-center">
                {renderChartContent("distribuicao", true)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evolução de Atendimentos</CardTitle>
              <CardDescription>
                Evolução mensal dos atendimentos realizados
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[400px] w-full flex items-center justify-center">
                {renderChartContent("evolucao", true)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comparativo por Município</CardTitle>
              <CardDescription>
                Comparativo de atendimentos por município
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[400px] w-full flex items-center justify-center">
                {renderChartContent("comparativo", true)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Estatísticas</h1>
        <Button
          variant="outline"
          className="gap-2"
          onClick={handleExportPDF}
          disabled={isGeneratingPDF || fetchLoading}
        >
          {isGeneratingPDF ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Gerando PDF...
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              Exportar PDF
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Alunos
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {estatisticas?.totalStudents || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +{estatisticas?.totalStudentsComparedToLastMonth || 0}% em relação
              ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Relatórios Gerados
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M8 3H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.414A2 2 0 0 0 20.414 6L15 .586A2 2 0 0 0 13.586 0H8a2 2 0 0 0-2 2v1Z" />
              <path d="M14 3v4a1 1 0 0 0 1 1h4" />
              <path d="M17 21v-8" />
              <path d="M12 17l5 4" />
              <path d="M12 21l5-4" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {estatisticas?.totalReports || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +{estatisticas?.totalReportsComparedToLastMonth || 0}% em relação
              ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Municípios Atendidos
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {estatisticas?.totalCities || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              +{estatisticas?.totalCitiesThisMonth || 0} novos municípios este
              mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Taxa de Conclusão
            </CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {estatisticas?.reportCompletionPercentage || 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              +
              {estatisticas?.reportCompletionPercentageComparedToLastMonth || 0}
              % em relação ao mês anterior
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Filtros</CardTitle>
                <CardDescription>
                  Selecione os filtros para visualizar os dados
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={filters.state || ""}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      state: value === "todos" ? "" : value,
                      city: "",
                      schoolID: "",
                    }))
                  }
                >
                  <SelectTrigger id="estado">
                    <SelectValue placeholder="Selecione o estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os estados</SelectItem>
                    {estados?.map((est) => (
                      <SelectItem key={est.sigla} value={est.nome}>
                        {est.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="municipio">Município</Label>
                <Select
                  value={filters.city || ""}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      city: value === "todos" ? "" : value,
                      schoolID: "",
                    }))
                  }
                  disabled={!filters.state}
                >
                  <SelectTrigger id="municipio">
                    <SelectValue
                      placeholder={
                        fetchLoadingCities
                          ? "Carregando..."
                          : "Selecione o município"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os municípios</SelectItem>
                    {cities?.map((mun) => (
                      <SelectItem key={mun.id} value={mun.nome}>
                        {mun.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="escola">Escola</Label>
                <Select
                  value={filters.schoolID || ""}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      schoolID: value === "todas" ? "" : value,
                    }))
                  }
                  disabled={!filters.city}
                >
                  <SelectTrigger id="escola">
                    <SelectValue
                      placeholder={
                        fetchLoadingSchools
                          ? "Carregando..."
                          : "Selecione a escola"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as escolas</SelectItem>
                    {schools?.map((esc) => (
                      <SelectItem key={esc.id} value={esc.id}>
                        {esc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Período
                </label>
                <Select
                  value={filters.year || ""}
                  onValueChange={(value) => handleFilterChange("year", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o período" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os períodos</SelectItem>
                    {anos?.map((ano) => (
                      <SelectItem key={ano} value={String(ano)}>
                        {ano}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Tipo de Deficiência
                </label>
                <Select
                  value={filters.disability || ""}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      disability: value === "todas" ? "" : value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="Deficiência Intelectual">
                      Deficiência Intelectual
                    </SelectItem>
                    <SelectItem value="Deficiência Física">
                      Deficiência Física
                    </SelectItem>
                    <SelectItem value="Deficiência Auditiva">
                      Deficiência Auditiva
                    </SelectItem>
                    <SelectItem value="Deficiência Visual">
                      Deficiência Visual
                    </SelectItem>
                    <SelectItem value="Deficiência Múltipla">
                      Deficiência Múltipla
                    </SelectItem>
                    <SelectItem value="Transtorno do Espectro Autista">
                      Transtorno do Espectro Autista
                    </SelectItem>
                    <SelectItem value="Altas Habilidades/Superdotação">
                      Altas Habilidades/Superdotação
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Gênero</label>
                <Select
                  value={filters.sex || ""}
                  onValueChange={(value) =>
                    setFilters((prev) => ({
                      ...prev,
                      sex: value === "todos" ? "" : value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Faixa Etária
                </label>
                <Select
                  value={filters.ageGroup || ""}
                  onValueChange={(value) =>
                    handleFilterChange("ageGroup", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a faixa etária" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="0-5">0 a 5 anos</SelectItem>
                    <SelectItem value="6-10">6 a 10 anos</SelectItem>
                    <SelectItem value="11-14">11 a 14 anos</SelectItem>
                    <SelectItem value="15-18">15 a 18 anos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Tipo de Matrícula
                </label>
                <Select
                  value={filters.registrationType || ""}
                  onValueChange={(value) =>
                    handleFilterChange("registrationType", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de matrícula" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos</SelectItem>
                    <SelectItem value="Geral">Geral</SelectItem>
                    <SelectItem value="AEE">AEE</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs
        defaultValue="distribuicao"
        className="space-y-4"
        onValueChange={setActiveTab}
      >
        <TabsList>
          <TabsTrigger value="distribuicao" className="gap-2">
            <PieChart className="h-4 w-4" />
            Distribuição
          </TabsTrigger>
          <TabsTrigger value="evolucao" className="gap-2">
            <LineChart className="h-4 w-4" />
            Evolução
          </TabsTrigger>
          <TabsTrigger value="comparativo" className="gap-2">
            <BarChart className="h-4 w-4" />
            Comparativo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="distribuicao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Tipo de Deficiência</CardTitle>
              <CardDescription>
                Distribuição dos alunos por tipo de deficiência
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div
                id="distribuicao-chart"
                className="h-[400px] w-full flex items-center justify-center"
              >
                {renderChartContent("distribuicao")}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evolucao" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Evolução de Atendimentos</CardTitle>
              <CardDescription>
                Evolução mensal dos atendimentos realizados
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div
                id="evolucao-chart"
                className="h-[400px] w-full flex items-center justify-center"
              >
                {renderChartContent("evolucao")}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparativo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Comparativo por Município</CardTitle>
              <CardDescription>
                Comparativo de atendimentos por município
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div
                id="comparativo-chart"
                className="h-[400px] w-full flex items-center justify-center"
              >
                {renderChartContent("comparativo")}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
