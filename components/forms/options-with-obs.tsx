"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useId } from "react";

type Mode = "checkbox" | "radio";

type Props = {
  title?: string;
  options: string[];

  mode: Mode;

  // Checkbox
  valueArray?: string[];
  onChangeArray?: (next: string[]) => void;

  // Radio
  value?: string | null;
  onChange?: (next: string) => void;

  otherLabels?: string[];
  otherText?: string;
  onOtherTextChange?: (text: string) => void;
  otherPlaceholder?: string;

  disabled?: boolean;
  className?: string;
};

export function OptionsWithOther({
  title,
  options,
  mode,

  valueArray = [],
  onChangeArray,

  value = null,
  onChange,

  otherLabels = ["Outro", "Outra", "Outros", "Outras"],
  otherText = "",
  onOtherTextChange,
  otherPlaceholder = "Descreva aqui...",

  disabled,
  className,
}: Props) {
  const uid = useId();
  const isOtherOption = (opt: string) => otherLabels.includes(opt);

  const isOtherSelected =
    mode === "checkbox"
      ? valueArray.some((v) => isOtherOption(v))
      : value != null && isOtherOption(value);

  function toggleCheckbox(opt: string, checked: boolean) {
    if (!onChangeArray) return;

    const set = new Set(valueArray);
    if (checked) set.add(opt);
    else set.delete(opt);

    const stillHasOther = Array.from(set).some(isOtherOption);
    if (!stillHasOther) onOtherTextChange?.("");

    onChangeArray(Array.from(set));
  }

  function handleRadio(next: string) {
    onChange?.(next);

    if (!isOtherOption(next)) onOtherTextChange?.("");
  }

  return (
    <div className={className}>
      {title ? <p className="mb-2 text-base font-medium">{title}</p> : null}

      {mode === "checkbox" ? (
        <div className="grid grid-cols-2 gap-2">
          {options.map((opt, index) => {
            const optionId = `${uid}-checkbox-${index}`;
            return (
              <div key={opt} className="flex items-center space-x-2">
              <Checkbox
                id={optionId}
                disabled={disabled}
                checked={valueArray.includes(opt)}
                onCheckedChange={(checked) =>
                  toggleCheckbox(opt, Boolean(checked))
                }
              />
              <Label htmlFor={optionId} className="text-gray-800">
                {opt}
              </Label>
              </div>
            );
          })}
        </div>
      ) : (
        <RadioGroup
          value={value ?? ""}
          onValueChange={handleRadio}
          className="grid grid-cols-2 gap-2"
        >
          {options.map((opt, index) => {
            const optionId = `${uid}-radio-${index}`;
            return (
              <div key={opt} className="flex items-center space-x-2">
              <RadioGroupItem
                id={optionId}
                value={opt}
                disabled={disabled}
              />
              <Label htmlFor={optionId} className="text-gray-700">
                {opt}
              </Label>
              </div>
            );
          })}
        </RadioGroup>
      )}

      {isOtherSelected ? (
        <div className="mt-4 space-y-2">
          <Label className="text-sm">Observações</Label>
          <Textarea
            value={otherText}
            onChange={(e) => onOtherTextChange?.(e.target.value)}
            placeholder={otherPlaceholder}
            disabled={disabled}
            className="min-h-[96px]"
          />
        </div>
      ) : null}
    </div>
  );
}
