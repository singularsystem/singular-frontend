import { MCHATQuestionnaire } from "@/types/mchat";
import { SNAPIVQuestionnaire } from "@/types/snapiv";

export const scoreCARSRanges = [
  {
    label: "Até 30",
    result: "AUSÊNCIA DE INDÍCIOS DE AUTISMO",
    color: "bg-green-50 border-green-300",
    textColor: "text-green-800",
    description:
      "A pontuação indica que a criança não apresenta características significativas do espectro autista. Continuar com o acompanhamento de desenvolvimento regular.",
  },
  {
    label: "30 até 36.5",
    result: "AUTISMO LEVE A MODERADO",
    color: "bg-yellow-50 border-yellow-300",
    textColor: "text-yellow-800",
    description:
      "A pontuação sugere características de autismo leve a moderado. É recomendada avaliação diagnóstica aprofundada e intervenções terapêuticas adequadas ao perfil da criança.",
  },
  {
    label: "37 até 60",
    result: "AUTISMO MODERADO A SEVERO",
    color: "bg-red-50 border-red-300",
    textColor: "text-red-800",
    description:
      "A pontuação indica características de autismo moderado a severo. É fundamental encaminhamento imediato para avaliação diagnóstica especializada e início de intervenções intensivas e multidisciplinares.",
  },
];

export const getMCHATResultInterpretation = (
  questionario: MCHATQuestionnaire,
) => {
  const totalScore = questionario.score;

  if (totalScore >= 0 && totalScore <= 2) {
    return {
      risk: "Baixo Risco",
      result: "NÃO SUGESTIVO PARA TEA",
      color: "bg-green-50 border-green-300",
      textColor: "text-green-800",
      recommendation:
        "Pontuação total de 0 a 2. Não é necessária nenhuma outra medida, a menos que a vigilância indique risco de TEA. Se a criança tiver menos de 24 meses, o M-CHAT-R deve ser repetido aos 24 meses.",
    };
  } else if (totalScore >= 3 && totalScore <= 7) {
    return {
      risk: "Risco Moderado",
      result: "SUGESTIVO PARA TEA - REQUER AVALIAÇÃO COMPLEMENTAR",
      color: "bg-yellow-50 border-yellow-300",
      textColor: "text-yellow-800",
      recommendation:
        "Pontuação total de 3 a 7. É recomendada a administração da Entrevista de Seguimento (segunda etapa do M-CHAT-R/F) para obter informações adicionais. A criança deve ser encaminhada para avaliação diagnóstica especializada.",
    };
  } else {
    return {
      risk: "Alto Risco",
      result: "SUGESTIVO PARA TEA",
      color: "bg-red-50 border-red-300",
      textColor: "text-red-800",
      recommendation:
        "Pontuação total de 8 a 20. Encaminhar a criança diretamente para avaliação diagnóstica especializada e possível intervenção precoce.",
    };
  }
};

const inattentionKeys: (keyof SNAPIVQuestionnaire)[] = [
  "hasCarelessMistakes",
  "hasDifficultySustainingAttention",
  "appearsNotToListenWhenSpokenToDirectly",
  "failsToFollowThroughOnInstructions",
  "hasDifficultyOrganizingTasksAndActivities",
  "avoidsTasksRequiringSustainedMentalEffort",
  "oftenLosesItemsNecessaryForTasks",
  "easilyDistractedByExternalStimuli",
  "forgetfulInDailyActivities",
];

const hyperactivityKeys: (keyof SNAPIVQuestionnaire)[] = [
  "fidgetsWithHandsOrFeet",
  "leavesSeatInSituationsRequiringSitting",
  "runsOrClimbsInappropriately",
  "hasDifficultyPlayingQuietly",
  "oftenOnTheGoOrActsAsDrivenByAMotor",
  "talksExcessively",
  "blurtsOutAnswers",
  "hasDifficultyWaitingTurn",
  "interruptsOrIntrudesOnOthers",
];

export const calculateSnapIVResults = (questionario: SNAPIVQuestionnaire) => {
  const countMarked = (keys: (keyof SNAPIVQuestionnaire)[]) =>
    keys.reduce((sum, key) => {
      const raw = questionario?.[key];
      const value = Number(raw ?? 0);
      return sum + (value >= 2 ? 1 : 0);
    }, 0);

  const inattentionScore = countMarked(inattentionKeys);
  const hyperactivityScore = countMarked(hyperactivityKeys);

  return {
    inattention: inattentionScore,
    hyperactivity: hyperactivityScore,
    hasInattention: inattentionScore >= 6,
    hasHyperactivity: hyperactivityScore >= 6,
  };
};

