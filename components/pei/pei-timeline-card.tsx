import { Card, CardContent, CardHeader } from "../ui/card";

type Pei = {
  id: string;
  createdAt: string;
  localCreatedAt: string;
  subjects: {
    id: string;
    subject: string;
    responses: {
      id: string;
      key: string;
      response: "Ainda Não" | "Com Mediação" | "Sozinho";
    }[];
  }[];
};

type Counts = Record<"Ainda Não" | "Com Mediação" | "Sozinho", number>;

export function buildDisciplinasMap(pei: Pei): Record<string, Counts> {
  const map: Record<string, Counts> = {};

  for (const s of pei.subjects ?? []) {
    const counts: Counts = { "Ainda Não": 0, "Com Mediação": 0, Sozinho: 0 };
    for (const r of s.responses ?? []) {
      counts[r.response] = (counts[r.response] ?? 0) + 1;
    }
    map[s.subject] = counts;
  }

  return map;
}

export function buildPendenciasPorDisciplina(pei: Pei) {
  const out: Record<string, { key: string; response: string }[]> = {};

  for (const s of pei.subjects ?? []) {
    const pend = (s.responses ?? [])
      .filter((r) => r.response !== "Sozinho")
      .map((r) => ({ key: r.key, response: r.response }));
    if (pend.length) out[s.subject] = pend;
  }

  return out;
}

export function PEITimelineCard({
  pei,
  categorias,
  getColorDotDisciplina,
}: {
  pei: any;
  categorias: any[];
  getColorDotDisciplina: (disciplina: string) => string;
}) {
  const disciplinasMap = buildDisciplinasMap(pei);
  const pendencias = buildPendenciasPorDisciplina(pei);

  type StatusPEI = "Ainda Não" | "Com Mediação" | "Sozinho";

  type Counts = Record<StatusPEI, number>;

  function getResumoGlobal(pei: Pei) {
    const counts: Counts = {
      "Ainda Não": 0,
      "Com Mediação": 0,
      Sozinho: 0,
    };

    let total = 0;

    for (const s of pei.subjects ?? []) {
      for (const r of s.responses ?? []) {
        counts[r.response]++;
        total++;
      }
    }

    const percent = {
      red: total ? (counts["Ainda Não"] / total) * 100 : 0,
      yellow: total ? (counts["Com Mediação"] / total) * 100 : 0,
      green: total ? (counts["Sozinho"] / total) * 100 : 0,
    };

    return { total, counts, percent };
  }
  const resumo = getResumoGlobal(pei);

  return (
    <Card className="mb-6">
      <CardHeader>
        <h3 className="text-xl font-semibold">
          Avaliação PEI — {pei?.localCreatedAt ?? pei?.createdAt ?? ""}
        </h3>
        <p className="text-sm text-muted-foreground">
          Série/Ano: {pei?.serie ?? "-"} • Ano letivo: {pei?.schoolYear ?? "-"}
        </p>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="flex flex-col items-center bg-blue-200 px-10 py-8 rounded-md">
            <p className="text-3xl font-semibold text-brand-navy">
              {resumo.total}
            </p>
            <p className="text-gray-500">Total de Questões</p>
          </div>

          <div className="rounded-lg border bg-red-50 shadow-sm p-4 text-center">
            <div className="text-sm text-red-700">Ainda Não</div>
            <div className="text-3xl font-bold text-red-600">
              {resumo.counts["Ainda Não"]}
            </div>
            <div className="text-sm text-red-700">
              {resumo.percent.red.toFixed(1)}%
            </div>
          </div>

          <div className="rounded-lg border bg-yellow-50 shadow-sm p-4 text-center">
            <div className="text-sm text-yellow-700">Com Mediação</div>
            <div className="text-3xl font-bold text-yellow-600">
              {resumo.counts["Com Mediação"]}
            </div>
            <div className="text-sm text-yellow-700">
              {resumo.percent.yellow.toFixed(1)}%
            </div>
          </div>

          <div className="rounded-lg border bg-green-50 shadow-sm p-4 text-center">
            <div className="text-sm text-green-700">Sozinho</div>
            <div className="text-3xl font-bold text-green-600">
              {resumo.counts["Sozinho"]}
            </div>
            <div className="text-sm text-green-700">
              {resumo.percent.green.toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 print-cards-grid">
          {Object.entries(disciplinasMap).map(([disciplina, counts]) => {
            const total = Object.values(counts).reduce((sum, v) => sum + v, 0);

            return (
              <div
                key={disciplina}
                className="rounded-lg border bg-card text-card-foreground shadow-sm border-l-4 print-card"
              >
                <div className="flex flex-col space-y-1.5 p-3 pb-3 card-head">
                  <div className="font-semibold tracking-tight text-lg flex items-center gap-2 card-title">
                    <div
                      className={`w-3 h-3 rounded-full dot ${getColorDotDisciplina(disciplina)}`}
                      data-print-dot
                    />
                    {disciplina}
                  </div>

                  <div className="text-sm text-gray-600 card-sub">
                    {total} habilidades avaliadas
                  </div>
                </div>

                <div className="p-3 pt-0">
                  <div className="mb-2">
                    {categorias.map((categoria) => {
                      const count =
                        counts[categoria.label as keyof typeof counts] ?? 0;
                      return (
                        <div
                          key={categoria.label}
                          className={`flex items-center justify-between text-center p-3 ${categoria.bg} rounded category-row`}
                        >
                          <div
                            className={`text-xs ${categoria.corPorcentagem} category-label`}
                          >
                            {categoria.label}:
                          </div>

                          <div
                            className={`text-xl font-bold ${categoria.corTexto} category-count`}
                          >
                            {count}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* <div className="mt-10 text-justify">
          <h4 className="text-lg font-semibold mb-4">
            Pontos de atenção por disciplina (itens ≠ “Sozinho”)
          </h4>

          {Object.keys(pendencias).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhum ponto de atenção neste PEI.
            </p>
          ) : (
            Object.entries(pendencias).map(([disc, items]) => (
              <div key={disc} className="mb-4">
                <h4 className="text-xl font-bold mb-2">{disc}</h4>

                <ul className="list-disc list-inside text-gray-900">
                  {items.slice(0, 20).map((it) => (
                    <li key={it.key}>
                      <span className="font-medium">{it.key}</span>{" "}
                      <span className="text-muted-foreground">
                        — {it.response}
                      </span>
                    </li>
                  ))}
                </ul>

                {items.length > 20 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    +{items.length - 20} itens (mostrando só os 20 primeiros)
                  </p>
                )}
              </div>
            ))
          )}
        </div> */}
      </CardContent>
    </Card>
  );
}
