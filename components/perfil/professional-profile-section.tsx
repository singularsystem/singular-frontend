"use client";

import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useIssuerProfileViewModel } from "@/source/view-model/perfil/useIssuerProfileViewModel";
import { Loader2, Save, Upload, AlertCircle, CheckCircle2 } from "lucide-react";

interface ProfessionalProfileSectionProps {
  token: string | null;
}

export function ProfessionalProfileSection({ token }: ProfessionalProfileSectionProps) {
  const {
    displayName,
    setDisplayName,
    professionalRegistration,
    setProfessionalRegistration,
    phone,
    setPhone,
    email,
    setEmail,
    logoPreviewUrl,
    handleFileChange,
    saveProfile,
    isLoading,
    isSaving,
    errorMessage,
    successMessage,
  } = useIssuerProfileViewModel(token);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await saveProfile();
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Dados Profissionais e Logotipo do Emissor</CardTitle>
        <CardDescription>
          Configure os dados que serão exibidos no cabeçalho oficial dos relatórios e documentos PDF emitidos.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2 p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Nome Profissional ou da Instituição *</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Ex.: Dra. Maria Silva / Clínica Especializada"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="professionalRegistration">Registro Profissional (opcional)</Label>
              <Input
                id="professionalRegistration"
                value={professionalRegistration}
                onChange={(e) => setProfessionalRegistration(e.target.value)}
                placeholder="Ex.: CRP 06/12345, CRM 98765"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuerPhone">Telefone de Contato (opcional)</Label>
              <Input
                id="issuerPhone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="issuerEmail">E-mail Profissional (opcional)</Label>
              <Input
                id="issuerEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contato@profissional.com.br"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t">
            <Label htmlFor="issuerLogo">Logotipo Personalizado (PNG ou JPEG, máx. 2MB, mín. 300px)</Label>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-1 w-full">
                <Input
                  id="issuerLogo"
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    handleFileChange(file);
                  }}
                />
              </div>

              {logoPreviewUrl && (
                <div className="flex items-center gap-2 border p-2 rounded-md bg-white">
                  <span className="text-xs text-muted-foreground">Pré-visualização:</span>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logoPreviewUrl}
                    alt="Pré-visualização do logotipo"
                    className="max-h-12 max-w-[140px] object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2">
          <Button
            type="submit"
            disabled={isLoading || isSaving || !displayName.trim()}
            className="bg-brand-navy hover:bg-brand-navy/90 text-white"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Dados Profissionais
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
