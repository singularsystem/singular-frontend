"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Hand, Pause, Play, X } from "lucide-react";

type Resposta = "Ainda Não" | "Com Mediação" | "Sozinho";

type PerguntaBase = {
  category: string;
  question: string;
};

type Props<TPergunta extends PerguntaBase> = {
  pergunta: TPergunta;
  currentIndex: number;
  total: number;

  respostaSelecionada: Resposta | null;
  respostaAnterior?: Resposta | null;

  autoAvancar: boolean;
  loading?: boolean;

  onAnswer: (resposta: Resposta) => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleAutoAdvance: () => void;
  onFinish: () => void;

  canPrev: boolean;
  canNext: boolean;
  isLast: boolean;
};

export function QuestionCard<TPergunta extends PerguntaBase>({
  pergunta,
  currentIndex,
  total,
  respostaSelecionada,
  respostaAnterior,
  autoAvancar,
  loading,
  onAnswer,
  onPrev,
  onNext,
  onToggleAutoAdvance,
  onFinish,
  canPrev,
  canNext,
  isLast,
}: Props<TPergunta>) {
  const selected = (value: Resposta) =>
    (respostaSelecionada ?? respostaAnterior) === value;

  return (
    <Card className="w-[850px]" key={currentIndex}>
      <CardHeader className="text-brand-navy">
        <CardTitle className="uppercase text-xl font-semibold">
          {pergunta.category}
        </CardTitle>
        <CardDescription className="text-brand-navy font-medium">
          Pergunta {currentIndex + 1} de {total}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-medium tracking-tighter text-blue-900">
          {pergunta.question}
        </div>

        <div className="mt-6 space-y-4">
          <div
            onClick={() => onAnswer("Ainda Não")}
            className={`flex items-center gap-4 border-2 rounded-lg p-4 hover:cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
              selected("Ainda Não")
                ? "bg-red-50 border-red-400"
                : "border-gray-200 hover:border-red-400"
            }`}
          >
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <X className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-700 uppercase">
                Ainda não
              </h3>
              <p className="text-gray-600 text-base">
                A criança ainda não demonstra esta habilidade
              </p>
            </div>
          </div>

          <div
            onClick={() => onAnswer("Com Mediação")}
            className={`flex items-center gap-4 border-2 rounded-lg p-4 hover:cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
              selected("Com Mediação")
                ? "bg-yellow-50 border-yellow-400"
                : "border-gray-200 hover:border-yellow-400"
            }`}
          >
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
              <Hand className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-700 uppercase">
                Sim, com mediação
              </h3>
              <p className="text-gray-600 text-base">
                A criança demonstra a habilidade com ajuda
              </p>
            </div>
          </div>

          <div
            onClick={() => onAnswer("Sozinho")}
            className={`flex items-center gap-4 border-2 rounded-lg p-4 hover:cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
              selected("Sozinho")
                ? "bg-green-50 border-green-400"
                : "border-gray-200 hover:border-green-400"
            }`}
          >
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-700 uppercase">
                Sim, sozinho
              </h3>
              <p className="text-gray-600 text-base">
                A criança demonstra a habilidade independentemente
              </p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <button
          className={`px-4 py-2 text-sm font-medium bg-gray-200 rounded-md hover:bg-gray-300 ${
            canPrev ? "visible" : "invisible"
          }`}
          onClick={onPrev}
        >
          Anterior
        </button>

        <button
          type="button"
          onClick={onToggleAutoAdvance}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-md hover:bg-gray-100 ${
            canNext ? "visible" : "invisible"
          }`}
        >
          {autoAvancar ? (
            <>
              <Pause className="w-4 h-4" /> Pausar Auto-Avanço
            </>
          ) : (
            <>
              <Play className="w-4 h-4" /> Ativar Auto-Avanço
            </>
          )}
        </button>

        <button
          className={`px-4 py-2 text-sm font-medium bg-brand-navy text-white rounded-md hover:bg-brand-navy-light ${
            canNext ? "visible" : "invisible"
          }`}
          onClick={onNext}
          disabled={autoAvancar}
        >
          Próxima
        </button>

        <button
          disabled={!!loading}
          className={`px-4 py-2 text-sm font-medium bg-brand-navy text-white rounded-md hover:bg-brand-navy-light ${
            isLast ? "block" : "hidden"
          }`}
          onClick={onFinish}
        >
          {loading ? "Salvando..." : "Finalizar Avaliação"}
        </button>
      </CardFooter>
    </Card>
  );
}
