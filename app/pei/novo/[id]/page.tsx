"use client";
export const dynamic = "force-dynamic";
import { QuestionCard } from "@/components/pei/card-question";
import { PEICardSerie } from "@/components/pei/card-serie";
import { PEICardSubject } from "@/components/pei/card-subject";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useBack } from "@/hooks/use-back";
import { toast } from "@/hooks/use-toast";
import {
  useAddSubjectToPEI,
  useCreatePEI,
  useFetchPEIByID,
} from "@/hooks/useFetchPEI";
import { useFetchStudent } from "@/hooks/useFetchStudents";
import { portageData } from "@/lib/portage-data";
import {
  CreatePEIApiPayload,
  disciplinasDisponiveis,
  mapCurrentSubjectPayload,
  ORDEM_SERIES,
  PEIAnswerMap,
  PEIAnswerValue,
  PEIQuestionStep,
} from "@/types/pei";
import {
  Baby,
  Book,
  Car,
  Calculator,
  Clock,
  Globe,
  Handshake,
  MapPin,
  Microscope,
  Puzzle,
  Users,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useMemo, useState } from "react";

type SerieKey = string;

type SearchParams = { mode?: string };

function isFundamentalSerieKey(
  serie: string,
): serie is keyof typeof disciplinasDisponiveis {
  return Object.prototype.hasOwnProperty.call(disciplinasDisponiveis, serie);
}

function getFaixaEducacaoInfantilLabel(
  faixa: "0-1" | "1-2" | "2-3" | "3-4" | "4-5",
) {
  switch (faixa) {
    case "0-1":
      return "0 a 1 ano";
    case "1-2":
      return "1 a 2 anos";
    case "2-3":
      return "2 a 3 anos";
    case "3-4":
      return "3 a 4 anos";
    case "4-5":
      return "4 a 5 anos";
  }
}

