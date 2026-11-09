"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useFetchCitiesByUf } from "@/hooks/useFetchCitiesByUf";
import { useFetchSchoolsByCity } from "@/hooks/useFetchSchools";
import { estados } from "@/lib/constants";
import { School } from "@/types/escola";
import { Filters } from "@/types/filters";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CaseStudiesInlineFiltersProps {
  filters: Filters;
  onApply: (filters: Filters) => void;
}

export function CaseStudiesInlineFilters({
  filters,
  onApply,
}: CaseStudiesInlineFiltersProps) {
  const { user } = useAuth();
  const isAdmin = user?.roles?.map(r => r.toLowerCase()).includes("admin");

  const [localFilters, setLocalFilters] = useState<Filters>({
    state: filters.state || "",
    city: filters.city || "",
    schoolID: filters.schoolID || "",
    status: filters.status || "",
    year: filters.year || "",
    month: filters.month || "",
  });

  useEffect(() => {
    setLocalFilters({
      state: filters.state || "",
      city: filters.city || "",
      schoolID: filters.schoolID || "",
      status: filters.status || "",
      year: filters.year || "",
      month: filters.month || "",
    });
  }, [filters]);

  const activeCity = isAdmin ? localFilters.city : (user?.city || "");

  const { cities, loading: loadingCities } = useFetchCitiesByUf(
    isAdmin ? localFilters.state : ""
  );
  const { schools, loading: loadingSchools } = useFetchSchoolsByCity(
    activeCity
  );

  const currentYear = new Date().getFullYear();
  const availableYears = Array.from(
    { length: currentYear - 2023 + 1 },
    (_, i) => (2023 + i).toString()
  );

  const updateFilter = (key: keyof Filters, value: string) => {
    const updated = { ...localFilters, [key]: value };
    
    if (key === "state") {
      updated.city = "";
      updated.schoolID = "";
    } else if (key === "city") {
      updated.schoolID = "";
    }
    
    setLocalFilters(updated);
    onApply(updated);
  };

  const handleReset = () => {
    const resetVal = {
      state: isAdmin ? "" : (user?.state || ""),
      city: isAdmin ? "" : (user?.city || ""),
      schoolID: "",
      status: "",
      year: "",
      month: "",
    };
    setLocalFilters(resetVal);
    onApply(resetVal);
  };

  const hasActiveFilters = !!(
    (isAdmin && localFilters.state) ||
    (isAdmin && localFilters.city) ||
    localFilters.schoolID ||
    localFilters.status ||
    localFilters.year ||
    localFilters.month
  );

  return (
    <div className="flex flex-wrap items-center gap-3 w-full">
      {isAdmin && (
        <div className="min-w-[130px] flex-1 sm:flex-none">
          <Select
            value={localFilters.state || "Todos"}
            onValueChange={(val) => updateFilter("state", val === "Todos" ? "" : val)}
          >
            <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-white">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="Todos">Todos Estados</SelectItem>
              {estados.map((est) => (
                <SelectItem key={est.sigla} value={est.nome} className="rounded-lg">
                  {est.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {isAdmin && (
        <div className="min-w-[170px] flex-1 sm:flex-none">
          <Select
            value={localFilters.city || "Todos"}
            onValueChange={(val) => updateFilter("city", val === "Todos" ? "" : val)}
            disabled={!localFilters.state}
          >
            <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-white">
              <SelectValue placeholder={loadingCities ? "Carregando..." : "Município"} />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="Todos">Todos Municípios</SelectItem>
              {cities?.map((city: any) => (
                <SelectItem key={city.id} value={city.nome} className="rounded-lg">
                  {city.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="min-w-[200px] flex-1 sm:flex-none">
        <Select
          value={localFilters.schoolID || "Todos"}
          onValueChange={(val) => updateFilter("schoolID", val === "Todos" ? "" : val)}
          disabled={!activeCity}
        >
          <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-white">
            <SelectValue placeholder={loadingSchools ? "Carregando..." : "Escola"} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="Todos">Todas Escolas</SelectItem>
            {schools?.map((school: School) => (
              <SelectItem key={school.id} value={school.id} className="rounded-lg">
                {school.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[160px] flex-1 sm:flex-none">
        <Select
          value={localFilters.status || "Todos"}
          onValueChange={(val) => updateFilter("status", val === "Todos" ? "" : val)}
        >
          <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-white">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="Todos">Todos Status</SelectItem>
            <SelectItem value="Completo">Completo</SelectItem>
            <SelectItem value="Incompleto">Em andamento</SelectItem>
            <SelectItem value="Não Iniciado">Não iniciado</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[120px] flex-1 sm:flex-none">
        <Select
          value={localFilters.year || "Todos"}
          onValueChange={(val) => updateFilter("year", val === "Todos" ? "" : val)}
        >
          <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-white">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="Todos">Todos Anos</SelectItem>
            {availableYears.map((yr) => (
              <SelectItem key={yr} value={yr} className="rounded-lg">
                {yr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[140px] flex-1 sm:flex-none">
        <Select
          value={localFilters.month || "Todos"}
          onValueChange={(val) => updateFilter("month", val === "Todos" ? "" : val)}
        >
          <SelectTrigger className="h-10 rounded-xl border-slate-200 bg-white">
            <SelectValue placeholder="Mês" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="Todos">Todos Meses</SelectItem>
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

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleReset}
          className="flex-shrink-0 h-10 w-10 text-gray-400 hover:text-red-500 rounded-xl"
          title="Limpar filtros"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
