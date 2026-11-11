"use client";

import type React from "react";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { DetalhesEstudanteCard } from "@/components/estudante/detalhes-estudante-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useFetchQuestionnaireNeuropsychopedagogical } from "@/hooks/useFetchTeacherQuestionnaire";
import {
  mapNeuropsychopedagogicalFormToApiPayload,
  UpdateNeuropsychopedagogicalDTO,
} from "@/types/questionario-professor";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function EditarQuestionarioNeuropsychopedagogical({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { user, token } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const {
    questionario,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchQuestionnaireNeuropsychopedagogical(id);

  const [formData, setFormData] = useState<UpdateNeuropsychopedagogicalDTO>({
    id: "",
    studentID: "",
    userID: "",
    classroomDevelopment: "",
    classroomBehavior: "",
    mainDifficulties: "",
    learningCharacteristics: "",
    readingAndWritingDescription: "",
    logicalMathematicalReasoningDescription: "",
    completesSchoolActivities: "",
    completesHomework: "",
    reactionToFrustration: "",
    inappropriateBehaviorDescription: "",
    difficultyWorkingInGroup: "",
    difficultyOrganizingTasks: "",
    peerAcceptance: "",
    behaviorTraits: [],
    behaviorObservations: "",
    developmentLevel: "",
    developmentObservations: "",
    additionalComments: "",
  });

  useEffect(() => {
    if (fetchLoading) return;

    if (fetchError) {
      toast({
        title: "Erro ao buscar questionario",
        description: fetchError.message || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    } else if (!questionario) {
      toast({
        title: "Questionario não foi encontrado",
        description: "Por favor, cadastre questionario!",
        variant: "info",
      });
    }
  }, [fetchError, fetchLoading, questionario, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    if (questionario) {
      setFormData({
        id: questionario.id || "",
        studentID: questionario.student.id || "",
        userID: user?.id || "",
        classroomDevelopment: questionario.classroomDevelopment || "",
        classroomBehavior: questionario.classroomBehavior || "",
        mainDifficulties: questionario.mainDifficulties || "",
        learningCharacteristics: questionario.learningCharacteristics || "",
        readingAndWritingDescription:
          questionario.readingAndWritingDescription || "",
        logicalMathematicalReasoningDescription:
          questionario.logicalMathematicalReasoningDescription || "",
        completesSchoolActivities: questionario.completesSchoolActivities || "",
        completesHomework: questionario.completesHomework || "",
        reactionToFrustration: questionario.reactionToFrustration || "",
        inappropriateBehaviorDescription:
          questionario.inappropriateBehaviorDescription || "",
        difficultyWorkingInGroup: questionario.difficultyWorkingInGroup || "",
        difficultyOrganizingTasks: questionario.difficultyOrganizingTasks || "",
        peerAcceptance: questionario.peerAcceptance || "",
        behaviorTraits:
          questionario.behaviorTraits?.map((item) => item.behaviorTrait) ?? [],
        behaviorObservations: questionario.behaviorObservations || "",
        developmentLevel: questionario.developmentLevel || "",
        developmentObservations: questionario.developmentObservations || "",
        additionalComments: questionario.additionalComments || "",
      });
    }
  }, [questionario, user]);

  const handleCheckboxChange = (value: string, checked: boolean) => {
    setFormData((prev) => {
      const updated = checked
        ? [...prev.behaviorTraits, value]
        : prev.behaviorTraits.filter((trait) => trait !== value);

      return {
        ...prev,
        behaviorTraits: updated,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!questionario || !user) {
      toast({
        title: "Erro",
        description: "Usuário ou questionário não carregado(s).",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const payload = mapNeuropsychopedagogicalFormToApiPayload(
        formData,
        questionario?.student.id,
        user.id,
      );

      const response = await fetch(
        `${apiUrl}/api/v1/regular-teacher-questionnaires`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        toast({
          variant: "destructive",
          title: "Erro ao editar questionário",
          description:
            errorData.message ||
            "Ocorreu um erro ao tentar atualizar o questionário. Por favor, tente novamente.",
        });
        return;
      }

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Questionário Neuropsicopedagógico editado",
          description:
            "Questionário Neuropsicopedagógico foi atualizado com sucesso",
          variant: "success",
        });
        router.push(`/professor-questionario`);
      } else {
        console.error("Server reported an issue:", result.message);
        toast({
          variant: "destructive",
          title: "Erro ao editar questionário",
          description:
            result.message ||
            "Ocorreu um erro desconhecido ao atualizar o questionário.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao editar questionário",
        description: "Ocorreu um erro ao tentar atualizar o questionário",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!questionario) {
    return;
  }

  return (
    <main className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowConfirm(true)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-brand-navy">
            Editar Questionário
          </h1>
        </div>
      </div>
      <DetalhesEstudanteCard obj={questionario} />;
      <form>
        <Card>
          <CardHeader>
            <CardTitle>Questionário Neuropsicopedagógico</CardTitle>
            <CardDescription>
              Preencha as informações da avaliação neuropsicopedagógica
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="classroomDevelopment">
                Como é o desenvolvimento do aluno da sala de aula?
              </Label>
              <Textarea
                id="classroomDevelopment"
                name="classroomDevelopment"
                value={formData.classroomDevelopment}
                onChange={handleChange}
                placeholder="Descreva o desenvolvimento do aluno em sala de aula..."
                className="min-h-[150px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="classroomBehavior">
                Como é o comportamento do aluno na sala de aula?
              </Label>
              <Textarea
                id="classroomBehavior"
                name="classroomBehavior"
                value={formData.classroomBehavior}
                onChange={handleChange}
                placeholder="Descreva o comportamento do aluno em sala de aula..."
                className="min-h-[150px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mainDifficulties">
                Quais as principais dificuldades apresentadas pelo aluno?
              </Label>
              <Textarea
                id="mainDifficulties"
                name="mainDifficulties"
                value={formData.mainDifficulties}
                onChange={handleChange}
                placeholder="Descreva as principais dificuldades do aluno..."
                className="min-h-[150px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="learningCharacteristics">
                Quais as suas características quanto á aprendizagem e
                assimilação de conteúdos?
              </Label>
              <Textarea
                id="learningCharacteristics"
                name="learningCharacteristics"
                value={formData.learningCharacteristics}
                onChange={handleChange}
                placeholder="Descreva as características do aluno quanto a aprendizagem e assimilação de conteúdos..."
                className="min-h-[150px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="readingAndWritingDescription">
                Como você descreveria a leitura e escrita do aluno?
              </Label>
              <Textarea
                id="readingAndWritingDescription"
                name="readingAndWritingDescription"
                value={formData.readingAndWritingDescription}
                onChange={handleChange}
                placeholder="Descreva a leitura e escrita do aluno..."
                className="min-h-[150px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logicalMathematicalReasoningDescription">
                Como você descreveria o raciocínio lógico matemático do aluno?
              </Label>
              <Textarea
                id="logicalMathematicalReasoningDescription"
                name="logicalMathematicalReasoningDescription"
                value={formData.logicalMathematicalReasoningDescription}
                onChange={handleChange}
                placeholder="Descreva o raciocínio lógico matemático do aluno..."
                className="min-h-[150px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="completesSchoolActivities">
                Faz as atividades escolares?
              </Label>
              <Textarea
                id="completesSchoolActivities"
                name="completesSchoolActivities"
                value={formData.completesSchoolActivities}
                onChange={handleChange}
                placeholder="Descreva se o aluno faz atividades escolares..."
                className="min-h-[150px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="completesHomework">
                Faz as atividades de casa?
              </Label>
              <Textarea
                id="completesHomework"
                name="completesHomework"
                value={formData.completesHomework}
                onChange={handleChange}
                placeholder="Descreva se o aluno faz atividades de casa..."
                className="min-h-[150px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reactionToFrustration">
                Como reage quando é contrariado?
              </Label>
              <Textarea
                id="reactionToFrustration"
                name="reactionToFrustration"
                value={formData.reactionToFrustration}
                onChange={handleChange}
                placeholder="Descreva como o aluno reage quando contrariado..."
                className="min-h-[150px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inappropriateBehaviorDescription">
                O aluno é inconveniente? Em que circunstâncias demonstra
                inconveniência? E como se manifesta?
              </Label>
              <Textarea
                id="inappropriateBehaviorDescription"
                name="inappropriateBehaviorDescription"
                value={formData.inappropriateBehaviorDescription}
                onChange={handleChange}
                placeholder="Descreva se o aluno é inconveniente, em que circurstâncias isso acontece e como se manifesta..."
                className="min-h-[150px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficultyWorkingInGroup">
                Tem dificuldade em trabalhar em grupo? Como se manifesta essa
                dificuldade?
              </Label>
              <Textarea
                id="difficultyWorkingInGroup"
                name="difficultyWorkingInGroup"
                value={formData.difficultyWorkingInGroup}
                onChange={handleChange}
                placeholder="Descreva se o aluno tem dificuldade em trabalhar em grupo e como se manifesta..."
                className="min-h-[150px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficultyOrganizingTasks">
                Tem dificuldade em organizar suas tarefas e atividades pessoais?
              </Label>
              <Textarea
                id="difficultyOrganizingTasks"
                name="difficultyOrganizingTasks"
                value={formData.difficultyOrganizingTasks}
                onChange={handleChange}
                placeholder="Descreva se o aluno tem dificuldade em organizar suas tarefas e atividades pessoais..."
                className="min-h-[150px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="peerAcceptance">
                Os colegas da turma o aceitam?
              </Label>
              <Textarea
                id="peerAcceptance"
                name="peerAcceptance"
                value={formData.peerAcceptance}
                onChange={handleChange}
                placeholder="Descreva se o aluno é aceito pelos seus colegas de turma..."
                className="min-h-[150px]"
              />
            </div>
            <div className="space-y-4">
              <Label htmlFor="behaviorTraits" className="block">
                Em qual ou quais características o aluno se encaixa?
              </Label>

              <div className="grid grid-cols-2 gap-2">
                {[
                  "Agressivo(a)",
                  "Passivo(a)",
                  "Dependente",
                  "Medroso(a)",
                  "Retraído(a)",
                  "Melancólico(a)",
                  "Calmo(a)",
                  "Desligado(a)",
                  "Sem limites",
                  "Agitado(a)",
                  "Depressivo(a)",
                  "Ressentido(a)",
                ].map((caracteristica) => {
                  const isChecked =
                    formData.behaviorTraits.includes(caracteristica);
                  return (
                    <div
                      key={caracteristica}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`caracteristica-${caracteristica}`}
                        checked={isChecked}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(caracteristica, Boolean(checked))
                        }
                      />
                      <Label
                        htmlFor={`caracteristica-${caracteristica}`}
                        className="text-gray-700"
                      >
                        {caracteristica}
                      </Label>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 space-y-2">
                <Label htmlFor="behaviorObservations">
                  Observações sobre as características do aluno
                </Label>
                <Textarea
                  id="behaviorObservations"
                  name="behaviorObservations"
                  value={formData.behaviorObservations}
                  onChange={handleChange}
                  placeholder="Escreva observações complementares aqui..."
                  className="min-h-[150px]"
                />
              </div>
            </div>
            <div className="space-y-4">
              <Label htmlFor="developmentLevel" className="block">
                Comparado aos outros integrantes da turma o aluno é:
              </Label>
              <RadioGroup
                value={
                  formData.developmentLevel || questionario?.developmentLevel
                }
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    developmentLevel: value,
                  }))
                }
                className="grid grid-cols-2 gap-2"
              >
                {["Mais Infantil", "Na Média", "Mais Maduro(a)"].map(
                  (caracteristica) => (
                    <div
                      key={caracteristica}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={caracteristica}
                        id={`caracteristica-${caracteristica}`}
                      />
                      <Label
                        htmlFor={`caracteristica-${caracteristica}`}
                        className="text-gray-700"
                      >
                        {caracteristica}
                      </Label>
                    </div>
                  ),
                )}
              </RadioGroup>
              <div className="pt-4 space-y-2">
                <Label htmlFor="developmentObservations">
                  Observações sobre o ponto anterior
                </Label>
                <Textarea
                  id="developmentObservations"
                  name="developmentObservations"
                  value={formData.developmentObservations}
                  onChange={handleChange}
                  placeholder="Escreva observações complementares aqui..."
                  className="min-h-[150px]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="additionalComments">
                Relate qualquer informação que não tenha sido abordada ou que
                julgue importantes.
              </Label>
              <Textarea
                id="additionalComments"
                name="additionalComments"
                value={formData.additionalComments}
                onChange={handleChange}
                placeholder="Escreva qualquer informação adicional que julgue importante..."
                className="min-h-[150px]"
              />
            </div>

            <div className="mt-6 mb-20 flex justify-end">
              <Button
                type="submit"
                className="bg-brand-navy hover:bg-blue-800"
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? "Salvando..." : "Salvar Questionário"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        actionDescription="edição de questinário"
        actionName="edição"
        route="/professor-questionario"
      />
    </main>
  );
}
