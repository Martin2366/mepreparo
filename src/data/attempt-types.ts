import type { DayKey } from '@/engine/dates';
import type { Outcome } from '@/engine/xp';

export type AttemptInput = {
  day: DayKey;
  /** `lesson:<id>:<paso>` o `gen:<generador>:<semilla>:<dificultad>`. */
  ref: string;
  unitId?: string;
  lessonId?: string;
  stepIndex?: number;
  kind: 'lesson' | 'practice' | 'review';
  outcome: Outcome;
  hints: number;
  mistakeCode?: string;
  /** Respuesta del estudiante serializada (para mejorar el contenido). */
  answer?: string;
  xp: number;
};

export type Attempt = AttemptInput & { id: string; createdAt: string };
