import { PsychologistQuestionnaire } from "@/types/questionario-psicologo";
import { RelatorioPsicologico } from "@/types/relatorio";

export const generateCognitiveText = (
  relatorio: RelatorioPsicologico,
): string => {
  let text = "";
  if (relatorio.adaptiveBehaviorScaleDI?.result) {
    text += `Na avaliação do comportamento adaptativo, o domínio conceitual apresentou ${Number(relatorio.adaptiveBehaviorScaleDI.percentage).toFixed(2)}% de funcionamento`;
    if (relatorio.adaptiveBehaviorScaleDI?.percentage < 51) {
      text +=
        ", indicando necessidade de suporte significativo em habilidades conceituais como linguagem, leitura, escrita e raciocínio.";
    } else if (relatorio.adaptiveBehaviorScaleDI?.percentage < 75) {
      text +=
        ", sugerindo necessidade de suporte moderado para o desenvolvimento de habilidades conceituais.";
    } else {
      text += ", demonstrando bom desenvolvimento das habilidades conceituais.";
    }
  }
  return text;
};

export type Evaluation = "Yes" | "Sometimes" | "Not" | "None";

const evaluationScore: Record<Evaluation, number> = {
  Yes: 2,
  Sometimes: 1,
  Not: 0,
  None: 0,
};

const EMOTIONAL_FIELDS = [
  "friendshipDifficulty",
  "easilyFrustrated",
  "lowSelfEsteem",
  "dependsOnAdults",
] as const;

type EmotionalField = (typeof EMOTIONAL_FIELDS)[number];

export function calculateEmotionalPercentage(
  q?: PsychologistQuestionnaire | null,
) {
  if (!q) return { total: 0, max: 0, percentage: 0 };

  const answers = EMOTIONAL_FIELDS.map((k) => q[k] ?? "None");

  const valid = answers.filter((a): a is Evaluation => a !== "None");

  const total = valid.reduce((acc, a) => acc + evaluationScore[a], 0);
  const max = valid.length * 2;

  const percentage = max > 0 ? (total / max) * 100 : 0;

  return { total, max, percentage: Math.round(percentage) };
}

export function getEmotionalDevelopment(percentage: number) {
  let text = "";
  if (percentage < 25) {
    text +=
      "Indicadores emocionais dentro do esperado. Manter estímulos socioemocionais e acompanhamento escolar.";
  }

  if (percentage < 50) {
    text +=
      "Alguns sinais de dificuldade emocional. Recomenda-se monitoramento e estratégias de apoio socioemocional.";
  }

  if (percentage < 70) {
    text +=
      "Sinais relevantes de dificuldade emocional. Recomenda-se avaliação mais detalhada e plano de intervenção.";
  }

  text +=
    "Sinais importantes de dificuldade emocional. Encaminhamento e acompanhamento especializado são recomendados.";
  return text;
}

export const generateSocialText = (relatorio: RelatorioPsicologico): string => {
  let text = "";

  if (relatorio.adaptiveBehaviorScaleDI?.result) {
    text += `No domínio social do comportamento adaptativo, observou-se ${Number(relatorio.adaptiveBehaviorScaleDI?.percentageSocialSkills).toFixed(2)}% de funcionamento`;
    if (relatorio.adaptiveBehaviorScaleDI?.percentageSocialSkills < 51) {
      text +=
        ", indicando dificuldades significativas em habilidades sociais e interpessoais.";
    } else if (relatorio.adaptiveBehaviorScaleDI?.percentageSocialSkills < 75) {
      text +=
        ", sugerindo necessidade de apoio para desenvolvimento de competências sociais.";
    } else {
      text += ", demonstrando adequado desenvolvimento de habilidades sociais.";
    }
  }
  return text;
};

export const generateConclusionText = (
  relatorio: RelatorioPsicologico,
): string => {
  let text =
    "Com base nos instrumentos aplicados e nas observações realizadas, conclui-se que:\n\n";

  if (relatorio.snapIVQuestionnaire?.result) {
    const result = relatorio.snapIVQuestionnaire?.result;
    if (
      result === "TDAH Combinado" ||
      result === "TDAH Tipo Desatento" ||
      result === "TDAH Tipo Hiperativo/Impulsivo"
    ) {
      text +=
        "Os resultados da Escala SNAP-IV são SUGESTIVOS DE TDAH (Transtorno de Déficit de Atenção e Hiperatividade). ";

      if (result === "TDAH Combinado") {
        text +=
          "Os sintomas de desatenção e hiperatividade/impulsividade estão presentes de forma significativa. ";
      } else if (result === "TDAH Tipo Desatento") {
        text += "Predominam sintomas de desatenção. ";
      } else {
        text += "Predominam sintomas de hiperatividade/impulsividade. ";
      }
      text +=
        "Recomenda-se avaliação médica especializada para diagnóstico definitivo.\n\n";
    } else {
      text +=
        "Os resultados da Escala SNAP-IV NÃO são sugestivos de TDAH no momento da avaliação.\n\n";
    }
  }

  if (
    relatorio.adaptiveBehaviorScaleDI &&
    relatorio.adaptiveBehaviorScaleDI.result !== "Sem atraso no desenvolvimento" &&
    relatorio.adaptiveBehaviorScaleDI.result !== "Nenhum(a)"
  ) {
    text +=
      "A avaliação indica SUGESTIVO DE LIMITAÇÃO NO COMPORTAMENTO ADAPTATIVO, com prejuízos significativos em pelo menos duas áreas do funcionamento adaptativo. ";
    text +=
      "Isso sugere necessidade de suporte especializado para o desenvolvimento de habilidades práticas do dia a dia.\n\n";
  }

  return text;
};

export const generateRecommendationsText = (
  relatorio: RelatorioPsicologico,
): string => {
  const recommendations: string[] = [];

  if (
    relatorio.snapIVQuestionnaire?.result &&
    (relatorio.snapIVQuestionnaire?.result === "TDAH Tipo Desatento" ||
      relatorio.snapIVQuestionnaire?.result ===
        "TDAH Tipo Hiperativo/Impulsivo" ||
      relatorio.snapIVQuestionnaire?.result === "TDAH Combinado")
  ) {
    recommendations.push(
      "Encaminhamento para avaliação médica neurológica ou psiquiátrica para confirmação diagnóstica de TDAH",
    );
    recommendations.push(
      "Adaptações pedagógicas para favorecer a atenção e concentração",
    );
    recommendations.push("Estabelecimento de rotinas estruturadas");
  }

  if (
    relatorio.adaptiveBehaviorScaleDI &&
    relatorio.adaptiveBehaviorScaleDI.result !==
      "Sem atraso no desenvolvimento" &&
    relatorio.adaptiveBehaviorScaleDI.result !== "Nenhum(a)"
  ) {
    recommendations.push("Acompanhamento psicopedagógico especializado");
    recommendations.push(
      "Desenvolvimento de programa individualizado de ensino (PEI)",
    );
    recommendations.push(
      "Parceria família-escola para estimulação de habilidades adaptativas",
    );
  }

  recommendations.push("Reavaliação periódica para acompanhamento da evolução");

  return recommendations.map((rec, index) => `${index + 1}. ${rec}`).join("\n");
};
