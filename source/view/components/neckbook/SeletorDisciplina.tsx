"use client";

import {
  DISCIPLINAS,
  type Disciplina,
} from "@/source/model/entities/neckbook/GeracaoLivroTypes";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SeletorDisciplinaProps {
  value: Disciplina | "" | null;
  onChange: (disciplina: Disciplina | "" | null) => void;
  error?: string;
  disabled?: boolean;
}

export function SeletorDisciplina({
  value,
  onChange,
  error,
  disabled = false,
}: SeletorDisciplinaProps) {
  return (
    <div className="space-y-1.5 w-full">
      <Label className="text-sm font-semibold text-gray-700">
        Disciplina <span className="text-red-500">*</span>
      </Label>
      <Select
        value={value || ""}
        onValueChange={(val) => onChange(val ? (val as Disciplina) : null)}
        disabled={disabled}
      >
        <SelectTrigger
          className={error ? "border-red-500 focus:ring-red-500" : ""}
        >
          <SelectValue placeholder="Selecione uma disciplina..." />
        </SelectTrigger>
        <SelectContent>
          {DISCIPLINAS.map((d) => (
            <SelectItem key={d} value={d}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}
