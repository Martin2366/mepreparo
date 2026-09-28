import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { buildExam, type ExamQuestion, type ExamResult, type ExamSpec, gradeExam } from '@/engine/exam';
import { curriculum } from '@/features/content/catalog';
import { kv } from '@/lib/kv';

export type ActiveExam = {
  id: string;
  spec: ExamSpec;
  seed: number;
  questions: ExamQuestion[];
  answers: (number | null)[];
  flagged: boolean[];
  index: number;
  startedAt: string;
  /** Tiempo usado (solo cuenta con la pantalla del ensayo abierta). */
  elapsedMs: number;
};

export type ExamRecord = {
  id: string;
  spec: ExamSpec;
  questions: ExamQuestion[];
  answers: (number | null)[];
  startedAt: string;
  finishedAt: string;
  elapsedMs: number;
  result: ExamResult;
  /** Ensayo de entrada o salida de un intensivo. */
  intensive?: { id: string; stage: 'entry' | 'exit' };
};

type ExamState = {
  active: ActiveExam | null;
  /** Etiqueta de intensivo del ensayo activo, si corresponde. */
  activeIntensive: ExamRecord['intensive'] | null;
  history: ExamRecord[];
  start: (spec: ExamSpec, intensive?: ExamRecord['intensive']) => ActiveExam;
  answer: (i: number, choice: number) => void;
  toggleFlag: (i: number) => void;
  goTo: (i: number) => void;
  addTime: (ms: number) => void;
  finish: () => ExamRecord | null;
  discard: () => void;
};

const HISTORY_MAX = 40;

/** Banco para armar ensayos: los ejes del currículo con los generadores de cada unidad. */
export const bank = curriculum.axes.map((a) => ({
  id: a.id,
  share: a.share,
  units: a.units.map((u) => ({ id: u.id, generators: u.generators })),
}));

/**
 * Ensayos (PRD §9): cada respuesta se guarda al instante; si sales o se cierra la app, retomas donde quedaste
 * (queja fuerte contra la competencia). El historial guarda las referencias para revisar cada pregunta.
 */
export const useExams = create<ExamState>()(
  persist(
    (set, get) => ({
      active: null,
      activeIntensive: null,
      history: [],

      start: (spec, intensive) => {
        const seed = Math.floor(Math.random() * 2_000_000_000);
        const questions = buildExam(bank, spec, seed);
        const exam: ActiveExam = {
          id: `${Date.now().toString(36)}-${seed.toString(36)}`,
          spec,
          seed,
          questions,
          answers: questions.map(() => null),
          flagged: questions.map(() => false),
          index: 0,
          startedAt: new Date().toISOString(),
          elapsedMs: 0,
        };
        set({ active: exam, activeIntensive: intensive ?? null });
        return exam;
      },

      answer: (i, choice) =>
        set((s) => (s.active ? { active: { ...s.active, answers: s.active.answers.map((a, k) => (k === i ? choice : a)) } } : s)),

      toggleFlag: (i) =>
        set((s) => (s.active ? { active: { ...s.active, flagged: s.active.flagged.map((f, k) => (k === i ? !f : f)) } } : s)),

      goTo: (i) => set((s) => (s.active ? { active: { ...s.active, index: Math.max(0, Math.min(s.active.questions.length - 1, i)) } } : s)),

      addTime: (ms) => set((s) => (s.active && ms > 0 ? { active: { ...s.active, elapsedMs: s.active.elapsedMs + ms } } : s)),

      finish: () => {
        const { active, activeIntensive } = get();
        if (!active) return null;
        const record: ExamRecord = {
          id: active.id,
          spec: active.spec,
          questions: active.questions,
          answers: active.answers,
          startedAt: active.startedAt,
          finishedAt: new Date().toISOString(),
          elapsedMs: active.elapsedMs,
          result: gradeExam(active.questions, active.answers),
          intensive: activeIntensive ?? undefined,
        };
        set((s) => ({ active: null, activeIntensive: null, history: [record, ...s.history].slice(0, HISTORY_MAX) }));
        return record;
      },

      discard: () => set({ active: null, activeIntensive: null }),
    }),
    {
      name: 'mp.exams.v1',
      storage: createJSONStorage(() => kv),
      partialize: (s) => ({ active: s.active, activeIntensive: s.activeIntensive, history: s.history }),
    },
  ),
);
