import {
  directProportion,
  inverseProportion,
  linearEquation,
  linearEquationBothSides,
  linearInequality,
  squareBinomial,
  system2x2,
} from './algebra';
import type { Difficulty, Exercise, Generator } from './core';
import { affineEvaluate, affineFromPoints, quadraticEvaluate, quadraticVertex, slopeTwoPoints } from './functions';
import { areaPerimeter, pythagoras, similarity, transformPoint, volume } from './geometry';
import { fractionOps, integerOps, negativeExponent, percentChange, percentOf, powerRules, simplifyRoot, successivePercent } from './numbers';
import { boxplotRead, centralTendency, classicProbability, diceProbability } from './stats';

export type { Difficulty, Exercise, Generator } from './core';

export const GENERATORS: Record<string, Generator> = Object.fromEntries(
  [
    linearEquation,
    linearEquationBothSides,
    linearInequality,
    squareBinomial,
    directProportion,
    inverseProportion,
    system2x2,
    affineEvaluate,
    slopeTwoPoints,
    affineFromPoints,
    quadraticEvaluate,
    quadraticVertex,
    fractionOps,
    integerOps,
    percentOf,
    percentChange,
    successivePercent,
    powerRules,
    negativeExponent,
    simplifyRoot,
    pythagoras,
    areaPerimeter,
    volume,
    transformPoint,
    similarity,
    centralTendency,
    boxplotRead,
    classicProbability,
    diceProbability,
  ].map((g) => [g.id, g]),
);

/** Vuelve a generar exactamente el mismo ejercicio desde su referencia (`generador:semilla:dificultad`). */
export function fromRef(ref: string): Exercise | null {
  const [id, seed, diff] = ref.split(':');
  const g = id ? GENERATORS[id] : undefined;
  if (!g || seed === undefined || diff === undefined) return null;
  return g.generate(Number(seed), clampDifficulty(Number(diff)));
}

export const clampDifficulty = (d: number): Difficulty => Math.max(1, Math.min(5, Math.round(d))) as Difficulty;

/**
 * Dificultad adaptativa (PRD §8.3): 3 aciertos seguidos sin pistas suben un nivel; 2 errores seguidos bajan uno.
 * `recent` = resultados de la sesión, del más antiguo al más reciente.
 */
export function nextDifficulty(current: Difficulty, recent: readonly ('clean' | 'hinted' | 'wrong')[]): Difficulty {
  const tail = (n: number) => recent.slice(-n);
  if (recent.length >= 3 && tail(3).every((o) => o === 'clean')) return clampDifficulty(current + 1);
  if (recent.length >= 2 && tail(2).every((o) => o === 'wrong')) return clampDifficulty(current - 1);
  return current;
}
