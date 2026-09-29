import type { DayKey } from './dates';
import type { IntensiveState } from './intensive';
import type { ReviewItem } from './review';
import type { Outcome } from './xp';

/**
 * Mezcla del estado local con el respaldado en la nube (plan §5.2 `merge`). Se usa al restaurar en otro teléfono,
 * al pasar a una cuenta de Google que ya tenía progreso y cuando dos teléfonos usan la misma cuenta.
 * Reglas: nunca se pierde avance (máximos y uniones), es idempotente (mezclar dos veces da lo mismo) y, ante empate,
 * gana lo local (es lo que el estudiante acaba de hacer en este teléfono).
 * Los contadores acumulados (XP, intentos) usan el máximo, no la suma: la suma duplicaría el mismo avance.
 */

type LessonState = { step: number; status: 'in-progress' | 'completed'; startedAt: string; completedAt?: string };
type NotebookEntry = { ref: string; addedOn: DayKey; lastWrongOn: DayKey };
type DayStats = { lessons: number; correct: number };

export type ProgressDoc = {
  lessons: Record<string, LessonState>;
  unitOutcomes: Record<string, Outcome[]>;
  skillOutcomes: Partial<Record<string, Outcome[]>>;
  xp: number;
  xpByDay: Record<DayKey, number>;
  dayStats: Record<DayKey, DayStats>;
  activeDays: DayKey[];
  reviews: ReviewItem[];
  notebook: Record<string, NotebookEntry>;
  usage: Partial<Record<string, Record<string, number>>>;
  practiceDifficulty: Record<string, number>;
  lastLessonId: string | null;
  attempts: number;
  seeded: boolean;
  simScores: Record<string, number | undefined>;
  counters: { ahas: number; reviewCorrect: number };
  badges: Record<string, DayKey>;
  unseenBadges: string[];
  flashBest: number;
  savedFormulas: string[];
};

const minStr = (a?: string, b?: string) => (a && b ? (a < b ? a : b) : (a ?? b));
const union = <T>(a: readonly T[], b: readonly T[]) => [...new Set([...a, ...b])];

function mergeRecord<T>(a: Record<string, T>, b: Record<string, T>, pick: (x: T, y: T) => T): Record<string, T> {
  const out: Record<string, T> = { ...b };
  for (const [k, v] of Object.entries(a)) out[k] = k in b ? pick(v, b[k] as T) : v;
  return out;
}

export function mergeLesson(a: LessonState, b: LessonState): LessonState {
  const startedAt = minStr(a.startedAt, b.startedAt) ?? a.startedAt;
  if (a.status === 'completed' || b.status === 'completed') {
    // Completada gana; el paso vuelve a 0 como en `completeLesson`.
    return { status: 'completed', step: 0, startedAt, completedAt: minStr(a.completedAt, b.completedAt) };
  }
  return { status: 'in-progress', step: Math.max(a.step, b.step), startedAt };
}

export function mergeProgress<T extends ProgressDoc>(local: T, remote: Partial<ProgressDoc> | null | undefined): T {
  if (!remote) return local;
  const r = remote;
  const longer = (x: Outcome[], y: Outcome[]) => (y.length > x.length ? y : x);
  const reviews = new Map<string, ReviewItem>();
  for (const it of r.reviews ?? []) reviews.set(it.ref, it);
  for (const it of local.reviews) reviews.set(it.ref, it);

  return {
    ...local,
    lessons: mergeRecord(local.lessons, r.lessons ?? {}, mergeLesson),
    unitOutcomes: mergeRecord(local.unitOutcomes, r.unitOutcomes ?? {}, longer),
    skillOutcomes: mergeRecord(
      local.skillOutcomes as Record<string, Outcome[]>,
      (r.skillOutcomes ?? {}) as Record<string, Outcome[]>,
      longer,
    ),
    xp: Math.max(local.xp, r.xp ?? 0),
    xpByDay: mergeRecord(local.xpByDay, r.xpByDay ?? {}, Math.max),
    dayStats: mergeRecord(local.dayStats, r.dayStats ?? {}, (x, y) => ({
      lessons: Math.max(x.lessons, y.lessons),
      correct: Math.max(x.correct, y.correct),
    })),
    activeDays: union(local.activeDays, r.activeDays ?? []).sort(),
    reviews: [...reviews.values()],
    notebook: mergeRecord(local.notebook, (r.notebook ?? {}) as T['notebook'], (x, y) =>
      y.lastWrongOn > x.lastWrongOn ? { ...y, addedOn: minStr(x.addedOn, y.addedOn)! } : { ...x, addedOn: minStr(x.addedOn, y.addedOn)! },
    ),
    usage: mergeRecord(
      local.usage as Record<string, Record<string, number>>,
      (r.usage ?? {}) as Record<string, Record<string, number>>,
      (x, y) => mergeRecord(x, y, Math.max),
    ),
    practiceDifficulty: { ...(r.practiceDifficulty ?? {}), ...local.practiceDifficulty },
    lastLessonId: local.lastLessonId ?? r.lastLessonId ?? null,
    attempts: Math.max(local.attempts, r.attempts ?? 0),
    seeded: local.seeded || !!r.seeded,
    simScores: { ...(r.simScores ?? {}), ...local.simScores },
    counters: {
      ahas: Math.max(local.counters.ahas, r.counters?.ahas ?? 0),
      reviewCorrect: Math.max(local.counters.reviewCorrect, r.counters?.reviewCorrect ?? 0),
    },
    badges: mergeRecord(local.badges, r.badges ?? {}, (x, y) => minStr(x, y)!),
    // Los logros que llegan de la nube ya se celebraron en el otro teléfono.
    unseenBadges: local.unseenBadges,
    flashBest: Math.max(local.flashBest, r.flashBest ?? 0),
    savedFormulas: union(local.savedFormulas, r.savedFormulas ?? []),
  };
}

