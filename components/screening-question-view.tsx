import { EvaluationScreening } from "@/types/triagem";

interface ScreeningQuestionViewProps {
  label: string;
  fieldName: keyof EvaluationScreening;
  observationFieldName?: keyof EvaluationScreening;
  type: string;
  options?: { label: string; value: any }[];
  data: EvaluationScreening;
}

export function ScreeningQuestionView({
  label,
  fieldName,
  observationFieldName,
  type,
  options,
  data,
}: ScreeningQuestionViewProps) {
  const value = data?.[fieldName as keyof EvaluationScreening];
  const observation = observationFieldName
    ? data?.[observationFieldName as keyof EvaluationScreening]
    : null;

  function renderValue(value: unknown): React.ReactNode {
    if (value === null || value === undefined || value === "") {
      return "—";
    }

    if (value instanceof Date) {
      return value.toLocaleDateString("pt-BR");
    }

    if (typeof value === "boolean") {
      return value ? "Sim" : "Não";
    }

    return String(value);
  }

  return (
    <div className="space-y-4">
      <p className="text-lg">
        <strong>{label}:</strong> {renderValue(value)}
      </p>

      {observation && (
        <p className="text-base text-muted-foreground">
          <strong>Observação:</strong> {renderValue(observation)}
        </p>
      )}
    </div>
  );
}
