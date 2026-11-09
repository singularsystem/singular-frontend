"use client";
import { EscalaPortage } from "@/types/portage";
import {
  RelatorioAssistenteSocial,
  RelatorioPsicologico,
  RelatorioPsicopedagogico,
} from "@/types/relatorio";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { estados, faixasEtarias } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function idadeDentroDaFaixa(idade: number, faixa: string): boolean {
  const match = faixa.match(/(\d+)\s*a\s*(\d+)\s*(anos|ano|meses|mês)?/i);
  if (!match) return false;

  const inicio = parseInt(match[1]);
  const fim = parseInt(match[2]);
  const unidade = match[3]?.toLowerCase() || "anos";

  if (unidade.includes("mes")) {
    return idade >= inicio / 12 && idade <= fim / 12;
  }

  return idade >= inicio && idade < fim;
}

export function obterMaiorIdadeMaxima(data: EscalaPortage): number {
  let maiorIdade = 0;

  for (const area of Object.values(data)) {
    for (const faixa of Object.keys(area)) {
      const match = faixa.match(/(\d+)\s*a\s*(\d+)\s*(anos|ano|meses|mês)?/i);
      if (!match) continue;

      const fim = parseInt(match[2]);
      const unidade = match[3]?.toLowerCase() || "anos";

      let fimConvertido = unidade.includes("mes") ? fim / 12 : fim;
      if (fimConvertido > maiorIdade) {
        maiorIdade = fimConvertido;
      }
    }
  }

  return maiorIdade;
}

export function getFaixaFromString(range: string): string | undefined {
  if (range === "7-mais") {
    return faixasEtarias.find((f) => f.label.includes("7 anos"))?.label;
  }

  const [minStr, maxStr] = range.split("-").map((v) => parseInt(v, 10));

  return faixasEtarias.find(
    (faixa) => faixa.min >= minStr * 12 && faixa.max <= maxStr * 12 + 11,
  )?.label;
}

export function calcularIdadeEmMeses(dataNascimento: Date): number {
  const hoje = new Date();
  let anos = hoje.getFullYear() - dataNascimento.getFullYear();
  let meses = hoje.getMonth() - dataNascimento.getMonth();

  if (meses < 0) {
    anos--;
    meses += 12;
  }

  return anos * 12 + meses;
}

export function getFaixaEtariaStudent(
  dataNascimento: string | undefined,
): string | null {
  if (dataNascimento === undefined) return null;

  const dateOfBirth = new Date(dataNascimento);
  const idadeMeses = calcularIdadeEmMeses(dateOfBirth);

  const faixa = faixasEtarias.find(
    (f) => idadeMeses >= f.min && idadeMeses < f.max,
  );

  return faixa?.label ?? "Fora da faixa etária";
}

export function maskCPF(value: string): string {
  let v = value.replace(/\D/g, "");

  if (v.length > 3) v = v.replace(/^(\d{3})(\d)/, "$1.$2");
  if (v.length > 6) v = v.replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3");
  if (v.length > 9)
    v = v.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");

  return v.slice(0, 14);
}

export function maskRG(value: string): string {
  let v = value.replace(/\D/g, "");

  if (v.length <= 1) return v;

  if (v.length === 7) {
    v = v.replace(/^(\d{1})(\d{3})(\d{3})$/, "$1.$2.$3");
  } else {
    if (v.length > 1) v = v.replace(/^(\d{2})(\d)/, "$1.$2");
    if (v.length > 5) v = v.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3");
  }

  if (v.length > 8) {
    v = v.replace(/^(\d{1,2})\.(\d{3})\.(\d{3})(\d)/, "$1.$2.$3-$4");
  }

  return v.slice(0, 12);
}

export function maskSUSCard(value: string): string {
  let v = value.replace(/\D/g, "");

  if (v.length > 3) v = v.replace(/^(\d{3})(\d)/, "$1 $2");
  if (v.length > 7) v = v.replace(/^(\d{3}) (\d{4})(\d)/, "$1 $2 $3");
  if (v.length > 11)
    v = v.replace(/^(\d{3}) (\d{4}) (\d{4})(\d)/, "$1 $2 $3 $4");

  return v.slice(0, 18);
}

export function downloadBase64File(
  base64Data: string,
  fileName: string,
  contentType: string = "application/pdf",
) {
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length)
    .fill(0)
    .map((_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: contentType });

  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
}

export function isRelatorioPsicopedagogico(
  relatorio:
    | RelatorioAssistenteSocial
    | RelatorioPsicologico
    | RelatorioPsicopedagogico
    | null,
): relatorio is RelatorioPsicopedagogico {
  return (
    relatorio !== null && "context" in relatorio && "methodology" in relatorio
  );
}

export function isValidDate(dateString: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return false;

  const [year, month, day] = dateString.split("-").map(Number);
  const currentYear = new Date().getFullYear();

  if (year < 1900 || year > currentYear) return false;

  if (month < 1 || month > 12) return false;

  const daysInMonth = new Date(year, month, 0).getDate();

  if (day < 1 || day > daysInMonth) return false;

  const birthDate = new Date(year, month - 1, day);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age >= 18;
}

export function normalizeDateInputValue(
  dateString: string | null | undefined,
): string {
  if (!dateString) return "";

  const trimmedDate = dateString.trim();
  const isoLikeMatch = trimmedDate.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (isoLikeMatch) {
    return `${isoLikeMatch[1]}-${isoLikeMatch[2]}-${isoLikeMatch[3]}`;
  }

  const brDateMatch = trimmedDate.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

  if (brDateMatch) {
    return `${brDateMatch[3]}-${brDateMatch[2]}-${brDateMatch[1]}`;
  }

  return "";
}

