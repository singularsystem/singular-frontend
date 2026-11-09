import Link from "next/link";
import { Compass, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 min-h-[70vh]">
      <Card className="w-full max-w-md shadow-lg border-slate-100">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
            <Compass className="h-8 w-8 text-blue-600 animate-pulse" />
          </div>
          <CardTitle className="text-2xl text-slate-800 font-bold">
            Página Não Encontrada
          </CardTitle>
          <CardDescription className="text-slate-500">
            A rota que você tentou acessar não existe ou foi removida.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-slate-600 px-6 pb-6">
          Por favor, verifique se o endereço digitado está correto ou se o recurso foi movido temporariamente.
        </CardContent>
        <CardFooter className="flex justify-center pt-2">
          <Link href="/dashboard" passHref legacyBehavior>
            <Button className="w-full sm:w-auto bg-[#111C4E] hover:bg-blue-800 text-white gap-2">
              <Home className="h-4 w-4" />
              Ir para o Início
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
