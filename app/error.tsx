"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BrandLogo } from "@/components/brand/brand-logo";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Unhandled application error:", error);
  }, [error]);

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 min-h-[70vh]">
      <div className="mb-6">
        <BrandLogo bg="light" width={180} />
      </div>
      <Card className="w-full max-w-md shadow-lg border-slate-100">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600 animate-pulse" />
          </div>
          <CardTitle className="text-2xl text-slate-800 font-bold">
            Ocorreu um Erro Inesperado
          </CardTitle>
          <CardDescription className="text-slate-500">
            Lamentamos o inconveniente. Nossa equipe foi notificada.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-slate-600 px-6 pb-6">
          Você pode tentar recarregar a página ou voltar para a página inicial.
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-2 pt-2">
          <Button
            onClick={() => reset()}
            variant="outline"
            className="w-full sm:w-auto gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Tentar Novamente
          </Button>
          <Link href="/dashboard" passHref legacyBehavior>
            <Button className="w-full sm:w-auto bg-brand-navy hover:bg-blue-800 text-white gap-2">
              <Home className="h-4 w-4" />
              Início
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
