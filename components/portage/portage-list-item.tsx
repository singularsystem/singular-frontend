import { Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { PortageResponse } from "@/types/portage";

export function buildPortageStats(portage: any) {
  const respostas = Object.values(
    (portage?.responses ?? {}) as Record<number, PortageResponse>,
  ).map((item) => ({ resposta: item.response, categoria: item.category }));

  const total = respostas.length;

  const dominiosMap = respostas.reduce<Record<string, Record<string, number>>>(
    (acc, { categoria, resposta }) => {
      if (!acc[categoria]) {
        acc[categoria] = { "Ainda Não": 0, "Com Mediação": 0, Sozinho: 0 };
      }
      acc[categoria][resposta] += 1;
      return acc;
    },
    {},
  );

  const countByLabel = (label: string) =>
    respostas.filter((r) => r.resposta === label).length;

  return {
    total,
    respostas,
    dominiosMap,
    resumo: {
      "Ainda Não": countByLabel("Ainda Não"),
      "Com Mediação": countByLabel("Com Mediação"),
      Sozinho: countByLabel("Sozinho"),
    },
  };
}

export function PortageTimelineItem({
  portage,
  categorias,
  getColorDot,
}: {
  portage: any;
  categorias: any[];
  getColorDot: (d: string) => string;
}) {
  const { total, respostas, dominiosMap } = buildPortageStats(portage);

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-3">
            <Target className="h-5 w-5" />
            Portage {new Date(portage.createdAt).toLocaleDateString("pt-BR")}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-2">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="flex flex-col items-center bg-blue-200 px-10 py-8 rounded-md">
            <p className="text-3xl font-semibold text-[#111C4E]">{total}</p>
            <p className="text-gray-500">Total de Questões</p>
          </div>

          {categorias.map((cat) => {
            const count = respostas.filter(
              (r) => r.resposta === cat.label,
            ).length;
            const percent = total > 0 ? (count / total) * 100 : 0;

            return (
              <div
                key={cat.label}
                className={`flex flex-col items-center ${cat.corFundo} px-10 py-8 rounded-md`}
              >
                <p className={`text-3xl font-semibold ${cat.corTexto}`}>
                  {count}
                </p>
                <p className={`${cat.corDescricao}`}>{cat.label}</p>
                <p className={`${cat.corPorcentagem} text-sm`}>
                  {percent.toFixed(1)}%
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(dominiosMap).map(([dominio, respostasCategoria]) => {
            const totalDom = Object.values(respostasCategoria).reduce(
              (sum, val) => sum + val,
              0,
            );

            return (
              <div
                key={dominio}
                className="rounded-lg border bg-card text-card-foreground shadow-sm border-l-4"
              >
                <div className="flex flex-col space-y-1.5 p-6 pb-3">
                  <div className="font-semibold tracking-tight text-lg flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${getColorDot(dominio)}`}
                    />
                    {dominio}
                  </div>
                  <div className="text-sm text-gray-600">
                    {totalDom} questões avaliadas
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {categorias.map((categoria) => {
                      const count = respostasCategoria[categoria.label] || 0;
                      const percent =
                        totalDom > 0
                          ? ((count / totalDom) * 100).toFixed(1)
                          : "0.0";

                      return (
                        <div
                          key={categoria.label}
                          className={`text-center p-3 ${categoria.bg} rounded`}
                        >
                          <div
                            className={`text-xl font-bold ${categoria.corTexto}`}
                          >
                            {count}
                          </div>
                          <div
                            className={`text-xs ${categoria.corPorcentagem}`}
                          >
                            {categoria.label}
                          </div>
                          <div className={`text-xs ${categoria.corTexto}`}>
                            {percent}%
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex h-2 bg-gray-200 rounded-full overflow-hidden">
                    {categorias.map((categoria) => {
                      const count = respostasCategoria[categoria.label] || 0;
                      const percent =
                        totalDom > 0 ? (count / totalDom) * 100 : 0;
                      return (
                        <div
                          key={categoria.label}
                          className={`${categoria.corBarra} transition-all`}
                          style={{ width: `${percent}%` }}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
