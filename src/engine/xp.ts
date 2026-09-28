import progression from '@/content/progression.json';

export type Outcome = 'clean' | 'hinted' | 'wrong';

type XpRules = typeof progression.xp;
type Level = { min: number; name: string };

/** XP de un paso respondido. Un error no suma ni resta: aprender nunca se castiga. */
export function stepXp(outcome: Outcome, kind: 'lesson' | 'practice' = 'lesson', rules: XpRules = progression.xp): number {
  if (outcome === 'wrong') return 0;
  if (kind === 'practice') return outcome === 'clean' ? rules.practiceClean : rules.practiceWithHints;
  return outcome === 'clean' ? rules.stepClean : rules.stepWithHints;
}

export const lessonBonus = (rules: XpRules = progression.xp) => rules.lessonComplete;

export type LevelInfo = {
  level: number;
  name: string;
  /** XP dentro del nivel actual y lo que falta para el siguiente (null en el último). */
  into: number;
  toNext: number | null;
  nextName: string | null;
};

export function levelOf(totalXp: number, levels: Level[] = progression.levels): LevelInfo {
  let i = 0;
  while (i + 1 < levels.length && totalXp >= levels[i + 1]!.min) i++;
  const cur = levels[i]!;
  const next = levels[i + 1];
  return {
    level: i + 1,
    name: cur.name,
    into: totalXp - cur.min,
    toNext: next ? next.min - cur.min : null,
    nextName: next?.name ?? null,
  };
}

/** Meta diaria de XP según los minutos elegidos en el onboarding. */
export function dailyGoalXp(minutes: number | undefined, table: Record<string, number> = progression.dailyGoalXp): number {
  const m = minutes ?? 20;
  const keys = Object.keys(table)
    .map(Number)
    .sort((a, b) => a - b);
  const key = keys.reduce((best, k) => (Math.abs(k - m) < Math.abs(best - m) ? k : best), keys[0] ?? 20);
  return table[String(key)] ?? 60;
}
