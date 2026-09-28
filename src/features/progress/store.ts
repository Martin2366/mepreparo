import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Skill } from '@/content/schema';
import { logAttempt } from '@/data/attempts';
import { addDays, type DayKey, dayKey } from '@/engine/dates';
import { consume, type Feature, type Usage } from '@/engine/entitlements';
import type { Difficulty } from '@/engine/generators';
import { afterReview, type ReviewItem, scheduleNew } from '@/engine/review';
import { isActiveDay } from '@/engine/streak';
import type { ScoreKey, Scores } from '@/engine/weighted';
import { lessonBonus, type Outcome, stepXp } from '@/engine/xp';
import { kv } from '@/lib/kv';

import progression from '@/content/progression.json';

export type LessonState = { step: number; status: 'in-progress' | 'completed'; startedAt: string; completedAt?: string };

/** Una entrada del cuaderno de errores: lo necesario para volver a mostrar el ejercicio y su explicación. */
export type NotebookEntry = {
  ref: string;
  unitId?: string;
  lessonId?: string;
  prompt: string;
  feedback?: string;
  addedOn: DayKey;
  lastWrongOn: DayKey;
};

export type AnswerInput = {
  ref: string;
  kind: 'lesson' | 'practice' | 'review' | 'exam';
  unitId?: string;
  lessonId?: string;
  stepIndex?: number;
  skill?: Skill;
  outcome: Outcome;
  hints: number;
  mistakeCode?: string;
  answer?: string;
  /** Para el cuaderno de errores cuando la respuesta es incorrecta. */
  notebook?: { prompt: string; feedback?: string };
};

type DayStats = { lessons: number; correct: number };

type ProgressState = {
  lessons: Record<string, LessonState>;
  unitOutcomes: Record<string, Outcome[]>;
  skillOutcomes: Partial<Record<Skill, Outcome[]>>;
  xp: number;
  xpByDay: Record<DayKey, number>;
  dayStats: Record<DayKey, DayStats>;
  activeDays: DayKey[];
  reviews: ReviewItem[];
  notebook: Record<string, NotebookEntry>;
  usage: Usage;
  practiceDifficulty: Record<string, Difficulty>;
  lastLessonId: string | null;
  attempts: number;
  seeded: boolean;
  /** Puntajes que el estudiante ingresa en el simulador (NEM, Ranking y pruebas que no son M1). */
  simScores: Scores;

  seedFromOnboarding: (xp: number) => void;
  answer: (input: AnswerInput) => number;
  setLessonStep: (lessonId: string, step: number) => void;
  completeLesson: (lessonId: string) => number;
  /** Registra un ensayo terminado: cada respuesta cuenta para el dominio y los errores van al cuaderno. */
  recordExam: (items: AnswerInput[]) => number;
  use: (feature: Feature) => void;
  setDifficulty: (unitId: string, d: Difficulty) => void;
  setSimScore: (key: ScoreKey, value: number) => void;
  reset: () => void;
};

const KEEP = 20; // intentos recientes por unidad/habilidad (el dominio usa los últimos 5)
const HISTORY_DAYS = 120;

const push = (list: Outcome[] | undefined, o: Outcome) => [...(list ?? []), o].slice(-KEEP);

/** Deja solo los días recientes en los registros por día. */
function recent<T>(rec: Record<DayKey, T>, today: DayKey): Record<DayKey, T> {
  const from = addDays(today, -HISTORY_DAYS);
  return Object.fromEntries(Object.entries(rec).filter(([d]) => d >= from));
}

function withActive(days: DayKey[], day: DayKey, stats: DayStats): DayKey[] {
  if (days.includes(day) || !isActiveDay(stats.lessons, stats.correct, progression.activeDay.minCorrectSteps)) return days;
  return [...days, day].sort();
}

