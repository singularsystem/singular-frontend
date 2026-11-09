import { DetalhesEstudanteCard } from "@/components/estudante/detalhes-estudante-card";
import { PortageTimelineItem } from "@/components/portage/portage-list-item";
import { Button } from "@/components/ui/button";
import { useBack } from "@/hooks/use-back";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { usePortageDetails } from "../../hooks/paee/usePortageDetails";
import { Skeleton } from "@/components/ui/skeleton";

interface PortageDetailsScreenProps {
  id: string; // studentId
}

export function PortageDetailsScreen({ id }: PortageDetailsScreenProps) {
  const back = useBack("/paee");
  const { portages, error, isLoading } = usePortageDetails(id);

  useEffect(() => {
    if (isLoading) return;

    if (error) {
      toast({
        title: "Erro ao buscar portages",
        description: error || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    }
  }, [error, isLoading]);

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

  function getColorDot(dominio: string): string {
    switch (dominio) {
      case "Socialização":
        return "bg-blue-500";
      case "Linguagem":
        return "bg-green-500";
      case "Cognição":
        return "bg-purple-500";
      case "Auto-cuidados":
        return "bg-orange-500";
      case "Desenvolvimento Motor":
        return "bg-pink-500";
      case "Percepção":
        return "bg-yellow-500";
      case "Atenção":
        return "bg-red-800";
      case "Memória":
        return "bg-stone-600";
      case "Funções Psicomotoras":
        return "bg-blue-400";
      case "Raciocínio Lógico":
        return "bg-amber-950";
      case "Pensamento Operatório":
        return "bg-rose-500";
      case "Leitura e Escrita":
        return "bg-fuchsia-500";
      default:
        return "bg-gray-500";
    }
  }

  if (isLoading) {
    return (
      <main className="flex-1 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Skeleton className="h-10 w-10 bg-gray-200" />
          <Skeleton className="h-8 w-40 bg-gray-200" />
        </div>
        <Skeleton className="h-32 w-full mb-6 bg-gray-200" />
        <Skeleton className="h-64 w-full bg-gray-200" />
      </main>
    );
  }

  if (!portages?.length) {
    return (
      <main className="flex-1 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="outline" size="icon" onClick={back}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold tracking-tight text-[#111C4E]">
            Guia Portage
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-md bg-gray-50 text-gray-500">
          <p className="text-lg">Nenhuma avaliação Portage encontrada para este aluno.</p>
          <p className="text-sm mt-2">Pode ser que você não tenha permissão de visualização ou ela ainda não foi criada.</p>
        </div>
      </main>
    );
  }

  const sorted = [...portages].sort(
    (a, b) =>
      new Date(b.localCreatedAt || b.createdAt).getTime() -
      new Date(a.localCreatedAt || a.createdAt).getTime(),
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
            Guia Portage
          </h1>
        </div>
      </div>

      <DetalhesEstudanteCard obj={uniquePerDay[0]} />

      <div className="mt-6">
        {uniquePerDay.map((p: any) => (
          <div key={p.id} className="relative">
            <div className="absolute -left-3 top-8 w-3 h-3 rounded-full bg-blue-600" />
            <div className="pl-6">
              <PortageTimelineItem
                portage={p}
                categorias={categorias}
                getColorDot={getColorDot}
              />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
