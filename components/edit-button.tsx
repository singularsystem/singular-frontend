"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface EditButtonProps {
  path: string;
  label?: string;
}

export function EditButton({ path, label = "Editar" }: EditButtonProps) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);
  const { toast } = useToast();

  const handleClick = () => {
    setIsNavigating(true);
    try {
      router.push(path);
    } catch (error) {
      console.error("Erro ao navegar:", error);
      toast({
        variant: "destructive",
        title: "Erro ao navegar",
        description: "Não foi possível acessar a página de edição",
      });
      setIsNavigating(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={handleClick}
      disabled={isNavigating}
    >
      {isNavigating ? (
        <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
      ) : (
        <Pencil className="h-4 w-4" />
      )}
      {label}
    </Button>
  );
}
