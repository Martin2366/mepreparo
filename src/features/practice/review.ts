import type { Step } from '@/content/schema';
import { addDays, type DayKey } from '@/engine/dates';
import limits from '@/content/limits.json';
import { fromRef } from '@/engine/generators';
import { lessonById } from '@/features/content/catalog';

/** Vuelve a construir el ejercicio de una entrada del cuaderno desde su referencia estable. */
export function stepFromRef(ref: string): Step | null {
  if (ref.startsWith('gen:')) return fromRef(ref.slice(4))?.step ?? null;
  if (ref.startsWith('lesson:')) {
    const [, lessonId, stepId] = ref.split(':');
    const found = lessonId ? lessonById(lessonId) : undefined;
    return found?.lesson.steps.find((s) => s.id === stepId) ?? null;
  }
  return null;
}

/** Plan gratis: el cuaderno muestra los errores de los últimos 7 días (PRD §4.2). */
export const freeNotebookFrom = (today: DayKey): DayKey => addDays(today, -limits.errorNotebookFreeDays);
