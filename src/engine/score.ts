import { clamp01 } from './mastery';

export type AxisMastery = { share: number; mastery: number };

export type ScoreRange = { low: number; high: number; point: number };

/**
 * Puntaje M1 estimado (orientativo, PRD §11). Usa la misma escala que el estimado del onboarding
 * (`estimateM1`: 420 + dominio × 480) para que el número no salte al entrar a la app.
 * El rango se angosta a medida que hay más evidencia (intentos).
 */
export function estimateRange(axes: readonly AxisMastery[], attempts: number): ScoreRange {
  const shares = axes.reduce((s, a) => s + a.share, 0) || 1;
  const m = clamp01(axes.reduce((s, a) => s + a.share * a.mastery, 0) / shares);
  const point = round10(420 + m * 480);
  const half = Math.max(20, 60 - Math.floor(attempts / 10) * 5);
  return { point, low: Math.max(150, round10(point - half)), high: Math.min(1000, round10(point + half)) };
}

const round10 = (n: number) => Math.round(n / 10) * 10;
