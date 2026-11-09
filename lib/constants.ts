export const ROLES = {
  ADMIN: "admin",
  SECRETARY: "secretary",
  TEACHER: "teacher",
  COORDINATOR: "coordinator",
  PRINCIPAL: "principal",
  MUNICIPAL_MANAGER: "municipalmanager",
  PSYCHOLOGIST: "psychologist",
  SOCIAL_WORK: "socialwork",
  PSYCHOPEDAGOGUE: "psychopedagogue",
};

export const API_ENDPOINTS = {
  [ROLES.PSYCHOLOGIST]: "/api/v1/reports/psychologist",
  [ROLES.SOCIAL_WORK]: "/api/v1/reports/socialworker",
  [ROLES.PSYCHOPEDAGOGUE]: "/api/v1/reports/psychopedagogue",
};

export const API_ENDPOINTS_UPDATE = {
  [ROLES.PSYCHOLOGIST]: "/api/v1/reports/psychologist",
  [ROLES.SOCIAL_WORK]: "/api/v1/reports/socialworker",
  [ROLES.PSYCHOPEDAGOGUE]: "/api/v1/reports/psychopedagogue",
};

export const FIELDS_TO_VALIDATE = {
  [ROLES.PSYCHOLOGIST]: [
    "instruments",
    "cognitiveDevelopment",
    "emotionalDevelopment",
    "socialDevelopment",
    "conclusion",
    "recommendations",
  ],
  [ROLES.SOCIAL_WORK]: [
    "familyContext",
    "socioEconomicConditions",
    "accessToServices",
    "conclusion",
    "recommendations",
  ],
  [ROLES.PSYCHOPEDAGOGUE]: [
    "context",
    "methodology",
    "observation",
    "cognitiveDevelopmentAttention",
    "cognitiveDevelopmentMemory",
    "cognitiveDevelopmentLogicalReasoning",
    "typeOfDisability",
    "justificationForClassification",
    "conclusion",
    "recommendationsForPEIAndPAEE",
  ],
};

export const AREA_MAP: Record<string, string> = {
  autocuidado: "auto-cuidados",
  "desenvolvimento global": "desenvolvimento-global",
  "desenvolvimento motor": "desenvolvimento-motor",
  socialização: "socializacao",
  linguagem: "linguagem",
  cognição: "cognição",
};

export const faixasEtarias = [
  { label: "0 a 1 ano", min: 0, max: 11 },
  { label: "1 a 2 anos", min: 12, max: 23 },
  { label: "2 a 3 anos", min: 24, max: 35 },
  { label: "3 a 4 anos", min: 36, max: 47 },
  { label: "4 a 5 anos", min: 48, max: 59 },
  { label: "5 a 6 anos", min: 60, max: 73 },
  { label: "7 anos ou mais", min: 84, max: 9999 },
];

export const perguntasSNAPIV = [
  "Não consegue prestar muita atenção a detalhes ou comete erros por descuido nos trabalhos da escola ou tarefas",
  "Tem dificuldade de manter a atenção em tarefas ou atividades de lazer",
  "Parece não estar ouvindo quando se fala diretamente com ele",
  "Não segue instruções até o fim e não termina deveres de escola, tarefas ou obrigações",
  "Tem dificuldade para organizar tarefas e atividades",
  "Evita, não gosta ou se envolve contra a vontade em tarefas que exigem esforço mental prolongado",
  "Perde coisas necessárias para atividades (p. ex: brinquedos, deveres da escola, lápis ou livros)",
  "Distrai-se com estímulos externos",
  "É esquecido em atividades do dia-a-dia",
  "Mexe com as mãos ou pés ou se remexe na cadeira",
  "Sai do lugar na sala de aula ou em outras situações em que se espera que fique sentado",
  "Corre de um lado para outro ou sobe demais nas coisas em situações em que isto é inapropriado",
  "Tem dificuldade em brincar ou envolver-se em atividades de lazer de forma calma",
  "Não pára ou freqüentemente está a “mil por hora”",
  "Fala em excesso",
  "Responde as perguntas de forma precipitada antes delas terem sido terminadas",
  "Tem dificuldade de esperar sua vez",
  "Interrompe os outros ou se intromete (por exemplo: intromete-se nas conversas, jogos, etc.)",
];

