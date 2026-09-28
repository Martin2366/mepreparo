import limitsConfig from '@/content/limits.json';

import { addDays, type DayKey, dayKey, diffDays, isoWeekKey, monthKey } from './dates';

/**
 * Plan del estudiante y límites del plan gratis (PRD §4). La prueba de 7 días la gestiona la app:
 * no pide tarjeta y nunca se convierte en cobro.
 */
export type Feature = keyof typeof limitsConfig.free;
export type Period = 'day' | 'week' | 'month';
type Rule = { per: Period; max: number } | null;
type LimitsConfig = {
  trialDays: number;
  free: Record<Feature, Rule>;
  premium: Partial<Record<Feature, Rule>>;
};

export type PlanState =
  | { kind: 'trial'; daysLeft: number; endsOn: DayKey }
  | { kind: 'premium'; until: DayKey | null }
  | { kind: 'free'; trialEndedOn: DayKey | null };

export type EntitlementInput = {
  /** ISO de inicio de la prueba (onboarding). */
  trialStartedAt?: string;
  /** Fecha hasta la que hay Premium pagado (Hito 3, RevenueCat). */
  premiumUntil?: DayKey | null;
};

const cfg = limitsConfig as LimitsConfig;

export function planState(input: EntitlementInput, today: DayKey, config: LimitsConfig = cfg): PlanState {
  if (input.premiumUntil && input.premiumUntil >= today) return { kind: 'premium', until: input.premiumUntil };
  if (input.trialStartedAt) {
    const start = dayKey(new Date(input.trialStartedAt));
    const elapsed = diffDays(start, today);
    const daysLeft = config.trialDays - elapsed;
    const endsOn = addDays(start, config.trialDays);
    if (daysLeft > 0) return { kind: 'trial', daysLeft, endsOn };
    return { kind: 'free', trialEndedOn: endsOn };
  }
  return { kind: 'free', trialEndedOn: null };
}

export const hasPremium = (p: PlanState) => p.kind !== 'free';

/** Contadores de uso: `{ practice: { "2026-09-28": 12 } }`. La clave depende del periodo de la regla. */
export type Usage = Partial<Record<Feature, Record<string, number>>>;

export function periodKey(per: Period, today: DayKey): string {
  return per === 'day' ? today : per === 'week' ? isoWeekKey(today) : monthKey(today);
}

export type Allowance =
  | { ok: true; unlimited: true }
  | { ok: boolean; unlimited: false; used: number; max: number; remaining: number; per: Period };

function ruleFor(feature: Feature, plan: PlanState, config: LimitsConfig): Rule | 'unlimited' {
  if (hasPremium(plan)) return config.premium[feature] ?? 'unlimited';
  return config.free[feature];
}

/** ¿Puede usar la función ahora? Sin regla gratis (`null`) = no incluida en el plan gratis. */
export function allowance(
  feature: Feature,
  plan: PlanState,
  usage: Usage,
  today: DayKey,
  config: LimitsConfig = cfg,
): Allowance {
  const rule = ruleFor(feature, plan, config);
  if (rule === 'unlimited') return { ok: true, unlimited: true };
  if (rule === null) return { ok: false, unlimited: false, used: 0, max: 0, remaining: 0, per: 'day' };
  const used = usage[feature]?.[periodKey(rule.per, today)] ?? 0;
  const remaining = Math.max(0, rule.max - used);
  return { ok: remaining > 0, unlimited: false, used, max: rule.max, remaining, per: rule.per };
}

/** Registra un uso. Guarda los contadores de todos los periodos para que cambiar de plan no los pierda. */
export function consume(feature: Feature, usage: Usage, today: DayKey): Usage {
  const current = { ...(usage[feature] ?? {}) };
  for (const per of ['day', 'week', 'month'] as const) {
    const k = periodKey(per, today);
    current[k] = (current[k] ?? 0) + 1;
  }
  return { ...usage, [feature]: prune(current, today) };
}

/** Deja solo los contadores recientes (el mes actual y lo que cae en él). */
function prune(counts: Record<string, number>, today: DayKey): Record<string, number> {
  const month = monthKey(today);
  const week = isoWeekKey(today);
  return Object.fromEntries(Object.entries(counts).filter(([k]) => k === week || k.startsWith(month) || k >= today));
}

export const PRICES = limitsConfig.prices;
