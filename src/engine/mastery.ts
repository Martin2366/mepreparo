import type { Outcome } from './xp';

/** Valor de cada intento para el dominio (plan §5.2): sin pistas 1 · con pistas 0,6 · error 0. */
const VALUE: Record<Outcome, number> = { clean: 1, hinted: 0.6, wrong: 0 };

export const WINDOW = 5;

/**
 * Dominio 0–1 de una habilidad o unidad: promedio de los últimos 5 intentos.
 * Mientras haya menos de 5, los que faltan valen la semilla (diagnóstico), para que no salte de golpe.
 */
export function masteryOf(outcomes: readonly Outcome[], seed: number): number {
  const last = outcomes.slice(-WINDOW);
  const sum = last.reduce((s, o) => s + VALUE[o], 0) + seed * (WINDOW - last.length);
  return clamp01(sum / WINDOW);
}

/** Dominada = los últimos 5 intentos con un dominio ≥ 0,8. */
export const isMastered = (outcomes: readonly Outcome[]): boolean =>
  outcomes.length >= WINDOW && masteryOf(outcomes, 0) >= 0.8;

/** Semilla desde el diagnóstico: fracción de aciertos; sin diagnóstico, 0,48 (equivale a ~600 puntos en `paesScale`). */
export function seedFromDiagnostic(correct: number, total: number, done: boolean): number {
  if (!done || total === 0) return 0.48;
  return clamp01(correct / total);
}

export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

export const pct = (x: number) => Math.round(clamp01(x) * 100);