export const perguntasMCHATR = [
  "Se você apontar para algum objeto no quarto, o seu filho olha para este objeto? (POR EXEMPLO, se você apontar para um brinquedo ou animal, o seu filho olha para o brinquedo ou para o animal?)",
  "Alguma vez você se perguntou se o seu filho pode ser surdo?",
  "O seu filho brinca de faz de contas? (POR EXEMPLO, faz de conta que bebe em um copo vazio, faz de conta que fala ao telefone, faz de conta que dá comida a uma boneca ou a um bichinho de pelúcia?)",
  "O seu filho gosta de subir nas coisas? (POR EXEMPLO, móveis, brinquedos em parques ou escadas)",
  "O seu filho faz movimentos estranhos com os dedos perto dos olhos? (POR EXEMPLO, mexe os dedos em frente aos olhos e fica olhando para os mesmos?)",
  "O seu filho aponta com o dedo para pedir algo ou para conseguir ajuda? (POR EXEMPLO, aponta para um biscoito ou brinquedo fora do alcance dele?)",
  "O seu filho aponta com o dedo para mostrar algo interessante para você? (POR EXEMPLO, aponta para um avião no céu ou um caminhão grande na rua)",
  "O seu filho se interessa por outras crianças? (POR EXEMPLO, seu filho olha para outras crianças, sorri para elas ou se aproxima delas?)",
  "O seu filho traz coisas para mostrar para você ou as segura para que você as veja - não para conseguir ajuda, mas apenas para compartilhar? (POR EXEMPLO, para mostrar uma flor, um bichinho de pelúcia ou um caminhão de brinquedo)",
  "O seu filho responde quando você o chama pelo nome? (POR EXEMPLO, ele olha para você, fala ou emite algum som, ou para o que está fazendo quando você o chama pelo nome?)",
  "Quando você sorri para o seu filho, ele sorri de volta para você?",
  "O seu filho fica muito incomodado com barulhos do dia a dia? (POR EXEMPLO, seu filho grita ou chora ao ouvir barulhos como os de liquidificador ou de música alta?)",
  "O seu filho anda?",
  "O seu filho olha nos seus olhos quando você está falando ou brincando com ele/ela, ou vestindo a roupa dele/dela?",
  "O seu filho tenta imitar o que você faz? (POR EXEMPLO, quando você dá tchau, ou bate palmas, ou joga um beijo, ele repete o que você faz?)",
  "Quando você vira a cabeça para olhar para alguma coisa, o seu filho olha ao redor para ver o que você está olhando?",
  "O seu filho tenta fazer você olhar para ele/ela? (POR EXEMPLO, o seu filho olha para você para ser elogiado/aplaudido, ou diz: “olha mãe!” ou “óh mãe!”)",
  "O seu filho compreende quando você pede para ele/ela fazer alguma coisa? (POR EXEMPLO, se você não apontar, o seu filho entende quando você pede: “coloca o copo na mesa” ou “liga a televisão”)?",
  "Quando acontece algo novo, o seu filho olha para o seu rosto para ver como você se sente sobre o que aconteceu? (POR EXEMPLO, se ele/ela ouve um barulho estranho ou vê algo engraçado, ou vê um brinquedo novo, será que ele/ela olharia para seu rosto?)",
  "O seu filho gosta de atividades de movimento? (POR EXEMPLO, ser balançado ou pular em seus joelhos).",
];

