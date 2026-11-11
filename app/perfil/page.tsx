"use client";
export const dynamic = "force-dynamic";
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
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2, Lock, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ProfessionalProfileSection } from "@/components/perfil/professional-profile-section";

export default function Perfil() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const { user, token, isLoading: authLoading, fetchUser } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const [formData, setFormData] = useState({
    id: undefined as string | undefined,
    email: "",
    fullName: "",
    address: "",
    city: "",
    schoolName: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!authLoading && user) {
      setFormData({
        id: user.id,
        email: user.email || "",
        fullName: user.fullName || "",
        address: user.address || "",
        city: user.city || "",
        schoolName: user.schoolName || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [authLoading, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiUrl) {
      toast({
        title: "Configuração inválida",
        description: "URL da API não está configurada.",
        variant: "destructive",
      });
      return;
    }

    if (!token) {
      toast({
        title: "Erro de autenticação",
        description: "Token não disponível",
        variant: "destructive",
      });
      return;
    }

    if (!formData.id) {
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível identificar o usuário.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (isChangingPassword) {
        if (!formData.currentPassword) {
          toast({
            variant: "destructive",
            title: "Senha atual obrigatória",
            description: "Informe sua senha atual para continuar.",
          });
          return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
          toast({
            variant: "destructive",
            title: "Erro ao atualizar perfil",
            description: "As senhas não coincidem",
          });
          setIsLoading(false);
          return;
        }

        if (formData.newPassword.length < 6) {
          toast({
            variant: "destructive",
            title: "Senha muito curta",
            description: "A nova senha deve ter pelo menos 6 caracteres",
          });
          setIsLoading(false);
          return;
        }

        const response = await fetch(`${apiUrl}/api/v1/users/reset-password`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: formData.id,
            currentPassword: formData.currentPassword,
            newPassword: formData.newPassword,
            confirmNewPassword: formData.confirmPassword,
          }),
        });

        const result = await response.json().catch(() => ({}));

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Falha ao atualizar a senha");
        }

        toast({
          title: "Senha atualizada",
          description: "Sua senha foi alterada com sucesso.",
          variant: "success",
        });

        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        setIsChangingPassword(false);
        await fetchUser(token);
        router.refresh();
        return;
      }

      const dataToSend = {
        id: formData.id,
        email: formData.email,
        fullName: formData.fullName,
        address: formData.address,
        city: formData.city,
      };

      const response = await fetch(`${apiUrl}/api/v1/users`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || "Falha ao atualizar dados do usuário",
        );
      }

      const result = await response.json();

      if (result.success) {
        toast({
          title: "Perfil atualizado",
          description: "Dados do perfil atualizados com sucesso",
          variant: "success",
        });

        await fetchUser(token);
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao atualizar perfil",
          description: result.message || "Erro desconhecido",
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro na requisição",
        description: error.message || "Erro inesperado",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChangePassword = () => {
    setIsChangingPassword(!isChangingPassword);
    // Limpar campos de senha ao cancelar
    if (isChangingPassword) {
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    }
  };

  // Verificar permissões apenas quando o usuário estiver carregado
  const isSuporte = !authLoading && user?.roles?.[0]?.toLowerCase() === "admin";

  if (authLoading) {
    return (
      <main className="flex-1 p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando perfil...</span>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-brand-navy">
            Perfil não encontrado
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-brand-navy">
          Meu Perfil
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Visualize e atualize suas informações de perfil
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-brand-navy" htmlFor="fullName">
                    Nome Completo
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    disabled={!isSuporte}
                    className={!isSuporte ? "bg-gray-50" : ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-brand-navy" htmlFor="email">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-brand-navy" htmlFor="sex">
                    Sexo
                  </Label>
                  <Input
                    id="sex"
                    value={
                      user.sex === "Masculino"
                        ? "Masculino"
                        : user.sex === "Feminino"
                          ? "Feminino"
                          : "Outro"
                    }
                    disabled={true}
                    className="bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-brand-navy" htmlFor="dateOfBirth">
                    Data de Nascimento
                  </Label>
                  <Input
                    id="dateOfBirth"
                    value={user.formattedDateOfBirth || ""}
                    disabled={true}
                    className="bg-gray-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-brand-navy" htmlFor="address">
                  Endereço
                </Label>
                <Input
                  id="address"
                  value={formData.address}
                  disabled={!isSuporte}
                  className={!isSuporte ? "bg-gray-50" : ""}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-brand-navy" htmlFor="city">
                    Município
                  </Label>
                  <Input
                    id="city"
                    value={formData.city}
                    disabled={!isSuporte}
                    className={!isSuporte ? "bg-gray-50" : ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-brand-navy" htmlFor="userName">
                    Perfil
                  </Label>
                  <Input
                    id="userName"
                    value={user.userName || ""}
                    disabled={true}
                    className="bg-gray-50"
                  />
                </div>
              </div>

              {user.schoolName && (
                <div className="space-y-2">
                  <Label className="text-brand-navy" htmlFor="schoolName">
                    Unidade Escolar
                  </Label>
                  <Input
                    id="schoolName"
                    value={formData.schoolName}
                    disabled={!isSuporte}
                    className={!isSuporte ? "bg-gray-50" : ""}
                    onChange={handleChange}
                  />
                </div>
              )}

              <div className="pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={toggleChangePassword}
                  className="gap-2"
                  disabled={isLoading}
                >
                  <Lock className="h-4 w-4" />
                  {isChangingPassword
                    ? "Cancelar Alteração de Senha"
                    : "Alterar Senha"}
                </Button>
              </div>

              {isChangingPassword && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="currentPassword">Senha Atual</Label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none absolute right-3 bottom-3"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value={formData.currentPassword}
                      onChange={handleChange}
                      required={isChangingPassword}
                      disabled={isLoading}
                      placeholder="Digite sua senha atual"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="newPassword">Nova Senha</Label>
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="text-gray-500 hover:text-gray-700 focus:outline-none absolute right-3 bottom-3"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={formData.newPassword}
                        onChange={handleChange}
                        required={isChangingPassword}
                        disabled={isLoading}
                        placeholder="Digite a nova senha"
                        minLength={6}
                      />
                    </div>
                    <div className="space-y-2 relative">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmNewPassword(!showConfirmNewPassword)
                          }
                          className="text-gray-500 hover:text-gray-700 focus:outline-none absolute right-3 bottom-3"
                        >
                          {showConfirmNewPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <Input
                        id="confirmPassword"
                        type={showConfirmNewPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required={isChangingPassword}
                        disabled={isLoading}
                        placeholder="Confirme a nova senha"
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                disabled={isLoading || authLoading}
                className="gap-2 bg-gradient-to-r from-brand-navy-light to-brand-orange"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Informações da Conta</CardTitle>
            <CardDescription>
              Detalhes sobre sua conta no sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-brand-navy">Perfil</p>
              <p className="text-sm text-muted-foreground">{user.userName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-brand-navy">
                Último Acesso
              </p>
              <p className="text-sm text-muted-foreground">
                {user.localLastLogin || "Nunca acessou"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-brand-navy">
                Status da Conta
              </p>
              <div className="flex items-center">
                <div
                  className={`h-2 w-2 rounded-full mr-2 ${
                    user.status === "Ativo"
                      ? "bg-green-500"
                      : user.status === "Pendente"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                ></div>
                <p className="text-sm text-muted-foreground">{user.status}</p>
              </div>
            </div>
            {user.roles?.[0]?.toLowerCase() === "admin" && (
              <div className="mt-6 p-3 bg-blue-50 rounded-md">
                <p className="text-sm text-blue-700">
                  <strong>Nota:</strong> Como usuário Administrador do Singular System, você tem
                  permissão para editar todos os campos do perfil.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <ProfessionalProfileSection token={token} />
      </div>
    </main>
  );
}
