import type { Skill, StepOf } from '@/content/schema';

import { isInteger, type Rational } from '../rational';

/**
 * Base de las plantillas paramétricas (PRD §14.3): cada plantilla arma el enunciado, calcula la respuesta con
 * aritmética exacta y construye los distractores a partir de errores típicos, cada uno con su explicación.
 * El fundador revisa la plantilla una vez; el motor garantiza que cada variante sea correcta.
 */

export type Difficulty = 1 | 2 | 3 | 4 | 5;

export type Exercise = {
  /** `generador:semilla:dificultad`: con esto se vuelve a generar exactamente el mismo ejercicio. */
  ref: string;
  generator: string;
  difficulty: Difficulty;
  step: StepOf<'choice'>;
};

export type Generator = {
  id: string;
  title: string;
  skill: Skill;
  generate: (seed: number, difficulty: Difficulty) => Exercise;
};

// ─── Azar reproducible ─────────────────────────────────────────────────────

export type Rng = () => number;

/** mulberry32: la misma semilla produce siempre el mismo ejercicio (repaso de errores, reportes). */
export function rngFrom(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const int = (rng: Rng, min: number, max: number) => min + Math.floor(rng() * (max - min + 1));

export function nonZero(rng: Rng, min: number, max: number): number {
  for (;;) {
    const v = int(rng, min, max);
    if (v !== 0) return v;
  }
}

export function pick<T>(rng: Rng, list: readonly T[]): T {
  return list[Math.floor(rng() * list.length)]!;
}

export function shuffle<T>(rng: Rng, list: readonly T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

/** Signo aleatorio solo desde cierta dificultad (los negativos llegan después). */
export const signed = (rng: Rng, v: number, difficulty: Difficulty, from: Difficulty = 3) =>
  difficulty >= from && rng() < 0.5 ? -v : v;

// ─── Notación ──────────────────────────────────────────────────────────────

/** Racional en la notación del contenido: `-\frac{3}{4}`, `5`. */
export function tex(r: Rational): string {
  if (isInteger(r)) return String(r.n);
  const sign = r.n < 0 ? '-' : '';
  return `${sign}\\frac{${Math.abs(r.n)}}{${r.d}}`;
}

export const texN = (n: number) => String(n);

/** Término `k·v` para el inicio de una expresión: `3x`, `x`, `-x`, `-2x`. */
export function lead(k: number, v: string): string {
  if (k === 1) return v;
  if (k === -1) return `-${v}`;
  return `${k}${v}`;
}

/** Término siguiente con su signo: `+3x`, `-x`, `+5`. Cero = vacío. */
export function next(k: number, v = ''): string {
  if (k === 0) return '';
  const abs = Math.abs(k);
  const body = v ? (abs === 1 ? v : `${abs}${v}`) : String(abs);
  return `${k < 0 ? '-' : '+'}${body}`;
}

/** Término constante racional con su signo: `+rac{1}{2}`, `-3`. Cero = vacío. */
export function nextR(r: Rational): string {
  if (r.n === 0) return '';
  return r.n < 0 ? tex(r) : `+${tex(r)}`;
}

/** Polinomio `A·x² + B·x + C` sin términos nulos. */
export function poly(A: number, B: number, C: number): string {
  const terms: string[] = [];
  if (A !== 0) terms.push(lead(A, 'x^{2}'));
  if (B !== 0) terms.push(terms.length ? next(B, 'x') : lead(B, 'x'));
  if (C !== 0 || terms.length === 0) terms.push(terms.length ? next(C) : String(C));
  return terms.join('');
}

/** Montos en pesos con separador de miles: `\$1.500`. */
export const money = (n: number) => `\\$${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

// ─── Alternativas ──────────────────────────────────────────────────────────

export type Wrong = { text: string; feedback: string };

export const GENERIC_FEEDBACK =
  'Casi. Reemplaza tu respuesta en el enunciado y revisa si todo se cumple. Si quieres, pide una pista.';

type ChoiceSpec = {
  id: string;
  prompt: string;
  correct: string;
  /** Errores típicos, en orden de prioridad. Se descartan los que coinciden con otra alternativa. */
  wrong: Wrong[];
  /** Respaldo si los errores típicos coinciden entre sí. */
  fallback: string[];
  skill: Skill;
  difficulty: Difficulty;
  hints: string[];
  solution: string[];
  explanation?: string;
};

/** Arma una pregunta A–D con exactamente una correcta y tres distractores distintos. */
export function buildChoice(rng: Rng, spec: ChoiceSpec): StepOf<'choice'> {
  const chosen: Wrong[] = [];
  const seen = new Set([spec.correct]);
  for (const w of [...spec.wrong, ...spec.fallback.map((text) => ({ text, feedback: GENERIC_FEEDBACK }))]) {
    if (chosen.length === 3) break;
    if (seen.has(w.text)) continue;
    seen.add(w.text);
    chosen.push(w);
  }
  if (chosen.length < 3) throw new Error(`${spec.id}: no hay 3 distractores distintos`);

  const all = shuffle(rng, [{ text: spec.correct, feedback: '' }, ...chosen]);
  const answer = all.findIndex((o) => o.text === spec.correct);
  const feedback: Record<string, string> = {};
  all.forEach((o, i) => {
    if (i !== answer) feedback[String(i)] = o.feedback;
  });
  return {
    id: spec.id,
    type: 'choice',
    prompt: spec.prompt,
    options: all.map((o) => o.text),
    answer,
    feedback,
    skill: spec.skill,
    difficulty: spec.difficulty,
    hints: spec.hints,
    solution: spec.solution,
    explanation: spec.explanation,
  };
}

/** Envuelve un número en notación matemática para una alternativa. */
export const m = (s: string) => `$${s}$`;
