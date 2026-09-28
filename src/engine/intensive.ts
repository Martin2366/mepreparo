import type { DayKey } from './dates';

export type Program = {
  id: string;
  title: string;
  summary: string;
  days: number;
  dailyPractice: number;
  exam: { count: number; minutes: number };
  unitIds: string[];
};

export type IntensiveState = {
  id: string;
  startedOn: DayKey;
  /** Fecha en que se completó cada día (índice 0 = día 1). */
  doneDates: DayKey[];
  entry?: { score: number; examId: string };
  exit?: { score: number; examId: string };
};

/** Unidad del día (1-indexado): se recorren las unidades del programa en orden, en ciclo. */
export const unitForDay = (p: Program, day: number): string => p.unitIds[(day - 1) % p.unitIds.length]!;

export type NextStep =
  | { kind: 'entry' }
  | { kind: 'day'; day: number; unitId: string; count: number }
  | { kind: 'wait'; day: number }
  | { kind: 'exit' }
  | { kind: 'done' };

/**
 * Qué toca ahora en un intensivo (a tu ritmo, pero máximo una sesión por día para que sea un hábito):
 * ensayo de entrada → sesiones diarias → ensayo de salida.
 */
export function nextStep(p: Program, st: IntensiveState, today: DayKey): NextStep {
  if (!st.entry) return { kind: 'entry' };
  const done = st.doneDates.length;
  if (done >= p.days) return st.exit ? { kind: 'done' } : { kind: 'exit' };
  const day = done + 1;
  if (st.doneDates[done - 1] === today) return { kind: 'wait', day };
  return { kind: 'day', day, unitId: unitForDay(p, day), count: p.dailyPractice };
}

/** El día 1 (con su ensayo de entrada) es gratis; el resto es Premium. */
export const isFreeDay = (day: number) => day <= 1;
