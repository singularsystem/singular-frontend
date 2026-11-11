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
import { BrandLogo } from "@/components/brand/brand-logo";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { isAuthenticated, user, login, isLoading: authLoading } = useAuth();
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      router.push(user.mustChangePassword ? "/primeiro-acesso" : "/dashboard");
    }
  }, [isAuthenticated, user, router, authLoading]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica do email
    if (!email || !email.includes("@")) {
      toast({
        variant: "destructive",
        title: "Email inválido",
        description: "Por favor, insira um email válido.",
      });
      return;
    }

    // Validação básica da senha
    if (!password || password.length < 6) {
      toast({
        variant: "destructive",
        title: "Senha inválida",
        description: "A senha deve ter pelo menos 6 caracteres.",
      });
      return;
    }

    setIsLoading(true);

    const data = {
      email: email.trim(),
      password: password,
      rememberMe: rememberMe,
    };

    try {
      const response = await fetch(`${apiUrl}/api/v1/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Verificar se a resposta é JSON válido
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Resposta do servidor não é JSON válido");
      }

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Erro ao fazer login");
      }

      if (result.success) {
        const authToken: string | undefined = result?.data?.token;
        const tokenExpiration: string | undefined = result?.data?.tokenExpiration;

        if (!authToken || !tokenExpiration) {
          throw new Error("Resposta de login inválida: token ausente.");
        }

        // O endpoint de login retorna apenas token/expiração. Para evitar "dados zerados",
        // buscamos os dados completos do usuário em /users/me antes de salvar no contexto.
        const meResponse = await fetch(`${apiUrl}/api/v1/users/me`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!meResponse.ok) {
          const errorData = await meResponse.json().catch(() => ({}));
          throw new Error(
            errorData.message || "Falha ao carregar dados do usuário (me).",
          );
        }

        const meResult = await meResponse.json();
        if (!meResult?.success || !meResult?.data?.id) {
          throw new Error(
            meResult?.message || "Falha ao carregar dados do usuário (me).",
          );
        }

        const userData = {
          id: meResult.data.id,
          userName: meResult.data.userName,
          fullName: meResult.data.fullName,
          email: meResult.data.email,
          roles: meResult.data.roles ?? [],
          state: meResult.data.state,
          city: meResult.data.city,
          schoolID: meResult.data.schoolID,
          schoolName: meResult.data.schoolName,
          dateOfBirth: meResult.data.formattedDateOfBirth,
          sex: meResult.data.sex,
          age: meResult.data.age,
          address: meResult.data.address,
          lastLogin: meResult.data.lastLogin,
          localLastLogin: meResult.data.localLastLogin,
          status: meResult.data.status,
          mustChangePassword: Boolean(meResult.data.mustChangePassword),
          formattedDateOfBirth: meResult.data.formattedDateOfBirth,
        };

        login(authToken, tokenExpiration, userData);

        if (result.data.mustChangePassword) {
          toast({
            title: "Troca de senha obrigatória",
            description:
              "Antes de acessar o sistema, você precisa definir uma nova senha.",
            variant: "warning",
          });

          router.push("/primeiro-acesso");
        } else {
          toast({
            title: "Login realizado com sucesso",
            description: "Bem-vindo ao Singular System",
            variant: "success",
          });

          router.push("/dashboard");
        }
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao fazer login",
          description: result.message || "Credenciais inválidas",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer login",
        description:
          error instanceof Error
            ? error.message
            : "Ocorreu um erro ao tentar fazer login. Verifique suas credenciais e tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div
        className="flex h-screen items-center justify-center bg-brand-navy"
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto"></div>
          <p className="mt-4 text-white text-lg">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 bg-brand-navy">
      <div className="w-full flex items-center justify-between pr-2 pl-2">
        <BrandLogo bg="dark" width={180} priority />

        <nav className="flex space-x-4">
          <a
            href="/#planos"
            className="text-sm text-white/90 hover:text-brand-orange transition-colors font-medium"
          >
            Ver Planos e Preços
          </a>
        </nav>
      </div>

      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <Card className="w-full max-w-md shadow-[0_25px_50px_-12px_rgba(0,0,0,1.25)]">
          <CardHeader className="space-y-1 mb-5">
            <CardTitle className="text-2xl mt-4 text-brand-navy text-center">
              Entrar no Singular System
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Entre na sua conta para continuar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2 relative">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
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
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  className="w-4 h-4"
                  id="rememberMe"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <Label
                  htmlFor="rememberMe"
                  className="select-none text-gray-500 font-normal"
                >
                  Lembrar de mim?
                </Label>
              </div>
              <Button
                type="submit"
                className="w-full bg-brand-orange hover:bg-brand-orange-dark text-brand-navy font-semibold shadow-md"
                disabled={isLoading || authLoading}
              >
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {/* Espaço para links adicionais como "Esqueci minha senha" */}
          </CardFooter>
        </Card>
      </div>
      <div className="text-center text-xs text-white">
        © {new Date().getFullYear()} Instituto Piauiense de Assistência,
        Auditoria e Gestão em Saúde
      </div>
    </div>
  );
}
