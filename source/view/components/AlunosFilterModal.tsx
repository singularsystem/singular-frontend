"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { estados } from "@/lib/constants";
import { useAlunoFilter } from "../hooks/alunos/useAlunoFilter";
import { AlunoFilters } from "../../model/entities/alunos/AlunoEntity";

interface AlunosFilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentFilters: AlunoFilters;
  onApply: (filters: AlunoFilters) => void;
}

export function AlunosFilterModal({
  open,
  onOpenChange,
  currentFilters,
  onApply,
}: AlunosFilterModalProps) {
  const { state, setState, setCity, setSchool, reset } = useAlunoFilter(currentFilters);

  const handleApply = () => {
    onApply(state.filters);
    onOpenChange(false);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Filtrar Alunos</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label>Estado</Label>
            <Select
              value={state.filters.state}
              onValueChange={setState}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o estado" />
              </SelectTrigger>
              <SelectContent>
                {estados.map((estado) => (
                  <SelectItem key={estado.sigla} value={estado.nome}>
                    {estado.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Cidade</Label>
            <Select
              value={state.filters.city}
              onValueChange={setCity}
              disabled={!state.filters.state || state.isLoadingCities}
            >
              <SelectTrigger>
                <SelectValue placeholder={state.isLoadingCities ? "Carregando..." : "Selecione a cidade"} />
              </SelectTrigger>
              <SelectContent>
                {state.cities.map((city) => (
                  <SelectItem key={city.id} value={city.nome}>
                    {city.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Unidade Escolar</Label>
            <Select
              value={state.filters.schoolID}
              onValueChange={setSchool}
              disabled={!state.filters.city || state.isLoadingSchools}
            >
              <SelectTrigger>
                <SelectValue placeholder={state.isLoadingSchools ? "Carregando..." : "Selecione a escola"} />
              </SelectTrigger>
              <SelectContent>
                {state.schools.map((school) => (
                  <SelectItem key={school.id} value={school.id}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleReset}>
            Limpar Filtros
          </Button>
          <Button onClick={handleApply}>
            Aplicar Filtros
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