export const perguntasAdaptativeDIScale = [
  "Demonstra compreensão de leitura adequada para idade?",
  "Consegue realizar cálculos matemáticos básicos?",
  "Compreende conceitos de tempo (horas, dias, meses)?",
  "Consegue seguir instruções de múltiplas etapas?",
  "Interage apropriadamente com colegas?",
  "Reconhece emoções em si e nos outros?",
  "Segue regras sociais básicas?",
  "Resolve conflitos de forma adequada?",
  "Cuida de higiene pessoal de forma independente?",
  "Organiza seus materiais escolares?",
  "Consegue se vestir adequadamente?",
  "Demonstra segurança em ambientes conhecidos?",
];

export const opcoesAdaptativeDIScale = ["Ainda Não", "Com Mediação", "Sozinho"];

export const opcoesSnapIV = [
  "Nem um pouco",
  "Só um pouco",
  "Bastante",
  "Demais",
];

export const opcoesCARS = ["1", "1.5", "2", "2.5", "3", "3.5", "4"];

export const opcoesMCHATR = ["Sim", "Não"];

export const opcoesMCHATRF = ["Passou", "Falhou"];

export const roleLabels: Record<string, string> = {
  Admin: "Administrador(a)",
  Secretary: "Secretário(a)",
  SocialWork: "Serviço Social",
  Psychologist: "Psicólogo(a)",
  Psychopedagogue: "Psicopedagogo(a)",
  Teacher: "Professor(a)",
  Coordinator: "Coordenador(a)",
  Principal: "Diretor(a) de Escola",
  MunicipalManager: "Gestor(a) Municipal",
};

export const estados = [
  { nome: "Acre", sigla: "AC" },
  { nome: "Alagoas", sigla: "AL" },
  { nome: "Amapá", sigla: "AP" },
  { nome: "Amazonas", sigla: "AM" },
  { nome: "Bahia", sigla: "BA" },
  { nome: "Ceará", sigla: "CE" },
  { nome: "Distrito Federal", sigla: "DF" },
  { nome: "Espírito Santo", sigla: "ES" },
  { nome: "Goiás", sigla: "GO" },
  { nome: "Maranhão", sigla: "MA" },
  { nome: "Mato Grosso", sigla: "MT" },
  { nome: "Mato Grosso do Sul", sigla: "MS" },
  { nome: "Minas Gerais", sigla: "MG" },
  { nome: "Pará", sigla: "PA" },
  { nome: "Paraíba", sigla: "PB" },
  { nome: "Paraná", sigla: "PR" },
  { nome: "Pernambuco", sigla: "PE" },
  { nome: "Piauí", sigla: "PI" },
  { nome: "Rio de Janeiro", sigla: "RJ" },
  { nome: "Rio Grande do Norte", sigla: "RN" },
  { nome: "Rio Grande do Sul", sigla: "RS" },
  { nome: "Rondônia", sigla: "RO" },
  { nome: "Roraima", sigla: "RR" },
  { nome: "Santa Catarina", sigla: "SC" },
  { nome: "São Paulo", sigla: "SP" },
  { nome: "Sergipe", sigla: "SE" },
  { nome: "Tocantins", sigla: "TO" },
];

export const tiposDeficiencia = [
  { id: "Deficiência Intelectual", nome: "Intelectual" },
  { id: "Deficiência Física", nome: "Física" },
  { id: "Deficiência Auditiva", nome: "Auditiva" },
  { id: "Deficiência Visual", nome: "Visual" },
  { id: "Deficiência Múltipla", nome: "Múltipla" },
  { id: "Transtorno do Espectro Autista", nome: "Espectro Autista" },
  { id: "Altas Habilidades/Superdotação", nome: "Superdotação" },
  { id: "TDAH", nome: "TDAH" },
];

export type DashBoardFilters = {
  sex?: string;
  state?: string;
  city?: string;
  schoolID?: string;
  minimalAge?: string;
  maximumAge?: string;
  registrationType?: string;
  disability?: string;
  month?: string;
  year?: string;
};

export type StatisticsFilters = {
  sex?: string;
  state?: string;
  city?: string;
  schoolID?: string;
  ageGroup?: string;
  year: string;
  registrationType?: string;
  disability?: string;
};

