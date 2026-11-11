"use client";

import { DetalhesEstudanteCard } from "@/components/estudante/detalhes-estudante-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useBack } from "@/hooks/use-back";
import { useToast } from "@/hooks/use-toast";
import { useFetchQuestionnaireNeuropsychopedagogical } from "@/hooks/useFetchTeacherQuestionnaire";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export default function QuestionarioNeuropsychopedagogical({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("completo");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const unwrappedParams = use(params);
  const { user, token } = useAuth();
  const id = unwrappedParams.id;
  const back = useBack("/professor-questionario");

  const {
    questionario,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchQuestionnaireNeuropsychopedagogical(id);

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

  if (!questionario) {
    return;
  }

  return (
    <main className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={back}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-brand-navy">
            Questionário Neuropsicopedagógico
          </h1>
        </div>
      </div>
      <DetalhesEstudanteCard obj={questionario} />;
      <Card>
        <CardHeader>
          <CardTitle>Questionário Neuropsicopedagógico</CardTitle>
          <CardDescription>
            <p className="text-muted-foreground">
              Data: {questionario?.localCreatedAt}
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent id="completo-content" className="space-y-4">
          <div className="mb-10 px-10 text-justify">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold  mb-4">
                1. Como é o desenvolvimento do aluno da sala de aula?
              </h4>
              <p className="whitespace-pre-wrap break-words">
                {questionario?.classroomDevelopment}
              </p>
            </div>
          </div>

          <div className="mb-10 px-10 text-justify">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold  mb-4">
                2. Como é o comportamento do aluno na sala de aula?
              </h4>
              <p className="whitespace-pre-wrap break-words">
                {questionario?.classroomBehavior}
              </p>
            </div>
          </div>

          <div className="mb-10 px-10 text-justify">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold  mb-4">
                3. Quais as principais dificuldades apresentadas pelo aluno?
              </h4>
              <p className="whitespace-pre-wrap break-words">
                {questionario?.mainDifficulties}
              </p>
            </div>
          </div>

          <div className="mb-10 px-10 text-justify">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold  mb-4">
                4. Quais as suas características quanto á aprendizagem e
                assimilação de conteúdos?
              </h4>
              <p className="whitespace-pre-wrap break-words">
                {questionario?.learningCharacteristics}
              </p>
            </div>
          </div>
          <div className="mb-10 px-10 text-justify">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold  mb-4">
                5. Como você descreveria a leitura e escrita do aluno?
              </h4>
              <p className="whitespace-pre-wrap break-words">
                {questionario?.readingAndWritingDescription}
              </p>
            </div>
          </div>

          <div className="mb-10 px-10 text-justify">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold  mb-4">
                6. Como você descreveria o raciocínio lógico matemático do
                aluno?
              </h4>
              <p className="whitespace-pre-wrap break-words">
                {questionario?.logicalMathematicalReasoningDescription}
              </p>
            </div>
          </div>
          <div className="mb-10 px-10 text-justify">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold  mb-4">
                7. Faz as atividades escolares?
              </h4>
              <p className="whitespace-pre-wrap break-words">
                {questionario?.completesSchoolActivities}
              </p>
            </div>
          </div>

          <div className="mb-10 px-10 text-justify">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold  mb-4">
                8. Faz as atividades de casa?
              </h4>
              <p className="whitespace-pre-wrap break-words">
                {questionario?.completesHomework}
              </p>
            </div>
          </div>

          <div className="mb-10 px-10 text-justify">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold  mb-4">
                9. Como reage quando é contrariado?
              </h4>
              <p className="whitespace-pre-wrap break-words">
                {questionario?.reactionToFrustration}
              </p>
            </div>
          </div>

          <div className="mb-10 px-10 text-justify">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold  mb-4">
                10. O aluno é inconveniente? Em que circunstâncias demonstra
                inconveniência? E como se manifesta?
              </h4>
              <p className="whitespace-pre-wrap break-words">
                {questionario?.inappropriateBehaviorDescription}
              </p>
            </div>
          </div>

          <div className="mb-10 px-10 text-justify">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold  mb-4">
                11. Tem dificuldade em trabalhar em grupo? Como se manifesta
                essa dificuldade?
              </h4>
              <p className="whitespace-pre-wrap break-words">
                {questionario?.difficultyWorkingInGroup}
              </p>
            </div>
          </div>
          <div className="mb-10 px-10 text-justify">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold  mb-4">
                12. Tem dificuldade em organizar suas tarefas e atividades
                pessoais?
              </h4>
              <p className="whitespace-pre-wrap break-words">
                {questionario?.difficultyOrganizingTasks}
              </p>
            </div>
          </div>
          <div className="mb-10 px-10 text-justify">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold  mb-4">
                13. Os colegas da turma o aceitam?
              </h4>
              <p className="whitespace-pre-wrap break-words">
                {questionario?.peerAcceptance}
              </p>
            </div>
          </div>

          <div className="mb-10 px-10 text-justify">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold  mb-4">
                14. Em qual ou quais características o aluno se encaixa?
              </h4>
              <p>
                Características selecionadas:{" "}
                {questionario?.behaviorTraits
                  .map((o) => o.behaviorTrait.toLowerCase())
                  .join(", ")}
              </p>
              {questionario?.behaviorObservations !== null && (
                <p>Observações: {questionario?.behaviorObservations}</p>
              )}
            </div>
          </div>

          <div className="mb-10 px-10 text-justify">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold  mb-4">
                15. Comparado aos outros integrantes da turma o aluno é:
              </h4>
              <p className="whitespace-pre-wrap break-words">
                Nível de maturidade:{" "}
                {questionario?.developmentLevel.toLowerCase()}
              </p>

              {questionario?.developmentObservations !== null && (
                <p>Observações: {questionario?.developmentObservations}</p>
              )}
            </div>
          </div>

          <div className="mb-10 px-10 text-justify">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold  mb-4">
                16. Relate qualquer informação que não tenha sido abordada ou
                que julgue importantes.
              </h4>
              <p className="whitespace-pre-wrap break-words">
                {questionario?.additionalComments}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
