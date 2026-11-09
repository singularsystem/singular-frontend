import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function AddSubjectsButton({ peiId }: { peiId: string }) {
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className="bg-green-600 text-white border hover:text-green-600 hover:border-green-600 hover:bg-white hover:border-2 gap-2"
      onClick={() => router.push(`/pei/novo/${peiId}?mode=add-subject`)}
    >
      <Plus className="w-6 h-6" />
      <span>Adicionar disciplinas</span>
    </Button>
  );
}
