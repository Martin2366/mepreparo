import { randomUUID } from 'expo-crypto';
import { openDatabaseSync, type SQLiteDatabase } from 'expo-sqlite';

import type { Attempt, AttemptInput } from './attempt-types';

export type { Attempt, AttemptInput } from './attempt-types';

/**
 * Registro de intentos (D16): una fila por respuesta, solo inserción, con uuid generado en el teléfono.
 * Se escribe de forma síncrona ANTES de mostrar el feedback (regla del producto). En el Hito 3, las filas con
 * `synced = 0` se suben a Supabase con `insert … on conflict do nothing` (sincronización idempotente).
 */
let db: SQLiteDatabase | null = null;

function open(): SQLiteDatabase {
  if (db) return db;
  db = openDatabaseSync('mepreparo.db');
  db.execSync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS step_attempts (
      id TEXT PRIMARY KEY NOT NULL,
      created_at TEXT NOT NULL,
      day TEXT NOT NULL,
      ref TEXT NOT NULL,
      unit_id TEXT,
      lesson_id TEXT,
      step_index INTEGER,
      kind TEXT NOT NULL,
      outcome TEXT NOT NULL,
      hints INTEGER NOT NULL DEFAULT 0,
      mistake_code TEXT,
      answer TEXT,
      xp INTEGER NOT NULL DEFAULT 0,
      synced INTEGER NOT NULL DEFAULT 0
    );
    CREATE INDEX IF NOT EXISTS step_attempts_synced ON step_attempts (synced);
    CREATE TABLE IF NOT EXISTS outbox (
      id TEXT PRIMARY KEY NOT NULL,
      created_at TEXT NOT NULL,
      kind TEXT NOT NULL,
      payload TEXT NOT NULL
    );
  `);
  return db;
}

export function logAttempt(input: AttemptInput): Attempt {
  const row: Attempt = { ...input, id: randomUUID(), createdAt: new Date().toISOString() };
  open().runSync(
    `INSERT INTO step_attempts (id, created_at, day, ref, unit_id, lesson_id, step_index, kind, outcome, hints, mistake_code, answer, xp)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    row.id,
    row.createdAt,
    row.day,
    row.ref,
    row.unitId ?? null,
    row.lessonId ?? null,
    row.stepIndex ?? null,
    row.kind,
    row.outcome,
    row.hints,
    row.mistakeCode ?? null,
    row.answer ?? null,
    row.xp,
  );
  return row;
}

export function countAttempts(): number {
  return open().getFirstSync<{ n: number }>('SELECT COUNT(*) AS n FROM step_attempts')?.n ?? 0;
}

export function pendingSync(limit = 200): Attempt[] {
  return open()
    .getAllSync<Record<string, unknown>>('SELECT * FROM step_attempts WHERE synced = 0 ORDER BY created_at LIMIT ?', limit)
    .map((r) => ({
      id: String(r.id),
      createdAt: String(r.created_at),
      day: String(r.day),
      ref: String(r.ref),
      unitId: (r.unit_id as string | null) ?? undefined,
      lessonId: (r.lesson_id as string | null) ?? undefined,
      stepIndex: (r.step_index as number | null) ?? undefined,
      kind: r.kind as Attempt['kind'],
      outcome: r.outcome as Attempt['outcome'],
      hints: Number(r.hints),
      mistakeCode: (r.mistake_code as string | null) ?? undefined,
      answer: (r.answer as string | null) ?? undefined,
      xp: Number(r.xp),
    }));
}

export function markSynced(ids: readonly string[]): void {
  if (!ids.length) return;
  open().runSync(`UPDATE step_attempts SET synced = 1 WHERE id IN (${ids.map(() => '?').join(',')})`, ...ids);
}

/** Al pasar a otra cuenta (Google), todo se vuelve a subir a esa cuenta (la subida es idempotente). */
export function markAllUnsynced(): void {
  open().runSync('UPDATE step_attempts SET synced = 0');
}

/** Borrar mi cuenta y datos: también se borra lo guardado en el teléfono. */
export function clearLocalData(): void {
  open().execSync('DELETE FROM step_attempts; DELETE FROM outbox;');
}

/** Cola de eventos y reportes de contenido: se guardan aquí y se suben en lote cuando hay red. */
export type OutboxItem = { id: string; createdAt: string; kind: 'event' | 'report'; payload: Record<string, unknown> };

export function enqueue(kind: OutboxItem['kind'], payload: Record<string, unknown>): void {
  open().runSync('INSERT INTO outbox (id, created_at, kind, payload) VALUES (?, ?, ?, ?)', randomUUID(), new Date().toISOString(), kind, JSON.stringify(payload));
}

export function pendingOutbox(limit = 200): OutboxItem[] {
  return open()
    .getAllSync<{ id: string; created_at: string; kind: OutboxItem['kind']; payload: string }>('SELECT * FROM outbox ORDER BY created_at LIMIT ?', limit)
    .map((r) => ({ id: r.id, createdAt: r.created_at, kind: r.kind, payload: JSON.parse(r.payload) as Record<string, unknown> }));
}

export function removeOutbox(ids: readonly string[]): void {
  if (!ids.length) return;
  open().runSync(`DELETE FROM outbox WHERE id IN (${ids.map(() => '?').join(',')})`, ...ids);
}