type Data = Omit<
  ProgressState,
  'seedFromOnboarding' | 'answer' | 'setLessonStep' | 'completeLesson' | 'recordExam' | 'use' | 'setDifficulty' | 'setSimScore' | 'reset'
>;

function log(input: AnswerInput, today: DayKey, xp: number) {
  logAttempt({
    day: today,
    ref: input.ref,
    unitId: input.unitId,
    lessonId: input.lessonId,
    stepIndex: input.stepIndex,
    kind: input.kind,
    outcome: input.outcome,
    hints: input.hints,
    mistakeCode: input.mistakeCode,
    answer: input.answer,
    xp,
  });
}

/** Agregados de una respuesta: XP, racha, dominio, cuaderno de errores y repaso espaciado. */
function applyAnswer(s: Data, input: AnswerInput, today: DayKey, xp: number): Partial<Data> {
  const correct = input.outcome !== 'wrong';
  const stats = s.dayStats[today] ?? { lessons: 0, correct: 0 };
  const nextStats = { ...stats, correct: stats.correct + (correct ? 1 : 0) };
  const reviews = [...s.reviews];
  const notebook = { ...s.notebook };
  const i = reviews.findIndex((r) => r.ref === input.ref);
  if (!correct) {
    const item = scheduleNew(input.ref, today);
    if (i >= 0) reviews[i] = { ...item, addedOn: reviews[i]!.addedOn };
    else reviews.push(item);
    const prev = notebook[input.ref];
    notebook[input.ref] = {
      ref: input.ref,
      unitId: input.unitId,
      lessonId: input.lessonId,
      prompt: input.notebook?.prompt ?? prev?.prompt ?? '',
      feedback: input.notebook?.feedback ?? prev?.feedback,
      addedOn: prev?.addedOn ?? today,
      lastWrongOn: today,
    };
  } else if (i >= 0 && input.kind === 'review') {
    const after = afterReview(reviews[i]!, true, today);
    if (after) reviews[i] = after;
    else {
      reviews.splice(i, 1);
      delete notebook[input.ref];
    }
  }
  return {
    attempts: s.attempts + 1,
    xp: s.xp + xp,
    xpByDay: recent({ ...s.xpByDay, [today]: (s.xpByDay[today] ?? 0) + xp }, today),
    dayStats: recent({ ...s.dayStats, [today]: nextStats }, today),
    activeDays: withActive(s.activeDays, today, nextStats),
    unitOutcomes: input.unitId ? { ...s.unitOutcomes, [input.unitId]: push(s.unitOutcomes[input.unitId], input.outcome) } : s.unitOutcomes,
    skillOutcomes: input.skill ? { ...s.skillOutcomes, [input.skill]: push(s.skillOutcomes[input.skill], input.outcome) } : s.skillOutcomes,
    reviews,
    notebook,
  };
}

const EMPTY = {
  lessons: {},
  unitOutcomes: {},
  skillOutcomes: {},
  xp: 0,
  xpByDay: {},
  dayStats: {},
  activeDays: [],
  reviews: [],
  notebook: {},
  usage: {},
  practiceDifficulty: {},
  lastLessonId: null,
  attempts: 0,
  seeded: false,
  simScores: {},
} satisfies Partial<ProgressState>;

/**
 * Progreso del estudiante, persistido en el teléfono en cada cambio (kv sobre SQLite).
 * Regla del producto: cada respuesta se guarda (registro de intentos + agregados) ANTES de mostrar el feedback;
 * por eso `answer` es síncrono y el componente muestra el feedback después de llamarlo.
 */
