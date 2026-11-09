"use client";

import { AlunoEditScreen } from "@/source/view/screens/alunos/AlunoEditScreen";
import { use } from "react";

export default function EditarStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <AlunoEditScreen id={id} />;
}