export const skinColor = ["Branco", "Preto", "Pardo", "Indígena", "Amarelo"];

export const maritalStatus = ["Casado", "Divorciado", "Solteiro", "Viúvo"];

export const tipoAeeOptions = [
  "Sala de Recursos Multifuncional",
  "Intérprete na Sala Regular",
  "Professor de Libras",
  "Tutor em Sala de Aula Regular",
  "Domiciliar",
  "Hospitalar",
  "Outro",
];

export const frequencialSemanalOptions = [
  "2 Vezes por Semana",
  "3 Vezes por Semana",
  "4 Vezes por Semana",
  "5 Vezes por Semana",
  "Todo o Período de Aula",
  "Outra",
];

export const tempoAtendimentoOptions = [
  "60 Minutos por Atendimento",
  "Durante Todas as Aulas, na Própria Sala de Aula",
  "Outro",
];

export const composicaoOptions = [
  "Atendimento Individual",
  "Atendimento Grupal",
  "Atendimento na Própria Sala de Aula, com Todos os Alunos",
];

export const profissionaisOptions = [
  "Fonoaudiologia",
  "Psicologia",
  "Assistência Social",
  "Área Médica",
  "Outro",
];

export const atividadesAEEOptions = [
  "Adequação de Material (Textos Simplificados, Jogos Pedagógicos)",
  "Jogos de Memória, Bingo de Palavras, Atividades de Pareamento",
  "Uso de Computador com Software de Alfabetização",
  "Uso de Materiais Manipuláveis (Alfabeto Móvel, Blocos Lógicos)",
];

export const metodologiaOptions = [
  "Uso de Atividades Lúdicas, Interativas e Baseadas em Situações do Cotidiano",
  "Adaptação de Conteúdo com Foco na Funcionalidade",
  "Aplicação de Atividades Práticas para Estimular a Autonomia nas Rotinas Escolares",
  "Estratégias Visuais e Concretas para Facilitar a Compreensão",
];

export const recursosOptions = [
  "Jogos Educativos de Associação",
  "Alfabetos Móveis",
  "Cartões com Imagens e Palavras",
  "Material Concreto de Matemática (Cubos, Blocos Lógicos)",
  "Computador com Programas de Alfabetização",
];

export const criteriosOptions = [
  "Evolução na Atenção Durante as Atividades",
  "Melhora na Leitura de Palavras de uso Cotidiano",
  "Desenvolvimento de Maior Autonomia para Realizar Tarefas Escolares",
  "Participação mais Ativa nas Atividades em Grupo",
  "Redução de Comportamentos de Evitação de Tarefas",
];

export const tipoMoradias = [
  "Casa de alvenaria (tijolo, concreto, bloco)",
  "Casa de madeira",
  "Casa de taipa (pau a pique, adobe)",
  "Apartamento",
  "Casa em estrutura metálica (container, steel frame)",
  "Moradia sustentável (bambu, palha, bioconstrução)",
  "Barraco/construção precária (lata, madeirite, plástico)",
  "Casa móvel (trailer, ocupação temporária)",
];

export const estrategiasOptions = [
  "Uso de Imagens e Pictogramas para Apoio Visual",
  "Utilização de Agenda Visual com Rotinas Diárias",
  "Organizadores Gráficos (Mapas Mentais, Diagramas)",
  "Material Tátil e Concreto para Facilitar Conceitos",
  "Rotinas Estruturadas e Previsíveis",
  "Reforço Positivo Frequente",
  "Divisão das Tarefas em Pequenas Etapas",
  "Uso de Vídeos Educativos com Linguagem Acessível",
  "Apoio de Colegas Tutores Durante as Atividades",
  "Uso de Recursos Auditivos (Fones, Gravadores)",
  "Adaptação de Avaliações (Leitura Oral, Tempo Extra)",
  "Ambiente Estruturado e Livre de Distrações",
  "Repetição e Revisão Constante dos Conteúdos",
];