export default function NovoPEI({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<SearchParams>;
}) {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [autoAvancar, setAutoAvancar] = useState(true);
  const [openQuestions, setOpenQuestions] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [openEducacaoInfantil, setOpenEducacaoInfantil] = useState(false);
  const [faixaEducacaoInfantil, setFaixaEducacaoInfantil] = useState<
    "0-1" | "1-2" | "2-3" | "3-4" | "4-5" | null
  >(null);
  const [serieSelecionada, setSerieSelecionada] = useState<SerieKey | null>(
    null,
  );
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<
    string | null
  >(null);
  const [openSubjects, setOpenSubjects] = useState(false);
  const [respostas, setRespostas] = useState<PEIAnswerMap>({});
  const [respostaSelecionada, setRespostaSelecionada] =
    useState<PEIAnswerValue | null>(null);
  const back = useBack("/pei");
  const unwrappedParams = use(params);
  const unwrappedSearchParams = use(
    searchParams ?? Promise.resolve<SearchParams>({}),
  );
  const id = unwrappedParams.id;
  const mode = unwrappedSearchParams.mode;
  const isAddSubjectMode = mode === "add-subject";
  const { createPEI, loading: loadingPEI } = useCreatePEI();
  const { plano: peiExistente } = useFetchPEIByID(id, {
    enabled: isAddSubjectMode,
  });
  const { addSubjectToPEI, loading: addingSubject } = useAddSubjectToPEI({
    enabled: isAddSubjectMode,
  });
  const studentIdToFetch = isAddSubjectMode
    ? (peiExistente?.student.id ?? "")
    : id;
  const {
    aluno,
    error: fetchError,
    loading: fetchLoading,
  } = useFetchStudent(studentIdToFetch);

  useEffect(() => {
    if (fetchLoading) return;

    if (fetchError) {
      toast({
        title: "Erro ao buscar aluno",
        description: fetchError.message || "Ocorreu um erro desconhecido.",
        variant: "destructive",
      });
    }
  }, [fetchError, fetchLoading, aluno, toast]);

  useEffect(() => {
    if (!isAddSubjectMode) return;
    if (!peiExistente) return;

    const serie = peiExistente.serie as SerieKey;

    setSerieSelecionada((prev) => (prev === serie ? prev : serie));
    if (serie === "Educação Infantil") {
      setOpenEducacaoInfantil(true);
      setOpenSubjects(false);
    } else {
      setOpenEducacaoInfantil(false);
      setOpenSubjects(true);
    }
  }, [isAddSubjectMode, peiExistente?.serie]);

  const subjectsJaAdicionados = useMemo(() => {
    if (!peiExistente) return new Set<string>();
    return new Set(peiExistente.subjects.map((s) => s.subject));
  }, [peiExistente]);

  const SERIES_FUNDAMENTAL = ORDEM_SERIES.map((label, index) => {
    const numero = index + 1;

    return {
      key: numero.toString(),
      title: label,
      description: "Ensino Fundamental",
      number: numero,
    };
  });

  const SUBJECT_UI: Record<
    string,
    { icon: any; iconClassName: string; title: string }
  > = {
    "Língua Portuguesa": {
      title: "Língua Portuguesa",
      icon: Book,
      iconClassName: "bg-blue-500/10 text-blue-600 border-blue-200",
    },
    Matemática: {
      title: "Matemática",
      icon: Calculator,
      iconClassName: "bg-purple-500/10 text-purple-600 border-purple-200",
    },
    Ciências: {
      title: "Ciências",
      icon: Microscope,
      iconClassName: "bg-orange-500/10 text-orange-600 border-orange-200",
    },
    História: {
      title: "História",
      icon: Clock,
      iconClassName: "bg-amber-500/10 text-amber-600 border-amber-200",
    },
    Geografia: {
      title: "Geografia",
      icon: MapPin,
      iconClassName: "bg-green-500/10 text-green-600 border-green-200",
    },
    Inglês: {
      title: "Inglês",
      icon: Globe,
      iconClassName: "bg-red-500/10 text-red-600 border-red-200",
    },
  };

  const disciplinasDaSerie = serieSelecionada
    ? isFundamentalSerieKey(serieSelecionada)
      ? Object.keys(disciplinasDisponiveis[serieSelecionada] ?? {})
      : []
    : [];

  const perguntasSelecionadas: PEIQuestionStep[] = useMemo(() => {
    if (faixaEducacaoInfantil) {
      const questions = portageData[faixaEducacaoInfantil] ?? [];
      const faixaLabel = getFaixaEducacaoInfantilLabel(faixaEducacaoInfantil);

      return questions.map((q, idx) => ({
        id: `EI-${faixaEducacaoInfantil}-${idx + 1}`,
        tipo: q.category,
        pergunta: q.question,
        disciplina: `Educação Infantil (${faixaLabel})`,
      }));
    }

    if (!serieSelecionada || !disciplinaSelecionada) return [];
    if (!isFundamentalSerieKey(serieSelecionada)) return [];

    const porSerie = disciplinasDisponiveis[serieSelecionada];
    const questions =
      porSerie[disciplinaSelecionada as keyof typeof porSerie] ?? [];

    return questions.map((q) => ({
      id: q.id,
      tipo: q.tipo,
      pergunta: q.pergunta,
      disciplina: disciplinaSelecionada,
    }));
  }, [faixaEducacaoInfantil, serieSelecionada, disciplinaSelecionada]);

  const perguntas = perguntasSelecionadas;

  const perguntaAtual = perguntas[currentIndex];
  const respostaAnterior = perguntaAtual
    ? (respostas[perguntaAtual.id]?.response ?? null)
    : null;

  const handleResposta = (valor: PEIAnswerValue) => {
    if (!perguntaAtual) return;

    const category = `${perguntaAtual.disciplina} • ${perguntaAtual.tipo}`;

    setRespostas((prev) => ({
      ...prev,
      [perguntaAtual.id]: {
        response: valor,
        category,
        disciplina: perguntaAtual.disciplina,
        tipo: perguntaAtual.tipo,
      },
    }));

    setRespostaSelecionada(valor);

    if (autoAvancar) {
      setTimeout(() => {
        setRespostaSelecionada(null);
        setCurrentIndex((prev) =>
          prev < perguntas.length - 1 ? prev + 1 : prev,
        );
      }, 600);
    }
  };

  const onPrev = () => {
    setCurrentIndex((p) => Math.max(0, p - 1));
    setRespostaSelecionada(null);
  };

  const onNext = () => {
    setCurrentIndex((p) => Math.min(perguntas.length - 1, p + 1));
    setRespostaSelecionada(null);
  };

  useEffect(() => {
    if (!serieSelecionada) return;

    if (isAddSubjectMode) return;
    if (faixaEducacaoInfantil) return;

    setDisciplinaSelecionada(null);
    setOpenQuestions(false);
    setCurrentIndex(0);
    setRespostas({});
    setRespostaSelecionada(null);
  }, [serieSelecionada, isAddSubjectMode, faixaEducacaoInfantil]);

  const resetQuestions = () => {
    setOpenQuestions(false);
    setDisciplinaSelecionada(null);
    setCurrentIndex(0);
    setRespostas({});
    setRespostaSelecionada(null);

    if (faixaEducacaoInfantil) {
      setFaixaEducacaoInfantil(null);
      setOpenEducacaoInfantil(true);
    }
  };

  const handleBack = () => {
    if (openQuestions) {
      resetQuestions();
      return;
    }

    if (openEducacaoInfantil) {
      setOpenEducacaoInfantil(false);
      setFaixaEducacaoInfantil(null);
      setSerieSelecionada(null);
      setDisciplinaSelecionada(null);
      return;
    }

    if (openSubjects) {
      if (isAddSubjectMode) {
        router.push(`/pei/${id}`);
        return;
      }

      setOpenSubjects(false);
      setSerieSelecionada(null);
      setDisciplinaSelecionada(null);
      return;
    }

    if (isAddSubjectMode) {
      router.push(`/pei/${id}`);
      return;
    }

    back();
  };

  const handleSubmit = async () => {
    setLoading(true);

    if (!aluno || !user || !serieSelecionada || !disciplinaSelecionada) {
      toast({
        title: "Erro",
        description: "Usuário/aluno/série/disciplina não carregado(s).",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      const subjectPayload = mapCurrentSubjectPayload(
        disciplinaSelecionada,
        respostas,
      );

      if (isAddSubjectMode) {
        await addSubjectToPEI(id, subjectPayload);

        toast({
          title: "Disciplina adicionada",
          description: "As respostas foram adicionadas ao PEI existente.",
          variant: "success",
        });

        router.push(`/pei/${id}`);
        return;
      }

      const payload: CreatePEIApiPayload = {
        studentID: aluno.id,
        userID: user.id,
        serie: serieSelecionada,
        schoolYear: String(new Date().getFullYear()),
        subjects: [subjectPayload],
      };

      const created = await createPEI(payload);

      toast({
        title: "PEI salvo",
        description: "PEI foi salvo com sucesso.",
        variant: "success",
      });

      router.push(`/pei/${created?.id}`);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description:
          error instanceof Error ? error.message : "Erro desconhecido.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-1 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleBack}>
            Voltar
          </Button>
        </div>
      </div>
      {!isAddSubjectMode &&
        !openSubjects &&
        !openQuestions &&
        !openEducacaoInfantil && (
        <div className="grid grid-cols-3 gap-8 max-w-[80rem] mx-auto mt-12">
          <PEICardSerie
            key="educacao-infantil"
            title="Educação Infantil"
            description="0 a 5 anos"
            circleText="EI"
            onClick={() => {
              setSerieSelecionada(null);
              setDisciplinaSelecionada(null);
              setOpenSubjects(false);
              setOpenQuestions(false);
              setRespostas({});
              setRespostaSelecionada(null);
              setCurrentIndex(0);
              setFaixaEducacaoInfantil(null);
              setOpenEducacaoInfantil(true);
            }}
          />
          {SERIES_FUNDAMENTAL.map((serie) => (
            <PEICardSerie
              key={serie.key}
              title={serie.title}
              description={serie.description}
              circleText={serie.number}
              onClick={() => {
                setOpenEducacaoInfantil(false);
                setFaixaEducacaoInfantil(null);
                setSerieSelecionada(serie.title);
                setOpenSubjects(true);
              }}
            />
          ))}
        </div>
      )}
      {openEducacaoInfantil && !openQuestions && (
        <div className="grid grid-cols-3 gap-8 max-w-[80rem] mx-auto mt-12 transition-opacity duration-300">
          {(() => {
            const jaTemEI =
              isAddSubjectMode && subjectsJaAdicionados.has("Educação Infantil");
            const baseClassName = `shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1 ${jaTemEI ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`;
            const onSelect = (faixa: "0-1" | "1-2" | "2-3" | "3-4" | "4-5") => {
              if (jaTemEI) return;
              setSerieSelecionada("Educação Infantil");
              setDisciplinaSelecionada("Educação Infantil");
              setOpenSubjects(false);
              setFaixaEducacaoInfantil(faixa);
              setOpenQuestions(true);
              setCurrentIndex(0);
              setRespostas({});
              setRespostaSelecionada(null);
            };

            return (
              <>
          <Card
            key="0-1"
            className={baseClassName}
            onClick={() => {
              onSelect("0-1");
            }}
          >
            <CardHeader className="flex flex-col items-center">
              <Baby className="h-16 w-16 border bg-blue-500 text-white rounded-full p-4 mb-4" />
              <CardTitle>0 a 1 ano</CardTitle>
              <CardDescription className="text-base text-center">
                Desenvolvimento inicial e marcos básicos
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center mt-2">
              <span className="py-0.5 px-20 border rounded-2xl bg-gray-200 text-sm">
                {portageData["0-1"].length} avaliações
              </span>
            </CardContent>
          </Card>

          <Card
            key="1-2"
            className={baseClassName}
            onClick={() => {
              onSelect("1-2");
            }}
          >
            <CardHeader className="flex flex-col items-center">
              <Car className="h-16 w-16 border bg-green-500 text-white rounded-full p-4 mb-4" />
              <CardTitle>1 a 2 anos</CardTitle>
              <CardDescription className="text-base text-center">
                Primeiros passos e comunicação
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center mt-2">
              <span className="py-0.5 px-20 border rounded-2xl bg-gray-200 text-sm">
                {portageData["1-2"].length} avaliações
              </span>
            </CardContent>
          </Card>

          <Card
            key="2-3"
            className={baseClassName}
            onClick={() => {
              onSelect("2-3");
            }}
          >
            <CardHeader className="flex flex-col items-center">
              <Handshake className="h-16 w-16 border bg-yellow-500 text-white rounded-full p-4 mb-4" />
              <CardTitle>2 a 3 anos</CardTitle>
              <CardDescription className="text-base text-center">
                Autonomia e socialização inicial
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center mt-2">
              <span className="py-0.5 px-20 border rounded-2xl bg-gray-200 text-sm">
                {portageData["2-3"].length} avaliações
              </span>
            </CardContent>
          </Card>

          <Card
            key="3-4"
            className={baseClassName}
            onClick={() => {
              onSelect("3-4");
            }}
          >
            <CardHeader className="flex flex-col items-center">
              <Users className="h-16 w-16 border bg-purple-500 text-white rounded-full p-4 mb-4" />
              <CardTitle>3 a 4 anos</CardTitle>
              <CardDescription className="text-base text-center">
                Desenvolvimento motor e cognitivo
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center mt-2">
              <span className="py-0.5 px-20 border rounded-2xl bg-gray-200 text-sm">
                {portageData["3-4"].length} avaliações
              </span>
            </CardContent>
          </Card>

          <Card
            key="4-5"
            className={baseClassName}
            onClick={() => {
              onSelect("4-5");
            }}
          >
            <CardHeader className="flex flex-col items-center">
              <Puzzle className="h-16 w-16 border bg-red-500 text-white rounded-full p-4 mb-4" />
              <CardTitle>4 a 5 anos</CardTitle>
              <CardDescription className="text-base text-center">
                Habilidades complexas e preparação escolar
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center mt-2">
              <span className="py-0.5 px-20 border rounded-2xl bg-gray-200 text-sm">
                {portageData["4-5"].length} avaliações
              </span>
            </CardContent>
          </Card>
              </>
            );
          })()}
        </div>
      )}
      {openSubjects && !openQuestions && (
        <div
          className={`grid grid-cols-3 gap-8 max-w-[80rem] mx-auto mt-12 transition-opacity duration-300 ${openSubjects ? "block" : "hidden"}`}
        >
          {disciplinasDaSerie.map((disciplina) => {
            const jaTem =
              isAddSubjectMode && subjectsJaAdicionados.has(disciplina);

            const ui = SUBJECT_UI[disciplina] ?? {
              title: disciplina,
              icon: Book,
              iconClassName: "bg-slate-500/10 text-slate-600 border-slate-200",
            };

            return (
              <PEICardSubject
                key={disciplina}
                title={ui.title}
                icon={ui.icon}
                iconClassName={ui.iconClassName}
                disabled={jaTem}
                subtitle={jaTem ? "Já adicionada" : undefined}
                onClick={() => {
                  if (jaTem) return;

                  setDisciplinaSelecionada(disciplina);
                  setOpenQuestions(true);
                  setCurrentIndex(0);
                  setRespostas({});
                  setRespostaSelecionada(null);
                }}
              />
            );
          })}
        </div>
      )}
      {openQuestions && perguntaAtual && (
        <div className="flex items-center justify-center">
          <QuestionCard
            pergunta={{
              category: `${perguntaAtual.disciplina} • ${perguntaAtual.tipo}`,
              question: perguntaAtual.pergunta,
            }}
            currentIndex={currentIndex}
            total={perguntas.length}
            autoAvancar={autoAvancar}
            loading={loading}
            respostaSelecionada={respostaSelecionada}
            respostaAnterior={respostaAnterior}
            onAnswer={handleResposta}
            onPrev={onPrev}
            onNext={onNext}
            onToggleAutoAdvance={() => setAutoAvancar((p) => !p)}
            onFinish={handleSubmit}
            canPrev={currentIndex > 0}
            canNext={currentIndex < perguntas.length - 1}
            isLast={currentIndex === perguntas.length - 1}
          />
        </div>
      )}
    </main>
  );
}
