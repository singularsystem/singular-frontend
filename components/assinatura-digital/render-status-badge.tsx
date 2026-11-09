import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, Clock, Plus } from "lucide-react";

type StatusBadgeProps = {
  status?: string | boolean;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  if (typeof status === "boolean") {
    return status ? (
      <Badge variant="default" className="bg-green-500">
        <span className="flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Completo
        </span>
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-yellow-500 text-black">
        <span className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Em andamento
        </span>
      </Badge>
    );
  }

  switch (status?.toLowerCase()) {
    case "completo":
      return (
        <Badge variant="default" className="bg-green-500">
          <span className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Completo
          </span>
        </Badge>
      );

    case "pendente":
    case "em andamento":
    case "inprogress":
      return (
        <Badge variant="outline" className="bg-yellow-500 text-black">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Em andamento
          </span>
        </Badge>
      );

    case "nao-iniciado":
      return (
        <Badge variant="outline" className="bg-blue-500 text-white">
          <span className="flex items-center gap-1">
            <Plus className="h-3 w-3" />
            Iniciar
          </span>
        </Badge>
      );

    default:
      return (
        <Badge variant="outline">
          <span className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Desconhecido
          </span>
        </Badge>
      );
  }
}
