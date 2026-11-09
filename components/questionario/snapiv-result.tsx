import { SNAPIVQuestionnaire } from "@/types/snapiv";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

type Props = {
  questionario: SNAPIVQuestionnaire;
};

export function SNAPIVResultCard({ questionario }: Props) {
  return (
    <Card className="border-2 border-blue-200 bg-blue-50/50 mb-10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-700">
          <CheckCircle2 className="w-6 h-6" />
          Resultado da Avaliação Snap IV
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Alert
            className={
              questionario.desattentionCount >= 6
                ? "border-orange-300 bg-orange-50"
                : "border-green-300 bg-green-50"
            }
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Desatenção</AlertTitle>
            <AlertDescription>
              <p className="font-semibold text-gray-600">
                {questionario.desattentionCount} de 9 sintomas marcados
              </p>
              {questionario.desattentionCount >= 6 ? (
                <p className="text-orange-700 mt-2">
                  ✓ Existem mais sintomas de desatenção que o esperado para uma
                  criança ou adolescente
                </p>
              ) : (
                <p className="text-green-700 mt-2">
                  Sintomas dentro do esperado
                </p>
              )}
            </AlertDescription>
          </Alert>

          <Alert
            className={
              questionario.hyperactivityCount >= 6
                ? "border-orange-300 bg-orange-50"
                : "border-green-300 bg-green-50"
            }
          >
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Hiperatividade/Impulsividade</AlertTitle>
            <AlertDescription>
              <p className="font-semibold text-gray-600">
                {questionario.hyperactivityCount} de 9 sintomas marcados
              </p>
              {questionario.hyperactivityCount >= 6 ? (
                <p className="text-orange-700 mt-2">
                  ✓ Existem mais sintomas de hiperatividade e impulsividade que
                  o esperado
                </p>
              ) : (
                <p className="text-green-700 mt-2">
                  Sintomas dentro do esperado
                </p>
              )}
            </AlertDescription>
          </Alert>
        </div>

        <div className="p-4 bg-blue-100 rounded-lg">
          <h4 className="font-semibold text-blue-900 mb-2">Interpretação:</h4>
          <p className="text-sm text-blue-800">
            Havendo pelo menos 6 itens marcados como &quot;BASTANTE&quot; ou
            &quot;DEMAIS&quot; em qualquer das categorias, sugere-se avaliação mais
            aprofundada por profissional especializado.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
