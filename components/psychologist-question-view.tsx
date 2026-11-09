import { PsychologistQuestionnaire } from "@/types/questionario-psicologo";

interface PsychologistQuestionViewProps {
  label: string;
  fieldName: keyof PsychologistQuestionnaire;
  observationFieldName?: keyof PsychologistQuestionnaire;
  type: string;
  options?: { label: string; value: any }[];
  data: PsychologistQuestionnaire;
}

export function PsychologistQuestionView({
  label,
  fieldName,
  observationFieldName,
  type,
  options,
  data,
}: PsychologistQuestionViewProps) {
  const value = data?.[fieldName as keyof PsychologistQuestionnaire];
  const observation = observationFieldName
    ? data?.[observationFieldName as keyof PsychologistQuestionnaire]
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
