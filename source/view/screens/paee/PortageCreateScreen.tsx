import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/auth-context";
import { useBack } from "@/hooks/use-back";
import { toast } from "@/hooks/use-toast";
import { portageData } from "@/lib/portage-data";
import { getFaixaEtariaStudent, getFaixaFromString } from "@/lib/utils";
import {
  Baby,
  Car,
  Check,
  GraduationCap,
  Hand,
  Handshake,
  Pause,
  Play,
  Puzzle,
  Users,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePortageForm } from "../../hooks/paee/usePortageForm";

interface PortageCreateScreenProps {
  id: string; // studentId
}

export function PortageCreateScreen({ id }: PortageCreateScreenProps) {
  const router = useRouter();
  const { user } = useAuth();
  
  const [autoAvancar, setAutoAvancar] = useState(true);
  const [openQuestions, setOpenQuestions] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [faixaSelecionada, setFaixaSelecionada] = useState("");
  const [respostaSelecionada, setRespostaSelecionada] = useState<string | null>(null);
  
  const back = useBack("/paee");

  const {
    student: aluno,
    formData,
    updateFormData,
    savePortage,
    isSaving,
    error,
    saveSuccess,
    savedId,
    fetchLoading
  } = usePortageForm(id);

  useEffect(() => {
    if (error) {
      toast({
        title: "Erro",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);

  useEffect(() => {
    if (saveSuccess && savedId) {
      toast({
        title: "Portage salvo",
        description: "Avaliação foi salva com sucesso!",
        variant: "success",
      });
      router.push(`/paee/novo/${savedId}/paee`);
    }
  }, [saveSuccess, savedId, router]);

  const faixa = getFaixaEtariaStudent(aluno?.dateOfBirth);

  useEffect(() => {
    setCurrentIndex(0);
  }, [faixaSelecionada]);

  const perguntas = portageData[faixaSelecionada] || [];
  const respostasAtuais = (formData.responses as Record<number, { response: string; category: string }>) || {};
  const respostaAnterior = respostasAtuais[currentIndex + 1]?.response || null;

  const handleResposta = (valor: string, categoria: string) => {
    const newResponses = {
      ...respostasAtuais,
      [currentIndex + 1]: {
        response: valor,
        category: categoria,
      },
    };

    updateFormData({ responses: newResponses });
    setRespostaSelecionada(valor);

    if (autoAvancar) {
      setTimeout(() => {
        if (currentIndex < perguntas.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        }
        if (currentIndex + 1 !== perguntas.length) setRespostaSelecionada(null);
      }, 600);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não carregado.",
        variant: "destructive",
      });
      return;
    }

    updateFormData({
      ageRange: getFaixaFromString(faixaSelecionada) ?? "",
    });

    // small timeout to ensure state is updated
    setTimeout(() => {
      savePortage(user.id);
    }, 0);
  };

  if (fetchLoading) {
    return (
      <main className="flex-1 p-6">
        <div>Carregando...</div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-6">
      <div className={`${openQuestions ? "hidden" : "block"}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={back}>
              Voltar
            </Button>
          </div>
        </div>
        <div
          className={`grid grid-cols-3 gap-8 max-w-[80rem] mx-auto mt-12 transition-opacity duration-300`}
        >
          <Card
            key="0-1"
            className={`shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1`}
            onClick={() => {
              setOpenQuestions(true);
              setFaixaSelecionada("0-1");
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
            className={`shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1`}
            onClick={() => {
              setOpenQuestions(true);
              setFaixaSelecionada("1-2");
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
            className={`shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1`}
            onClick={() => {
              setOpenQuestions(true);
              setFaixaSelecionada("2-3");
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
            className={`shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1`}
            onClick={() => {
              setOpenQuestions(true);
              setFaixaSelecionada("3-4");
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
            className={`shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1`}
            onClick={() => {
              setOpenQuestions(true);
              setFaixaSelecionada("4-5");
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
          <Card
            key="5-6"
            className={`shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1`}
            onClick={() => {
              setOpenQuestions(true);
              setFaixaSelecionada("5-6");
            }}
          >
            <CardHeader className="flex flex-col items-center">
              <GraduationCap className="h-16 w-16 border bg-blue-500 text-white rounded-full p-4 mb-4" />
              <CardTitle>5 a 6 anos</CardTitle>
              <CardDescription className="text-base text-center">
                Prontidão escolar e habilidades avançadas
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center mt-2">
              <span className="py-0.5 px-20 border rounded-2xl bg-gray-200 text-sm">
                {portageData["5-6"].length} avaliações
              </span>
            </CardContent>
          </Card>
          <Card
            key="7-mais"
            className={`shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_12px_40px_rgb(0,0,0,0.15)] transition-all duration-300 transform hover:-translate-y-1`}
            onClick={() => {
              setOpenQuestions(true);
              setFaixaSelecionada("7-mais");
            }}
          >
            <CardHeader className="flex flex-col items-center">
              <GraduationCap className="h-16 w-16 border bg-blue-500 text-white rounded-full p-4 mb-4" />
              <CardTitle>7+ anos</CardTitle>
              <CardDescription className="text-base text-center">
                Prontidão escolar e habilidades avançadas
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center mt-2">
              <span className="py-0.5 px-20 border rounded-2xl bg-gray-200 text-sm">
                {portageData["7-mais"].length} avaliações
              </span>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className={`${openQuestions ? "block" : "hidden"}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setOpenQuestions(false);
                setRespostaSelecionada(null);
                updateFormData({ responses: {} });
              }}
            >
              Voltar
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-center">
          {faixaSelecionada &&
            portageData[faixaSelecionada] &&
            (() => {
              const perguntas = portageData[faixaSelecionada];
              const pergunta = perguntas[currentIndex];

              if (!pergunta) return null;

              return (
                <Card className="w-[850px]" key={currentIndex}>
                  <CardHeader className="text-brand-navy">
                    <CardTitle className="uppercase text-xl font-semibold">
                      {pergunta.category}
                    </CardTitle>
                    <CardDescription className="text-brand-navy font-medium">
                      Pergunta {currentIndex + 1} de{" "}
                      {portageData[faixaSelecionada].length}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-medium tracking-tighter text-blue-900">
                      {pergunta.question}
                    </div>
                    <div className="mt-6 space-y-4">
                      <div
                        onClick={() =>
                          handleResposta("Ainda Não", pergunta.category)
                        }
                        className={`flex items-center gap-4 border-2 rounded-lg p-4 hover:cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                          (respostaSelecionada ?? respostaAnterior) ===
                          "Ainda Não"
                            ? `bg-red-50 border-red-400`
                            : "border-gray-200 hover:border-red-400"
                        }`}
                      >
                        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                          <X className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-700 uppercase">
                            Ainda não
                          </h3>
                          <p className="text-gray-600 text-base">
                            A criança ainda não demonstra esta habilidade
                          </p>
                        </div>
                      </div>
                      <div
                        onClick={() =>
                          handleResposta("Com Mediação", pergunta.category)
                        }
                        className={`flex items-center gap-4 border-2 rounded-lg p-4 hover:cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                          (respostaSelecionada ?? respostaAnterior) ===
                          "Com Mediação"
                            ? `bg-yellow-50 border-yellow-400`
                            : "border-gray-200 hover:border-yellow-400"
                        }`}
                      >
                        <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Hand className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-700 uppercase">
                            Sim, com mediação
                          </h3>
                          <p className="text-gray-600 text-base">
                            A criança demonstra a habilidade com ajuda
                          </p>
                        </div>
                      </div>
                      <div
                        onClick={() =>
                          handleResposta("Sozinho", pergunta.category)
                        }
                        className={`flex items-center gap-4 border-2 rounded-lg p-4 hover:cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                          (respostaSelecionada ?? respostaAnterior) ===
                          "Sozinho"
                            ? `bg-green-50 border-green-400`
                            : "border-gray-200 hover:green-yellow-400"
                        }`}
                      >
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-gray-700 uppercase">
                            Sim, sozinho
                          </h3>
                          <p className="text-gray-600 text-base">
                            A criança demonstra a habilidade independentemente
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between items-center">
                    <button
                      className={`px-4 py-2 text-sm font-medium bg-gray-200 rounded-md hover:bg-gray-300 ${
                        currentIndex > 0 ? "visible" : "invisible"
                      }`}
                      onClick={() => setCurrentIndex((prev) => prev - 1)}
                    >
                      Anterior
                    </button>

                    <button
                      type="button"
                      onClick={() => setAutoAvancar((prev) => !prev)}
                      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border rounded-md hover:bg-gray-100 ${
                        currentIndex < perguntas.length - 1
                          ? "visible"
                          : "invisible"
                      }`}
                    >
                      {autoAvancar ? (
                        <>
                          <Pause className="w-4 h-4" /> Pausar Auto-Avanço
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" /> Ativar Auto-Avanço
                        </>
                      )}
                    </button>

                    <button
                      className={`px-4 py-2 text-sm font-medium bg-brand-navy text-white rounded-md hover:bg-brand-navy-light ${
                        currentIndex < perguntas.length - 1
                          ? "visible"
                          : "invisible"
                      }`}
                      onClick={() => {
                        setCurrentIndex((prev) => prev + 1);
                        setRespostaSelecionada(null);
                      }}
                      disabled={autoAvancar}
                    >
                      Próxima
                    </button>

                    <button
                      disabled={isSaving}
                      className={`px-4 py-2 text-sm font-medium bg-brand-navy text-white rounded-md hover:bg-brand-navy-light ${
                        currentIndex === perguntas.length - 1
                          ? "block"
                          : "hidden"
                      }`}
                      onClick={handleSubmit}
                    >
                      {isSaving ? "Salvando..." : "Finalizar Avaliação"}
                    </button>
                  </CardFooter>
                </Card>
              );
            })()}
        </div>
      </div>
    </main>
  );
}
