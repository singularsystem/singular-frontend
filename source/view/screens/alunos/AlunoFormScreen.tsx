"use client";

import { useAlunoForm } from "../../hooks/alunos/useAlunoForm";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { Separator } from "@/components/ui/separator";
import { estados, maritalStatus, skinColor } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useFetchCitiesByUf } from "@/hooks/useFetchCitiesByUf";
import { useFetchSchoolsByCity } from "@/hooks/useFetchSchools";
import { useAuth } from "@/contexts/auth-context";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { User, GraduationCap, FileText, ArrowLeft } from "lucide-react";

export function AlunoFormScreen() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const { state, updateField, submit } = useAlunoForm();
  const [showConfirm, setShowConfirm] = useState(false);
  const isSecretary = user?.roles?.includes("Secretary");

  const [uf, setUf] = useState("");
  const [schoolUF, setschoolUF] = useState("");
  const { cities, loading: loadingCities } = useFetchCitiesByUf(uf);
  const { schools, loading: loadingSchools } = useFetchSchoolsByCity(
    state.formData.schoolCity,
    state.formData.schoolState
  );
  const { cities: schoolCities, loading: loadingSchoolCities } = useFetchCitiesByUf(schoolUF);

  useEffect(() => {
    if (state.isSuccess) {
      toast({
        title: "Sucesso!",
        description: "Aluno cadastrado com sucesso.",
        variant: "success",
      });
      router.push("/alunos");
    }
  }, [state.isSuccess, router, toast]);

  useEffect(() => {
    if (state.error) {
      toast({
        title: "Erro",
        description: state.error,
        variant: "destructive",
      });
    }
  }, [state.error, toast]);

  useEffect(() => {
    if (user && isSecretary) {
      updateField("schoolCity", user.city || "");
      updateField("schoolState", user.state || "");
      updateField("city", user.city || "");
      updateField("state", user.state || "");
      setUf(user.state || "");
      setschoolUF(user.state || "");
    }
  }, [user, isSecretary]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await submit();
  };

  return (
    <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#111C4E]">Cadastro de Aluno</h1>
            <p className="text-muted-foreground">Preencha todas as informações abaixo para registrar o novo aluno.</p>
          </div>
        </div>
        <Button variant="outline" onClick={() => setShowConfirm(true)}>
          Cancelar
        </Button>
      </div>

      <form id="cadastro-aluno-form" onSubmit={handleSubmit} className="space-y-8">
        {/* Dados Pessoais */}
        <Card className="border-l-4 border-l-blue-600 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 text-blue-600 mb-1">
              <User className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-wider">Seção 01</span>
            </div>
            <CardTitle className="text-2xl">Dados Pessoais</CardTitle>
            <CardDescription>Informações básicas e de identificação do aluno.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo</Label>
                <Input
                  id="fullName"
                  placeholder="Nome completo do aluno"
                  value={state.formData.fullName}
                  onChange={(e) => updateField("fullName", e.target.value)}
                  required
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sex">Sexo</Label>
                <Select
                  value={state.formData.sex}
                  onValueChange={(v) => updateField("sex", v)}
                >
                  <SelectTrigger id="sex" className="h-10">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Data de Nascimento</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={state.formData.dateOfBirth}
                  onChange={(e) => updateField("dateOfBirth", e.target.value)}
                  required
                  className="h-10"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="nameOfPersonResponsible">Nome dos Pais / Responsáveis</Label>
                <Input
                  id="nameOfPersonResponsible"
                  placeholder="Nome dos pais ou responsáveis legais"
                  value={state.formData.nameOfPersonResponsible}
                  onChange={(e) => updateField("nameOfPersonResponsible", e.target.value)}
                  required
                  className="h-10"
                />
              </div>
            </div>

            <Separator className="my-4" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="state">Estado (Residência)</Label>
                <Combobox
                  options={estados.map((estado) => ({ value: estado.nome, label: estado.nome }))}
                  value={state.formData.state || uf}
                  onValueChange={(v) => {
                    setUf(v);
                    updateField("state", v);
                  }}
                  placeholder="Selecione..."
                  searchPlaceholder="Buscar estado..."
                />
              </div>
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="city">Cidade (Residência)</Label>
                <Combobox
                  options={cities.map((city) => ({ value: city.nome, label: city.nome }))}
                  value={state.formData.city}
                  onValueChange={(v) => updateField("city", v)}
                  disabled={!uf || loadingCities}
                  placeholder={loadingCities ? "Carregando..." : "Selecione..."}
                  searchPlaceholder="Buscar cidade..."
                />
              </div>
              <div className="space-y-2 md:col-span-1">
                <Label htmlFor="address">Endereço Completo</Label>
                <Input
                  id="address"
                  placeholder="Rua, número, bairro..."
                  value={state.formData.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  required
                  className="h-10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="skinColor">Cor da Pele</Label>
                <Select
                  key={state.formData.skinColor}
                  value={state.formData.skinColor}
                  onValueChange={(v) => updateField("skinColor", v)}
                >
                  <SelectTrigger id="skinColor" className="h-10">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {skinColor.map((color, index) => (
                      <SelectItem key={index} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maritalStatusParents">Estado Civil dos Pais</Label>
                <Select
                  key={state.formData.maritalStatusParents}
                  value={state.formData.maritalStatusParents}
                  onValueChange={(v) => updateField("maritalStatusParents", v)}
                >
                  <SelectTrigger id="maritalStatusParents" className="h-10">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {maritalStatus.map((status, index) => (
                      <SelectItem key={index} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados Escolares */}
        <Card className="border-l-4 border-l-green-600 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 text-green-600 mb-1">
              <GraduationCap className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-wider">Seção 02</span>
            </div>
            <CardTitle className="text-2xl">Dados Escolares</CardTitle>
            <CardDescription>Informações sobre a unidade de ensino e série atual.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="schoolUF">Estado da Escola</Label>
                <Combobox
                  options={estados.map((est) => ({ value: est.nome, label: est.nome }))}
                  value={state.formData.schoolState || schoolUF}
                  onValueChange={(v) => {
                    setschoolUF(v);
                    updateField("schoolState", v);
                  }}
                  placeholder="Selecione..."
                  searchPlaceholder="Buscar estado..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schoolCity">Município da Escola</Label>
                <Combobox
                  options={schoolCities.map((city) => ({ value: city.nome, label: city.nome }))}
                  value={state.formData.schoolCity}
                  onValueChange={(v) => updateField("schoolCity", v)}
                  disabled={!schoolUF || loadingSchoolCities}
                  placeholder={loadingSchoolCities ? "Carregando..." : "Selecione..."}
                  searchPlaceholder="Buscar município..."
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="schoolName">Unidade Escolar</Label>
                <Combobox
                  options={schools?.map((school) => ({ value: school.name, label: school.name })) || []}
                  value={state.formData.schoolName}
                  onValueChange={(v) => {
                    const school = schools?.find(s => s.name === v);
                    updateField("schoolName", v);
                    if (school) updateField("schoolID", school.id);
                  }}
                  disabled={!state.formData.schoolCity || loadingSchools}
                  placeholder={loadingSchools ? "Carregando..." : "Selecione..."}
                  searchPlaceholder="Buscar unidade escolar..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="serie">Série</Label>
                <Select
                  key={state.formData.serie}
                  value={state.formData.serie}
                  onValueChange={(v) => updateField("serie", v)}
                >
                  <SelectTrigger id="serie" className="h-10">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {[
                      "Educação Infantil", "1º Ano", "2º Ano", "3º Ano", "4º Ano", "5º Ano",
                      "6º Ano", "7º Ano", "8º Ano", "9º Ano",
                      "1º Ano - Ensino Médio", "2º Ano - Ensino Médio", "3º Ano - Ensino Médio"
                    ].map(s => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Documentos */}
        <Card className="border-l-4 border-l-purple-600 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2 text-purple-600 mb-1">
              <FileText className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-wider">Seção 03</span>
            </div>
            <CardTitle className="text-2xl">Documentos</CardTitle>
            <CardDescription>Identificação oficial do aluno.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="susCard">Cartão SUS</Label>
                <Input
                  id="susCard"
                  placeholder="000 0000 0000 000"
                  value={state.formData.susCard}
                  onChange={(e) => updateField("susCard", e.target.value)}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rg">RG</Label>
                <Input
                  id="rg"
                  placeholder="0.000.000"
                  value={state.formData.rg}
                  onChange={(e) => updateField("rg", e.target.value)}
                  className="h-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                value={state.formData.cpf}
                onChange={(e) => updateField("cpf", e.target.value)}
                className="h-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Ações Finais */}
        <div className="flex items-center justify-end gap-4 pb-12">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => setShowConfirm(true)}
            disabled={state.isLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="cadastro-aluno-form"
            size="lg"
            className="bg-[#111C4E] hover:bg-blue-800 px-8 shadow-md text-white"
            disabled={state.isLoading}
          >
            {state.isLoading ? "Cadastrando..." : "Finalizar Cadastro"}
          </Button>
        </div>
      </form>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        actionDescription="cadastro de novo aluno"
        actionName="cadastro"
        route="/alunos"
      />
    </main>
  );
}
