import { Label } from "@/components/ui/label";
import { opcoesCognitiveAssessment } from "@/lib/constants";
import {
  CognitiveAssessment,
  CreateCognitiveAssessmentDTO,
} from "@/types/cognitive-assessment";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface CognitiveAssessmentQuestionProps {
  label: string;
  fieldName: keyof CognitiveAssessment;
  formData: CreateCognitiveAssessmentDTO;
  handleCheckboxChange: (
    field: keyof CognitiveAssessment,
    value: string
  ) => void;
}

export function CognitiveAssessmentQuestion({
  label,
  fieldName,
  formData,
  handleCheckboxChange,
}: CognitiveAssessmentQuestionProps) {
  const value = formData[fieldName as keyof CreateCognitiveAssessmentDTO] as
    | string
    | undefined;

  const onSelect = (val: string) => {
    handleCheckboxChange(fieldName, val);
  };

  return (
    <div className="space-y-4 p-4">
      <Label className="block text-lg text-brand-navy">{label}</Label>

      <RadioGroup
        value={value}
        onValueChange={onSelect}
        className="grid grid-cols-3 gap-4"
      >
        {opcoesCognitiveAssessment.map((opcao) => {
          const normalizedValue = opcao
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "-");

          return (
            <Label
              key={opcao}
              htmlFor={`${fieldName}-${normalizedValue}`}
              className="flex items-center space-x-3 p-4 cursor-pointer border rounded-md hover:bg-muted"
            >
              <RadioGroupItem
                id={`${fieldName}-${normalizedValue}`}
                value={opcao}
                className="w-4 h-4"
              />
              <span className="text-base flex-1">{opcao}</span>
            </Label>
          );
        })}
      </RadioGroup>
    </div>
  );
}