export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== "string") return false;

  const trimmedEmail = email.trim();
  if (trimmedEmail.length === 0) return false;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) return false;

  if (trimmedEmail.includes(" ")) return false;

  const domainPart = trimmedEmail.split("@")[1];
  if (!domainPart || domainPart.split(".").length < 2) return false;

  const domainExtension = domainPart.split(".")[1];
  if (!domainExtension || domainExtension.length < 2) return false;

  return true;
}

export function getNomeEstadoPorSigla(
  sigla: string | undefined,
): string | undefined {
  if (sigla != undefined) {
    const estado = estados.find((e) => e.sigla === sigla.toUpperCase());
    return estado?.nome;
  }
  return "";
}

export const normalizeTextForCompare = (value: string | undefined): string => {
  return (value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
};

export function getSiglaEstadoPorNome(
  nome: string | undefined,
): string | undefined {
  if (nome != undefined) {
    const normalizedNome = normalizeTextForCompare(nome);
    const estado = estados.find((e) => {
      if (normalizeTextForCompare(e.sigla) === normalizedNome) return true;
      return normalizeTextForCompare(e.nome) === normalizedNome;
    });
    return estado?.sigla;
  }
  return "";
}

export function getNomeEstadoPorNome(
  nomeOuSigla: string | undefined,
): string | undefined {
  if (nomeOuSigla != undefined) {
    const normalized = normalizeTextForCompare(nomeOuSigla);
    const estado = estados.find((e) => {
      if (normalizeTextForCompare(e.sigla) === normalized) return true;
      return normalizeTextForCompare(e.nome) === normalized;
    });
    return estado?.nome ?? nomeOuSigla;
  }
  return "";
}

export const getPageNumbers = (totalPages: number, currentPage: number) => {
  const pages = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);

    if (currentPage > 3) pages.push("ellipsis");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) pages.push("ellipsis");

    pages.push(totalPages);
  }
  return pages;
};

export function formatList(
  items: string[],
  otherValue?: string,
  otherLabel = ["Outro", "Outra", "Outros", "Outras"],
) {
  const otherSet = new Set(
    otherLabel.map((l) => l.trim().toLowerCase()).filter(Boolean),
  );
  const otherText = (otherValue ?? "").trim();

  const mapped = (items ?? [])
    .filter((i) => typeof i === "string" && i.trim() !== "")
    .map((item) => {
      const normalized = item.trim().toLowerCase();

      if (otherSet.has(normalized) && otherText) {
        return `${item}: ${otherText}`.toLowerCase();
      }

      return item.toLowerCase();
    });

  if (mapped.length === 0) return "";

  if (mapped.length === 1) return mapped[0];

  if (mapped.length === 2) return `${mapped[0]} e ${mapped[1]}`;

  return `${mapped.slice(0, -1).join(", ")} e ${mapped[mapped.length - 1]}`;
}

export function formatOther(
  value?: string,
  otherValue?: string,
  otherLabel = ["Outro", "Outra", "Outros", "Outras"],
) {
  if (!value) return "";

  const otherSet = new Set(
    otherLabel.map((l) => l.trim().toLowerCase()).filter(Boolean),
  );
  const normalizedValue = value.trim().toLowerCase();
  const otherText = (otherValue ?? "").trim();

  if (otherSet.has(normalizedValue) && otherText) {
    return otherText.toLowerCase();
  }

  return value.toLowerCase();
}

export function formatHealthConditions(
  conditions: string[] = [],
  otherCondition?: string,
) {
  if (conditions.length === 0 || conditions.includes("Não")) {
    return "O(a) aluno(a) não apresenta condições de saúde significativas.";
  }

  const otherSet = new Set(["outro", "outra", "outros", "outras"]);
  const hasOther = conditions.some((c) => otherSet.has(c.trim().toLowerCase()));

  const mapped = conditions
    .filter(
      (c) =>
        !otherSet.has(c.trim().toLowerCase()) &&
        c.trim().toLowerCase() !== "não apresenta",
    )
    .map((c) => c.toLowerCase());

  if (hasOther && otherCondition) {
    mapped.push(otherCondition.toLowerCase());
  }

  if (mapped.length === 0) {
    return "O(a) aluno(a) apresenta condições de saúde.";
  }

  const formatted =
    mapped.length === 1
      ? mapped[0]
      : mapped.length === 2
        ? `${mapped[0]} e ${mapped[1]}`
        : `${mapped.slice(0, -1).join(", ")} e ${mapped[mapped.length - 1]}`;

  return `O(a) aluno(a) apresenta condições de saúde, como ${formatted}.`;
}

export function formatContinuousMedication(
  choice?: string,
  details?: string,
  other?: string,
) {
  if (choice === "Não" || !choice) {
    return "Quanto à medicação, o(a) aluno(a) não faz uso de medicação contínua.";
  }

  if (choice === "Sim" && details) {
    return `Quanto à medicação, o(a) aluno(a) faz uso de medicação contínua, sendo: ${details.toLowerCase()}.`;
  }

  if (choice === "Outra" && other) {
    return `Quanto à medicação, o(a) aluno(a) faz uso de medicação contínua, sendo: ${other.toLowerCase()}.`;
  }

  return "Quanto à medicação, há registro de uso de medicação contínua.";
}

export function uniqueStrings(arr: string[]) {
  return Array.from(new Set(arr.map((s) => s.trim()))).filter(Boolean);
}
