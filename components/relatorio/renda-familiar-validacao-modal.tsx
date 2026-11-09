"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export const SOCIOECONOMIC_OPTIONS = [
  {
    value: "Sem desafios socioeconômicos",
    description:
      "A família apresenta renda estável e não enfrenta vulnerabilidades socioeconômicas significativas.",
  },
  {
    value: "Com desafios socioeconômicos",
    description:
      "A família enfrenta vulnerabilidades e instabilidades no contexto socioeconômico.",
  },
];

interface Props {
  open: boolean;
  onConfirm: (context: string) => void;
}

export function RendaFamiliarValidacaoModal({ open, onConfirm }: Props) {
  const [selected, setSelected] = useState<string>("");

  const handleConfirm = () => {
    if (!selected) return;
    onConfirm(selected);
    setSelected("");
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-lg"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-[#111C4E]">
            Classificação do Contexto Socioeconômico
          </DialogTitle>
          <DialogDescription>
            A renda familiar mensal foi registrada como{" "}
            <strong>Outra</strong>. Para garantir uma avaliação precisa do
            contexto da criança, é obrigatório classificar o ambiente
            socioeconômico familiar.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <p className="text-sm font-medium text-[#111C4E] mb-3">
            Em qual ambiente socioeconômico esta criança está inserida?
          </p>
          <RadioGroup
            value={selected}
            onValueChange={setSelected}
            className="space-y-3"
          >
            {SOCIOECONOMIC_OPTIONS.map((opt) => (
              <div
                key={opt.value}
                className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                  selected === opt.value
                    ? "border-[#111C4E] bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setSelected(opt.value)}
              >
                <RadioGroupItem
                  id={opt.value}
                  value={opt.value}
                  className="mt-0.5 shrink-0"
                />
                <div>
                  <Label
                    htmlFor={opt.value}
                    className="font-medium cursor-pointer text-[#111C4E]"
                  >
                    {opt.value}
                  </Label>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {opt.description}
                  </p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <DialogFooter>
          <Button
            onClick={handleConfirm}
            disabled={!selected}
            className="bg-[#111C4E] hover:bg-blue-800 w-full"
          >
            Confirmar Classificação
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
