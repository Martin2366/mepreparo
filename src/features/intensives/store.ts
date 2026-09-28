import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import intensivesJson from '@/content/intensives.json';
import { dayKey } from '@/engine/dates';
import type { IntensiveState, Program } from '@/engine/intensive';
import { kv } from '@/lib/kv';

export const PROGRAMS = intensivesJson.programs as Program[];
export const programById = (id: string) => PROGRAMS.find((p) => p.id === id);

type State = {
  active: IntensiveState | null;
  finished: IntensiveState[];
  start: (id: string) => void;
  completeDay: (id: string, day: number) => void;
  setExam: (id: string, stage: 'entry' | 'exit', score: number, examId: string) => void;
  abandon: () => void;
};

/** Intensivo activo (uno a la vez) y los terminados. */
export const useIntensives = create<State>()(
  persist(
    (set) => ({
      active: null,
      finished: [],
      start: (id) => set({ active: { id, startedOn: dayKey(new Date()), doneDates: [] } }),
      completeDay: (id, day) =>
        set((s) => {
          const a = s.active;
          // Solo cuenta si es el día que tocaba (evita duplicados al volver atrás).
          if (!a || a.id !== id || a.doneDates.length !== day - 1) return s;
          return { active: { ...a, doneDates: [...a.doneDates, dayKey(new Date())] } };
        }),
      setExam: (id, stage, score, examId) =>
        set((s) => {
          const a = s.active;
          if (!a || a.id !== id) return s;
          const next = { ...a, [stage]: { score, examId } };
          return stage === 'exit' ? { active: null, finished: [next, ...s.finished] } : { active: next };
        }),
      abandon: () => set({ active: null }),
    }),
    { name: 'mp.intensives.v1', storage: createJSONStorage(() => kv), partialize: (s) => ({ active: s.active, finished: s.finished }) },
  ),
);
