import { clamp01 } from './mastery';

/**
 * Escala PAES orientativa (100–1000) desde la fracción de aciertos o de dominio.
 * 0 → 100, 1 → 1000, y una curva suave en el medio (60 % → ~710). Es la misma para el diagnóstico,
 * el estimado de Progreso y los ensayos, para que los números no se contradigan. No es la tabla oficial de DEMRE.
 */
export function paesScale(p: number): number {
  const x = clamp01(p);
  return round10(100 + 900 * (1 - (1 - x) ** 1.25));
}

export type AxisMastery = { share: number; mastery: number };

export type ScoreRange = { low: number; high: number; point: number };

/**
 * Puntaje M1 estimado (orientativo, PRD §11) desde el dominio por eje, ponderado por su peso en la prueba.
 * El rango se angosta a medida que hay más evidencia (intentos).
 */
export function estimateRange(axes: readonly AxisMastery[], attempts: number): ScoreRange {
  const shares = axes.reduce((s, a) => s + a.share, 0) || 1;
  const m = clamp01(axes.reduce((s, a) => s + a.share * a.mastery, 0) / shares);
  const point = paesScale(m);
  const half = Math.max(20, 60 - Math.floor(attempts / 10) * 5);
  return { point, low: Math.max(100, round10(point - half)), high: Math.min(1000, round10(point + half)) };
}

const round10 = (n: number) => Math.round(n / 10) * 10;
