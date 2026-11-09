import { useMemo } from "react";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";

type MultiSelectProps = {
  label: string;
  placeholder?: string;
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
};

export function MultiSelect({
  label,
  placeholder = "Selecione",
  options,
  value,
  onChange,
  disabled,
}: MultiSelectProps) {
  const selectedSet = useMemo(() => new Set(value), [value]);

  const toggle = (opt: string) => {
    const next = selectedSet.has(opt)
      ? value.filter((v) => v !== opt)
      : [...value, opt];
    onChange(next);
  };

  const toggleAll = () => {
    if (value.length === options.length) {
      onChange([]);
    } else {
      onChange([...options]);
    }
  };

  const summary =
    value.length === 0
      ? placeholder
      : value.length === 1
        ? value[0]
        : `${value.length} selecionados`;

  return (
    <div className="space-y-2">
      <span className="text-sm font-medium">{label}</span>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full justify-between"
            disabled={disabled}
          >
            <span className="truncate">{summary}</span>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-[320px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar..." />
            <CommandEmpty>Nenhuma opção encontrada</CommandEmpty>

            <CommandGroup>
              <CommandItem
                key="all"
                value="Todas"
                onSelect={toggleAll}
                className="flex items-center gap-2 font-medium"
              >
                <Checkbox checked={value.length === options.length && options.length > 0} />
                <span className="text-sm">Todas</span>
              </CommandItem>
              {options.map((opt) => {
                const checked = selectedSet.has(opt);

                return (
                  <CommandItem
                    key={opt}
                    value={opt}
                    onSelect={() => toggle(opt)}
                    className="flex items-center gap-2"
                  >
                    <Checkbox checked={checked} />
                    <span className="text-sm">{opt}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>

            {value.length > 0 && (
              <div className="border-t p-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => onChange([])}
                >
                  Limpar seleção
                </Button>
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
