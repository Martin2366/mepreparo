import diagnostic from '@/content/diagnostic.json';
import type { Axis, Skill } from '@/content/schema';
import { SKILLS } from '@/content/schema';
import { dayKey } from '@/engine/dates';
import { masteryOf, seedFromDiagnostic } from '@/engine/mastery';
import { dailySession, nextLesson } from '@/engine/plan';
import { dueItems } from '@/engine/review';
import { estimateRange } from '@/engine/score';
import { streakOf } from '@/engine/streak';
import { dailyGoalXp, levelOf } from '@/engine/xp';
import { usePlan } from '@/features/premium/store';
import { allUnits, curriculum, lessonsOf, pathUnits } from '@/features/content/catalog';
import type { Answers } from '@/features/onboarding/model';
import { useOnboarding } from '@/features/onboarding/store';
import { planOf } from '@/features/plan/context';

import { useProgress } from './store';

type ProgressData = ReturnType<typeof useProgress.getState>;

/** Techo del dominio inicial que puede dar el diagnóstico. */
const SEED_CAP = 0.7;

/** Semilla del dominio por eje: aciertos del diagnóstico en las preguntas de ese eje (o el global). */
export function axisSeed(a: Answers, axis: Axis): number {
  const d = a.diag;
  const total = diagnostic.questions.length;
  const correct = d?.answers.filter((x) => x === true).length ?? 0;
  const global = seedFromDiagnostic(correct, total, !!d?.done);
  if (!d?.done) return global;
  const idx = diagnostic.questions.map((q, i) => (axis.focus.includes(q.focus) ? i : -1)).filter((i) => i >= 0);
  if (idx.length === 0) return global;
  // Con 2–3 preguntas por eje, el resultado se suaviza hacia el global y se limita: el dominio alto se gana practicando.
  const K = 3;
  const correctAxis = idx.filter((i) => d.answers[i] === true).length;
  return Math.min(SEED_CAP, (correctAxis + global * K) / (idx.length + K));
}

export function unitMastery(p: ProgressData, a: Answers, unitId: string): number {
  const ref = allUnits.find((u) => u.unit.id === unitId);
  const seed = ref ? axisSeed(a, ref.axis) : 0.375;
  return masteryOf(p.unitOutcomes[unitId] ?? [], seed);
}

export function axisMastery(p: ProgressData, a: Answers, axis: Axis): number {
  const values = axis.units.map((u) => unitMastery(p, a, u.id));
  return values.reduce((s, v) => s + v, 0) / values.length;
}

export function skillMastery(p: ProgressData, a: Answers): Record<Skill, number> {
  const seed = seedFromDiagnostic(a.diag?.answers.filter((x) => x === true).length ?? 0, diagnostic.questions.length, !!a.diag?.done);
  return Object.fromEntries(SKILLS.map((s) => [s, masteryOf(p.skillOutcomes[s] ?? [], seed)])) as Record<Skill, number>;
}

/** Todo lo que muestran Inicio y Progreso, derivado de los dos stores. */
export function useDashboard() {
  const p = useProgress();
  const a = useOnboarding((s) => s.answers);
  const now = new Date();
  const today = dayKey(now);
  const plan = planOf(a, now);
  const plan_ = usePlan();
  const completed = new Set(Object.entries(p.lessons).filter(([, l]) => l.status === 'completed').map(([id]) => id));
  const next = nextLesson(pathUnits, completed, plan.focus);
  const due = dueItems(p.reviews, today);
  const inProgress =
    p.lastLessonId && p.lessons[p.lastLessonId]?.status === 'in-progress' && p.lessons[p.lastLessonId]!.step > 0
      ? p.lastLessonId
      : null;
  const axes = curriculum.axes.map((axis) => ({ axis, mastery: axisMastery(p, a, axis) }));
  // El estimado parte exactamente en el del onboarding (semilla global) y se mueve solo con lo que cambia el
  // dominio de cada eje respecto de su semilla: así el número no salta al entrar a la app.
  const globalSeed = seedFromDiagnostic(a.diag?.answers.filter((x) => x === true).length ?? 0, diagnostic.questions.length, !!a.diag?.done);
  const estimate = estimateRange(
    axes.map((x) => ({ share: x.axis.share, mastery: globalSeed + (x.mastery - axisSeed(a, x.axis)) })),
    p.attempts,
  );
  const practiceUnit =
    (next && allUnits.find((u) => u.unit.id === next.unitId && u.unit.generators.length > 0)?.unit.id) ??
    allUnits.find((u) => u.unit.generators.length > 0 && lessonsOf(u.unit.id).length > 0)?.unit.id ??
    null;

  return {
    answers: a,
    progress: p,
    today,
    plan,
    streak: streakOf(new Set(p.activeDays), today),
    level: levelOf(p.xp),
    xpToday: p.xpByDay[today] ?? 0,
    goalXp: dailyGoalXp(a.minutes),
    planState: plan_,
    next,
    inProgress,
    due,
    session: dailySession({ minutes: plan.minutes, next, practiceUnitId: practiceUnit, dueReviews: due.length }),
    axes,
    estimate,
    skills: skillMastery(p, a),
    completed,
  };
}
