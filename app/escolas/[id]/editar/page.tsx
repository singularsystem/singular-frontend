"use client";

import { use } from "react";
import { EscolaFormScreen } from "@/source/view/screens/escolas/EscolaFormScreen";

export default function EditarEscolaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  return <EscolaFormScreen id={resolvedParams.id} />;
}
