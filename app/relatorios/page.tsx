"use client";
export const dynamic = "force-dynamic";

import { SelecaoEstudanteModal } from "@/components/estudante/selecao-estudante-modal";
import { FiltersModal, FilterValues } from "@/components/filtros/filters-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useFetchReports } from "@/hooks/useFetchReports";
import { useSecureFetch } from "@/hooks/useSecureFetch";
import { getPageNumbers } from "@/lib/utils";
import { Student, StudentSummary } from "@/types/aluno";
import { Filters } from "@/types/filters";
import { Relatorio } from "@/types/relatorio";
import { ProfessionalSummary } from "@/types/usuario";
import {
  AlertTriangle,
  Eye,
  Filter,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RelatoriosPage() {
  const router = useRouter();
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const { toast } = useToast();
  const [openSelecaoStudents, setOpenSelecaoStudents] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { user, token, isLoading: authLoading } = useAuth();
  const { secureFetch } = useSecureFetch();
  const [mySummary, setMySummary] = useState({
    total: 0,
    pendingFill: 0,
    pendingSign: 0,
    signed: 0,
  });
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const [filters, setFilters] = useState<Filters>({
    state: "",
    city: "",
    schoolID: "",
    searchTerm: "",
    status: "",
    pendingProfessional: "",
    year: "",
    month: "",
  });
  const [shouldFetchReports, setShouldFetchReports] = useState(false);

  const {
    relatorios,
    total,
    uniqueTotal,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchReports(
    shouldFetchReports ? currentPage : 1,
    itemsPerPage,
    refreshTrigger,
    filters,
  );

  useEffect(() => {
    if (!authLoading && user) {
      setShouldFetchReports(true);
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (!token || authLoading) return;
    const fetchSummary = async () => {
      try {
        const cleanApiUrl = (apiUrl || "").replace(/\/+$/, "");
        const res = await secureFetch(`${cleanApiUrl}/api/v1/reports/my-summary`);
        if (res.ok) {
          const json = await res.json();
          const d = json?.data ?? json?.Data;
          const isSuccess = json?.success ?? json?.Success;
          if (isSuccess && d) {
            setMySummary({
              total: Number(d.total ?? d.Total ?? 0),
              pendingFill: Number(d.pendingFill ?? d.PendingFill ?? 0),
              pendingSign: Number(d.pendingSign ?? d.PendingSign ?? 0),
              signed: Number(d.signed ?? d.Signed ?? 0),
            });
          }
        }
      } catch (e) {
        console.error('Erro ao buscar resumo das minhas demandas', e);
      }
    };
    fetchSummary();
  }, [token, authLoading, refreshTrigger, apiUrl]);

  useEffect(() => {
    if (!filters.onlyMyReports || fetchLoading) return;
    const count = uniqueTotal ?? total ?? 0;
    const currentStatus = filters.myStatus || "all";
    setMySummary((prev) => {
      if (currentStatus === "pending_fill") return { ...prev, pendingFill: count };
      if (currentStatus === "pending_sign") return { ...prev, pendingSign: count };
      if (currentStatus === "signed") return { ...prev, signed: count };
      if (currentStatus === "all") return { ...prev, total: count };
      return prev;
    });
  }, [filters.onlyMyReports, filters.myStatus, fetchLoading, uniqueTotal, total]);
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
        title: "Erro ao buscar relatórios",
        description: fetchError.message || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    }
  }, [fetchError, fetchLoading, toast]);

  const filteredRelatorios = relatorios || [];

  const totalPages = Math.ceil(total / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filters.searchTerm]);

  const handleStart = async (aluno: Student | StudentSummary) => {
    if (!token) {
      toast({
        title: "Erro de autenticação",
        description: "Token não disponível",
        variant: "destructive",
      });
      return;
    }

    const userRole = user?.roles?.[0]?.toLowerCase();
    if (
      userRole === "psychopedagogue" ||
      userRole === "psychologist" ||
      userRole === "socialwork"
    ) {
      const formData = {
        studentId: aluno.id,
      };

      try {
        const response = await fetch(`${apiUrl}/api/v1/reports`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          toast({
            variant: "destructive",
            title: "Erro ao salvar relatório",
            description:
              errorData.message ||
              "Ocorreu um erro ao tentar salvar o relatório.",
          });
          return;
        }

        const result = await response.json();

        if (result.success) {
          router.push(`/relatorios/novo/${result.data.id}`);
          toast({
            title: "Iniciando guia",
            description:
              "Você está iniciando um novo relatório biopsicossocial.",
            variant: "info",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Erro ao criar relatório",
            description: result.message || "Erro desconhecido",
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erro de conexão",
          description: "Não foi possível conectar ao servidor",
        });
      }
    } else {
      setOpenSelecaoStudents(false);
      toast({
        title: "Você não tem permissão para isso",
        description: "Você não tem permissão para criar relatórios",
        variant: "warning",
      });
    }
  };

  // Verificar permissões apenas quando o usuário estiver carregado
  const canEdit =
    !authLoading &&
    (user?.roles?.[0]?.toLowerCase() === "psychopedagogue" ||
      user?.roles?.[0]?.toLowerCase() === "psychologist" ||
      user?.roles?.[0]?.toLowerCase() === "socialwork");

  const canRemove =
    !authLoading &&
    (user?.roles?.[0]?.toLowerCase() === "admin" ||
      user?.roles?.[0]?.toLowerCase() === "psychopedagogue" ||
      user?.roles?.[0]?.toLowerCase() === "psychologist" ||
      user?.roles?.[0]?.toLowerCase() === "socialwork");

  const canCreate =
    !authLoading &&
    (user?.roles?.[0] === "SocialWork" ||
      user?.roles?.[0] === "Psychopedagogue" ||
      user?.roles?.[0] === "Psychologist");

  const getReportCreator = (relatorio: Relatorio): ProfessionalSummary | null => {
    if (!user) return null;
    const role = user.roles?.[0]?.toLowerCase();
    switch (role) {
      case "socialwork": return relatorio.socialWorkerReport?.professional ?? null;
      case "psychologist": return relatorio.psychologistReport?.professional ?? null;
      case "psychopedagogue": return relatorio.psychopedagogueReport?.professional ?? null;
      default: return null;
    }
  };

  const getMyPersonalStatus = (relatorio: Relatorio) => {
    if (!user) return null;
    const role = user.roles?.[0]?.toLowerCase();

    let hasSigned = false;
    let isMyPartFilled = false;

    if (role === "psychologist") {
      hasSigned = relatorio.psychologistSign;
      isMyPartFilled = !!(relatorio.psychologistReport?.unifiedAt || (relatorio.psychologistReport?.conclusion && relatorio.psychologistReport?.conclusion.trim().length > 0));
    } else if (role === "psychopedagogue") {
      hasSigned = relatorio.psychopedagogueSign;
      isMyPartFilled = !!(relatorio.psychopedagogueReport?.unifiedAt || (relatorio.psychopedagogueReport?.conclusion && relatorio.psychopedagogueReport?.conclusion.trim().length > 0));
    } else if (role === "socialwork") {
      hasSigned = relatorio.socialWorkerSign;
      isMyPartFilled = !!(relatorio.socialWorkerReport && relatorio.socialWorkerReport.conclusion && relatorio.socialWorkerReport.conclusion.trim().length > 0);
    } else if (role === "admin") {
      hasSigned = relatorio.psychologistSign && relatorio.psychopedagogueSign && relatorio.socialWorkerSign;
      isMyPartFilled = relatorio.status === "Completo";
    }

    const isLegacyCompleted =
      (relatorio.signatureBlocked ||
        (relatorio.createdAt && new Date(relatorio.createdAt) < new Date("2026-08-18T00:00:00Z"))) &&
      (relatorio.status?.toLowerCase() === "completo" ||
        relatorio.documentStatus?.toLowerCase() === "completo" ||
        !!relatorio.unifiedAt);

    if (isLegacyCompleted) {
      hasSigned = true;
    }

    if (hasSigned) {
      return { label: "Assinado por você", color: "text-emerald-700 bg-emerald-50 border-emerald-200" };
    }
    if (relatorio.status?.toLowerCase() === "completo" || relatorio.unifiedAt) {
      return { label: "Aguardando sua assinatura", color: "text-blue-700 bg-blue-50 border-blue-200" };
    }
    if (!isMyPartFilled) {
      return { label: "Falta preencher sua parte", color: "text-amber-700 bg-amber-50 border-amber-200" };
    }
    return { label: "Sua parte concluída", color: "text-slate-600 bg-slate-50 border-slate-200" };
  };

  const isTechnicalOrAdmin =
    user?.roles?.[0]?.toLowerCase() === "psychopedagogue" ||
    user?.roles?.[0]?.toLowerCase() === "psychologist" ||
    user?.roles?.[0]?.toLowerCase() === "socialwork" ||
    user?.roles?.[0]?.toLowerCase() === "admin";

  const isMyReport = (relatorio: Relatorio): boolean => {
    if (!user) return false;
    const role = user.roles?.[0]?.toLowerCase();
    if (role === "admin") return true;
    const creator = getReportCreator(relatorio);
    if (!creator) return true;
    return creator.id === user.id;
  };

  const handleView = async (relatorio: Relatorio, role: string) => {
    if (!relatorio) return;

    if (relatorio.id === "00000000-0000-0000-0000-000000000000") {
      if (
        role === "psychopedagogue" ||
        role === "psychologist" ||
        role === "socialwork"
      ) {
        if (relatorio.student) {
          await handleStart(relatorio.student);
        }
      }
      return;
    }

    let path = "";

    switch (role) {
      case "socialwork":
        if (!relatorio.socialWorkerReport?.id) {
          path = `/relatorios/novo/${relatorio.id}`;
        } else if (
          relatorio.psychologistReport?.unifiedAt &&
          relatorio.psychopedagogueReport?.unifiedAt &&
          relatorio.socialWorkerReport.createdAt !== null
        ) {
          path = `/relatorios/${relatorio.id}`;
        } else {
          path = `/relatorios/${relatorio.socialWorkerReport?.id}/servico-social`;
        }
        break;
      case "psychologist":
        if (!relatorio.psychologistReport?.unifiedAt) {
          path = `/relatorios/novo/${relatorio.id}`;
        } else if (
          relatorio.psychologistReport?.unifiedAt &&
          relatorio.psychopedagogueReport?.unifiedAt &&
          relatorio.socialWorkerReport != null
        ) {
          path = `/relatorios/${relatorio.id}`;
        } else {
          path = `/relatorios/${relatorio.psychologistReport?.id}/psicologo`;
        }
        break;
      case "psychopedagogue":
        if (!relatorio.psychopedagogueReport?.unifiedAt) {
          path = `/relatorios/novo/${relatorio.id}`;
        } else if (
          relatorio.psychologistReport?.unifiedAt &&
          relatorio.psychopedagogueReport?.unifiedAt &&
          relatorio.socialWorkerReport != null
        ) {
          path = `/relatorios/${relatorio.id}`;
        } else {
          path = `/relatorios/${relatorio.psychopedagogueReport?.id}/psicopedagogo`;
        }
        break;
      default:
        path = `/relatorios/${relatorio.id}`;
        break;
    }
    router.push(path);
  };

  const handleEdit = (relatorio: Relatorio, role: string) => {
    if (!canEdit || !relatorio) {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você não tem permissão para editar relatórios",
      });
      return;
    }

    let path = "";

    switch (role) {
      case "psychologist":
        if (relatorio.psychologistReport?.id) {
          path = `/relatorios/${relatorio.id}/editar`;
        } else {
          path = `/relatorios/novo/${relatorio.id}`;
        }
        break;
      case "socialwork":
        if (relatorio.socialWorkerReport?.id) {
          path = `/relatorios/${relatorio.id}/editar`;
        } else {
          path = `/relatorios/novo/${relatorio.id}`;
        }
        break;
      case "psychopedagogue":
        if (relatorio.psychopedagogueReport?.id) {
          path = `/relatorios/${relatorio.id}/editar`;
        } else {
          path = `/relatorios/novo/${relatorio.id}`;
        }
        break;
      default:
        path = `/relatorios/${relatorio.id}/editar`;
    }
    router.push(path);
  };

  const handleRemove = (id: string) => {
    if (canRemove) {
      setSelectedId(id);
      setShowConfirm(true);
    }
  };

  const confirmRemove = async () => {
    if (selectedId && token) {
      try {
        const data = {
          id: selectedId,
          confirmDeletion: true,
        };

        const response = await fetch(`${apiUrl}/api/v1/reports/${selectedId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Erro ao remover relatório");
        }

        const result = await response.json();

        if (result.success) {
          setShowConfirm(false);
          setRefreshTrigger((prev) => prev + 1);
          toast({
            title: "Relatório excluído com sucesso",
            description: "Esse relatório foi removido da lista",
            variant: "success",
          });
        } else {
          toast({
            title: "Erro ao remover relatório",
            description: "Não foi possível remover esse relatório",
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Erro ao remover relatório",
          description:
            error instanceof Error ? error.message : "Erro desconhecido",
          variant: "destructive",
        });
      }
    }
  };

  const confirmFiltering = async (selected: FilterValues) => {
    setCurrentPage(1);
    setFilters((prev) => ({
      ...prev,
      ...selected,
      searchTerm: prev.searchTerm,
    }));
  };

  if (authLoading) {
    return (
      <main className="flex-1 p-6 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
        <div className="flex items-center justify-center h-64">
          <p>Carregando...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-brand-navy">
          Relatórios Biopsicossociais
        </h1>
        <div className="flex gap-2">
          <Button
            onClick={() => setOpenFilterModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition-colors shadow"
          >
            <Filter className="w-8 h-8" strokeWidth={2} />
          </Button>
          {canCreate && (
            <Button
              onClick={() => setOpenSelecaoStudents(true)}
              className="bg-brand-navy hover:bg-blue-800"
              disabled={fetchLoading}
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Relatório
            </Button>
          )}
        </div>
      </div>

      {isTechnicalOrAdmin && (
        <div className="mb-6 space-y-3">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <button
              type="button"
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  onlyMyReports: false,
                  myStatus: "",
                }));
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                !filters.onlyMyReports
                  ? "bg-brand-navy text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Todos os Alunos
            </button>

            <button
              type="button"
              onClick={() => {
                setFilters((prev) => ({
                  ...prev,
                  onlyMyReports: true,
                  myStatus: prev.myStatus || "all",
                }));
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all ${
                filters.onlyMyReports
                  ? "bg-brand-navy text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>Associados a Você</span>
              {mySummary.total > 0 && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    filters.onlyMyReports
                      ? "bg-white text-brand-navy"
                      : "bg-brand-navy text-white"
                  }`}
                >
                  {mySummary.total}
                </span>
              )}
            </button>
          </div>

          {filters.onlyMyReports && (
            <div className="flex flex-wrap items-center gap-2 pt-1 animate-in fade-in duration-200">
              <button
                type="button"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, myStatus: "all" }));
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border transition-all ${
                  !filters.myStatus || filters.myStatus === "all"
                    ? "bg-slate-800 text-white border-slate-800 shadow-sm"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                }`}
              >
                <span>Todos os meus</span>
                <span className="bg-slate-200/50 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                  {mySummary.total}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, myStatus: "pending_fill" }));
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border transition-all ${
                  filters.myStatus === "pending_fill"
                    ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                    : "bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100"
                }`}
              >
                <span>📝 Falta eu preencher</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    filters.myStatus === "pending_fill"
                      ? "bg-amber-700 text-white"
                      : "bg-amber-200 text-amber-900"
                  }`}
                >
                  {mySummary.pendingFill}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, myStatus: "pending_sign" }));
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border transition-all ${
                  filters.myStatus === "pending_sign"
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100"
                }`}
              >
                <span>✍️ Falta eu assinar</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    filters.myStatus === "pending_sign"
                      ? "bg-blue-700 text-white"
                      : "bg-blue-200 text-blue-900"
                  }`}
                >
                  {mySummary.pendingSign}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setFilters((prev) => ({ ...prev, myStatus: "signed" }));
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 border transition-all ${
                  filters.myStatus === "signed"
                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                    : "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100"
                }`}
              >
                <span>✅ Assinados por mim</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    filters.myStatus === "signed"
                      ? "bg-emerald-700 text-white"
                      : "bg-emerald-200 text-emerald-900"
                  }`}
                >
                  {mySummary.signed}
                </span>
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between mb-6 gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar relatórios..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => {
              const value = e.target.value;
              setSearchTerm(value);
              setCurrentPage(1);
              setFilters((prev) => ({
                ...prev,
                searchTerm: value,
              }));
            }}
          />
        </div>
        <div className="text-sm text-gray-600 whitespace-nowrap">
          Relatórios encontrados: {" "}
          <span className="font-semibold text-brand-navy">
            {uniqueTotal ?? 0}
          </span>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aluno</TableHead>
              <TableHead>Escola</TableHead>
              <TableHead>Série</TableHead>
              <TableHead>Data de Cadastro</TableHead>
              <TableHead>Tipo de Deficiência</TableHead>
              <TableHead>Status do Relatório</TableHead>
              <TableHead>Assinaturas</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fetchLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Carregando relatórios...
                </TableCell>
              </TableRow>
            ) : filteredRelatorios.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4">
                  Nenhum relatório encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredRelatorios.map((relatorio) => (
                <TableRow key={relatorio.student?.id ?? relatorio.id}>

                  <TableCell className="font-medium">
                    <div>{relatorio.student?.fullName || "—"}</div>
                    {(() => {
                      const creator = getReportCreator(relatorio);
                      if (!creator || isMyReport(relatorio)) return null;
                      return (
                        <div className="flex items-center gap-1 mt-1">
                          <AlertTriangle className="h-3 w-3 text-amber-500 shrink-0" />
                          <span className="text-xs text-amber-600 font-normal">
                            Criado por: {creator.fullName}
                          </span>
                        </div>
                      );
                    })()}
                  </TableCell>
                  <TableCell>{relatorio.student?.schoolName || "—"}</TableCell>
                  <TableCell>{relatorio.student?.serie || "—"}</TableCell>
                  <TableCell>{relatorio.localCreatedAt || "—"}</TableCell>
                  <TableCell>{relatorio.typeOfDisability || "N/A"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        relatorio.status?.toLowerCase() === "completo"
                          ? "default"
                          : "outline"
                      }
                      className={
                        relatorio.status === "Completo"
                          ? "bg-green-500"
                          : relatorio.status === "Em Andamento"
                            ? "bg-yellow-500"
                            : "bg-gray-200 text-gray-700"
                      }
                    >
                      {relatorio.status === "Completo"
                        ? "Completo"
                        : relatorio.status === "Em Andamento"
                          ? "Em Andamento"
                          : "Não Iniciado"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {(() => {
                      const isAdmin =
                        user?.roles?.[0]?.toLowerCase() === "admin";

                      const isReportComplete =
                        relatorio.status?.toLowerCase() === "completo" ||
                        relatorio.documentStatus?.toLowerCase() === "completo" ||
                        !!relatorio.unifiedAt;

                      // Relatório marcado como Assinatura Bloqueada (antigos com problema no fluxo de assinatura digital)
                      if (relatorio.signatureBlocked && isReportComplete) {
                        if (isAdmin) {
                          // Admin vê o status real: Assinatura Bloqueada
                          return (
                            <div className="flex flex-col gap-1 w-fit">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-300">
                                🔒 Assinatura Bloqueada
                              </span>
                              <span className="text-xs text-amber-700 font-normal leading-tight max-w-[200px]">
                                Relatório anterior a 18/08/2026 — assinaturas não coletadas via assinatura digital.
                              </span>
                            </div>
                          );
                        } else {
                          // Usuários comuns veem como Assinado normalmente
                          return (
                            <div className="flex flex-col gap-1 w-fit">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white">
                                Psicólogo • Assinado
                              </span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white">
                                Psicopedagogo • Assinado
                              </span>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-500 text-white">
                                Assistente Social • Assinado
                              </span>
                            </div>
                          );
                        }
                      }

                      // Fluxo normal de assinaturas
                      const psychologistSigned =
                        !!relatorio.psychologistSign ||
                        !!relatorio.psychologistSignedAt;
                      const psychopedagogueSigned =
                        !!relatorio.psychopedagogueSign ||
                        !!relatorio.psychopedagogueSignedAt;
                      const socialWorkerSigned =
                        !!relatorio.socialWorkerSign ||
                        !!relatorio.socialWorkerSignedAt;

                      const statusText = (signed: boolean) =>
                        signed ? "Assinado" : "Pendente";
                      const statusClass = (signed: boolean) =>
                        signed
                          ? "bg-green-500 text-white"
                          : "bg-yellow-500 text-black";

                      const fullySigned =
                        isReportComplete &&
                        ((psychologistSigned &&
                          psychopedagogueSigned &&
                          socialWorkerSigned) ||
                          relatorio.documentStatus?.toLowerCase().includes("complet"));

                      return (
                        <div className="flex flex-col gap-1 w-fit">
                          <Badge
                            className={statusClass(
                              fullySigned || psychologistSigned,
                            )}
                          >
                            Psicólogo •{" "}
                            {statusText(fullySigned || psychologistSigned)}
                          </Badge>
                          <Badge
                            className={statusClass(
                              fullySigned || psychopedagogueSigned,
                            )}
                          >
                            Psicopedagogo •{" "}
                            {statusText(fullySigned || psychopedagogueSigned)}
                          </Badge>
                          <Badge
                            className={statusClass(fullySigned || socialWorkerSigned)}
                          >
                            Assistente Social •{" "}
                            {statusText(fullySigned || socialWorkerSigned)}
                          </Badge>
                        </div>
                      );
                    })()}
                  </TableCell>

                  <TableCell className="text-right">
                    {user && (relatorio.id !== "00000000-0000-0000-0000-000000000000" || canCreate) ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() =>
                              handleView(
                                relatorio,
                                user.roles?.[0]?.toLowerCase() || "",
                              )
                            }
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            {relatorio.id === "00000000-0000-0000-0000-000000000000" ? "Iniciar" : "Visualizar"}
                          </DropdownMenuItem>
                          {canEdit &&
                            relatorio.id !== "00000000-0000-0000-0000-000000000000" &&
                            ((user.roles[0].toLowerCase() === "socialwork" &&
                              relatorio.socialWorkerReport?.id != null &&
                              user.id === relatorio.socialWorkerReport?.professional?.id) ||
                              (user.roles[0].toLowerCase() === "psychologist" &&
                                relatorio.psychologistReport?.unifiedAt != null &&
                                user.id === relatorio.psychologistReport?.professional?.id) ||
                              (user.roles[0].toLowerCase() === "psychopedagogue" &&
                                relatorio.psychopedagogueReport?.unifiedAt != null &&
                                user.id === relatorio.psychopedagogueReport?.professional?.id)) && (
                              <DropdownMenuItem
                                onClick={() =>
                                  handleEdit(
                                    relatorio,
                                    user.roles?.[0]?.toLowerCase() || "",
                                  )
                                }
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                            )}
                          {canRemove &&
                            relatorio.id !== "00000000-0000-0000-0000-000000000000" &&
                            ((user.roles[0].toLowerCase() === "socialwork" &&
                              relatorio.socialWorkerReport != null &&
                              relatorio.socialWorkerReport.id != null &&
                              user.id === relatorio.socialWorkerReport?.professional?.id) ||
                              (user.roles[0].toLowerCase() === "psychologist" &&
                                relatorio.psychologistReport?.unifiedAt != null &&
                                user.id === relatorio.psychologistReport?.professional?.id) ||
                              (user.roles[0].toLowerCase() === "psychopedagogue" &&
                                relatorio.psychopedagogueReport?.unifiedAt != null &&
                                user.id === relatorio.psychopedagogueReport?.professional?.id) ||
                              user.roles[0].toLowerCase() === "admin") && (
                              <DropdownMenuItem
                                onClick={() => handleRemove(relatorio.id)}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                Excluir
                              </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 0 && (
        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                aria-disabled={currentPage === 1}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>

            {getPageNumbers(totalPages, currentPage).map((page, i) => (
              <PaginationItem key={i}>
                {page === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    isActive={currentPage === page}
                    onClick={() => handlePageChange(page as number)}
                    href="#"
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                aria-disabled={currentPage === totalPages}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <SelecaoEstudanteModal
        open={openSelecaoStudents}
        onOpenChange={setOpenSelecaoStudents}
        handleStart={handleStart}
        documentName="Relatório Biopsicossocial"
      />

      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Remoção</DialogTitle>
            <p>Tem certeza que deseja remover este relatório?</p>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmRemove}>
              Remover
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <FiltersModal
        open={openFilterModal}
        onOpenChange={setOpenFilterModal}
        onConfirm={confirmFiltering}
        initialFilters={filters}
        enableReportStatusFilter={true}
        enablePeriodFilter={true}
      />
    </main>
  );
}
