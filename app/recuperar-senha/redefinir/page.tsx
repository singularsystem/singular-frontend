"use client";
export const dynamic = "force-dynamic";
import type React from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RedefinirSenha() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [step, setStep] = useState(1); // 1: Form, 2: Success
  const router = useRouter();
  const { toast } = useToast();

  // Função para calcular a força da senha
  const calculatePasswordStrength = (password: string) => {
    let strength = 0;

    if (password.length >= 8) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    if (password.match(/[^A-Za-z0-9]/)) strength += 25;

    return strength;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordStrength(calculatePasswordStrength(newPassword));
  };

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

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Senhas não coincidem",
        description: "A senha e a confirmação devem ser iguais",
      });
      return;
    }

    if (passwordStrength < 50) {
      toast({
        variant: "destructive",
        title: "Senha muito fraca",
        description: "Por favor, escolha uma senha mais forte",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Simulação de redefinição de senha - em produção, isso seria uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setStep(2); // Senha redefinida com sucesso
      toast({
        title: "Senha redefinida com sucesso",
        description:
          "Sua senha foi alterada. Você já pode fazer login com a nova senha.",
        variant: "success",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao redefinir senha",
        description: "Ocorreu um erro ao tentar redefinir sua senha",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <img src="/logo.png" alt="Logo IPAAGS" className="h-12 w-auto" />
          </div>
          <CardTitle className="text-2xl text-center">
            {step === 1 ? "Redefinir Senha" : "Senha Redefinida"}
          </CardTitle>
          <CardDescription className="text-center">
            {step === 1
              ? "Crie uma nova senha segura para sua conta"
              : "Sua senha foi alterada com sucesso"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nova Senha</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    className="pr-10"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {password && (
                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between items-center text-xs">
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

                    <ul className="text-xs space-y-1 mt-2 text-gray-600">
                      <li
                        className={`flex items-center gap-1 ${
                          password.length >= 8 ? "text-green-600" : ""
                        }`}
                      >
                        {password.length >= 8 ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <AlertCircle className="h-3 w-3" />
                        )}
                        Mínimo de 8 caracteres
                      </li>
                      <li
                        className={`flex items-center gap-1 ${
                          password.match(/[A-Z]/) ? "text-green-600" : ""
                        }`}
                      >
                        {password.match(/[A-Z]/) ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <AlertCircle className="h-3 w-3" />
                        )}
                        Pelo menos uma letra maiúscula
                      </li>
                      <li
                        className={`flex items-center gap-1 ${
                          password.match(/[0-9]/) ? "text-green-600" : ""
                        }`}
                      >
                        {password.match(/[0-9]/) ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <AlertCircle className="h-3 w-3" />
                        )}
                        Pelo menos um número
                      </li>
                      <li
                        className={`flex items-center gap-1 ${
                          password.match(/[^A-Za-z0-9]/) ? "text-green-600" : ""
                        }`}
                      >
                        {password.match(/[^A-Za-z0-9]/) ? (
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
                <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {password &&
                  confirmPassword &&
                  password !== confirmPassword && (
                    <p className="text-xs text-red-500 mt-1">
                      As senhas não coincidem
                    </p>
                  )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Redefinindo..." : "Redefinir Senha"}
              </Button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <Alert className="bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">
                  Senha redefinida com sucesso!
                </AlertTitle>
                <AlertDescription className="text-green-700">
                  Sua senha foi alterada. Você já pode fazer login com a nova
                  senha.
                </AlertDescription>
              </Alert>

              <div className="flex justify-center">
                <Button asChild>
                  <Link href="/login">Ir para o Login</Link>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          {step === 1 && (
            <div className="text-center">
              <Button variant="link" asChild>
                <Link
                  href="/recuperar-senha"
                  className="flex items-center text-blue-600"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                </Link>
              </Button>
            </div>
          )}
          <div className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Instituto Piauiense de Assistência,
            Auditoria e Gestão em Saúde
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
