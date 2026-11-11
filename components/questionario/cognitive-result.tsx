import { getCognitiveAssesmentResultInterpretation } from "@/lib/questionarios";
import { CognitiveAssessment } from "@/types/cognitive-assessment";
import { CheckCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "../ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type Props = {
  questionario: CognitiveAssessment;
  showFull?: boolean;
};

export function CognitiveAssessmentResultCard({
  questionario,
  showFull = true,
}: Props) {
  const interpretation = getCognitiveAssesmentResultInterpretation(
    questionario.percentage,
  );

  const Content = (
    <Alert className={`${interpretation.color} border-2`}>
      <AlertDescription className="space-y-4">
        <div className="text-center">
          <h3 className={`text-xl font-bold ${interpretation.textColor} mb-2`}>
            {interpretation.level}
          </h3>
          <p className={`text-2xl font-bold ${interpretation.textColor}`}>
            {interpretation.result}
          </p>
        </div>
        <div className={`${interpretation.textColor} text-sm leading-relaxed`}>
          <p className="font-semibold mb-2">Interpretação:</p>
          <p>{interpretation.description}</p>
        </div>
        <div className="bg-white/50 p-4 rounded-md text-sm">
          <p className="font-semibold text-slate-700 mb-2">
            Observação Importante:
          </p>
          <p className="text-slate-600">
            Esta avaliação é um instrumento de triagem e não substitui uma
            avaliação psicológica completa com instrumentos padronizados. Para
            diagnóstico de limitação intelectual, é fundamental avaliação por
            profissional especializado utilizando testes psicométricos validados
            (como WISC, WPPSI, ou outras escalas apropriadas) e avaliação do
            comportamento adaptativo.
          </p>
        </div>
      </AlertDescription>
    </Alert>
  );

  if (!showFull) {
    return (
      <Card className={`border-2 mb-10 ${interpretation.color}`}>
        <CardHeader>
          <CardTitle
            className={`flex items-center gap-2 ${interpretation.color}`}
          >
            <CheckCircle2 className="w-6 h-6" />
            Resultado da Escala de Funcionamento Intelectual
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="p-8">{Content}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-lg border-teal-200 mb-10">
      <CardHeader className="text-center bg-brand-ice border-b">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle className="w-12 h-12 text-teal-600" />
        </div>
        <CardTitle className="text-3xl font-bold text-teal-900">
          Resultados - Funcionamento Intelectual
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8 space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-teal-50 border-teal-200">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-teal-700 mb-2">Pontuação Total</p>
              <p className="text-4xl font-bold text-teal-900">
                {questionario.score}/40
              </p>
            </CardContent>
          </Card>

          <Card className="bg-brand-ice border-brand-navy/10">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-brand-navy-light mb-2">Percentual</p>
              <p className="text-4xl font-bold text-brand-navy">
                {questionario.percentage?.toFixed(1)}%
              </p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <p className="text-sm text-blue-700 mb-2">Domínios Avaliados</p>
              <p className="text-4xl font-bold text-blue-900">4</p>
            </CardContent>
          </Card>
        </div>

        {/* <Card className="bg-slate-50 border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg">Desempenho por Domínio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {domains.map((domain) => {
              const domainData = domainScores[domain.title];
              const domainPercentage =
                (domainData.score / domainData.max) * 100;
              return (
                <div key={domain.title}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-slate-700">
                      {domain.title}
                    </span>
                    <span className="text-sm text-slate-600">
                      {domainData.score}/{domainData.max} (
                      {domainPercentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2.5">
                    <div
                      className="bg-teal-600 h-2.5 rounded-full"
                      style={{ width: `${domainPercentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card> */}
        {Content}
      </CardContent>
    </Card>
  );
}
