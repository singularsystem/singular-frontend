import { getMCHATResultInterpretation } from "@/lib/questionarios";
import { MCHATQuestionnaire } from "@/types/mchat";
import { CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type Props = {
  questionario: MCHATQuestionnaire;
};

export function MCHATResultCard({ questionario }: Props) {
  const interpretation = getMCHATResultInterpretation(questionario);

  if (!interpretation) return null;

  return (
    <Card className="bg-white shadow-lg border-blue-200 mb-10">
      <CardHeader className="text-center bg-gradient-to-r from-blue-100 to-indigo-100 border-b">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle className="w-12 h-12 text-blue-600" />
        </div>
        <CardTitle className="text-3xl font-bold text-blue-900">
          Resultados - Escala MCHAT
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-blue-700 mb-2">Pontuação Total</p>
              <p className="text-4xl font-bold text-blue-900">
                {questionario.score}
              </p>
              <p className="text-xs text-blue-600 mt-1">de 20 pontos</p>
            </CardContent>
          </Card>

          <Card className="bg-indigo-50 border-indigo-200">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-indigo-700 mb-2">Itens Críticos</p>
              <p className="text-4xl font-bold text-indigo-900"></p>
              <p className="text-xs text-indigo-600 mt-1">de 7 itens</p>
            </CardContent>
          </Card>
        </div>

        <Alert className={`${interpretation.color} border-2`}>
          <AlertDescription className="space-y-4">
            <div className="text-center">
              <h3
                className={`text-xl font-bold ${interpretation.textColor} mb-2`}
              >
                {interpretation.risk}
              </h3>
              <p className={`text-2xl font-bold ${interpretation.textColor}`}>
                {interpretation.result}
              </p>
            </div>
            <div
              className={`${interpretation.textColor} text-sm leading-relaxed`}
            >
              <p className="font-semibold mb-2">Recomendação:</p>
              <p>{interpretation.recommendation}</p>
            </div>
            <div className="bg-white/50 p-4 rounded-md text-sm">
              <p className="font-semibold text-slate-700 mb-2">
                Observação Importante:
              </p>
              <p className="text-slate-600">
                A escala M-CHAT é uma ferramenta de rastreamento e não confirma
                um diagnóstico preciso de TEA. Em caso de pontuação elevada, é
                fundamental que a criança seja avaliada por um médico
                especialista e uma equipe multidisciplinar.
              </p>
            </div>
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
