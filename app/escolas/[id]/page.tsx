"use client";

import { use } from "react";
import { EscolaDetailsScreen } from "@/source/view/screens/escolas/EscolaDetailsScreen";

export default function VisualizarEscolaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  return <EscolaDetailsScreen id={resolvedParams.id} />;
}
