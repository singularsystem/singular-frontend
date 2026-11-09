"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { portageData } from "@/lib/portage-data";

import { disciplinasDisponiveis } from "@/types/pei";

type SubjectResponse = {
  id: string;
  key: string;
  response: string;
  category?: string | null;
};

type PEISubject = {
  id: string;
  subject: string;
  responses: SubjectResponse[];
};

type SubjectSuggestionsCardProps = {
  serie: string;
  peiSubject: PEISubject;
};

function normalizeAnswer(v?: string) {
  const s = (v ?? "").trim().toLowerCase();

  if (s === "sozinho") return "sozinho";
  if (s === "com mediação" || s === "com mediacao") return "com_mediacao";
  if (s === "ainda não" || s === "ainda nao") return "ainda_nao";

  return "desconhecido";
}

export function SubjectSuggestionsCard({
  serie,
  peiSubject,
}: SubjectSuggestionsCardProps) {
  const isEducacaoInfantil = peiSubject.subject === "Educação Infantil";

  const itemsEducacaoInfantil = isEducacaoInfantil
    ? peiSubject.responses
        .map((r) => {
          const ans = normalizeAnswer(r.response);
          if (ans === "sozinho") return null;

          const match = r.key.match(/^EI-(0-1|1-2|2-3|3-4|4-5)-(\d+)$/);
          if (!match) return null;

          const faixa = match[1] as "0-1" | "1-2" | "2-3" | "3-4" | "4-5";
          const index = Number(match[2]) - 1;
          const q = portageData[faixa]?.[index];
          if (!q) return null;

          const tipo =
            r.category?.split("•")[1]?.trim() || q.category || "Sem tipo";
          const suggestion =
            ans === "com_mediacao"
              ? q.suggestion_com_mediacao || ""
              : ans === "ainda_nao"
                ? q.suggestion_ainda_nao || ""
                : "";

          if (!suggestion) return null;

          return {
            key: r.key,
            tipo,
            pergunta: q.question,
            resposta: r.response,
            suggestion,
          };
        })
        .filter(Boolean)
    : [];

  const questions =
    serie in disciplinasDisponiveis
      ? disciplinasDisponiveis?.[
          serie as keyof typeof disciplinasDisponiveis
        ]?.[
          peiSubject.subject as keyof (typeof disciplinasDisponiveis)[keyof typeof disciplinasDisponiveis]
        ] ?? []
      : [];

  const questionById = new Map(questions.map((q) => [q.id, q]));

  const itemsFundamental = peiSubject.responses
    .map((r) => {
      const q = questionById.get(r.key);
      if (!q) return null;

      const ans = normalizeAnswer(r.response);

      if (ans === "sozinho") {
        return null;
      }

      const suggestion =
        ans === "com_mediacao"
          ? q.sugestaoSimComMediacao
          : ans === "ainda_nao"
            ? q.sugestaoNao
            : "";

      if (!suggestion) return null;

      return {
        key: r.key,
        tipo: q.tipo || "Sem tipo",
        pergunta: q.pergunta,
        resposta: r.response,
        suggestion,
      };
    })
    .filter(Boolean) as Array<{
    key: string;
    tipo: string;
    pergunta: string;
    resposta: string;
    suggestion: string;
  }>;

  const items = isEducacaoInfantil
    ? (itemsEducacaoInfantil as Array<{
        key: string;
        tipo: string;
        pergunta: string;
        resposta: string;
        suggestion: string;
      }>)
    : itemsFundamental;

  const grouped = items.reduce<Record<string, typeof items>>((acc, item) => {
    (acc[item.tipo] ??= []).push(item);
    return acc;
  }, {});

  const total = peiSubject.responses.length;
  const withSuggestion = items.length;

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{peiSubject.subject}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Série: {serie} • Sugestões geradas: {withSuggestion}/{total}
            </p>
          </div>

          <Badge variant={withSuggestion > 0 ? "default" : "outline"}>
            {withSuggestion > 0 ? "Com sugestões" : "Sem sugestões"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {withSuggestion === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma sugestão para exibir.
          </p>
        ) : (
          Object.entries(grouped).map(([tipo, list]) => (
            <section key={tipo} className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{tipo}</h4>
                <Badge variant="outline">{list.length}</Badge>
              </div>

              <div className="space-y-3">
                {list.map((item) => (
                  <div
                    key={item.key}
                    className="rounded-lg border p-4 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{item.pergunta}</p>
                        <p className="text-xs text-muted-foreground">
                          Código: {item.key}
                        </p>
                      </div>

                      <Badge
                        variant="outline"
                        className={
                          normalizeAnswer(item.resposta) === "ainda_nao"
                            ? "bg-yellow-500 text-black"
                            : "bg-blue-500 text-white"
                        }
                      >
                        {item.resposta}
                      </Badge>
                    </div>

                    <div className="text-sm whitespace-pre-wrap">
                      {item.suggestion}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </CardContent>
    </Card>
  );
}
