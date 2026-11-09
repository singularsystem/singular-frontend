"use client";
export const dynamic = "force-dynamic";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
      <h2 className="mt-4 text-xl font-medium text-gray-700">Carregando...</h2>
      <p className="text-gray-500">
        Por favor, aguarde enquanto processamos sua solicitação.
      </p>
    </div>
  );
}
