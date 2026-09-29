/** Pesos chilenos para texto de interfaz: 3990 → "$3.990" (sin depender de Intl). */
export const clp = (n: number) => `$${String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
const WEEKDAYS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

/** `2026-12-09` → «9 de diciembre de 2026». */
export function longDate(key: string): string {
  const [y, m, d] = key.slice(0, 10).split('-').map(Number) as [number, number, number];
  return `${d} de ${MONTHS[m - 1]} de ${y}`;
}

/** Fecha y hora local: «lunes 5 de octubre, 20:00». */
export function dateTime(date: Date): string {
  const hh = String(date.getHours()).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  return `${WEEKDAYS[date.getDay()]} ${date.getDate()} de ${MONTHS[date.getMonth()]}, ${hh}:${mm}`;
}

/** Un plazo que vence a medianoche se muestra como «23:59» del día anterior (se entiende mejor). */
export const lastMinute = (d: Date) => new Date(d.getTime() - 60_000);
