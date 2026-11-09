import {
  buildDominiosMap,
  buildRespostas,
  buildSugestoesPorCategoria,
} from "@/lib/paee_helpers";
import { Card, CardContent, CardHeader } from "../ui/card";

export function PortageTimelineCard({
  portage,
  categorias,
  getColorDot,
}: {
  portage: any;
  categorias: any[];
  getColorDot: (d: string) => string;
}) {
  const respostas = buildRespostas(portage);
  const dominiosMap = buildDominiosMap(respostas);
  const respostasPorCategoria = buildSugestoesPorCategoria(portage, respostas);

  return (
    <Card className="mb-6">
      <CardHeader>
        <h3 className="text-xl font-semibold">
          Avaliação Portage —{" "}
          {portage?.localCreatedAt ?? portage?.createdAt ?? ""}
        </h3>
        <p className="text-sm text-muted-foreground">
          Faixa etária: {portage?.ageRange ?? "-"}
        </p>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 print-cards-grid">
          {Object.entries(dominiosMap).map(([dominio, respostasCategoria]) => {
            const total = Object.values(respostasCategoria).reduce(
              (sum, val) => sum + val,
              0,
            );

            return (
              <div
                key={dominio}
                className="rounded-lg border bg-card text-card-foreground shadow-sm border-l-4 print-card"
              >
                <div className="flex flex-col space-y-1.5 p-3 pb-3 card-head">
                  <div className="font-semibold tracking-tight text-lg flex items-center gap-2 card-title">
                    <div
                      className={`w-3 h-3 rounded-full dot ${getColorDot(dominio)}`}
                      data-print-dot
                    />
                    {dominio}
                  </div>
                  <div className="text-sm text-gray-600 card-sub">
                    {total} questões avaliadas
                  </div>
                </div>

                <div className="p-3 pt-0">
                  <div className="mb-2">
                    {categorias.map((categoria) => {
                      const count = respostasCategoria[categoria.label] || 0;
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

        <div className="mt-10 text-justify">
          <h4 className="text-lg font-semibold mb-4">
            Sugestões de Intervenção Pedagógica por Área de Desenvolvimento
          </h4>

          {Object.keys(respostasPorCategoria).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma sugestão para este Portage.
            </p>
          ) : (
            Object.entries(respostasPorCategoria).map(([cat, items]) => (
              <div key={cat} className="mb-4">
                <h4 className="text-xl font-bold mb-2">{cat}</h4>
                <ul className="list-disc list-inside text-gray-900">
                  {items.map(({ index, suggestion }) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
