"use client";
export const dynamic = "force-dynamic";

import type React from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export default function PrimeiroAcessoPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { token, user, fetchUser } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const passwordStrength = useMemo(() => {
    let strength = 0;

    if (newPassword.length >= 8) strength += 25;
    if (/[A-Z]/.test(newPassword)) strength += 25;
    if (/[0-9]/.test(newPassword)) strength += 25;
    if (/[^A-Za-z0-9]/.test(newPassword)) strength += 25;

    return strength;
  }, [newPassword]);

  const getStrengthText = () => {
    if (passwordStrength <= 25) return "Fraca";
    if (passwordStrength <= 50) return "Média";
    if (passwordStrength <= 75) return "Boa";
    return "Forte";
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500";
    if (passwordStrength <= 50) return "bg-yellow-500";
    if (passwordStrength <= 75) return "bg-blue-500";
    return "bg-green-500";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !user?.id) {
      toast({
        title: "Sessão inválida",
        description: "Não foi possível identificar o usuário logado.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "A senha e a confirmação devem ser iguais.",
        variant: "destructive",
      });
      return;
    }

    if (passwordStrength < 50) {
      toast({
        title: "Senha muito fraca",
        description: "Escolha uma senha mais forte para continuar.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const response = await fetch(`${apiUrl}/api/v1/users/reset-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: user.id,
          currentPassword: "",
          newPassword,
          confirmNewPassword: confirmPassword,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Não foi possível atualizar a senha.",
        );
      }

      await fetchUser(token);

      toast({
        title: "Senha atualizada",
        description: "Sua senha foi alterada com sucesso.",
        variant: "success",
      });

      router.replace("/dashboard");
    } catch (error) {
      toast({
        title: "Erro ao atualizar senha",
        description:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro ao tentar atualizar a senha.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary" />
          <p className="mt-4 text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <KeyRound className="h-6 w-6 text-blue-700" />
          </div>
          <CardTitle>Primeiro acesso</CardTitle>
          <CardDescription>
            Antes de entrar no sistema, defina uma nova senha para sua conta.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertTitle className="text-amber-800">
              Troca obrigatória de senha
            </AlertTitle>
            <AlertDescription className="text-amber-700">
              Por segurança, a senha padrão precisa ser substituída antes do uso
              do sistema.
            </AlertDescription>
          </Alert>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nova senha</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="pr-10"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              {newPassword && (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span>Força da senha: {getStrengthText()}</span>
                    <span
                      className={
                        passwordStrength >= 75
                          ? "text-green-600"
                          : "text-gray-500"
                      }
                    >
                      {passwordStrength}%
                    </span>
                  </div>
                  <Progress
                    value={passwordStrength}
                    className={`h-1 ${getStrengthColor()}`}
                  />

                  <ul className="mt-2 space-y-1 text-xs text-gray-600">
                    <li
                      className={`flex items-center gap-1 ${
                        newPassword.length >= 8 ? "text-green-600" : ""
                      }`}
                    >
                      {newPassword.length >= 8 ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      Mínimo de 8 caracteres
                    </li>
                    <li
                      className={`flex items-center gap-1 ${
                        /[A-Z]/.test(newPassword) ? "text-green-600" : ""
                      }`}
                    >
                      {/[A-Z]/.test(newPassword) ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      Pelo menos uma letra maiúscula
                    </li>
                    <li
                      className={`flex items-center gap-1 ${
                        /[0-9]/.test(newPassword) ? "text-green-600" : ""
                      }`}
                    >
                      {/[0-9]/.test(newPassword) ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      Pelo menos um número
                    </li>
                    <li
                      className={`flex items-center gap-1 ${
                        /[^A-Za-z0-9]/.test(newPassword)
                          ? "text-green-600"
                          : ""
                      }`}
                    >
                      {/[^A-Za-z0-9]/.test(newPassword) ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      Pelo menos um caractere especial
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
              <Input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
                required
              />
              {newPassword &&
                confirmPassword &&
                newPassword !== confirmPassword && (
                  <p className="mt-1 text-xs text-red-500">
                    As senhas não coincidem.
                  </p>
                )}
            </div>

            <Button type="submit" className="w-full" disabled={isSaving}>
              {isSaving ? "Salvando..." : "Atualizar senha e continuar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
