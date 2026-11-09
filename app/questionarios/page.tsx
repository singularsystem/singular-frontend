"use client";
export const dynamic = "force-dynamic";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { Baby, BrainCircuit, ClipboardList, Route, Smile } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Questionarios() {
  const router = useRouter();
  const { user } = useAuth();

  const handleNavigateSNAPIV = () => {
    router.push("/questionarios/snapiv");
  };

  const handleNavigateMCHATR = () => {
    router.push("/questionarios/mchatr");
  };

  const handleNavigateMCHATRF = () => {
    router.push("/questionarios/mchatrf");
  };

  const handleNavigateCarsChildhood = () => {
    router.push("/questionarios/cars-childhood");
  };

  const handleNavigateNeuropsychopedagogical = () => {
    router.push("/questionarios/neuropsicopedagogico");
  };

  return (
    <main className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-[#111C4E]">
          Questionários
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(user?.roles[0].toLowerCase() === "admin" ||
          user?.roles[0].toLowerCase() === "teacher") && (
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                Questionário SNAP IV
              </CardTitle>
              <CardDescription>
                Avaliação para Transtorno de Déficit de Atenção/Hiperatividade
              </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter>
              <Button
                className="w-full bg-[#111C4E] hover:bg-blue-800"
                onClick={handleNavigateSNAPIV}
              >
                <Route className="mr-2 h-4 w-4" />
                Selecionar
              </Button>
            </CardFooter>
          </Card>
        )}

        {(user?.roles[0].toLowerCase() === "admin" ||
          user?.roles[0].toLowerCase() === "teacher") && (
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BrainCircuit className="w-5 h-5" />
                Questionário Neuropsicopedagógico
              </CardTitle>
              <CardDescription>Avaliação neuropsicopedagógica</CardDescription>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter>
              <Button
                className="w-full bg-[#111C4E] hover:bg-blue-800"
                onClick={handleNavigateNeuropsychopedagogical}
              >
                <Route className="mr-2 h-4 w-4" />
                Selecionar
              </Button>
            </CardFooter>
          </Card>
        )}
        {(user?.roles[0].toLowerCase() === "admin" ||
          user?.roles[0].toLowerCase() === "psychologist" ||
          user?.roles[0].toLowerCase() === "psychopedagogue") && (
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smile className="w-5 h-5" />
                Questionário CARS Childhood
              </CardTitle>
              <CardDescription>
                Escala de Avaliação do Autismo na Infância
              </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter>
              <Button
                className="w-full bg-[#111C4E] hover:bg-blue-800"
                onClick={handleNavigateCarsChildhood}
              >
                <Route className="mr-2 h-4 w-4" />
                Selecionar
              </Button>
            </CardFooter>
          </Card>
        )}

        {(user?.roles[0].toLowerCase() === "admin" ||
          user?.roles[0].toLowerCase() === "psychologist" ||
          user?.roles[0].toLowerCase() === "psychopedagogue") && (
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Baby className="w-5 h-5" />
                Questionário M-CHAT-R
              </CardTitle>
              <CardDescription>
                Lista de Verificação Modificada para Autismo em Crianças
              </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter>
              <Button
                className="w-full bg-[#111C4E] hover:bg-blue-800"
                onClick={handleNavigateMCHATR}
              >
                <Route className="mr-2 h-4 w-4" />
                Selecionar
              </Button>
            </CardFooter>
          </Card>
        )}

        {(user?.roles[0].toLowerCase() === "admin" ||
          user?.roles[0].toLowerCase() === "psychologist" ||
          user?.roles[0].toLowerCase() === "psychopedagogue") && (
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Baby className="w-5 h-5" />
                Questionário M-CHAT-R/F
              </CardTitle>
              <CardDescription>
                Lista de Consulta de Seguimento para Autismo em Crianças
              </CardDescription>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter>
              <Button
                className="w-full bg-[#111C4E] hover:bg-blue-800"
                onClick={handleNavigateMCHATRF}
              >
                <Route className="mr-2 h-4 w-4" />
                Selecionar
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </main>
  );
}