export const domainsAdaptativeDI = [
  {
    title: "Habilidades Conceituais",
    items: [
      "scoreConceptualSkills",
      "percentageConceptualSkills",
      "maxPointsConceptualSkills",
    ],
  },
  {
    title: "Habilidades Sociais",
    items: [
      "scoreSocialSkills",
      "percentageSocialSkills",
      "maxPointsSocialSkills",
    ],
  },
  {
    title: "Habilidades Práticas",
    items: [
      "scorePracticalSkills",
      "percentagePracticalSkills",
      "maxPointsPracticalSkills",
    ],
  },
];

export const domainsCognitiveAssessment = [
  {
    title: "Habilidades Conceituais",
    items: [
      "Demonstra compreensão de leitura adequada para idade",
      "Consegue realizar cálculos matemáticos básicos",
      "Compreende conceitos de tempo (horas, dias, meses)",
      "Consegue seguir instruções de múltiplas etapas",
    ],
  },
  {
    title: "Habilidades Sociais",
    items: [
      "Interage apropriadamente com colegas",
      "Reconhece emoções em si e nos outros",
      "Segue regras sociais básicas",
      "Resolve conflitos de forma adequada",
    ],
  },
  {
    title: "Habilidades Práticas",
    items: [
      "Cuida de higiene pessoal de forma independente",
      "Organiza seus materiais escolares",
      "Consegue se vestir adequadamente",
      "Demonstra segurança em ambientes conhecidos",
    ],
  },
];

export const getAdaptativeDIInterpretation = (percentage: number) => {
  if (percentage >= 80)
    return {
      level: "Adequado",
      color: "text-green-700",
      bg: "bg-green-50",
      border: "border-emerald-300",
    };
  if (percentage >= 60)
    return {
      level: "Parcial",
      color: "text-yellow-700",
      bg: "bg-yellow-50",
      border: "border-yellow-300",
    };
  return {
    level: "Necessita Apoio",
    color: "text-orange-700",
    bg: "bg-orange-50",
    border: "border-orange-300",
  };
};

export const getCognitiveAssesmentResultInterpretation = (
  percentage: number,
) => {
  if (percentage >= 85) {
    return {
      level: "Funcionamento Intelectual Adequado",
      result: "DESENVOLVIMENTO COGNITIVO DENTRO DO ESPERADO",
      color: "bg-green-50 border-green-300",
      textColor: "text-green-800",
      hasLimitation: false,
      description:
        "A criança apresenta desempenho cognitivo adequado para a faixa etária em todos os domínios avaliados. Continue estimulando o desenvolvimento através de atividades desafiadoras apropriadas para a idade.",
    };
  } else if (percentage >= 70) {
    return {
      level: "Funcionamento Intelectual Limítrofe",
      result: "DESENVOLVIMENTO COGNITIVO LIMÍTROFE - ATENÇÃO NECESSÁRIA",
      color: "bg-yellow-50 border-yellow-300",
      textColor: "text-yellow-800",
      hasLimitation: false,
      description:
        "A criança apresenta desempenho cognitivo no limite inferior da faixa esperada. Recomenda-se avaliação mais detalhada e intervenções de estímulo nas áreas com maior dificuldade. Acompanhamento regular é essencial.",
    };
  } else if (percentage >= 55) {
    return {
      level: "Limitação Intelectual Leve",
      result: "SUGESTIVO DE LIMITAÇÃO INTELECTUAL LEVE",
      color: "bg-orange-50 border-orange-300",
      textColor: "text-orange-800",
      hasLimitation: true,
      description:
        "A criança apresenta desempenho cognitivo significativamente abaixo do esperado para a idade. É fundamental avaliação diagnóstica aprofundada por equipe multidisciplinar e implementação de plano de intervenção individualizado com apoio especializado.",
    };
  } else {
    return {
      level: "Limitação Intelectual Moderada a Severa",
      result: "SUGESTIVO DE LIMITAÇÃO INTELECTUAL MODERADA A SEVERA",
      color: "bg-red-50 border-red-300",
      textColor: "text-red-800",
      hasLimitation: true,
      description:
        "A criança apresenta desempenho cognitivo muito abaixo do esperado em múltiplos domínios. É essencial encaminhamento imediato para avaliação diagnóstica especializada e início de intervenções intensivas. Suporte educacional especializado e acompanhamento multidisciplinar são fundamentais.",
    };
  }
};