export const useProgress = create<ProgressState>()(
  persist(
    (set, get) => ({
      ...EMPTY,

      /** El XP del onboarding y "tu racha parte hoy" se entregan una sola vez. */
      seedFromOnboarding: (xp) => {
        if (get().seeded) return;
        const today = dayKey(new Date());
        set((s) => ({
          seeded: true,
          xp: s.xp + xp,
          xpByDay: { ...s.xpByDay, [today]: (s.xpByDay[today] ?? 0) + xp },
          activeDays: s.activeDays.includes(today) ? s.activeDays : [...s.activeDays, today].sort(),
        }));
      },

      answer: (input) => {
        const today = dayKey(new Date());
        // En un ensayo la XP se entrega al final (recordExam), no pregunta por pregunta.
        const xp = input.kind === 'exam' ? 0 : stepXp(input.outcome, input.kind === 'lesson' ? 'lesson' : 'practice');
        // 1) Registro de intentos (síncrono, a prueba de cierres). 2) Agregados.
        log(input, today, xp);
        set((s) => applyAnswer(s, input, today, xp));
        return xp;
      },

      recordExam: (items) => {
        const today = dayKey(new Date());
        const correct = items.filter((it) => it.outcome !== 'wrong').length;
        const bonus = correct * progression.xp.examCorrect + progression.xp.examComplete;
        for (const it of items) log({ ...it, kind: 'exam' }, today, 0);
        // Una sola escritura: cada respuesta cuenta para el dominio, la racha y el cuaderno, y la XP va al final.
        set((s) => {
          let acc: Data = s;
          for (const it of items) acc = { ...acc, ...applyAnswer(acc, { ...it, kind: 'exam' }, today, 0) };
          return {
            ...acc,
            xp: acc.xp + bonus,
            xpByDay: { ...acc.xpByDay, [today]: (acc.xpByDay[today] ?? 0) + bonus },
          };
        });
        return bonus;
      },

      setLessonStep: (lessonId, step) =>
        set((s) => {
          const prev = s.lessons[lessonId];
          return {
            lastLessonId: lessonId,
            lessons: {
              ...s.lessons,
              [lessonId]: {
                startedAt: prev?.startedAt ?? new Date().toISOString(),
                status: prev?.status === 'completed' ? 'completed' : 'in-progress',
                completedAt: prev?.completedAt,
                step,
              },
            },
          };
        }),

      completeLesson: (lessonId) => {
        const today = dayKey(new Date());
        const first = get().lessons[lessonId]?.status !== 'completed';
        const bonus = first ? lessonBonus() : 0;
        set((s) => {
          const stats = s.dayStats[today] ?? { lessons: 0, correct: 0 };
          const nextStats = { ...stats, lessons: stats.lessons + 1 };
          return {
            lessons: {
              ...s.lessons,
              [lessonId]: {
                startedAt: s.lessons[lessonId]?.startedAt ?? new Date().toISOString(),
                status: 'completed',
                completedAt: s.lessons[lessonId]?.completedAt ?? new Date().toISOString(),
                step: 0,
              },
            },
            xp: s.xp + bonus,
            xpByDay: { ...s.xpByDay, [today]: (s.xpByDay[today] ?? 0) + bonus },
            dayStats: { ...s.dayStats, [today]: nextStats },
            activeDays: withActive(s.activeDays, today, nextStats),
          };
        });
        return bonus;
      },

      use: (feature) => set((s) => ({ usage: consume(feature, s.usage, dayKey(new Date())) })),

      setDifficulty: (unitId, d) => set((s) => ({ practiceDifficulty: { ...s.practiceDifficulty, [unitId]: d } })),

      setSimScore: (key, value) =>
        set((s) => ({ simScores: { ...s.simScores, [key]: Math.max(100, Math.min(1000, Math.round(value))) } })),

      reset: () => set({ ...EMPTY }),
    }),
    {
      name: 'mp.progress.v1',
      storage: createJSONStorage(() => kv),
      partialize: (s) => {
        const {
          seedFromOnboarding: _a,
          answer: _b,
          setLessonStep: _c,
          completeLesson: _d,
          recordExam: _i,
          use: _e,
          setDifficulty: _f,
          setSimScore: _h,
          reset: _g,
          ...data
        } = s;
        return data;
      },
    },
  ),
);
