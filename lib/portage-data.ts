export interface PortageQuestion {
  question: string;
  category: string;
  suggestion_ainda_nao?: string;
  suggestion_com_mediacao?: string;
}

export const portageData: Record<string, PortageQuestion[]> = {
  "0-1": [
    {
      question: "A criança observa um rosto por 2 segundos?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Posicione-se próximo ao rosto da criança, fale suavemente e aguarde o contato visual.",
      suggestion_com_mediacao:
        "Continue estimulando o contato visual em diferentes momentos do dia.",
    },
    {
      question:
        "A criança responde à voz humana parando de chorar ou movimentando-se?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Fale com a criança em tom calmo quando ela estiver agitada, observe suas reações.",
      suggestion_com_mediacao:
        "Varie o tom de voz e observe como a criança responde a diferentes entonações.",
    },
    {
      question: "A criança sorri em resposta ao rosto de um adulto?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Passe tempo face a face com a criança, faça expressões exageradas e sorria.",
      suggestion_com_mediacao:
        "Continue interagindo face a face, aguarde a resposta da criança antes de continuar.",
    },
    {
      question: "A criança vocaliza em resposta à atenção do adulto?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Converse com a criança, imite seus sons e aguarde sua resposta vocal.",
      suggestion_com_mediacao:
        "Crie 'conversas' de ida e volta, respondendo aos sons da criança.",
    },
    {
      question: "A criança sorri espontaneamente?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Observe a criança em momentos relaxados, estimule com brincadeiras suaves.",
      suggestion_com_mediacao:
        "Continue proporcionando momentos prazerosos para estimular sorrisos.",
    },
    {
      question:
        "A criança sorri em resposta à voz do adulto (sem ver o rosto)?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Fale com a criança quando ela não estiver vendo seu rosto, use tom alegre.",
      suggestion_com_mediacao:
        "Varie as situações onde você fala sem estar no campo visual da criança.",
    },
    {
      question: "A criança faz sons para chamar atenção?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Responda prontamente aos sons da criança, mostre que você a ouviu.",
      suggestion_com_mediacao:
        "Incentive a criança a fazer sons respondendo positivamente.",
    },
    {
      question: "A criança olha para suas próprias mãos?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Coloque as mãos da criança em seu campo visual, mova-as suavemente.",
      suggestion_com_mediacao:
        "Estimule a observação das mãos com objetos coloridos nas mãos da criança.",
    },
    {
      question: "A criança sorri e vocaliza ao ver sua imagem no espelho?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Use espelho durante brincadeiras, aponte para a imagem da criança.",
      suggestion_com_mediacao:
        "Brinque em frente ao espelho, nomeie partes do corpo da criança.",
    },
    {
      question: "A criança brinca sozinha por 10 minutos?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Ofereça brinquedos seguros, fique próximo mas permita exploração independente.",
      suggestion_com_mediacao:
        "Aumente gradualmente o tempo de brincadeira independente.",
    },
    {
      question:
        "A criança procura contato social através de sorrisos, sons ou gestos?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Responda positivamente a todas as tentativas de contato da criança.",
      suggestion_com_mediacao:
        "Incentive diferentes formas de comunicação social.",
    },
    {
      question: "A criança brinca imitando adulto por 2-3 minutos?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Demonstre ações simples e aguarde que a criança imite.",
      suggestion_com_mediacao:
        "Varie as ações imitativas e elogie as tentativas.",
    },
    {
      question: "A criança bate palmas imitando adulto?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Bata palmas em frente à criança, guie suas mãos se necessário.",
      suggestion_com_mediacao:
        "Pratique bater palmas em diferentes contextos e ritmos.",
    },
    {
      question: "A criança acena 'tchau' imitando adulto?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Acene 'tchau' frequentemente, guie a mão da criança se necessário.",
      suggestion_com_mediacao:
        "Pratique acenar em situações de despedida reais.",
    },
    {
      question: "A criança entende 'não' parando a atividade momentaneamente?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Use 'não' com expressão facial clara, seja consistente.",
      suggestion_com_mediacao:
        "Combine 'não' com redirecionamento para atividade apropriada.",
    },
    {
      question: "A criança imita jogos simples quando solicitada?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Demonstre jogos simples como esconder o rosto, aguarde imitação.",
      suggestion_com_mediacao:
        "Varie os jogos imitativos e torne-os mais complexos gradualmente.",
    },
    {
      question: "A criança vem quando chamada?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Chame a criança pelo nome, use tom alegre e gestos de 'vem cá'.",
      suggestion_com_mediacao: "Pratique em diferentes ambientes e distâncias.",
    },
    {
      question:
        "A criança abraça e beija pessoas conhecidas quando solicitada?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Demonstre abraços e beijos, não force, respeite o ritmo da criança.",
      suggestion_com_mediacao:
        "Incentive demonstrações de afeto em contextos apropriados.",
    },
    {
      question:
        "A criança responde quando chamada pelo nome olhando ou virando-se?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Use o nome da criança frequentemente, aguarde resposta antes de continuar.",
      suggestion_com_mediacao:
        "Chame pelo nome em diferentes situações e ambientes.",
    },
    {
      question: "A criança aperta ou balança mãos quando cumprimentada?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Demonstre cumprimentos, guie a mão da criança suavemente.",
      suggestion_com_mediacao:
        "Pratique cumprimentos com diferentes pessoas conhecidas.",
    },
    {
      question: "A criança ajuda em tarefas simples quando solicitada?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Inclua a criança em tarefas simples, guie suas ações.",
      suggestion_com_mediacao:
        "Aumente gradualmente a independência nas tarefas.",
    },
    {
      question: "A criança brinca com 2-3 crianças por períodos curtos?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Organize encontros breves com outras crianças, supervise de perto.",
      suggestion_com_mediacao:
        "Facilite interações positivas e aumente gradualmente o tempo.",
    },
    {
      question: "A criança compartilha comida ou brinquedos quando solicitada?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Demonstre compartilhamento, elogie tentativas de dividir.",
      suggestion_com_mediacao:
        "Pratique compartilhamento em diferentes contextos.",
    },
    {
      question: "A criança cumprimenta pessoas conhecidas sem ser lembrada?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Modele cumprimentos, lembre a criança inicialmente.",
      suggestion_com_mediacao:
        "Reduza gradualmente os lembretes para cumprimentar.",
    },
    {
      question: "A criança segue instruções simples acompanhadas de gestos?",
      category: "Socialização",
      suggestion_ainda_nao: "Use gestos claros junto com palavras simples.",
      suggestion_com_mediacao:
        "Reduza gradualmente os gestos, mantendo apenas as palavras.",
    },

    // LINGUAGEM (25 itens)
    {
      question: "A criança repete os mesmos sons frequentemente?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Imite os sons que a criança faz, crie 'conversas' sonoras.",
      suggestion_com_mediacao:
        "Expanda os sons da criança adicionando novos sons similares.",
    },
    {
      question: "A criança balbucia sons diferentes?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Converse frequentemente com a criança, varie os sons que você faz.",
      suggestion_com_mediacao:
        "Responda aos balbucios da criança com sons variados.",
    },
    {
      question: "A criança imita sons feitos pelo adulto?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Faça sons simples e aguarde que a criança tente imitar.",
      suggestion_com_mediacao:
        "Varie os sons e elogie todas as tentativas de imitação.",
    },
    {
      question: "A criança imita padrões de entonação da fala do adulto?",
      category: "Linguagem",
      suggestion_ainda_nao: "Use entonações exageradas ao falar com a criança.",
      suggestion_com_mediacao:
        "Varie os padrões de entonação e observe as imitações.",
    },
    {
      question: "A criança usa uma palavra com significado?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Repita palavras simples constantemente, associe a objetos/ações.",
      suggestion_com_mediacao:
        "Expanda a palavra da criança em frases simples.",
    },
    {
      question: "A criança vocaliza em resposta à música?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Cante para a criança, use músicas simples e repetitivas.",
      suggestion_com_mediacao: "Incentive a criança a 'cantar' junto com você.",
    },
    {
      question: "A criança segue instruções simples acompanhadas de gestos?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Use gestos claros com palavras simples como 'vem', 'dá'.",
      suggestion_com_mediacao:
        "Reduza gradualmente os gestos mantendo as palavras.",
    },
    {
      question: "A criança fala 2 palavras além de 'mamã' e 'papá'?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Nomeie objetos constantemente, repita palavras importantes.",
      suggestion_com_mediacao:
        "Expanda o vocabulário usando as palavras que a criança já conhece.",
    },
    {
      question: "A criança produz sons de animais ou ruídos de objetos?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Faça sons de animais durante brincadeiras, use livros com animais.",
      suggestion_com_mediacao:
        "Incentive a criança a fazer os sons junto com você.",
    },
    {
      question: "A criança pede 'mais'?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Use a palavra 'mais' em situações apropriadas, aguarde resposta.",
      suggestion_com_mediacao:
        "Crie oportunidades para a criança pedir 'mais'.",
    },
    {
      question: "A criança diz 'não' balançando a cabeça?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Modele 'não' com gesto, respeite quando a criança recusar algo.",
      suggestion_com_mediacao:
        "Incentive o uso de 'não' em situações apropriadas.",
    },
    {
      question: "A criança faz perguntas mudando a entonação?",
      category: "Linguagem",
      suggestion_ainda_nao: "Use entonação de pergunta ao falar com a criança.",
      suggestion_com_mediacao: "Responda às tentativas de pergunta da criança.",
    },
    {
      question:
        "A criança nomeia 5 membros da família ou animais de estimação?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Use fotos da família, nomeie pessoas constantemente.",
      suggestion_com_mediacao:
        "Pratique nomeação com fotos e pessoas presentes.",
    },
    {
      question: "A criança usa frases de 2 palavras?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Modele frases simples, expanda palavras únicas em frases.",
      suggestion_com_mediacao:
        "Incentive frases mais longas fazendo perguntas.",
    },
    {
      question: "A criança nomeia 10 objetos familiares?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Nomeie objetos durante atividades diárias, use repetição.",
      suggestion_com_mediacao: "Faça jogos de nomeação com objetos conhecidos.",
    },
    {
      question: "A criança imita sons ambientais?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Chame atenção para sons do ambiente, imite-os junto com a criança.",
      suggestion_com_mediacao: "Crie jogos com sons ambientais.",
    },
    {
      question: "A criança pede ajuda usando palavras?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Ensine palavras como 'ajuda', 'socorro' em situações apropriadas.",
      suggestion_com_mediacao:
        "Incentive pedidos verbais ao invés de gestos apenas.",
    },
    {
      question: "A criança combina palavras e gestos para comunicar?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Modele combinação de palavras com gestos apropriados.",
      suggestion_com_mediacao:
        "Incentive comunicação multimodal (palavras + gestos).",
    },
    {
      question: "A criança usa 'meu' e 'minha'?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Use possessivos ao falar sobre objetos da criança.",
      suggestion_com_mediacao: "Corrija gentilmente e modele o uso correto.",
    },
    {
      question: "A criança nomeia ações em figuras?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Use livros com figuras de ações, nomeie o que as pessoas fazem.",
      suggestion_com_mediacao: "Faça perguntas sobre ações nas figuras.",
    },
    {
      question: "A criança faz perguntas de 2 palavras?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Modele perguntas simples como 'Que é?', 'Onde está?'.",
      suggestion_com_mediacao:
        "Incentive perguntas respondendo entusiasticamente.",
    },
    {
      question: "A criança usa formas verbais no gerúndio?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Use gerúndio ao descrever ações: 'correndo', 'comendo'.",
      suggestion_com_mediacao:
        "Corrija gentilmente expandindo as tentativas da criança.",
    },
    {
      question: "A criança dá seu primeiro e último nome quando perguntada?",
      category: "Linguagem",
      suggestion_ainda_nao: "Pratique o nome completo da criança diariamente.",
      suggestion_com_mediacao: "Use jogos e músicas com o nome da criança.",
    },
    {
      question: "A criança responde a perguntas simples com 'sim' ou 'não'?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Faça perguntas que requerem sim/não, aguarde resposta.",
      suggestion_com_mediacao: "Varie as perguntas e contextos para sim/não.",
    },
    {
      question: "A criança expressa necessidades usando frases curtas?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Modele frases para expressar necessidades básicas.",
      suggestion_com_mediacao:
        "Incentive frases ao invés de gestos ou palavras isoladas.",
    },

    // COGNIÇÃO (22 itens)
    {
      question: "A criança remove um pano do rosto?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Coloque pano leve no rosto da criança, ajude-a a remover inicialmente.",
      suggestion_com_mediacao:
        "Pratique com diferentes tecidos, reduza a ajuda gradualmente.",
    },
    {
      question: "A criança procura objeto que caiu?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Deixe objetos caírem propositalmente, ajude a criança a procurar.",
      suggestion_com_mediacao:
        "Incentive a busca independente por objetos que caem.",
    },
    {
      question: "A criança remove objeto de um recipiente imitando adulto?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Demonstre tirando objetos de caixas, guie as mãos da criança.",
      suggestion_com_mediacao:
        "Use diferentes recipientes e objetos para praticar.",
    },
    {
      question: "A criança coloca objeto em recipiente imitando adulto?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Demonstre colocando objetos em recipientes, guie a criança.",
      suggestion_com_mediacao: "Varie tamanhos de objetos e recipientes.",
    },
    {
      question: "A criança balança brinquedo que produz som?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Ofereça chocalhos e brinquedos sonoros, demonstre como usar.",
      suggestion_com_mediacao:
        "Varie os brinquedos sonoros e incentive exploração.",
    },
    {
      question: "A criança coloca 3 objetos em recipiente?",
      category: "Cognição",
      suggestion_ainda_nao: "Comece com 1 objeto, aumente gradualmente para 3.",
      suggestion_com_mediacao:
        "Use objetos atrativos e conte junto com a criança.",
    },
    {
      question: "A criança imita gestos simples quando solicitada?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Demonstre gestos simples como bater palmas, aguarde imitação.",
      suggestion_com_mediacao:
        "Varie os gestos e torne-os mais complexos gradualmente.",
    },
    {
      question: "A criança encontra objeto escondido sob recipiente?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Esconda objetos partially primeiro, depois completamente.",
      suggestion_com_mediacao:
        "Use diferentes recipientes e locais para esconder.",
    },
    {
      question: "A criança empurra brinquedo com rodas?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Demonstre empurrando carrinhos, guie as mãos da criança.",
      suggestion_com_mediacao:
        "Use diferentes brinquedos com rodas em várias superfícies.",
    },
    {
      question: "A criança faz torre de 2 blocos imitando adulto?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Use blocos grandes, demonstre empilhamento, ajude fisicamente.",
      suggestion_com_mediacao:
        "Pratique com diferentes tipos de blocos e formas.",
    },
    {
      question: "A criança coloca 5 pinos em tabuleiro?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Comece com pinos grandes e furos grandes, reduza dificuldade.",
      suggestion_com_mediacao: "Aumente gradualmente o número de pinos.",
    },
    {
      question: "A criança combina objetos similares?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Use objetos idênticos, demonstre combinação, guie a criança.",
      suggestion_com_mediacao:
        "Varie os objetos mantendo similaridades óbvias.",
    },
    {
      question: "A criança rabisca com lápis ou giz?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Ofereça giz grosso, demonstre rabiscos, guie a mão da criança.",
      suggestion_com_mediacao:
        "Use diferentes materiais para desenhar em várias superfícies.",
    },
    {
      question: "A criança aponta para uma parte do corpo quando nomeada?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Nomeie partes do corpo durante cuidados, aponte e toque.",
      suggestion_com_mediacao:
        "Use músicas sobre corpo, faça jogos de apontar partes.",
    },
    {
      question: "A criança empilha anéis em cone na ordem correta?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Demonstre empilhamento, comece com poucos anéis grandes.",
      suggestion_com_mediacao: "Aumente gradualmente o número de anéis.",
    },
    {
      question: "A criança identifica figuras em livro quando nomeadas?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Use livros com figuras grandes e claras, aponte enquanto nomeia.",
      suggestion_com_mediacao: "Faça perguntas sobre as figuras nos livros.",
    },
    {
      question: "A criança vira páginas de livro (2-3 por vez)?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Use livros com páginas grossas, demonstre como virar.",
      suggestion_com_mediacao: "Pratique com diferentes tipos de livros.",
    },
    {
      question: "A criança faz torre de 4 blocos?",
      category: "Cognição",
      suggestion_ainda_nao: "Comece com 2 blocos, aumente gradually até 4.",
      suggestion_com_mediacao: "Use blocos de diferentes tamanhos e texturas.",
    },
    {
      question: "A criança nomeia objetos em figuras?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Aponte figuras e nomeie repetidamente, aguarde tentativas.",
      suggestion_com_mediacao:
        "Faça perguntas 'O que é isso?' apontando figuras.",
    },
    {
      question: "A criança desenha linha vertical imitando adulto?",
      category: "Cognição",
      suggestion_ainda_nao: "Demonstre linha vertical, guie a mão da criança.",
      suggestion_com_mediacao:
        "Pratique linhas em diferentes superfícies e materiais.",
    },
    {
      question: "A criança desenha linha horizontal imitando adulto?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Demonstre linha horizontal, guie a mão da criança.",
      suggestion_com_mediacao: "Alterne entre linhas verticais e horizontais.",
    },
    {
      question: "A criança copia círculo?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Demonstre círculos grandes, use movimento circular no ar primeiro.",
      suggestion_com_mediacao:
        "Pratique círculos em diferentes tamanhos e materiais.",
    },

    // AUTO-CUIDADOS (22 itens)
    {
      question: "A criança suga e engole líquidos?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Consulte profissional de saúde, pratique com líquidos engrossados se necessário.",
      suggestion_com_mediacao:
        "Varie texturas gradualmente conforme orientação profissional.",
    },
    {
      question: "A criança come alimentos semi-sólidos?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Introduza texturas gradualmente, comece com purês mais grossos.",
      suggestion_com_mediacao:
        "Aumente gradualmente a consistência dos alimentos.",
    },
    {
      question: "A criança mastiga e engole alimentos sólidos?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Ofereça alimentos que se dissolvem na boca, supervise sempre.",
      suggestion_com_mediacao:
        "Introduza alimentos sólidos macios gradualmente.",
    },
    {
      question: "A criança bebe de copo com ajuda?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Use copo com bico ou canudo, ajude a segurar e inclinar.",
      suggestion_com_mediacao:
        "Reduza gradualmente a ajuda para segurar o copo.",
    },
    {
      question: "A criança come com colher com ajuda?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Use colher adaptada, guie a mão da criança do prato à boca.",
      suggestion_com_mediacao: "Reduza gradualmente a ajuda física.",
    },
    {
      question: "A criança come com os dedos?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Ofereça alimentos apropriados para comer com dedos, demonstre.",
      suggestion_com_mediacao: "Varie os alimentos finger foods.",
    },
    {
      question: "A criança bebe de copo sozinha?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Use copo com duas alças, coloque pouco líquido inicialmente.",
      suggestion_com_mediacao: "Pratique com diferentes tipos de copos.",
    },
    {
      question: "A criança come com colher sozinha?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Use alimentos que grudam na colher, aceite sujeira inicial.",
      suggestion_com_mediacao:
        "Pratique com diferentes consistências de alimentos.",
    },
    {
      question: "A criança mastiga alimentos variados?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Introduza texturas variadas gradualmente, observe preferências.",
      suggestion_com_mediacao: "Continue expandindo variedade de texturas.",
    },
    {
      question: "A criança bebe líquido com canudo?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Demonstre sucção, use canudos curtos e grossos inicialmente.",
      suggestion_com_mediacao: "Pratique com diferentes tipos de canudos.",
    },
    {
      question: "A criança come com garfo com ajuda?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Use garfo adaptado, comece com alimentos que espetam facilmente.",
      suggestion_com_mediacao: "Reduza gradualmente a ajuda física.",
    },
    {
      question: "A criança obtém água da torneira sozinha?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Use banquinho seguro, ensine a abrir torneira e usar copo.",
      suggestion_com_mediacao: "Supervise e reduza ajuda gradualmente.",
    },
    {
      question: "A criança come com garfo sozinha?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Pratique com alimentos macios que espetam facilmente.",
      suggestion_com_mediacao: "Varie os alimentos e pratique coordenação.",
    },
    {
      question: "A criança despeja líquido de jarra pequena?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Use jarra pequena e leve, pratique com água, aceite derramamentos.",
      suggestion_com_mediacao: "Pratique controle de quantidade despejada.",
    },
    {
      question: "A criança abre geladeira e pega alimentos?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Ensine segurança, organize alimentos apropriados ao alcance.",
      suggestion_com_mediacao: "Estabeleça regras sobre quando e o que pegar.",
    },
    {
      question: "A criança usa faca para passar manteiga?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Use faca sem corte, demonstre movimento, supervise sempre.",
      suggestion_com_mediacao:
        "Pratique com diferentes consistências para passar.",
    },
    {
      question: "A criança quebra ovos?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Demonstre técnica, use ovos cozidos para prática inicial.",
      suggestion_com_mediacao: "Pratique com ovos crus sob supervisão.",
    },
    {
      question: "A criança prepara sanduíche simples?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Demonstre passo a passo, comece com ingredientes simples.",
      suggestion_com_mediacao:
        "Aumente complexidade dos sanduíches gradualmente.",
    },
    {
      question: "A criança serve-se à mesa?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Use utensílios apropriados, demonstre porções adequadas.",
      suggestion_com_mediacao: "Pratique controle de quantidade ao se servir.",
    },
    {
      question: "A criança prepara cereal com leite?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Demonstre sequência: cereal primeiro, depois leite.",
      suggestion_com_mediacao: "Pratique controle de quantidades.",
    },
    {
      question: "A criança faz torrada?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Ensine segurança com torradeira, supervise sempre.",
      suggestion_com_mediacao: "Pratique diferentes níveis de tostagem.",
    },
    {
      question: "A criança prepara alimentos que requerem mistura?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Comece com misturas simples, demonstre técnica.",
      suggestion_com_mediacao:
        "Aumente complexidade das receitas gradualmente.",
    },

    // DESENVOLVIMENTO MOTOR (20 itens)
    {
      question: "A criança levanta a cabeça quando deitada de bruços?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Coloque a criança de bruços por períodos curtos, use brinquedos para motivar.",
      suggestion_com_mediacao: "Aumente gradualmente o tempo de bruços.",
    },
    {
      question: "A criança levanta cabeça e peito quando de bruços?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Use apoio sob o peito, coloque brinquedos interessantes à frente.",
      suggestion_com_mediacao: "Reduza gradualmente o apoio.",
    },
    {
      question: "A criança vira de bruços para de costas?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Ajude o movimento inicialmente, use brinquedos como motivação.",
      suggestion_com_mediacao:
        "Reduza a ajuda, incentive movimento independente.",
    },
    {
      question: "A criança vira de costas para bruços?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Demonstre o movimento, ajude fisicamente no início.",
      suggestion_com_mediacao: "Pratique em superfícies seguras, reduza ajuda.",
    },
    {
      question: "A criança senta com apoio por 30 minutos?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Use almofadas para apoio, comece com períodos curtos.",
      suggestion_com_mediacao: "Aumente gradualmente o tempo sentado.",
    },
    {
      question: "A criança senta sozinha por 30 segundos?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Pratique sentar com apoio mínimo, use brinquedos para motivar.",
      suggestion_com_mediacao: "Aumente gradualmente o tempo sem apoio.",
    },
    {
      question: "A criança assume posição sentada sozinha?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Demonstre como se sentar, ajude fisicamente no movimento.",
      suggestion_com_mediacao:
        "Reduza ajuda, incentive tentativas independentes.",
    },
    {
      question: "A criança engatinha?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Coloque brinquedos fora do alcance, demonstre movimento.",
      suggestion_com_mediacao: "Crie percursos seguros para engatinhar.",
    },
    {
      question: "A criança puxa-se para ficar em pé?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Ofereça apoios seguros, incentive movimento para cima.",
      suggestion_com_mediacao: "Varie os apoios e alturas.",
    },
    {
      question: "A criança fica em pé com apoio por 15 minutos?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Use apoios estáveis, comece com períodos curtos.",
      suggestion_com_mediacao: "Aumente gradualmente o tempo em pé.",
    },
    {
      question: "A criança anda segurando em móveis?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Organize móveis seguros para apoio, incentive movimento lateral.",
      suggestion_com_mediacao: "Crie percursos seguros ao longo dos móveis.",
    },
    {
      question: "A criança fica em pé sozinha por 2 segundos?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Pratique equilíbrio com apoio mínimo, use motivação.",
      suggestion_com_mediacao: "Aumente gradualmente o tempo sem apoio.",
    },
    {
      question: "A criança anda sozinha?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Use brinquedos de empurrar, ofereça apoio das mãos.",
      suggestion_com_mediacao:
        "Reduza apoio gradualmente, incentive passos independentes.",
    },
    {
      question: "A criança sobe escadas engatinhando?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Use escadas baixas e seguras, demonstre movimento.",
      suggestion_com_mediacao: "Pratique em diferentes tipos de escadas.",
    },
    {
      question: "A criança senta em cadeira pequena?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Use cadeira apropriada ao tamanho, demonstre como sentar.",
      suggestion_com_mediacao: "Pratique sentar e levantar da cadeira.",
    },
    {
      question: "A criança sobe e desce escadas com ajuda?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Segure a mão da criança, ensine um degrau por vez.",
      suggestion_com_mediacao: "Reduza gradualmente a ajuda física.",
    },
    {
      question: "A criança senta em cadeira pequena sozinha?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Pratique movimento de sentar, use cadeiras estáveis.",
      suggestion_com_mediacao: "Varie tipos de cadeiras e alturas.",
    },
    {
      question: "A criança agacha e levanta sozinha?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Demonstre movimento, use brinquedos no chão como motivação.",
      suggestion_com_mediacao: "Pratique agachamento em diferentes situações.",
    },
    {
      question: "A criança empurra e puxa brinquedos grandes andando?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Use brinquedos leves com rodas, demonstre movimento.",
      suggestion_com_mediacao: "Varie tipos de brinquedos e superfícies.",
    },
    {
      question: "A criança carrega objetos grandes andando?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Comece com objetos leves e grandes, como almofadas, e proponha que a criança os traga até você.",
      suggestion_com_mediacao:
        "Aumente gradualmente o peso — caixas vazias enchidas aos poucos — e elogie cada tentativa.",
    },
  ],

  "1-2": [
    // SOCIALIZAÇÃO (17 itens)
    {
      question: "A criança imita adulto em tarefas simples?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Demonstre tarefas simples como varrer, aguarde imitação.",
      suggestion_com_mediacao:
        "Varie as tarefas imitativas e elogie tentativas.",
    },
    {
      question: "A criança brinca sozinha por 15-20 minutos?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Ofereça brinquedos variados, fique próximo mas permita independência.",
      suggestion_com_mediacao:
        "Aumente gradualmente o tempo de brincadeira independente.",
    },
    {
      question: "A criança explora ativamente o ambiente?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Crie ambiente seguro para exploração, incentive curiosidade.",
      suggestion_com_mediacao:
        "Varie os ambientes e objetos disponíveis para exploração.",
    },
    {
      question: "A criança investiga objetos por 1 minuto?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Ofereça objetos interessantes com texturas e sons variados.",
      suggestion_com_mediacao:
        "Faça perguntas sobre os objetos para manter interesse.",
    },
    {
      question: "A criança abraça e carrega boneca ou brinquedo macio?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Ofereça brinquedos macios, demonstre carinho com eles.",
      suggestion_com_mediacao:
        "Incentive cuidados com brinquedos como 'bebês'.",
    },
    {
      question: "A criança repete ações que produzem risos?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Ria de ações engraçadas da criança, incentive repetição.",
      suggestion_com_mediacao:
        "Crie situações divertidas e responda com alegria.",
    },
    {
      question: "A criança entrega livro para adulto ler?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Tenha livros acessíveis, responda positivamente quando trouxer.",
      suggestion_com_mediacao:
        "Estabeleça rotina de leitura, incentive pedidos.",
    },
    {
      question: "A criança puxa pessoa para mostrar ação ou objeto?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Responda positivamente quando a criança tentar mostrar algo.",
      suggestion_com_mediacao: "Incentive compartilhamento de descobertas.",
    },
    {
      question: "A criança remove roupas simples quando solicitada?",
      category: "Socialização",
      suggestion_ainda_nao: "Comece com roupas fáceis, ajude inicialmente.",
      suggestion_com_mediacao:
        "Pratique remoção de diferentes tipos de roupas.",
    },
    {
      question: "A criança brinca próxima a outras crianças?",
      category: "Socialização",
      suggestion_ainda_nao: "Organize encontros breves, supervise interações.",
      suggestion_com_mediacao:
        "Facilite brincadeiras paralelas com outras crianças.",
    },
    {
      question: "A criança junta-se a outros em atividades por 2-5 minutos?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Inclua a criança em atividades familiares simples.",
      suggestion_com_mediacao: "Aumente gradualmente o tempo de participação.",
    },
    {
      question: "A criança participa de jogos simples com adulto?",
      category: "Socialização",
      suggestion_ainda_nao: "Inicie jogos como esconder objetos, bater palmas.",
      suggestion_com_mediacao:
        "Varie os jogos e deixe a criança liderar às vezes.",
    },
    {
      question: "A criança cumprimenta pessoas familiares quando lembrada?",
      category: "Socialização",
      suggestion_ainda_nao: "Modele cumprimentos, lembre gentilmente.",
      suggestion_com_mediacao: "Reduza lembretes gradualmente.",
    },
    {
      question: "A criança segue rotinas familiares?",
      category: "Socialização",
      suggestion_ainda_nao: "Estabeleça rotinas claras e consistentes.",
      suggestion_com_mediacao: "Envolva a criança ativamente nas rotinas.",
    },
    {
      question: "A criança indica necessidades apontando ou vocalizando?",
      category: "Socialização",
      suggestion_ainda_nao: "Responda prontamente a tentativas de comunicação.",
      suggestion_com_mediacao: "Incentive comunicação mais específica.",
    },
    {
      question: "A criança busca ajuda quando necessário?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Crie situações onde a criança precise de ajuda, responda prontamente.",
      suggestion_com_mediacao: "Incentive pedidos de ajuda verbais.",
    },
    {
      question: "A criança demonstra afeto apropriadamente?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Modele demonstrações de afeto, aceite tentativas da criança.",
      suggestion_com_mediacao:
        "Ensine diferentes formas apropriadas de mostrar afeto.",
    },

    // LINGUAGEM (17 itens)
    {
      question: "A criança diz 8-10 palavras?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Nomeie objetos constantemente, repita palavras importantes diariamente.",
      suggestion_com_mediacao:
        "Expanda vocabulário usando palavras que a criança já conhece.",
    },
    {
      question: "A criança pede 'mais' usando palavras ou gestos?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Use 'mais' em situações apropriadas, aguarde resposta da criança.",
      suggestion_com_mediacao:
        "Crie oportunidades para a criança pedir 'mais'.",
    },
    {
      question: "A criança diz 'não' e balança a cabeça?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Modele 'não' com gesto, respeite recusas apropriadas.",
      suggestion_com_mediacao: "Incentive uso de 'não' em situações adequadas.",
    },
    {
      question: "A criança faz perguntas mudando entonação?",
      category: "Linguagem",
      suggestion_ainda_nao: "Use entonação de pergunta exagerada ao falar.",
      suggestion_com_mediacao:
        "Responda entusiasticamente às tentativas de pergunta.",
    },
    {
      question: "A criança nomeia 5 membros da família?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Use fotos da família, nomeie pessoas constantemente.",
      suggestion_com_mediacao:
        "Faça jogos de identificação com fotos familiares.",
    },
    {
      question: "A criança nomeia 4 brinquedos?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Nomeie brinquedos durante brincadeiras, repita frequentemente.",
      suggestion_com_mediacao: "Faça jogos de 'onde está o...' com brinquedos.",
    },
    {
      question: "A criança produz sons de animais?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Use livros de animais, faça sons durante brincadeiras.",
      suggestion_com_mediacao: "Crie jogos de imitação de sons de animais.",
    },
    {
      question: "A criança pede comida nomeando-a?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Nomeie alimentos antes de oferecer, aguarde tentativas.",
      suggestion_com_mediacao: "Incentive nomeação antes de servir comida.",
    },
    {
      question: "A criança faz perguntas de uma palavra?",
      category: "Linguagem",
      suggestion_ainda_nao: "Modele perguntas simples como 'que?', 'onde?'.",
      suggestion_com_mediacao:
        "Responda perguntas e incentive mais questionamentos.",
    },
    {
      question: "A criança nomeia 3 partes do corpo?",
      category: "Linguagem",
      suggestion_ainda_nao: "Nomeie partes do corpo durante cuidados diários.",
      suggestion_com_mediacao: "Use músicas e jogos sobre partes do corpo.",
    },
    {
      question: "A criança combina 2 palavras?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Modele frases de 2 palavras, expanda palavras únicas.",
      suggestion_com_mediacao:
        "Incentive combinações expandindo tentativas da criança.",
    },
    {
      question: "A criança nomeia objetos em figuras?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Use livros com figuras claras, aponte e nomeie repetidamente.",
      suggestion_com_mediacao: "Faça perguntas 'o que é isso?' com figuras.",
    },
    {
      question: "A criança nomeia ações familiares?",
      category: "Linguagem",
      suggestion_ainda_nao: "Nomeie ações durante atividades diárias.",
      suggestion_com_mediacao: "Use figuras de ações para praticar nomeação.",
    },
    {
      question: "A criança usa 'meu/minha'?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Use possessivos ao falar sobre objetos da criança.",
      suggestion_com_mediacao: "Corrija gentilmente modelando uso correto.",
    },
    {
      question: "A criança escuta histórias por 5 minutos?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Use livros com figuras interessantes, histórias curtas.",
      suggestion_com_mediacao:
        "Faça perguntas durante a história para manter atenção.",
    },
    {
      question: "A criança segue instruções de 2 partes?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Comece com instruções de 1 parte, use gestos visuais.",
      suggestion_com_mediacao:
        "Pratique instruções de 2 partes em contextos familiares.",
    },

    // COGNIÇÃO (17 itens)
    {
      question: "A criança tira 6 objetos de recipiente um por vez?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Demonstre tirando objetos, conte junto com a criança.",
      suggestion_com_mediacao:
        "Use objetos interessantes para motivar a atividade.",
    },
    {
      question: "A criança aponta para uma parte do corpo?",
      category: "Cognição",
      suggestion_ainda_nao: "Nomeie e aponte partes do corpo durante cuidados.",
      suggestion_com_mediacao: "Use jogos de 'onde está o nariz?' etc.",
    },
    {
      question: "A criança empilha 3 blocos?",
      category: "Cognição",
      suggestion_ainda_nao: "Comece com 2 blocos, demonstre empilhamento.",
      suggestion_com_mediacao: "Use blocos de diferentes tamanhos e cores.",
    },
    {
      question: "A criança combina objetos similares?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Use pares de objetos idênticos, demonstre combinação.",
      suggestion_com_mediacao: "Varie objetos mantendo similaridades claras.",
    },
    {
      question: "A criança rabisca espontaneamente?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Ofereça materiais para desenhar, demonstre rabiscos.",
      suggestion_com_mediacao: "Varie materiais e superfícies para desenhar.",
    },
    {
      question: "A criança vira 2-3 páginas por vez?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Use livros com páginas grossas, demonstre como virar.",
      suggestion_com_mediacao: "Pratique com diferentes tipos de livros.",
    },
    {
      question: "A criança identifica figuras nomeadas?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Use figuras grandes e claras, aponte enquanto nomeia.",
      suggestion_com_mediacao: "Faça perguntas sobre figuras conhecidas.",
    },
    {
      question: "A criança vira livro corretamente?",
      category: "Cognição",
      suggestion_ainda_nao: "Demonstre posição correta do livro repetidamente.",
      suggestion_com_mediacao: "Corrija gentilmente quando necessário.",
    },
    {
      question: "A criança identifica partes do corpo em boneca?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Use boneca grande, aponte e nomeie partes do corpo.",
      suggestion_com_mediacao:
        "Compare partes da boneca com partes da criança.",
    },
    {
      question: "A criança empilha anéis em cone?",
      category: "Cognição",
      suggestion_ainda_nao: "Demonstre empilhamento, comece com poucos anéis.",
      suggestion_com_mediacao: "Aumente número de anéis gradualmente.",
    },
    {
      question: "A criança coloca formas simples em tabuleiro?",
      category: "Cognição",
      suggestion_ainda_nao: "Use formas grandes com encaixes óbvios.",
      suggestion_com_mediacao: "Aumente dificuldade com formas menores.",
    },
    {
      question: "A criança desenha linha imitando adulto?",
      category: "Cognição",
      suggestion_ainda_nao: "Demonstre linha simples, guie mão da criança.",
      suggestion_com_mediacao: "Pratique diferentes tipos de linhas.",
    },
    {
      question: "A criança encontra objeto escondido sob 1 de 3 copos?",
      category: "Cognição",
      suggestion_ainda_nao: "Comece escondendo partially, depois completely.",
      suggestion_com_mediacao: "Varie recipientes e objetos escondidos.",
    },
    {
      question: "A criança identifica-se em foto?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Use fotos claras da criança, aponte e diga o nome.",
      suggestion_com_mediacao: "Compare fotos com espelho.",
    },
    {
      question: "A criança imita desenho de linha vertical?",
      category: "Cognição",
      suggestion_ainda_nao: "Demonstre linha vertical, guie mão da criança.",
      suggestion_com_mediacao: "Pratique em diferentes superfícies.",
    },
    {
      question: "A criança imita desenho de linha horizontal?",
      category: "Cognição",
      suggestion_ainda_nao: "Demonstre linha horizontal após dominar vertical.",
      suggestion_com_mediacao: "Alterne entre linhas verticais e horizontais.",
    },
    {
      question: "A criança copia círculo?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Faça movimentos circulares no ar primeiro, depois no papel.",
      suggestion_com_mediacao: "Pratique círculos de diferentes tamanhos.",
    },

    // AUTO-CUIDADOS (22 itens)
    {
      question: "A criança suga e engole líquidos?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Consulte profissional de saúde, pratique com líquidos engrossados se necessário.",
      suggestion_com_mediacao:
        "Varie texturas gradualmente conforme orientação profissional.",
    },
    {
      question: "A criança come alimentos semi-sólidos?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Introduza texturas gradualmente, comece com purês mais grossos.",
      suggestion_com_mediacao:
        "Aumente gradualmente a consistência dos alimentos.",
    },
    {
      question: "A criança mastiga e engole alimentos sólidos?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Ofereça alimentos que se dissolvem na boca, supervise sempre.",
      suggestion_com_mediacao:
        "Introduza alimentos sólidos macios gradualmente.",
    },
    {
      question: "A criança bebe de copo com ajuda?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Use copo com bico ou canudo, ajude a segurar e inclinar.",
      suggestion_com_mediacao:
        "Reduza gradualmente a ajuda para segurar o copo.",
    },
    {
      question: "A criança come com colher com ajuda?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Use colher adaptada, guie a mão da criança do prato à boca.",
      suggestion_com_mediacao: "Reduza gradualmente a ajuda física.",
    },
    {
      question: "A criança come com os dedos?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Ofereça alimentos apropriados para comer com dedos, demonstre.",
      suggestion_com_mediacao: "Varie os alimentos finger foods.",
    },
    {
      question: "A criança bebe de copo sozinha?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Use copo com duas alças, coloque pouco líquido inicialmente.",
      suggestion_com_mediacao: "Pratique com diferentes tipos de copos.",
    },
    {
      question: "A criança come com colher sozinha?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Use alimentos que grudam na colher, aceite sujeira inicial.",
      suggestion_com_mediacao:
        "Pratique com diferentes consistências de alimentos.",
    },
    {
      question: "A criança mastiga alimentos variados?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Introduza texturas variadas gradualmente, observe preferences.",
      suggestion_com_mediacao: "Continue expanding variedade de texturas.",
    },
    {
      question: "A criança bebe líquido con canudo?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Demonstre sucção, use canudos curtos e grossos inicialmente.",
      suggestion_com_mediacao: "Pratique com diferentes tipos de canudos.",
    },
    {
      question: "A criança come con garfo con ayuda?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Use garfo adaptado, comece con alimentos que espetam facilmente.",
      suggestion_com_mediacao: "Reduza gradualmente a ayuda física.",
    },
    {
      question: "A criança obtém agua da torneira sozinha?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Use banquinho seguro, ensine a abrir torneira e usar copo.",
      suggestion_com_mediacao: "Supervise e reduza ayuda gradualmente.",
    },
    {
      question: "A criança come con garfo sozinha?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Pratique con alimentos macios que espetam facilmente.",
      suggestion_com_mediacao: "Varie os alimentos e pratique coordenação.",
    },
    {
      question: "A criança despeja líquido de jarra pequena?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Use jarra pequena e leve, pratique con agua, aceite derramamentos.",
      suggestion_com_mediacao: "Pratique controle de quantidade despejada.",
    },
    {
      question: "A criança abre geladeira e pega alimentos?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Ensine seguridad, organize alimentos apropriados ao alcance.",
      suggestion_com_mediacao: "Estabeleça reglas sobre cuando e o que pegar.",
    },
    {
      question: "A criança usa faca para passar manteiga?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Use faca sem corte, demonstre movimento, supervise sempre.",
      suggestion_com_mediacao:
        "Pratique con diferentes consistencias para passar.",
    },
    {
      question: "A criança quebra ovos?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Demonstre técnica, use ovos cozidos para prática inicial.",
      suggestion_com_mediacao: "Pratique con ovos crus sob supervisão.",
    },
    {
      question: "A criança prepara sanduíche simples?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Demonstre passo a passo, comece con ingredientes simples.",
      suggestion_com_mediacao:
        "Aumente complexidade dos sanduíches gradualmente.",
    },
    {
      question: "A criança serve-se à mesa?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Use utensílios apropriados, demonstre porções adecuadas.",
      suggestion_com_mediacao: "Pratique controle de quantidade ao se servir.",
    },
    {
      question: "A criança prepara cereal con leite?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Demonstre secuencia: cereal primeiro, depois leite.",
      suggestion_com_mediacao: "Pratique controle de cantidades.",
    },
    {
      question: "A criança faz torrada?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Ensine seguridad con torradeira, supervise sempre.",
      suggestion_com_mediacao: "Pratique diferentes níveis de tostagem.",
    },
    {
      question: "A criança prepara alimentos que requerem mistura?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Comece con misturas simples, demonstre técnica.",
      suggestion_com_mediacao: "Aumente complexidade das recetas gradualmente.",
    },

    // DESENVOLVIMENTO MOTOR (20 itens)
    {
      question: "A criança levanta a cabeça quando deitada de bruços?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Coloque a criança de bruços por períodos curtos, use brinquedos para motivar.",
      suggestion_com_mediacao: "Aumente gradualmente o tempo de bruços.",
    },
    {
      question: "A criança levanta cabeça e peito quando de bruços?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Use apoio sob o peito, coloque brinquedos interessantes à frente.",
      suggestion_com_mediacao: "Reduza gradualmente o apoio.",
    },
    {
      question: "A criança vira de bruços para de costas?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Ajude o movimento inicialmente, use brinquedos como motivação.",
      suggestion_com_mediacao:
        "Reduza a ayuda, incentive movimento independente.",
    },
    {
      question: "A criança vira de costas para bruços?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Demonstre o movimento, ajude fisicamente no início.",
      suggestion_com_mediacao: "Pratique em superfícies seguras, reduza ayuda.",
    },
    {
      question: "A criança senta con apoyo por 30 minutos?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Use almofadas para apoyo, comece con períodos curtos.",
      suggestion_com_mediacao: "Aumente gradualmente o tempo sentado.",
    },
    {
      question: "A criança senta sozinha por 30 segundos?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Pratique sentar con apoyo mínimo, use brinquedos para motivar.",
      suggestion_com_mediacao: "Aumente gradualmente o tempo sem apoyo.",
    },
    {
      question: "A criança assume posição sentada sozinha?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Demonstre como se sentar, ajude fisicamente no movimento.",
      suggestion_com_mediacao:
        "Reduza ayuda, incentive tentativas independentes.",
    },
    {
      question: "A criança engatinha?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Coloque brinquedos fora do alcance, demonstre movimento.",
      suggestion_com_mediacao: "Crie percursos seguros para engatinhar.",
    },
    {
      question: "A criança puxa-se para ficar em pé?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Ofereça apoios seguros, incentive movimento para cima.",
      suggestion_com_mediacao: "Varie os apoios e alturas.",
    },
    {
      question: "A criança fica em pé con apoyo por 15 minutos?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Use apoios estáveis, comece con períodos curtos.",
      suggestion_com_mediacao: "Aumente gradualmente o tempo em pé.",
    },
    {
      question: "A criança anda segurando em móveis?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Organize móveis seguros para apoyo, incentive movimento lateral.",
      suggestion_com_mediacao: "Crie percursos seguros ao longo dos móveis.",
    },
    {
      question: "A criança fica em pé sozinha por 2 segundos?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Pratique equilibrio con apoyo mínimo, use motivação.",
      suggestion_com_mediacao: "Aumente gradualmente o tempo sem apoyo.",
    },
    {
      question: "A criança anda sozinha?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Use brinquedos de empurrar, ofereça apoyo das mãos.",
      suggestion_com_mediacao:
        "Reduza apoyo gradualmente, incentive passos independentes.",
    },
    {
      question: "A criança sobe escadas engatinhando?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Use escadas baixas e seguras, demonstre movimento.",
      suggestion_com_mediacao: "Pratique em diferentes tipos de escadas.",
    },
    {
      question: "A criança senta em cadeira pequena?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Use cadeira apropriada ao tamanho, demonstre como sentar.",
      suggestion_com_mediacao: "Pratique sentar e levantar da cadeira.",
    },
    {
      question: "A criança sobe e desce escadas con ajuda?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Segure a mão da criança, ensine um degrau por vez.",
      suggestion_com_mediacao: "Reduza gradualmente a ayuda física.",
    },
    {
      question: "A criança senta em cadeira pequena sozinha?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Pratique movimento de sentar, use cadeiras estáveis.",
      suggestion_com_mediacao: "Varie tipos de cadeiras e alturas.",
    },
    {
      question: "A criança agacha e levanta sozinha?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Demonstre movimento, use brinquedos no chão como motivação.",
      suggestion_com_mediacao: "Pratique agachamento em diferentes situações.",
    },
    {
      question: "A criança empurra e puxa brinquedos grandes andando?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Use brinquedos leves con rodas, demonstre movimento.",
      suggestion_com_mediacao: "Varie tipos de brinquedos e superfícies.",
    },
    {
      question: "A criança carrega objetos grandes andando?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Comece con objetos leves e grandes, como almofadas, e proponha que a criança os traga até você.",
      suggestion_com_mediacao:
        "Aumente gradualmente o peso — caixas vazias enchidas aos poucos — e elogie cada tentativa.",
    },
  ],

  "2-3": [
    // SOCIALIZAÇÃO (20 items)
    {
      question: "A criança imita adulto fazendo tarefas domésticas simples?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Demonstre tarefas simples como varrer, deixe a criança 'ajudar' com utensílios pequenos.",
      suggestion_com_mediacao:
        "Forneça ferramentas adequadas ao tamanho da criança para imitação.",
    },
    {
      question: "A criança brinca de faz de conta por períodos curtos?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Disponibilize brinquedos que estimulem imaginação, participe das brincadeiras.",
      suggestion_com_mediacao:
        "Incentive dramatização de diferentes situações do cotidiano.",
    },
    {
      question: "A criança abraça e beija boneca ou brinquedo macio?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Ofereça brinquedos macios, demonstre carinho com eles.",
      suggestion_com_mediacao:
        "Incentive cuidados com brinquedos como se fossem 'bebês'.",
    },
    {
      question: "A criança ajuda a guardar brinquedos quando solicitada?",
      category: "Socialização",
      suggestion_ainda_nao: "Torne a arrumação um jogo, ajude inicialmente.",
      suggestion_com_mediacao:
        "Crie rotina de organização, elogie participação.",
    },
    {
      question: "A criança imita trabalhos domésticos dos pais?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Permita participação em tarefas seguras, forneça utensílios apropriados.",
      suggestion_com_mediacao:
        "Valorize tentativas de ajuda, mesmo que imperfeitas.",
    },
    {
      question:
        "A criança brinca próxima a outras crianças fazendo atividade similar?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Organize encontros com outras crianças, facilite brincadeiras paralelas.",
      suggestion_com_mediacao: "Incentive interação gradual entre as crianças.",
    },
    {
      question: "A criança participa de jogos simples com outras crianças?",
      category: "Socialização",
      suggestion_ainda_nao: "Ensine jogos simples como roda, esconde-esconde.",
      suggestion_com_mediacao:
        "Facilite participação em grupo, explique reglas básicas.",
    },
    {
      question: "A criança defende seus brinquedos e posses?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Ensine conceito de 'meu' e 'seu', respeite propriedade da criança.",
      suggestion_com_mediacao:
        "Balance protección de posses con aprendizado de compartilhamento.",
    },
    {
      question: "A criança usa 'por favor' cuando lembrada?",
      category: "Socialização",
      suggestion_ainda_nao: "Modele uso de 'por favor', lembre gentilmente.",
      suggestion_com_mediacao:
        "Reduza lembretes gradualmente, elogie uso espontâneo.",
    },
    {
      question: "A criança espera sua vez com ajuda?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Use atividades com turnos claros, ensine conceito de espera.",
      suggestion_com_mediacao: "Pratique paciência em diferentes situações.",
    },
    {
      question: "A criança usa 'obrigado' quando lembrada?",
      category: "Socialização",
      suggestion_ainda_nao: "Modele agradecimentos, lembre quando apropriado.",
      suggestion_com_mediacao: "Incentive gratidão em diferentes contextos.",
    },
    {
      question: "A criança remove casaco e pendura quando solicitada?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Demonstre como tirar e pendurar, use ganchos baixos.",
      suggestion_com_mediacao: "Crie rotina de organização de roupas.",
    },
    {
      question: "A criança ouve histórias por 5-8 minutos?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Use livros com figuras interessantes, histórias curtas.",
      suggestion_com_mediacao:
        "Faça perguntas durante a história para manter atenção.",
    },
    {
      question: "A criança diz nome e sobrenome quando perguntada?",
      category: "Socialização",
      suggestion_ainda_nao: "Pratique nome completo diariamente, use em jogos.",
      suggestion_com_mediacao:
        "Ensine quando é apropriado dizer nome completo.",
    },
    {
      question: "A criança responde a pergunta 'menino ou menina'?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Ensine identidade de gênero de forma simples e clara.",
      suggestion_com_mediacao: "Reforce conceito em diferentes contextos.",
    },
    {
      question: "A criança canta canções simples?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Cante músicas repetitivas, incentive participação.",
      suggestion_com_mediacao: "Ensine canções com gestos e movimentos.",
    },
    {
      question: "A criança tenta consolar outros quando estão tristes?",
      category: "Socialização",
      suggestion_ainda_nao: "Modele empatia, explique sentimentos de outros.",
      suggestion_com_mediacao: "Incentive gestos de cuidado apropriados.",
    },
    {
      question: "A criança participa de atividades em grupo por 10-15 minutos?",
      category: "Socialização",
      suggestion_ainda_nao: "Comece com atividades curtas e interessantes.",
      suggestion_com_mediacao:
        "Aumente duração gradualmente, varie atividades.",
    },
    {
      question: "A criança identifica sentimentos em si mesma?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Ensine vocabulário emocional básico, valide sentimentos.",
      suggestion_com_mediacao: "Ajude a nomear e expressar emoções.",
    },
    {
      question: "A criança compartilha brinquedos espontaneamente?",
      category: "Socialização",
      suggestion_ainda_nao: "Modele compartilhamento, elogie tentativas.",
      suggestion_com_mediacao: "Crie oportunidades para praticar divisão.",
    },

    // LINGUAGEM (24 items)
    {
      question:
        "A criança combina substantivo com verbo em frases de 2 palavras?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Modele frases simples como 'papai foi', 'bebê dorme'.",
      suggestion_com_mediacao:
        "Expanda tentativas da criança em frases completas.",
    },
    {
      question: "A criança usa frases de 3 palavras regularmente?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Modele frases de 3 palavras, expanda palavras da criança.",
      suggestion_com_mediacao:
        "Incentive frases mais longas fazendo perguntas.",
    },
    {
      question: "A criança usa pronomes 'eu', 'mim', 'meu'?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Use pronomes consistentemente ao falar com a criança.",
      suggestion_com_mediacao: "Corrija gentilmente modelando uso correto.",
    },
    {
      question: "A criança usa formas verbais no presente?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Modele verbos no presente durante atividades diárias.",
      suggestion_com_mediacao:
        "Corrija gentilmente e pratique em contextos variados.",
    },
    {
      question: "A criança usa 'não' no início de frases?",
      category: "Linguagem",
      suggestion_ainda_nao: "Modele negativas bem formadas, aceite tentativas.",
      suggestion_com_mediacao: "Expanda negativas simples em frases completas.",
    },
    {
      question: "A criança faz perguntas de 2-3 palavras?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Modele perguntas simples, responda entusiasticamente.",
      suggestion_com_mediacao: "Incentive curiosidade respondendo perguntas.",
    },
    {
      question: "A criança usa preposições 'em', 'sobre'?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Use preposições durante atividades de posicionamento.",
      suggestion_com_mediacao:
        "Pratique com jogos de colocar objetos em lugares.",
    },
    {
      question: "A criança nomeia ações que vê em figuras?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Use livros com ações claras, aponte e nomeie atividades.",
      suggestion_com_mediacao:
        "Faça perguntas sobre o que pessoas fazem nas figuras.",
    },
    {
      question: "A criança usa adjetivos simples?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Use adjetivos descritivos: grande, pequeno, bonito.",
      suggestion_com_mediacao: "Incentive descrições com múltiplos adjetivos.",
    },
    {
      question: "A criança conta até 5?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Pratique contagem com objetos concretos diariamente.",
      suggestion_com_mediacao: "Use contagem em atividades funcionais.",
    },
    {
      question: "A criança usa conjunção 'e' para conectar palavras?",
      category: "Linguagem",
      suggestion_ainda_nao: "Modele uso de 'e' para conectar ideias simples.",
      suggestion_com_mediacao: "Incentive conexões entre palavras e ideias.",
    },
    {
      question: "A criança relata experiências recentes?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Incentive a criança a contar o que fez recentemente.",
      suggestion_com_mediacao:
        "Faça perguntas para ajudar a organizar narrativas.",
    },
    {
      question: "A criança usa 'mais' para pedir repetição?",
      category: "Linguagem",
      suggestion_ainda_nao: "Modele uso de 'mais' em situações apropriadas.",
      suggestion_com_mediacao: "Crie oportunidades para pedir 'mais'.",
    },
    {
      question: "A criança nomeia 5 partes do corpo?",
      category: "Linguagem",
      suggestion_ainda_nao: "Nomeie partes do corpo durante cuidados diários.",
      suggestion_com_mediacao: "Use músicas e jogos sobre corpo.",
    },
    {
      question: "A criança usa tempo passado em algumas palavras?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Fale sobre eventos passados, modele formas corretas.",
      suggestion_com_mediacao:
        "Corrija gentilmente e pratique em contextos variados.",
    },
    {
      question: "A criança nomeia objetos por categoria?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Agrupe objetos por categoria: comida, roupas, brinquedos.",
      suggestion_com_mediacao: "Faça jogos de classificação e nomeação.",
    },
    {
      question: "A criança usa 'aqui' e 'ali'?",
      category: "Linguagem",
      suggestion_ainda_nao: "Use palavras de localização durante atividades.",
      suggestion_com_mediacao: "Pratique conceitos espaciais com jogos.",
    },
    {
      question: "A criança faz comentários sobre atividades?",
      category: "Linguagem",
      suggestion_ainda_nao: "Incentive comentários sobre o que está fazendo.",
      suggestion_com_mediacao:
        "Responda positivamente a tentativas de comunicação.",
    },
    {
      question: "A criança usa 'por que' em perguntas?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Modele perguntas com 'por que', responda pacientemente.",
      suggestion_com_mediacao: "Incentive curiosidade sobre causa e efeito.",
    },
    {
      question: "A criança expressa necessidades com frases?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Modele frases para expressar necessidades básicas.",
      suggestion_com_mediacao: "Incentive frases ao invés de gestos apenas.",
    },
    {
      question: "A criança usa 'quando' em perguntas simples?",
      category: "Linguagem",
      suggestion_ainda_nao: "Use conceitos temporais simples em conversas.",
      suggestion_com_mediacao:
        "Responda perguntas sobre tempo de forma simples.",
    },
    {
      question: "A criança nomeia cores primárias?",
      category: "Linguagem",
      suggestion_ainda_nao: "Pratique cores em atividades diárias.",
      suggestion_com_mediacao: "Use jogos de identificação de cores.",
    },
    {
      question: "A criança usa frases de 4 palavras?",
      category: "Linguagem",
      suggestion_ainda_nao: "Modele frases mais longas, expanda tentativas.",
      suggestion_com_mediacao:
        "Incentive elaboração de ideias em frases complexas.",
    },
    {
      question: "A criança canta músicas simples completas?",
      category: "Linguagem",
      suggestion_ainda_nao: "Ensine músicas repetitivas e simples.",
      suggestion_com_mediacao: "Pratique músicas com gestos e movimentos.",
    },

    // COGNIÇÃO (24 items)
    {
      question: "A criança encontra objetos que não estão em lugar habitual?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Mude objetos de lugar ocasionalmente, ajude na busca.",
      suggestion_com_mediacao:
        "Incentive busca independente em locais lógicos.",
    },
    {
      question: "A criança identifica objetos pelo som?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Use objetos sonoros variados, faça jogos de adivinhação.",
      suggestion_com_mediacao: "Crie jogos de identificação auditiva.",
    },
    {
      question: "A criança empilha 5-6 blocos?",
      category: "Cognição",
      suggestion_ainda_nao: "Comece com menos blocos, use blocos estáveis.",
      suggestion_com_mediacao: "Incentive construções mais altas e criativas.",
    },
    {
      question: "A criança identifica objetos pelo tato?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Use objetos com texturas diferentes em jogos táteis.",
      suggestion_com_mediacao: "Crie jogos de adivinhação pelo toque.",
    },
    {
      question: "A criança aponta para objetos nomeados em figuras?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Use livros com figuras claras, aponte enquanto nomeia.",
      suggestion_com_mediacao: "Faça perguntas sobre localização de objetos.",
    },
    {
      question: "A criança vira páginas de livro uma por vez?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Use livros com páginas grossas, demonstre movimento.",
      suggestion_com_mediacao: "Pratique com diferentes tipos de livros.",
    },
    {
      question: "A criança identifica-se em espelho?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Brinque em frente ao espelho, aponte para criança.",
      suggestion_com_mediacao: "Use espelho para jogos de reconhecimento.",
    },
    {
      question: "A criança identifica partes do corpo em si mesma?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Nomeie partes do corpo, peça para criança apontar.",
      suggestion_com_mediacao: "Use jogos e músicas sobre corpo.",
    },
    {
      question: "A criança agrupa objetos por cor?",
      category: "Cognição",
      suggestion_ainda_nao: "Use objetos coloridos, demonstre agrupamento.",
      suggestion_com_mediacao: "Crie jogos de classificação por cores.",
    },
    {
      question: "A criança agrupa objetos por forma?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Use formas geométricas simples para classificação.",
      suggestion_com_mediacao: "Varie formas e contextos de classificação.",
    },
    {
      question: "A criança completa quebra-cabeça de 4-6 peças?",
      category: "Cognition",
      suggestion_ainda_nao: "Comece com menos peças, use figuras familiares.",
      suggestion_com_mediacao: "Aumente complexidade gradualmente.",
    },
    {
      question: "A criança nomeia objetos grandes e pequenos?",
      category: "Cognition",
      suggestion_ainda_nao: "Compare tamanhos usando objetos concretos.",
      suggestion_com_mediacao: "Use jogos de classificação por tamanho.",
    },
    {
      question: "A criança desenha círculo espontaneamente?",
      category: "Cognition",
      suggestion_ainda_nao:
        "Ofereça materiais para desenhar, demonstre círculos.",
      suggestion_com_mediacao: "Incentive desenho livre e criativo.",
    },
    {
      question: "A criança combina objetos relacionados?",
      category: "Cognition",
      suggestion_ainda_nao: "Use pares lógicos: sapato-meia, copo-prato.",
      suggestion_com_mediacao: "Explique relações entre objetos.",
    },
    {
      question: "A criança conta até 3 objetos corretamente?",
      category: "Cognition",
      suggestion_ainda_nao: "Use objetos concretos, conte tocando cada um.",
      suggestion_com_mediacao: "Pratique contagem em diferentes contextos.",
    },
    {
      question: "A criança separa objetos por tamanho?",
      category: "Cognition",
      suggestion_ainda_nao: "Use objetos com diferenças óbvias de tamanho.",
      suggestion_com_mediacao: "Crie jogos de classificação por tamanho.",
    },
    {
      question: "A criança desenha linha vertical e horizontal?",
      category: "Cognition",
      suggestion_ainda_nao: "Demonstre linhas, guie mão da criança.",
      suggestion_com_mediacao: "Pratique em diferentes superfícies.",
    },
    {
      question: "A criança identifica objetos que faltam?",
      category: "Cognition",
      suggestion_ainda_nao: "Remova objeto conhecido, pergunte o que falta.",
      suggestion_com_mediacao: "Use jogos de memória visual.",
    },
    {
      question: "A criança nomeia ações em curso?",
      category: "Cognition",
      suggestion_ainda_nao: "Nomeie ações enquanto acontecem.",
      suggestion_com_mediacao: "Incentive descrição de atividades.",
    },
    {
      question: "A criança identifica objetos por função?",
      category: "Cognition",
      suggestion_ainda_nao: "Explique para que servem os objetos.",
      suggestion_com_mediacao: "Faça perguntas sobre uso de objetos.",
    },
    {
      question: "A criança faz construções simples com blocos?",
      category: "Cognition",
      suggestion_ainda_nao: "Demonstre construções, incentive criatividade.",
      suggestion_com_mediacao: "Varie tipos de construções e materiais.",
    },
    {
      question: "A criança identifica objetos em diferentes posições?",
      category: "Cognition",
      suggestion_ainda_nao: "Mostre mesmo objeto em posições diferentes.",
      suggestion_com_mediacao: "Use jogos de reconhecimento visual.",
    },
    {
      question: "A criança resolve problemas simples?",
      category: "Cognition",
      suggestion_ainda_nao: "Apresente problemas simples, ofereça dicas.",
      suggestion_com_mediacao: "Incentive tentativas de solução independente.",
    },
    {
      question: "A criança imita sequências de 2-3 ações?",
      category: "Cognition",
      suggestion_ainda_nao: "Demonstre sequências simples, aguarde imitação.",
      suggestion_com_mediacao:
        "Aumente complexidade das sequências gradualmente.",
    },

    // AUTO-CUIDADOS (18 items)
    {
      question: "A criança come com garfo adequadamente?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Use garfo adaptado, comece com alimentos fáceis de espetar.",
      suggestion_com_mediacao: "Pratique com diferentes tipos de alimentos.",
    },
    {
      question: "A criança bebe de copo sem derramar?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Use copo com duas alças, coloque pouco líquido.",
      suggestion_com_mediacao: "Pratique controle de inclinação do copo.",
    },
    {
      question: "A criança obtém água sozinha quando tem sede?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Deixe água acessível, ensine a pedir quando necessário.",
      suggestion_com_mediacao: "Incentive independência na hidratação.",
    },
    {
      question: "A criança lava mãos com sabão quando lembrada?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Demonstre lavagem completa, torne rotina.",
      suggestion_com_mediacao: "Reduza lembretes gradualmente.",
    },
    {
      question: "A criança informa quando precisa usar banheiro?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Estabeleça sinais claros, responda prontamente.",
      suggestion_com_mediacao: "Incentive comunicação sobre necessidades.",
    },
    {
      question: "A criança permanece seca por períodos de 2 horas?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Estabeleça horários regulares para banheiro.",
      suggestion_com_mediacao: "Aumente intervalos gradualmente.",
    },
    {
      question: "A criança usa banheiro com ajuda mínima?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Ensine todos os passos, reduza ajuda gradualmente.",
      suggestion_com_mediacao: "Supervise segurança, incentive independência.",
    },
    {
      question: "A criança obtém lenço quando necessário?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Mantenha lenços acessíveis, ensine quando usar.",
      suggestion_com_mediacao: "Incentive higiene nasal independente.",
    },
    {
      question: "A criança usa guardanapo durante refeições?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Coloque guardanapo visível, lembre gentilmente.",
      suggestion_com_mediacao: "Torne uso do guardanapo um hábito.",
    },
    {
      question: "A criança escova dentes com supervisão?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Demonstre técnica, supervise escovação.",
      suggestion_com_mediacao: "Aumente independência gradualmente.",
    },
    {
      question: "A criança lava rosto quando solicitada?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Demonstre lavagem, use espelho para feedback.",
      suggestion_com_mediacao: "Ensine limpeza completa do rosto.",
    },
    {
      question: "A criança evita objetos perigosos quando alertada?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Ensine sobre perigos específicos, seja consistente.",
      suggestion_com_mediacao: "Reforce conceitos de segurança regularmente.",
    },
    {
      question: "A criança coloca sapatos (sem amarrar)?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Use sapatos fáceis de calçar, demonstre técnica.",
      suggestion_com_mediacao: "Pratique com diferentes tipos de calçados.",
    },
    {
      question: "A criança tira roupas simples sozinha?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Comece com roupas fáceis, demonstre sequência.",
      suggestion_com_mediacao: "Incentive independência no vestir.",
    },
    {
      question: "A criança coloca roupas simples com ajuda?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Organize roupas em ordem, ajude inicialmente.",
      suggestion_com_mediacao: "Reduza ajuda gradualmente.",
    },
    {
      question: "A criança desabotoa botões grandes?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Use roupas com botões grandes, demonstre técnica.",
      suggestion_com_mediacao: "Pratique coordenação motora fina.",
    },
    {
      question: "A criança fecha zíper grande?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Use zíperes grandes, demonstre movimento.",
      suggestion_com_mediacao: "Pratique com diferentes tipos de zíperes.",
    },
    {
      question: "A criança expressa quando está com frio ou calor?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Ensine vocabulário sobre temperatura corporal.",
      suggestion_com_mediacao: "Incentive comunicação sobre conforto físico.",
    },

    // DESENVOLVIMENTO MOTOR (16 items)
    {
      question: "A criança corre sem cair frequentemente?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Pratique corrida em espaços seguros, demonstre técnica.",
      suggestion_com_mediacao: "Aumente velocidade e distância gradualmente.",
    },
    {
      question: "A criança sobe escadas alternando os pés?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Demonstre padrão alternado, use corrimão para apoio.",
      suggestion_com_mediacao: "Pratique até conseguir sem apoio das mãos.",
    },
    {
      question: "A criança desce escadas alternando os pés?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Ensine padrão alternado, mantenha segurança.",
      suggestion_com_mediacao: "Reduza apoio gradualmente.",
    },
    {
      question: "A criança pula com ambos os pés juntos?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Demonstre pulo, segure mãos inicialmente.",
      suggestion_com_mediacao: "Pratique pulos em diferentes superfícies.",
    },
    {
      question: "A criança pedala triciclo por 1,5 metros?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Use triciclo apropriado, demonstre pedalada.",
      suggestion_com_mediacao: "Pratique coordenação e direção.",
    },
    {
      question: "A criança arremessa bola por cima da cabeça?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Demonstre movimento, use bola leve.",
      suggestion_com_mediacao: "Pratique mira e coordenação.",
    },
    {
      question: "A criança pega bola grande arremessada?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Use bola grande, comece com distâncias curtas.",
      suggestion_com_mediacao: "Aumente distância e reduza tamanho da bola.",
    },
    {
      question: "A criança anda em linha reta por 3 metros?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Use fita no chão como guia, demonstre.",
      suggestion_com_mediacao: "Pratique equilíbrio e coordenação.",
    },
    {
      question: "A criança fica em um pé só por 2 segundos?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Ofereça apoio inicial, pratique equilíbrio.",
      suggestion_com_mediacao: "Aumente tempo gradualmente.",
    },
    {
      question: "A criança caminha na ponta dos pés por 3 metros?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Demonstre caminhada, ofereça apoio inicial.",
      suggestion_com_mediacao: "Pratique equilíbrio e coordenação.",
    },
    {
      question: "A criança faz movimentos de dança simples?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Toque música, demonstre movimentos básicos.",
      suggestion_com_mediacao: "Incentive expressão através do movimento.",
    },
    {
      question: "A criança desenha círculos e linhas?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Ofereça materiais adequados, demonstre movimentos.",
      suggestion_com_mediacao: "Pratique controle de lápis e coordenação.",
    },
    {
      question: "A criança usa tesoura para cortar papel?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Use tesoura sem ponta, demonstre movimento.",
      suggestion_com_mediacao: "Pratique coordenação das duas mãos.",
    },
    {
      question: "A criança constrói torres de 6-8 blocos?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Use blocos estáveis, demonstre empilhamento.",
      suggestion_com_mediacao: "Incentive construções criativas.",
    },
    {
      question: "A criança vira páginas de livro individualmente?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Use livros apropriados, demonstre movimento delicado.",
      suggestion_com_mediacao: "Pratique coordenação motora fina.",
    },
    {
      question: "A criança enrosca e desenrosca tampas?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Use recipientes com tampas grandes, demonstre movimento.",
      suggestion_com_mediacao: "Varie tipos de tampas e recipientes.",
    },
  ],

  "3-4": [
    // SOCIALIZAÇÃO (20 items)
    {
      question: "A criança imita adulto fazendo tarefas domésticas?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Demonstre tarefas simples como varrer, deixe a criança 'ajudar' com utensílios pequenos.",
      suggestion_com_mediacao:
        "Forneça ferramentas adequadas ao tamanho da criança para imitação.",
    },
    {
      question: "A criança brinca vestindo roupas de adulto?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Disponibilize roupas velhas de adultos para brincadeiras de faz de conta.",
      suggestion_com_mediacao:
        "Incentive dramatização de diferentes papéis sociais.",
    },
    {
      question: "A criança escolhe entre duas atividades?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Ofereça duas opções claras e aguarde a escolha da criança.",
      suggestion_com_mediacao: "Expanda para mais opções gradualmente.",
    },
    {
      question:
        "A criança mostra que quer independência fazendo coisas sozinha?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Permita tentativas independentes, ofereça ajuda apenas quando solicitado.",
      suggestion_com_mediacao:
        "Equilibre independência com segurança e orientação.",
    },
    {
      question: "A criança canta e dança ao ouvir música?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Toque músicas variadas, demonstre movimentos simples de dança.",
      suggestion_com_mediacao:
        "Incentive expressão criativa através da música e movimento.",
    },
    {
      question: "A criança segue regras em jogos dirigidos por adulto?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Use jogos com regras muito simples, seja consistente na aplicação.",
      suggestion_com_mediacao: "Aumente complexidade das regras gradualmente.",
    },
    {
      question: "A criança brinca próxima e interage com outras crianças?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Facilite encontros com outras crianças, supervise interações positivas.",
      suggestion_com_mediacao:
        "Ensine questions básicas de compartilhamento e cooperação.",
    },
    {
      question: "A criança cumprimenta adultos conhecidos sem ser lembrada?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Modele cumprimentos consistentemente, elogie tentativas espontâneas.",
      suggestion_com_mediacao:
        "Pratique cumprimentos em diferentes situações sociais.",
    },
    {
      question: "A criança segue rotinas estabelecidas?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Estabeleça rotinas claras e visuais, seja consistente.",
      suggestion_com_mediacao:
        "Envolva a criança no planejamento e execução das rotinas.",
    },
    {
      question:
        "A criança demonstra cuidado com pessoas machucadas ou tristes?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Modele empatia, explique sentimentos de outras pessoas.",
      suggestion_com_mediacao:
        "Incentive gestos de cuidado e conforto apropriados.",
    },
    {
      question: "A criança participa de atividades em grupo por 5-10 minutos?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Comece com atividades curtas e interessantes para a criança.",
      suggestion_com_mediacao:
        "Aumente duração gradualmente, varie tipos de atividades.",
    },
    {
      question: "A criança espera sua vez em atividades?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Use atividades com turnos claros, ensine conceito de 'vez'.",
      suggestion_com_mediacao:
        "Pratique espera em diferentes contextos e situações.",
    },
    {
      question: "A criança usa 'por favor' e 'obrigado' quando lembrada?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Modele uso consistente, lembre gentilmente quando necessário.",
      suggestion_com_mediacao:
        "Reduza lembretes gradualmente, incentive uso espontâneo.",
    },
    {
      question: "A criança responde quando chamada de outro cômodo?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Chame pelo nome, aguarde resposta antes de repetir.",
      suggestion_com_mediacao:
        "Ensine respostas apropriadas como 'estou aqui' ou 'já vou'.",
    },
    {
      question: "A criança brinca cooperativamente com outras crianças?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Facilite brincadeiras simples que requerem cooperação.",
      suggestion_com_mediacao:
        "Ensine resolução básica de conflitos em brincadeiras.",
    },
    {
      question: "A criança permanece em área designada quando solicitada?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Defina limites claros, explique razões para permanecer na área.",
      suggestion_com_mediacao:
        "Use lembretes visuais e elogios por seguir instruções.",
    },
    {
      question: "A criança expressa sentimentos verbalmente?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Ensine vocabulário emocional básico, valide sentimentos expressos.",
      suggestion_com_mediacao:
        "Incentive expressão verbal ao invés de comportamentos inadequados.",
    },
    {
      question: "A criança oferece ajuda a adultos?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Aceite ofertas de ajuda, mesmo que não seja perfeita.",
      suggestion_com_mediacao:
        "Crie oportunidades para a criança ajudar de forma significativa.",
    },
    {
      question: "A criança trabalha sozinha em atividade por 15-20 minutos?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Ofereça atividades adequadas ao interesse e nível da criança.",
      suggestion_com_mediacao:
        "Aumente tempo gradualmente, varie tipos de atividades.",
    },
    {
      question: "A criança pede desculpas quando faz algo errado?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Modele pedidos de desculpa, explique quando são apropriados.",
      suggestion_com_mediacao:
        "Ensine diferença entre acidentes e comportamentos intencionais.",
    },

    // LINGUAGEM (24 items)
    {
      question:
        "A criança combina substantivo ou adjetivo com substantivo em frases de 2 palavras?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Modele combinações simples como 'carro grande', 'boneca bonita'.",
      suggestion_com_mediacao:
        "Expanda tentativas da criança adicionando palavras descritivas.",
    },
    {
      question: "A criança faz frases negativas?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Modele frases negativas simples como 'não quero', 'não gosto'.",
      suggestion_com_mediacao:
        "Incentive uso apropriado de negativas em diferentes contextos.",
    },
    {
      question: "A criança responde a perguntas simples de 'o que'?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Faça perguntas sobre objetos visíveis, aguarde resposta.",
      suggestion_com_mediacao:
        "Varie contextos das perguntas, use figuras e objetos reais.",
    },
    {
      question: "A criança usa frases de 3 palavras?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Modele frases de 3 palavras, expanda tentativas da criança.",
      suggestion_com_mediacao:
        "Incentive elaboração de ideias em frases mais longas.",
    },
    {
      question: "A criança usa formas plurais?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Use plurais consistentemente, enfatize diferença entre um e vários.",
      suggestion_com_mediacao: "Corrija gentilmente modelando forma correta.",
    },
    {
      question: "A criança usa formas verbais no passado?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Fale sobre eventos passados, modele formas verbais corretas.",
      suggestion_com_mediacao:
        "Corrija gentilmente e pratique em diferentes contextos.",
    },
    {
      question: "A criança diz nome completo quando perguntada?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Pratique nome completo diariamente, use em jogos e músicas.",
      suggestion_com_mediacao:
        "Ensine quando e onde é apropriado dizer nome completo.",
    },
    {
      question: "A criança responde a perguntas simples de 'quem'?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Faça perguntas sobre pessoas conhecidas, use fotos como apoio.",
      suggestion_com_mediacao: "Varie contextos e pessoas nas perguntas.",
    },
    {
      question: "A criança responde a perguntas de 'onde'?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Faça perguntas sobre localização de objetos e pessoas.",
      suggestion_com_mediacao:
        "Use jogos de esconder para praticar conceitos de localização.",
    },
    {
      question: "A criança usa artigos 'o', 'a', 'um', 'uma'?",
      category: "Linguagem",
      suggestion_ainda_nao: "Modele uso correto de artigos em sua fala.",
      suggestion_com_mediacao:
        "Corrija gentilmente e pratique com diferentes substantivos.",
    },
    {
      question: "A criança usa alguns verbos no gerúndio?",
      category: "Linguagem",
      suggestion_ainda_nao: "Use gerúndio ao descrever ações em andamento.",
      suggestion_com_mediacao: "Incentive descrição de ações usando gerúndio.",
    },
    {
      question:
        "A criança responde a perguntas simples de 'por que' com 'porque'?",
      category: "Linguagem",
      suggestion_ainda_nao: "Faça perguntas simples de causa e efeito.",
      suggestion_com_mediacao:
        "Aceite respostas simples, expanda explicações gradualmente.",
    },
    {
      question: "A criança expressa intenção usando 'vou' + verbo?",
      category: "Linguagem",
      suggestion_ainda_nao: "Modele expressões de intenção, fale sobre planos.",
      suggestion_com_mediacao:
        "Incentive a criança a expressar seus planos e intenções.",
    },
    {
      question: "A criança muda apropriadamente o volume de voz?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Modele diferentes volumes, explique quando usar cada um.",
      suggestion_com_mediacao:
        "Pratique sussurrar, falar normal e falar alto em contextos apropriados.",
    },
    {
      question: "A criança usa imperativo ao dar ordens?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Modele pedidos educados, ensine diferença entre pedir e ordenar.",
      suggestion_com_mediacao: "Ensine formas polidas de fazer pedidos.",
    },
    {
      question: "A criança conta até 3?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Pratique contagem com objetos concretos diariamente.",
      suggestion_com_mediacao:
        "Use contagem em atividades funcionais e brincadeiras.",
    },
    {
      question: "A criança usa palavras de localização?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Use preposições de lugar consistentemente: em, sobre, embaixo.",
      suggestion_com_mediacao:
        "Pratique com jogos de posicionamento de objetos.",
    },
    {
      question: "A criança nomeia ações em figuras?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Use livros com ações claras, aponte e nomeie o que pessoas fazem.",
      suggestion_com_mediacao: "Faça perguntas sobre ações nas figuras.",
    },
    {
      question: "A criança usa formas possessivas?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Use possessivos ao falar sobre objetos de pessoas.",
      suggestion_com_mediacao: "Corrija gentilmente e modele uso correto.",
    },
    {
      question: "A criança usa 'não' no início de frases?",
      category: "Linguagem",
      suggestion_ainda_nao: "Modele negativas bem formadas, aceite tentativas.",
      suggestion_com_mediacao:
        "Expanda negativas simples em frases mais completas.",
    },
    {
      question: "A criança responde a perguntas de 'de quem'?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Faça perguntas sobre posse usando objetos familiares.",
      suggestion_com_mediacao: "Use jogos para praticar conceitos de posse.",
    },
    {
      question: "A criança usa frases com 4-5 palavras?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Modele frases mais longas, expanda tentativas da criança.",
      suggestion_com_mediacao:
        "Incentive elaboração de ideias em frases complexas.",
    },
    {
      question: "A criança usa conjunção 'e'?",
      category: "Linguagem",
      suggestion_ainda_nao: "Modele uso de 'e' para conectar ideias simples.",
      suggestion_com_mediacao: "Incentive conexões entre ideias usando 'e'.",
    },
    {
      question: "A criança relata experiências imediatas?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Incentive a criança a contar o que acabou de fazer.",
      suggestion_com_mediacao:
        "Faça perguntas para ajudar a organizar narrativas simples.",
    },

    // COGNIÇÃO (24 items)
    {
      question: "A criança encontra livro específico quando solicitada?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Organize livros de forma acessível, pratique identificação por capa.",
      suggestion_com_mediacao:
        "Use características distintivas dos livros para facilitar busca.",
    },
    {
      question: "A criança completa quebra-cabeça de 3-4 peças?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Comece com 2 peças, use quebra-cabeças com figuras familiares.",
      suggestion_com_mediacao: "Aumente número de peças gradualmente.",
    },
    {
      question: "A criança nomeia objetos grandes e pequenos?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Compare tamanhos usando objetos concretos, enfatize diferenças.",
      suggestion_com_mediacao: "Use jogos de classificação por tamanho.",
    },
    {
      question:
        "A criança desenha linha vertical imitando adulto dentro de 30 graus?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Demonstre linha vertical, guie mão da criança inicialmente.",
      suggestion_com_mediacao:
        "Pratique em diferentes superfícies e materiais.",
    },
    {
      question:
        "A criança desenha linha horizontal imitando adulto dentro de 30 graus?",
      category: "Cognição",
      suggestion_ainda_nao: "Demonstre linha horizontal após dominar vertical.",
      suggestion_com_mediacao: "Alterne entre linhas verticais e horizontais.",
    },
    {
      question: "A criança copia círculo?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Faça movimentos circulares no ar primeiro, depois no papel.",
      suggestion_com_mediacao: "Pratique círculos de diferentes tamanhos.",
    },
    {
      question: "A criança desenha círculo espontaneamente?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Ofereça materiais para desenhar, demonstre círculos.",
      suggestion_com_mediacao: "Incentive desenho livre e criativo.",
    },
    {
      question: "A criança combina objetos relacionados?",
      category: "Cognição",
      suggestion_ainda_nao: "Use pares lógicos: sapato-meia, copo-prato.",
      suggestion_com_mediacao: "Explique relações entre objetos.",
    },
    {
      question: "A criança conta até 3 objetos corretamente?",
      category: "Cognição",
      suggestion_ainda_nao: "Use objetos concretos, conte tocando cada um.",
      suggestion_com_mediacao: "Pratique contagem em diferentes contextos.",
    },
    {
      question: "A criança separa objetos por tamanho?",
      category: "Cognição",
      suggestion_ainda_nao: "Use objetos com diferenças óbvias de tamanho.",
      suggestion_com_mediacao: "Crie jogos de classificação por tamanho.",
    },
    {
      question: "A criança desenha linha vertical e horizontal?",
      category: "Cognição",
      suggestion_ainda_nao: "Demonstre linhas, guie mão da criança.",
      suggestion_com_mediacao: "Pratique em diferentes superfícies.",
    },
    {
      question: "A criança identifica objetos que faltam?",
      category: "Cognição",
      suggestion_ainda_nao: "Remova objeto conhecido, pergunte o que falta.",
      suggestion_com_mediacao: "Use jogos de memória visual.",
    },
    {
      question: "A criança nomeia ações em curso?",
      category: "Cognição",
      suggestion_ainda_nao: "Nomeie ações enquanto acontecem.",
      suggestion_com_mediacao: "Incentive descrição de atividades.",
    },
    {
      question: "A criança identifica objetos por função?",
      category: "Cognição",
      suggestion_ainda_nao: "Explique para que servem os objetos.",
      suggestion_com_mediacao: "Faça perguntas sobre uso de objetos.",
    },
    {
      question: "A criança faz construções simples com blocos?",
      category: "Cognição",
      suggestion_ainda_nao: "Demonstre construções, incentive criatividade.",
      suggestion_com_mediacao: "Varie tipos de construções e materiais.",
    },
    {
      question: "A criança identifica objetos em diferentes posições?",
      category: "Cognição",
      suggestion_ainda_nao: "Mostre mesmo objeto em posições diferentes.",
      suggestion_com_mediacao: "Use jogos de reconhecimento visual.",
    },
    {
      question: "A criança resolve problemas simples?",
      category: "Cognição",
      suggestion_ainda_nao: "Apresente problemas simples, ofereça dicas.",
      suggestion_com_mediacao: "Incentive tentativas de solução independente.",
    },
    {
      question: "A criança imita sequências de 2-3 ações?",
      category: "Cognição",
      suggestion_ainda_nao: "Demonstre sequências simples, aguarde imitação.",
      suggestion_com_mediacao:
        "Aumente complexidade das sequências gradualmente.",
    },

    // AUTO-CUIDADOS (18 items)
    {
      question: "A criança come com garfo adequadamente?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Use garfo adaptado, comece com alimentos fáceis de espetar.",
      suggestion_com_mediacao: "Pratique com diferentes tipos de alimentos.",
    },
    {
      question: "A criança bebe de copo sem derramar?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Use copo com duas alças, coloque pouco líquido.",
      suggestion_com_mediacao: "Pratique controle de inclinação do copo.",
    },
    {
      question: "A criança obtém água sozinha quando tem sede?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Deixe água acessível, ensine a pedir quando necessário.",
      suggestion_com_mediacao: "Incentive independência na hidratação.",
    },
    {
      question: "A criança lava mãos com sabão quando lembrada?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Demonstre lavagem completa, torne rotina.",
      suggestion_com_mediacao: "Reduza lembretes gradualmente.",
    },
    {
      question: "A criança informa quando precisa usar banheiro?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Estabeleça sinais claros, responda prontamente.",
      suggestion_com_mediacao: "Incentive comunicação sobre necessidades.",
    },
    {
      question: "A criança permanece seca por períodos de 2 horas?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Estabeleça horários regulares para banheiro.",
      suggestion_com_mediacao: "Aumente intervalos gradualmente.",
    },
    {
      question: "A criança usa banheiro com ajuda mínima?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Ensine todos os passos, reduza ajuda gradualmente.",
      suggestion_com_mediacao: "Supervise segurança, incentive independência.",
    },
    {
      question: "A criança obtém lenço quando necessário?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Mantenha lenços acessíveis, ensine quando usar.",
      suggestion_com_mediacao: "Incentive higiene nasal independente.",
    },
    {
      question: "A criança usa guardanapo durante refeições?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Coloque guardanapo visível, lembre gentilmente.",
      suggestion_com_mediacao: "Torne uso do guardanapo um hábito.",
    },
    {
      question: "A criança escova dentes com supervisão?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Demonstre técnica, supervise escovação.",
      suggestion_com_mediacao: "Aumente independência gradualmente.",
    },
    {
      question: "A criança lava rosto quando solicitada?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Demonstre lavagem, use espelho para feedback.",
      suggestion_com_mediacao: "Ensine limpeza completa do rosto.",
    },
    {
      question: "A criança evita objetos perigosos quando alertada?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Ensine sobre perigos específicos, seja consistente.",
      suggestion_com_mediacao: "Reforce conceitos de segurança regularmente.",
    },
    {
      question: "A criança coloca sapatos (sem amarrar)?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Use sapatos fáceis de calçar, demonstre técnica.",
      suggestion_com_mediacao: "Pratique com diferentes tipos de calçados.",
    },
    {
      question: "A criança tira roupas simples sozinha?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Comece com roupas fáceis, demonstre sequência.",
      suggestion_com_mediacao: "Incentive independência no vestir.",
    },
    {
      question: "A criança coloca roupas simples com ajuda?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Organize roupas em ordem, ajude inicialmente.",
      suggestion_com_mediacao: "Reduza ajuda gradualmente.",
    },
    {
      question: "A criança desabotoa botões grandes?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Use roupas com botões grandes, demonstre técnica.",
      suggestion_com_mediacao: "Pratique coordenação motora fina.",
    },
    {
      question: "A criança fecha zíper grande?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Use zíperes grandes, demonstre movimento.",
      suggestion_com_mediacao: "Pratique com diferentes tipos de zíperes.",
    },
    {
      question: "A criança expressa quando está com frio ou calor?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Ensine vocabulário sobre temperatura corporal.",
      suggestion_com_mediacao: "Incentive comunicação sobre conforto físico.",
    },

    // DESENVOLVIMENTO MOTOR (16 items)
    {
      question: "A criança corre sem cair frequentemente?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Pratique corrida em espaços seguros, demonstre técnica.",
      suggestion_com_mediacao: "Aumente velocidade e distância gradualmente.",
    },
    {
      question: "A criança sobe escadas alternando os pés?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Demonstre padrão alternado, use corrimão para apoio.",
      suggestion_com_mediacao: "Pratique até conseguir sem apoio das mãos.",
    },
    {
      question: "A criança desce escadas alternando os pés?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Ensine padrão alternado, mantenha segurança.",
      suggestion_com_mediacao: "Reduza apoio gradualmente.",
    },
    {
      question: "A criança pula com ambos os pés juntos?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Demonstre pulo, segure mãos inicialmente.",
      suggestion_com_mediacao: "Pratique pulos em diferentes superfícies.",
    },
    {
      question: "A criança pedala triciclo por 1,5 metros?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Use triciclo apropriado, demonstre pedalada.",
      suggestion_com_mediacao: "Pratique coordenação e direção.",
    },
    {
      question: "A criança arremessa bola por cima da cabeça?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Demonstre movimento, use bola leve.",
      suggestion_com_mediacao: "Pratique mira e coordenação.",
    },
    {
      question: "A criança pega bola grande arremessada?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Use bola grande, comece com distâncias curtas.",
      suggestion_com_mediacao: "Aumente distância e reduza tamanho da bola.",
    },
    {
      question: "A criança anda em linha reta por 3 metros?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Use fita no chão como guia, demonstre.",
      suggestion_com_mediacao: "Pratique equilíbrio e coordenação.",
    },
    {
      question: "A criança fica em um pé só por 2 segundos?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Ofereça apoio inicial, pratique equilíbrio.",
      suggestion_com_mediacao: "Aumente tempo gradualmente.",
    },
    {
      question: "A criança caminha na ponta dos pés por 3 metros?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Demonstre caminhada, ofereça apoio inicial.",
      suggestion_com_mediacao: "Pratique equilíbrio e coordenação.",
    },
    {
      question: "A criança faz movimentos de dança simples?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Toque música, demonstre movimentos básicos.",
      suggestion_com_mediacao: "Incentive expressão através do movimento.",
    },
    {
      question: "A criança desenha círculos e linhas?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Ofereça materiais adequados, demonstre movimentos.",
      suggestion_com_mediacao: "Pratique controle de lápis e coordenação.",
    },
    {
      question: "A criança usa tesoura para cortar papel?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Use tesoura sem ponta, demonstre movimento.",
      suggestion_com_mediacao: "Pratique coordenação das duas mãos.",
    },
    {
      question: "A criança constrói torres de 6-8 blocos?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Use blocos estáveis, demonstre empilhamento.",
      suggestion_com_mediacao: "Incentive construções criativas.",
    },
    {
      question: "A criança vira páginas de livro individualmente?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Use livros apropriados, demonstre movimento delicado.",
      suggestion_com_mediacao: "Pratique coordenação motora fina.",
    },
    {
      question: "A criança enrosca e desenrosca tampas?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Use recipientes com tampas grandes, demonstre movimento.",
      suggestion_com_mediacao: "Varie tipos de tampas e recipientes.",
    },
  ],

  "4-5": [
    // SOCIALIZAÇÃO (20 items)
    {
      question:
        "A criança brinca de 'casinha' ou outras brincadeiras de faz de conta?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Disponibilize fantasias e acessórios para brincadeiras de faz de conta.",
      suggestion_com_mediacao:
        "Incentive a criação de histórias e papéis diferentes.",
    },
    {
      question: "A criança segue regras em jogos de grupo?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Use jogos com regras simples e claras, explique as regras antes de começar.",
      suggestion_com_mediacao:
        "Incentive a criança a ajudar a criar novas regras para os jogos.",
    },
    {
      question:
        "A criança compartilha brinquedos e materiais com outras crianças?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Incentive o compartilhamento, explique os benefícios de dividir com os outros.",
      suggestion_com_mediacao:
        "Elogie a criança quando ela compartilha espontaneamente.",
    },
    {
      question: "A criança espera a sua vez em jogos e atividades?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Use atividades com turnos claros, ensine o conceito de 'esperar a vez'.",
      suggestion_com_mediacao:
        "Incentive a criança a ser paciente e a respeitar a vez dos outros.",
    },
    {
      question: "A criança ajuda outras crianças quando elas precisam?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Modele o comportamento de ajuda, explique como ajudar os outros.",
      suggestion_com_mediacao:
        "Elogie a criança quando ela ajuda os outros espontaneamente.",
    },
    {
      question: "A criança expressa seus sentimentos de forma apropriada?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Ensine o vocabulário emocional básico, valide os sentimentos da criança.",
      suggestion_com_mediacao:
        "Incentive a criança a expressar seus sentimentos verbalmente, em vez de agir.",
    },
    {
      question:
        "A criança resolve conflitos com outras crianças de forma pacífica?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Ensine estratégias de resolução de conflitos, como conversar e negociar.",
      suggestion_com_mediacao:
        "Ajude a criança a encontrar soluções para os conflitos, em vez de brigar.",
    },
    {
      question: "A criança segue instruções simples dadas por adultos?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Dê instruções claras e concisas, certifique-se de que a criança entendeu.",
      suggestion_com_mediacao:
        "Use lembretes visuais e elogios para incentivar a criança a seguir as instruções.",
    },
    {
      question: "A criança segue as regras da casa e da escola?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Explique as regras de forma clara e consistente, explique os motivos por trás das regras.",
      suggestion_com_mediacao:
        "Use consequências lógicas para quando a criança não segue as regras.",
    },
    {
      question: "A criança cuida de seus pertences?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Ensine a criança a guardar seus brinquedos e materiais, explique a importância de cuidar de suas coisas.",
      suggestion_com_mediacao:
        "Use um sistema de recompensas para incentivar a criança a cuidar de seus pertences.",
    },
    {
      question: "A criança pede ajuda quando precisa?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Incentive a criança a pedir ajuda quando ela está com dificuldades, explique que não há problema em pedir ajuda.",
      suggestion_com_mediacao:
        "Responda prontamente aos pedidos de ajuda da criança.",
    },
    {
      question: "A criança se veste e se despe sozinha?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Dê roupas fáceis de vestir e despir, ensine a criança a sequência correta.",
      suggestion_com_mediacao:
        "Elogie a criança quando ela se veste e se despe sozinha.",
    },
    {
      question: "A criança vai ao banheiro sozinha?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Certifique-se de que a criança sabe como usar o banheiro corretamente, deixe a criança ir ao banheiro quando precisar.",
      suggestion_com_mediacao:
        "Elogie a criança quando ela vai ao banheiro sozinha.",
    },
    {
      question: "A criança lava as mãos sozinha?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Ensine a criança a lavar as mãos corretamente, certifique-se de que a criança tem acesso a água e sabão.",
      suggestion_com_mediacao:
        "Elogie a criança quando ela lava as mãos sozinha.",
    },
    {
      question: "A criança escova os dentes sozinha?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Ensine a criança a escovar os dentes corretamente, certifique-se de que a criança tem acesso a escova e pasta de dente.",
      suggestion_com_mediacao:
        "Supervisione a escovação dos dentes da criança, elogie a criança quando ela escova os dentes sozinha.",
    },
    {
      question: "A criança come sozinha usando talheres?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Dê talheres adequados para a idade da criança, ensine a criança a usar os talheres corretamente.",
      suggestion_com_mediacao:
        "Elogie a criança quando ela come sozinha usando talheres.",
    },
    {
      question: "A criança se oferece para ajudar em tarefas domésticas?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Incentive a criança a ajudar em tarefas domésticas, explique os benefícios de ajudar em casa.",
      suggestion_com_mediacao:
        "Elogie a criança quando ela se oferece para ajudar em tarefas domésticas.",
    },
    {
      question: "A criança demonstra empatia por outras pessoas?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Modele o comportamento de empatia, explique como se colocar no lugar dos outros.",
      suggestion_com_mediacao:
        "Elogie a criança quando ela demonstra empatia por outras pessoas.",
    },
    {
      question: "A criança respeita as diferenças entre as pessoas?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Explique que todas as pessoas são diferentes e que devemos respeitar as diferenças.",
      suggestion_com_mediacao:
        "Corrija a criança quando ela faz comentários desrespeitosos sobre outras pessoas.",
    },
    {
      question: "A criança expressa gratidão?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Modele o comportamento de gratidão, explique a importância de agradecer pelas coisas boas.",
      suggestion_com_mediacao:
        "Incentive a criança a agradecer pelas coisas boas que acontecem em sua vida.",
    },

    // LINGUAGEM (24 items)
    {
      question: "A criança usa frases com 5-6 palavras?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Modele frases mais longas, expanda as tentativas da criança.",
      suggestion_com_mediacao:
        "Incentive a elaboração de ideias em frases complexas.",
    },
    {
      question: "A criança conta histórias simples?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Incentive a criança a contar o que fez durante o dia, ajude a organizar a história.",
      suggestion_com_mediacao:
        "Faça perguntas para ajudar a criança a elaborar a história.",
    },
    {
      question: "A criança responde a perguntas complexas?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Faça perguntas que exigem mais do que uma resposta simples, dê tempo para a criança pensar.",
      suggestion_com_mediacao:
        "Ajude a criança a encontrar as palavras certas para responder à pergunta.",
    },
    {
      question: "A criança usa o tempo futuro?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Fale sobre planos para o futuro, use o tempo futuro em suas frases.",
      suggestion_com_mediacao:
        "Incentive a criança a falar sobre seus planos para o futuro.",
    },
    {
      question: "A criança usa o tempo condicional?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Use frases condicionais em suas conversas, explique o que significa 'se'.",
      suggestion_com_mediacao:
        "Incentive a criança a usar frases condicionais em suas conversas.",
    },
    {
      question: "A criança usa pronomes possessivos?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Use pronomes possessivos em suas frases, explique o que significa 'meu', 'seu', 'dele', 'dela'.",
      suggestion_com_mediacao:
        "Incentive a criança a usar pronomes possessivos em suas frases.",
    },
    {
      question: "A criança usa preposições complexas?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Use preposições complexas em suas frases, explique o que significa 'através', 'em cima de', 'em baixo de'.",
      suggestion_com_mediacao:
        "Incentive a criança a usar preposições complexas em suas frases.",
    },
    {
      question: "A criança usa conjunções complexas?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Use conjunções complexas em suas frases, explique o que significa 'porque', 'mas', 'se', 'então'.",
      suggestion_com_mediacao:
        "Incentive a criança a usar conjunções complexas em suas frases.",
    },
    {
      question: "A criança descreve objetos em detalhes?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Peça para a criança descrever objetos, ajude a encontrar as palavras certas.",
      suggestion_com_mediacao:
        "Incentive a criança a usar adjetivos e outros detalhes para descrever os objetos.",
    },
    {
      question: "A criança segue instruções de 3 passos?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Dê instruções claras e concisas, certifique-se de que a criança entendeu.",
      suggestion_com_mediacao:
        "Use lembretes visuais e elogios para incentivar a criança a seguir as instruções.",
    },
    {
      question: "A criança responde a perguntas sobre histórias?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Leia histórias para a criança, faça perguntas sobre os personagens, o enredo e o cenário.",
      suggestion_com_mediacao:
        "Incentive a criança a fazer perguntas sobre as histórias.",
    },
    {
      question:
        "A criança usa palavras para expressar suas necessidades e desejos?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Incentive a criança a usar palavras para expressar suas necessidades e desejos, ajude a encontrar as palavras certas.",
      suggestion_com_mediacao: "Responda prontamente aos pedidos da criança.",
    },
    {
      question: "A criança usa palavras para descrever seus sentimentos?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Ensine o vocabulário emocional básico, valide os sentimentos da criança.",
      suggestion_com_mediacao:
        "Incentive a criança a usar palavras para descrever seus sentimentos.",
    },
    {
      question: "A criança usa palavras para fazer perguntas?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Incentive a criança a fazer perguntas, responda às perguntas da criança de forma clara e concisa.",
      suggestion_com_mediacao:
        "Faça perguntas para estimular a curiosidade da criança.",
    },
    {
      question: "A criança usa palavras para contar histórias?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Incentive a criança a contar histórias, ajude a organizar a história.",
      suggestion_com_mediacao:
        "Faça perguntas para ajudar a criança a elaborar a história.",
    },
    {
      question: "A criança usa palavras para expressar sua opinião?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Incentive a criança a expressar sua opinião, explique que todas as opiniões são válidas.",
      suggestion_com_mediacao:
        "Respeite a opinião da criança, mesmo que você não concorde.",
    },
    {
      question: "A criança usa palavras para resolver conflitos?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Ensine estratégias de resolução de conflitos, como conversar e negociar.",
      suggestion_com_mediacao:
        "Ajude a criança a encontrar soluções para os conflitos, em vez de brigar.",
    },

    // COGNIÇÃO (24 items)
    {
      question:
        "A criança reconhece e nomeia as cores primárias e secundárias?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Use objetos coloridos, faça jogos de identificação de cores.",
      suggestion_com_mediacao:
        "Incentive a criança a usar as cores para descrever objetos e desenhos.",
    },
    {
      question: "A criança reconhece e nomeia as formas geométricas básicas?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Use objetos com formas geométricas diferentes, faça jogos de identificação de formas.",
      suggestion_com_mediacao:
        "Incentive a criança a usar as formas geométricas para desenhar e construir.",
    },
    {
      question: "A criança conta até 10?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Pratique a contagem com objetos concretos, use jogos e músicas para tornar a contagem mais divertida.",
      suggestion_com_mediacao:
        "Incentive a criança a usar a contagem em situações cotidianas.",
    },
    {
      question: "A criança reconhece os números de 1 a 10?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Use cartões com números, faça jogos de identificação de números.",
      suggestion_com_mediacao:
        "Incentive a criança a usar os números para identificar quantidades e medidas.",
    },
    {
      question: "A criança entende os conceitos de 'maior' e 'menor'?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Compare objetos de tamanhos diferentes, use palavras como 'maior' e 'menor' em suas frases.",
      suggestion_com_mediacao:
        "Incentive a criança a usar os conceitos de 'maior' e 'menor' para comparar objetos e quantidades.",
    },
    {
      question: "A criança entende os conceitos de 'mais' e 'menos'?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Adicione e remova objetos de um grupo, use palavras como 'mais' e 'menos' em suas frases.",
      suggestion_com_mediacao:
        "Incentive a criança a usar os conceitos de 'mais' e 'menos' para comparar quantidades.",
    },
    {
      question: "A criança entende os conceitos de 'cheio' e 'vazio'?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Encha e esvazie recipientes, use palavras como 'cheio' e 'vazio' em suas frases.",
      suggestion_com_mediacao:
        "Incentive a criança a usar os conceitos de 'cheio' e 'vazio' para descrever recipientes e quantidades.",
    },
    {
      question:
        "A criança entende os conceitos de 'em cima', 'em baixo' e 'ao lado'?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Coloque objetos em diferentes posições, use palavras como 'em cima', 'em baixo' e 'ao lado' em suas frases.",
      suggestion_com_mediacao:
        "Incentive a criança a usar os conceitos de 'em cima', 'em baixo' e 'ao lado' para descrever a posição de objetos.",
    },
    {
      question: "A criança consegue seguir uma sequência de 3 instruções?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Dê instruções claras e concisas, certifique-se de que a criança entendeu.",
      suggestion_com_mediacao:
        "Use lembretes visuais e elogios para incentivar a criança a seguir as instruções.",
    },
    {
      question: "A criança consegue resolver quebra-cabeças simples?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Comece com quebra-cabeças de poucas peças, aumente a dificuldade gradualmente.",
      suggestion_com_mediacao:
        "Ajude a criança a encontrar as peças certas, elogie a criança quando ela completa o quebra-cabeça.",
    },
    {
      question: "A criança consegue identificar as partes do corpo?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Use um boneco ou um espelho, aponte para as partes do corpo e diga o nome.",
      suggestion_com_mediacao:
        "Faça jogos de identificação das partes do corpo.",
    },
    {
      question: "A criança consegue identificar os animais?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Use livros e brinquedos com animais, faça os sons dos animais.",
      suggestion_com_mediacao: "Leve a criança ao zoológico ou a uma fazenda.",
    },
    {
      question: "A criança consegue identificar os alimentos?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Use alimentos de verdade ou brinquedos de comida, diga o nome dos alimentos.",
      suggestion_com_mediacao: "Leve a criança ao supermercado ou à feira.",
    },
    {
      question: "A criança consegue identificar as roupas?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Use roupas de verdade ou desenhos de roupas, diga o nome das roupas.",
      suggestion_com_mediacao:
        "Peça para a criança ajudar a guardar as roupas.",
    },
    {
      question: "A criança consegue identificar os meios de transporte?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Use livros e brinquedos com meios de transporte, faça os sons dos meios de transporte.",
      suggestion_com_mediacao:
        "Leve a criança para ver os meios de transporte de perto.",
    },
    {
      question: "A criança consegue imitar desenhos simples?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Desenhe formas simples, peça para a criança imitar.",
      suggestion_com_mediacao: "Elogie a criança quando ela imita os desenhos.",
    },
    {
      question: "A criança consegue copiar letras e números?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Escreva letras e números, peça para a criança copiar.",
      suggestion_com_mediacao:
        "Elogie a criança quando ela copia as letras e os números.",
    },
    {
      question: "A criança consegue recortar com tesoura?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Use tesoura sem ponta, ensine a criança a recortar corretamente.",
      suggestion_com_mediacao: "Supervisione a criança enquanto ela recorta.",
    },
    {
      question: "A criança consegue colar?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Use cola bastão, ensine a criança a colar corretamente.",
      suggestion_com_mediacao: "Supervisione a criança enquanto ela cola.",
    },
    {
      question: "A criança consegue modelar com massinha?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Use massinha de modelar, ensine a criança a modelar diferentes formas.",
      suggestion_com_mediacao:
        "Incentive a criança a usar a imaginação para criar diferentes objetos com a massinha.",
    },
    {
      question: "A criança consegue amarrar os sapatos?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Use cadarços grossos, ensine a criança a amarrar os sapatos passo a passo.",
      suggestion_com_mediacao:
        "Elogie a criança quando ela amarra os sapatos sozinha.",
    },
    {
      question: "A criança consegue abotoar e desabotoar botões?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Use roupas com botões grandes, ensine a criança a abotoar e desabotoar os botões passo a passo.",
      suggestion_com_mediacao:
        "Elogie a criança quando ela abotoa e desabotoa os botões sozinha.",
    },
    {
      question: "A criança consegue fechar e abrir zíperes?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Use roupas com zíperes grandes, ensine a criança a fechar e abrir os zíperes passo a passo.",
      suggestion_com_mediacao:
        "Elogie a criança quando ela fecha e abre os zíperes sozinha.",
    },
    {
      question:
        "A criança consegue identificar as horas em um relógio analógico?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Use um relógio com ponteiros grandes, ensine a criança a identificar as horas.",
      suggestion_com_mediacao:
        "Incentive a criança a usar o relógio para marcar o tempo.",
    },

    // AUTO-CUIDADOS (18 items)
    {
      question: "A criança come sozinha usando garfo e faca?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Dê talheres adequados para a idade da criança, ensine a criança a usar os talheres corretamente.",
      suggestion_com_mediacao:
        "Elogie a criança quando ela come sozinha usando garfo e faca.",
    },
    {
      question: "A criança serve-se sozinha?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Coloque os alimentos em recipientes acessíveis para a criança, ensine a criança a servir-se sozinha.",
      suggestion_com_mediacao:
        "Supervisione a criança enquanto ela se serve, para evitar que ela derrame ou pegue comida demais.",
    },
    {
      question: "A criança bebe água sozinha quando tem sede?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Deixe água acessível para a criança, ensine a criança a pedir água quando tiver sede.",
      suggestion_com_mediacao: "Incentive a criança a beber água regularmente.",
    },
    {
      question: "A criança lava as mãos sozinha com sabão?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Ensine a criança a lavar as mãos corretamente, certifique-se de que a criança tem acesso a água e sabão.",
      suggestion_com_mediacao:
        "Lembre a criança de lavar as mãos antes das refeições e depois de usar o banheiro.",
    },
    {
      question: "A criança escova os dentes sozinha com pasta?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Ensine a criança a escovar os dentes corretamente, certifique-se de que a criança tem acesso a escova e pasta de dente.",
      suggestion_com_mediacao:
        "Supervisione a escovação dos dentes da criança, para garantir que ela está escovando corretamente.",
    },
    {
      question: "A criança penteia o cabelo sozinha?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Dê um pente adequado para a idade da criança, ensine a criança a pentear o cabelo corretamente.",
      suggestion_com_mediacao:
        "Ajude a criança a desembaraçar o cabelo, se necessário.",
    },
    {
      question: "A criança se veste e se despe sozinha?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Dê roupas fáceis de vestir e despir, ensine a criança a sequência correta.",
      suggestion_com_mediacao:
        "Ajude a criança a abotoar e desabotoar botões, se necessário.",
    },
    {
      question: "A criança vai ao banheiro sozinha e se limpa?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Certifique-se de que a criança sabe como usar o banheiro corretamente, ensine a criança a se limpar corretamente.",
      suggestion_com_mediacao:
        "Supervisione a criança no banheiro, para garantir que ela está se limpando corretamente.",
    },
    {
      question: "A criança toma banho sozinha?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Certifique-se de que a criança sabe como tomar banho corretamente, deixe a criança tomar banho quando precisar.",
      suggestion_com_mediacao:
        "Supervisione a criança no banho, para garantir que ela está se lavando corretamente.",
    },
    {
      question: "A criança assoa o nariz sozinha?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Ensine a criança a assoar o nariz corretamente, certifique-se de que a criança tem acesso a lenços de papel.",
      suggestion_com_mediacao:
        "Lembre a criança de assoar o nariz regularmente.",
    },
    {
      question: "A criança cobre a boca ao tossir ou espirrar?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Ensine a criança a cobrir a boca ao tossir ou espirrar, explique a importância de evitar a propagação de germes.",
      suggestion_com_mediacao:
        "Lembre a criança de cobrir a boca ao tossir ou espirrar.",
    },
    {
      question: "A criança evita objetos perigosos?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Ensine a criança sobre os perigos de objetos afiados, quentes e tóxicos.",
      suggestion_com_mediacao:
        "Mantenha objetos perigosos fora do alcance da criança.",
    },
    {
      question: "A criança atravessa a rua com segurança?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Ensine a criança a olhar para os dois lados antes de atravessar a rua, explique a importância de atravessar na faixa de pedestres.",
      suggestion_com_mediacao: "Supervisione a criança ao atravessar a rua.",
    },
    {
      question: "A criança pede ajuda em caso de emergência?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Ensine a criança a ligar para o número de emergência, explique o que dizer em caso de emergência.",
      suggestion_com_mediacao:
        "Mantenha o número de emergência em um local visível.",
    },
    {
      question: "A criança conhece seu nome completo, endereço e telefone?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Ensine a criança seu nome completo, endereço e telefone, repita as informações regularmente.",
      suggestion_com_mediacao: "Mantenha as informações em um local visível.",
    },
    {
      question: "A criança sabe o que fazer se estiver perdida?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Ensine a criança a procurar um adulto de confiança, explique que ela não deve ir com estranhos.",
      suggestion_com_mediacao:
        "Pratique situações em que a criança está perdida.",
    },
    {
      question:
        "A criança sabe o que fazer se alguém a tocar de forma inadequada?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Ensine a criança sobre toques seguros e inseguros, explique que ela tem o direito de dizer não.",
      suggestion_com_mediacao:
        "Incentive a criança a contar para um adulto de confiança se alguém a tocar de forma inadequada.",
    },
    {
      question: "A criança sabe o que fazer se alguém tentar levá-la embora?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Ensine a criança a gritar por ajuda, explique que ela deve correr para um local seguro.",
      suggestion_com_mediacao:
        "Pratique situações em que alguém tenta levar a criança embora.",
    },

    // DESENVOLVIMENTO MOTOR (16 items)
    {
      question: "A criança corre com facilidade e sem cair?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Pratique corrida em espaços seguros, incentive a criança a correr mais rápido.",
      suggestion_com_mediacao:
        "Crie jogos de corrida para tornar a atividade mais divertida.",
    },
    {
      question: "A criança pula com os dois pés juntos?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Demonstre o pulo, incentive a criança a pular mais alto.",
      suggestion_com_mediacao:
        "Crie jogos de pular para tornar a atividade mais divertida.",
    },
    {
      question: "A criança sobe e desce escadas alternando os pés?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Supervisione a criança ao subir e descer escadas, incentive a criança a alternar os pés.",
      suggestion_com_mediacao:
        "Elogie a criança quando ela sobe e desce escadas corretamente.",
    },
    {
      question: "A criança pedala um triciclo ou bicicleta?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Dê um triciclo ou bicicleta adequada para a idade da criança, ensine a criança a pedalar.",
      suggestion_com_mediacao: "Supervisione a criança enquanto ela pedala.",
    },
    {
      question: "A criança arremessa uma bola com precisão?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Demonstre o arremesso, incentive a criança a arremessar a bola em um alvo.",
      suggestion_com_mediacao:
        "Crie jogos de arremesso para tornar a atividade mais divertida.",
    },
    {
      question: "A criança pega uma bola arremessada?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Arremesse a bola para a criança, incentive a criança a pegar a bola.",
      suggestion_com_mediacao:
        "Comece com distâncias curtas, aumente a distância gradualmente.",
    },
    {
      question: "A criança chuta uma bola com precisão?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Demonstre o chute, incentive a criança a chutar a bola em um alvo.",
      suggestion_com_mediacao:
        "Crie jogos de chute para tornar a atividade mais divertida.",
    },
    {
      question: "A criança consegue ficar em um pé só por alguns segundos?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Incentive a criança a praticar o equilíbrio, segure a mão da criança no início.",
      suggestion_com_mediacao:
        "Elogie a criança quando ela consegue ficar em um pé só.",
    },
    {
      question: "A criança consegue andar na ponta dos pés?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Demonstre a caminhada na ponta dos pés, incentive a criança a praticar.",
      suggestion_com_mediacao:
        "Crie jogos de caminhada na ponta dos pés para tornar a atividade mais divertida.",
    },
    {
      question: "A criança consegue pular corda?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Demonstre o pulo de corda, incentive a criança a praticar.",
      suggestion_com_mediacao:
        "Comece com a corda parada, aumente a velocidade gradualmente.",
    },
    {
      question: "A criança consegue dançar?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Toque música, incentive a criança a se mover livremente.",
      suggestion_com_mediacao: "Ensine alguns passos de dança simples.",
    },
    {
      question: "A criança consegue desenhar?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Dê materiais para desenho, incentive a criança a usar a imaginação.",
      suggestion_com_mediacao: "Elogie os desenhos da criança.",
    },
    {
      question: "A criança consegue pintar?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Dê materiais para pintura, incentive a criança a usar a imaginação.",
      suggestion_com_mediacao: "Elogie as pinturas da criança.",
    },
    {
      question: "A criança consegue modelar com massinha?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Dê massinha de modelar, incentive a criança a usar a imaginação.",
      suggestion_com_mediacao: "Elogie as criações da criança com massinha.",
    },
    {
      question: "A criança consegue recortar com tesoura?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Dê tesoura sem ponta, ensine a criança a recortar corretamente.",
      suggestion_com_mediacao: "Supervisione a criança enquanto ela recorta.",
    },
    {
      question: "A criança consegue colar?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Dê cola bastão, ensine a criança a colar corretamente.",
      suggestion_com_mediacao: "Supervisione a criança enquanto ela cola.",
    },
  ],

  "5-6": [
    {
      question: "Manifesta seus sentimentos?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Nomear emoções em diferentes situações, usar livros e histórias para ilustrar.",
      suggestion_com_mediacao:
        "Sugerir palavras para expressar, elogiar quando tentar.",
    },
    {
      question:
        "Brinca com 4 a 5 crianças em atividade de cooperação por 20 min, sem supervisão?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Facilitar encontros em pequenos grupos, modelar regras de cooperação.",
      suggestion_com_mediacao:
        "Acompanhar inicialmente, reforçar turnos e divisão de tarefas.",
    },
    {
      question: "Explica aos outros as regras do jogo ou atividade?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Jogar junto, incentivar a criança a dizer o que lembra das regras.",
      suggestion_com_mediacao:
        "Sugerir frases curtas, ajudar a recordar durante o jogo.",
    },
    {
      question: "Imita papéis de adulto?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Propor brincadeiras de faz-de-conta com fantasias, bonecos ou objetos do cotidiano.",
      suggestion_com_mediacao:
        "Participar inicialmente, modelar falas e atitudes.",
    },
    {
      question: "Colabora para a conversa durante as refeições?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Fazer perguntas simples durante as refeições, valorizar cada contribuição.",
      suggestion_com_mediacao: "Ajudar a iniciar fala, elogiar participação.",
    },
    {
      question: "Segue regras de jogo que envolva raciocínio verbal?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Jogar juntos jogos de tabuleiro simples, explicar as regras de forma clara.",
      suggestion_com_mediacao:
        "Reforçar regras verbalmente durante o jogo, ajudar na vez da criança.",
    },
    {
      question: "Conforta colegas tristes?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Falar sobre empatia em histórias ou rodas de conversa.",
      suggestion_com_mediacao:
        "Sugerir frases para confortar, elogiar quando demonstrar cuidado.",
    },
    {
      question: "Escolhe seus próprios amigos?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Permitir brincar com pares que escolher, supervisionar para mediar conflitos.",
      suggestion_com_mediacao:
        "Incentivar iniciativa de aproximação, reforçar amizade saudável.",
    },
    {
      question: "Planeja e constrói usando ferramentas simples?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Oferecer materiais seguros (papel, fita, tesoura sem ponta), modelar uso.",
      suggestion_com_mediacao:
        "Ajudar a pensar etapas do projeto, reforçar cada conquista.",
    },
    {
      question: "Dramatiza histórias usando fantoches ou encenando papéis?",
      category: "Socialização",
      suggestion_ainda_nao:
        "Ler histórias e sugerir dramatizações, disponibilizar fantoches.",
      suggestion_com_mediacao:
        "Auxiliar no começo da encenação, reforçar positivamente.",
    },
    {
      question: "Indica alguns, muitos, vários elementos?",
      category: "Linguagem",
      suggestion_ainda_nao: "Contar objetos em sala, perguntar “quantos tem?”.",
      suggestion_com_mediacao:
        "Repetir junto, reforçar verbalmente a quantidade.",
    },
    {
      question: "Diz seu endereço?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Repetir diariamente, criar música ou rima com endereço.",
      suggestion_com_mediacao: "Ajudar a lembrar, reforçar cada tentativa.",
    },
    {
      question: "Diz número de telefone?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Brincar de “telefone de mentirinha”, repetir número com ritmo.",
      suggestion_com_mediacao: "Guiar a fala, elogiar ao acertar.",
    },
    {
      question: "Aponta conjunto com mais, menos ou poucos elementos?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Usar blocos coloridos, perguntar “qual tem mais?”.",
      suggestion_com_mediacao: "Reforçar resposta correta, ajudar a contar.",
    },
    {
      question: "Conta piadas simples?",
      category: "Linguagem",
      suggestion_ainda_nao: "Contar piadas curtas, incentivar a repetir.",
      suggestion_com_mediacao:
        "Ajudar a lembrar piada, reforçar cada tentativa.",
    },
    {
      question: "Relata experiências diárias?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Perguntar “o que fez hoje?”, incentivar a falar em sequência.",
      suggestion_com_mediacao: "Ajudar a lembrar etapas, reforçar verbalmente.",
    },
    {
      question: "Descreve local ou movimento: através, longe, por cima?",
      category: "Linguagem",
      suggestion_ainda_nao: "Brincar de percorrer caminhos, nomear direções.",
      suggestion_com_mediacao: "Reforçar cada expressão, repetir junto.",
    },
    {
      question: "Responde “por quê” com explicação?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Fazer perguntas “por quê?” em situações do cotidiano.",
      suggestion_com_mediacao: "Sugerir resposta, reforçar verbalmente.",
    },
    {
      question: "Ordena e conta história em sequência?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Usar figuras de histórias simples, pedir para ordenar.",
      suggestion_com_mediacao: "Ajudar na sequência, elogiar progresso.",
    },
    {
      question: "Define palavras?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Perguntar “o que é...?”, ajudar a criar definições curtas.",
      suggestion_com_mediacao: "Modelar definição, reforçar cada tentativa.",
    },
    {
      question: "Responde “qual o contrário de...?”?",
      category: "Linguagem",
      suggestion_ainda_nao: "Brincar de opostos, perguntar frequentemente.",
      suggestion_com_mediacao: "Sugerir resposta, elogiar cada acerto.",
    },
    {
      question: "Responde “o que acontece se...?”?",
      category: "Linguagem",
      suggestion_ainda_nao: "Contar histórias com hipóteses.",
      suggestion_com_mediacao: "Ajudar a imaginar, reforçar cada resposta.",
    },
    {
      question: "Usa “ontem” e “amanhã” corretamente?",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Falar de planos e eventos passados, reforçar palavras.",
      suggestion_com_mediacao: "Corrigir suavemente, elogiar cada uso.",
    },
    {
      question: "Pergunta significado de palavras?",
      category: "Linguagem",
      suggestion_ainda_nao: "Explicar pacientemente, usar exemplos.",
      suggestion_com_mediacao: "Reforçar curiosidade, elogiar pergunta.",
    },
    {
      question: "Conta até 20 objetos e responde “quantos?”?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Contar brinquedos juntos, perguntar número ao final.",
      suggestion_com_mediacao:
        "Ajudar a apontar cada objeto, reforçar resposta.",
    },
    {
      question: "Nomeia 10 numerais?",
      category: "Cognição",
      suggestion_ainda_nao: "Mostrar cartões com números, nomear junto.",
      suggestion_com_mediacao: "Repetir nomes, elogiar cada acerto.",
    },
    {
      question: "Identifica esquerda e direita?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Brincar de levantar mão esquerda/direita, usar pulseira colorida para marcar.",
      suggestion_com_mediacao: "Ajudar a nomear, reforçar durante o dia.",
    },
    {
      question: "Diz vogais em ordem?",
      category: "Cognição",
      suggestion_ainda_nao: "Cantar música do alfabeto, mostrar fichas.",
      suggestion_com_mediacao: "Repetir junto, elogiar cada avanço.",
    },
    {
      question: "Escreve nome com letras de forma?",
      category: "Cognição",
      suggestion_ainda_nao: "Mostrar modelo do nome, guiar mão na escrita.",
      suggestion_com_mediacao: "Ajudar na coordenação, reforçar cada letra.",
    },
    {
      question: "Nomeia 5 letras do alfabeto?",
      category: "Cognição",
      suggestion_ainda_nao: "Apresentar fichas, perguntar nomes.",
      suggestion_com_mediacao: "Sugerir resposta, repetir junto.",
    },
    {
      question: "Ordena objetos por comprimento/largura?",
      category: "Cognição",
      suggestion_ainda_nao: "Oferecer palitos ou fitas de tamanhos diferentes.",
      suggestion_com_mediacao: "Guiar ordenação, reforçar verbalmente.",
    },
    {
      question: "Nomeia letras maiúsculas?",
      category: "Cognição",
      suggestion_ainda_nao: "Mostrar letras, perguntar nomes.",
      suggestion_com_mediacao: "Ajudar a lembrar, repetir junto.",
    },
    {
      question: "Coloca numerais de 1 a 10 na ordem?",
      category: "Cognição",
      suggestion_ainda_nao: "Dar cartões embaralhados, pedir para arrumar.",
      suggestion_com_mediacao: "Guiar sequência, elogiar cada passo.",
    },
    {
      question: "Identifica posição em 1º, 2º e 3º lugar?",
      category: "Cognição",
      suggestion_ainda_nao:
        "Brincar de corrida de brinquedos, perguntar colocação.",
      suggestion_com_mediacao: "Apontar lugar, reforçar nome.",
    },
    {
      question: "Nomeia letras maiúsculas/minúsculas?",
      category: "Cognição",
      suggestion_ainda_nao: "Mostrar fichas, perguntar nome.",
      suggestion_com_mediacao: "Ajudar lembrar, reforçar acerto.",
    },
    {
      question: "Emparelha letras maiúsculas/minúsculas?",
      category: "Cognição",
      suggestion_ainda_nao: "Mostrar pares, perguntar “qual combina?”.",
      suggestion_com_mediacao: "Guiar mão, reforçar cada par.",
    },
    {
      question: "Aponta numerais de 1 a 25?",
      category: "Cognição",
      suggestion_ainda_nao: "Mostrar números, perguntar “onde está?”.",
      suggestion_com_mediacao: "Ajudar apontar, reforçar cada número.",
    },
    {
      question: "Copia losango?",
      category: "Cognição",
      suggestion_ainda_nao: "Mostrar forma devagar, traçar junto.",
      suggestion_com_mediacao: "Guiar mão, reforçar cada traço.",
    },
    {
      question: "Completa labirinto simples?",
      category: "Cognição",
      suggestion_ainda_nao: "Traçar caminho devagar, elogiar progresso.",
      suggestion_com_mediacao: "Guiar mão, reforçar cada curva.",
    },
    {
      question: "Diz dias da semana na ordem?",
      category: "Cognição",
      suggestion_ainda_nao: "Cantar dias, repetir diariamente.",
      suggestion_com_mediacao: "Ajudar lembrar, reforçar cada dia.",
    },
    {
      question: "Soma/subtrai combinações de até 3 elementos?",
      category: "Cognição",
      suggestion_ainda_nao: "Contar objetos, perguntar resultado.",
      suggestion_com_mediacao: "Guiar contagem, reforçar operação.",
    },
    {
      question: "Diz mês/dia de aniversário?",
      category: "Cognição",
      suggestion_ainda_nao: "Repetir sempre, cantar parabéns.",
      suggestion_com_mediacao: "Ajudar lembrar, reforçar cada resposta.",
    },
    {
      question: "Lê 10 palavras impressas?",
      category: "Cognição",
      suggestion_ainda_nao: "Mostrar fichas, perguntar palavra.",
      suggestion_com_mediacao: "Repetir junto, reforçar leitura.",
    },
    {
      question: "Prediz o que vai acontecer?",
      category: "Cognição",
      suggestion_ainda_nao: "Contar história curta, perguntar final.",
      suggestion_com_mediacao: "Sugerir resposta, reforçar previsão.",
    },
    {
      question: "Aponta objetos inteiros/partidos?",
      category: "Cognição",
      suggestion_ainda_nao: "Mostrar figuras, perguntar “inteiro ou partido?”.",
      suggestion_com_mediacao: "Guiar resposta, elogiar.",
    },
    {
      question: "Conta de memória até 100?",
      category: "Cognição",
      suggestion_ainda_nao: "Contar em etapas, reforçar cada dezena.",
      suggestion_com_mediacao: "Ajudar lembrar, elogiar cada progresso.",
    },
    {
      question:
        "É responsável por uma tarefa semanal e a executa ao ser lembrado?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Criar quadro de tarefas visível, lembrar de forma positiva.",
      suggestion_com_mediacao:
        "Acompanhar no início, reforçando o valor de ajudar.",
    },
    {
      question: "Seleciona roupas apropriadas ao clima e ocasião?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Nomear as diferenças de roupas e clima, mostrar exemplos.",
      suggestion_com_mediacao:
        "Sugerir combinações e orientar a escolha com elogios.",
    },
    {
      question:
        "Pára no passeio, olha para os dois lados, atravessa a rua sem ser lembrado?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Ensinar regras de segurança em simulações, reforçar sempre que sair.",
      suggestion_com_mediacao:
        "Acompanhar de perto nas primeiras vezes, elogiando o comportamento seguro.",
    },
    {
      question: "Serve-se à mesa e passa aos demais a panela de comida?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Ensinar como segurar e passar com cuidado, praticar em momentos de brincadeira.",
      suggestion_com_mediacao:
        "Ajudar segurando junto, orientar com paciência.",
    },
    {
      question: "Prepara sua própria caneca de café com leite?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Mostrar cada passo de forma simples, usar recipientes leves.",
      suggestion_com_mediacao:
        "Supervisionar de perto, reforçar cada conquista.",
    },
    {
      question: "É responsável por uma tarefa diária em casa?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Fazer combinados claros e elogiar cada tarefa concluída.",
      suggestion_com_mediacao:
        "Ajudar a lembrar, supervisionar até virar rotina.",
    },
    {
      question: "Ajusta a temperatura da água para o banho?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Mostrar como virar a torneira, explicar sobre risco de queimaduras.",
      suggestion_com_mediacao:
        "Acompanhar as primeiras vezes, corrigir se necessário.",
    },
    {
      question: "Prepara seu próprio lanche?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Oferecer alimentos de fácil manuseio, mostrar como montar.",
      suggestion_com_mediacao:
        "Ajudar nos primeiros passos, reforçando a autonomia.",
    },
    {
      question: "Anda sozinho até 2 quadras de casa?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Ensinar o caminho, reforçar cuidados com trânsito e estranhos.",
      suggestion_com_mediacao:
        "Acompanhar inicialmente, reforçando combinações de segurança.",
    },
    {
      question: "Corta alimentos tenros com faca?",
      category: "Auto-cuidados",
      suggestion_ainda_nao:
        "Usar faca infantil sem ponta, mostrar como segurar.",
      suggestion_com_mediacao:
        "Guiar a mão da criança, reforçando cada progresso.",
    },
    {
      question: "É responsável por tarefa semanal (lembrado)?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Criar quadro de tarefas, elogiar cada vez.",
      suggestion_com_mediacao: "Ajudar lembrar, reforçar responsabilidade.",
    },
    {
      question: "Seleciona roupa adequada para clima?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Explicar clima, mostrar exemplos.",
      suggestion_com_mediacao: "Sugerir escolha, elogiar decisão.",
    },
    {
      question: "Pára na calçada e olha para atravessar?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Ensinar regras de trânsito, praticar juntos.",
      suggestion_com_mediacao: "Acompanhar, reforçar cada ação segura.",
    },
    {
      question: "Serve-se à mesa, passa panela aos outros?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Mostrar como segurar, supervisionar.",
      suggestion_com_mediacao: "Guiar mãos, elogiar cuidado.",
    },
    {
      question: "Prepara própria caneca de café/leite?",
      category: "Auto-cuidados",
      suggestion_ainda_nao: "Ensinar passo a passo, supervisionar.",
      suggestion_com_mediacao: "Ajudar primeiras vezes, reforçar autonomia.",
    },
    {
      question: "Escreve letras de forma maiúsculas isoladas?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Mostrar traçado devagar, usar modelo visual.",
      suggestion_com_mediacao: "Guiar mão na escrita, reforçar cada letra.",
    },
    {
      question: "Anda sobre tábua para trás/frente/lados?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Brincar de equilibrar, segurar mãos no início.",
      suggestion_com_mediacao: "Soltar devagar, elogiar equilíbrio.",
    },
    {
      question: "Caminha saltitando?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao:
        "Mostrar salto alternando pés, cantar música curta.",
      suggestion_com_mediacao: "Segurar mão, reforçar ritmo.",
    },
    {
      question: "Balança iniciando movimento?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Ensinar impulsionar pernas, empurrar devagar.",
      suggestion_com_mediacao: "Segurar costas, reforçar coordenação.",
    },
    {
      question: "Toca cada dedo com polegar?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Mostrar devagar, cantar “um, dois, três...”.",
      suggestion_com_mediacao: "Guiar dedos, elogiar coordenação.",
    },
    {
      question: "Copia letras maiúsculas?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Desenhar modelo grande, repetir junto.",
      suggestion_com_mediacao: "Guiar mão, reforçar traçado.",
    },
    {
      question: "Sobe escada de 3 m?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Segurar cintura, mostrar apoio nos degraus.",
      suggestion_com_mediacao: "Soltar devagar, elogiar coragem.",
    },
    {
      question: "Bate em prego com martelo?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Mostrar como segurar martelo, usar prego grande.",
      suggestion_com_mediacao: "Guiar mão, reforçar força.",
    },
    {
      question: "Rebate bola andando?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Mostrar como bater bola, andar devagar.",
      suggestion_com_mediacao: "Guiar movimento, reforçar controle.",
    },
    {
      question: "Colore dentro da margem 95% das vezes?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Mostrar linha do desenho, usar lápis grosso.",
      suggestion_com_mediacao: "Ajudar a segurar, elogiar cada cor.",
    },
    {
      question: "Desenha quadrado?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Traçar modelo, ajudar mãos.",
      suggestion_com_mediacao: "Guiar traço, reforçar forma.",
    },
    {
      question: "Copia triângulo?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Mostrar modelo, praticar junto.",
      suggestion_com_mediacao: "Guiar mão, elogiar progresso.",
    },
    {
      question: "Fica em um pé 8 seg?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Brincar de estátua, reforçar equilíbrio.",
      suggestion_com_mediacao: "Soltar devagar, reforçar cada segundo.",
    },
    {
      question: "Anda sobre viga mantendo equilíbrio?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Mostrar como olhar à frente, segurar mãos.",
      suggestion_com_mediacao: "Soltar aos poucos, reforçar cada passo.",
    },
    {
      question: "Pula corda sem ajuda?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Mostrar movimento, praticar devagar.",
      suggestion_com_mediacao: "Segurar corda juntos, reforçar salto.",
    },
    {
      question: "Faz sequência de saltos alternados?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Brincar de “pular como sapo”, supervisionar.",
      suggestion_com_mediacao: "Segurar leve, reforçar ritmo.",
    },
    {
      question: "Pedala bicicleta com rodinhas 5 m?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Mostrar como pedalar, segurar costas.",
      suggestion_com_mediacao: "Guiar pés, reforçar coordenação.",
    },
    {
      question: "Prende botões pequenos sozinho?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Mostrar movimento, praticar em brinquedos.",
      suggestion_com_mediacao: "Guiar dedos, elogiar cada botão.",
    },
    {
      question: "Corta ao longo de linha curva?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Traçar linha, usar tesoura infantil.",
      suggestion_com_mediacao: "Guiar mão, reforçar cada corte.",
    },
    {
      question: "Escreve nome com letras grandes?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Mostrar modelo, praticar devagar.",
      suggestion_com_mediacao: "Guiar mão, reforçar cada letra.",
    },
    {
      question: "Dobra papel em duas partes iguais?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Mostrar movimento, supervisionar.",
      suggestion_com_mediacao: "Guiar mãos, elogiar cada dobra.",
    },
    {
      question: "Desenha figura humana com detalhes?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Apontar partes, incentivar traço.",
      suggestion_com_mediacao: "Ajudar lembrar partes, reforçar desenho.",
    },
    {
      question: "Rebate bola com bastão?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Mostrar movimento, segurar bastão juntos.",
      suggestion_com_mediacao: "Guiar braço, reforçar cada rebatida.",
    },
    {
      question: "Chuta bola em movimento?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Rolar bola devagar, incentivar chute.",
      suggestion_com_mediacao: "Guiar perna, elogiar cada acerto.",
    },
    {
      question: "Coloca fecho de roupa sozinho?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Mostrar movimento devagar, praticar.",
      suggestion_com_mediacao: "Guiar mão, reforçar paciência.",
    },
    {
      question: "Salta sobre corda baixa?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Colocar corda no chão, mostrar salto.",
      suggestion_com_mediacao: "Segurar mãos, reforçar cada pulo.",
    },
    {
      question: "Pedala bicicleta sem rodinhas?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Ensinar equilíbrio, supervisionar.",
      suggestion_com_mediacao: "Ajudar segurar guidão, reforçar progresso.",
    },
    {
      question: "Copia losango?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Traçar modelo, mostrar devagar.",
      suggestion_com_mediacao: "Guiar mão, reforçar cada traço.",
    },
    {
      question: "Junta peças pequenas em brinquedo de montar?",
      category: "Desenvolvimento Motor",
      suggestion_ainda_nao: "Mostrar encaixe, usar peças grandes no início.",
      suggestion_com_mediacao: "Guiar mão, reforçar cada encaixe.",
    },
  ],

  "7-mais": [
    {
      question:
        "Resolve atividades que exijam habilidades de percepção analítica, identificação e discriminação visual.",
      category: "Percepção",
      suggestion_ainda_nao:
        "Utilizar jogos com figuras e quebra-cabeças simples. Estimular discriminação visual com cartões e imagens variadas.",
      suggestion_com_mediacao:
        "Aumentar a complexidade gradualmente, reforçando com pistas visuais e verbalizações.",
    },
    {
      question:
        "Resolve atividades que exijam habilidades percepção analítica identificação e discriminação auditiva.",
      category: "Percepção",
      suggestion_ainda_nao:
        "Fazer jogos de sons com objetos, gravar e reproduzir sons do cotidiano para identificação.",
      suggestion_com_mediacao:
        "Repetir instruções com clareza e reforço sonoro. Associar som à imagem.",
    },
    {
      question:
        "Consegue fazer atividades que exijam percepção cinestésica (percepção dos movimentos corporais ou das sensações corporais).",
      category: "Percepção",
      suggestion_ainda_nao:
        "Propor brincadeiras de movimento (ex: mímica, yoga infantil). Estimular percepção do corpo no espaço.",
      suggestion_com_mediacao:
        "Orientar verbalmente os movimentos. Dar feedbacks imediatos sobre postura e deslocamento.",
    },
    {
      question:
        "Consegue fazer atividades que exijam percepção espacial e temporal.",
      category: "Percepção",
      suggestion_ainda_nao:
        "Usar jogos de montar com sequência e direção. Atividades com rotina diária organizada visualmente.",
      suggestion_com_mediacao:
        "Auxiliar com pistas visuais e verbais. Fazer perguntas sobre o antes e depois.",
    },
    {
      question: "Consegue fazer atividades que exijam percepção tátil.",
      category: "Percepção",
      suggestion_ainda_nao:
        "Estimular atividades com diferentes texturas, pesos, temperaturas (ex: caixas sensoriais).",
      suggestion_com_mediacao:
        "Fazer a mediação verbal das sensações. Pedir para relatar como se sente com determinado estímulo.",
    },
    {
      question:
        "Demonstra habilidade de seleção e manutenção de foco em atividades que exijam atenção concentrada e alternada.",
      category: "Atenção",
      suggestion_ainda_nao:
        "Usar jogos curtos com tempo determinado e reforço positivo imediato. Eliminar estímulos excessivos.",
      suggestion_com_mediacao:
        "Diminuir tempo da atividade e dividir em etapas curtas. Dar reforço verbal a cada foco mantido.",
    },
    {
      question: "Demonstra concentração nas atividades.",
      category: "Atenção",
      suggestion_ainda_nao:
        "Iniciar com atividades lúdicas de 3-5 minutos. Estimular com materiais concretos e visuais.",
      suggestion_com_mediacao:
        "Reforçar verbalmente o esforço de concentração. Dar intervalos controlados entre tarefas.",
    },
    {
      question: "Demonstra compreensão de ordens.",
      category: "Atenção",
      suggestion_ainda_nao:
        "Utilizar comandos simples, uma ordem por vez. Representar com gestos e imagens.",
      suggestion_com_mediacao:
        "Dar apoio verbal ou físico leve. Repetir e reforçar cada etapa concluída.",
    },
    {
      question: "Demonstra interesse por histórias contadas ou lidas.",
      category: "Atenção",
      suggestion_ainda_nao:
        "Contar histórias com imagens, usar fantoches. Repetir personagens com frequência.",
      suggestion_com_mediacao:
        "Reforçar com perguntas simples (quem é esse?) e oferecer escolhas.",
    },
    {
      question: "Demonstra memória auditiva e verbal.",
      category: "Memória",
      suggestion_ainda_nao:
        "Utilizar jogos de repetição com palavras e números (ex: jogo da memória). Iniciar com 2 ou 3 estímulos.",
      suggestion_com_mediacao:
        "Repetir estímulos verbalmente. Reforçar uso de pistas visuais e auditivas.",
    },
    {
      question: "Demonstra memória visual.",
      category: "Memória",
      suggestion_ainda_nao:
        "Usar jogos de memória visual com cartas, figuras e objetos. Começar com poucos elementos.",
      suggestion_com_mediacao:
        "Dar pistas visuais e verbais. Permitir mais tempo para observação antes de esconder objetos.",
    },
    {
      question: "Demonstra memória de fatos cotidianos.",
      category: "Memória",
      suggestion_ainda_nao:
        "Estimular evocação de fatos do cotidiano com imagens e conversas. Criar diário com colagens.",
      suggestion_com_mediacao:
        "Oferecer pistas de contexto (tempo, lugar). Estimular reconto com apoio visual.",
    },
    {
      question: "Demonstra memória de sequência temporal.",
      category: "Memória",
      suggestion_ainda_nao:
        "Utilizar histórias curtas com imagens embaralhadas. Trabalhar rotinas em sequência.",
      suggestion_com_mediacao:
        "Ajudar com perguntas do tipo o que aconteceu depois?. Reforçar uso de marcadores temporais.",
    },
    {
      question:
        "Demonstra habilidade de compreensão da língua portuguesa oral.",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Dar instruções com poucas palavras. Reforçar com gestos e imagens.",
      suggestion_com_mediacao:
        "Repetir instruções devagar. Confirmar compreensão com perguntas simples.",
    },
    {
      question: "Demonstra habilidade de expressão da língua portuguesa oral.",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Estimular fala com jogos de perguntas/respostas. Usar histórias e reconto com apoio visual.",
      suggestion_com_mediacao:
        "Completar frases, incentivar a continuidade da fala. Reforçar verbalmente cada tentativa.",
    },
    {
      question:
        "Demonstra habilidade de compreensão da língua portuguesa escrita.",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Utilizar textos curtos com apoio de imagens. Trabalhar vocabulário antes da leitura.",
      suggestion_com_mediacao:
        "Ler em voz alta com o aluno. Parar a leitura para reforçar significados.",
    },
    {
      question:
        "Demonstra habilidade de expressão da língua portuguesa escrita.",
      category: "Linguagem",
      suggestion_ainda_nao:
        "Trabalhar escrita de palavras-chave. Usar desenhos como ponto de partida para produção de frases.",
      suggestion_com_mediacao:
        "Oferecer modelos de frases. Corrigir com reforço positivo e sugestão de melhoria.",
    },
    {
      question:
        "Demonstra compreensão nas atividades que envolvam relações de igualdade e diferença.",
      category: "Raciocínio Lógico",
      suggestion_ainda_nao:
        "Usar jogos de classificação com objetos concretos. Trabalhar com pares e diferenças visuais.",
      suggestion_com_mediacao:
        "Apoiar com pistas verbais e demonstrações. Reforçar cada acerto com feedback positivo.",
    },
    {
      question: "Manifesta reação de reconhecimento de absurdos.",
      category: "Raciocínio Lógico",
      suggestion_ainda_nao:
        "Apresentar situações absurdas em histórias e imagens. Estimular o questionamento.",
      suggestion_com_mediacao:
        "Fazer perguntas direcionadas sobre o que está errado. Dar pistas sobre inconsistências.",
    },
    {
      question: "Demonstra habilidade para fazer conclusões lógicas.",
      category: "Raciocínio Lógico",
      suggestion_ainda_nao:
        "Usar situações problema simples do cotidiano. Trabalhar causa e consequência com exemplos concretos.",
      suggestion_com_mediacao:
        "Guiar o raciocínio com perguntas sequenciais. Oferecer alternativas para escolha.",
    },
    {
      question: "Compreende ordens ou enunciados lidos pelo professor.",
      category: "Raciocínio Lógico",
      suggestion_ainda_nao:
        "Simplificar comandos e usar apoio visual. Repetir instruções de forma clara e pausada.",
      suggestion_com_mediacao:
        "Verificar compreensão a cada etapa. Reformular instruções quando necessário.",
    },
    {
      question:
        "Resolve problemas do cotidiano ou situações-problema propostas pelo professor.",
      category: "Raciocínio Lógico",
      suggestion_ainda_nao:
        "Apresentar problemas simples com materiais concretos. Usar situações familiares ao aluno.",
      suggestion_com_mediacao:
        "Dividir o problema em etapas menores. Oferecer pistas e orientações durante o processo.",
    },
    {
      question:
        "Discute problemas e fatos ocorridos na atualidade (do mundo que o cerca).",
      category: "Raciocínio Lógico",
      suggestion_ainda_nao:
        "Usar notícias simples e adequadas à idade. Relacionar com experiências pessoais do aluno.",
      suggestion_com_mediacao:
        "Fazer perguntas direcionadas sobre o tema. Oferecer diferentes pontos de vista.",
    },
    {
      question: "Compreende relação de causalidade.",
      category: "Raciocínio Lógico",
      suggestion_ainda_nao:
        "Trabalhar com sequências de causa e efeito usando imagens. Usar exemplos do dia a dia.",
      suggestion_com_mediacao:
        "Explicar as relações verbalmente. Usar conectivos como 'porque', 'então', 'por isso'.",
    },
    {
      question:
        "Organiza sequência lógica conforme critério dado pelo professor.",
      category: "Raciocínio Lógico",
      suggestion_ainda_nao:
        "Usar cartões com sequências temporais simples. Começar com 3 elementos apenas.",
      suggestion_com_mediacao:
        "Dar pistas sobre a ordem correta. Explicar o critério de organização.",
    },
    {
      question:
        "Demonstra habilidade de antecipar, planejar, controlar impulsos, inibir respostas inadequadas, flexibilizar pensamentos e ações para apresentar soluções estratégicas (funções executivas).",
      category: "Raciocínio Lógico",
      suggestion_ainda_nao:
        "Usar jogos que exijam planejamento simples. Trabalhar com rotinas estruturadas.",
      suggestion_com_mediacao:
        "Verbalizar estratégias antes da ação. Dar tempo para reflexão antes das respostas.",
    },
    {
      question:
        "Diferencia letras do alfabeto dos numerais e outros sinais gráficos.",
      category: "Leitura e Escrita",
      suggestion_ainda_nao:
        "Usar jogos de classificação com letras, números e símbolos. Trabalhar com cores diferentes.",
      suggestion_com_mediacao:
        "Apontar diferenças específicas. Usar pistas visuais para destacar características.",
    },
    {
      question:
        "Nomeia/identifica letras do alfabeto e os diferentes tipos de letras.",
      category: "Leitura e Escrita",
      suggestion_ainda_nao:
        "Usar alfabeto móvel e jogos de identificação. Trabalhar uma letra por vez.",
      suggestion_com_mediacao:
        "Dar pistas sonoras e visuais. Associar letra ao som e a palavras conhecidas.",
    },
    {
      question:
        "Demonstra correta orientação espacial na leitura e na escrita.",
      category: "Leitura e Escrita",
      suggestion_ainda_nao:
        "Usar setas e marcadores visuais. Treinar direção da escrita com atividades motoras.",
      suggestion_com_mediacao:
        "Guiar fisicamente a direção. Usar pistas verbais constantes sobre direção.",
    },
    {
      question: "Reconhece e compõe seu próprio nome.",
      category: "Leitura e Escrita",
      suggestion_ainda_nao:
        "Trabalhar com crachá e letras móveis do nome. Usar espelho e identificação pessoal.",
      suggestion_com_mediacao:
        "Completar o nome com letras faltantes. Dar pistas sobre a sequência correta.",
    },
    {
      question: "Estabelece relação entre palavra e figuras correspondentes.",
      category: "Leitura e Escrita",
      suggestion_ainda_nao:
        "Usar jogos de associação palavra-imagem. Começar com palavras simples e familiares.",
      suggestion_com_mediacao:
        "Ler a palavra em voz alta. Dar pistas sobre o significado da palavra.",
    },
    {
      question: "Mantém permanência de hipótese na leitura e escrita.",
      category: "Leitura e Escrita",
      suggestion_ainda_nao:
        "Estimular a leitura de palavras conhecidas em diferentes contextos. Usar textos repetitivos.",
      suggestion_com_mediacao:
        "Reforçar hipóteses corretas. Questionar gentilmente hipóteses inadequadas.",
    },
    {
      question:
        "Demonstra fluência na leitura de palavras com sílabas simples e complexas.",
      category: "Leitura e Escrita",
      suggestion_ainda_nao:
        "Praticar leitura de sílabas isoladas antes de palavras. Usar palavras com padrões silábicos regulares.",
      suggestion_com_mediacao:
        "Ler junto com o aluno. Dar tempo extra para decodificação.",
    },
    {
      question:
        "Faz leitura de textos memorizados (refrão de música conhecida).",
      category: "Leitura e Escrita",
      suggestion_ainda_nao:
        "Usar músicas e parlendas conhecidas. Acompanhar com o dedo durante a leitura.",
      suggestion_com_mediacao:
        "Cantar junto e depois ler. Apontar palavras durante a leitura.",
    },
    {
      question: "Lê com compreensão, ritmo, entonação e fluência.",
      category: "Leitura e Escrita",
      suggestion_ainda_nao:
        "Usar textos curtos e adequados ao nível. Trabalhar expressividade com modelagem.",
      suggestion_com_mediacao:
        "Ler como modelo primeiro. Dar feedback sobre ritmo e entonação.",
    },
    {
      question:
        "Identifica o assunto em um texto com apoio de elementos textuais, mesmo sem saber ler convencionalmente.",
      category: "Leitura e Escrita",
      suggestion_ainda_nao:
        "Usar textos com muitas imagens. Explorar título, ilustrações e elementos gráficos.",
      suggestion_com_mediacao:
        "Fazer perguntas sobre as imagens. Relacionar elementos visuais com possível conteúdo.",
    },
    {
      question:
        "Escreve espontaneamente palavras e frases, utilizando corretamente a folha com pauta simples.",
      category: "Leitura e Escrita",
      suggestion_ainda_nao:
        "Usar folhas com pautas destacadas. Treinar coordenação motora com exercícios preparatórios.",
      suggestion_com_mediacao:
        "Guiar a mão inicialmente. Dar feedback sobre posicionamento na pauta.",
    },
    {
      question:
        "Interpreta e reconta oralmente uma história lida pelo aplicador.",
      category: "Leitura e Escrita",
      suggestion_ainda_nao:
        "Usar histórias curtas com sequência clara. Fazer perguntas durante a leitura.",
      suggestion_com_mediacao:
        "Oferecer pistas sobre elementos da história. Usar imagens como apoio para reconto.",
    },
    {
      question: "Faz o reconto escrito de uma narrativa lida pelo aplicador.",
      category: "Leitura e Escrita",
      suggestion_ainda_nao:
        "Começar com frases simples sobre a história. Usar desenhos como ponto de partida.",
      suggestion_com_mediacao:
        "Oferecer início de frases para completar. Aceitar diferentes formas de registro.",
    },
    {
      question:
        "Tem noção de conservação e reversibilidade em diferentes situações.",
      category: "Pensamento Operatório",
      suggestion_ainda_nao:
        "Usar materiais concretos para demonstrar transformações. Trabalhar com líquidos, massinha, objetos.",
      suggestion_com_mediacao:
        "Verbalizar as transformações. Fazer perguntas sobre o que mudou e o que permaneceu igual.",
    },
    {
      question: "Tem noção de conservação de número.",
      category: "Pensamento Operatório",
      suggestion_ainda_nao:
        "Usar objetos para contar e recontar. Trabalhar correspondência um a um.",
      suggestion_com_mediacao:
        "Contar junto com o aluno. Mostrar que a quantidade não muda com a disposição.",
    },
    {
      question: "Tem noção de conservação de líquido.",
      category: "Pensamento Operatório",
      suggestion_ainda_nao:
        "Usar recipientes transparentes de diferentes formas. Fazer experimentos com água colorida.",
      suggestion_com_mediacao:
        "Questionar sobre a quantidade antes e depois. Demonstrar voltando ao recipiente original.",
    },
    {
      question: "Tem noção de conservação de quantidade da matéria.",
      category: "Pensamento Operatório",
      suggestion_ainda_nao:
        "Usar massinha ou argila para modelar diferentes formas. Pesar antes e depois.",
      suggestion_com_mediacao:
        "Enfatizar que nada foi tirado ou acrescentado. Mostrar a reversibilidade da transformação.",
    },
    {
      question:
        "Tem noção de conservação de comprimento alterando percurso ou forma.",
      category: "Pensamento Operatório",
      suggestion_ainda_nao:
        "Usar cordas ou fitas para fazer diferentes formas. Medir com régua.",
      suggestion_com_mediacao:
        "Mostrar que o comprimento total não muda. Usar medição como comprovação.",
    },
    {
      question: "Tem noção de conservação de peso.",
      category: "Pensamento Operatório",
      suggestion_ainda_nao:
        "Usar balança para pesar objetos em diferentes formas. Trabalhar com massinha.",
      suggestion_com_mediacao:
        "Pesar antes e depois da transformação. Explicar que o peso não muda.",
    },
    {
      question: "Tem noção de conservação de massa.",
      category: "Pensamento Operatório",
      suggestion_ainda_nao:
        "Trabalhar com diferentes materiais (areia, água, massinha). Usar recipientes variados.",
      suggestion_com_mediacao:
        "Demonstrar com medidas. Explicar a diferença entre aparência e quantidade real.",
    },
    {
      question: "Tem noção de conservação de volume.",
      category: "Pensamento Operatório",
      suggestion_ainda_nao:
        "Usar objetos que ocupam espaço em recipientes. Trabalhar com deslocamento de água.",
      suggestion_com_mediacao:
        "Mostrar o nível da água antes e depois. Explicar que o volume do objeto não muda.",
    },
    {
      question: "Faz seriação de elementos dados.",
      category: "Pensamento Operatório",
      suggestion_ainda_nao:
        "Usar objetos de diferentes tamanhos para ordenar. Começar com poucos elementos.",
      suggestion_com_mediacao:
        "Dar pistas sobre o critério de ordenação. Ajudar a encontrar o próximo elemento da série.",
    },
    {
      question: "Tem noção de modificação espacial.",
      category: "Pensamento Operatório",
      suggestion_ainda_nao:
        "Usar quebra-cabeças e jogos de encaixe. Trabalhar rotação e translação de objetos.",
      suggestion_com_mediacao:
        "Mostrar as transformações passo a passo. Usar linguagem espacial (girar, mover, virar).",
    },
    {
      question: "Tem noção de conservação de superfície.",
      category: "Pensamento Operatório",
      suggestion_ainda_nao:
        "Usar papel para recortar e reorganizar formas. Trabalhar com tangram simples.",
      suggestion_com_mediacao:
        "Mostrar que a área total não muda. Usar sobreposição para comprovar.",
    },
    {
      question:
        "Faz classificações (conjuntos), utilizando mudança de critério conforme orientação do aplicador.",
      category: "Pensamento Operatório",
      suggestion_ainda_nao:
        "Usar objetos variados para classificar por cor, forma, tamanho. Começar com um critério.",
      suggestion_com_mediacao:
        "Explicar o critério claramente. Ajudar a reorganizar quando o critério muda.",
    },
    {
      question: "Compreende inclusão de classes.",
      category: "Pensamento Operatório",
      suggestion_ainda_nao:
        "Trabalhar com conjuntos e subconjuntos concretos. Usar animais, frutas, brinquedos.",
      suggestion_com_mediacao:
        "Explicar as relações de pertencimento. Usar diagramas simples para visualizar.",
    },
    {
      question: "Faz classificações aplicando regras para inclusão de classes.",
      category: "Pensamento Operatório",
      suggestion_ainda_nao:
        "Dar regras claras para classificação. Usar exemplos e contra-exemplos.",
      suggestion_com_mediacao:
        "Verificar compreensão da regra. Dar feedback imediato sobre acertos e erros.",
    },
    {
      question: "Compreende interseção de classes.",
      category: "Pensamento Operatório",
      suggestion_ainda_nao:
        "Usar diagramas de Venn simples com objetos concretos. Trabalhar características comuns.",
      suggestion_com_mediacao:
        "Explicar o que significa ter as duas características. Usar exemplos visuais.",
    },
    {
      question:
        "Faz classificações aplicando regras para interseção de classes.",
      category: "Pensamento Operatório",
      suggestion_ainda_nao:
        "Praticar com objetos que têm múltiplas características. Usar tabelas simples.",
      suggestion_com_mediacao:
        "Ajudar a identificar características comuns. Usar marcadores visuais.",
    },
    {
      question:
        "Faz combinações de fichas estabelecendo critérios lógicos (pensamento formal).",
      category: "Pensamento Operatório",
      suggestion_ainda_nao:
        "Usar fichas coloridas para fazer diferentes combinações. Começar com poucas variáveis.",
      suggestion_com_mediacao:
        "Mostrar sistematização das combinações. Usar tabelas ou esquemas organizadores.",
    },
    {
      question: "Faz permutações-substituições, trocas (pensamento formal).",
      category: "Pensamento Operatório",
      suggestion_ainda_nao:
        "Trabalhar com sequências simples de objetos. Praticar trocas de posição.",
      suggestion_com_mediacao:
        "Explicar o conceito de permutação. Mostrar diferentes possibilidades sistematicamente.",
    },
    {
      question: "Faz previsão lógica - pensamento formal.",
      category: "Pensamento Operatório",
      suggestion_ainda_nao:
        "Usar sequências e padrões para prever próximos elementos. Trabalhar com regularidades.",
      suggestion_com_mediacao:
        "Ajudar a identificar o padrão. Verbalizar a lógica da sequência.",
    },
    {
      question:
        "Demonstra capacidade de tônus (contração muscular em repouso), postura e equilíbrio em movimentos habituais com o mínimo de fadiga muscular.",
      category: "Funções Psicomotoras",
      suggestion_ainda_nao:
        "Propor exercícios de fortalecimento muscular lúdicos. Trabalhar postura com jogos de equilíbrio.",
      suggestion_com_mediacao:
        "Dar apoio físico quando necessário. Fazer pausas frequentes para descanso.",
    },
    {
      question:
        "Apresenta dominância lateral esquerda em atividades de chutar e segurar.",
      category: "Funções Psicomotoras",
      suggestion_ainda_nao:
        "Respeitar a dominância natural. Oferecer atividades que fortaleçam o lado dominante.",
      suggestion_com_mediacao:
        "Não forçar mudança de dominância. Adaptar materiais para facilitar o uso.",
    },
    {
      question:
        "Apresenta dominância lateral direita em atividades de chutar ou manipular e segurar objetos.",
      category: "Funções Psicomotoras",
      suggestion_ainda_nao:
        "Respeitar a dominância natural. Oferecer atividades que fortaleçam o lado dominante.",
      suggestion_com_mediacao:
        "Não forçar mudança de dominância. Adaptar materiais para facilitar o uso.",
    },
    {
      question:
        "Demonstra consciência de corpo e das possibilidades de expressão corporal em atividades práticas (funcionais) identificando a função de cada membro, locomovendo-se em espaço determinado e respeitando um limite de tempo dado por comando sonoro (apito).",
      category: "Funções Psicomotoras",
      suggestion_ainda_nao:
        "Trabalhar esquema corporal com músicas e movimentos. Usar espelhos para autoconhecimento.",
      suggestion_com_mediacao:
        "Nomear partes do corpo durante atividades. Dar comandos claros e demonstrar movimentos.",
    },
    {
      question:
        "Demonstra consciência de seu corpo em relação ao espaço, aos objetos que o rodeiam e às pessoas nas atividades em que deve se posicionar ao lado, dentro, fora, em frente, etc.",
      category: "Funções Psicomotoras",
      suggestion_ainda_nao:
        "Usar jogos de posicionamento espacial. Trabalhar conceitos espaciais com brincadeiras.",
      suggestion_com_mediacao:
        "Usar linguagem espacial constante. Demonstrar posições corporalmente.",
    },
    {
      question: "Demonstra agilidade e rapidez na mobilidade e locomoção.",
      category: "Funções Psicomotoras",
      suggestion_ainda_nao:
        "Propor circuitos motores simples. Trabalhar coordenação com obstáculos.",
      suggestion_com_mediacao:
        "Diminuir velocidade exigida. Dar mais tempo para execução dos movimentos.",
    },
    {
      question: "Demonstra harmonia nos movimentos corporais.",
      category: "Funções Psicomotoras",
      suggestion_ainda_nao:
        "Trabalhar ritmo com música e dança. Usar atividades de coordenação bilateral.",
      suggestion_com_mediacao:
        "Fazer movimentos junto com o aluno. Usar música para marcar o ritmo.",
    },
    {
      question: "Realiza atividades que exijam praxia global.",
      category: "Funções Psicomotoras",
      suggestion_ainda_nao:
        "Propor atividades de coordenação ampla. Usar jogos que envolvam todo o corpo.",
      suggestion_com_mediacao:
        "Demonstrar movimentos complexos em etapas. Dar apoio físico quando necessário.",
    },
    {
      question: "Realiza atividades que exijam praxia fina (segurar, pinçar).",
      category: "Funções Psicomotoras",
      suggestion_ainda_nao:
        "Trabalhar coordenação fina com materiais variados. Usar atividades de pinça e preensão.",
      suggestion_com_mediacao:
        "Adaptar materiais para facilitar preensão. Fortalecer musculatura das mãos gradualmente.",
    },
  ],
};
