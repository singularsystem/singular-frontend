"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { estados } from "@/lib/constants";
import { useAlunoFilter } from "../../hooks/alunos/useAlunoFilter";
import { AlunoFilters } from "../../../model/entities/alunos/AlunoEntity";
import { useEffect } from "react";

interface InlineFiltersProps {
  currentFilters: AlunoFilters;
  onApply: (filters: AlunoFilters) => void;
}

export function InlineFilters({
  currentFilters,
  onApply,
}: InlineFiltersProps) {
  const { state, setState, setCity, setSchool, setSerie, reset } = useAlunoFilter(currentFilters);

  // Sincroniza mudanças locais com a listagem principal
  useEffect(() => {
    onApply(state.filters);
  }, [state.filters.state, state.filters.city, state.filters.schoolID, state.filters.serie]);

  const hasActiveFilters = !!(state.filters.state || state.filters.city || state.filters.schoolID || state.filters.serie);

  const series = [
    "Educação Infantil", "1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano",
    "6º Ano", "7º Ano", "8º Ano", "9º Ano",
    "1º Ano - Ensino Médio", "2º Ano - Ensino Médio", "3º Ano - Ensino Médio"
  ];

  return (
    <>
      <div className="min-w-[140px]">
        <Select
          value={state.filters.state}
          onValueChange={setState}
        >
          <SelectTrigger className="w-full h-10 rounded-xl border-slate-200 bg-white">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {estados.map((estado) => (
              <SelectItem key={estado.sigla} value={estado.nome} className="rounded-lg">
                {estado.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[180px]">
        <Select
          value={state.filters.city}
          onValueChange={setCity}
          disabled={!state.filters.state || state.isLoadingCities}
        >
          <SelectTrigger className="w-full h-10 rounded-xl border-slate-200 bg-white">
            <SelectValue placeholder={state.isLoadingCities ? "Carregando..." : "Cidade"} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {state.cities.map((city) => (
              <SelectItem key={city.id} value={city.nome} className="rounded-lg">
                {city.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[220px]">
        <Select
          value={state.filters.schoolID}
          onValueChange={setSchool}
          disabled={!state.filters.city || state.isLoadingSchools}
        >
          <SelectTrigger className="w-full h-10 rounded-xl border-slate-200 bg-white">
            <SelectValue placeholder={state.isLoadingSchools ? "Carregando..." : "Escola"} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {state.schools.map((school) => (
              <SelectItem key={school.id} value={school.id} className="rounded-lg">
                {school.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="min-w-[180px]">
        <Select
          value={state.filters.serie}
          onValueChange={setSerie}
        >
          <SelectTrigger className="w-full h-10 rounded-xl border-slate-200 bg-white">
            <SelectValue placeholder="Série" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {series.map((s) => (
              <SelectItem key={s} value={s} className="rounded-lg">
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={reset}
          className="flex-shrink-0 h-10 w-10 text-gray-400 hover:text-red-500 rounded-xl"
          title="Limpar filtros"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </>
  );
}
