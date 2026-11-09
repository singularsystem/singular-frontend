"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import {
  MAX_INTERESSE_LEN,
  MAX_INTERESSES,
} from "@/source/model/entities/neckbook/GeracaoLivroTypes";

interface ListaInteressesProps {
  interesses: string[];
  onAddInteresse: (candidato: string) => void;
  onRemoveInteresse: (index: number) => void;
  disabled?: boolean;
}

export function ListaInteresses({
  interesses,
  onAddInteresse,
  onRemoveInteresse,
  disabled = false,
}: ListaInteressesProps) {
  const [novoInteresse, setNovoInteresse] = useState<string>("");
  const [erroLimite, setErroLimite] = useState<string | null>(null);

  const handleAdd = () => {
    const trimmed = novoInteresse.trim();
    if (trimmed === "") {
      return;
    }
    if (interesses.length >= MAX_INTERESSES) {
      setErroLimite(`Limite máximo de ${MAX_INTERESSES} interesses atingido.`);
      return;
    }
    if (trimmed.length > MAX_INTERESSE_LEN) {
      setErroLimite(
        `O interesse não pode exceder ${MAX_INTERESSE_LEN} caracteres.`,
      );
      return;
    }
    setErroLimite(null);
    onAddInteresse(trimmed);
    setNovoInteresse("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="space-y-2 w-full">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-gray-700">
          Interesses e Hiperfocos (Opcional)
        </Label>
        <span className="text-xs text-gray-500">
          {interesses.length}/{MAX_INTERESSES}
        </span>
      </div>

      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Ex: Dinossauros, Astronomia, Minecraft..."
          value={novoInteresse}
          maxLength={MAX_INTERESSE_LEN + 10}
          onChange={(e) => {
            setNovoInteresse(e.target.value);
            if (erroLimite) setErroLimite(null);
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled || interesses.length >= MAX_INTERESSES}
          className="text-sm"
        />
        <Button
          type="button"
          onClick={handleAdd}
          disabled={
            disabled ||
            novoInteresse.trim() === "" ||
            interesses.length >= MAX_INTERESSES
          }
          className="bg-[#111C4E] hover:bg-[#111C4E]/90 text-white shrink-0"
        >
          <Plus className="h-4 w-4 mr-1" />
          Adicionar
        </Button>
      </div>

      {erroLimite && (
        <p className="text-xs text-amber-700 font-medium">{erroLimite}</p>
      )}

      {interesses.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {interesses.map((item, index) => (
            <Badge
              key={`${item}-${index}`}
              variant="secondary"
              className="px-2.5 py-1 text-xs font-normal flex items-center gap-1.5 bg-blue-50 text-blue-900 border border-blue-200"
            >
              <span>{item}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => onRemoveInteresse(index)}
                  className="hover:text-red-600 rounded-full focus:outline-none"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}
