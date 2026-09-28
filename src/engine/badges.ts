import badgesJson from '@/content/badges.json';

export type BadgeRuleType =
  | 'lessons'
  | 'streak'
  | 'ahas'
  | 'attempts'
  | 'exams'
  | 'fullExams'
  | 'reviewCorrect'
  | 'axesPracticed'
  | 'masteredUnits'
  | 'masteredAxes'
  | 'level'
  | 'bestExamScore';

export type Badge = {
  id: string;
  title: string;
  description: string;
  icon: string;
  premium?: boolean;
  rule: { type: BadgeRuleType; min: number };
};

export const BADGES = badgesJson.badges as Badge[];

/** Métricas del estudiante contra las que se evalúan las reglas. */
export type BadgeStats = Record<BadgeRuleType, number>;

/**
 * Logros que cumple el estudiante (PRD §11). Los de maestría solo se ganan con Premium; al terminar
 * Premium no se pierde nada de lo ya ganado.
 */
export function satisfiedBadges(stats: BadgeStats, premium: boolean, badges: readonly Badge[] = BADGES): string[] {
  return badges.filter((b) => (!b.premium || premium) && (stats[b.rule.type] ?? 0) >= b.rule.min).map((b) => b.id);
}

/** Los que se acaban de ganar (una sola vez cada uno). */
export function newBadges(stats: BadgeStats, premium: boolean, earned: Readonly<Record<string, unknown>>): string[] {
  return satisfiedBadges(stats, premium).filter((id) => !(id in earned));
}
