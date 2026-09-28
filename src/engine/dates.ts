/**
 * Fechas locales como texto `AAAA-MM-DD` (la racha y los límites se cuentan en la fecha del teléfono).
 * Toda la aritmética se hace en UTC sobre esa fecha para no depender de husos ni cambios de hora.
 */

export type DayKey = string;

const pad = (n: number) => String(n).padStart(2, '0');

/** Fecha local del dispositivo → `AAAA-MM-DD`. */
export function dayKey(d: Date): DayKey {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function toUtc(key: DayKey): number {
  const [y, m, d] = key.split('-').map(Number) as [number, number, number];
  return Date.UTC(y, m - 1, d);
}

function fromUtc(ms: number): DayKey {
  const d = new Date(ms);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

export const addDays = (key: DayKey, n: number): DayKey => fromUtc(toUtc(key) + n * 86_400_000);

/** Días desde `a` hasta `b` (positivo si `b` es posterior). */
export const diffDays = (a: DayKey, b: DayKey): number => Math.round((toUtc(b) - toUtc(a)) / 86_400_000);

/** Semana ISO (lunes a domingo) como `AAAA-Www`. */
export function isoWeekKey(key: DayKey): string {
  const t = new Date(toUtc(key));
  const dow = (t.getUTCDay() + 6) % 7; // lunes = 0
  t.setUTCDate(t.getUTCDate() - dow + 3); // jueves de esa semana
  const year = t.getUTCFullYear();
  // La semana 1 es la que contiene el primer jueves del año.
  const week = 1 + Math.floor((t.getTime() - Date.UTC(year, 0, 1)) / 86_400_000 / 7);
  return `${year}-W${pad(week)}`;
}

export const monthKey = (key: DayKey): string => key.slice(0, 7);

/** Lunes de la semana de `key`. */
export function weekStart(key: DayKey): DayKey {
  const dow = (new Date(toUtc(key)).getUTCDay() + 6) % 7;
  return addDays(key, -dow);
}
