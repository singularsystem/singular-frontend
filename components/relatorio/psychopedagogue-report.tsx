import { scoreCARSRanges } from "@/lib/questionarios";
import { RelatorioPsicopedagogico } from "@/types/relatorio";

type Props = {
  relatorio: RelatorioPsicopedagogico;
};

export function TabPsicopedagogico({ relatorio }: Props) {
  const q = relatorio?.psychopedagogueQuestionnaire;

  const checkedDisabilities = q?.typeOfDisability?.length
    ? q.typeOfDisability.map((x: any) => x.disability)
    : [];
  const otherDisability = q?.otherTypesOfDisability;
  const disabilitiesText = [
    ...checkedDisabilities,
    ...(otherDisability ? [otherDisability] : [])
  ].join(", ") || "N/A";

  const disordersText = q?.typeOfDisorder?.length
    ? q.typeOfDisorder.map((x: any) => x.disorder).join(", ")
    : "N/A";

  const getSelectedResult = () => {
    return scoreCARSRanges.find(
      (range) => range.label === relatorio.carsQuestionnaire?.totalScore,
    );
  };
  const result = getSelectedResult();

  const hasMCHAT = !!relatorio?.mchatQuestionnaire;
  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-4 my-4 px-10 text-justify">
        <h4 className="text-lg font-semibold">1. Contexto da Avaliação</h4>
        <p className="whitespace-pre-wrap break-words">
          Esta avaliação NÃO se trata de laudo médico e nem tampouco substitui a
          avaliação de um profissional médico. Trata-se de uma triagem com
          intuito exclusivamente pedagógico e de fornecer informações para a
          melhoria acadêmica do estudante.
        </p>
      </div>

      <div className="space-y-4 my-4 px-10 text-justify">
        <h4 className="text-lg font-semibold">2. Metodologia Utilizada</h4>
        <p className="whitespace-pre-wrap break-words">
          {`Escalas utilizadas: ${
            hasMCHAT ? "MCHAT (TEA < 36 meses)" : "CARS (TEA ≥ 36 meses)"
          }${relatorio.cognitiveAssessment ? " e Escala de Funcionamento Intelectual." : "."}`}
        </p>
      </div>

      <div className="space-y-4 my-4 px-10 text-justify">
        <h4 className="text-lg font-semibold">3. Resultados</h4>
        <div className="ml-4">
          <div className="mb-8">
            <p className="text-xl font-semibold text-gray-700 mb-4">
              3.1 Avaliação de TEA (Transtorno do Espectro Autista)
            </p>
            {hasMCHAT ? (
              // <MCHATResultCard questionario={relatorio.mchatQuestionnaire} />
              <>
                <p>Pontuação: {relatorio.mchatQuestionnaire?.score} pontos</p>
                <p>Resultado: {relatorio.mchatQuestionnaire?.result}</p>
              </>
            ) : (
              // <CARSResultCard
              //   questionario={relatorio.carsQuestionnaire}
              //   showFull={false}
              // />
              <>
                <p>
                  Pontuação: {relatorio.carsQuestionnaire?.totalScore} pontos
                </p>
                <p>Resultado: {result?.result}</p>
              </>
            )}
          </div>
          {relatorio.cognitiveAssessment && (
            <div>
              <p className="text-xl font-semibold  text-gray-700 mb-4">
                3.2 Avaliação de Funcionamento Intelectual
              </p>
              {/* <CognitiveAssessmentResultCard
                questionario={relatorio.cognitiveAssessment}
                showFull={false}
              /> */}

              <p>
                Pontuação Total: {relatorio.cognitiveAssessment?.score} pontos
              </p>
              <p>
                Percentual de Acertos: {relatorio.cognitiveAssessment?.percentage}
                %
              </p>
              <p>
                Resultado: {relatorio.cognitiveAssessment?.result?.toUpperCase()}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4 my-4 px-10 text-justify">
        <h4 className="text-lg font-semibold">
          4. Observações Comportamentais
        </h4>
        <p className="whitespace-pre-wrap break-words">
          {q?.comportamentalObservations ?? "N/A"}
        </p>
      </div>

      <div className="space-y-2 px-10 text-justify">
        <h4 className="text-lg font-semibold">
          5. Observações sobre o Caderno do Aluno
        </h4>
        <p className="whitespace-pre-wrap break-words">
          {q?.notebookObservations ?? "N/A"}
        </p>
      </div>

      <div className="space-y-2 px-10 text-justify">
        <h4 className="text-lg font-semibold">
          6. Outras Observações Relevantes
        </h4>
        <p className="whitespace-pre-wrap break-words">
          {q?.otherObservations ?? "N/A"}
        </p>
      </div>

      <div className="space-y-4 my-6 px-10 text-justify">
        <h4 className="text-lg font-semibold">7. Tipo de Deficiência</h4>
        <p className="whitespace-pre-wrap break-words">{disabilitiesText}</p>
      </div>

      <div className="space-y-4 my-6 px-10 text-justify">
        <h4 className="text-lg font-semibold">8. Tipo de Transtorno</h4>
        <p className="whitespace-pre-wrap break-words">{disordersText}</p>
      </div>

      <div className="space-y-4 my-4 px-10 text-justify">
        <h4 className="text-lg font-semibold">9. Conclusão da Avaliação</h4>
        <p className="whitespace-pre-wrap break-words">
          {q?.justificationForClassification ?? "N/A"}
        </p>
        {relatorio.conclusion && (
          <div className="mt-4 p-4 bg-slate-50 border-l-4 border-slate-300">
            <p className="font-semibold text-slate-700 mb-2">
              Observações do(a) Psicopedagogo(a):
            </p>
            <p className="whitespace-pre-wrap break-words text-slate-600">
              {relatorio.conclusion}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4 my-4 px-10 text-justify">
        <h4 className="text-lg font-semibold">10. Recomendações</h4>
        <ul className="list-disc pl-5">
          {(q?.recommendations ?? []).map((opt: any) => (
            <li key={opt.recommendation}>
              {opt.recommendation === "Outro"
                ? `${opt.recommendation}: ${q?.otherRecommendations ?? ""}`
                : opt.recommendation}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
