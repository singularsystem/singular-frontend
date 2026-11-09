"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/auth-context";
import {
  acceptActiveTerm,
  fetchActiveTerm,
  fetchActiveTermStatus,
} from "@/hooks/term";
import { toast } from "@/hooks/use-toast";
import { renderTermTemplate } from "@/lib/term-template";
import type { TermResponse } from "@/types/term";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const TERM_KEY = "AEE_TERMO_RESPONSABILIDADE";

export default function TermoPage() {
  const router = useRouter();
  const { user, token, logout, isLoading: authLoading } = useAuth();

  const [term, setTerm] = useState<TermResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [checked, setChecked] = useState(false);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    if (authLoading) return;

    if (!token) {
      router.push("/login");
      return;
    }

    (async () => {
      try {
        setLoading(true);

        const status = await fetchActiveTermStatus(token, TERM_KEY);
        if (status.hasAccepted) {
          router.push("/"); // ou /dashboard
          return;
        }

        const t = await fetchActiveTerm(token, TERM_KEY);
        setTerm(t);
      } catch (err: any) {
        toast({
          title: "Erro",
          description: err?.message ?? "Falha ao carregar termo",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [authLoading, token, router]);

  // ✅ 1) primeiro calcula o texto já com placeholders preenchidos
  const renderedContent = useMemo(() => {
    if (!term) return "";

    const nome = user?.fullName ?? "";
    // const cpf = user?.cpf ?? "";

    return renderTermTemplate(term.content, {
      NOME_COMPLETO: nome,
      // CPF: cpf,
    });
  }, [term, user]);

  // ✅ 2) depois renderiza (markdown/html)
  const contentNode = useMemo(() => {
    if (!term) return null;

    if (term.contentFormat === "html") {
      return (
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: renderedContent }}
        />
      );
    }

    return (
      <div className="prose max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {renderedContent}
        </ReactMarkdown>
      </div>
    );
  }, [term, renderedContent]);

  async function handleAccept() {
    if (!token) return;

    if (!checked) {
      toast({
        title: "Atenção",
        description: "Você precisa marcar que leu e concorda com o termo.",
      });
      return;
    }

    try {
      setAccepting(true);
      await acceptActiveTerm(token, TERM_KEY);
      toast({
        title: "Aceite registrado",
        description: "Você já pode utilizar o sistema.",
      });
      router.push("/dashboard");
    } catch (err: any) {
      toast({
        title: "Erro",
        description: err?.message ?? "Falha ao registrar aceite",
      });
    } finally {
      setAccepting(false);
    }
  }

  if (loading) return <div className="p-6">Carregando termo...</div>;
  if (!term) return <div className="p-6">Termo não encontrado.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {term.title} (v{term.version})
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Publicado em{" "}
            {new Date(term.publishedAt).toLocaleDateString("pt-BR")}
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="border rounded-md p-4 max-h-[60vh] overflow-auto">
            {contentNode}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              checked={checked}
              onCheckedChange={(v) => setChecked(Boolean(v))}
            />
            <span className="text-sm">Li e concordo com o termo acima.</span>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleAccept} disabled={!checked || accepting}>
              {accepting ? "Registrando..." : "Aceitar e continuar"}
            </Button>

            <Button variant="outline" onClick={async () => await logout()}>
              Sair
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