export const screeningSections = [
  {
    title: "Linguagem (Compreensão e Expressão Verbal)",
    questions: [
      {
        label: "Usa frases muito simples ou vocabulário limitado para a idade?",
        field: "limitedVocabulary",
        obs: "limitedVocabularyObservation",
        type: "boolean",
      },
      {
        label: "Apresenta fala infantilizada ou incompreensível?",
        field: "childlikeSpeech",
        obs: "childlikeSpeechObservation",
        type: "boolean",
      },
      {
        label: "Tem dificuldade em seguir comandos simples?",
        field: "difficultyFollowingCommands",
        obs: "difficultyFollowingCommandsObservation",
        type: "boolean",
      },
      {
        label: "Demora para responder ou parece não entender o que é dito?",
        field: "delayedResponse",
        obs: "delayedResponseObservation",
        type: "boolean",
      },
      {
        label: "Evita conversar ou interagir verbalmente com colegas?",
        field: "avoidsTalking",
        obs: "avoidsTalkingObservation",
        type: "boolean",
      },
    ],
  },
  {
    title: "Escrita",
    questions: [
      {
        label: "Apresenta dificuldade para copiar palavras/frases da lousa?",
        field: "difficultyCopying",
        obs: "difficultyCopyingObservation",
        type: "boolean",
      },
      {
        label: "Comete erros ortográficos acima do esperado para a idade?",
        field: "excessiveSpellingErrors",
        obs: "excessiveSpellingErrorsObservation",
        type: "boolean",
      },
      {
        label: "Mostra escrita desorganizada, ilegível ou muito lenta?",
        field: "writingIssues",
        obs: "writingIssuesObservation",
        type: "boolean",
      },
      {
        label: "Dificuldade em associar sons às letras?",
        field: "phoneticAssociationDifficulty",
        obs: "phoneticAssociationDifficultyObservation",
        type: "boolean",
      },
      {
        label: "Nível de escrita",
        field: "writingLevel",
        obs: "writingLevelObservation",
        type: "options",
        options: [
          { label: "Pré-silábico", value: "Pré-silábico" },
          { label: "Silábico", value: "Silábico" },
          { label: "Silábico-alfabético", value: "Silábico-alfabético" },
          { label: "Alfabético", value: "Alfabético" },
        ],
      },
    ],
  },
  {
    title: "Leitura",
    questions: [
      {
        label: "Reconhece letras ou palavras já trabalhadas?",
        field: "recognizesLettersOrWords",
        obs: "recognizesLettersOrWordsObservation",
        type: "boolean",
      },
      {
        label: "Leitura silabada, lenta e sem compreensão?",
        field: "readingFluencyIssues",
        obs: "readingFluencyIssuesObservation",
        type: "boolean",
      },
      {
        label: "Responde perguntas sobre o que leu?",
        field: "answersReadingQuestions",
        obs: "answersReadingQuestionsObservation",
        type: "boolean",
      },
      {
        label: "Evita atividades de leitura?",
        field: "avoidsReading",
        obs: "avoidsReadingObservation",
        type: "boolean",
      },
    ],
  },
  {
    title: "Raciocínio Lógico e Habilidades Numéricas",
    questions: [
      {
        label: "Reconhece números ou erra a contagem?",
        field: "numberRecognitionIssues",
        obs: "numberRecognitionIssuesObservation",
        type: "boolean",
      },
      {
        label: "Compreende conceitos como maior/menor, primeiro/último?",
        field: "comparisonConceptDifficulty",
        obs: "comparisonConceptDifficultyObservation",
        type: "boolean",
      },
      {
        label: "Dificuldade com operações básicas mesmo com apoio visual?",
        field: "basicOperationDifficulty",
        obs: "basicOperationDifficultyObservation",
        type: "boolean",
      },
      {
        label: "Entende noções de tempo ou espaço (ontem/hoje, longe/perto)?",
        field: "timeSpaceConceptDifficulty",
        obs: "timeSpaceConceptDifficultyObservation",
        type: "boolean",
      },
    ],
  },
  {
    title: "Autonomia / Funcionamento Adaptativo",
    questions: [
      {
        label: "Dificuldade para organizar seus materiais?",
        field: "difficultyOrganizingMaterials",
        obs: "difficultyOrganizingMaterialsObservation",
        type: "boolean",
      },
      {
        label:
          "Necessita ajuda para atividades básicas (ir ao banheiro, recortar)?",
        field: "needsHelpWithBasicActivities",
        obs: "needsHelpWithBasicActivitiesObservation",
        type: "boolean",
      },
      {
        label: "Dificuldade para seguir rotinas da sala?",
        field: "difficultyWithRoutines",
        obs: "difficultyWithRoutinesObservation",
        type: "boolean",
      },
      {
        label: "Não inicia tarefas sozinho, mesmo após instruções?",
        field: "doesNotInitiateTasks",
        obs: "doesNotInitiateTasksObservation",
        type: "boolean",
      },
    ],
  },
  {
    title: "Sincronia entre Idade Mental e Cronológica",
    questions: [
      {
        label: "Comportamentos infantis ou imaturos em comparação com a turma?",
        field: "immatureBehavior",
        obs: "immatureBehaviorObservation",
        type: "boolean",
      },
      {
        label: "Prefere brincar com crianças mais novas?",
        field: "prefersYoungerChildren",
        obs: "prefersYoungerChildrenObservation",
        type: "boolean",
      },
      {
        label: "Desempenho geral parece compatível com faixa etária inferior?",
        field: "belowAgeLevelPerformance",
        obs: "belowAgeLevelPerformanceObservation",
        type: "boolean",
      },
      {
        label: "Habilidades semelhantes às de crianças da educação infantil?",
        field: "earlyChildhoodSkillLevel",
        obs: "earlyChildhoodSkillLevelObservation",
        type: "boolean",
      },
    ],
  },
  {
    title: "Memória e Atenção",
    questions: [
      {
        label: "Esquece o que foi ensinado no dia anterior?",
        field: "forgetsContent",
        obs: "forgetsContentObservation",
        type: "boolean",
      },
      {
        label: "Dificuldade de manter a atenção nas atividades?",
        field: "attentionDifficulty",
        obs: "attentionDifficultyObservation",
        type: "boolean",
      },
      {
        label: "Distração fácil com estímulos externos?",
        field: "easilyDistracted",
        obs: "easilyDistractedObservation",
        type: "boolean",
      },
      {
        label: "Requer explicações repetidas para entender?",
        field: "needsRepeatedExplanations",
        obs: "needsRepeatedExplanationsObservation",
        type: "boolean",
      },
    ],
  },
  {
    title: "Interação Social e Emocional",
    questions: [
      {
        label: "Dificuldade para fazer ou manter amizades?",
        field: "friendshipDifficulty",
        obs: "friendshipDifficultyObservation",
        type: "boolean",
      },
      {
        label: "Frustra-se com facilidade; pode reagir com agressividade?",
        field: "easilyFrustrated",
        obs: "easilyFrustratedObservation",
        type: "boolean",
      },
      {
        label: "Demonstra baixa autoestima ou medo de errar?",
        field: "lowSelfEsteem",
        obs: "lowSelfEsteemObservation",
        type: "boolean",
      },
      {
        label: "Depende de adultos para resolver conflitos simples?",
        field: "dependsOnAdults",
        obs: "dependsOnAdultsObservation",
        type: "boolean",
      },
    ],
  },
  {
    title: "Histórico Educacional e Funcional",
    questions: [
      {
        label:
          "Apresenta histórico de baixo desempenho escolar desde os primeiros anos?",
        field: "lowAcademicHistory",
        obs: "lowAcademicHistoryObservation",
        type: "boolean",
      },
      {
        label: "Recebeu apoio pedagógico sem evolução significativa?",
        field: "noProgressWithSupport",
        obs: "noProgressWithSupportObservation",
        type: "boolean",
      },
      {
        label:
          "Há registros de pareceres ou relatórios anteriores que apontam comprometimento intelectual?",
        field: "previousReportsIndicateImpairment",
        obs: "previousReportsIndicateImpairmentObservation",
        type: "boolean",
      },
      {
        label: "A escola já realizou adaptações curriculares para esse aluno?",
        field: "curricularAdaptations",
        obs: "curricularAdaptationsObservation",
        type: "boolean",
      },
    ],
  },
];

