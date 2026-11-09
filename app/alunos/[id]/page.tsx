"use client";

import { AlunoDetailsScreen } from "@/source/view/screens/alunos/AlunoDetailsScreen";
import { use } from "react";

export default function VisualizarStudentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <AlunoDetailsScreen id={id} />;
}
