"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface CampoNumCapitulosProps {
  value: number | string;
  onChange: (value: number | string) => void;
  error?: string;
  disabled?: boolean;
}

export function CampoNumCapitulos({
  value,
  onChange,
  error,
  disabled = false,
}: CampoNumCapitulosProps) {
  return (
    <div className="space-y-1.5 w-full">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-gray-700">
          Quantidade de Capítulos <span className="text-red-500">*</span>
        </Label>
        <span className="text-xs text-gray-500">1 a 10 (Padrão: 4)</span>
      </div>
      <Input
        type="number"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={error ? "border-red-500 focus:ring-red-500" : ""}
      />
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
}