export const CognitiveAssessmentSections = [
  {
    title: "Raciocínio Perceptual",
    questions: [
      {
        label: "1.1. Identifica cores básicas corretamente",
        field: "identifiedBasicColors",
        type: "string",
      },
      {
        label: "1.2. Identifica formas geométricas simples",
        field: "identifiedBasicShapes",
        type: "string",
      },
      {
        label: "1.3. Completa quebra-cabeças apropriados para a idade",
        field: "completesAgeAppropriatePuzzles",
        type: "string",
      },
      {
        label: "1.4. Agrupa objetos por características semelhantes",
        field: "groupsObjectsBySimilarCharacteristics",
        type: "string",
      },
      {
        label: "1.5. Identifica padrões em sequências visuais",
        field: "identifiesVisualSequencePatterns",
        type: "string",
      },
    ],
  },
  {
    title: "Raciocínio Verbal",
    questions: [
      {
        label: "2.1. Compreende instruções verbais simples",
        field: "understandsSimpleVerbalInstructions",
        type: "string",
      },
      {
        label: "2.2. Nomeia objetos comuns do cotidiano",
        field: "namesCommonEverydayObjects",
        type: "string",
      },
      {
        label: "2.3. Forma frases apropriadas para a idade",
        field: "formsAgeAppropriateSentences",
        type: "string",
      },
      {
        label: "2.4. Responde perguntas sobre informações familiares",
        field: "answersQuestionsAboutFamilyInformation",
        type: "string",
      },
      {
        label:
          "2.5. Entende conceitos abstratos básicos (grande/pequeno, dentro/fora)",
        field: "understandsBasicAbstractConcepts",
        type: "string",
      },
    ],
  },
  {
    title: "Memória e Atenção",
    questions: [
      {
        label: "3.1. Lembra-se de instruções com 2-3 etapas",
        field: "remembersTwoToThreeStepInstructions",
        type: "string",
      },
      {
        label: "3.2. Mantém atenção em atividades por período adequado",
        field: "maintainsAttentionForAppropriateDuration",
        type: "string",
      },
      {
        label: "3.3. Reconhece pessoas e lugares familiares",
        field: "recognizesFamiliarPeopleAndPlaces",
        type: "string",
      },
      {
        label: "3.4. Recorda eventos recentes",
        field: "recallsRecentEvents",
        type: "string",
      },
      {
        label: "3.5. Consegue repetir sequências simples",
        field: "repeatsSimpleSequences",
        type: "string",
      },
    ],
  },
  {
    title: "Resolução de Problemas",
    questions: [
      {
        label: "4.1. Busca soluções para problemas simples do dia a dia",
        field: "seeksSolutionsToSimpleEverydayProblems",
        type: "string",
      },
      {
        label: "4.2. Demonstra criatividade nas brincadeiras",
        field: "demonstratesCreativityInPlay",
        type: "string",
      },
      {
        label: "4.3. Aprende com a experiência",
        field: "learnsFromExperience",
        type: "string",
      },
      {
        label: "4.4. Compreende relações de causa e efeito",
        field: "understandsCauseAndEffectRelationships",
        type: "string",
      },
      {
        label: "4.5. Adapta estratégias quando algo não funciona",
        field: "adaptsStrategiesWhenSomethingDoesNotWork",
        type: "string",
      },
    ],
  },
];

export const opcoesCognitiveAssessment = ["Sim", "Às Vezes", "Não"];
