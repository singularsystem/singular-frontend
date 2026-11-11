/**
 * Núcleo do codemod de cores legadas (Módulo 2: Rebranding Singular System).
 */

export interface ReviewItem {
  file?: string;
  line?: number;
  reason: string;
  snippet?: string;
}

export const LEGACY_HEX = [
  "#111c4e",
  "#0a112f",
  "#1c2c6e",
  "#0d2a63",
  "#0071ce",
  "#19d3c5",
  "#004f90",
  "#005fb0",
  "#0b6b6f",
  "#5cc4c6",
  "#e2f0f0",
  "#090e27",
] as const;

const LEGACY_HEX_SET = new Set<string>(
  LEGACY_HEX.map((h) => h.toLowerCase().replace(/^#/, ""))
);

export function isLegacyHex(hex: string): boolean {
  return LEGACY_HEX_SET.has(hex.toLowerCase().replace(/^#/, ""));
}

/**
 * Mapeia uma combinação de variantes, prefixo e hex legado para o token oficial.
 */
function mapClassToken(
  variants: string,
  prefix: string,
  hexClean: string,
  opacity: string,
  manualReview: ReviewItem[],
  filePath?: string
): string {
  const normHex = hexClean.toLowerCase();
  let replacementName = "";

  switch (normHex) {
    case "111c4e":
    case "0a112f":
      replacementName = "brand-navy";
      break;

    case "1c2c6e":
    case "0d2a63":
      replacementName = "brand-navy-light";
      break;

    case "0071ce":
      if (
        prefix === "from" ||
        prefix === "via" ||
        prefix === "to" ||
        prefix === "bg" ||
        prefix === "border"
      ) {
        replacementName = "brand-navy-light";
      } else if (prefix === "text") {
        replacementName = "brand-link";
      } else if (prefix === "ring" || prefix === "outline") {
        replacementName = "brand-orange";
      } else {
        replacementName = "brand-navy-light";
      }
      break;

    case "19d3c5":
      if (
        prefix === "from" ||
        prefix === "via" ||
        prefix === "to" ||
        prefix === "bg"
      ) {
        replacementName = "brand-orange";
        manualReview.push({
          file: filePath,
          reason: `Classe ${prefix}-brand-orange gerada: verificar se texto no mesmo contexto precisa ser text-brand-navy`,
          snippet: `${variants}${prefix}-[#${hexClean}]${opacity}`,
        });
      } else if (prefix === "text") {
        replacementName = "brand-link";
        manualReview.push({
          file: filePath,
          reason: `text-[#19D3C5] mapeado para text-brand-link: se o fundo for navy, alterar para text-brand-orange`,
          snippet: `${variants}${prefix}-[#${hexClean}]${opacity}`,
        });
      } else {
        replacementName = "brand-orange";
      }
      break;

    case "004f90":
    case "005fb0":
      replacementName = "brand-navy";
      break;

    case "0b6b6f":
    case "5cc4c6":
      if (prefix === "text") {
        replacementName = "brand-link";
      } else {
        replacementName = "brand-navy-light";
      }
      manualReview.push({
        file: filePath,
        reason: `Cor legada #${hexClean} mapeada com prefixo ${prefix}: revisar adequação visual`,
        snippet: `${variants}${prefix}-[#${hexClean}]${opacity}`,
      });
      break;

    case "e2f0f0":
      replacementName = "brand-ice";
      break;

    case "090e27":
      replacementName = "brand-navy";
      break;

    default:
      // Se não for hex legado conhecido, não altera
      return `${variants}${prefix}-[#${hexClean}]${opacity}`;
  }

  return `${variants}${prefix}-${replacementName}${opacity}`;
}

export function replaceLegacyColors(
  source: string,
  filePath?: string
): { output: string; manualReview: ReviewItem[] } {
  const manualReview: ReviewItem[] = [];

  // 1. Substituição de classes Tailwind com hex arbitrários: e.g. hover:bg-[#111C4E]/80
  const tailwindHexRegex =
    /((?:[a-zA-Z0-9_:-]+:)*)([a-zA-Z0-9_-]+)-\[#([0-9a-fA-F]{6})\](\/[0-9a-zA-Z.]+)?/g;

  let output = source.replace(
    tailwindHexRegex,
    (match, variants, prefix, hex, opacity = "") => {
      if (isLegacyHex(hex)) {
        return mapClassToken(variants, prefix, hex, opacity, manualReview, filePath);
      }
      return match;
    }
  );

  // 2. Substituição em CSS inline / linear-gradient / styles
  // Ex: linear-gradient(45deg, #111C4E 11%, #0071CE) -> hsl(var(--brand-navy)) e hsl(var(--brand-orange))
  const gradientHexRegex = /#([0-9a-fA-F]{6})\b/g;
  output = output.replace(gradientHexRegex, (match, hex) => {
    if (isLegacyHex(hex)) {
      const norm = hex.toLowerCase();
      if (norm === "111c4e" || norm === "0a112f" || norm === "090e27") {
        return "hsl(var(--brand-navy))";
      }
      if (norm === "19d3c5" || norm === "5cc4c6") {
        return "hsl(var(--brand-orange))";
      }
      if (norm === "0071ce" || norm === "1c2c6e" || norm === "0d2a63") {
        return "hsl(var(--brand-navy-light))";
      }
      if (norm === "e2f0f0") {
        return "hsl(var(--brand-ice))";
      }
      return "hsl(var(--brand-navy))";
    }
    return match;
  });

  // 3. Detecção de classes cyan-* e itens que requerem revisão manual
  const lines = output.split(/\r?\n/);
  lines.forEach((line, idx) => {
    if (/\bcyan-\d+\b/.test(line)) {
      manualReview.push({
        file: filePath,
        line: idx + 1,
        reason: "Uso de classe cyan-* decorativa detectado (revisar para brand-*)",
        snippet: line.trim(),
      });
    }
    if (
      /\bbg-brand-orange\b/.test(line) &&
      !/\btext-brand-navy\b/.test(line) &&
      !/\btext-white\b/.test(line) &&
      !/\btext-[\w-]+\b/.test(line)
    ) {
      manualReview.push({
        file: filePath,
        line: idx + 1,
        reason: "bg-brand-orange sem text-brand-navy explícito na mesma linha",
        snippet: line.trim(),
      });
    }
  });

  return { output, manualReview };
}
