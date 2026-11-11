"use client";

import { useState } from "react";
import type { ChapterDraft } from "@/source/model/entities/neckbook/GeracaoLivroTypes";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, Plus, Trash2 } from "lucide-react";

interface EditorCapituloProps {
  chapter: ChapterDraft;
  index: number;
  totalChapters: number;
  onUpdateChapter: (patch: Partial<ChapterDraft>) => void;
  onAddExercise: (exercise: string) => void;
  onRemoveExercise: (index: number) => void;
  onUpdateExercise: (index: number, text: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  disabled?: boolean;
}

export function EditorCapitulo({
  chapter,
  index,
  totalChapters,
  onUpdateChapter,
  onAddExercise,
  onRemoveExercise,
  onUpdateExercise,
  onMoveUp,
  onMoveDown,
  disabled = false,
}: EditorCapituloProps) {
  const [novoExercicio, setNovoExercicio] = useState<string>("");

  const handleAddExercise = () => {
    if (novoExercicio.trim() === "" || chapter.exercises.length >= 3) return;
    onAddExercise(novoExercicio.trim());
    setNovoExercicio("");
  };

  return (
    <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm space-y-4">
      {/* Cabeçalho do capítulo com controles de ordem */}
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm text-brand-navy bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">
            Capítulo {chapter.order}
          </span>
          <span className="text-xs text-gray-500">
            ({index + 1} de {totalChapters})
          </span>
        </div>

        <div className="flex items-center gap-1">
          {onMoveUp && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || index === 0}
              onClick={onMoveUp}
              className="h-7 w-7 p-0"
              title="Mover para cima"
            >
              <ArrowUp className="h-3.5 w-3.5" />
            </Button>
          )}
          {onMoveDown && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={disabled || index === totalChapters - 1}
              onClick={onMoveDown}
              className="h-7 w-7 p-0"
              title="Mover para baixo"
            >
              <ArrowDown className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Título do capítulo (1..200) */}
      <div className="space-y-1">
        <Label className="text-xs font-semibold text-gray-700">
          Título do Capítulo <span className="text-red-500">*</span>
        </Label>
        <Input
          type="text"
          value={chapter.title}
          maxLength={200}
          disabled={disabled}
          onChange={(e) => onUpdateChapter({ title: e.target.value })}
          className="text-sm font-medium"
        />
        <div className="text-[10px] text-gray-400 text-right">
          {chapter.title.length}/200
        </div>
      </div>

      {/* Conteúdo do capítulo (1..20000) */}
      <div className="space-y-1">
        <Label className="text-xs font-semibold text-gray-700">
          Texto do Capítulo <span className="text-red-500">*</span>
        </Label>
        <Textarea
          value={chapter.content}
          maxLength={20000}
          rows={6}
          disabled={disabled}
          onChange={(e) => onUpdateChapter({ content: e.target.value })}
          className="text-sm font-normal leading-relaxed"
        />
        <div className="text-[10px] text-gray-400 text-right">
          {chapter.content.length}/20000
        </div>
      </div>

      {/* Instrução da ilustração (image_prompt 0..2000) */}
      <div className="space-y-1">
        <Label className="text-xs font-semibold text-gray-700">
          Instrução da Ilustração (Prompt de Imagem)
        </Label>
        <Textarea
          value={chapter.image_prompt}
          maxLength={2000}
          rows={2}
          disabled={disabled}
          onChange={(e) => onUpdateChapter({ image_prompt: e.target.value })}
          className="text-xs"
          placeholder="Descreva como o desenho desta página deve ser ilustrado..."
        />
        <div className="text-[10px] text-gray-400 text-right">
          {chapter.image_prompt.length}/2000
        </div>
      </div>

      {/* Exercícios (máx. 3) */}
      <div className="space-y-2 pt-2 border-t">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold text-gray-700">
            Exercícios de Fixação
          </Label>
          <span className="text-xs text-gray-400">
            {chapter.exercises.length}/3
          </span>
        </div>

        {chapter.exercises.map((ex, exIdx) => (
          <div key={exIdx} className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 w-4">
              {exIdx + 1}.
            </span>
            <Input
              type="text"
              value={ex}
              disabled={disabled}
              onChange={(e) => onUpdateExercise(exIdx, e.target.value)}
              className="text-xs h-8"
            />
            {!disabled && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveExercise(exIdx)}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        ))}

        {chapter.exercises.length < 3 && !disabled && (
          <div className="flex gap-2 pt-1">
            <Input
              type="text"
              placeholder="Novo exercício de fixação..."
              value={novoExercicio}
              onChange={(e) => setNovoExercicio(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddExercise();
                }
              }}
              className="text-xs h-8"
            />
            <Button
              type="button"
              size="sm"
              onClick={handleAddExercise}
              disabled={novoExercicio.trim() === ""}
              className="h-8 bg-brand-navy hover:bg-brand-navy/90 text-white text-xs px-2.5"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Adicionar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
