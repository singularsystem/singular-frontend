import {
  calculateEmotionalPercentage,
  generateCognitiveText,
  generateConclusionText,
  generateRecommendationsText,
  generateSocialText,
  getEmotionalDevelopment,
} from "@/lib/relatorio-psicologo";
import { RelatorioPsicologico } from "@/types/relatorio";

type Props = {
  relatorio: RelatorioPsicologico;
};

export function TabPsicologico({ relatorio }: Props) {
  let result = calculateEmotionalPercentage(
    relatorio.psychologistQuestionnaire,
  );
  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-4 my-4 px-10 text-justify">
        <h4 className="text-xl font-semibold">1. Instrumentos Utilizados</h4>
        <ul className="pl-4">
          <li>
            <strong>ESCALA SNAP-IV</strong>: Instrumento de rastreamento para
            Transtorno de Déficit de Atenção e Hiperatividade (TDAH), composto
            por 18 itens que avaliam sintomas de desatenção e
            hiperatividade/impulsividade.
          </li>
          <li>
            <strong>ESCALA ADAPTATIVA-DI</strong>: Avalia o funcionamento
            adaptativo do estudante em três domínios principais: habilidades
            conceituais, sociais epráticas, permitindo identificar o nível de
            independência e adaptação ao ambiente.
          </li>
          <li>
            <strong>QUESTIONÁRIO DE TRIAGEM MULTIPROFISSIONAL (Ficha de Triagem 1.1)</strong>:
            Instrumento de triagem abrangente que avalia múltiplas áreas do
            desenvolvimento, incluindo linguagem, escrita, leitura, raciocínio
            lógico, autonomia, memória, atenção e interação socioemocional.
          </li>
        </ul>
      </div>

      {relatorio.adaptiveBehaviorScaleDI && (
        <div className="space-y-4 my-4 px-10 text-justify">
          <h4 className="text-lg font-semibold">2. Desenvolvimento Cognitivo</h4>
          <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
            {generateCognitiveText(relatorio)}
          </div>
        </div>
      )}

      <div className="space-y-4 my-4 px-10 text-justify">
        <h4 className="text-lg font-semibold">3. Desenvolvimento Emocional</h4>
        <p className="whitespace-pre-wrap break-words">
          {getEmotionalDevelopment(result.percentage)}
        </p>
      </div>

      <div className="space-y-4 my-4 px-10 text-justify">
        <h4 className="text-lg font-semibold">4. Desenvolvimento Social</h4>
        <p className="whitespace-pre-wrap break-words">
          {generateSocialText(relatorio)}
        </p>
      </div>

      <div className="space-y-4 my-4 px-10 text-justify">
        <h4 className="text-lg font-semibold">5. Resultados</h4>
        <div className="ml-4">
          <div className="mb-8">
            <p className="text-xl font-semibold text-gray-700 mb-4">
              5.1 Escala SNAP-IV
            </p>
            {/* <SNAPIVResultCard questionario={relatorio.snapIVQuestionnaire} /> */}

            {/* <p>Pontuação: </p> */}
            <p>
              Resultado: Sugestivo de {relatorio.snapIVQuestionnaire?.result}
            </p>
          </div>
          {relatorio.adaptiveBehaviorScaleDI && (
            <div>
              <p className="text-xl font-semibold  text-gray-700 mb-4">
                5.2 Escala Adaptativa-DI
              </p>
              <p>Pontuação: {relatorio.adaptiveBehaviorScaleDI.score} pontos</p>
              <p>
                Resultado: Sugestivo de{" "}
                {relatorio.adaptiveBehaviorScaleDI.result?.toLowerCase()}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 my-4 px-10 text-justify">
        <h4 className="text-lg font-semibold">6. Conclusões</h4>
        <p className="whitespace-pre-wrap break-words">
          {generateConclusionText(relatorio)}
        </p>
        {relatorio.conclusion && (
          <div className="mt-4 p-4 bg-slate-50 border-l-4 border-slate-300">
            <p className="font-semibold text-slate-700 mb-2">
              Observações do(a) Psicólogo(a):
            </p>
            <p className="whitespace-pre-wrap break-words text-slate-600">
              {relatorio.conclusion}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4 my-4 px-10 text-justify">
        <h4 className="text-lg font-semibold">7. Recomendações</h4>
        <p className="whitespace-pre-wrap break-words">
          {generateRecommendationsText(relatorio)}
        </p>
      </div>
    </div>
  );
}
