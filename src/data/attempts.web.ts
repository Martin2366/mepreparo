import type { Attempt, AttemptInput } from './attempt-types';

export type { Attempt, AttemptInput } from './attempt-types';

/**
 * Versión web (solo vista previa de diseño): `expo-sqlite` en web está en alfa (D16),
 * así que los intentos y la cola se guardan en localStorage con un tope.
 */
const KEY = 'mp.attempts.v1';
const OUTBOX = 'mp.outbox.v1';
const CAP = 2000;

type Row = Attempt & { synced?: boolean };

function read<T>(key: string): T[] {
  try {
    return JSON.parse(globalThis.localStorage?.getItem(key) ?? '[]') as T[];
  } catch {
    return [];
  }
}

function write(key: string, rows: unknown[]) {
  try {
    globalThis.localStorage?.setItem(key, JSON.stringify(rows.slice(-CAP)));
  } catch {
    // Sin almacenamiento: la vista previa sigue en memoria.
  }
}

const uuid = () => globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;

export function logAttempt(input: AttemptInput): Attempt {
  const row: Attempt = { ...input, id: uuid(), createdAt: new Date().toISOString() };
  write(KEY, [...read<Row>(KEY), row]);
  return row;
}

export const countAttempts = (): number => read(KEY).length;

export const pendingSync = (limit = 200): Attempt[] =>
  read<Row>(KEY)
    .filter((r) => !r.synced)
    .slice(0, limit)
    .map(({ synced: _s, ...r }) => r);

export function markSynced(ids: readonly string[]): void {
  const set = new Set(ids);
  write(KEY, read<Row>(KEY).map((r) => (set.has(r.id) ? { ...r, synced: true } : r)));
}

export function markAllUnsynced(): void {
  write(KEY, read<Row>(KEY).map((r) => ({ ...r, synced: false })));
}

export function clearLocalData(): void {
  write(KEY, []);
  write(OUTBOX, []);
}

export type OutboxItem = { id: string; createdAt: string; kind: 'event' | 'report'; payload: Record<string, unknown> };

export function enqueue(kind: OutboxItem['kind'], payload: Record<string, unknown>): void {
  write(OUTBOX, [...read<OutboxItem>(OUTBOX), { id: uuid(), createdAt: new Date().toISOString(), kind, payload }]);
}

export const pendingOutbox = (limit = 200): OutboxItem[] => read<OutboxItem>(OUTBOX).slice(0, limit);

export function removeOutbox(ids: readonly string[]): void {
  const set = new Set(ids);
  write(OUTBOX, read<OutboxItem>(OUTBOX).filter((r) => !set.has(r.id)));
}
