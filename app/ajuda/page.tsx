"use client";

import { useMemo, useState } from "react";
import { FAQ_DATA } from "@/lib/faq-data";
import { FaqPergunta } from "@/types/faq";
import {
  Search,
  X,
  HelpCircle,
  Check,
  Copy,
  ChevronDown,
  Info,
  AlertTriangle,
  FileQuestion,
  RefreshCw,
  LogOut,
  Laptop,
  Wifi,
  UserCheck,
  Send,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

const STOP_WORDS = new Set([
  "de", "do", "da", "dos", "das", "no", "na", "nos", "nas",
  "em", "um", "uma", "os", "as", "que", "meu", "minha",
  "ao", "se", "com", "por", "para", "o", "a", "e",
]);

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

const QUICK_CHIPS = [
  "assinar",
  "senha bloqueada",
  "não vejo alunos",
  "números diferentes",
  "editar relatório",
  "excluir PAEE",
  "planilha",
  "PDF",
];

const STEP_ICONS = [RefreshCw, LogOut, Laptop, Wifi, UserCheck];

export default function AjudaPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("todas");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  // Normalização e busca inteligente
  const normalizedSearch = normalizeText(searchTerm);
  const searchTokens = useMemo(() => {
    return normalizedSearch
      .split(/\s+/)
      .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
  }, [normalizedSearch]);

  const matchesQuestion = (item: FaqPergunta, tokens: string[]) => {
    if (tokens.length === 0) return true;
    const searchableContent = normalizeText(
      `${item.pergunta} ${item.introducao ?? ""} ${(item.passos ?? []).join(" ")} ${item.bom_saber ?? ""} ${item.se_nao_resolver ?? ""} ${item.palavras_chave}`
    );
    return tokens.every((token) => searchableContent.includes(token));
  };

  const matchesQuestionPartial = (item: FaqPergunta, tokens: string[]) => {
    if (tokens.length === 0) return true;
    const searchableContent = normalizeText(
      `${item.pergunta} ${item.introducao ?? ""} ${(item.passos ?? []).join(" ")} ${item.bom_saber ?? ""} ${item.se_nao_resolver ?? ""} ${item.palavras_chave}`
    );
    return tokens.some((token) => searchableContent.includes(token));
  };

  const { filteredQuestions, isPartialMatch } = useMemo(() => {
    let result = FAQ_DATA.perguntas;

    if (selectedCategory !== "todas") {
      result = result.filter((q) => q.categoria === selectedCategory);
    }

    if (searchTokens.length === 0) {
      return { filteredQuestions: result, isPartialMatch: false };
    }

    const exactMatches = result.filter((q) => matchesQuestion(q, searchTokens));
    if (exactMatches.length > 0) {
      return { filteredQuestions: exactMatches, isPartialMatch: false };
    }

    // Fallback: se nenhuma pergunta tem todos os termos, busca as que possuem ao menos um
    if (searchTokens.length > 1) {
      const partialMatches = result.filter((q) => matchesQuestionPartial(q, searchTokens));
      return { filteredQuestions: partialMatches, isPartialMatch: partialMatches.length > 0 };
    }

    return { filteredQuestions: [], isPartialMatch: false };
  }, [selectedCategory, searchTokens]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleChipClick = (term: string) => {
    setSearchTerm(term);
    setSelectedCategory("todas");
  };

  const handleClearSearch = () => {
    setSearchTerm("");
  };

  const handleCopyTicketTemplate = async () => {
    try {
      await navigator.clipboard.writeText(FAQ_DATA.modelo_de_chamado);
      setCopied(true);
      toast({
        title: "Modelo copiado!",
        description: "Cole no WhatsApp ou e-mail de suporte e preencha as informações.",
        variant: "success",
      });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      toast({
        title: "Erro ao copiar",
        description: "Selecione o texto manualmente e copie com Ctrl+C.",
        variant: "destructive",
      });
    }
  };

  // Auto-expandir se a busca retornar até 5 itens
  const isAutoExpanded = (id: string) => {
    if (openItems[id] !== undefined) return openItems[id];
    return searchTokens.length > 0 && filteredQuestions.length <= 5;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 pt-2">
      {/* Header com identidade visual do sistema */}
      <div className="bg-gradient-to-r from-[#111C4E] via-[#0d2a63] to-[#0071CE] text-white rounded-2xl p-6 sm:p-10 shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-cyan-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-cyan-200 text-xs font-semibold uppercase tracking-wider mb-3">
            <HelpCircle className="w-4 h-4 text-[#19D3C5]" />
            {FAQ_DATA.titulo}
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight">
            Como podemos te ajudar hoje?
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-200 leading-relaxed">
            Consulte respostas para as dúvidas mais comuns de acesso, relatórios, assinaturas e regras do sistema antes de abrir um chamado.
          </p>

          {/* Barra de Busca */}
          <div className="mt-6 relative">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 absolute left-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ex.: assinar relatório, senha bloqueada, aluno não aparece..."
                className="w-full pl-12 pr-12 py-3.5 bg-white text-gray-900 rounded-xl shadow-md placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-cyan-300 text-sm sm:text-base transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3.5 p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                  aria-label="Limpar busca"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Chips de Assuntos Frequentes */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-cyan-100 font-medium">Assuntos frequentes:</span>
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip}
                type="button"
                onClick={() => handleChipClick(chip)}
                className="text-xs px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors duration-150 border border-white/20"
              >
                {chip}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Guia Rápido: 5 passos (visível quando não há termo de busca ativo) */}
      {!searchTerm && (
        <section className="bg-white border border-gray-200/80 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-100 text-[#0b6b6f] font-bold text-sm">
              !
            </span>
            <h2 className="text-lg sm:text-xl font-bold text-[#111C4E]">
              Guia rápido: 5 passos antes de pedir ajuda
            </h2>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            Estes passos resolvem a maioria das instabilidades de tela, acesso e pendências de assinatura. Faça na ordem:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {FAQ_DATA.guia_rapido.map((item, index) => {
              const IconComp = STEP_ICONS[index] || RefreshCw;
              return (
                <div
                  key={index}
                  className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex flex-col justify-between hover:border-cyan-200 transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-7 h-7 rounded-full bg-[#111C4E] group-hover:bg-[#0071CE] text-white text-xs font-bold flex items-center justify-center transition-colors">
                        {index + 1}
                      </span>
                      <IconComp className="w-4 h-4 text-gray-400 group-hover:text-[#0071CE] transition-colors" />
                    </div>
                    <h3 className="font-semibold text-sm text-gray-900 mb-1">
                      {item.passo}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed mt-2">
                    {item.detalhe}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Status da busca */}
      {searchTerm && (
        <div className="flex items-center justify-between text-sm text-gray-600 px-1">
          <span>
            {filteredQuestions.length === 0
              ? "Nenhum resultado encontrado."
              : `${filteredQuestions.length} ${
                  filteredQuestions.length === 1 ? "resposta encontrada" : "respostas encontradas"
                }${isPartialMatch ? " (mostrando termos parciais)" : ""}`}
          </span>
          <button
            type="button"
            onClick={handleClearSearch}
            className="text-[#0071CE] text-xs font-semibold hover:underline"
          >
            Limpar filtro de busca
          </button>
        </div>
      )}

      {/* Filtro por Categorias */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory("todas")}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
            selectedCategory === "todas"
              ? "bg-[#111C4E] text-white shadow-sm"
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          Todas as categorias ({FAQ_DATA.perguntas.length})
        </button>
        {FAQ_DATA.categorias.map((cat) => {
          const count = FAQ_DATA.perguntas.filter((q) => q.categoria === cat.id).length;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                isSelected
                  ? "bg-[#111C4E] text-white shadow-sm"
                  : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <span>{cat.titulo}</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full ${
                  isSelected ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Lista de Perguntas (Agrupadas por Categoria) */}
      <div className="space-y-6">
        {FAQ_DATA.categorias
          .filter((cat) =>
            selectedCategory === "todas" ? true : cat.id === selectedCategory
          )
          .map((cat) => {
            const catQuestions = filteredQuestions.filter(
              (q) => q.categoria === cat.id
            );

            if (catQuestions.length === 0) return null;

            return (
              <section key={cat.id} className="space-y-3">
                <div className="flex items-center gap-2 px-1">
                  <h2 className="text-lg font-bold text-[#111C4E]">
                    {cat.titulo}
                  </h2>
                  <span className="text-xs font-semibold text-cyan-800 bg-cyan-100/70 px-2 py-0.5 rounded-full">
                    {catQuestions.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {catQuestions.map((item) => {
                    const isOpen = isAutoExpanded(item.id);

                    return (
                      <div
                        key={item.id}
                        id={item.id}
                        className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                          isOpen
                            ? "border-[#0071CE] shadow-sm"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleItem(item.id)}
                          className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0071CE]"
                          aria-expanded={isOpen}
                        >
                          <span className="font-semibold text-gray-900 text-sm sm:text-base leading-snug">
                            {item.pergunta}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 ${
                              isOpen ? "rotate-180 text-[#0071CE]" : ""
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="px-4 pb-5 sm:px-5 sm:pb-6 pt-0 border-t border-gray-100 text-sm text-gray-700 space-y-4">
                            {item.introducao && (
                              <p className="pt-3 font-normal text-gray-600 leading-relaxed">
                                {item.introducao}
                              </p>
                            )}

                            {item.passos && item.passos.length > 0 && (
                              <ol className="list-decimal pl-5 space-y-2 text-gray-700 pt-1">
                                {item.passos.map((passo, idx) => (
                                  <li key={idx} className="leading-relaxed pl-1">
                                    {passo}
                                  </li>
                                ))}
                              </ol>
                            )}

                            {item.bom_saber && (
                              <div className="bg-[#e2f0f0]/60 border border-[#5cc4c6]/40 rounded-xl p-3.5 text-[#0b6b6f] flex items-start gap-3">
                                <Info className="w-5 h-5 shrink-0 text-[#0b6b6f] mt-0.5" />
                                <div className="text-xs sm:text-sm leading-relaxed">
                                  <strong>Bom saber: </strong>
                                  {item.bom_saber}
                                </div>
                              </div>
                            )}

                            {item.se_nao_resolver && (
                              <div className="bg-amber-50/70 border-l-4 border-amber-500 rounded-r-xl p-3.5 text-amber-900 flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600 mt-0.5" />
                                <div className="text-xs sm:text-sm leading-relaxed">
                                  <strong>Se não resolver: </strong>
                                  {item.se_nao_resolver}
                                </div>
                              </div>
                            )}

                            {/* Seção especial para modelo de chamado caso a pergunta seja de abertura de chamado */}
                            {item.id === "aju-01" && (
                              <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                                    Modelo de chamado padrão
                                  </span>
                                  <button
                                    type="button"
                                    onClick={handleCopyTicketTemplate}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0071CE] hover:bg-[#005fb0] text-white text-xs font-semibold shadow-sm transition-colors"
                                  >
                                    {copied ? (
                                      <>
                                        <Check className="w-3.5 h-3.5" />
                                        Copiado!
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3.5 h-3.5" />
                                        Copiar modelo
                                      </>
                                    )}
                                  </button>
                                </div>
                                <pre className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 text-xs text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                                  {FAQ_DATA.modelo_de_chamado}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
      </div>

      {/* Estado vazio quando nada é encontrado */}
      {filteredQuestions.length === 0 && (
        <div className="bg-white rounded-2xl border border-dashed border-gray-300 p-8 sm:p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-cyan-50 text-[#0071CE] flex items-center justify-center mx-auto">
            <FileQuestion className="w-6 h-6" />
          </div>
          <div className="max-w-md mx-auto">
            <h3 className="text-base font-bold text-gray-900">
              Não encontramos nenhuma resposta para &quot;{searchTerm}&quot;
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Tente palavras mais simples (ex.: &quot;assinar&quot;, &quot;senha&quot;) ou copie o modelo abaixo para falar com o suporte.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleCopyTicketTemplate}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0071CE] hover:bg-[#005fb0] text-white text-xs sm:text-sm font-semibold transition-colors"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? "Modelo de chamado copiado!" : "Copiar modelo de chamado para suporte"}
            </button>
          </div>
        </div>
      )}

      {/* Card Fixo de Suporte ao Final */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1">
          <h3 className="text-base sm:text-lg font-bold text-[#111C4E]">
            Ainda precisa de ajuda?
          </h3>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xl">
            Siga os 5 passos do Guia Rápido. Se a dúvida persistir, copie o modelo de chamado com as informações solicitadas e envie no grupo de suporte.
          </p>
        </div>
        <button
          type="button"
          onClick={handleCopyTicketTemplate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0071CE] to-[#19D3C5] hover:opacity-95 text-white font-medium text-xs sm:text-sm shadow-md shrink-0 transition-opacity"
        >
          {copied ? <Check className="w-4 h-4" /> : <Send className="w-4 h-4" />}
          {copied ? "Modelo copiado!" : "Copiar modelo de chamado"}
        </button>
      </div>
    </div>
  );
}
