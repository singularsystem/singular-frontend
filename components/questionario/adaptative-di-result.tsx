import {
  domainsAdaptativeDI,
  getAdaptativeDIInterpretation,
} from "@/lib/questionarios";
import { AdaptiveDIScale } from "@/types/escala-adaptative-di";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type Props = {
  questionario: AdaptiveDIScale;
};

export function AdaptativeDIResultCard({ questionario }: Props) {
  type DomainKey =
    | "scoreConceptualSkills"
    | "percentageConceptualSkills"
    | "maxPointsConceptualSkills"
    | "scoreSocialSkills"
    | "percentageSocialSkills"
    | "maxPointsSocialSkills"
    | "scorePracticalSkills"
    | "percentagePracticalSkills"
    | "maxPointsPracticalSkills";

  const overall = getAdaptativeDIInterpretation(questionario.percentage);

  return (
    <Card className={`border-2 mb-10 ${overall.bg} ${overall.border}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${overall.color}`}>
          <CheckCircle2 className="w-6 h-6" />
          Resultado da Avaliação Adaptativa
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-3">
          {domainsAdaptativeDI.map((domain, index) => {
            const [scoreKey, percentageKey, maxKey] =
              domain.items as DomainKey[];

            const score = questionario[scoreKey];
            const percentage = questionario[percentageKey];
            const max = questionario[maxKey];

            const interp = getAdaptativeDIInterpretation(percentage);

            return (
              <Alert
                key={index}
                className={`${interp.bg} ${interp.border} border`}
              >
                <AlertTitle className="flex justify-between items-center">
                  <span>{domain.title}</span>
                  <span className="text-sm font-normal">
                    {score}/{max} pontos
                  </span>
                </AlertTitle>

                <AlertDescription>
                  <div className="flex items-center justify-between mt-2">
                    <span className={`font-semibold ${interp.color}`}>
                      {interp.level}
                    </span>
                    <span className="text-sm">
                      {percentage.toFixed(0)}% de desempenho
                    </span>
                  </div>
                </AlertDescription>
              </Alert>
            );
          })}
        </div>

        <Alert className={`${overall.bg} ${overall.border} border`}>
          <AlertTitle>Pontuação Total</AlertTitle>
          <AlertDescription>
            <div className="flex justify-between items-center mt-2">
              <span className={`text-lg font-bold ${overall.color}`}>
                {questionario.score}/{questionario.maxPoints} pontos
              </span>
              <span className="text-sm font-semibold text-gray-600">
                {questionario.percentage.toFixed(1)}% geral
              </span>
            </div>
          </AlertDescription>
        </Alert>

        {questionario.result !== "Sem atraso no desenvolvimento" &&
          questionario.result !== "Nenhum(a)" && (
            <Alert className="bg-red-100 border-red-300 border">
              <AlertTriangle className="h-5 w-5 text-red-700" />
              <AlertTitle className="text-red-900 font-bold">
                Resultado Clínico Importante
              </AlertTitle>
              <AlertDescription className="text-red-800 font-semibold mt-2">
                SUGESTIVO DE LIMITAÇÃO NO COMPORTAMENTO ADAPTATIVO
              </AlertDescription>
            </Alert>
          )}

        <div
          className={`rounded-lg p-4 ${overall.bg} ${overall.border} border`}
        >
          <h4 className={`font-semibold mb-2 ${overall.color}`}>
            Interpretação Geral:
          </h4>

          <p className={`text-sm ${overall.color}`}>
            {questionario.percentage >= 80 &&
              "O estudante demonstra funcionamento adaptativo adequado para a idade em todas as áreas avaliadas."}

            {questionario.percentage >= 60 &&
              questionario.percentage < 80 &&
              "O estudante apresenta funcionamento adaptativo parcial, podendo se beneficiar de suporte em algumas áreas."}

            {questionario.percentage < 60 &&
              "O estudante necessita de apoio significativo em várias áreas do funcionamento adaptativo. Recomenda-se avaliação mais aprofundada."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
