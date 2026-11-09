"use client";

import { useEscolaForm } from "../../hooks/escolas/useEscolaForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useFetchCitiesByUf } from "@/hooks/useFetchCitiesByUf";
import { useFetchPrincipalsByCity } from "@/hooks/useFetchUsers";
import { estados } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save } from "lucide-react";

interface EscolaFormScreenProps {
  id?: string;
}

export function EscolaFormScreen({ id }: EscolaFormScreenProps) {
  const isEdit = !!id;
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  const { state: formState, updateFields, submit } = useEscolaForm(id);

  const {
    cities,
    error: fetchCitiesError,
    loading: fetchCitiesLoading,
  } = useFetchCitiesByUf(formState.state ? formState.state : null);

  const {
    principals,
    error: fetchPrincipalsError,
    loading: fetchPrincipalsLoading,
  } = useFetchPrincipalsByCity(formState.city ? formState.city : null);

  useEffect(() => {
    if (formState.error) {
      toast({
        title: isEdit ? "Erro ao editar escola" : "Erro ao cadastrar escola",
        description: formState.error,
        variant: "destructive",
      });
    }
  }, [formState.error, toast, isEdit]);

  useEffect(() => {
    if (formState.success) {
      toast({
        title: isEdit ? "Escola atualizada com sucesso" : "Escola cadastrada com sucesso",
        description: isEdit ? "Os dados foram atualizados no sistema." : "A escola foi cadastrada no sistema.",
        variant: "success",
      });
      router.push("/escolas");
    }
  }, [formState.success, toast, router, isEdit]);

  useEffect(() => {
    if (fetchCitiesError) {
      toast({
        title: "Erro ao buscar cidades",
        description: fetchCitiesError.message || "Não foi possível carregar as cidades.",
        variant: "destructive",
      });
    }
  }, [fetchCitiesError, toast]);

  useEffect(() => {
    if (fetchPrincipalsError) {
      toast({
        title: "Erro ao buscar diretores",
        description: fetchPrincipalsError.message || "Não foi possível carregar os diretores.",
        variant: "destructive",
      });
    }
  }, [fetchPrincipalsError, toast]);

  // Checagem de permissões
  useEffect(() => {
    if (!user) return;
    const roles = user.roles.map((r) => r.toLowerCase());
    const canCreate = roles.includes("admin") || roles.includes("secretary");
    const canEdit = roles.includes("admin") || roles.includes("secretary") || roles.includes("principal");

    if (isEdit && !canEdit) {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você não tem permissão para editar escolas.",
      });
      router.push("/escolas");
    } else if (!isEdit && !canCreate) {
      toast({
        variant: "destructive",
        title: "Acesso negado",
        description: "Você não tem permissão para cadastrar escolas.",
      });
      router.push("/escolas");
    }
  }, [user, router, toast, isEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFields({ [e.target.id]: e.target.value });
  };

  const handleSelectChange = (field: string, value: string) => {
    updateFields({ [field]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit(isEdit);
  };

  if (formState.isLoading) {
    return (
      <main className="flex-1 p-6 md:p-8 bg-slate-50/50 space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-48 bg-gray-200 animate-pulse" />
            <Skeleton className="h-10 w-24 bg-gray-200 animate-pulse" />
          </div>
          <Card className="shadow-sm border border-slate-100 rounded-2xl p-8 space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-32 bg-gray-200 animate-pulse" />
              <Skeleton className="h-10 w-full bg-gray-200 animate-pulse" />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24 bg-gray-200 animate-pulse" />
                  <Skeleton className="h-10 w-full bg-gray-200 animate-pulse" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6 md:p-8 bg-slate-50/50 space-y-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Escolas</span>
            <h1 className="text-3xl font-bold tracking-tight text-[#111C4E]">
              {isEdit ? "Editar Escola" : "Cadastro de Escola"}
            </h1>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowConfirm(true)}
            className="rounded-xl border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-all flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Cancelar
          </Button>
        </div>

        <Card className="shadow-sm border border-slate-100 rounded-2xl bg-white overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-50">
            <CardTitle className="text-lg font-bold text-[#111C4E]">Informações da Escola</CardTitle>
            <CardDescription className="text-slate-500 text-sm">
              {isEdit
                ? "Atualize as informações cadastrais e responsáveis da instituição."
                : "Preencha todos os dados da escola para cadastrar no sistema."}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form id="escola-form" onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Nome da Escola
                </Label>
                <Input
                  id="name"
                  placeholder="Ex: Escola Municipal Marechal Deodoro"
                  className="h-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500 transition-all"
                  value={formState.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Estado (UF)
                  </Label>
                  <Select
                    value={formState.state}
                    onValueChange={(value) => handleSelectChange("state", value)}
                  >
                    <SelectTrigger id="state" className="h-11 rounded-xl border-slate-200">
                      <SelectValue placeholder="Selecione o Estado" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {estados.map((est) => (
                        <SelectItem key={est.sigla} value={est.nome} className="rounded-lg">
                          {est.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Cidade
                  </Label>
                  <Select
                    value={formState.city}
                    onValueChange={(value) => handleSelectChange("city", value)}
                    disabled={!formState.state || fetchCitiesLoading}
                  >
                    <SelectTrigger id="city" className="h-11 rounded-xl border-slate-200">
                      <SelectValue placeholder={fetchCitiesLoading ? "Carregando..." : "Selecione a Cidade"} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.nome} className="rounded-lg">
                          {city.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="principalID" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Diretor(a) Responsável
                  </Label>
                  <Select
                    value={formState.principalID}
                    onValueChange={(value) => handleSelectChange("principalID", value)}
                    disabled={!formState.city || fetchPrincipalsLoading}
                  >
                    <SelectTrigger id="principalID" className="h-11 rounded-xl border-slate-200">
                      <SelectValue placeholder={fetchPrincipalsLoading ? "Carregando..." : "Selecione o Diretor(a)"} />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {principals && principals.length > 0 ? (
                        principals.map((principal) => (
                          <SelectItem key={principal.id} value={principal.id} className="rounded-lg">
                            {principal.fullName}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-3 text-sm text-slate-400 text-center">
                          Nenhum diretor(a) encontrado neste município
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className="p-8 border-t border-slate-50 bg-slate-50/50 flex justify-end">
            <Button
              type="submit"
              form="escola-form"
              className="bg-[#111C4E] hover:bg-blue-800 text-white font-medium rounded-xl h-11 px-6 flex items-center gap-2"
              disabled={formState.isSaving}
            >
              {formState.isSaving ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isEdit ? "Salvar Alterações" : "Cadastrar Escola"}
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        actionDescription={isEdit ? "edição de escola" : "cadastro de nova escola"}
        actionName={isEdit ? "edição" : "cadastro"}
        route="/escolas"
      />
    </main>
  );
}
