"use client";

import React, { use } from "react";
import { EdicaoRascunhoScreen } from "@/source/view/screens/neckbook/EdicaoRascunhoScreen";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function RascunhoPage({ params }: PageProps) {
  const resolvedParams = use(params);
  return <EdicaoRascunhoScreen bookId={resolvedParams.id} />;
}
