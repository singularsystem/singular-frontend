"use client";

import { ActionsBar } from "@/components/actions-bar";
import { PlanSignatureCard } from "@/components/assinatura-digital/plan-sign-card";
import { DetalhesEstudanteCard } from "@/components/estudante/detalhes-estudante-card";
import { ScreeningQuestionView } from "@/components/screening-question-view";
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
import { usePdfDownload, usePdfPrint } from "@/hooks/useFetchPDFs";
import { useFetchTeacherEvaluationById } from "@/hooks/useFetchTeacherEvaluations";
import { screeningSections } from "@/lib/constants";
import { EvaluationScreening } from "@/types/triagem";
import { ArrowLeft } from "lucide-react";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function RegularTeacherEvaluation({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { openDocumentPdf, isPrinting } = usePdfPrint();
  const { downloadDocumentPdf, isGeneratingPDF } = usePdfDownload();
  const unwrappedParams = use(params);
  const { user, isLoading: authLoading } = useAuth();
  const id = unwrappedParams.id;
  const back = useBack("/professor-avaliacao");
  const {
    evaluation,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchTeacherEvaluationById(id);

  useEffect(() => {
    if (!authLoading && user) {
      const userRoles = user.roles?.map((r) => r.toLowerCase()) || [];
      if (userRoles.includes("secretary")) {
        router.push("/acompanhamento-estudos-caso");
      }
    }
  }, [authLoading, user, router]);

  useEffect(() => {
    if (fetchLoading) return;

    if (fetchError) {
      toast({
        title: "Erro ao buscar avaliação",
        description: fetchError.message || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    } else if (!evaluation) {
      toast({
        title: "Avaliação não foi encontrada",
        description: "Por favor, cadastre avaliação!",
        variant: "info",
      });
    }
  }, [fetchError, fetchLoading, evaluation, toast]);

  const canAssinar =
    !authLoading &&
    user?.roles[0].toLowerCase() === "teacher" &&
    user?.id === evaluation?.professional.id;

  const handleAssinar = () => {
    if (evaluation?.signUrl && evaluation?.signUrl != "") {
      window.open(evaluation.signUrl, "_blank");
    } else {
      console.warn("URL de assinatura não disponível");
      toast({
        variant: "destructive",
        title: "Erro ao gerar link para assinatura",
        description: "Error",
      });
    }
  };

  if (evaluation == null) {
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
            Estudo de Caso
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              router.push(
                `/professor-questionario/${evaluation.questionnaire.id}/editar`,
              )
            }
          >
            Editar
          </Button>
          <ActionsBar
            onPrint={(win) => {
              void openDocumentPdf(evaluation.id, win);
            }}
            onExportPDF={async () => {
              await downloadDocumentPdf(evaluation.id);
            }}
            isPrinting={isPrinting}
            isGeneratingPDF={isGeneratingPDF}
            isSigning={isLoading}
            canSign={canAssinar}
            isSigned={!!evaluation?.teacherSign}
            onSign={handleAssinar}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <DetalhesEstudanteCard obj={evaluation} />
        </div>
        <PlanSignatureCard
          professionalName={evaluation?.professional.fullName}
          teacherSign={evaluation?.teacherSign}
          signedAt={evaluation?.signedAt}
          documentToken={evaluation?.documentToken}
          documentStatus={evaluation?.documentStatus}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Avaliação</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent id="completo-content" className="space-y-4">
          <div>
            <div className="mb-10 px-10 text-justify">
              <div className="space-y-2">
                <h4 className="text-lg font-semibold  mb-4">
                  1. Como é o desenvolvimento do aluno da sala de aula?
                </h4>
                <p className="whitespace-pre-wrap break-words">
                  {evaluation?.questionnaire.classroomDevelopment}
                </p>
              </div>
            </div>

            <div className="mb-10 px-10 text-justify">
              <div className="space-y-2">
                <h4 className="text-lg font-semibold  mb-4">
                  2. Como é o comportamento do aluno na sala de aula?
                </h4>
                <p className="whitespace-pre-wrap break-words">
                  {evaluation?.questionnaire.classroomBehavior}
                </p>
              </div>
            </div>

            <div className="mb-10 px-10 text-justify">
              <div className="space-y-2">
                <h4 className="text-lg font-semibold  mb-4">
                  3. Quais as principais dificuldades apresentadas pelo aluno?
                </h4>
                <p className="whitespace-pre-wrap break-words">
                  {evaluation?.questionnaire.mainDifficulties}
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
                  {evaluation?.questionnaire.learningCharacteristics}
                </p>
              </div>
            </div>
            <div className="mb-10 px-10 text-justify">
              <div className="space-y-2">
                <h4 className="text-lg font-semibold  mb-4">
                  5. Como você descreveria a leitura e escrita do aluno?
                </h4>
                <p className="whitespace-pre-wrap break-words">
                  {evaluation?.questionnaire.readingAndWritingDescription}
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
                  {
                    evaluation?.questionnaire
                      .logicalMathematicalReasoningDescription
                  }
                </p>
              </div>
            </div>
            <div className="mb-10 px-10 text-justify">
              <div className="space-y-2">
                <h4 className="text-lg font-semibold  mb-4">
                  7. Faz as atividades escolares?
                </h4>
                <p className="whitespace-pre-wrap break-words">
                  {evaluation?.questionnaire.completesSchoolActivities}
                </p>
              </div>
            </div>

            <div className="mb-10 px-10 text-justify">
              <div className="space-y-2">
                <h4 className="text-lg font-semibold  mb-4">
                  8. Faz as atividades de casa?
                </h4>
                <p className="whitespace-pre-wrap break-words">
                  {evaluation?.questionnaire.completesHomework}
                </p>
              </div>
            </div>

            <div className="mb-10 px-10 text-justify">
              <div className="space-y-2">
                <h4 className="text-lg font-semibold  mb-4">
                  9. Como reage quando é contrariado?
                </h4>
                <p className="whitespace-pre-wrap break-words">
                  {evaluation?.questionnaire.reactionToFrustration}
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
                  {evaluation?.questionnaire.inappropriateBehaviorDescription}
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
                  {evaluation?.questionnaire.difficultyWorkingInGroup}
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
                  {evaluation?.questionnaire.difficultyOrganizingTasks}
                </p>
              </div>
            </div>
            <div className="mb-10 px-10 text-justify">
              <div className="space-y-2">
                <h4 className="text-lg font-semibold  mb-4">
                  13. Os colegas da turma o aceitam?
                </h4>
                <p className="whitespace-pre-wrap break-words">
                  {evaluation?.questionnaire.peerAcceptance}
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
                  {evaluation?.questionnaire.behaviorTraits
                    .map((o) => o.behaviorTrait.toLowerCase())
                    .join(", ")}
                </p>
                {evaluation?.questionnaire.behaviorObservations !== null && (
                  <p>
                    Observações:{" "}
                    {evaluation?.questionnaire.behaviorObservations}
                  </p>
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
                  {evaluation?.questionnaire.developmentLevel.toLowerCase()}
                </p>

                {evaluation?.questionnaire.developmentObservations !== null && (
                  <p>
                    Observações:{" "}
                    {evaluation?.questionnaire.developmentObservations}
                  </p>
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
                  {evaluation?.questionnaire.additionalComments}
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="mb-10 px-10 text-justify space-y-6">
              {screeningSections.map((section) => (
                <div key={section.title} className="space-y-6">
                  <h3 className="text-xl font-semibold text-brand-navy border-b pb-2">
                    {section.title}
                  </h3>

                  <div className="grid gap-6">
                    {section.questions.map((q) => (
                      <ScreeningQuestionView
                        key={q.field}
                        label={q.label}
                        fieldName={q.field as keyof EvaluationScreening}
                        observationFieldName={
                          q.obs as keyof EvaluationScreening
                        }
                        type={q.type}
                        options={q.options}
                        data={evaluation?.screening!}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-10 px-10 text-justify">
              <div className="space-y-2">
                <h4 className="text-lg font-semibold  mb-4">
                  18. Relate qualquer informação que não tenha sido abordada ou
                  que julgue importantes.
                </h4>
                <p className="whitespace-pre-wrap break-words">
                  {evaluation?.screening?.additionalComments}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
