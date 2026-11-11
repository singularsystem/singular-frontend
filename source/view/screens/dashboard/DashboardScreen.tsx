"use client";

import { useDashboard } from "../../hooks/dashboard/useDashboard";
import { BarChart } from "@/components/dashboard/bar-chart";
import StatsCard from "@/components/dashboard/card";
import { LineChart } from "@/components/dashboard/line-chart";
import { PieChart } from "@/components/dashboard/pie-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { estados, tiposDeficiencia } from "@/lib/constants";
import {
  BookOpen,
  Brain,
  Building2,
  Calendar,
  Ear,
  Eye,
  FileDown,
  Layers,
  Map,
  Puzzle,
  School,
  Sparkles,
  User,
  Users,
  ShipWheelIcon as Wheelchair,
  Zap,
} from "lucide-react";
import { useEffect, useMemo } from "react";

export function DashboardScreen() {
  const {
    state,
    updateFilter,
    resetFilters,
    setMunicipalityTotalInput,
    saveMunicipalityTotal,
    setActiveTab,
    setIsGeneratingPDF,
    clearError,
    clearCitiesError,
    clearSchoolsError,
  } = useDashboard();

  // Expor erros no Toast
  useEffect(() => {
    if (state.error) {
      toast({
        title: "Erro ao buscar estatisticas",
        description: state.error,
        variant: "destructive",
      });
      clearError();
    }
  }, [state.error, clearError]);

  useEffect(() => {
    if (state.errorCities) {
      toast({
        title: "Erro ao buscar cidades",
        description: state.errorCities,
        variant: "destructive",
      });
      clearCitiesError();
    }
  }, [state.errorCities, clearCitiesError]);

  useEffect(() => {
    if (state.errorSchools) {
      toast({
        title: "Erro ao buscar escolas",
        description: state.errorSchools,
        variant: "destructive",
      });
      clearSchoolsError();
    }
  }, [state.errorSchools, clearSchoolsError]);

  // Mensagens informativas para listas vazias carregadas
  useEffect(() => {
    if (
      state.filters.state &&
      !state.isLoadingCities &&
      state.cities.length === 0
    ) {
      toast({
        title: "Lista de cidades não foi encontrada",
        variant: "info",
      });
    }
  }, [state.cities, state.isLoadingCities, state.filters.state]);

  useEffect(() => {
    if (
      state.filters.city &&
      !state.isLoadingSchools &&
      state.schools.length === 0
    ) {
      toast({
        title: "Lista de escolas não foi encontrada",
        variant: "info",
      });
    }
  }, [state.schools, state.isLoadingSchools, state.filters.city]);

  useEffect(() => {
    if (!state.isLoading && !state.estatisticas && !state.error) {
      toast({
        title: "Estatisticas não foram encontradas",
        description: "Por favor, cadastre alguma escola!",
        variant: "info",
      });
    }
  }, [state.estatisticas, state.isLoading, state.error]);

  const showComparativoMunicipio = Boolean(
    state.filters.city && state.filters.state
  );

  const labelsGenre = useMemo(
    () =>
      state.estatisticas
        ? Object.keys(state.estatisticas.distributionPerGenre)
        : [],
    [state.estatisticas]
  );

  const dataGenre = useMemo(
    () =>
      state.estatisticas
        ? labelsGenre.map(
            (label) => state.estatisticas!.distributionPerGenre[label] || 0
          )
        : [],
    [state.estatisticas, labelsGenre]
  );

  const dataRegistration = useMemo(
    () =>
      state.estatisticas
        ? ["AEE", "Transtornos", "Geral"].map(
            (label) => state.estatisticas!.typeOfRegistration[label] || 0
          )
        : [],
    [state.estatisticas]
  );

  const dataDisabilities = useMemo(
    () =>
      state.estatisticas
        ? [
            "Deficiência Intelectual",
            "Deficiência Física",
            "Surdez",
            "Baixa Visão",
            "Deficiências Múltiplas",
            "TEA (Transtorno do Espectro Autista)",
          ].map((label) => state.estatisticas!.typeOfDisability[label] || 0)
        : [],
    [state.estatisticas]
  );

  const dataAges = useMemo(
    () =>
      state.estatisticas
        ? Object.values(state.estatisticas.studentsByAge)
        : [],
    [state.estatisticas]
  );
  const labelsAges = useMemo(
    () =>
      state.estatisticas
        ? Object.keys(state.estatisticas.studentsByAge)
        : [],
    [state.estatisticas]
  );

  const dataSchools = useMemo(
    () =>
      state.estatisticas
        ? Object.values(state.estatisticas.numberOfStudentsPerSchool)
        : [],
    [state.estatisticas]
  );
  const labelsSchools = useMemo(
    () =>
      state.estatisticas
        ? Object.keys(state.estatisticas.numberOfStudentsPerSchool)
        : [],
    [state.estatisticas]
  );

  const meses = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  const labelsEvolution = meses;

  const evolutionTotal = useMemo<Record<string, number>>(() => {
    return Object.fromEntries(
      labelsEvolution.map((mes) => [
        mes,
        state.estatisticas?.numberOfTotalRegistrationsPerMonth[mes] ?? 0,
      ])
    );
  }, [state.estatisticas]);

  const dataEvolutionTotal = useMemo(
    () => (state.estatisticas ? Object.values(evolutionTotal) : []),
    [state.estatisticas, evolutionTotal]
  );

  const evolutionAEE = useMemo<Record<string, number>>(() => {
    return Object.fromEntries(
      labelsEvolution.map((mes) => [
        mes,
        state.estatisticas?.numberOfAEERegistrationsPerMonth[mes] ?? 0,
      ])
    );
  }, [state.estatisticas]);

  const dataEvolutionAEE = useMemo(
    () => (state.estatisticas ? Object.values(evolutionAEE) : []),
    [state.estatisticas, evolutionAEE]
  );

  const dataCities = useMemo(
    () =>
      state.estatisticas
        ? Object.values(state.estatisticas.numberOfStudentsPerCity)
        : [],
    [state.estatisticas]
  );
  const labelsCities = useMemo(
    () =>
      state.estatisticas
        ? Object.keys(state.estatisticas.numberOfStudentsPerCity)
        : [],
    [state.estatisticas]
  );

  const relatoriosPorMes = useMemo<Record<string, number>>(() => {
    return Object.fromEntries(
      meses.map((mes) => [
        mes,
        state.estatisticas?.numberOfReportsPerMonth[mes] ?? 0,
      ])
    );
  }, [state.estatisticas]);

  const dataRelatoriosPorMes = useMemo(
    () => (state.estatisticas ? Object.values(relatoriosPorMes) : []),
    [state.estatisticas, relatoriosPorMes]
  );

  const dataProfissionais = useMemo(
    () =>
      state.estatisticas
        ? Object.values(state.estatisticas.numberOfProfessionalsPerArea)
        : [],
    [state.estatisticas]
  );
  const labelsProfissionais = useMemo(
    () =>
      state.estatisticas
        ? Object.keys(state.estatisticas.numberOfProfessionalsPerArea)
        : [],
    [state.estatisticas]
  );

  const getDeficienciaIcon = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case "visual":
        return <Eye className="h-4 w-4" />;
      case "auditiva":
        return <Ear className="h-4 w-4" />;
      case "intelectual":
        return <Brain className="h-4 w-4" />;
      case "física":
        return <Wheelchair className="h-4 w-4" />;
      case "tdah":
        return <Zap className="h-4 w-4" />;
      case "espectro autista":
        return <Puzzle className="h-4 w-4" />;
      case "superdotação":
        return <Sparkles className="h-4 w-4" />;
      default:
        return <Layers className="h-4 w-4" />;
    }
  };

  const handleSaveMunicipalityTotalClick = async () => {
    console.log("[DashboardScreen] Clicked save total");
    try {
      await saveMunicipalityTotal();
      console.log("[DashboardScreen] Save success");
      toast({
        title: "Quantidade salva",
        description: "O total de alunos do município foi atualizado.",
        variant: "success",
      });
    } catch (error: any) {
      console.error("[DashboardScreen] Save error caught in UI:", error);
      toast({
        title: "Erro ao salvar total do município",
        description: error.message || "Ocorreu um erro ao salvar.",
        variant: "destructive",
      });
    }
  };

  const handleExportDashboardPDF = async () => {
    if (!state.estatisticas) {
      toast({
        title: "Nenhum dado para exportar",
        description: "Aguarde o carregamento das estatísticas do dashboard.",
        variant: "info",
      });
      return;
    }

    try {
      setIsGeneratingPDF(true);
      const [{ default: html2canvas }, jsPdfMod] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);
      const jsPDF: any = (jsPdfMod as any).jsPDF ?? (jsPdfMod as any).default;
      const date = new Date();
      const filename = `Dashboard-${date
        .toLocaleDateString("pt-BR")
        .replaceAll("/", "-")}.pdf`;

      const pdf = new jsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const marginMm = 10;
      const contentWidthMm = pageWidth - marginMm * 2;

      const chunk = <T,>(arr: T[], size: number) => {
        const out: T[][] = [];
        for (let i = 0; i < arr.length; i += size)
          out.push(arr.slice(i, i + size));
        return out;
      };

      const escapeHtml = (value: string) =>
        value
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&#039;");

      const formatDateTime = () =>
        `${date.toLocaleDateString(
          "pt-BR"
        )} às ${date.toLocaleTimeString("pt-BR")}`;

      const schoolLabel =
        state.filters.schoolID != null && state.filters.schoolID !== ""
          ? state.schools?.find((s) => s.id === state.filters.schoolID)?.name ??
            state.filters.schoolID
          : "Todas";

      const renderPage = (title: string, bodyHtml: string) => {
        const container = document.createElement("div");
        container.style.position = "fixed";
        container.style.left = "0";
        container.style.top = "0";
        container.style.zIndex = "2147483647";
        container.style.width = "794px";
        container.style.background = "#ffffff";
        container.style.color = "#111827";
        container.style.padding = "24px";
        container.style.fontFamily = "Arial, sans-serif";
        container.style.boxSizing = "border-box";

        container.innerHTML = `
          <div style="display:flex; justify-content:space-between; gap:16px; align-items:flex-start;">
            <div>
              <div style="font-size:18px; font-weight:700; color:hsl(var(--brand-navy));">${escapeHtml(
                title
              )}</div>
              <div style="margin-top:4px; font-size:12px; color:#64748b;">Gerado em ${escapeHtml(
                formatDateTime()
              )}</div>
            </div>
            <div style="font-size:11px; color:#64748b; text-align:right; line-height:1.4;">
              <div style="font-weight:700; color:#334155;">Filtros</div>
              <div>Estado: <span style="color:#0f172a;">${escapeHtml(
                state.filters.state ?? "Todos"
              )}</span></div>
              <div>Município: <span style="color:#0f172a;">${escapeHtml(
                state.filters.city ?? "Todos"
              )}</span></div>
              <div>Escola: <span style="color:#0f172a;">${escapeHtml(
                schoolLabel
              )}</span></div>
              <div>Gênero: <span style="color:#0f172a;">${escapeHtml(
                state.filters.sex ?? "Todos"
              )}</span></div>
              <div>Faixa etária: <span style="color:#0f172a;">${escapeHtml(
                `${state.filters.minimalAge ?? "-"} a ${
                  state.filters.maximumAge ?? "-"
                }`
              )}</span></div>
              <div>Tipo de matrícula: <span style="color:#0f172a;">${escapeHtml(
                state.filters.registrationType ?? "Todos"
              )}</span></div>
              <div>Deficiência: <span style="color:#0f172a;">${escapeHtml(
                state.filters.disability ?? "Todas"
              )}</span></div>
              <div>Mês: <span style="color:#0f172a;">${escapeHtml(
                state.filters.month
                  ? [
                      "Janeiro",
                      "Fevereiro",
                      "Março",
                      "Abril",
                      "Maio",
                      "Junho",
                      "Julho",
                      "Agosto",
                      "Setembro",
                      "Outubro",
                      "Novembro",
                      "Dezembro",
                    ][Number(state.filters.month) - 1]
                  : "Todos"
              )}</span></div>
              <div>Ano: <span style="color:#0f172a;">${escapeHtml(
                state.filters.year ?? "Todos"
              )}</span></div>
            </div>
          </div>
          <div style="height:1px; background:#e2e8f0; margin:14px 0;"></div>
          ${bodyHtml}
        `;

        document.body.appendChild(container);
        return container;
      };

      const renderKeyValueGrid = (rows: Array<[string, string]>) => `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; font-size:12px;">
          ${rows
            .map(
              ([k, v]) => `
                <div style="border:1px solid #e5e7eb; border-radius:8px; padding:10px; display:flex; justify-content:space-between; gap:10px;">
                  <div style="color:#334155;">${escapeHtml(k)}</div>
                  <div style="font-weight:700; color:#0f172a;">${escapeHtml(
                    v
                  )}</div>
                </div>
              `
            )
            .join("")}
        </div>
      `;

      const renderTable = (headers: string[], rows: string[][]) => `
        <table style="width:100%; border-collapse:collapse; font-size:11px;">
          <thead>
            <tr>
              ${headers
                .map(
                  (h, i) => `
                    <th style="border:1px solid #e5e7eb; background:#f8fafc; padding:7px; text-align:${
                      i === headers.length - 1 ? "right" : "left"
                    }; font-weight:700; color:#334155;">${escapeHtml(h)}</th>
                  `
                )
                .join("")}
            </tr>
          </thead>
          <tbody>
            ${
              rows.length > 0
                ? rows
                    .map(
                      (r) => `
                        <tr>
                          ${r
                            .map(
                              (cell, i) => `
                                <td style="border:1px solid #e5e7eb; padding:7px; text-align:${
                                  i === r.length - 1 ? "right" : "left"
                                }; color:#0f172a;">${escapeHtml(cell)}</td>
                              `
                            )
                            .join("")}
                        </tr>
                      `
                    )
                    .join("")
                : `
                  <tr>
                    <td style="border:1px solid #e5e7eb; padding:10px; color:#64748b;" colspan="${headers.length}">Sem dados</td>
                  </tr>
                `
            }
          </tbody>
        </table>
      `;

      const addPageFromHtml = async (
        title: string,
        bodyHtml: string,
        pageIndex: number
      ) => {
        const el = renderPage(title, bodyHtml);
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
        );
        const canvas = await html2canvas(el, {
          scale: 2,
          backgroundColor: "#ffffff",
          useCORS: true,
          scrollX: 0,
          scrollY: 0,
          windowWidth: el.scrollWidth,
          windowHeight: el.scrollHeight,
        });
        el.remove();

        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeightMm = (contentWidthMm * imgProps.height) / imgProps.width;
        const renderHeightMm = Math.min(pageHeight - marginMm * 2, imgHeightMm);

        if (pageIndex > 0) pdf.addPage();
        pdf.addImage(
          imgData,
          "JPEG",
          marginMm,
          marginMm,
          contentWidthMm,
          renderHeightMm
        );
      };

      const summaryRows: Array<[string, string]> = [
        ["Total de alunos", String(state.estatisticas.totalStudents ?? 0)],
        [
          "Alunos com Deficiências/AEE",
          String(state.estatisticas.typeOfRegistration?.AEE ?? 0),
        ],
        [
          "Alunos com Transtornos",
          String(state.estatisticas.typeOfRegistration?.Transtornos ?? 0),
        ],
        [
          "Relatórios biopsicossociais",
          String(state.estatisticas.totalReports ?? 0),
        ],
        ["Estudos de caso", String(state.estatisticas.totalCaseStudies ?? 0)],
        ["Escolas (AEE)", String(state.estatisticas.totalSchools ?? 0)],
        [
          "Total alunos (municípios configurados)",
          String(state.estatisticas.totalConfiguredStudentsAcrossCities ?? 0),
        ],
      ];
      if (showComparativoMunicipio) {
        summaryRows.push([
          `Comparativo (${state.filters.city})`,
          `${state.estatisticas.selectedCityRegisteredStudents ?? 0} / ${
            state.estatisticas.selectedCityConfiguredStudents ?? 0
          }`,
        ]);
        summaryRows.push([
          "Cobertura do município",
          `${state.estatisticas.selectedCityCoveragePercentage ?? 0}%`,
        ]);
      }

      let pageIndex = 0;
      await addPageFromHtml(
        "Relatório do Dashboard",
        `<div style="font-size:14px; font-weight:700; color:hsl(var(--brand-navy)); margin-bottom:10px;">Resumo</div>${renderKeyValueGrid(
          summaryRows
        )}`,
        pageIndex++
      );

      const sections: Array<{
        title: string;
        data: Record<string, number> | undefined;
      }> = [
        {
          title: "Distribuição por gênero",
          data: state.estatisticas.distributionPerGenre,
        },
        {
          title: "Tipo de matrícula",
          data: state.estatisticas.typeOfRegistration,
        },
        {
          title: "Distribuição por deficiência",
          data: state.estatisticas.typeOfDisability,
        },
        { title: "Alunos por idade", data: state.estatisticas.studentsByAge },
        {
          title: "Alunos por escola",
          data: state.estatisticas.numberOfStudentsPerSchool,
        },
        {
          title: "Alunos por município",
          data: state.estatisticas.numberOfStudentsPerCity,
        },
        {
          title: "Total configurado por município",
          data: state.estatisticas.numberOfConfiguredTotalStudentsPerCity,
        },
        {
          title: "Cadastros totais por mês",
          data: state.estatisticas.numberOfTotalRegistrationsPerMonth,
        },
        {
          title: "Cadastros AEE por mês",
          data: state.estatisticas.numberOfAEERegistrationsPerMonth,
        },
        {
          title: "Relatórios por mês",
          data: state.estatisticas.numberOfReportsPerMonth,
        },
        {
          title: "Profissionais por área",
          data: state.estatisticas.numberOfProfessionalsPerArea,
        },
      ];

      for (const section of sections) {
        const entries = Object.entries(section.data ?? {}).sort(
          (a, b) => (b[1] ?? 0) - (a[1] ?? 0)
        );
        const parts = chunk(entries, 32);
        if (parts.length === 0) {
          await addPageFromHtml(
            "Relatório do Dashboard",
            `<div style="font-size:14px; font-weight:700; color:hsl(var(--brand-navy)); margin-bottom:10px;">${escapeHtml(
              section.title
            )}</div>${renderTable(["Categoria", "Quantidade"], [])}`,
            pageIndex++
          );
          continue;
        }

        for (let i = 0; i < parts.length; i++) {
          const partTitle =
            parts.length > 1
              ? `${section.title} (parte ${i + 1}/${parts.length})`
              : section.title;
          await addPageFromHtml(
            "Relatório do Dashboard",
            `<div style="font-size:14px; font-weight:700; color:hsl(var(--brand-navy)); margin-bottom:10px;">${escapeHtml(
              partTitle
            )}</div>${renderTable(
              ["Categoria", "Quantidade"],
              parts[i].map(([k, v]) => [k, String(v ?? 0)])
            )}`,
            pageIndex++
          );
        }
      }

      const recentReports = (state.estatisticas.reports ?? []).map((r) => [
        r.student.fullName ?? "-",
        r.student.schoolName ?? "-",
        r.localCreatedAt ?? "-",
        r.status ?? "-",
      ]);
      const reportParts = chunk(recentReports, 22);
      if (reportParts.length === 0) {
        await addPageFromHtml(
          "Relatório do Dashboard",
          `<div style="font-size:14px; font-weight:700; color:hsl(var(--brand-navy)); margin-bottom:10px;">Relatórios Recentes</div>${renderTable(
            ["Aluno", "Escola", "Data", "Status"],
            []
          )}`,
          pageIndex++
        );
      } else {
        for (let i = 0; i < reportParts.length; i++) {
          const partTitle =
            reportParts.length > 1
              ? `Relatórios Recentes (parte ${i + 1}/${reportParts.length})`
              : "Relatórios Recentes";
          await addPageFromHtml(
            "Relatório do Dashboard",
            `<div style="font-size:14px; font-weight:700; color:hsl(var(--brand-navy)); margin-bottom:10px;">${escapeHtml(
              partTitle
            )}</div>${renderTable(
              ["Aluno", "Escola", "Data", "Status"],
              reportParts[i]
            )}`,
            pageIndex++
          );
        }
      }

      pdf.save(filename);

      toast({
        title: "PDF gerado com sucesso",
        description: "O arquivo foi gerado e está sendo baixado.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar PDF",
        description:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro ao exportar.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight text-brand-navy">
          Dashboard
        </h2>
        <Button
          variant="outline"
          className="gap-2"
          onClick={handleExportDashboardPDF}
          disabled={state.isLoading || state.isGeneratingPDF}
        >
          <FileDown className="h-4 w-4" />
          {state.isGeneratingPDF ? "Gerando PDF..." : "Exportar PDF"}
        </Button>
      </div>

      <div className={
        showComparativoMunicipio
          ? "grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
          : "grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3"
      }>
        <StatsCard
          key="total_alunos_municipios"
          title="Total Alunos Municípios"
          value={
            state.estatisticas?.totalConfiguredStudentsAcrossCities?.toString() ??
            "0"
          }
          change={
            state.estatisticas?.totalConfiguredStudentsAcrossCities
              ? `${Math.round(
                  ((state.estatisticas?.totalStudents ?? 0) /
                    state.estatisticas.totalConfiguredStudentsAcrossCities) *
                    100
                )}%`
              : "0%"
          }
          changeText="alunos cadastrados no sistema vs total informado"
          icon={Building2}
        />
        <StatsCard
          key="total_alunos"
          title="Total de Alunos"
          value={state.estatisticas?.totalStudents.toString() ?? "0"}
          change={`${state.porcentagemStudents.toString()}%`}
          changeText="em relação ao mês anterior"
          icon={Users}
        />

        {showComparativoMunicipio && (
          <StatsCard
            key="comparativo_municipio_filtrado"
            title={`Comparativo: ${state.filters.city}`}
            value={`${state.estatisticas?.selectedCityRegisteredStudents ?? 0} / ${
              state.estatisticas?.selectedCityConfiguredStudents ?? 0
            }`}
            change={`${state.estatisticas?.selectedCityCoveragePercentage ?? 0}%`}
            changeText="cadastrados no sistema vs total do município"
            icon={Map}
          />
        )}

        <StatsCard
          key="estudos_de_caso"
          title="Estudos de Caso"
          value={state.estatisticas?.totalCaseStudies.toString() ?? "0"}
          changeText={
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-lg bg-emerald-50 px-2.5 py-1.5 text-xs font-semibold text-emerald-800 border border-emerald-100">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span>
                  {state.estatisticas?.totalCaseStudiesCompleted?.toString() ??
                    "0"}{" "}
                  concluídos
                </span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-800 border border-amber-100">
                <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                <span>
                  {state.estatisticas
                    ? Math.max(
                        0,
                        state.estatisticas.totalCaseStudies -
                          state.estatisticas.totalCaseStudiesCompleted
                      ).toString()
                    : "0"}{" "}
                  em andamento
                </span>
              </div>
            </div>
          }
          icon={BookOpen}
        />

        <StatsCard
          key="escolas"
          title="Escolas"
          value={state.estatisticas?.totalSchools.toString() ?? "0"}
          change={state.estatisticas?.totalSchools.toString() ?? "0"}
          changeText="com atendimento AEE"
          icon={School}
        />

        <StatsCard
          key="paees_concluidos"
          title="PAEE Concluídos"
          value={state.estatisticas?.totalPAEEsCompleted.toString() ?? "0"}
          change={Math.round(
            state.estatisticas?.totalPAEEsLast30Days ?? 0
          ).toString()}
          changeText="nos últimos 30 dias"
          icon={Map}
        />

        <StatsCard
          key="peis_concluidos"
          title="PEI Concluídos"
          value={state.estatisticas?.totalPEIsCompleted.toString() ?? "0"}
          change={state.estatisticas?.totalPEIsLast30Days?.toString() ?? "0"}
          changeText="nos últimos 30 dias"
          icon={BookOpen}
        />

        <StatsCard
          key="total_alunos_aee"
          title="Alunos com Deficiências/AEE"
          value={state.estatisticas?.typeOfRegistration?.AEE?.toString() ?? "0"}
          change={`${
            state.estatisticas && state.estatisticas.totalStudents > 0
              ? Math.round(
                  ((state.estatisticas.typeOfRegistration?.AEE ?? 0) /
                    state.estatisticas.totalStudents) *
                    100
                )
              : 0
          }%`}
          changeText="do total de alunos"
          icon={Wheelchair}
        />

        <StatsCard
          key="total_alunos_transtornos_com"
          title="Transtornos (com deficiência)"
          value={
            state.estatisticas?.typeOfRegistration?.TranstornosComDeficiencia?.toString() ??
            "0"
          }
          change={`${
            state.estatisticas && state.estatisticas.totalStudents > 0
              ? Math.round(
                  ((state.estatisticas.typeOfRegistration
                    ?.TranstornosComDeficiencia ?? 0) /
                    state.estatisticas.totalStudents) *
                    100
                )
              : 0
          }%`}
          changeText="já incluídos no bloco AEE"
          icon={Brain}
        />

        <StatsCard
          key="total_alunos_transtornos_sem"
          title="Transtornos (sem deficiência)"
          value={
            state.estatisticas?.typeOfRegistration?.TranstornosSemDeficiencia?.toString() ??
            "0"
          }
          change={`${
            state.estatisticas && state.estatisticas.totalStudents > 0
              ? Math.round(
                  ((state.estatisticas.typeOfRegistration
                    ?.TranstornosSemDeficiencia ?? 0) /
                    state.estatisticas.totalStudents) *
                    100
                )
              : 0
          }%`}
          changeText="do total de alunos"
          icon={Brain}
        />

        <div className={
          showComparativoMunicipio
            ? "sm:col-span-2 md:col-span-3 lg:col-span-5 bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 relative overflow-hidden group hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)] transition-all duration-300"
            : "sm:col-span-2 md:col-span-3 lg:col-span-3 bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 relative overflow-hidden group hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)] transition-all duration-300"
        }>
          <div className="absolute -top-10 -right-10 p-8 opacity-[0.03] pointer-events-none transform group-hover:scale-110 transition-transform duration-500">
            <Brain className="w-64 h-64" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-b border-gray-100 pb-6 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-brand-navy-light to-brand-orange rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-brand-navy">
                    Relatórios Biopsicossociais
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Acompanhamento detalhado dos atendimentos multidisciplinares
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 md:gap-6 bg-slate-50 p-4 rounded-xl border border-slate-100 shadow-inner w-full md:w-auto justify-center md:justify-end">
              <div className="text-center px-4">
                <p className="text-3xl font-bold text-brand-navy">
                  {state.estatisticas?.totalReports.toString() ?? "0"}
                </p>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-1">
                  Total
                </p>
              </div>
              <div className="w-px bg-slate-200 hidden sm:block"></div>
              <div className="text-center px-4">
                <p className="text-3xl font-bold text-emerald-600">
                  {state.estatisticas?.totalBiopsychosocialReportsCompleted.toString() ??
                    "0"}
                </p>
                <p className="text-[11px] font-bold text-emerald-600/70 uppercase tracking-wider mt-1">
                  Concluídos
                </p>
              </div>
              <div className="w-px bg-slate-200 hidden sm:block"></div>
              <div className="text-center px-4">
                <p className="text-3xl font-bold text-blue-600">
                  {state.estatisticas?.totalBiopsychosocialReportsPendingSignature?.toString() ??
                    "0"}
                </p>
                <p className="text-[11px] font-bold text-blue-600/70 uppercase tracking-wider mt-1">
                  Pendente Assinatura
                </p>
              </div>
              <div className="w-px bg-slate-200 hidden sm:block"></div>
              <div className="text-center px-4">
                <p className="text-3xl font-bold text-amber-500">
                  {state.estatisticas?.totalBiopsychosocialReportsInProgress.toString() ??
                    "0"}
                </p>
                <p className="text-[11px] font-bold text-amber-600/70 uppercase tracking-wider mt-1">
                  Em Andamento
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:border-blue-200 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-50">
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-brand-navy text-lg">
                  Psicólogo(a)
                </h4>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-emerald-50/80 rounded-lg border border-emerald-100/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                    <span className="text-sm font-medium text-emerald-900">
                      Assinados
                    </span>
                  </div>
                  <span className="font-bold text-emerald-700 text-lg">
                    {state.estatisticas?.psychologistSigned?.toString() ?? "0"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50/80 rounded-lg border border-blue-100/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]"></div>
                    <span className="text-sm font-medium text-blue-900">
                      Concluídos
                    </span>
                  </div>
                  <span className="font-bold text-blue-700 text-lg">
                    {state.estatisticas?.psychologistFinished.toString() ?? "0"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-50/80 rounded-lg border border-amber-100/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"></div>
                    <span className="text-sm font-medium text-amber-900">
                      Em Andamento
                    </span>
                  </div>
                  <span className="font-bold text-amber-700 text-lg">
                    {state.estatisticas?.psychologistInProgress.toString() ??
                      "0"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:border-purple-200 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-50">
                <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-brand-navy text-lg">
                  Psicopedagogo(a)
                </h4>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-emerald-50/80 rounded-lg border border-emerald-100/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                    <span className="text-sm font-medium text-emerald-900">
                      Assinados
                    </span>
                  </div>
                  <span className="font-bold text-emerald-700 text-lg">
                    {state.estatisticas?.psychopedagogueSigned?.toString() ?? "0"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50/80 rounded-lg border border-blue-100/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]"></div>
                    <span className="text-sm font-medium text-blue-900">
                      Concluídos
                    </span>
                  </div>
                  <span className="font-bold text-blue-700 text-lg">
                    {state.estatisticas?.psychopedagogueFinished.toString() ??
                      "0"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-50/80 rounded-lg border border-amber-100/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"></div>
                    <span className="text-sm font-medium text-amber-900">
                      Em Andamento
                    </span>
                  </div>
                  <span className="font-bold text-amber-700 text-lg">
                    {state.estatisticas?.psychopedagogueInProgress.toString() ??
                      "0"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm hover:border-teal-200 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-5 pb-3 border-b border-slate-50">
                <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-brand-navy text-lg">
                  Assistente Social
                </h4>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-emerald-50/80 rounded-lg border border-emerald-100/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                    <span className="text-sm font-medium text-emerald-900">
                      Assinados
                    </span>
                  </div>
                  <span className="font-bold text-emerald-700 text-lg">
                    {state.estatisticas?.socialWorkerSigned?.toString() ?? "0"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50/80 rounded-lg border border-blue-100/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]"></div>
                    <span className="text-sm font-medium text-blue-900">
                      Concluídos
                    </span>
                  </div>
                  <span className="font-bold text-blue-700 text-lg">
                    {state.estatisticas?.socialWorkerFinished.toString() ?? "0"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-50/80 rounded-lg border border-amber-100/50">
                  <div className="flex items-center gap-2.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"></div>
                    <span className="text-sm font-medium text-amber-900">
                      Em Andamento
                    </span>
                  </div>
                  <span className="font-bold text-amber-700 text-lg">
                    {state.estatisticas?.socialWorkerInProgress.toString() ??
                      "0"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1">
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>
              Selecione os filtros para visualizar os dados específicos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={state.filters.state || ""}
                  onValueChange={(value) =>
                    updateFilter("state", value === "todos" ? undefined : value)
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
                  value={state.filters.city || ""}
                  onValueChange={(value) =>
                    updateFilter("city", value === "todos" ? undefined : value)
                  }
                  disabled={!state.filters.state}
                >
                  <SelectTrigger id="municipio">
                    <SelectValue
                      placeholder={
                        state.isLoadingCities
                          ? "Carregando..."
                          : "Selecione o município"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os municípios</SelectItem>
                    {state.cities?.map((mun) => (
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
                  value={state.filters.schoolID || ""}
                  onValueChange={(value) =>
                    updateFilter(
                      "schoolID",
                      value === "todas" ? undefined : value
                    )
                  }
                  disabled={!state.filters.city}
                >
                  <SelectTrigger id="escola">
                    <SelectValue
                      placeholder={
                        state.isLoadingSchools
                          ? "Carregando..."
                          : "Selecione a escola"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas as escolas</SelectItem>
                    {state.schools?.map((esc) => (
                      <SelectItem key={esc.id} value={esc.id}>
                        {esc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="genero">Gênero</Label>
                <Select
                  value={state.filters.sex || ""}
                  onValueChange={(value) =>
                    updateFilter("sex", value === "todos" ? undefined : value)
                  }
                >
                  <SelectTrigger id="genero">
                    <SelectValue placeholder="Selecione o gênero" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="idadeMin">Idade Mínima</Label>
                <Select
                  value={state.filters.minimalAge || ""}
                  onValueChange={(value) =>
                    updateFilter(
                      "minimalAge",
                      value === "sem_minimo" ? undefined : value
                    )
                  }
                >
                  <SelectTrigger id="idadeMin">
                    <SelectValue placeholder="Idade mínima" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sem_minimo">Sem mínimo</SelectItem>
                    {Array.from({ length: 18 }, (_, i) => i + 1).map(
                      (idade) => (
                        <SelectItem key={idade} value={idade.toString()}>
                          {idade} anos
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="idadeMax">Idade Máxima</Label>
                <Select
                  value={state.filters.maximumAge || ""}
                  onValueChange={(value) =>
                    updateFilter(
                      "maximumAge",
                      value === "sem_maximo" ? undefined : value
                    )
                  }
                >
                  <SelectTrigger id="idadeMax">
                    <SelectValue placeholder="Idade máxima" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sem_maximo">Sem máximo</SelectItem>
                    {Array.from({ length: 18 }, (_, i) => i + 1).map(
                      (idade) => (
                        <SelectItem key={idade} value={idade.toString()}>
                          {idade} anos
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoMatricula">Tipo de Matrícula</Label>
                <Select
                  value={state.filters.registrationType || ""}
                  onValueChange={(value) =>
                    updateFilter(
                      "registrationType",
                      value === "todos" ? undefined : value
                    )
                  }
                >
                  <SelectTrigger id="tipoMatricula">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    <SelectItem value="Geral">Geral</SelectItem>
                    <SelectItem value="AEE">AEE</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {state.filters.registrationType === "AEE" && (
                <div className="space-y-2">
                  <Label htmlFor="tipoDeficiencia">Tipo de Deficiência</Label>
                  <Select
                    value={state.filters.disability || ""}
                    onValueChange={(value) =>
                      updateFilter(
                        "disability",
                        value === "todas" ? undefined : value
                      )
                    }
                  >
                    <SelectTrigger id="tipoDeficiencia">
                      <SelectValue placeholder="Selecione a deficiência" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todas">Todas</SelectItem>
                      {tiposDeficiencia?.map((tipo) => (
                        <SelectItem key={tipo.id} value={tipo.id}>
                          <div className="flex items-center gap-2">
                            {getDeficienciaIcon(tipo.nome)}
                            <span>{tipo.nome}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="mes">Mês</Label>
                <Select
                  value={state.filters.month || ""}
                  onValueChange={(value) =>
                    updateFilter("month", value === "todos" ? undefined : value)
                  }
                >
                  <SelectTrigger id="mes">
                    <SelectValue placeholder="Selecione o mês" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os meses</SelectItem>
                    <SelectItem value="1">Janeiro</SelectItem>
                    <SelectItem value="2">Fevereiro</SelectItem>
                    <SelectItem value="3">Março</SelectItem>
                    <SelectItem value="4">Abril</SelectItem>
                    <SelectItem value="5">Maio</SelectItem>
                    <SelectItem value="6">Junho</SelectItem>
                    <SelectItem value="7">Julho</SelectItem>
                    <SelectItem value="8">Agosto</SelectItem>
                    <SelectItem value="9">Setembro</SelectItem>
                    <SelectItem value="10">Outubro</SelectItem>
                    <SelectItem value="11">Novembro</SelectItem>
                    <SelectItem value="12">Dezembro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ano">Ano</Label>
                <Select
                  value={state.filters.year || ""}
                  onValueChange={(value) =>
                    updateFilter("year", value === "todos" ? undefined : value)
                  }
                >
                  <SelectTrigger id="ano">
                    <SelectValue placeholder="Selecione o ano" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os anos</SelectItem>
                    {Array.from({ length: 7 }, (_, i) => 2024 + i).map(
                      (ano) => (
                        <SelectItem key={ano} value={ano.toString()}>
                          {ano}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline" onClick={resetFilters}>
                  Limpar Filtros
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totalMunicipio">
                  Total de alunos do município
                </Label>
                <Input
                  id="totalMunicipio"
                  type="number"
                  min={0}
                  placeholder={
                    state.filters.city && state.filters.state
                      ? "Informe o total de alunos"
                      : "Selecione estado e município"
                  }
                  value={state.municipalityTotalInput}
                  onChange={(event) =>
                    setMunicipalityTotalInput(event.target.value)
                  }
                  disabled={!state.filters.city || !state.filters.state}
                />
              </div>

              <div className="flex items-end">
                <Button
                  onClick={handleSaveMunicipalityTotalClick}
                  disabled={
                    !state.filters.city ||
                    !state.filters.state ||
                    state.isSavingMunicipalityTotal ||
                    state.municipalityTotalInput.trim() === ""
                  }
                >
                  {state.isSavingMunicipalityTotal
                    ? "Salvando..."
                    : "Salvar Total"}
                </Button>
              </div>
            </div>

            {(state.filters.state ||
              state.filters.city ||
              state.filters.schoolID ||
              state.filters.sex ||
              state.filters.minimalAge ||
              state.filters.maximumAge ||
              state.filters.registrationType ||
              state.filters.disability ||
              state.filters.month ||
              state.filters.year) && (
              <div className="mt-4 flex flex-wrap gap-2">
                <div className="text-sm font-medium">Filtros ativos:</div>
                {state.filters.state && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Map className="h-3 w-3" />
                    Estado: {state.filters.state}
                  </Badge>
                )}
                {state.filters.city && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Building2 className="h-3 w-3" />
                    Município: {state.filters.city}
                  </Badge>
                )}
                {state.filters.schoolID && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <School className="h-3 w-3" />
                    Escola:{" "}
                    {state.schools.find((e) => e.id === state.filters.schoolID)
                      ?.name || state.filters.schoolID}
                  </Badge>
                )}
                {state.filters.sex && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Gênero: {state.filters.sex}
                  </Badge>
                )}
                {state.filters.minimalAge && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Idade mínima: {state.filters.minimalAge} anos
                  </Badge>
                )}
                {state.filters.maximumAge && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Idade máxima: {state.filters.maximumAge} anos
                  </Badge>
                )}
                {state.filters.registrationType && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    Tipo de Matrícula: {state.filters.registrationType}
                  </Badge>
                )}
                {state.filters.disability && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getDeficienciaIcon(
                      tiposDeficiencia.find(
                        (t) => t.id === state.filters.disability
                      )?.nome || ""
                    )}
                    Deficiência: {state.filters.disability}
                  </Badge>
                )}
                {state.filters.month && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Mês:{" "}
                    {
                      [
                        "Janeiro",
                        "Fevereiro",
                        "Março",
                        "Abril",
                        "Maio",
                        "Junho",
                        "Julho",
                        "Agosto",
                        "Setembro",
                        "Outubro",
                        "Novembro",
                        "Dezembro",
                      ][Number(state.filters.month) - 1]
                    }
                  </Badge>
                )}
                {state.filters.year && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Ano: {state.filters.year}
                  </Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs
        defaultValue={state.activeTab}
        value={state.activeTab}
        onValueChange={setActiveTab}
        className="space-y-4 "
      >
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="analytics">Análise</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Distribuição por Gênero</CardTitle>
              </CardHeader>
              <CardContent className="pl-2 flex justify-center items-center min-h-[300px]">
                <PieChart
                  data={dataGenre}
                  labels={labelsGenre}
                  colors={["#ec4899", "#2563eb"]}
                />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Distribuição por Tipo de Matrícula</CardTitle>
              </CardHeader>
              <CardContent className="pl-2 flex justify-center items-center min-h-[300px]">
                <PieChart
                  data={dataRegistration}
                  labels={["AEE", "Transtornos", "Geral"]}
                  colors={["#f59e0b", "#3b82f6", "#10b981"]}
                />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Distribuição por Deficiência</CardTitle>
              </CardHeader>
              <CardContent className="pl-2 flex justify-center items-center min-h-[300px]">
                <PieChart
                  data={dataDisabilities}
                  labels={[
                    "Deficiência Intelectual",
                    "Deficiência Física",
                    "Surdez",
                    "Baixa Visão",
                    "Deficiências Múltiplas",
                    "TEA (Transtorno do Espectro Autista)",
                  ]}
                  colors={[
                    "#3b82f6",
                    "#ef4444",
                    "#f59e0b",
                    "#10b981",
                    "#8b5cf6",
                    "#ec4899",
                    "#facc15",
                    "#22d3ee",
                  ]}
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Alunos por Idade</CardTitle>
              </CardHeader>
              <CardContent className="pl-2 flex justify-center items-center min-h-[300px]">
                <BarChart
                  data={dataAges}
                  labels={labelsAges}
                  legend="Quantidade de Alunos"
                />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Alunos por Escola</CardTitle>
              </CardHeader>
              <CardContent className="pl-2 flex justify-center items-center min-h-[300px]">
                <BarChart
                  data={dataSchools}
                  labels={labelsSchools}
                  legend="Quantidade de Alunos"
                  horizontal={true}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Evolução de Matrículas</CardTitle>
              </CardHeader>
              <CardContent className="pl-2 flex justify-center items-center min-h-[300px]">
                <LineChart
                  data={[dataEvolutionTotal, dataEvolutionAEE]}
                  labels={labelsEvolution}
                  legends={["Total", "AEE"]}
                  colors={["#2563eb", "#f59e0b"]}
                />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Distribuição por Município</CardTitle>
              </CardHeader>
              <CardContent className="pl-2 flex justify-center items-center max-h-[450px]">
                <PieChart
                  data={dataCities}
                  labels={labelsCities}
                  colors={[
                    "#3b82f6",
                    "#ef4444",
                    "#f59e0b",
                    "#10b981",
                    "#8b5cf6",
                  ]}
                />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Relatórios por Mês</CardTitle>
              </CardHeader>
              <CardContent className="pl-2 flex justify-center items-center min-h-[300px]">
                <BarChart
                  data={dataRelatoriosPorMes}
                  labels={meses}
                  legend="Quantidade de Relatórios"
                />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Distribuição por Profissional</CardTitle>
              </CardHeader>
              <CardContent className="pl-2 flex justify-center items-center max-h-[450px]">
                <PieChart
                  data={dataProfissionais}
                  labels={labelsProfissionais}
                  colors={["#3b82f6", "#ef4444", "#f59e0b"]}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Relatórios Recentes</CardTitle>
              <CardDescription>
                Últimos relatórios biopsicossociais gerados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                {state.estatisticas?.reports != null &&
                state.estatisticas.reports.length > 0 ? (
                  state.estatisticas.reports?.map((relatorio, index) => (
                    <div key={index} className="flex items-center">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {relatorio.student.fullName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {relatorio.student.schoolName} •{" "}
                          {relatorio.localCreatedAt}
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        {relatorio.status === "Completo" ? (
                          <Badge className="bg-green-500">Concluído</Badge>
                        ) : relatorio.status === "Em andamento" ? (
                          <Badge className="bg-yellow-500">Em andamento</Badge>
                        ) : (
                          <Badge className="bg-blue-500">Pendente</Badge>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Nenhum relatório foi encontrado</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {state.estatisticas && (
        <div
          id="dashboard-pdf-export"
          className="fixed -left-[10000px] top-0 w-[900px] bg-white text-black p-10"
        >
          <div className="space-y-8">
            <div className="space-y-1">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h1 className="text-2xl font-bold text-brand-navy">
                    Relatório do Dashboard
                  </h1>
                  <p className="text-sm text-slate-600">
                    Gerado em{" "}
                    {new Date().toLocaleDateString("pt-BR")} às{" "}
                    {new Date().toLocaleTimeString("pt-BR")}
                  </p>
                </div>
                <div className="text-right text-sm text-slate-600">
                  <div className="font-semibold text-slate-800">
                    Filtros aplicados
                  </div>
                  <div>
                    Estado:{" "}
                    <span className="text-slate-800">
                      {state.filters.state ?? "Todos"}
                    </span>
                  </div>
                  <div>
                    Município:{" "}
                    <span className="text-slate-800">
                      {state.filters.city ?? "Todos"}
                    </span>
                  </div>
                  <div>
                    Escola:{" "}
                    <span className="text-slate-800">
                      {state.filters.schoolID
                        ? state.schools?.find((s) => s.id === state.filters.schoolID)
                            ?.name ?? state.filters.schoolID
                        : "Todas"}
                    </span>
                  </div>
                  <div>
                    Gênero:{" "}
                    <span className="text-slate-800">
                      {state.filters.sex ?? "Todos"}
                    </span>
                  </div>
                  <div>
                    Faixa etária:{" "}
                    <span className="text-slate-800">
                      {state.filters.minimalAge ?? "-"} a {state.filters.maximumAge ?? "-"}
                    </span>
                  </div>
                  <div>
                    Tipo de matrícula:{" "}
                    <span className="text-slate-800">
                      {state.filters.registrationType ?? "Todos"}
                    </span>
                  </div>
                  <div>
                    Deficiência:{" "}
                    <span className="text-slate-800">
                      {state.filters.disability ?? "Todas"}
                    </span>
                  </div>
                  <div>
                    Mês:{" "}
                    <span className="text-slate-800">
                      {state.filters.month
                        ? [
                            "Janeiro",
                            "Fevereiro",
                            "Março",
                            "Abril",
                            "Maio",
                            "Junho",
                            "Julho",
                            "Agosto",
                            "Setembro",
                            "Outubro",
                            "Novembro",
                            "Dezembro",
                          ][Number(state.filters.month) - 1]
                        : "Todos"}
                    </span>
                  </div>
                  <div>
                    Ano:{" "}
                    <span className="text-slate-800">
                      {state.filters.year ?? "Todos"}
                    </span>
                  </div>
                </div>
              </div>
              <div className="h-px bg-slate-200" />
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-brand-navy">Resumo</h2>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center justify-between rounded-md border p-3">
                  <span>Total de alunos</span>
                  <span className="font-semibold">
                    {state.estatisticas.totalStudents}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <span>Alunos com Deficiências/AEE</span>
                  <span className="font-semibold">
                    {state.estatisticas.typeOfRegistration?.AEE ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <span>Alunos com Transtornos</span>
                  <span className="font-semibold">
                    {state.estatisticas.typeOfRegistration?.Transtornos ?? 0}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <span>Relatórios biopsicossociais</span>
                  <span className="font-semibold">
                    {state.estatisticas.totalReports}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <span>Estudos de caso</span>
                  <span className="font-semibold">
                    {state.estatisticas.totalCaseStudies}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <span>Escolas (AEE)</span>
                  <span className="font-semibold">
                    {state.estatisticas.totalSchools}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                  <span>Total alunos (municípios configurados)</span>
                  <span className="font-semibold">
                    {state.estatisticas.totalConfiguredStudentsAcrossCities ?? 0}
                  </span>
                </div>
                {showComparativoMunicipio && (
                  <>
                    <div className="flex items-center justify-between rounded-md border p-3">
                      <span>{`Comparativo (${state.filters.city})`}</span>
                      <span className="font-semibold">
                        {state.estatisticas.selectedCityRegisteredStudents ?? 0} /{" "}
                        {state.estatisticas.selectedCityConfiguredStudents ?? 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-md border p-3">
                      <span>Cobertura do município</span>
                      <span className="font-semibold">
                        {state.estatisticas.selectedCityCoveragePercentage ?? 0}%
                      </span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-brand-navy">
                Distribuições e Totais
              </h2>

              {[
                {
                  title: "Distribuição por gênero",
                  data: state.estatisticas.distributionPerGenre,
                },
                {
                  title: "Tipo de matrícula",
                  data: state.estatisticas.typeOfRegistration,
                },
                {
                  title: "Distribuição por deficiência",
                  data: state.estatisticas.typeOfDisability,
                },
                { title: "Alunos por idade", data: state.estatisticas.studentsByAge },
                {
                  title: "Alunos por escola",
                  data: state.estatisticas.numberOfStudentsPerSchool,
                },
                {
                  title: "Alunos por município",
                  data: state.estatisticas.numberOfStudentsPerCity,
                },
                {
                  title: "Total configurado por município",
                  data: state.estatisticas.numberOfConfiguredTotalStudentsPerCity,
                },
                {
                  title: "Cadastros totais por mês",
                  data: state.estatisticas.numberOfTotalRegistrationsPerMonth,
                },
                {
                  title: "Cadastros AEE por mês",
                  data: state.estatisticas.numberOfAEERegistrationsPerMonth,
                },
                {
                  title: "Relatórios por mês",
                  data: state.estatisticas.numberOfReportsPerMonth,
                },
                {
                  title: "Profissionais por área",
                  data: state.estatisticas.numberOfProfessionalsPerArea,
                },
              ].map((section) => {
                const entries = Object.entries(section.data ?? {}).sort(
                  (a, b) => (b[1] ?? 0) - (a[1] ?? 0)
                );
                return (
                  <div key={section.title} className="space-y-2">
                    <h3 className="text-base font-semibold">
                      {section.title}
                    </h3>
                    <div className="overflow-hidden rounded-md border">
                      <table className="w-full text-sm">
                        <thead className="bg-slate-50">
                          <tr>
                            <th className="p-2 text-left font-semibold text-slate-700">
                              Categoria
                            </th>
                            <th className="p-2 text-right font-semibold text-slate-700">
                              Quantidade
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {entries.length > 0 ? (
                            entries.map(([k, v]) => (
                              <tr key={k} className="border-t">
                                <td className="p-2">{k}</td>
                                <td className="p-2 text-right">{v}</td>
                              </tr>
                            ))
                          ) : (
                            <tr className="border-t">
                              <td className="p-3 text-slate-500" colSpan={2}>
                                Sem dados
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-brand-navy">
                Relatórios Recentes
              </h2>
              <div className="overflow-hidden rounded-md border">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="p-2 text-left font-semibold text-slate-700">
                        Aluno
                      </th>
                      <th className="p-2 text-left font-semibold text-slate-700">
                        Escola
                      </th>
                      <th className="p-2 text-left font-semibold text-slate-700">
                        Data
                      </th>
                      <th className="p-2 text-left font-semibold text-slate-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.estatisticas.reports != null &&
                    state.estatisticas.reports.length > 0 ? (
                      state.estatisticas.reports.map((relatorio, index) => (
                        <tr key={index} className="border-t">
                          <td className="p-2">{relatorio.student.fullName}</td>
                          <td className="p-2">
                            {relatorio.student.schoolName}
                          </td>
                          <td className="p-2">{relatorio.localCreatedAt}</td>
                          <td className="p-2">{relatorio.status}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-t">
                        <td className="p-3 text-slate-500" colSpan={4}>
                          Nenhum relatório foi encontrado
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
