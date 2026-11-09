import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFetchSignedDoc } from "@/hooks/useFetchPDFs";
import { Download } from "lucide-react";
import { StatusBadge } from "./render-status-badge";
import { useToast } from "@/hooks/use-toast";

type PlanSignaturesCardProps = {
  professionalName?: string;
  documentToken?: string;
  teacherSign?: boolean;
  signedAt?: string | null;
  documentStatus?: string | null;
};

export function PlanSignatureCard({
  professionalName,
  documentToken,
  teacherSign,
  signedAt,
  documentStatus,
}: PlanSignaturesCardProps) {
  const { openSignedDocument, isGeneratingPDF } = useFetchSignedDoc();
  const { toast } = useToast();

  const handleDownload = async () => {
    try {
      await openSignedDocument(documentToken);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Erro ao baixar documento",
        description: err instanceof Error ? err.message : "Não foi possível baixar o documento assinado.",
      });
      window.location.reload();
    }
  };

  return (
    <Card className="md:col-span-1">
      <CardHeader>
        <CardTitle>Assinaturas</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="border-b pb-2 last:border-0 last:pb-0">
          <div className="flex justify-between items-center mb-1">
            <p className="font-medium">{professionalName ?? "-"}</p>
            <StatusBadge status={!!teacherSign} />
          </div>

          <p className="text-sm text-muted-foreground">Professor(a)</p>

          {teacherSign && signedAt && (
            <p className="text-xs text-muted-foreground">
              Assinado em: {signedAt}
            </p>
          )}
        </div>

        {teacherSign && (
          <button
            onClick={handleDownload}
            disabled={isGeneratingPDF}
            className="flex items-center gap-1 text-blue-600 hover:underline disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            {isGeneratingPDF ? "Baixando..." : "Download do Documento Assinado"}
          </button>
        )}
      </CardContent>

      <CardFooter>
        <div className="w-full text-center">
          {documentStatus === "Nao Iniciado" && (
            <p className="text-xs text-blue-600">
              Nenhum profissional iniciou o documento deste aluno.
            </p>
          )}

          {documentStatus === "Em Andamento" && (
            <p className="text-xs text-yellow-600">
              Aguardando a conclusão da assinatura do professor para finalizar o
              documento.
            </p>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
