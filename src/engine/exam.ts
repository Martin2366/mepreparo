import type { Skill } from '@/content/schema';

import { type Difficulty, type Exercise, fromRef, GENERATORS } from './generators';
import { int, pick, rngFrom, shuffle } from './generators/core';
import { paesScale } from './score';

/**
 * Ensayos (PRD §5.1 y §9): se arman desde el banco verificado (generadores) según una pauta por eje,
 * con una semilla nueva en cada intento, así nunca se repiten. Todo es puro y reproducible desde la semilla.
 */

export type ExamKind = 'full' | 'mini' | 'thematic' | 'custom';

export type ExamSpec = {
  kind: ExamKind;
  title: string;
  count: number;
  /** Minutos; `null` = sin tiempo. */
  minutes: number | null;
  /** Restringe a estas unidades (temático y a tu medida). */
  unitIds?: string[];
};

/** Formato oficial M1 (DEMRE 2027): 65 preguntas en 2 h 20 min (≈ 2,15 min por pregunta). */
export const MINUTES_PER_QUESTION = 140 / 65;

export const PRESETS: Record<'full' | 'mini' | 'thematic', Omit<ExamSpec, 'title' | 'unitIds'>> = {
  full: { kind: 'full', count: 65, minutes: 140 },
  mini: { kind: 'mini', count: 15, minutes: 30 },
  thematic: { kind: 'thematic', count: 20, minutes: 30 },
};

export type BankAxis = { id: string; share: number; units: { id: string; generators: string[] }[] };

export type ExamQuestion = { ref: string; unitId: string; axisId: string; skill: Skill };

/** Reparte `count` preguntas entre los ejes según su peso (mayores restos). */
export function allocate(axes: readonly { id: string; share: number }[], count: number): Record<string, number> {
  const total = axes.reduce((s, a) => s + a.share, 0) || 1;
  const raw = axes.map((a) => ({ id: a.id, exact: (a.share / total) * count }));
  const out: Record<string, number> = Object.fromEntries(raw.map((r) => [r.id, Math.floor(r.exact)]));
  let left = count - Object.values(out).reduce((s, v) => s + v, 0);
  for (const r of [...raw].sort((a, b) => (b.exact % 1) - (a.exact % 1))) {
    if (left <= 0) break;
    out[r.id]! += 1;
    left--;
  }
  return out;
}

/** Dificultad de cada pregunta: ~20 % fácil, ~50 % media, ~30 % difícil, como un ensayo real. */
function difficultyFor(rng: () => number): Difficulty {
  const x = rng();
  return (x < 0.2 ? pick(rng, [1, 2]) : x < 0.7 ? 3 : pick(rng, [4, 5])) as Difficulty;
}

/** Arma las preguntas del ensayo. Solo usa unidades con generadores; el orden final se mezcla. */
export function buildExam(bank: readonly BankAxis[], spec: ExamSpec, seed: number): ExamQuestion[] {
  const rng = rngFrom(seed);
  const filter = spec.unitIds ? new Set(spec.unitIds) : null;
  const axes = bank
    .map((a) => ({ ...a, units: a.units.filter((u) => u.generators.length > 0 && (!filter || filter.has(u.id))) }))
    .filter((a) => a.units.length > 0);
  if (axes.length === 0) return [];
  const perAxis = allocate(axes, spec.count);
  const questions: ExamQuestion[] = [];
  const used = new Set<string>();
  for (const axis of axes) {
    const n = perAxis[axis.id] ?? 0;
    const units = shuffle(rng, axis.units);
    for (let i = 0; i < n; i++) {
      const unit = units[i % units.length]!;
      const genId = pick(rng, unit.generators);
      const g = GENERATORS[genId]!;
      let ref = '';
      for (let t = 0; t < 5; t++) {
        const ex = g.generate(int(rng, 1, 2_000_000_000), difficultyFor(rng));
        ref = ex.ref;
        if (!used.has(ex.step.prompt)) {
          used.add(ex.step.prompt);
          break;
        }
      }
      questions.push({ ref, unitId: unit.id, axisId: axis.id, skill: g.skill });
    }
  }
  return shuffle(rng, questions);
}

export const questionOf = (q: ExamQuestion): Exercise | null => fromRef(q.ref);

export type ExamResult = {
  correct: number;
  total: number;
  score: number;
  byAxis: Record<string, { correct: number; total: number }>;
  bySkill: Partial<Record<Skill, { correct: number; total: number }>>;
};

/** Corrige un ensayo: `answers[i]` es el índice elegido (o null si quedó en blanco). */
export function gradeExam(questions: readonly ExamQuestion[], answers: readonly (number | null)[]): ExamResult {
  const byAxis: ExamResult['byAxis'] = {};
  const bySkill: ExamResult['bySkill'] = {};
  let correct = 0;
  questions.forEach((q, i) => {
    const ex = questionOf(q);
    const ok = !!ex && answers[i] === ex.step.answer;
    if (ok) correct++;
    const a = (byAxis[q.axisId] ??= { correct: 0, total: 0 });
    a.total++;
    if (ok) a.correct++;
    const s = (bySkill[q.skill] ??= { correct: 0, total: 0 });
    s.total++;
    if (ok) s.correct++;
  });
  const total = questions.length;
  return { correct, total, score: total ? paesScale(correct / total) : 100, byAxis, bySkill };
}

/** Minutos para un ensayo a tu medida con "tiempo real": el ritmo oficial de la PAES. */
export const realMinutes = (count: number) => Math.round(count * MINUTES_PER_QUESTION);
