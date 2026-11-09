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
import { CityEntity } from "../../../model/entities/LocationEntity";

interface EscolasInlineFiltersProps {
  currentState: string;
  currentCity: string;
  cities: CityEntity[];
  isLoadingCities: boolean;
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
  onReset: () => void;
}

export function EscolasInlineFilters({
  currentState,
  currentCity,
  cities,
  isLoadingCities,
  onStateChange,
  onCityChange,
  onReset,
}: EscolasInlineFiltersProps) {
  const hasActiveFilters = !!(currentState || currentCity);

  return (
    <>
      <div className="min-w-[140px]">
        <Select
          value={currentState}
          onValueChange={onStateChange}
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
          value={currentCity}
          onValueChange={onCityChange}
          disabled={!currentState || isLoadingCities}
        >
          <SelectTrigger className="w-full h-10 rounded-xl border-slate-200 bg-white">
            <SelectValue placeholder={isLoadingCities ? "Carregando..." : "Cidade"} />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            {cities.map((city) => (
              <SelectItem key={city.id} value={city.nome} className="rounded-lg">
                {city.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onReset}
          className="flex-shrink-0 h-10 w-10 text-gray-400 hover:text-red-500 rounded-xl"
          title="Limpar filtros"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </>
  );
}