type HasId = { id: string; finishedAt: string };
export type ExamsDoc<R extends HasId = HasId, A = unknown, I = unknown> = { active: A | null; activeIntensive: I | null; history: R[] };

export function mergeExams<D extends ExamsDoc>(local: D, remote: Partial<D> | null | undefined, max = 40): D {
  if (!remote) return local;
  const byId = new Map<string, D['history'][number]>();
  for (const h of remote.history ?? []) byId.set(h.id, h);
  for (const h of local.history) byId.set(h.id, h);
  const history = [...byId.values()].sort((a, b) => (a.finishedAt < b.finishedAt ? 1 : -1)).slice(0, max);
  const done = new Set(history.map((h) => h.id));
  // El ensayo en curso: el de este teléfono; si no hay, el de la nube (si no se terminó ya).
  const remoteActive = remote.active as { id?: string } | null | undefined;
  const useRemote = !local.active && remoteActive && !done.has(remoteActive.id ?? '');
  return {
    ...local,
    history,
    active: useRemote ? (remote.active as D['active']) : local.active,
    activeIntensive: useRemote ? ((remote.activeIntensive ?? null) as D['activeIntensive']) : local.activeIntensive,
  };
}

export type IntensivesDoc = { active: IntensiveState | null; finished: IntensiveState[] };

const intensiveKey = (s: IntensiveState) => `${s.id}@${s.startedOn}`;

export function mergeIntensives<D extends IntensivesDoc>(local: D, remote: Partial<IntensivesDoc> | null | undefined): D {
  if (!remote) return local;
  const byKey = new Map<string, IntensiveState>();
  for (const f of remote.finished ?? []) byKey.set(intensiveKey(f), f);
  for (const f of local.finished) byKey.set(intensiveKey(f), f);
  const finished = [...byKey.values()].sort((a, b) => (a.startedOn < b.startedOn ? 1 : -1));
  let active = local.active;
  const ra = remote.active;
  if (ra && byKey.has(intensiveKey(ra))) {
    // ya terminado en algún teléfono
  } else if (!active) active = ra ?? null;
  else if (ra && intensiveKey(ra) === intensiveKey(active) && ra.doneDates.length > active.doneDates.length) active = ra;
  if (active && byKey.has(intensiveKey(active))) active = null;
  return { ...local, active, finished };
}

export type OnboardingDoc<A extends { name: string; trialStartedAt?: string }> = { answers: A; step: string; completed: boolean };

/** El apodo nunca sube a la nube (PRD §2.2): se conserva el del teléfono. La prueba parte en la fecha más antigua. */
export function mergeOnboarding<A extends { name: string; trialStartedAt?: string }, D extends OnboardingDoc<A>>(
  local: D,
  remote: Partial<OnboardingDoc<A>> | null | undefined,
): D {
  if (!remote?.answers) return local;
  const trialStartedAt = minStr(local.answers.trialStartedAt, remote.answers.trialStartedAt);
  if (!local.completed && remote.completed) {
    return { ...local, answers: { ...remote.answers, name: local.answers.name, trialStartedAt }, step: remote.step ?? local.step, completed: true };
  }
  return { ...local, answers: { ...local.answers, trialStartedAt } };
}
