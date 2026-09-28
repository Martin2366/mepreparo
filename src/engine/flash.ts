import { int, pick, rngFrom, shuffle } from './generators/core';

/**
 * Reto relámpago (PRD §5.1): 60 segundos de cálculo mental. Preguntas cortas con 4 opciones grandes;
 * la dificultad sube con la racha de aciertos (combo). Todo entero y exacto.
 */
export type FlashQuestion = { text: string; options: number[]; answer: number };

export const DURATION_MS = 60_000;

function options(rng: () => number, answer: number, near: number[]): number[] {
  const set = new Set<number>([answer]);
  for (const n of [...near, answer + 1, answer - 1, answer + 2, answer - 10, answer + 10]) {
    if (set.size === 4) break;
    if (Number.isInteger(n)) set.add(n);
  }
  return shuffle(rng, [...set]);
}

export function flashQuestion(seed: number, level: number): FlashQuestion {
  const rng = rngFrom(seed);
  const kinds = level < 3 ? ['mul', 'add'] : level < 6 ? ['mul', 'add', 'sub', 'div', 'sq'] : ['mul', 'sub', 'div', 'sq', 'eq', 'pct'];
  const kind = pick(rng, kinds);
  switch (kind) {
    case 'mul': {
      const a = int(rng, 2, level < 3 ? 9 : 12);
      const b = int(rng, 2, level < 3 ? 9 : 12);
      return { text: `${a} · ${b}`, answer: a * b, options: options(rng, a * b, [a * (b + 1), (a + 1) * b, a + b]) };
    }
    case 'add': {
      const a = int(rng, 11, 60);
      const b = int(rng, 11, 60);
      return { text: `${a} + ${b}`, answer: a + b, options: options(rng, a + b, [a + b + 10, a + b - 10]) };
    }
    case 'sub': {
      const a = int(rng, -15, 30);
      const b = int(rng, -15, 30);
      const bText = b < 0 ? `(${b})` : String(b);
      return { text: `${a} − ${bText}`, answer: a - b, options: options(rng, a - b, [a + b, b - a]) };
    }
    case 'div': {
      const b = int(rng, 2, 12);
      const q = int(rng, 2, 12);
      return { text: `${b * q} : ${b}`, answer: q, options: options(rng, q, [q + b, b]) };
    }
    case 'sq': {
      const n = int(rng, 2, 15);
      return { text: `${n}²`, answer: n * n, options: options(rng, n * n, [2 * n, n * n + n]) };
    }
    case 'eq': {
      const a = int(rng, 2, 9);
      const x = int(rng, -9, 12);
      const b = a * x;
      return { text: `${a}x = ${b}  →  x = ?`, answer: x, options: options(rng, x, [b - a, -x, x + a]) };
    }
    default: {
      const p = pick(rng, [10, 20, 25, 50]);
      const n = int(rng, 2, 20) * 20;
      const ans = (p * n) / 100;
      return { text: `${p} % de ${n}`, answer: ans, options: options(rng, ans, [n - ans, ans * 2]) };
    }
  }
}

/** Puntaje de un acierto: 10 × multiplicador (sube cada 3 aciertos seguidos, hasta ×4). */
export const pointsFor = (combo: number) => 10 * Math.min(4, 1 + Math.floor(combo / 3));

/** Nivel según aciertos del reto (sube rápido para que no se aburra). */
export const levelFor = (correct: number) => Math.floor(correct / 3);

/** XP del reto: un décimo del puntaje, con tope. */
export const flashXp = (score: number) => Math.min(30, Math.floor(score / 10));
