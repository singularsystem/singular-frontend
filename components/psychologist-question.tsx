import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  CreatePsychologistQuestionnaireDTO,
  PsychologistQuestionnaire,
} from "@/types/questionario-psicologo";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface PsychologistQuestionProps {
  label: string;
  fieldName: keyof PsychologistQuestionnaire;
  observationFieldName: keyof PsychologistQuestionnaire;
  type: string;
  options?: { label: string; value: string }[];
  formData: CreatePsychologistQuestionnaireDTO;
  handleCheckboxChange: (
    field: keyof PsychologistQuestionnaire,
    value: "Sim" | "Não",
  ) => void;
  setFormData: React.Dispatch<
    React.SetStateAction<CreatePsychologistQuestionnaireDTO>
  >;
}

export function PsychologistQuestion({
  label,
  fieldName,
  observationFieldName,
  type,
  options,
  formData,
  handleCheckboxChange,
  setFormData,
}: PsychologistQuestionProps) {
  if (type !== "options") {
    const selected = formData[
      fieldName as keyof CreatePsychologistQuestionnaireDTO
    ] as "Sim" | "Não" | "" | undefined;

    return (
      <div className="space-y-4 p-4">
        <Label className="block text-lg text-[#0a112f]">{label}</Label>

        <div className="grid grid-cols-2 gap-4">
          <RadioGroup
            value={selected || undefined}
            onValueChange={(val) =>
              handleCheckboxChange(fieldName, val as "Sim" | "Não")
            }
            className="grid grid-cols-2 gap-4"
          >
            <Label
              htmlFor={`${fieldName}-sim`}
              className={cn("flex items-center space-x-3 p-4 cursor-pointer")}
            >
              <RadioGroupItem
                id={`${fieldName}-sim`}
                value="Sim"
                className="w-4 h-4"
              />
              <span className="text-base flex-1">Sim</span>
            </Label>

            <Label
              htmlFor={`${fieldName}-nao`}
              className={cn("flex items-center space-x-3 p-4 cursor-pointer")}
            >
              <RadioGroupItem
                id={`${fieldName}-nao`}
                value="Não"
                className="w-4 h-4"
              />
              <span className="text-base flex-1">Não</span>
            </Label>
          </RadioGroup>
        </div>

        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <Label className="block text-lg font-medium mb-2 text-blue-900">
            Observações:
          </Label>
          <Textarea
            className="text-lg p-4 min-h-[120px] focus:ring-blue-500"
            value={
              (formData[
                observationFieldName as keyof CreatePsychologistQuestionnaireDTO
              ] as string) || ""
            }
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [observationFieldName]: e.target.value,
              }))
            }
            placeholder="Descreva as dificuldades observadas..."
          />
        </div>
      </div>
    );
  } else {
    const selectedValue = formData[
      fieldName as keyof CreatePsychologistQuestionnaireDTO
    ] as string;

    return (
      <div className="space-y-4 p-4">
        <Label className="block text-lg text-[#0a112f]">{label}</Label>

        <div className="grid grid-cols-2 gap-4">
          <RadioGroup
            value={selectedValue}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                [fieldName]: value,
              }))
            }
            className="grid grid-cols-2 gap-4"
          >
            {options!.map((opt) => (
              <Label
                key={opt.value}
                htmlFor={`${fieldName}-${opt.value}`}
                className={cn("flex items-center space-x-3 p-4 cursor-pointer")}
              >
                <RadioGroupItem
                  id={`${fieldName}-${opt.value}`}
                  value={opt.value}
                  className="w-4 h-4"
                />
                <span className="text-base">{opt.label}</span>
              </Label>
            ))}
          </RadioGroup>
        </div>
        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
          <Label className="block text-lg font-medium mb-2 text-blue-900">
            Observações:
          </Label>
          <Textarea
            className="text-lg p-4 min-h-[120px] focus:ring-blue-500"
            value={
              (formData[
                observationFieldName as keyof CreatePsychologistQuestionnaireDTO
              ] as string) || ""
            }
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                [observationFieldName]: e.target.value,
              }))
            }
            placeholder="Descreva as dificuldades observadas..."
          />
        </div>
      </div>
    );
  }
}
