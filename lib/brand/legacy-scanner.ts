/**
 * Detector de marcas, termos e cores legadas (Frontend).
 * Implementa varredura case-insensitive para termos ("ipaag", "prefeitura")
 * e cores da Paleta_Legada (com ou sem #).
 */

export interface BrandException {
  glob: string;
  pattern: string;
  reason: string;
}

export interface ScanViolation {
  file: string;
  line: number;
  column: number;
  match: string;
  termType: "term" | "color";
  snippet: string;
}

export const LEGACY_TERMS = ["ipaag", "prefeitura"] as const;

export const LEGACY_HEX_COLORS = [
  "111c4e",
  "0a112f",
  "1c2c6e",
  "0d2a63",
  "0071ce",
  "19d3c5",
  "004f90",
  "005fb0",
  "0b6b6f",
  "5cc4c6",
  "e2f0f0",
  "090e27",
] as const;

/**
 * Valida a integridade da Lista_Excecoes:
 * - reason não vazio
 * - glob não universal (proibido "", "*", "**", "**\/*")
 * - pattern obrigatório e não vazio
 */
export function validateExceptions(exceptions: unknown[]): string[] {
  const errors: string[] = [];

  if (!Array.isArray(exceptions)) {
    return ["A Lista_Excecoes deve ser um array."];
  }

  exceptions.forEach((entry, idx) => {
    if (typeof entry !== "object" || entry === null) {
      errors.push(`Entrada ${idx} inválida: deve ser um objeto.`);
      return;
    }

    const { glob, pattern, reason } = entry as Partial<BrandException>;

    if (!reason || typeof reason !== "string" || reason.trim().length === 0) {
      errors.push(`Entrada ${idx} (${glob || "?"}): 'reason' é obrigatório e não pode ser vazio.`);
    }

    if (!pattern || typeof pattern !== "string" || pattern.trim().length === 0) {
      errors.push(`Entrada ${idx} (${glob || "?"}): 'pattern' é obrigatório e não pode ser vazio.`);
    }

    if (!glob || typeof glob !== "string" || glob.trim().length === 0) {
      errors.push(`Entrada ${idx}: 'glob' é obrigatório.`);
    } else {
      const g = glob.trim().replace(/\\/g, "/");
      if (g === "*" || g === "**" || g === "**/*") {
        errors.push(`Entrada ${idx} (${glob}): 'glob' universal não é permitido.`);
      }
    }
  });

  return errors;
}

export function globToRegex(glob: string): RegExp {
  const normalized = glob.replace(/\\/g, "/");
  const escaped = normalized
    .replace(/[.+^${}()|[\]]/g, "\\$&")
    .replace(/\*\*/g, ".*")
    .replace(/(?<!\.)\*/g, "[^/]*");
  return new RegExp(`(^|/)${escaped}$`, "i");
}

export function isExceptionApplicable(
  filePath: string,
  matchedText: string,
  exceptions: BrandException[]
): boolean {
  const normPath = filePath.replace(/\\/g, "/");
  return exceptions.some((exc) => {
    try {
      const pathMatches = globToRegex(exc.glob).test(normPath);
      if (!pathMatches) return false;
      const patternRegex = new RegExp(exc.pattern, "i");
      return patternRegex.test(matchedText);
    } catch {
      return false;
    }
  });
}

/**
 * Executa a varredura em um arquivo de texto contra termos e cores legadas.
 */
export function scan(
  text: string,
  filePath: string,
  exceptions: BrandException[] = []
): ScanViolation[] {
  const violations: ScanViolation[] = [];
  const lines = text.split(/\r?\n/);

  // Regex para termos legados: 'ipaag' ou 'prefeitura' (case insensitive)
  const termRegex = /\b(ipaag[a-z0-9_-]*|prefeitura[a-z0-9_-]*)\b/gi;

  // Regex para hex legados com ou sem #
  // Exige que não seja precedido ou seguido imediatamente por dígito hexadecimal para evitar falsos positivos
  const hexPatternString = LEGACY_HEX_COLORS.join("|");
  const colorRegex = new RegExp(
    `(?<=^|[^a-fA-F0-9])#?(${hexPatternString})(?=[^a-fA-F0-9]|$)`,
    "gi"
  );

  lines.forEach((lineText, lineIdx) => {
    const lineNum = lineIdx + 1;

    // 1. Procurar termos legados
    let match: RegExpExecArray | null;
    termRegex.lastIndex = 0;
    while ((match = termRegex.exec(lineText)) !== null) {
      const matched = match[0];
      const col = match.index + 1;
      if (!isExceptionApplicable(filePath, matched, exceptions)) {
        violations.push({
          file: filePath,
          line: lineNum,
          column: col,
          match: matched,
          termType: "term",
          snippet: lineText.trim(),
        });
      }
    }

    // 2. Procurar cores legadas
    colorRegex.lastIndex = 0;
    while ((match = colorRegex.exec(lineText)) !== null) {
      const matched = match[0];
      const col = match.index + 1;
      if (!isExceptionApplicable(filePath, matched, exceptions)) {
        violations.push({
          file: filePath,
          line: lineNum,
          column: col,
          match: matched,
          termType: "color",
          snippet: lineText.trim(),
        });
      }
    }
  });

  return violations;
}
