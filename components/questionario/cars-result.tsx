import { scoreCARSRanges } from "@/lib/questionarios";
import { CARSQuestionnaire } from "@/types/cars";
import { CheckCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type Props = {
  questionario: CARSQuestionnaire;
  showFull?: boolean;
};

export function CARSResultCard({ questionario, showFull = true }: Props) {
  const getSelectedResult = () => {
    return scoreCARSRanges.find(
      (range) => range.label === questionario.totalScore,
    );
  };
  const result = getSelectedResult();
  if (!result) return null;

  const Content = (
    <Alert className={`${result.color} border-2`}>
      <AlertDescription className="space-y-4">
        <div className="text-center">
          <p className={`text-2xl font-bold ${result.textColor} mb-4`}>
            {result.result}
          </p>
        </div>

        <div className={`${result.textColor} text-sm leading-relaxed`}>
          <p className="font-semibold mb-2">Interpretação:</p>
          <p>{result.description}</p>
        </div>

        <div className="bg-white/50 p-4 rounded-md text-sm">
          <p className="font-semibold text-slate-700 mb-2">
            Sobre a Escala CARS:
          </p>
          <p className="text-slate-600">
            A Childhood Autism Rating Scale (CARS) é uma escala de 15 itens
            utilizada para diagnosticar e identificar crianças com autismo,
            distinguindo níveis de comprometimento.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );

  if (!showFull) {
    return (
      <Card className={`border-2 mb-10 ${result.color}`}>
        <CardHeader>
          <CardTitle className={`flex items-center gap-2 ${result.color}`}>
            <CheckCircle2 className="w-6 h-6" />
            Resultado da Escala CARS
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="p-8">{Content}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-lg border-indigo-200 mb-10">
      <CardHeader className="text-center bg-gradient-to-r from-indigo-100 to-purple-100 border-b">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle className="w-12 h-12 text-indigo-600" />
        </div>
        <CardTitle className="text-3xl font-bold text-indigo-900">
          Resultado CARS
        </CardTitle>
      </CardHeader>

      <CardContent className="p-8">
        <div className="space-y-6">
          <div>
            <p className="text-xl text-indigo-700 mb-2">
              Pontuação Alcançada: {questionario.totalScore} pontos
            </p>
            <p className="text-2xl font-bold text-indigo-900">{result.label}</p>
          </div>
          {Content}
        </div>
      </CardContent>
    </Card>
  );
}
