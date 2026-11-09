import type { StatusJob } from "./GeracaoLivroTypes";

export function calcularProgresso(
  _status: StatusJob,
  progress: number,
): number {
  if (typeof progress !== "number" || Number.isNaN(progress)) {
    return 0;
  }
  if (!Number.isFinite(progress)) {
    return progress > 0 ? 100 : 0;
  }
  if (progress <= 0) {
    return 0;
  }
  if (progress >= 100) {
    return 100;
  }
  return Math.round(progress);
}
