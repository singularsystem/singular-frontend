"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { isAdmin, isTeacher } from "@/source/infrastructure/common/config/roles";
import { useGeracaoLivro } from "@/source/view/hooks/neckbook/useGeracaoLivro";
import { SeletorAluno } from "@/source/view/components/neckbook/SeletorAluno";
import { SeletorDisciplina } from "@/source/view/components/neckbook/SeletorDisciplina";
import { ListaInteresses } from "@/source/view/components/neckbook/ListaInteresses";
import { CampoNumCapitulos } from "@/source/view/components/neckbook/CampoNumCapitulos";
import { CampoExerciciosPorCapitulo } from "@/source/view/components/neckbook/CampoExerciciosPorCapitulo";
import { CampoEstiloVisual } from "@/source/view/components/neckbook/CampoEstiloVisual";
import { CheckboxSuporteCaa } from "@/source/view/components/neckbook/CheckboxSuporteCaa";
import { SeletorModoGeracao } from "@/source/view/components/neckbook/SeletorModoGeracao";
import { BarraProgresso } from "@/source/view/components/neckbook/BarraProgresso";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, BookOpen, Edit3, Loader2 } from "lucide-react";

export function GeracaoLivroScreen() {
  const router = useRouter();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const { state, actions } = useGeracaoLivro();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Loading state (Gate Req 1.4)
  if (authLoading) {
    return (
      <div className="p-8 space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <div className="space-y-4 pt-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    return null;
  }

  // Permission Gate: requires Teacher or Admin (Req 1.6)
  const hasAccess = isTeacher(user.roles) || isAdmin(user.roles);
  if (!hasAccess) {
    return (
      <div className="p-8 max-w-2xl mx-auto">
        <div className="p-6 rounded-xl border border-red-200 bg-red-50 text-red-800 flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-red-600 shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-base">Acesso Não Autorizado</h3>
            <p className="text-sm mt-1">
              Você não tem permissão para acessar esta tela
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isBusy = state.isGenerating || state.isPolling;

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-brand-navy" />
          Geração de Livro Didático Adaptado
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Gere livros didáticos personalizados com linguagem e recursos adaptados às necessidades individuais do aluno.
        </p>
      </div>

      {state.errorView && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 flex items-start justify-between gap-3 shadow-sm">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium">{state.errorView.message}</p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={actions.clearError}
            className="text-red-700 hover:text-red-900 hover:bg-red-100 h-7 text-xs px-2"
          >
            Fechar
          </Button>
        </div>
      )}

      {/* Barra de progresso do Job */}
      {(state.jobStatus || state.isPolling) && (
        <BarraProgresso
          status={state.jobStatus?.status || "QUEUED"}
          progress={state.jobStatus?.progress || 0}
          currentStep={state.jobStatus?.current_step}
          pdfUrl={state.jobStatus?.pdf_url}
          errorMessage={state.jobStatus?.error_message}
        />
      )}

      {/* Rascunho pronto para revisão (Modo draft_first) */}
      {state.isDraftReady && state.bookId && (
        <div className="p-5 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 flex items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <Edit3 className="h-6 w-6 text-amber-700 shrink-0" />
            <div>
              <h4 className="font-semibold text-sm">
                Rascunho de texto pronto para revisão!
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                Você pode revisar, editar e reordenar os capítulos antes da aprovação final para geração de imagens e PDF.
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={() => router.push(`/livros/${state.bookId}/rascunho`)}
            className="bg-brand-navy hover:bg-brand-navy/90 text-white font-medium text-xs shrink-0"
          >
            Revisar Rascunho
          </Button>
        </div>
      )}

      {/* Formulário de Geração */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800">
            Parâmetros do Livro
          </CardTitle>
          <CardDescription className="text-xs text-gray-500">
            Preencha os campos abaixo para orientar a inteligência pedagógica do NeckBook na confecção do livro.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <SeletorAluno
            selectedStudentId={state.form.studentId}
            onSelectStudent={actions.setStudentId}
            error={state.fieldErrors.studentId}
            disabled={isBusy}
          />

          <SeletorDisciplina
            value={state.form.disciplina}
            onChange={actions.setDisciplina}
            error={state.fieldErrors.disciplina}
            disabled={isBusy}
          />

          <ListaInteresses
            interesses={state.form.interesses}
            onAddInteresse={actions.addInteresse}
            onRemoveInteresse={actions.removeInteresse}
            disabled={isBusy}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CampoNumCapitulos
              value={state.form.numCapitulos}
              onChange={actions.setNumCapitulos}
              error={state.fieldErrors.numCapitulos}
              disabled={isBusy}
            />

            <CampoExerciciosPorCapitulo
              value={state.form.exerciciosPorCapitulo}
              onChange={actions.setExerciciosPorCapitulo}
              error={state.fieldErrors.exerciciosPorCapitulo}
              disabled={isBusy}
            />
          </div>

          <CampoEstiloVisual
            value={state.form.estiloVisual}
            onChange={actions.setEstiloVisual}
            disabled={isBusy}
          />

          <CheckboxSuporteCaa
            checked={state.form.suporteCaa}
            onCheckedChange={actions.setSuporteCaa}
            disabled={isBusy}
          />

          <SeletorModoGeracao
            value={state.form.mode}
            onChange={actions.setMode}
            error={state.fieldErrors.mode}
            disabled={isBusy}
          />

          <div className="pt-4 border-t flex justify-end">
            <Button
              type="button"
              disabled={isBusy}
              onClick={actions.gerar}
              className="bg-brand-navy hover:bg-brand-navy/90 text-white font-medium px-8 py-2.5 h-auto text-sm shadow-sm"
            >
              {state.isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Disparando geração...
                </>
              ) : (
                <>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Gerar Livro
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
