"use client";

import { useEscolaDetails } from "../../hooks/escolas/useEscolaDetails";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useBack } from "@/hooks/use-back";
import { useAuth } from "@/contexts/auth-context";
import { useRouter } from "next/navigation";
import { ArrowLeft, Pencil, School, User, MapPin, Calendar, Users, Award } from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface EscolaDetailsScreenProps {
  id: string;
}

export function EscolaDetailsScreen({ id }: EscolaDetailsScreenProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const back = useBack("/escolas");
  const { state } = useEscolaDetails(id);

  useEffect(() => {
    if (state.error) {
      toast({
        title: "Erro ao carregar escola",
        description: state.error,
        variant: "destructive",
      });
    }
  }, [state.error, toast]);

  const userRoles = Array.isArray(user?.roles) ? user!.roles.map((r) => r.toLowerCase()) : [];
  const canEdit = userRoles.includes("admin") || userRoles.includes("secretary") || userRoles.includes("principal");

  if (state.isLoading) {
    return (
      <main className="flex-1 p-6 md:p-8 bg-slate-50/50 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48 animate-pulse bg-gray-200" />
          <Skeleton className="h-10 w-24 animate-pulse bg-gray-200" />
        </div>
        <Card className="shadow-sm border border-slate-100 rounded-2xl">
          <CardHeader className="p-8 border-b border-slate-50">
            <Skeleton className="h-7 w-64 animate-pulse bg-gray-200" />
          </CardHeader>
          <CardContent className="p-8 grid gap-8 md:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32 animate-pulse bg-gray-200" />
                <Skeleton className="h-6 w-48 animate-pulse bg-gray-200" />
              </div>
            ))}
          </CardContent>
        </Card>
      </main>
    );
  }

  if (!state.school) {
    return (
      <main className="flex-1 p-6 md:p-8 bg-slate-50/50 flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <School className="h-16 w-16 text-slate-300" />
        <h2 className="text-xl font-bold text-[#111C4E]">Escola não encontrada</h2>
        <p className="text-slate-500 text-sm">A escola solicitada não existe ou foi removida.</p>
        <Button variant="outline" onClick={back} className="flex items-center gap-2 rounded-xl">
          <ArrowLeft className="h-4 w-4" /> Voltar
        </Button>
      </main>
    );
  }

  const { school } = state;

  return (
    <main className="flex-1 p-6 md:p-8 bg-slate-50/50 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={back}
            className="h-10 w-10 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Escolas</span>
            <h1 className="text-3xl font-bold tracking-tight text-[#111C4E]">{school.name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto sm:ml-0">
          {canEdit && (
            <Button
              onClick={() => router.push(`/escolas/${school.id}/editar`)}
              variant="outline"
              className="flex items-center gap-2 border-slate-200/80 text-slate-700 hover:bg-slate-50 hover:text-slate-900 shrink-0 font-bold text-xs uppercase tracking-wider py-3 px-5 h-11 rounded-xl transition-all duration-200 shadow-sm hover:border-slate-300 active:scale-95 focus-visible:ring-2 focus-visible:ring-slate-300"
            >
              <Pencil className="h-4 w-4" />
              Editar Escola
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2 shadow-sm border border-slate-100 rounded-2xl bg-white overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center gap-3 bg-gradient-to-r from-slate-50 to-white">
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#111C4E]">
              <School className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-[#111C4E]">Informações da Escola</CardTitle>
              <p className="text-xs text-slate-500">Dados gerais e cadastro institucional</p>
            </div>
          </CardHeader>
          <CardContent className="p-8 grid gap-8 md:grid-cols-2">
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Nome Institucional</span>
              <span className="text-base font-semibold text-[#111C4E] block">{school.name}</span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Localização</span>
              <span className="text-base font-semibold text-slate-800 flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-slate-400" />
                {school.city} - {school.state}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Data de Cadastro</span>
              <span className="text-base font-semibold text-slate-800 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-400" />
                {school.createdAt ? new Date(school.createdAt).toLocaleDateString("pt-BR") : "Não cadastrado"}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Diretor Responsável</span>
              <span className="text-base font-semibold text-slate-800 flex items-center gap-1.5">
                <User className="h-4 w-4 text-slate-400" />
                {school.principalName || "Não designado"}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Status do Cadastro</span>
              <div className="flex items-center gap-2 pt-0.5">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  school.isActive
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full mr-1.5 ${school.isActive ? "bg-green-500" : "bg-red-500"}`} />
                  {school.isActive ? "Ativa" : "Desativada"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm border border-slate-100 rounded-2xl bg-white flex flex-col justify-between overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center gap-3 bg-gradient-to-r from-slate-50 to-white">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-[#111C4E]">Estatísticas de Alunos</CardTitle>
              <p className="text-xs text-slate-500">Métricas populacionais da escola</p>
            </div>
          </CardHeader>
          <CardContent className="p-8 flex-1 flex flex-col justify-center gap-8">
            <div className="flex items-center gap-4 bg-slate-50/50 rounded-2xl p-4 border border-slate-100">
              <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
                {school.totalStudents || 0}
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase block">Total de Alunos</span>
                <span className="text-sm text-slate-500">Alunos matriculados ativos</span>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-indigo-50/30 rounded-2xl p-4 border border-indigo-50">
              <div className="h-12 w-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg">
                {school.totalStudentsAEE || 0}
              </div>
              <div>
                <span className="text-xs font-semibold text-indigo-500 uppercase block">Alunos no AEE</span>
                <span className="text-sm text-slate-500">Alunos com cadastro especial</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {school.disabilities && school.disabilities.length > 0 && (
        <Card className="shadow-sm border border-slate-100 rounded-2xl bg-white overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center gap-3 bg-gradient-to-r from-slate-50 to-white">
            <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Award className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-[#111C4E]">Distribuição por Tipo de Deficiência</CardTitle>
              <p className="text-xs text-slate-500">Divisão detalhada do Atendimento Educacional Especializado (AEE)</p>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {school.disabilities.map((deficiencia, index) => (
                <div key={index} className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl hover:shadow-sm hover:border-slate-200 transition-all">
                  <div className="space-y-1">
                    <span className="text-sm font-semibold text-slate-800 block">{deficiencia.tipo}</span>
                    <span className="text-xs text-slate-500 block">Necessidade Especial</span>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center font-bold text-[#111C4E] border border-slate-100">
                    {deficiencia.quantidade}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  );
}
