import { addDays, type DayKey } from './dates';

/** Repaso espaciado del cuaderno de errores (PRD §9): vuelve a los 1, 3, 7 y 14 días. */
export const INTERVALS = [1, 3, 7, 14] as const;

export type ReviewItem = {
  /** Referencia estable al ejercicio: `lesson:<id>:<paso>` o `gen:<generador>:<semilla>`. */
  ref: string;
  /** Etapa 0–3 (índice de `INTERVALS`). */
  stage: number;
  due: DayKey;
  addedOn: DayKey;
};

/** Un error nuevo (o repetido) entra en la etapa 0: vuelve mañana. */
export function scheduleNew(ref: string, today: DayKey): ReviewItem {
  return { ref, stage: 0, due: addDays(today, INTERVALS[0]), addedOn: today };
}

/**
 * Resultado de un repaso. Acierto → siguiente intervalo; tras el último, el error queda superado (`null`).
 * Error → vuelve a la etapa 0.
 */
export function afterReview(item: ReviewItem, correct: boolean, today: DayKey): ReviewItem | null {
  if (!correct) return { ...item, stage: 0, due: addDays(today, INTERVALS[0]) };
  const stage = item.stage + 1;
  const days = INTERVALS[stage];
  if (days === undefined) return null;
  return { ...item, stage, due: addDays(today, days) };
}

export const dueItems = (items: readonly ReviewItem[], today: DayKey): ReviewItem[] =>
  items.filter((i) => i.due <= today).sort((a, b) => (a.due < b.due ? -1 : a.due > b.due ? 1 : 0));
