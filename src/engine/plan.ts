import type { Answers } from '@/features/onboarding/model';
import { daysUntil, estimateM1, planFocus, weeksUntil } from '@/features/onboarding/model';

/**
 * El plan del estudiante (PRD §7): resumen derivado del onboarding y la sesión de cada día.
 * Funciones puras: el contenido y la fecha llegan como parámetros.
 */

export type PlanContext = {
  today: Date;
  /** Fecha de inicio de la PAES elegida (`paes-config.json`), si se conoce. */
  sessionStart?: string | null;
  /** Foco temático de cada pregunta del diagnóstico ("Álgebra", "Funciones"…). */
  questionFocus: string[];
  /** Etiqueta legible de cada tema del onboarding. */
  topicLabel: Record<string, string>;
};

export type PlanSummary = {
  days: number | undefined;
  weeks: number;
  hasDate: boolean;
  correct: number;
  done: boolean;
  est: number;
  focus: string[];
  target: number;
  minutes: number;
};

export function planSummary(a: Answers, ctx: PlanContext): PlanSummary {
  const days = ctx.sessionStart ? daysUntil(ctx.sessionStart, ctx.today) : undefined;
  const diag = a.diag;
  const correct = diag?.answers.filter((x) => x === true).length ?? 0;
  const done = !!diag?.done;
  const est = estimateM1(correct, ctx.questionFocus.length, done);
  const missed = done ? ctx.questionFocus.filter((_, i) => diag?.answers[i] !== true) : [];
  const focus = planFocus(
    a.topics.map((t) => ctx.topicLabel[t]).filter((x): x is string => !!x),
    missed,
  );
  return {
    days,
    weeks: weeksUntil(days),
    hasDate: !!days,
    correct,
    done,
    est,
    focus,
    target: a.target ?? 700,
    minutes: a.minutes ?? 20,
  };
}

// ─── Siguiente lección ─────────────────────────────────────────────────────

export type PathUnit = {
  id: string;
  axisId: string;
  /** Etiquetas de foco del eje ("Álgebra", "Funciones"). */
  focus: string[];
  /** Lecciones jugables, en orden. */
  lessonIds: string[];
};

/**
 * Siguiente lección sugerida: primero las unidades de los ejes del foco del plan, en el orden del temario;
 * después el resto. Nunca bloquea: es una sugerencia.
 */
export function nextLesson(units: readonly PathUnit[], completed: ReadonlySet<string>, focus: readonly string[]) {
  const inFocus = (u: PathUnit) => u.focus.some((f) => focus.includes(f));
  const ordered = [...units.filter(inFocus), ...units.filter((u) => !inFocus(u))];
  for (const u of ordered) {
    const id = u.lessonIds.find((l) => !completed.has(l));
    if (id) return { unitId: u.id, lessonId: id };
  }
  return null;
}

// ─── Sesión de hoy ─────────────────────────────────────────────────────────

export type SessionItem =
  | { kind: 'lesson'; lessonId: string; unitId: string }
  | { kind: 'practice'; unitId: string; count: number }
  | { kind: 'review'; count: number };

const PRACTICE_BY_MINUTES: [number, number][] = [
  [5, 3],
  [10, 5],
  [20, 8],
  [30, 12],
  [45, 15],
];

export function practiceCount(minutes: number): number {
  let best = PRACTICE_BY_MINUTES[0]!;
  for (const row of PRACTICE_BY_MINUTES) if (Math.abs(row[0] - minutes) < Math.abs(best[0] - minutes)) best = row;
  return best[1];
}

/**
 * Sesión de hoy (PRD §7): una lección nueva (si queda), práctica de la unidad en foco y los errores que vencen,
 * dimensionada por los minutos diarios elegidos.
 */
export function dailySession(input: {
  minutes: number;
  next: { unitId: string; lessonId: string } | null;
  practiceUnitId: string | null;
  dueReviews: number;
}): SessionItem[] {
  const items: SessionItem[] = [];
  if (input.next) items.push({ kind: 'lesson', lessonId: input.next.lessonId, unitId: input.next.unitId });
  const unit = input.practiceUnitId ?? input.next?.unitId;
  if (unit) items.push({ kind: 'practice', unitId: unit, count: practiceCount(input.minutes) });
  if (input.dueReviews > 0) items.push({ kind: 'review', count: Math.min(5, input.dueReviews) });
  return items;
}
