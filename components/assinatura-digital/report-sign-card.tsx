import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useFetchSignedDoc } from "@/hooks/useFetchPDFs";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type ReportSignaturesCardProps = {
  socialWorkerName?: string | null;
  socialWorkerSign?: boolean;
  socialWorkerSignedAt?: string | null;

  psychologistName?: string | null;
  psychologistSign?: boolean;
  psychologistSignedAt?: string | null;

  psychopedagogueName?: string | null;
  psychopedagogueSign?: boolean;
  psychopedagogueSignedAt?: string | null;

  documentToken?: string | null;
  documentStatus?: string | null;
  reportStatus?: string | null;
  signatureBlocked?: boolean;
  createdAt?: string | null;
  onDownloadPdf?: () => Promise<void> | void;
  isDownloadingPdf?: boolean;
};

type SignatureRowProps = {
  name?: string | null;
  roleLabel: string;
  signed?: boolean;
  signedAt?: string | null;
  signatureBlocked?: boolean;
  createdAt?: string | null;
  isLegacyCompleted?: boolean;
  isDocComplete?: boolean;
};

function SignatureRow({
  name,
  roleLabel,
  signed,
  signedAt,
  signatureBlocked,
  isLegacyCompleted,
  isDocComplete,
}: SignatureRowProps) {
  const isSigned = !!signed || !!signedAt || (!!isDocComplete && (!!signatureBlocked || !!isLegacyCompleted));
  return (
    <div className="border-b pb-2 last:border-0 last:pb-0">
      <div className="flex justify-between items-center mb-1 gap-2">
        <p className={`font-medium ${name?.startsWith("Nenhum") ? "text-sm text-slate-500 whitespace-normal" : "truncate"}`}>
          {name ?? "-"}
        </p>
        <Badge className={isSigned ? "bg-green-500 text-white" : "bg-yellow-500 text-black"}>
          {isSigned ? "Assinado" : "Não assinado"}
        </Badge>
      </div>

      <p className="text-sm text-muted-foreground">{roleLabel}</p>

      {isSigned && signedAt ? (
        <p className="text-xs text-muted-foreground">Assinado em: {signedAt}</p>
      ) : null}
    </div>
  );
}

export function ReportSignaturesCard({
  socialWorkerName,
  socialWorkerSign,
  socialWorkerSignedAt,
  psychologistName,
  psychologistSign,
  psychologistSignedAt,
  psychopedagogueName,
  psychopedagogueSign,
  psychopedagogueSignedAt,
  documentToken,
  documentStatus,
  reportStatus,
  signatureBlocked,
  createdAt,
  onDownloadPdf,
  isDownloadingPdf = false,
}: ReportSignaturesCardProps) {
  const cutoffDate = new Date('2026-08-18T00:00:00Z');
  const isBeforeCutoff = createdAt ? new Date(createdAt) < cutoffDate : false;
  const docStatusLower = documentStatus?.toLowerCase() ?? "";
  const repStatusLower = reportStatus?.toLowerCase() ?? "";
  const isDocComplete =
    repStatusLower.includes('complet') ||
    docStatusLower.includes('complet') ||
    false;

  const hasSwSigned = !!socialWorkerSignedAt || !!socialWorkerSign;
  const hasPsySigned = !!psychologistSignedAt || !!psychologistSign;
  const hasPpSigned = !!psychopedagogueSignedAt || !!psychopedagogueSign;
  const isEnvelopeComplete =
    docStatusLower.includes('complet') ||
    (hasSwSigned && hasPsySigned && hasPpSigned);

  // Se o relatório já está no fluxo de assinatura digital (tem token ou assinaturas parciais)
  // e ainda não concluiu todas as 3 assinaturas nem foi bloqueado, não deve marcar todos como "Assinado" por legado
  const hasActiveSignatureFlow =
    !signatureBlocked &&
    !isEnvelopeComplete &&
    (!!documentToken || hasSwSigned || hasPsySigned || hasPpSigned);

  const isLegacyCompleted =
    isDocComplete &&
    (!!signatureBlocked ||
      isEnvelopeComplete ||
      (isBeforeCutoff && !hasActiveSignatureFlow));
  const { openSignedDocument, isGeneratingPDF } = useFetchSignedDoc();
  const { toast } = useToast();

  const handleDownload = async () => {
    if (signatureBlocked || !documentToken) {
      if (onDownloadPdf) {
        await onDownloadPdf();
      }
      return;
    }

    try {
      await openSignedDocument(documentToken);
    } catch (err) {
      console.warn("Falha ao abrir documento assinado via assinatura digital. Fazendo fallback para o PDF normal:", err);
      if (onDownloadPdf) {
        try {
          await onDownloadPdf();
        } catch {
          toast({
            variant: "destructive",
            title: "Erro ao baixar documento",
            description: "Não foi possível baixar o relatório.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao baixar documento",
          description: err instanceof Error ? err.message : "Não foi possível baixar o relatório assinado.",
        });
      }
    }
  };

  const isFullySignedOrBlocked =
    isLegacyCompleted ||
    (isDocComplete && hasSwSigned && hasPsySigned && hasPpSigned);

  const isLoading = isGeneratingPDF || isDownloadingPdf;

  return (
    <Card className="h-full flex flex-col md:col-span-1">
      <CardHeader>
        <CardTitle>Assinaturas</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2 flex-1">
        <SignatureRow
          name={socialWorkerName}
          roleLabel="Assistente Social"
          isLegacyCompleted={isLegacyCompleted}
          isDocComplete={isDocComplete}
          signed={socialWorkerSign}
          signedAt={socialWorkerSignedAt}
          signatureBlocked={signatureBlocked}
        />

        <SignatureRow
          name={psychologistName}
          roleLabel="Psicológa(o)"
          isLegacyCompleted={isLegacyCompleted}
          isDocComplete={isDocComplete}
          signed={psychologistSign}
          signedAt={psychologistSignedAt}
          signatureBlocked={signatureBlocked}
        />

        <SignatureRow
          name={psychopedagogueName}
          roleLabel="Psicopedagogo(a)"
          isLegacyCompleted={isLegacyCompleted}
          isDocComplete={isDocComplete}
          signed={psychopedagogueSign}
          signedAt={psychopedagogueSignedAt}
          signatureBlocked={signatureBlocked}
        />

        {isFullySignedOrBlocked && (
          <button
            onClick={handleDownload}
            disabled={isLoading}
            className="flex items-center gap-1 text-blue-600 hover:underline disabled:opacity-50 mt-3"
          >
            <Download className="h-4 w-4" />
            {isLoading ? "Baixando..." : "Download do Relatório Assinado"}
          </button>
        )}
      </CardContent>

      <CardFooter>
        <div className="w-full text-center">
          {documentStatus === "Nao Iniciado" ? (
            <p className="text-xs text-blue-600">
              Nenhum profissional iniciou a avaliação deste aluno.
            </p>
          ) : null}

          {!isFullySignedOrBlocked && documentStatus === "Em Andamento" ? (
            <p className="text-xs text-yellow-600">
              Aguardando a conclusão de todos os profissionais para finalizar o
              relatório.
            </p>
          ) : null}
        </div>
      </CardFooter>
    </Card>
  );
}

