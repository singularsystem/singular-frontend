import { PortageResponse } from "@/types/portage";
import { portageData } from "./portage-data";

export function buildRespostas(portage: any) {
  return Object.values(
    (portage?.responses ?? {}) as Record<number, PortageResponse>,
  ).map((item) => ({ resposta: item.response, categoria: item.category }));
}

export function buildDominiosMap(
  respostas: { resposta: string; categoria: string }[],
) {
  return respostas.reduce<Record<string, Record<string, number>>>(
    (acc, { categoria, resposta }) => {
      if (!acc[categoria]) {
        acc[categoria] = { "Ainda Não": 0, "Com Mediação": 0, Sozinho: 0 };
      }
      acc[categoria][resposta] += 1;
      return acc;
    },
    {},
  );
}

export function mapAgeRangeLabelToKey(
  label: string | undefined,
): string | undefined {
  if (label != undefined) {
    switch (label) {
      case "0 a 1 ano":
        return "0-1";
      case "1 a 2 anos":
        return "1-2";
      case "2 a 3 anos":
        return "2-3";
      case "3 a 4 anos":
        return "3-4";
      case "4 a 5 anos":
        return "4-5";
      case "5 a 6 anos":
        return "5-6";
      case "7 anos ou mais":
        return "7-mais";
      default:
        throw new Error("Faixa etária inválida");
    }
  }
}

export function buildSugestoesPorCategoria(portage: any, respostas: any[]) {
  const selectedAgeRange = mapAgeRangeLabelToKey(portage?.ageRange);
  const ageQuestions = selectedAgeRange
    ? (portageData[selectedAgeRange] ?? [])
    : [];

  const respostasPorCategoria: Record<
    string,
    { index: number; suggestion: string }[]
  > = {};

  ageQuestions.forEach((question, idx) => {
    const resp = respostas[idx];
    if (!resp) return;

    const { resposta, categoria } = resp;
    if (!categoria) return;
    if (resposta !== "Ainda Não" && resposta !== "Com Mediação") return;

    const suggestion =
      resposta === "Ainda Não"
        ? question.suggestion_ainda_nao
        : question.suggestion_com_mediacao;

    if (!suggestion) return;

    (respostasPorCategoria[categoria] ??= []).push({ index: idx, suggestion });
  });

  return respostasPorCategoria;
}
