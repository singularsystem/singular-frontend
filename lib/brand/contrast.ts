/**
 * Utilitário de contraste de cor WCAG 2.1.
 * Calcula a razão de contraste entre duas cores hexadecimais de forma simétrica, com retorno entre 1 e 21.
 */

export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

export function parseHexColor(hex: string): RgbColor {
  const cleanHex = hex.trim().replace(/^#/, "");

  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      throw new Error(`Cor hexadecimal inválida: ${hex}`);
    }
    return { r, g, b };
  }

  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);
    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      throw new Error(`Cor hexadecimal inválida: ${hex}`);
    }
    return { r, g, b };
  }

  throw new Error(`Formato de cor hexadecimal inválido: ${hex}`);
}

export function relativeLuminance(color: RgbColor): number {
  const toLinear = (c: number): number => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };

  const r = toLinear(color.r);
  const g = toLinear(color.g);
  const b = toLinear(color.b);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Retorna a razão de contraste WCAG 2.1 entre duas cores hexadecimais.
 * A função é estritamente simétrica: contrastRatio(A, B) === contrastRatio(B, A).
 * O resultado está no intervalo fechado [1, 21].
 */
export function contrastRatio(colorA: string, colorB: string): number {
  const rgbA = parseHexColor(colorA);
  const rgbB = parseHexColor(colorB);

  const lA = relativeLuminance(rgbA);
  const lB = relativeLuminance(rgbB);

  const l1 = Math.max(lA, lB);
  const l2 = Math.min(lA, lB);

  const ratio = (l1 + 0.05) / (l2 + 0.05);
  return Number(ratio.toFixed(2));
}

export function passesWcagAA(
  textColor: string,
  bgColor: string,
  isLargeText: boolean = false
): boolean {
  const min = isLargeText ? 3.0 : 4.5;
  return contrastRatio(textColor, bgColor) >= min;
}
