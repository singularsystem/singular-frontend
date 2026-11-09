"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface CheckboxSuporteCaaProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function CheckboxSuporteCaa({
  checked,
  onCheckedChange,
  disabled = false,
}: CheckboxSuporteCaaProps) {
  return (
    <div className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 bg-gray-50/50">
      <Checkbox
        id="suporte_caa"
        checked={checked}
        onCheckedChange={(c) => onCheckedChange(Boolean(c))}
        disabled={disabled}
        className="mt-0.5 data-[state=checked]:bg-[#111C4E] data-[state=checked]:border-[#111C4E]"
      />
      <div className="grid gap-1 leading-none">
        <Label
          htmlFor="suporte_caa"
          className="text-sm font-medium text-gray-800 cursor-pointer"
        >
          Habilitar Comunicação Alternativa e Aumentativa (CAA)
        </Label>
        <p className="text-xs text-gray-500">
          Gera pictogramas e símbolos de apoio visual adequados para alunos não-verbais ou com necessidades complexas de comunicação.
        </p>
      </div>
    </div>
  );
}
