"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

import { useAuth } from "@/contexts/auth-context";
import { useFetchCitiesByUf } from "@/hooks/useFetchCitiesByUf";
import { useFetchSchoolsByCity } from "@/hooks/useFetchSchools";
import { estados } from "@/lib/constants";
import { School } from "@/types/escola";
import { MultiSelect } from "./multi-select";

export type FilterValues = {
  state: string;
  city: string;
  schoolID: string;
  disability?: string[];
  disorder?: string[];
  status?: string;
  pendingProfessional?: string;
  year?: string;
  month?: string;
};

type FiltersModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (filters: FilterValues) => void;
  initialFilters?: FilterValues;
  enableDisabilityFilter?: boolean;
  enableDisorderFilter?: boolean;
  enableCaseStudyStatusFilter?: boolean;
  enableReportStatusFilter?: boolean;
  enablePeriodFilter?: boolean;
  enableMonthFilter?: boolean;
};

export function FiltersModal({
  open,
  onOpenChange,
  onConfirm,
  initialFilters,
  enableDisabilityFilter = false,
  enableDisorderFilter = false,
  enableCaseStudyStatusFilter = false,
  enableReportStatusFilter = false,
  enablePeriodFilter = false,
  enableMonthFilter = false,
}: FiltersModalProps) {
  const currentYear = new Date().getFullYear();
  const availableYears = Array.from(
    { length: currentYear - 2023 + 1 },
    (_, i) => (2023 + i).toString()
  );
  const { user } = useAuth();
  const [filters, setFilters] = useState<FilterValues>({
    state: initialFilters?.state || "",
    city: initialFilters?.city || "",
    schoolID: initialFilters?.schoolID || "",
    disability: initialFilters?.disability || [],
    disorder: initialFilters?.disorder || [],
    status: initialFilters?.status || "",
    pendingProfessional: initialFilters?.pendingProfessional || "",
    year: initialFilters?.year || "",
    month: initialFilters?.month || "",
  });

  useEffect(() => {
    if (open && initialFilters) {
      setFilters({
        state: initialFilters.state || "",
        city: initialFilters.city || "",
        schoolID: initialFilters.schoolID || "",
        disability: initialFilters.disability || [],
        disorder: initialFilters.disorder || [],
        status: initialFilters.status || "",
        pendingProfessional: initialFilters.pendingProfessional || "",
        year: initialFilters.year || "",
        month: initialFilters.month || "",
      });
    }
  }, [open, initialFilters]);
  const { cities, loading: loadingCities } = useFetchCitiesByUf(
    filters.state !== "Selecione" ? filters.state : "",
  );
  const { schools, loading: loadingSchools } = useFetchSchoolsByCity(
    filters.city,
  );

  const setState = (value: string) => {
    if (value == "Selecione") {
      return;
    }
    setFilters((prev) => ({ ...prev, state: value, city: "", schoolID: "" }));
  };

  const setCity = (value: string) => {
    setFilters((prev) => ({ ...prev, city: value, schoolID: "" }));
  };

  const setSchool = (value: string) => {
    setFilters((prev) => ({ ...prev, schoolID: value }));
  };

  const setDisability = (values: string[]) => {
    setFilters((prev) => ({ ...prev, disability: values }));
  };

  const setDisorder = (values: string[]) => {
    setFilters((prev) => ({ ...prev, disorder: values }));
  };

  const setStatus = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      status: value === "Todos" ? "" : value,
      pendingProfessional: value !== "Incompleto" && value !== "Em Andamento" ? "" : prev.pendingProfessional,
    }));
  };

  const setPendingProfessional = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      pendingProfessional: value === "Todos" ? "" : value,
    }));
  };

  const setYear = (value: string) => {
    setFilters((prev) => ({ ...prev, year: value }));
  };

  const setMonth = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      month: value === "Todos" ? "" : value,
    }));
  };

  const handleClear = () => {
    setFilters({
      state: "",
      city: "",
      schoolID: "",
      disability: [],
      disorder: [],
      status: "",
      pendingProfessional: "",
      year: "",
      month: "",
    });
  };

  if (user == null) {
    return;
  }

  const isAdmin = user.roles?.includes("Admin");

  const disabilities = [
    "TEA (Transtorno do Espectro Autista)",
    "Deficiência Intelectual",
    "Deficiência Física",
    "Surdez",
    "Baixa Visão",
    "Deficiências Múltiplas",
  ];

  const disorders = [
    "Dislexia",
    "Disgrafia",
    "Disortografia",
    "Discalculia",
    "Apraxia de Fala",
    "TDAH Tipo Desatento",
    "TDAH Tipo Hiperativo/Impulsivo",
    "TDAH Combinado"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Selecionar filtros</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 gap-4 py-2 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Estado</Label>
            <Select value={filters.state} onValueChange={setState}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Selecione">Selecione</SelectItem>
                {!isAdmin && user.state && (
                  <SelectItem value={user.state}>{user.state}</SelectItem>
                )}

                {isAdmin &&
                  estados.map((est) => (
                    <SelectItem key={est.sigla} value={est.nome}>
                      {est.nome}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Município</Label>
            <Select
              value={filters.city}
              onValueChange={setCity}
              disabled={!filters.state}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    !filters.state
                      ? "Selecione o estado"
                      : loadingCities
                        ? "Carregando..."
                        : "Selecione"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {!isAdmin ? (
                  user?.city ? (
                    <SelectItem value={user.city}>{user.city}</SelectItem>
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground text-center">
                      Cidade do usuário não definida
                    </div>
                  )
                ) : cities?.length > 0 ? (
                  cities.map((city: any) => (
                    <SelectItem key={city.id} value={city.nome}>
                      {city.nome}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground text-center">
                    Nenhum município encontrado
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Escola</Label>
            <Select
              value={filters.schoolID}
              onValueChange={setSchool}
              disabled={!filters.city}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    !filters.city
                      ? "Selecione a cidade"
                      : loadingSchools
                        ? "Carregando..."
                        : "Selecione"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {schools?.length > 0 ? (
                  schools.map((school: School) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground text-center">
                    Nenhum escola encontrada
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          {enableDisabilityFilter && (
            <MultiSelect
              label="Deficiência"
              options={disabilities}
              value={filters.disability ?? []}
              onChange={setDisability}
            />
          )}

          {enableDisorderFilter && (
            <MultiSelect
              label="Transtorno"
              options={disorders}
              value={filters.disorder ?? []}
              onChange={setDisorder}
            />
          )}

          {enableCaseStudyStatusFilter && (
            <div className="space-y-2">
              <Label>Status do Estudo de Caso</Label>
              <Select value={filters.status || "Todos"} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  <SelectItem value="Completo">Completo</SelectItem>
                  <SelectItem value="Incompleto">Incompleto</SelectItem>
                  <SelectItem value="Não Iniciado">Não iniciado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {enableReportStatusFilter && (
            <>
              <div className="space-y-2">
                <Label>Status do Relatório</Label>
                <Select value={filters.status || "Todos"} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos</SelectItem>
                    <SelectItem value="Completo">Completo</SelectItem>
                    <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                    <SelectItem value="Não Iniciado">Não Iniciado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Profissional Pendente</Label>
                <Select
                  value={filters.pendingProfessional || "Todos"}
                  onValueChange={setPendingProfessional}
                  disabled={filters.status !== "Incompleto" && filters.status !== "Em Andamento"}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Todos">Todos</SelectItem>
                    <SelectItem value="Psicologo">Psicólogo</SelectItem>
                    <SelectItem value="Psicopedagogo">Psicopedagogo</SelectItem>
                    <SelectItem value="AssistenteSocial">Assistente Social</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {enablePeriodFilter && (
            <div className="space-y-2">
              <Label>Ano</Label>
              <Select
                value={filters.year || "Todos"}
                onValueChange={(val) => setYear(val === "Todos" ? "" : val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
                  {availableYears.map((yr) => (
                    <SelectItem key={yr} value={yr}>
                      {yr}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {(enablePeriodFilter || enableMonthFilter) && (
            <div className="space-y-2">
              <Label>Mês</Label>
              <Select value={filters.month || "Todos"} onValueChange={setMonth}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos">Todos</SelectItem>
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
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClear}>
            Limpar
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              handleClear();
              onOpenChange(false);
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="success"
            onClick={() => {
              onConfirm(filters);
              onOpenChange(false);
            }}
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
