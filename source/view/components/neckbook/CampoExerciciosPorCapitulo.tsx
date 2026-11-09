"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CampoExerciciosPorCapituloProps {
  value: number | string;
  onChange: (value: number | string) => void;
  error?: string;
  disabled?: boolean;
}

export function CampoExerciciosPorCapitulo({
  value,
  onChange,
  error,
  disabled = false,
}: CampoExerciciosPorCapituloProps) {
  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-gray-700">
          Exercícios por Capítulo <span className="text-red-500">*</span>
        </Label>
        <span className="text-xs text-gray-500">1 a 3 (Padrão: 1)</span>
      </div>
      <Input
        type="number"
        min={1}
        max={3}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={error ? "border-red-500 focus:ring-red-500" : ""}
      />
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}
