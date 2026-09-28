import { addDays, type DayKey, isoWeekKey } from './dates';

export type StreakInfo = {
  /** Días activos seguidos (los días de descanso protegen la racha pero no suman). */
  current: number;
  activeToday: boolean;
  /** Días de descanso usados dentro de la racha actual. */
  restDays: DayKey[];
  /** ¿Ya se usó el descanso de esta semana? Si hoy no estudias, mañana se corta. */
  restUsedThisWeek: boolean;
};

const MAX_LOOKBACK = 800;

/**
 * Racha amable (PRD §13): 1 día de descanso automático por semana ISO.
 * Hoy sin actividad no corta la racha (todavía puedes cumplir); dos faltas en la misma semana sí.
 */
export function streakOf(activeDays: ReadonlySet<DayKey>, today: DayKey): StreakInfo {
  const activeToday = activeDays.has(today);
  const usedWeeks = new Set<string>();
  const restDays: DayKey[] = [];
  let pending: DayKey[] = []; // descansos que solo cuentan si antes hay un día activo que unir
  let current = 0;
  let day = activeToday ? today : addDays(today, -1);

  for (let i = 0; i < MAX_LOOKBACK; i++) {
    if (activeDays.has(day)) {
      current++;
      restDays.push(...pending);
      pending = [];
    } else {
      const week = isoWeekKey(day);
      if (usedWeeks.has(week)) break;
      usedWeeks.add(week);
      pending.push(day);
    }
    day = addDays(day, -1);
  }

  return {
    current,
    activeToday,
    restDays: current > 0 ? restDays : [],
    restUsedThisWeek: current > 0 && restDays.some((d) => isoWeekKey(d) === isoWeekKey(today)),
  };
}

/** Día activo = ≥ 1 lección completada o ≥ N pasos correctos (PRD §13 / plan §5.2). */
export function isActiveDay(lessonsCompleted: number, correctSteps: number, minCorrect = 5): boolean {
  return lessonsCompleted >= 1 || correctSteps >= minCorrect;
}
