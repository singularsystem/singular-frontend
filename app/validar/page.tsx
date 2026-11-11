"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

interface SignatureItem {
  role: string;
  signed: boolean;
}

interface ValidationData {
  valid: boolean;
  documentType?: string;
  issuedAt?: string;
  signatures?: SignatureItem[];
}

export default function ValidarDocumentoPage() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ValidationData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Ler token a partir do fragmento hash (#token) para não vazar em logs HTTP/referrers
    const hash = window.location.hash.replace(/^#/, "").trim();
    if (!hash) {
      setLoading(false);
      setError("Nenhum código de validação fornecido no endereço.");
      return;
    }

    setToken(hash);

    const validateToken = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(`${apiUrl}/api/v1/public/documents/validate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: hash }),
        });

        if (res.status === 429) {
          setError("Muitas tentativas de validação. Aguarde um minuto e tente novamente.");
          return;
        }

        const json = await res.json().catch(() => ({ valid: false }));
        setData(json);
      } catch (err) {
        setError("Não foi possível verificar a autenticidade no momento. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, []);

  const formatDocumentType = (type?: string) => {
    switch (type?.toLowerCase()) {
      case "report":
        return "Relatório Biopsicossocial";
      case "pei":
        return "Plano Educacional Individualizado (PEI)";
      case "paee":
        return "Plano de AEE (PAEE)";
      case "regularteacherevaluationdocument":
        return "Estudo de Caso do Professor Regular";
      default:
        return type || "Documento Oficial";
    }
  };

  const formatDate = (isoString?: string) => {
    if (!isoString) return "—";
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat("pt-BR", {
        dateStyle: "long",
        timeStyle: "short",
      }).format(date);
    } catch {
      return isoString;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-brand-navy">
            Singular System
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Portal de Validação Pública de Autenticidade
          </p>
        </div>

        <Card className="shadow-md border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg text-brand-navy">
              Autenticidade do Documento
            </CardTitle>
            <CardDescription>
              Verificação em tempo real de emissão e assinaturas eletrônicas.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {loading && (
              <div className="flex flex-col items-center justify-center py-8 text-slate-500">
                <Loader2 className="h-8 w-8 animate-spin text-brand-accent mb-2" />
                <p className="text-sm">Consultando autenticidade...</p>
              </div>
            )}

            {!loading && error && (
              <div className="p-4 rounded-md bg-amber-50 border border-amber-200 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold">Atenção</p>
                  <p className="mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {!loading && !error && data && !data.valid && (
              <div className="p-4 rounded-md bg-red-50 border border-red-200 flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                <div className="text-sm text-red-800">
                  <p className="font-semibold">Documento Não Encontrado ou Inválido</p>
                  <p className="mt-0.5">
                    O código informado não corresponde a nenhum documento emitido pelo sistema ou foi revogado.
                  </p>
                </div>
              </div>
            )}

            {!loading && !error && data && data.valid && (
              <div className="space-y-4">
                <div className="p-4 rounded-md bg-emerald-50 border border-emerald-200 flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div className="text-sm text-emerald-900">
                    <p className="font-semibold">Documento Válido e Autêntico</p>
                    <p className="mt-0.5 text-xs text-emerald-800">
                      Emitido oficialmente pela plataforma Singular System.
                    </p>
                  </div>
                </div>

                <div className="divide-y divide-slate-100 text-sm">
                  <div className="py-2 flex justify-between">
                    <span className="text-slate-500">Tipo de Documento:</span>
                    <span className="font-medium text-slate-800">{formatDocumentType(data.documentType)}</span>
                  </div>

                  <div className="py-2 flex justify-between">
                    <span className="text-slate-500">Data de Emissão:</span>
                    <span className="font-medium text-slate-800">{formatDate(data.issuedAt)}</span>
                  </div>
                </div>

                {data.signatures && data.signatures.length > 0 && (
                  <div className="pt-2">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                      Estado das Assinaturas
                    </p>
                    <div className="space-y-2">
                      {data.signatures.map((sig, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded-md bg-slate-50 border border-slate-100">
                          <span className="text-sm font-medium text-slate-700">{sig.role}</span>
                          <Badge variant={sig.signed ? "default" : "outline"} className={sig.signed ? "bg-emerald-600 text-white" : "text-amber-700 border-amber-300 bg-amber-50"}>
                            {sig.signed ? "Assinado" : "Pendente"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-xs text-slate-400">
          <Link href="/" className="hover:underline">
            Ir para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
