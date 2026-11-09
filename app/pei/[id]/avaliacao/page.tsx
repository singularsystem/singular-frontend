"use client";
export const dynamic = "force-dynamic";
import { DetalhesEstudanteCard } from "@/components/estudante/detalhes-estudante-card";
import { PEITimelineCard } from "@/components/pei/pei-timeline-card";
import { Button } from "@/components/ui/button";
import { useBack } from "@/hooks/use-back";
import { toast } from "@/hooks/use-toast";
import { useFetchPEIByStudent } from "@/hooks/useFetchPEI";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function AvaliacaoPEI({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  const back = useBack("/pei");
  const {
    planos,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchPEIByStudent(id);

  useEffect(() => {
    if (fetchLoading) return;

    if (fetchError) {
      toast({
        title: "Erro ao buscar planos",
        description: fetchError.message || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    }
  }, [fetchError, fetchLoading, planos, toast]);

  const categorias = [
    {
      label: "Ainda Não",
      emoji: "🔴",
      corTexto: "text-red-600",
      corFundo: "bg-red-100",
      corDescricao: "text-red-800",
      corPorcentagem: "text-red-700",
      corBarra: "bg-red-500",
      bg: "bg-red-50",
      border: "border-red-500",
      text: "text-red-800",
      description:
        "Habilidades que a criança ainda não desenvolveu. Estas áreas necessitam de intervenção direta e estruturada.",
      descriptionText: "text-red-700",
    },
    {
      label: "Com Mediação",
      corTexto: "text-yellow-600",
      corFundo: "bg-yellow-100",
      corDescricao: "text-yellow-800",
      corPorcentagem: "text-yellow-700",
      corBarra: "bg-yellow-500",
      emoji: "🟡",
      bg: "bg-yellow-50",
      border: "border-yellow-500",
      text: "text-yellow-800",
      description:
        "Habilidades emergentes que a criança demonstra com apoio. Foco na redução gradual da mediação.",
      descriptionText: "text-yellow-700",
    },
    {
      label: "Sozinho",
      corTexto: "text-green-600",
      corFundo: "bg-green-100",
      corDescricao: "text-green-800",
      corPorcentagem: "text-green-700",
      corBarra: "bg-green-500",
      emoji: "🟢",
      bg: "bg-green-50",
      border: "border-green-500",
      text: "text-green-800",
      description:
        "Habilidades consolidadas que a criança realiza independentemente. Manter e expandir estas competências.",
      descriptionText: "text-green-700",
    },
  ];

  function getColorDotDisciplina(disciplina: string) {
    switch (disciplina) {
      case "Matemática":
        return "bg-blue-600";
      case "Língua Portuguesa":
        return "bg-green-600";
      case "Ciências":
        return "bg-purple-600";
      case "História":
        return "bg-orange-600";
      case "Geografia":
        return "bg-pink-600";
      default:
        return "bg-gray-500";
    }
  }

  if (!planos?.length) return null;

  const sorted = [...planos].sort(
    (a, b) =>
      new Date(b.localCreatedAt).getTime() -
      new Date(a.localCreatedAt).getTime(),
  );

  const uniquePerDay = sorted.filter((p, index, arr) => {
    const dayKey = new Date(p.createdAt).toISOString().slice(0, 10);
    return (
      index ===
      arr.findIndex(
        (x) => new Date(x.createdAt).toISOString().slice(0, 10) === dayKey,
      )
    );
  });

  return (
    <main className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={back}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-[#111C4E]">
            Avaliação PEI
          </h1>
        </div>
      </div>

      <DetalhesEstudanteCard obj={uniquePerDay[0]} />

      <div className="mt-6">
        {uniquePerDay.map((p: any) => (
          <div key={p.id} className="relative">
            <div className="absolute -left-3 top-8 w-3 h-3 rounded-full bg-blue-600" />
            <div className="pl-6">
              <PEITimelineCard
                pei={p}
                categorias={categorias}
                getColorDotDisciplina={getColorDotDisciplina}
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
