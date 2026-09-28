import type { Attempt, AttemptInput } from './attempt-types';

export type { Attempt, AttemptInput } from './attempt-types';

/**
 * Versión web (solo vista previa de diseño): `expo-sqlite` en web está en alfa (D16),
 * así que los intentos se guardan en localStorage con un tope.
 */
const KEY = 'mp.attempts.v1';
const CAP = 2000;

function read(): Attempt[] {
  try {
    return JSON.parse(globalThis.localStorage?.getItem(KEY) ?? '[]') as Attempt[];
  } catch {
    return [];
  }
}

export function logAttempt(input: AttemptInput): Attempt {
  const row: Attempt = { ...input, id: globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`, createdAt: new Date().toISOString() };
  try {
    const all = read();
    all.push(row);
    globalThis.localStorage?.setItem(KEY, JSON.stringify(all.slice(-CAP)));
  } catch {
    // Sin almacenamiento: la vista previa sigue en memoria.
  }
  return row;
}

export const countAttempts = (): number => read().length;

export const pendingSync = (limit = 200): Attempt[] => read().slice(0, limit);
