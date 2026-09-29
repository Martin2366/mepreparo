import { addDays, type DayKey, dayKey } from './dates';

/**
 * Reglas de Premium que no dependen de la tienda (PRD §4). Todo con fechas del teléfono y sin estado
 * que se pueda reiniciar: la oferta de 48 h se calcula desde el fin de la prueba, así que reabrir la app no la renueva.
 */

export type Session = { start: string | null; end?: string | null };

/** Días de gracia después de la PAES para revisar resultados antes de que termine el pase. */
const PASS_GRACE_DAYS = 7;
/** Si aún no hay fechas oficiales publicadas de la próxima PAES, el pase dura un año. */
const PASS_FALLBACK_DAYS = 365;

/**
 * Pase PAES: pago único "hasta tu próxima PAES" (§4.3). Vence 7 días después del fin de la próxima PAES con
 * fecha conocida; si no hay ninguna publicada, en 365 días. Se calcula una vez al comprar y se guarda.
 */
export function passUntil(purchasedOn: DayKey, sessions: readonly Session[]): DayKey {
  const next = sessions
    .map((s) => s.end ?? s.start)
    .filter((d): d is string => !!d && d >= purchasedOn)
    .sort()[0];
  return next ? addDays(next, PASS_GRACE_DAYS) : addDays(purchasedOn, PASS_FALLBACK_DAYS);
}

/**
 * Fin de la prueba: medianoche local del día inicio + N (igual que `planState`, que cuenta por fecha del teléfono).
 */
export function trialEndsAt(trialStartedAt: string, trialDays: number): Date {
  const [y, m, d] = addDays(dayKey(new Date(trialStartedAt)), trialDays).split('-').map(Number) as [number, number, number];
  return new Date(y, m - 1, d);
}

export type Offer = { active: boolean; endsAt: Date; msLeft: number };

/** Oferta de fin de prueba: X % durante 48 h reales desde que termina la prueba, una sola vez (§4.1). */
export function endOfTrialOffer(
  trialStartedAt: string | undefined,
  now: Date,
  opts: { trialDays: number; offerHours: number; used: boolean },
): Offer | null {
  if (!trialStartedAt || opts.used) return null;
  const start = trialEndsAt(trialStartedAt, opts.trialDays);
  const endsAt = new Date(start.getTime() + opts.offerHours * 3_600_000);
  const msLeft = endsAt.getTime() - now.getTime();
  return { active: now >= start && msLeft > 0, endsAt, msLeft };
}

export type TrialNotice = 'day5' | 'day7' | 'ended';

/**
 * Aviso que corresponde mostrar hoy (§4.1): día 5 ("te quedan 2 días"), día 7 ("hoy termina") y, al terminar,
 * la pantalla de lo que conservas gratis. Cada aviso se muestra una sola vez.
 */
export function trialNotice(
  trialStartedAt: string | undefined,
  now: Date,
  trialDays: number,
  seen: Partial<Record<TrialNotice, boolean>>,
  premium: boolean,
): TrialNotice | null {
  if (!trialStartedAt || premium) return null;
  const end = trialEndsAt(trialStartedAt, trialDays);
  if (now >= end) return seen.ended ? null : 'ended';
  const daysLeft = Math.ceil((end.getTime() - now.getTime()) / 86_400_000);
  if (daysLeft <= 1) return seen.day7 ? null : 'day7';
  if (daysLeft <= 2) return seen.day5 ? null : 'day5';
  return null;
}

/** Premium pagado vigente hasta el mayor de los vencimientos conocidos (suscripción o pase). */
export function latest(...dates: (string | null | undefined)[]): DayKey | null {
  const valid = dates.filter((d): d is string => !!d).map((d) => (d.length > 10 ? dayKey(new Date(d)) : d));
  return valid.length ? valid.sort().at(-1)! : null;
}
