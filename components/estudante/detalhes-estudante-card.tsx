"use client";

import { Student, StudentSummary } from "@/types/aluno";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Label } from "../ui/label";

type StudentCarrier = { student: StudentSummary };
type DetalhesEstudanteCardProps = {
  obj?: Student | StudentCarrier;
};

function hasStudent(x: any): x is StudentCarrier {
  return x && typeof x === "object" && "student" in x;
}

export function DetalhesEstudanteCard({ obj }: DetalhesEstudanteCardProps) {
  const student: StudentSummary | undefined = !obj
    ? undefined
    : hasStudent(obj)
      ? obj.student
      : obj;

  return (
    <Card className="md:col-span-2 h-full flex flex-col mb-10">
      <CardHeader>
        <CardTitle>Informações do Estudante</CardTitle>
        <CardDescription>Dados do aluno referente ao documento</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="text-sm font-medium text-muted-foreground">
            Nome
          </Label>
          <p>{student?.fullName}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-muted-foreground">
            Data de Nascimento
          </Label>
          <p>{student?.formattedDateOfBirth}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-muted-foreground">
            Escola
          </Label>
          <p>{student?.schoolName}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-muted-foreground">
            Série
          </Label>
          <p>{student?.serie}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-muted-foreground">
            Município
          </Label>
          <p>{student?.city}</p>
        </div>
        <div>
          <Label className="text-sm font-medium text-muted-foreground">
            Endereço
          </Label>
          <p>{student?.address}</p>
        </div>
      </CardContent>
    </Card>
  );
}
