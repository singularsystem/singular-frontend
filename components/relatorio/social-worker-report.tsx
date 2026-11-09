import { SocialWorkerReport } from "@/types/relatorio-assistente-social";

type Props = {
  relatorio: SocialWorkerReport;
  selectedHealthCondition: any;
  formatOther: (value: string, other?: string) => string;
  formatList: (list: string[], other?: string) => string;
  formatHealthConditions: (selected: any, other?: string) => string;
  formatContinuousMedication: (
    value: string,
    details?: string,
    other?: string,
  ) => string;
};

export function TabSocial({
  relatorio,
  selectedHealthCondition,
  formatOther,
  formatList,
  formatHealthConditions,
  formatContinuousMedication,
}: Props) {
  const isOtherLabel = (label: string) =>
    ["outro", "outra", "outros", "outras"].includes(label.trim().toLowerCase());

  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-4 my-4 px-10 text-justify">
        <h4 className="text-xl font-semibold">1. Objetivos</h4>
        <p className="whitespace-pre-wrap break-words">
          O presente relatório social tem como objetivo apresentar uma análise
          das condições socioeconômicas, familiares e educacionais do(a)
          aluno(a) {relatorio.student.fullName}, matriculado(a) no{" "}
          {relatorio.student.serie} da {relatorio.student.schoolName}, com vista
          a subsidiar ações e intervenções que promovam seu desenvolvimento
          integral e a garantia de seus direitos.
        </p>
      </div>

      <div className="space-y-4 my-4 px-10 text-justify">
        <h4 className="text-xl font-semibold">2. Procedimentos Utilizados</h4>
        <p className="whitespace-pre-wrap break-words">
          Para a elaboração deste relatório, foram utilizados os seguintes
          procedimentos:
        </p>

        <ul className="list-disc pl-5">
          {relatorio.proceduresUsed.map((opt: any) => (
            <li key={opt.procedure}>
              {isOtherLabel(opt.procedure) && relatorio.otherProceduresUsed
                ? `${opt.procedure}: ${relatorio.otherProceduresUsed}`
                : opt.procedure}
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-4 my-4 px-10 text-justify">
        <h4 className="text-xl font-semibold">
          3. Condições Socioeconômicas e Familiares
        </h4>
        <p className="whitespace-pre-wrap break-words">
          IDENTIFICAÇÃO: {relatorio.student.fullName}, {relatorio.student.age}{" "}
          anos, nascido(a) em {relatorio.student.formattedDateOfBirth}, cursando
          o {relatorio.student.serie} na {relatorio.student.schoolName}.
          Responsável: {relatorio.student.nameOfPersonResponsible}.
        </p>
        <p className="whitespace-pre-wrap break-words">
          COMPOSIÇÃO FAMILIAR: A família apresenta composição{" "}
          {formatOther(
            relatorio.familyComposition,
            relatorio.otherFamilyComposition,
          )}
          . A residência é composta por{" "}
          {formatOther(
            relatorio.numberOfPeopleInTheHousehold,
            relatorio.otherNumberOfPeopleInTheHousehold,
          )}
          .
        </p>
        {relatorio.additionalObservationHouseholdMembers && (
          <p className="whitespace-pre-wrap break-words">
            OBSERVAÇÕES SOBRE OS MEMBROS DA RESIDÊNCIA:{" "}
            {relatorio.additionalObservationHouseholdMembers}
          </p>
        )}
        <p className="whitespace-pre-wrap break-words">
          MORADIA: A família reside em casa{" "}
          {formatOther(relatorio.typeOfHousing, relatorio.otherTypeOfHousing)},
          com condição considerada{" "}
          {formatOther(
            relatorio.housingConditions,
            relatorio.otherHousingConditions,
          )}
          . A moradia possui{" "}
          {formatOther(relatorio.numberOfRooms, relatorio.otherNumberOfRooms)}.
        </p>
        <p className="whitespace-pre-wrap break-words">
          RENDA FAMILIAR: A renda familiar mensal é de{" "}
          {formatOther(
            relatorio.monthlyHouseholdIncome,
            relatorio.otherMonthlyHouseholdIncome,
          )}
          , proveniente de{" "}
          {formatList(
            relatorio.familyIncomeSource.map((opt: any) => opt.source),
            relatorio.otherFamilyIncomeSource,
          )}
          . Benefícios:{" "}
          {formatList(
            relatorio.receivedGovernmentBenefits.map((opt: any) => opt.benefit),
            relatorio.otherReceivedGovernmentBenefits,
          )}
          .
        </p>
        <p className="whitespace-pre-wrap break-words">
          CONDIÇÕES DE SAÚDE:{" "}
          {formatHealthConditions(
            selectedHealthCondition,
            relatorio.otherDetailsHealthConditions,
          )}{" "}
          {formatContinuousMedication(
            relatorio.continuousMedication,
            relatorio.detailsContinuousMedication,
            relatorio.otherContinuousMedication,
          )}{" "}
          O acesso a serviços de saúde é{" "}
          {formatOther(
            relatorio.healthServiceAccess,
            relatorio.otherHealthServiceAccess,
          )}
          .
        </p>
        <p className="whitespace-pre-wrap break-words">
          EDUCAÇÃO: A frequência escolar é{" "}
          {formatOther(
            relatorio.schoolAttendance,
            relatorio.otherSchoolAttendance,
          )}
          , e o desempenho acadêmico é considerado{" "}
          {formatOther(
            relatorio.academicPerformance,
            relatorio.otherAcademicPerformance,
          )}
          . Principais dificuldades:{" "}
          {formatList(
            relatorio.mainSchoolDifficulties.map((opt: any) => opt.difficulty),
            relatorio.otherMainSchoolDifficulties,
          )}
          .
        </p>
        <p className="whitespace-pre-wrap break-words">
          ALIMENTAÇÃO: O(a) aluno(a) realiza{" "}
          {formatOther(relatorio.dailyMeals, relatorio.otherDailyMeals)}{" "}
          diariamente. A situação de segurança alimentar é caracterizada como{" "}
          {formatOther(relatorio.foodSecurity, relatorio.otherFoodSecurity)}.
        </p>
        <p className="whitespace-pre-wrap break-words">
          CONVIVÊNCIA SOCIAL: O relacionamento familiar é descrito como{" "}
          {formatOther(
            relatorio.familyRelationship,
            relatorio.otherFamilyRelationship,
          )}
          . A rede de apoio social é{" "}
          {formatOther(
            relatorio.socialSupportNetwork,
            relatorio.otherSocialSupportNetwork,
          )}
          . A participação em atividades comunitárias é{" "}
          {formatOther(
            relatorio.communityActivityParticipation,
            relatorio.otherCommunityActivityParticipation,
          )}
          .
        </p>
      </div>

      <div className="space-y-4 my-4 px-10 text-justify">
        <h4 className="text-xl font-semibold">4. Conclusão</h4>
        <p className="whitespace-pre-wrap break-words">
          {(() => {
            const income = relatorio.monthlyHouseholdIncome;
            const otherIncome = relatorio.otherMonthlyHouseholdIncome;
            const foodSecurity = relatorio.foodSecurity;
            const otherFoodSecurity = relatorio.otherFoodSecurity;
            const housing = relatorio.housingConditions;
            const otherHousing = relatorio.otherHousingConditions;
            const typeOfHousing = relatorio.typeOfHousing;
            const otherTypeOfHousing = relatorio.otherTypeOfHousing;
            const dailyMeals = relatorio.dailyMeals;
            const incomeSources =
              relatorio.familyIncomeSource?.map((s: any) => s.source) || [];
            const otherIncomeSource = relatorio.otherFamilyIncomeSource;
            const benefits =
              relatorio.receivedGovernmentBenefits?.map(
                (b: any) => b.benefit,
              ) || [];

            // 1. Fatores Críticos de Vulnerabilidade (Sempre indicam desafios)
            const hasCriticalChallenge =
              income === "Até 1 salário mínimo" ||
              incomeSources.includes("Desempregado") ||
              housing ===
                "Precária (problemas estruturais ou falta de saneamento)" ||
              housing === "Insalubre (risco à saúde)" ||
              foodSecurity ===
                "Insegurança alimentar (falta de alimentos frequente)" ||
              dailyMeals === "1 refeição ou menos" ||
              otherHousing?.toLowerCase().includes("sem banheiro") ||
              otherHousing?.toLowerCase().includes("não tem banheiro") ||
              otherHousing?.toLowerCase().includes("risco") ||
              otherFoodSecurity?.toLowerCase().includes("insegurança") ||
              otherFoodSecurity?.toLowerCase().includes("falta");

            // 2. Fatores de Risco (Indicam desafios se não houver estabilidade)
            const hasRiskFactors =
              income === "De 1 a 2 salários mínimos" ||
              incomeSources.includes("Trabalho informal") ||
              incomeSources.includes("Benefícios sociais") ||
              benefits.some(
                (b: string) => b !== "Nenhum" && b !== "" && b !== "Nenhum(a)",
              ) ||
              typeOfHousing === "Cedida (por familiares ou outros)" ||
              dailyMeals === "2 refeições" ||
              otherIncomeSource?.toLowerCase().includes("instável") ||
              otherIncomeSource?.toLowerCase().includes("bico") ||
              otherIncomeSource?.toLowerCase().includes("auxílio");

            // 3. Indicadores de Estabilidade (Podem compensar fatores de risco)
            const hasStabilityFactors =
              income === "De 2 a 3 salários mínimos" ||
              income === "Acima de 3 salários mínimos" ||
              incomeSources.includes("Trabalho formal (carteira assinada)") ||
              housing === "Adequada (estrutura segura, água, luz, esgoto)";

            // Lógica Final: Desafio se tiver fator crítico OU (fator de risco SEM estabilidade)
            let hasSocioEconomicChallenges =
              hasCriticalChallenge || (hasRiskFactors && !hasStabilityFactors);

            // Quando renda é "Outra", a classificação manual tem prioridade sobre a lógica automática
            if (income === "Outra" && relatorio.socioeconomicContext) {
              hasSocioEconomicChallenges =
                relatorio.socioeconomicContext === "Com desafios socioeconômicos";
            }

            let text = "";
            if (hasSocioEconomicChallenges) {
              text = `Com base nas informações coletadas, observa-se que ${relatorio.student.fullName} está inserido(a) em um contexto familiar que apresenta desafios socioeconômicos que podem impactar seu desenvolvimento e aprendizagem. `;
            } else {
              text = `Com base nas informações coletadas, observa-se que ${relatorio.student.fullName} está inserido(a) em um contexto familiar que não apresenta desafios socioeconômicos significativos no momento, o que favorece seu desenvolvimento. `;
            }

            text +=
              "A família demonstra interesse no acompanhamento escolar, e o(a) aluno(a) apresenta potencial para desenvolvimento pleno, desde que receba o suporte adequado. ";

            if (hasSocioEconomicChallenges) {
              text +=
                "É fundamental que sejam implementadas ações integradas entre escola, família e rede de proteção social para garantir os direitos e promover o bem-estar do(a) aluno(a).";
            }

            return text;
          })()}
        </p>
        {relatorio.conclusion && (
          <div className="mt-4 p-4 bg-slate-50 border-l-4 border-slate-300">
            <p className="font-semibold text-slate-700 mb-2">
              Observações do(a) Assistente Social:
            </p>
            <p className="whitespace-pre-wrap break-words text-slate-600">
              {relatorio.conclusion}
            </p>
          </div>
        )}
      </div>

      <div className="space-y-4 my-4 px-10 text-justify">
        <h4 className="text-xl font-semibold">5. Recomendações</h4>
        <p className="whitespace-pre-wrap break-words">
          Com base na análise realizada, recomenda-se:
        </p>
        <ul className="list-disc pl-5">
          {relatorio.recommendations.map((opt: any) => (
            <li key={opt.recommendation}>
              {isOtherLabel(opt.recommendation) && relatorio.otherRecommendations
                ? `${opt.recommendation}: ${relatorio.otherRecommendations}`
                : opt.recommendation}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
