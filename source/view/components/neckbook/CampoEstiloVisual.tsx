"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ESTILO_VISUAL_PADRAO,
  OPCOES_ESTILO_VISUAL,
} from "@/source/model/entities/neckbook/GeracaoLivroTypes";

interface CampoEstiloVisualProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function CampoEstiloVisual({
  value,
  onChange,
  disabled = false,
}: CampoEstiloVisualProps) {
  const selectedValue =
    OPCOES_ESTILO_VISUAL.find((opt) => opt.value === value)?.value ||
    ESTILO_VISUAL_PADRAO;

  const currentOption = OPCOES_ESTILO_VISUAL.find(
    (opt) => opt.value === selectedValue
  );

  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-gray-700">
          Estilo Visual das Ilustrações
        </Label>
        <span className="text-xs text-gray-500">
          Padrão: {ESTILO_VISUAL_PADRAO}
        </span>
      </div>

      <Select
        value={selectedValue}
        onValueChange={(val) => onChange(val)}
        disabled={disabled}
      >
        <SelectTrigger className="w-full bg-white">
          <SelectValue placeholder="Selecione o estilo visual..." />
        </SelectTrigger>
        <SelectContent>
          {OPCOES_ESTILO_VISUAL.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              <div className="flex flex-col text-left py-0.5">
                <span className="font-medium text-gray-800">{opt.label}</span>
                <span className="text-xs text-gray-500">{opt.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {currentOption && (
        <p className="text-xs text-gray-500 italic pl-1">
          💡 {currentOption.description}
        </p>
      )}
    </div>
  );
}
