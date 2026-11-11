"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  ShieldCheck,
  FileText,
  GraduationCap,
  Building2,
  Landmark,
  Gift,
  BookOpen,
  ArrowRight,
  Lock,
  Check,
  Award,
  HeartHandshake,
  QrCode,
  FileCheck2,
  BrainCircuit,
  MessageSquare,
  ArrowUp,
} from "lucide-react";

type BillingCycle = "mensal" | "trimestral" | "anual";

interface SelectedPlanModal {
  open: boolean;
  planName: string;
  planSubtitle: string;
  category: "professor" | "institucional";
  priceText: string;
}

/**
 * Componente utilitário de animação ao rolar a tela (Scroll Reveal)
 */
function RevealOnScroll({
  children,
  className = "",
  delayMs = 0,
  direction = "up",
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  direction?: "up" | "left" | "right" | "scale";
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const hiddenTransform = {
    up: "opacity-0 translate-y-8",
    left: "opacity-0 -translate-x-8",
    right: "opacity-0 translate-x-8",
    scale: "opacity-0 scale-95",
  }[direction];

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delayMs}ms` }}
      className={`transition-all duration-700 ease-out will-change-transform ${
        isVisible
          ? "opacity-100 translate-y-0 translate-x-0 scale-100"
          : hiddenTransform
      } ${className}`}
    >
      {children}
    </div>
  );
}

export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("anual");
  const [audienceFilter, setAudienceFilter] = useState<
    "todos" | "professor" | "institucional"
  >("todos");
  const [isScrolled, setIsScrolled] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [modalState, setModalState] = useState<SelectedPlanModal>({
    open: false,
    planName: "",
    planSubtitle: "",
    category: "professor",
    priceText: "",
  });

  const [leadForm, setLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    professionalsCount: "",
  });
  const [submittedLead, setSubmittedLead] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      setShowBackToTop(window.scrollY > 380);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPrice = (baseMonthly: number) => {
    if (billingCycle === "mensal") {
      return {
        value: baseMonthly.toFixed(2).replace(".", ","),
        period: "/mês",
        note: "Cobrado mensalmente • 7 dias grátis",
      };
    }
    if (billingCycle === "trimestral") {
      const discounted = baseMonthly * 0.92;
      return {
        value: discounted.toFixed(2).replace(".", ","),
        period: "/mês",
        note: "Plano trimestral (8% OFF) • 7 dias grátis",
      };
    }
    // anual
    const discounted = baseMonthly * 0.85;
    return {
      value: discounted.toFixed(2).replace(".", ","),
      period: "/mês",
      note: "Em até 12x no plano anual + Curso Astra + E-book",
    };
  };

  const standardPrice = getPrice(47.9);
  const goldenPrice = getPrice(59.9);

  const handleOpenPlanModal = (
    planName: string,
    planSubtitle: string,
    category: "professor" | "institucional",
    priceText: string
  ) => {
    setSubmittedLead(false);
    setModalState({
      open: true,
      planName,
      planSubtitle,
      category,
      priceText,
    });
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedLead(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-ice text-brand-navy selection:bg-brand-orange selection:text-white overflow-x-hidden">
      {/* HEADER BRANCO LIMPO COM ANIMAÇÃO DE SCROLL E SUBLINHADO ANIMADO */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "backdrop-blur-lg bg-white/95 shadow-md border-b border-slate-200/80 h-16"
            : "bg-white border-b border-slate-100 h-16 sm:h-20"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 h-full flex items-center justify-between gap-2 sm:gap-6">
          <Link
            href="/"
            className="flex items-center shrink-0 transition-transform duration-300 hover:scale-[1.03]"
          >
            <BrandLogo
              bg="light"
              width={175}
              priority
              className="w-[125px] sm:w-[175px]"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-slate-600">
            {[
              { href: "#como-funciona", label: "Como Funciona" },
              { href: "#planos", label: "Planos e Preços", highlight: true },
              { href: "#bonus-exclusivos", label: "Bônus" },
              { href: "#faq", label: "Dúvidas" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`relative py-1 transition-colors duration-200 whitespace-nowrap group ${
                  item.highlight
                    ? "text-brand-navy font-semibold hover:text-brand-orange"
                    : "hover:text-brand-navy"
                }`}
              >
                {item.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-orange transition-all duration-300 group-hover:w-full rounded-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link href="/login">
              <Button
                variant="outline"
                className="h-9 sm:h-10 px-3 sm:px-4 text-xs sm:text-sm border-brand-navy/20 text-brand-navy hover:bg-brand-navy hover:text-white font-medium whitespace-nowrap transition-all duration-300 hover:shadow-sm active:scale-95"
              >
                Entrar
              </Button>
            </Link>
            <a href="#planos">
              <Button className="hover-shine h-9 sm:h-10 px-3 sm:px-5 text-xs sm:text-sm bg-brand-orange hover:bg-brand-orange-dark text-brand-navy font-semibold shadow-md hover:shadow-lg hover:shadow-brand-orange/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 whitespace-nowrap group">
                <span>Ver Planos</span>
                <ArrowRight className="ml-1 sm:ml-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </a>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-brand-navy text-white pt-12 pb-20 lg:pt-16 lg:pb-28">
        {/* Efeitos de luz suaves */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-brand-orange/15 blur-3xl pointer-events-none animate-pulse" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <RevealOnScroll
              direction="left"
              className="lg:col-span-7 space-y-6"
            >
              <div className="inline-flex flex-wrap items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs sm:text-sm hover:bg-white/15 hover:border-brand-orange/40 transition-all duration-300 cursor-default">
                <span className="font-bold text-brand-orange flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 animate-spin [animation-duration:6s]" />
                  Decreto nº 12.773/2025 & BNCC
                </span>
                <span className="text-white/40">•</span>
                <span className="text-white/90 font-medium">
                  Cada forma de aprender é Singular
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-bold leading-[1.12] tracking-tight text-white">
                De <span className="line-through text-slate-400">3 horas</span>{" "}
                para{" "}
                <span className="text-brand-orange underline decoration-brand-orange/40">
                  3 minutos
                </span>{" "}
                na elaboração de Estudo de Caso, PEI, PAEE e PDI.
              </h1>

              <p className="text-base sm:text-lg text-slate-200 max-w-2xl leading-relaxed">
                Menos tempo com papelada, mais tempo com o aluno. O{" "}
                <strong className="text-white">Singular System</strong> utiliza
                Inteligência Artificial especializada em Educação Inclusiva para
                gerar documentos pedagógicos e relatórios multiprofissionais
                com segurança técnica, avaliação fina da BNCC e conformidade
                com o{" "}
                <strong className="text-white">Decreto 12.773/2025</strong>.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-3">
                <a href="#planos" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="hover-shine w-full sm:w-auto h-14 px-8 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-brand-navy font-bold text-base shadow-lg shadow-brand-orange/25 hover:shadow-2xl hover:shadow-brand-orange/40 hover:-translate-y-1 hover:scale-[1.02] active:scale-[0.99] transition-all duration-300 group flex items-center justify-center gap-2"
                  >
                    <span>Escolher meu Plano (7 dias grátis)</span>
                    <ArrowRight className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1.5" />
                  </Button>
                </a>
                <Link href="/login" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto h-14 px-8 rounded-xl border-white/25 bg-white/5 text-white hover:bg-white hover:text-brand-navy hover:shadow-xl font-semibold text-base transition-all duration-300 hover:-translate-y-1 flex items-center justify-center"
                  >
                    Acessar Plataforma
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10 text-left">
                {[
                  {
                    stat: "~3 min",
                    desc: "Por documento gerado com IA",
                    orange: true,
                  },
                  {
                    stat: "100%",
                    desc: "Alinhado à BNCC e Decreto 12.773",
                    orange: false,
                  },
                  {
                    stat: "4 Modos",
                    desc: "Professor, Ouro, Escola e Público",
                    orange: true,
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl transition-all duration-300 hover:bg-white/5 hover:-translate-y-0.5"
                  >
                    <p
                      className={`text-2xl sm:text-3xl font-bold ${
                        item.orange ? "text-brand-orange" : "text-white"
                      }`}
                    >
                      {item.stat}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-300">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </RevealOnScroll>

            {/* CARD VISUAL DA ESTEIRA */}
            <RevealOnScroll
              direction="right"
              delayMs={150}
              className="lg:col-span-5"
            >
              <div className="animate-float-slow bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-5 transition-all duration-500 hover:border-brand-orange/50 hover:bg-white/[0.13] hover:shadow-brand-orange/15">
                <div className="flex items-center justify-between border-b border-white/10 pb-4 group/header">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-brand-orange font-semibold">
                      Fluxo Inteligente Singular
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">
                      Como o sistema protege o seu trabalho
                    </h3>
                  </div>
                  <div className="h-11 w-11 rounded-xl bg-brand-orange/20 border border-brand-orange/30 flex items-center justify-center transition-all duration-300 group-hover/header:scale-110 group-hover/header:rotate-6 group-hover/header:bg-brand-orange group-hover/header:text-brand-navy">
                    <ShieldCheck className="h-6 w-6 text-brand-orange group-hover/header:text-brand-navy shrink-0 transition-colors" />
                  </div>
                </div>

                <div className="space-y-3.5 text-sm">
                  {[
                    {
                      step: "1",
                      title: "Cadastro Autônomo ou Institucional",
                      text: "No modo Professor, você mesmo cadastra seus alunos em um único login. Nos modos Escola e Público, o administrativo gerencia toda a rede.",
                    },
                    {
                      step: "2",
                      title: "Nasce do Estudo de Caso Real",
                      text: "Diferente de IAs genéricas que inventam dados, nosso PEI e PAEE derivam diretamente do Estudo de Caso preenchido.",
                    },
                    {
                      step: "3",
                      title: "PEI, PAEE, PDI e Relatório Biopsicossocial",
                      text: "Exportação imediata em PDF oficial de alta qualidade, com assinatura eletrônica e QR Code de validação.",
                    },
                  ].map((item) => (
                    <div
                      key={item.step}
                      className="group flex items-start gap-3.5 bg-white/5 p-3.5 rounded-xl border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-brand-orange/40 hover:translate-x-1"
                    >
                      <div className="h-7 w-7 rounded-lg bg-brand-orange text-brand-navy font-bold flex items-center justify-center shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110">
                        {item.step}
                      </div>
                      <div>
                        <p className="font-semibold text-white group-hover:text-brand-orange transition-colors">
                          {item.title}
                        </p>
                        <p className="text-slate-300 text-xs mt-0.5">
                          {item.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-brand-orange/15 border border-brand-orange/30 rounded-xl p-4 flex items-center justify-between gap-3 transition-all duration-300 hover:bg-brand-orange/20">
                  <div className="text-xs text-slate-100">
                    <span className="font-bold text-brand-orange block text-sm">
                      Recupere seus finais de semana!
                    </span>
                    Chega de levar burocracia do AEE para casa.
                  </div>
                  <a href="#planos">
                    <Button
                      size="sm"
                      className="bg-brand-orange hover:bg-brand-orange-dark text-brand-navy font-bold transition-transform duration-300 hover:scale-105"
                    >
                      Começar
                    </Button>
                  </a>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* SEÇÃO DE PLANOS E PREÇOS (4 MODALIDADES COM TRAVAS CLARAS) */}
      <section
        id="planos"
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full scroll-mt-16"
      >
        <RevealOnScroll className="text-center max-w-3xl mx-auto space-y-4">
          <Badge className="bg-brand-orange/15 text-brand-link hover:bg-brand-orange/20 border border-brand-orange/30 px-3.5 py-1 text-xs font-semibold">
            ESCOLHA A SUA MODALIDADE DE ACESSO
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy">
            Planos sob medida para Professores, Colégios e Prefeituras
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Selecione o plano ideal para a sua realidade. Nos planos
            individuais, o próprio professor cadastra seus alunos e gera toda a
            documentação pedagógica em um único login.
          </p>
        </RevealOnScroll>

        {/* CONTROLES: CICLO DE PAGAMENTO E FILTRO DE MODALIDADE (LADO A LADO NO DESKTOP, RESPONSIVO NO MOBILE) */}
        <RevealOnScroll
          delayMs={100}
          className="mt-10 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 bg-white p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 shadow-sm"
        >
          {/* Filtro de público */}
          <div className="grid grid-cols-3 sm:flex items-center gap-1 sm:gap-1.5 bg-slate-100 p-1 sm:p-1.5 rounded-xl w-full lg:w-auto justify-center border border-slate-200/80">
            {[
              {
                id: "todos",
                label: "Todas (4)",
                mobileLabel: "Todas (4)",
              },
              {
                id: "professor",
                label: "Modalidade Professor",
                mobileLabel: "Professor",
              },
              {
                id: "institucional",
                label: "Escolas & Prefeituras",
                mobileLabel: "Escolas/Público",
              },
            ].map((tab) => {
              const isActive = audienceFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    setAudienceFilter(
                      tab.id as "todos" | "professor" | "institucional"
                    )
                  }
                  className={`px-2 sm:px-3.5 py-2 rounded-lg text-[11px] sm:text-sm font-semibold whitespace-nowrap text-center transition-all duration-300 ${
                    isActive
                      ? "bg-brand-navy text-white shadow-sm"
                      : "bg-white text-slate-600 border border-slate-200/80 hover:text-brand-navy hover:border-slate-300"
                  }`}
                >
                  <span className="sm:hidden">{tab.mobileLabel}</span>
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Seletor de Ciclo */}
          <div className="grid grid-cols-3 sm:flex items-center gap-1 sm:gap-1.5 bg-slate-100 p-1 sm:p-1.5 rounded-xl w-full lg:w-auto justify-center border border-slate-200/80">
            <button
              type="button"
              onClick={() => setBillingCycle("mensal")}
              className={`px-2 sm:px-3.5 py-2 rounded-lg text-[11px] sm:text-sm font-semibold whitespace-nowrap text-center transition-all duration-300 ${
                billingCycle === "mensal"
                  ? "bg-brand-navy text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200/80 hover:text-brand-navy hover:border-slate-300"
              }`}
            >
              Mensal
            </button>

            <button
              type="button"
              onClick={() => setBillingCycle("trimestral")}
              className={`px-2 sm:px-3.5 py-2 rounded-lg text-[11px] sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 flex items-center justify-center gap-1 sm:gap-1.5 ${
                billingCycle === "trimestral"
                  ? "bg-brand-navy text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200/80 hover:text-brand-navy hover:border-slate-300"
              }`}
            >
              <span>Trimestral</span>
              <span
                className={`text-[10px] sm:text-[11px] px-1 sm:px-1.5 py-0.5 rounded font-bold ${
                  billingCycle === "trimestral"
                    ? "bg-brand-orange text-brand-navy"
                    : "bg-slate-100 text-slate-700"
                }`}
              >
                -8%
              </span>
            </button>

            <button
              type="button"
              onClick={() => setBillingCycle("anual")}
              className={`px-2 sm:px-3.5 py-2 rounded-lg text-[11px] sm:text-sm font-semibold whitespace-nowrap transition-all duration-300 flex items-center justify-center gap-1 sm:gap-1.5 ${
                billingCycle === "anual"
                  ? "bg-brand-orange text-brand-navy shadow-sm ring-2 ring-brand-orange/30"
                  : "bg-white text-slate-700 border border-slate-200/80 hover:text-brand-navy hover:border-brand-orange/50"
              }`}
            >
              <span>Anual (-15%)</span>
              <span
                className={`hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${
                  billingCycle === "anual"
                    ? "bg-brand-navy text-white"
                    : "bg-brand-orange/20 text-brand-link"
                }`}
              >
                + Curso & E-book
              </span>
            </button>
          </div>
        </RevealOnScroll>

        {/* GRADE DOS 4 PLANOS */}
        <div
          className={`mt-10 grid grid-cols-1 gap-6 ${
            audienceFilter === "todos"
              ? "md:grid-cols-2 xl:grid-cols-4"
              : "md:grid-cols-2 max-w-4xl mx-auto"
          }`}
        >
          {/* PLANO 1: STANDARD / PRÓ (PROFESSOR) */}
          {(audienceFilter === "todos" || audienceFilter === "professor") && (
            <RevealOnScroll delayMs={50} className="h-full">
              <div className="group h-full bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-brand-navy/30 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between p-6 relative">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md transition-colors group-hover:bg-brand-navy group-hover:text-white">
                      <GraduationCap className="h-3.5 w-3.5" />
                      Modalidade Professor
                    </span>
                    <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      1 Login Individual
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-brand-navy">
                    Padrão Standard{" "}
                    <span className="text-sm font-medium text-slate-500">
                      (Plano Pró)
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 min-h-[34px]">
                    Ideal para o professor autônomo organizar sua turma com cota
                    controlada de documentos e alunos.
                  </p>

                  <div className="my-5 pb-5 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-semibold text-slate-500">
                        R$
                      </span>
                      <span className="text-4xl font-extrabold text-brand-navy transition-transform duration-300 group-hover:scale-105 origin-left">
                        {standardPrice.value}
                      </span>
                      <span className="text-sm text-slate-500">
                        {standardPrice.period}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {standardPrice.note}
                    </p>
                  </div>

                  <div className="space-y-2.5 text-xs sm:text-sm">
                    <p className="font-semibold text-brand-navy text-xs uppercase tracking-wider">
                      O que está liberado:
                    </p>
                    <ul className="space-y-2.5 text-slate-700">
                      <li className="flex items-start gap-2.5 transition-transform duration-200 hover:translate-x-1">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110" />
                        <span>
                          <strong>Até 12 alunos ativos</strong> (cota controlada
                          de documentos)
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5 transition-transform duration-200 hover:translate-x-1">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110" />
                        <span>
                          <strong>Cadastro autônomo:</strong> você mesmo
                          cadastra seus alunos e dados
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5 transition-transform duration-200 hover:translate-x-1">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110" />
                        <span>
                          <strong>Estudo de Caso</strong> completo + geração de{" "}
                          <strong>PEI, PAEE e PDI</strong> com IA
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5 transition-transform duration-200 hover:translate-x-1">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110" />
                        <span>
                          Avaliação curricular fina da <strong>BNCC</strong> e
                          Decreto 12.773/2025
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5 transition-transform duration-200 hover:translate-x-1">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110" />
                        <span>
                          Exportação em PDF oficial pronto para assinatura
                        </span>
                      </li>
                    </ul>

                    <div className="pt-3 mt-3 border-t border-slate-100">
                      <p className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider mb-2">
                        Travas desta modalidade:
                      </p>
                      <ul className="space-y-2 text-slate-400 text-xs">
                        <li className="flex items-start gap-2">
                          <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>
                            Não inclui Relatório Biopsicossocial (exclusivo
                            Escola/Público)
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>Acesso restrito a 1 login e senha</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Button
                    onClick={() =>
                      handleOpenPlanModal(
                        "Padrão Standard (Plano Pró)",
                        "Modalidade Professor Individual • Até 12 alunos",
                        "professor",
                        `R$ ${standardPrice.value}${standardPrice.period}`
                      )
                    }
                    className="hover-shine w-full h-12 px-4 rounded-xl bg-brand-navy hover:bg-brand-orange hover:text-brand-navy text-white text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center text-center"
                  >
                    Testar 7 Dias Grátis
                  </Button>
                </div>
              </div>
            </RevealOnScroll>
          )}

          {/* PLANO 2: GOLDEN / ESPECIALISTA (PROFESSOR - DESTAQUE) */}
          {(audienceFilter === "todos" || audienceFilter === "professor") && (
            <RevealOnScroll delayMs={150} className="h-full">
              <div className="group h-full bg-white rounded-2xl border-2 border-brand-orange shadow-xl hover:shadow-2xl hover:shadow-brand-orange/20 hover:-translate-y-2.5 transition-all duration-300 flex flex-col justify-between p-6 relative ring-4 ring-brand-orange/10">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-orange text-brand-navy text-[11px] font-extrabold uppercase tracking-wider px-4 py-1 rounded-full shadow-sm whitespace-nowrap transition-transform duration-300 group-hover:scale-105">
                  ★ Mais Escolhido pelos Professores
                </div>

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3 mt-1">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-link bg-brand-orange/15 px-2.5 py-1 rounded-md">
                      <Award className="h-3.5 w-3.5 text-brand-orange" />
                      Modalidade Professor
                    </span>
                    <span className="text-xs font-semibold text-brand-navy bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                      1 Login Individual
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-brand-navy">
                    Padrão Golden{" "}
                    <span className="text-sm font-medium text-brand-link">
                      (Especialista Ouro)
                    </span>
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 min-h-[34px]">
                    Liberdade total com geração ilimitada de Estudos de Caso,
                    PEI e PAEE + Atividades Adaptadas por IA.
                  </p>

                  <div className="my-5 pb-5 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-sm font-semibold text-slate-500">
                        R$
                      </span>
                      <span className="text-4xl font-extrabold text-brand-navy transition-transform duration-300 group-hover:scale-105 origin-left">
                        {goldenPrice.value}
                      </span>
                      <span className="text-sm text-slate-500">
                        {goldenPrice.period}
                      </span>
                    </div>
                    <p className="text-[11px] text-brand-link font-medium mt-1">
                      {goldenPrice.note}
                    </p>
                  </div>

                  <div className="space-y-2.5 text-xs sm:text-sm">
                    <p className="font-semibold text-brand-navy text-xs uppercase tracking-wider">
                      Tudo do Standard, mais:
                    </p>
                    <ul className="space-y-2.5 text-slate-700">
                      <li className="flex items-start gap-2.5 transition-transform duration-200 hover:translate-x-1">
                        <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110" />
                        <span>
                          <strong>
                            Estudos de Caso, PEI e PAEE Ilimitados
                          </strong>{" "}
                          (suporte a até 30 alunos ativos simultâneos)
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5 transition-transform duration-200 hover:translate-x-1">
                        <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110" />
                        <span>
                          <strong>Cadastro autônomo completo:</strong> gerencie
                          seus alunos e pareceres sem depender de gestor
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5 transition-transform duration-200 hover:translate-x-1">
                        <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110" />
                        <span>
                          <strong>Geração de Atividades Adaptadas por IA</strong>{" "}
                          e acompanhamento de evolução no PDI
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5 transition-transform duration-200 hover:translate-x-1">
                        <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110" />
                        <span>
                          Acesso à <strong>Comunidade Exclusiva</strong> de
                          Professores de AEE
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5 transition-transform duration-200 hover:translate-x-1">
                        <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0 mt-0.5 transition-transform duration-200 group-hover:scale-110" />
                        <span>
                          <strong>Bônus Inclusos (Anual/À vista):</strong> Curso
                          Plataforma Astra + E-book Prático
                        </span>
                      </li>
                    </ul>

                    <div className="pt-3 mt-3 border-t border-slate-100">
                      <p className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider mb-2">
                        Travas desta modalidade:
                      </p>
                      <ul className="space-y-2 text-slate-400 text-xs">
                        <li className="flex items-start gap-2">
                          <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>
                            Não inclui Relatório Biopsicossocial (exclusivo
                            Escola/Público)
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Lock className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>Uso individual em 1 login e senha</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Button
                    onClick={() =>
                      handleOpenPlanModal(
                        "Padrão Golden (Especialista Ouro)",
                        "Modalidade Professor Ilimitado • PEI, PAEE e Estudo de Caso",
                        "professor",
                        `R$ ${goldenPrice.value}${goldenPrice.period}`
                      )
                    }
                    className="hover-shine w-full h-12 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-brand-navy text-sm font-bold shadow-md hover:shadow-xl hover:shadow-brand-orange/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 group/btn flex items-center justify-center gap-2 text-center"
                  >
                    <span>Assinar Golden (7 Dias Grátis)</span>
                    <ArrowRight className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover/btn:translate-x-1.5" />
                  </Button>
                </div>
              </div>
            </RevealOnScroll>
          )}

          {/* PLANO 3: MÓDULO EMPRESA (COLÉGIOS E CLÍNICAS) */}
          {(audienceFilter === "todos" ||
            audienceFilter === "institucional") && (
            <RevealOnScroll delayMs={250} className="h-full">
              <div className="group h-full bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-400 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between p-6 relative">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                      <Building2 className="h-3.5 w-3.5" />
                      Módulo Empresa
                    </span>
                    <span className="text-xs font-medium text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-full">
                      Múltiplas Senhas
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-brand-navy">
                    Colégios & Clínicas
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 min-h-[34px]">
                    Gestão multiprofissional para escolas privadas com liberação
                    de senhas por perfil profissional.
                  </p>

                  <div className="my-5 pb-5 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-brand-navy">
                        Sob Medida
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Pacote de licenças conforme nº de profissionais da escola
                    </p>
                  </div>

                  <div className="space-y-2.5 text-xs sm:text-sm">
                    <p className="font-semibold text-brand-navy text-xs uppercase tracking-wider">
                      Arquitetura Multiprofissional:
                    </p>
                    <ul className="space-y-2.5 text-slate-700">
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>
                          <strong>Múltiplos Logins Liberados:</strong>{" "}
                          Administrativo, Professores, Psicólogos e
                          Psicopedagogos
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>
                          <strong>Perfil Administrativo:</strong> cadastra a
                          escola, os alunos e vincula o corpo docente
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>
                          <strong>Perfil Professor:</strong> acessa Estudo de
                          Caso, PEI, PAEE e PDI dos alunos vinculados
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>
                          <strong>Relatório Biopsicossocial Flexível:</strong>{" "}
                          composto por{" "}
                          <strong>Psicólogo e/ou Psicopedagogo</strong>{" "}
                          (adaptado aos profissionais que a escola possui)
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                        <span>
                          Escalas diagnósticas integradas (CARS, M-CHAT e
                          SNAP-IV)
                        </span>
                      </li>
                    </ul>

                    <div className="pt-3 mt-3 border-t border-slate-100">
                      <p className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider mb-2">
                        Configuração específica da modalidade:
                      </p>
                      <ul className="space-y-2 text-slate-500 text-xs">
                        <li className="flex items-start gap-2">
                          <XCircle className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                          <span>
                            <strong>Sem Assistente Social:</strong> relatório
                            formado exclusivamente pela equipe clínica escolar
                            (Psicólogo + Psicopedagogo)
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Button
                    variant="outline"
                    onClick={() =>
                      handleOpenPlanModal(
                        "Módulo Empresa (Colégios & Clínicas)",
                        "Múltiplas Senhas • Administrativo + Professores + Psicólogo/Psicopedagogo",
                        "institucional",
                        "Plano Institucional Sob Medida"
                      )
                    }
                    className="hover-shine w-full h-12 px-4 rounded-xl border-2 border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white text-sm font-semibold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center text-center"
                  >
                    Configurar Acessos da Escola
                  </Button>
                </div>
              </div>
            </RevealOnScroll>
          )}

          {/* PLANO 4: MÓDULO PÚBLICO (PREFEITURAS E ESTADOS) */}
          {(audienceFilter === "todos" ||
            audienceFilter === "institucional") && (
            <RevealOnScroll delayMs={350} className="h-full">
              <div className="group h-full bg-brand-navy text-white rounded-2xl border border-brand-navy-light shadow-lg hover:shadow-2xl hover:border-brand-orange/60 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between p-6 relative">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brand-orange bg-white/10 px-2.5 py-1 rounded-md transition-colors group-hover:bg-brand-orange group-hover:text-brand-navy">
                      <Landmark className="h-3.5 w-3.5" />
                      Módulo Público
                    </span>
                    <span className="text-xs font-medium text-slate-200 bg-white/10 px-2.5 py-0.5 rounded-full">
                      Rede Completa
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white">
                    Prefeituras & Estado
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 min-h-[34px]">
                    Espelho integral da arquitetura municipal para Secretarias
                    de Educação e redes públicas de ensino.
                  </p>

                  <div className="my-5 pb-5 border-b border-white/10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-extrabold text-brand-orange">
                        Gestão em Rede
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1">
                      Licenciamento para Secretarias Municipais e Estaduais
                    </p>
                  </div>

                  <div className="space-y-2.5 text-xs sm:text-sm">
                    <p className="font-semibold text-brand-orange text-xs uppercase tracking-wider">
                      Escopo Completo Obrigatório:
                    </p>
                    <ul className="space-y-2.5 text-slate-200">
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                        <span>
                          <strong>Hierarquia Completa de Senhas:</strong>{" "}
                          Secretário(a), Gestor Municipal, Diretores,
                          Coordenadores e Professores
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                        <span>
                          <strong>Relatório Biopsicossocial Tríplice:</strong>{" "}
                          obrigatoriamente composto pelos{" "}
                          <strong>
                            3 profissionais (Psicólogo + Psicopedagogo +
                            Assistente Social)
                          </strong>
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                        <span>
                          Carimbo digital multi-assinaturas e{" "}
                          <strong>QR Code de validação pública</strong>
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                        <span>
                          Painel de estatísticas e indicadores da rede de
                          educação especial
                        </span>
                      </li>
                      <li className="flex items-start gap-2.5">
                        <CheckCircle2 className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                        <span>
                          Liberação controlada de cotas e credenciais nominais
                          por unidade escolar
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10">
                  <Button
                    onClick={() =>
                      handleOpenPlanModal(
                        "Módulo Gestão Pública (Prefeituras & Estado)",
                        "Rede Completa • Secretário + Escolas + Equipe Tríplice (Psicólogo, Psicopedagogo e Assistente Social)",
                        "institucional",
                        "Licenciamento Público B2G"
                      )
                    }
                    className="hover-shine w-full h-12 px-4 rounded-xl bg-brand-orange hover:bg-brand-orange-dark text-brand-navy text-sm font-bold transition-all duration-300 hover:shadow-xl hover:shadow-brand-orange/30 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center text-center"
                  >
                    Falar com Consultor Público
                  </Button>
                </div>
              </div>
            </RevealOnScroll>
          )}
        </div>

        {/* TABELA RESUMO DAS TRAVAS POR MODALIDADE */}
        <RevealOnScroll
          delayMs={150}
          className="mt-14 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
        >
          <div className="p-6 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-brand-navy">
                Comparativo Técnico das Travas do Sistema por Modalidade
              </h3>
              <p className="text-xs sm:text-sm text-slate-600">
                Entenda exatamente o que cada perfil pode acessar e cadastrar
                dentro do Singular System.
              </p>
            </div>
            <Badge
              variant="outline"
              className="border-brand-navy/20 text-brand-navy w-fit"
            >
              Regra de Negócio Oficial
            </Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-white text-brand-navy">
                  <th className="py-4 px-5 font-bold">Recurso / Permissão</th>
                  <th className="py-4 px-4 font-bold text-center">
                    Standard (Pró)
                  </th>
                  <th className="py-4 px-4 font-bold text-center bg-brand-orange/5">
                    Golden (Ouro)
                  </th>
                  <th className="py-4 px-4 font-bold text-center">
                    Módulo Empresa (Colégio)
                  </th>
                  <th className="py-4 px-4 font-bold text-center">
                    Módulo Público (Prefeitura)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {[
                  {
                    feature: "Quantidade de Senhas / Logins",
                    standard: "1 Login Individual",
                    golden: "1 Login Individual",
                    empresa: "Múltiplas (definidas pela escola)",
                    publico: "Múltiplas em Rede Municipal/Estadual",
                  },
                  {
                    feature: "Quem cadastra os alunos?",
                    standard: "O próprio Professor",
                    golden: "O próprio Professor",
                    empresa: "Perfil Administrativo da Escola",
                    publico: "Secretaria / Administrativo Escolar",
                  },
                  {
                    feature: "Estudo de Caso, PEI, PAEE e PDI",
                    standard: "Cota Padrão (até 12 alunos)",
                    golden: "Ilimitado (até 30 alunos ativos)",
                    goldenHighlight: true,
                    empresa: "Liberado para os Professores",
                    publico: "Liberado para toda a Rede",
                  },
                  {
                    feature: "Relatório Biopsicossocial",
                    standard: "Não disponível",
                    standardMuted: true,
                    golden: "Não disponível",
                    goldenMuted: true,
                    empresa: "Psicólogo e/ou Psicopedagogo (Modular)",
                    empresaBlue: true,
                    publico: "Completo Obrigatório (Os 3 Profissionais)",
                    publicoGreen: true,
                  },
                  {
                    feature: "Módulo de Assistente Social",
                    standard: "—",
                    standardMuted: true,
                    golden: "—",
                    goldenMuted: true,
                    empresa: "Não incluído na versão Escola",
                    empresaMuted: true,
                    publico: "Obrigatório e Integrado",
                    publicoGreen: true,
                  },
                ].map((row, idx) => (
                  <tr
                    key={idx}
                    className="transition-colors duration-200 hover:bg-brand-ice/80"
                  >
                    <td className="py-3.5 px-5 font-medium">{row.feature}</td>
                    <td
                      className={`py-3.5 px-4 text-center ${
                        row.standardMuted ? "text-slate-400" : ""
                      }`}
                    >
                      {row.standard}
                    </td>
                    <td
                      className={`py-3.5 px-4 text-center bg-brand-orange/5 ${
                        row.goldenHighlight
                          ? "font-bold text-brand-link"
                          : row.goldenMuted
                          ? "text-slate-400"
                          : "font-semibold"
                      }`}
                    >
                      {row.golden}
                    </td>
                    <td
                      className={`py-3.5 px-4 text-center ${
                        row.empresaBlue
                          ? "font-medium text-blue-700"
                          : row.empresaMuted
                          ? "text-slate-400"
                          : ""
                      }`}
                    >
                      {row.empresa}
                    </td>
                    <td
                      className={`py-3.5 px-4 text-center ${
                        row.publicoGreen ? "font-semibold text-emerald-700" : ""
                      }`}
                    >
                      {row.publico}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </RevealOnScroll>
      </section>

      {/* SEÇÃO DE BÔNUS EXCLUSIVOS (PLATAFORMA ASTRA + E-BOOK + INDICAÇÃO) */}
      <section
        id="bonus-exclusivos"
        className="py-16 bg-brand-navy text-white relative overflow-hidden scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <RevealOnScroll className="text-center max-w-3xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-orange text-brand-navy">
              <Gift className="h-3.5 w-3.5" />
              Vantagens Exclusivas de Contratação
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold">
              Assine hoje e destrave Bônus Práticos de Formação em AEE
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Ao escolher o pagamento à vista ou o ciclo anual no site, sua
              conta é vinculada automaticamente aos nossos materiais bônus.
            </p>
          </RevealOnScroll>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bônus 1: Curso Plataforma Astra */}
            <RevealOnScroll delayMs={100} className="h-full">
              <div className="group h-full bg-white/5 border border-white/15 rounded-2xl p-6 flex flex-col justify-between hover:border-brand-orange hover:bg-white/[0.08] hover:-translate-y-2 hover:shadow-xl hover:shadow-brand-orange/10 transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
                    Bônus Pagamento à Vista ou Anual
                  </Badge>
                  <h3 className="text-xl font-bold text-white group-hover:text-brand-orange transition-colors">
                    Curso Completo na Plataforma Astra
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Ganhe acesso imediato ao nosso curso de capacitação prática
                    na <strong className="text-white">Plataforma Astra</strong>,
                    ensinando passo a passo como estruturar Estudos de Caso, PEI
                    e PAEE com excelência técnica.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-brand-orange font-semibold">
                  <span>Integração direta pós-compra</span>
                  <span>100% Gratuito</span>
                </div>
              </div>
            </RevealOnScroll>

            {/* Bônus 2: E-book Exclusivo */}
            <RevealOnScroll delayMs={200} className="h-full">
              <div className="group h-full bg-white/5 border border-white/15 rounded-2xl p-6 flex flex-col justify-between hover:border-brand-orange hover:bg-white/[0.08] hover:-translate-y-2 hover:shadow-xl hover:shadow-brand-orange/10 transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <Badge className="bg-brand-orange/20 text-brand-orange border-brand-orange/30">
                    Exclusivo Modalidade Anual
                  </Badge>
                  <h3 className="text-xl font-bold text-white group-hover:text-brand-orange transition-colors">
                    Curso Astra + E-book Prático de AEE
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Optando pelo plano anual, além do curso na Plataforma Astra,
                    você recebe nosso{" "}
                    <strong className="text-white">
                      E-book Oficial já pronto para download
                    </strong>{" "}
                    com modelos comentados e guia rápido do Decreto 12.773/2025.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-brand-orange font-semibold">
                  <span>Download imediato na conta</span>
                  <span>Incluso no Anual</span>
                </div>
              </div>
            </RevealOnScroll>

            {/* Bônus 3: Programa de Indicação */}
            <RevealOnScroll delayMs={300} className="h-full">
              <div className="group h-full bg-white/5 border border-white/15 rounded-2xl p-6 flex flex-col justify-between hover:border-brand-orange hover:bg-white/[0.08] hover:-translate-y-2 hover:shadow-xl hover:shadow-brand-orange/10 transition-all duration-300">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-orange/20 border border-brand-orange/40 flex items-center justify-center text-brand-orange transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <HeartHandshake className="h-6 w-6" />
                  </div>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                    Programa Indique & Ganhe
                  </Badge>
                  <h3 className="text-xl font-bold text-white group-hover:text-brand-orange transition-colors">
                    Descontos Progressivos entre Professores
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    Compartilhe o Singular System nos seus grupos de educação
                    inclusiva:
                    <br />• <strong>1 indicação:</strong> 25% de desconto
                    <br />• <strong>3 indicações:</strong> 1 mês 100% grátis
                    <br />• <strong>5 indicações:</strong> 50% de desconto na
                    mensalidade.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-brand-orange font-semibold">
                  <span>Para assinantes ativos</span>
                  <span>Benefício cumulativo</span>
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA / ESTEIRA DE DOCUMENTOS */}
      <section
        id="como-funciona"
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-16"
      >
        <RevealOnScroll className="text-center max-w-3xl mx-auto space-y-3">
          <Badge
            variant="outline"
            className="border-brand-navy/20 text-brand-navy"
          >
            ESTEIRA PEDAGÓGICA E CLÍNICA
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-brand-navy">
            Todos os documentos exigidos pela Coordenação e Secretaria
          </h2>
          <p className="text-slate-600">
            Compreenda a diferença entre cada documento gerado pela plataforma e
            em qual plano cada módulo está disponível.
          </p>
        </RevealOnScroll>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: FileText,
              badge: "Todos os Planos",
              badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
              iconClass: "bg-brand-navy text-white",
              title: "1. Estudo de Caso",
              desc: "O alicerce obrigatório segundo o Decreto 12.773/2025. Coleta o histórico, potencialidades e barreiras do aluno para que a IA não invente nenhuma informação.",
            },
            {
              icon: BrainCircuit,
              badge: "Todos os Planos",
              badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
              iconClass: "bg-brand-navy text-white",
              title: "2. PEI (Plano Educacional Individualizado)",
              desc: "Metas curriculares, adaptações razoáveis e avaliação fina das habilidades da BNCC conectadas diretamente ao Estudo de Caso do estudante.",
            },
            {
              icon: FileCheck2,
              badge: "Todos os Planos",
              badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
              iconClass: "bg-brand-navy text-white",
              title: "3. PAEE & PDI",
              desc: "Planejamento do Atendimento Educacional Especializado com cronograma de recursos pedagógicos, metas de desenvolvimento e acompanhamento contínuo de evolução.",
            },
            {
              icon: QrCode,
              badge: "Exclusivo Escola & Público",
              badgeClass: "bg-blue-50 text-blue-800 border-blue-200",
              iconClass: "bg-brand-orange text-brand-navy",
              title: "4. Relatório Biopsicossocial",
              desc: "Consolidação multiprofissional com escalas CARS, M-CHAT e SNAP-IV. Na Escola: Psicólogo e/ou Psicopedagogo. No Público: Psicólogo, Psicopedagogo e Assistente Social.",
              highlightBorder: true,
            },
          ].map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <RevealOnScroll key={idx} delayMs={idx * 100} className="h-full">
                <div
                  className={`group h-full bg-white p-6 rounded-2xl border ${
                    card.highlightBorder
                      ? "border-blue-200"
                      : "border-slate-200"
                  } shadow-sm hover:shadow-xl hover:border-brand-orange/50 hover:-translate-y-2 transition-all duration-300 space-y-3`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl ${card.iconClass} flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3 shadow-sm`}
                  >
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <Badge className={`${card.badgeClass} text-[11px]`}>
                    {card.badge}
                  </Badge>
                  <h3 className="text-lg font-bold text-brand-navy group-hover:text-brand-orange transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </RevealOnScroll>
            );
          })}
        </div>
      </section>

      {/* POR QUE NÃO USAR CHATGPT COMUM / QUEBRA DE OBJEÇÕES */}
      <section
        id="diferenciais"
        className="py-16 bg-white border-y border-slate-200/80 scroll-mt-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <RevealOnScroll direction="left" className="space-y-5">
              <Badge className="bg-brand-orange/15 text-brand-link border-brand-orange/30">
                SEGURANÇA TÉCNICA E JURÍDICA
              </Badge>
              <h2 className="text-2xl sm:text-4xl font-bold text-brand-navy">
                Por que professoras de AEE estão trocando o preenchimento manual
                e o ChatGPT pelo Singular System?
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Sabemos que a maior dor de quem atua no AEE é a falta de tempo e
                o receio de entregar um documento que seja questionado pela
                coordenação pedagógica ou pela Secretaria de Educação.
              </p>

              <div className="space-y-4 pt-2">
                <div className="group flex items-start gap-3.5 p-3.5 rounded-xl transition-all duration-300 hover:bg-red-50/50">
                  <div className="h-8 w-8 rounded-full bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110">
                    <XCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-navy text-sm sm:text-base">
                      O perigo do ChatGPT comum ou planilhas soltas
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Ferramentas genéricas geram o PEI direto sem passar pelo
                      Estudo de Caso, inventam dados clínicos que não foram
                      informados e não possuem rastreabilidade nem formatação
                      oficial.
                    </p>
                  </div>
                </div>

                <div className="group flex items-start gap-3.5 p-3.5 rounded-xl transition-all duration-300 hover:bg-emerald-50/60">
                  <div className="h-8 w-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 transition-transform duration-300 group-hover:scale-110">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-brand-navy text-sm sm:text-base">
                      A garantia do Singular System
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600">
                      Cada plano nasce obrigatoriamente do Estudo de Caso,
                      cruza as habilidades exatas da BNCC e gera um PDF oficial
                      com cabeçalho personalizado, pronto para assinatura em 3
                      minutos.
                    </p>
                  </div>
                </div>
              </div>
            </RevealOnScroll>

            <RevealOnScroll
              direction="right"
              delayMs={150}
              className="bg-brand-ice rounded-2xl p-6 sm:p-8 border border-slate-200 space-y-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <h3 className="text-lg font-bold text-brand-navy">
                Resumo de Economia de Tempo para o Professor
              </h3>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center justify-between transition-transform duration-300 hover:translate-x-1">
                  <div>
                    <p className="text-xs text-slate-500">
                      Método Manual Tradicional
                    </p>
                    <p className="font-bold text-slate-700">
                      10 alunos × 3 horas por documento
                    </p>
                  </div>
                  <span className="text-lg font-extrabold text-red-600">
                    30 horas/mês
                  </span>
                </div>

                <div className="bg-brand-navy text-white p-4 rounded-xl flex items-center justify-between shadow-md transition-all duration-300 hover:translate-x-1 hover:shadow-lg">
                  <div>
                    <p className="text-xs text-brand-orange font-semibold">
                      Com o Singular System
                    </p>
                    <p className="font-bold">
                      10 alunos × 3 minutos por documento
                    </p>
                  </div>
                  <span className="text-lg font-extrabold text-brand-orange">
                    30 minutos/mês
                  </span>
                </div>
              </div>

              <blockquote className="text-xs sm:text-sm italic text-slate-600 border-l-4 border-brand-orange pl-4 py-1">
                &ldquo;Eu não tinha tempo de fazer a documentação com a
                qualidade que o meu aluno merecia sem sacrificar o fim de semana
                com a minha família. Hoje entrego tudo em minutos e com total
                segurança diante da coordenação.&rdquo;
              </blockquote>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* FAQ / PERGUNTAS FREQUENTES */}
      <section
        id="faq"
        className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto scroll-mt-16"
      >
        <RevealOnScroll className="text-center space-y-3 mb-10">
          <Badge
            variant="outline"
            className="border-brand-navy/20 text-brand-navy"
          >
            TIRE SUAS DÚVIDAS
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-navy">
            Perguntas Frequentes sobre os Planos e Acessos
          </h2>
        </RevealOnScroll>

        <RevealOnScroll delayMs={100}>
          <Accordion
            type="single"
            collapsible
            className="bg-white rounded-2xl border border-slate-200 px-6 divide-y divide-slate-100 shadow-sm"
          >
            <AccordionItem value="item-1" className="border-none">
              <AccordionTrigger className="text-left font-semibold text-brand-navy hover:text-brand-orange hover:no-underline py-5 transition-colors">
                1. Na modalidade Professor (Standard ou Golden), eu mesmo
                consigo cadastrar meus alunos?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-sm leading-relaxed pb-5">
                Sim! Tanto no plano <strong>Standard (Pró)</strong> quanto no{" "}
                <strong>Golden (Especialista)</strong>, você recebe um login e
                senha individual onde você mesmo cadastra seus alunos, insere
                todos os dados e elabora o Estudo de Caso, o PEI, o PAEE e o PDI
                com total autonomia, sem depender de um gestor ou secretaria.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-none">
              <AccordionTrigger className="text-left font-semibold text-brand-navy hover:text-brand-orange hover:no-underline py-5 transition-colors">
                2. Por que o Relatório Biopsicossocial não aparece nos planos
                individuais de Professor?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-sm leading-relaxed pb-5">
                O Relatório Biopsicossocial exige atuação e assinatura de equipe
                multiprofissional (Psicologia, Psicopedagogia e/ou Serviço
                Social). Por isso, ele fica habilitado exclusivamente no{" "}
                <strong>Módulo Empresa (Colégios/Clínicas)</strong> — onde pode
                ser gerado com Psicólogo e/ou Psicopedagogo — e no{" "}
                <strong>Módulo Público (Prefeituras/Estado)</strong>, onde
                obrigatoriamente contempla os 3 profissionais.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="border-none">
              <AccordionTrigger className="text-left font-semibold text-brand-navy hover:text-brand-orange hover:no-underline py-5 transition-colors">
                3. Como funciona a liberação de senhas quando um Colégio ou
                Prefeitura contrata o sistema?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-sm leading-relaxed pb-5">
                Após a contratação do módulo Empresarial ou Público, a
                instituição informa a quantidade e os nomes da equipe
                (Administrativo, Professores, Psicólogos, Psicopedagogos e, no
                caso público, Secretário e Assistentes Sociais). Nós liberamos o
                pacote de acessos nominais e o perfil Administrativo da escola
                passa a gerenciar o cadastro de unidades, alunos e professores.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="border-none">
              <AccordionTrigger className="text-left font-semibold text-brand-navy hover:text-brand-orange hover:no-underline py-5 transition-colors">
                4. Como recebo o Curso na Plataforma Astra e o E-book de bônus?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-sm leading-relaxed pb-5">
                Assim que o pagamento é confirmado no checkout (pagamento à
                vista para o Curso na Plataforma Astra, ou assinatura Anual para
                o Curso Astra + E-book exclusivo), você recebe automaticamente
                no seu e-mail de boas-vindas as credenciais de acesso e o link
                para download do livro digital.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="border-none">
              <AccordionTrigger className="text-left font-semibold text-brand-navy hover:text-brand-orange hover:no-underline py-5 transition-colors">
                5. Os documentos gerados seguem o Decreto 12.773/2025?
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 text-sm leading-relaxed pb-5">
                Sim. Toda a arquitetura do Singular System foi desenhada para
                que o PEI e o PAEE nasçam do Estudo de Caso e contemplem a
                avaliação curricular fina da BNCC, garantindo total respaldo
                técnico perante a coordenação escolar e as Secretarias de
                Educação.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </RevealOnScroll>
      </section>

      {/* RODAPÉ INSTITUCIONAL */}
      <footer className="bg-brand-navy text-white border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-white/10">
            <div className="md:col-span-2 space-y-3">
              <BrandLogo bg="dark" width={180} />
              <p className="text-xs sm:text-sm text-slate-300 max-w-md leading-relaxed">
                Singular System — Gestão Especializada em Atendimento
                Educacional Especializado (AEE). Menos tempo com papelada, mais
                tempo com o aluno.
              </p>
            </div>

            <div className="space-y-2 text-sm">
              <p className="font-bold text-brand-orange uppercase text-xs tracking-wider">
                Acesso Rápido
              </p>
              <ul className="space-y-2 text-slate-300 text-xs sm:text-sm">
                <li>
                  <a
                    href="#planos"
                    className="hover:text-brand-orange transition-colors"
                  >
                    Planos Standard & Golden
                  </a>
                </li>
                <li>
                  <a
                    href="#planos"
                    className="hover:text-brand-orange transition-colors"
                  >
                    Módulo Colégios & Clínicas
                  </a>
                </li>
                <li>
                  <a
                    href="#planos"
                    className="hover:text-brand-orange transition-colors"
                  >
                    Módulo Gestão Pública
                  </a>
                </li>
                <li>
                  <Link
                    href="/validar"
                    className="hover:text-brand-orange transition-colors"
                  >
                    Validar Documento por QR Code
                  </Link>
                </li>
              </ul>
            </div>

            <div className="space-y-2 text-sm">
              <p className="font-bold text-brand-orange uppercase text-xs tracking-wider">
                Área do Assinante
              </p>
              <ul className="space-y-2 text-slate-300 text-xs sm:text-sm">
                <li>
                  <Link
                    href="/login"
                    className="hover:text-brand-orange transition-colors"
                  >
                    Entrar no Sistema
                  </Link>
                </li>
                <li>
                  <Link
                    href="/recuperar-senha"
                    className="hover:text-brand-orange transition-colors"
                  >
                    Recuperar Senha
                  </Link>
                </li>
                <li>
                  <Link
                    href="/termo"
                    className="hover:text-brand-orange transition-colors"
                  >
                    Termos de Uso e LGPD
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>
              © {new Date().getFullYear()} Singular System. Todos os direitos
              reservados.
            </p>
            <p>Cada forma de aprender é Singular.</p>
          </div>
        </div>
      </footer>

      {/* MODAL DE CONTRATAÇÃO / CHECKOUT / ORÇAMENTO */}
      <Dialog
        open={modalState.open}
        onOpenChange={(open) => setModalState((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <Badge className="w-fit mb-2 bg-brand-orange/15 text-brand-link border-brand-orange/30">
              {modalState.category === "professor"
                ? "Assinatura Individual • 7 Dias Grátis"
                : "Cotação de Múltiplas Senhas"}
            </Badge>
            <DialogTitle className="text-xl text-brand-navy">
              {modalState.planName}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-slate-600">
              {modalState.planSubtitle} —{" "}
              <strong className="text-brand-navy">{modalState.priceText}</strong>
            </DialogDescription>
          </DialogHeader>

          {!submittedLead ? (
            <form onSubmit={handleLeadSubmit} className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="lead-name">Nome Completo</Label>
                <Input
                  id="lead-name"
                  required
                  placeholder="Ex: Profª. Maria Clara"
                  value={leadForm.name}
                  onChange={(e) =>
                    setLeadForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="lead-email">Melhor E-mail</Label>
                  <Input
                    id="lead-email"
                    type="email"
                    required
                    placeholder="seu.email@exemplo.com"
                    value={leadForm.email}
                    onChange={(e) =>
                      setLeadForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lead-phone">WhatsApp</Label>
                  <Input
                    id="lead-phone"
                    type="tel"
                    required
                    placeholder="(00) 90000-0000"
                    value={leadForm.phone}
                    onChange={(e) =>
                      setLeadForm((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {modalState.category === "institucional" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="space-y-1.5">
                    <Label htmlFor="lead-org">
                      Nome da Escola ou Prefeitura
                    </Label>
                    <Input
                      id="lead-org"
                      required
                      placeholder="Ex: Colégio Singular / SEC Municipal"
                      value={leadForm.organization}
                      onChange={(e) =>
                        setLeadForm((prev) => ({
                          ...prev,
                          organization: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="lead-count">
                      Qtd. estimada de senhas (Prof./Psic.)
                    </Label>
                    <Input
                      id="lead-count"
                      required
                      placeholder="Ex: 15 professores, 2 psicólogos"
                      value={leadForm.professionalsCount}
                      onChange={(e) =>
                        setLeadForm((prev) => ({
                          ...prev,
                          professionalsCount: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              )}

              {modalState.category === "professor" && (
                <div className="bg-brand-ice p-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 space-y-1">
                  <p className="font-semibold text-brand-navy flex items-center gap-1.5">
                    <Gift className="h-4 w-4 text-brand-orange" />
                    Bônus vinculados à sua escolha:
                  </p>
                  <p>
                    • Acesso imediato ao login individual com cadastro autônomo
                    de alunos.
                  </p>
                  <p>
                    • Pagamento à vista ou anual libera o{" "}
                    <strong>Curso na Plataforma Astra</strong> +{" "}
                    <strong>E-book de AEE</strong>.
                  </p>
                </div>
              )}

              <DialogFooter className="pt-2 flex flex-col sm:flex-row gap-2">
                {modalState.category === "professor" ? (
                  <>
                    <Link href="/cadastro" className="w-full sm:w-auto">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-brand-navy text-brand-navy"
                      >
                        Ir para Cadastro Direto
                      </Button>
                    </Link>
                    <Button
                      type="submit"
                      className="w-full sm:w-auto bg-brand-orange hover:bg-brand-orange-dark text-brand-navy font-bold"
                    >
                      Prosseguir para Pagamento / Teste
                    </Button>
                  </>
                ) : (
                  <Button
                    type="submit"
                    className="w-full bg-brand-orange hover:bg-brand-orange-dark text-brand-navy font-bold"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Solicitar Liberação de Senhas
                  </Button>
                )}
              </DialogFooter>
            </form>
          ) : (
            <div className="py-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                <Check className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-lg text-brand-navy">
                  Solicitação registrada com sucesso!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                  {modalState.category === "professor"
                    ? "Você já pode concluir seu cadastro inicial para acessar a plataforma ou finalizar sua assinatura com os bônus da Plataforma Astra."
                    : "Nossa equipe comercial recebeu os dados da sua instituição para dimensionar a quantidade exata de senhas (Administrativo, Professores e Equipe Multiprofissional)."}
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                <Link href="/cadastro">
                  <Button className="bg-brand-orange hover:bg-brand-orange-dark text-brand-navy font-bold">
                    Concluir Cadastro Agora
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() =>
                    setModalState((prev) => ({ ...prev, open: false }))
                  }
                >
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* BOTÃO FLUTUANTE DISCRETO DE VOLTAR AO TOPO */}
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Voltar ao início da página"
        title="Voltar ao topo"
        className={`fixed bottom-20 right-5 z-40 h-10 w-10 rounded-full bg-brand-navy/85 text-white border border-white/15 shadow-md backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:bg-brand-orange hover:text-brand-navy hover:scale-110 hover:shadow-lg active:scale-95 ${
          showBackToTop
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <ArrowUp className="h-4 w-4" />
      </button>
    </div>
  );
}
