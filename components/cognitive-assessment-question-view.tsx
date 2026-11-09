import { CognitiveAssessment } from "@/types/cognitive-assessment";

interface CognitiveAssessmentQuestionViewProps {
  label: string;
  fieldName: keyof CognitiveAssessment;
  data: CognitiveAssessment;
}

export function CognitiveAssessmentQuestionView({
  label,
  fieldName,
  data,
}: CognitiveAssessmentQuestionViewProps) {
  const value = data?.[fieldName as keyof CognitiveAssessment] as
    | string
    | undefined;

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
    </div>
  );
}
