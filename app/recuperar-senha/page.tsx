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
import { useToast } from "@/hooks/use-toast";
import { BrandLogo } from "@/components/brand/brand-logo";
import { AlertCircle, ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Email form, 2: Email sent, 3: Error
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulação de verificação de email - em produção, isso seria uma chamada de API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Simulamos que o email existe no sistema
      if (email.includes("@")) {
        setStep(2); // Email enviado com sucesso
        toast({
          title: "Email enviado",
          description:
            "Verifique sua caixa de entrada para redefinir sua senha",
          variant: "success",
        });
      } else {
        setStep(3); // Erro - email não encontrado
        toast({
          variant: "destructive",
          title: "Email não encontrado",
          description: "Não encontramos uma conta com este email",
        });
      }
    } catch (error) {
      setStep(3); // Erro genérico
      toast({
        variant: "destructive",
        title: "Erro ao processar solicitação",
        description: "Ocorreu um erro ao tentar recuperar sua senha",
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
            <BrandLogo bg="light" width={180} priority />
          </div>
          <CardTitle className="text-2xl text-center">
            Recuperação de Senha
          </CardTitle>
          <CardDescription className="text-center">
            {step === 1 &&
              "Digite seu email para receber um link de recuperação de senha"}
            {step === 2 && "Email enviado com sucesso"}
            {step === 3 && "Não foi possível recuperar a senha"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Enviando..." : "Enviar link de recuperação"}
              </Button>
            </form>
          )}

          {step === 2 && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">
                Email enviado com sucesso!
              </AlertTitle>
              <AlertDescription className="text-green-700">
                Enviamos um link de recuperação para {email}. Por favor,
                verifique sua caixa de entrada e siga as instruções para
                redefinir sua senha.
              </AlertDescription>
            </Alert>
          )}

          {step === 3 && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Erro ao recuperar senha</AlertTitle>
              <AlertDescription>
                Não foi possível encontrar uma conta com o email informado.
                Verifique se o email está correto ou entre em contato com o
                suporte.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center">
            <Button variant="link" asChild>
              <Link href="/login" className="flex items-center text-blue-600">
                <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o login
              </Link>
            </Button>
          </div>
          <div className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Singular System
          </div>
        </CardFooter>
      </Card>

      {/* Simulação do email enviado - apenas para demonstração */}
      {step === 2 && (
        <div className="fixed bottom-4 right-4 max-w-md bg-white rounded-lg shadow-lg border p-4 animate-in slide-in-from-right">
          <div className="flex items-center gap-2 mb-2">
            <Mail className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium">Simulação do Email Enviado</h3>
          </div>
          <div className="text-sm text-gray-700 space-y-2">
            <p>Assunto: Recuperação de Senha - Singular System</p>
            <p>Para: {email}</p>
            <div className="border-t pt-2 mt-2">
              <p>Olá,</p>
              <p className="my-2">
                Recebemos uma solicitação para redefinir sua senha no Singular
                System.
              </p>
              <div className="bg-blue-50 p-2 rounded my-2 text-center">
                <Link
                  href="/recuperar-senha/redefinir"
                  className="text-blue-600 font-medium hover:underline"
                >
                  Clique aqui para redefinir sua senha
                </Link>
              </div>
              <p className="my-2">
                Se você não solicitou esta alteração, ignore este email.
              </p>
              <p>Atenciosamente,</p>
              <p>Equipe Singular System</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
