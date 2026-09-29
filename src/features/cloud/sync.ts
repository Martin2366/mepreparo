import { addNetworkStateListener } from 'expo-network';
import { AppState, Platform } from 'react-native';
import type { StoreApi, UseBoundStore } from 'zustand';

import { markAllUnsynced, markSynced, pendingOutbox, pendingSync, removeOutbox } from '@/data/attempts';
import { mergeExams, mergeIntensives, mergeOnboarding, mergeProgress } from '@/engine/merge';
import { useExams } from '@/features/exams/store';
import { useIntensives } from '@/features/intensives/store';
import { useOnboarding } from '@/features/onboarding/store';
import { identify } from '@/features/premium/purchases';
import { usePremiumStore } from '@/features/premium/store';
import { useProgress } from '@/features/progress/store';
import { Sentry } from '@/lib/sentry';
import { supabase } from '@/lib/supabase';

import { type DocId, useCloud } from './store';

/**
 * Sincronización (plan §5.3). Local primero: la app nunca espera a la red.
 * 1) Sube los intentos pendientes (insert … on conflict do nothing: idempotente).
 * 2) Sube la cola de eventos y reportes.
 * 3) Baja los documentos que cambió OTRO teléfono y los mezcla con lo local (engine/merge).
 * 4) Sube los documentos con cambios (upsert del documento completo: idempotente).
 * Se dispara al arrancar, al volver a primer plano, al recuperar la red y unos segundos después de cada cambio.
 */

type PersistedStore = UseBoundStore<StoreApi<object>> & {
  persist: { getOptions: () => { partialize?: (s: object) => object } };
};

type DocSpec = {
  store: PersistedStore;
  /** Lo que sube (lo mismo que se guarda en el teléfono, sin datos personales). */
  pick?: (data: Record<string, unknown>) => Record<string, unknown>;
  merge: (local: never, remote: never) => object;
};

const DOCS: Record<DocId, DocSpec> = {
  progress: { store: useProgress as unknown as PersistedStore, merge: mergeProgress as DocSpec['merge'] },
  exams: { store: useExams as unknown as PersistedStore, merge: mergeExams as DocSpec['merge'] },
  intensives: { store: useIntensives as unknown as PersistedStore, merge: mergeIntensives as DocSpec['merge'] },
  onboarding: {
    store: useOnboarding as unknown as PersistedStore,
    // El apodo solo vive en el teléfono (PRD §2.2).
    pick: (d) => ({ ...d, answers: { ...(d.answers as object), name: '' } }),
    merge: mergeOnboarding as DocSpec['merge'],
  },
  premium: {
    store: usePremiumStore as unknown as PersistedStore,
    merge: ((local: PremiumDoc, remote: Partial<PremiumDoc>) => ({
      ...local,
      subscriptionUntil: [local.subscriptionUntil, remote.subscriptionUntil ?? null].filter(Boolean).sort().at(-1) ?? null,
      pass: !local.pass || (remote.pass && remote.pass.purchasedAt > local.pass.purchasedAt) ? (remote.pass ?? local.pass) : local.pass,
      offerUsed: local.offerUsed || !!remote.offerUsed,
      noticesSeen: { ...(remote.noticesSeen ?? {}), ...local.noticesSeen },
    })) as DocSpec['merge'],
  },
};

type PremiumDoc = {
  subscriptionUntil: string | null;
  pass: { purchasedAt: string; until: string } | null;
  offerUsed: boolean;
  noticesSeen: Record<string, boolean>;
};

const DOC_IDS = Object.keys(DOCS) as DocId[];

function snapshot(id: DocId): Record<string, unknown> {
  const spec = DOCS[id];
  const state = spec.store.getState();
  const data = (spec.store.persist.getOptions().partialize?.(state) ?? state) as Record<string, unknown>;
  return spec.pick ? spec.pick(data) : data;
}

// ---------- sesión ----------

let sessionPromise: Promise<string | null> | null = null;

/** Sesión de Supabase; si no hay, se crea una anónima. Sin red: null (se reintenta después). */
export function ensureSession(): Promise<string | null> {
  if (!supabase) return Promise.resolve(null);
  sessionPromise ??= (async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session) return data.session.user.id;
      const { data: anon, error } = await supabase.auth.signInAnonymously();
      if (error) return null;
      return anon.user?.id ?? null;
    } catch {
      return null;
    } finally {
      sessionPromise = null;
    }
  })();
  return sessionPromise;
}

/** Al cambiar de usuario (Google con progreso previo, o cuenta borrada), todo lo local se sube a la nueva cuenta. */
function onUser(user: { id: string; is_anonymous?: boolean; email?: string } | null) {
  const cloud = useCloud.getState();
  if (!user) return;
  const patch = { isAnonymous: !!user.is_anonymous, email: user.email ?? null };
  if (cloud.userId !== user.id) {
    if (cloud.userId) markAllUnsynced();
    cloud.set({ ...patch, userId: user.id, pulled: {}, dirty: Object.fromEntries(DOC_IDS.map((d) => [d, true])) });
    identify(user.id);
  } else {
    cloud.set(patch);
  }
}

// ---------- ciclo ----------

let running: Promise<void> | null = null;
let again = false;
let failures = 0;
let retryTimer: ReturnType<typeof setTimeout> | null = null;
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

/** Pide una sincronización. Nunca lanza ni bloquea la UI. */
export function requestSync(delayMs = 0) {
  if (!supabase) return;
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    void syncNow();
  }, delayMs);
}

export async function syncNow(): Promise<boolean> {
  if (!supabase) return false;
  if (running) {
    again = true;
    await running;
    return useCloud.getState().status === 'backed-up';
  }
  running = (async () => {
    do {
      again = false;
      await cycle();
    } while (again);
  })();
  try {
    await running;
  } finally {
    running = null;
  }
  return useCloud.getState().status === 'backed-up';
}

async function cycle() {
  const cloud = useCloud.getState();
  const userId = await ensureSession();
  if (!userId || !supabase) {
    cloud.set({ status: 'local' });
    return scheduleRetry();
  }
  const { data: u } = await supabase.auth.getSession();
  onUser(u.session?.user ?? null);
  useCloud.getState().set({ status: 'syncing' });
  try {
    await uploadAttempts();
    await uploadOutbox();
    await pullDocs();
    await pushDocs();
    failures = 0;
    useCloud.getState().set({ status: 'backed-up', lastSyncAt: new Date().toISOString() });
  } catch (e) {
    useCloud.getState().set({ status: 'local' });
    if (!isNetworkError(e)) Sentry.captureException(e);
    scheduleRetry();
  }
}

function isNetworkError(e: unknown) {
  const msg = String((e as Error)?.message ?? e);
  return /network|fetch|timeout|abort/i.test(msg);
}

/** Reintento con espera exponencial: 5 s, 10 s, 20 s… hasta 5 min. */
function scheduleRetry() {
  if (retryTimer) return;
  const wait = Math.min(300_000, 5_000 * 2 ** failures);
  failures = Math.min(failures + 1, 10);
  retryTimer = setTimeout(() => {
    retryTimer = null;
    void syncNow();
  }, wait);
}

async function uploadAttempts() {
  for (let guard = 0; guard < 50; guard++) {
    const batch = pendingSync(200);
    if (!batch.length) return;
    const rows = batch.map((a) => ({
      id: a.id,
      created_at: a.createdAt,
      day: a.day,
      ref: a.ref.slice(0, 200),
      unit_id: a.unitId ?? null,
      lesson_id: a.lessonId ?? null,
      step_index: a.stepIndex ?? null,
      kind: a.kind,
      outcome: a.outcome,
      hints: Math.min(a.hints, 10),
      mistake_code: a.mistakeCode?.slice(0, 80) ?? null,
      answer: a.answer?.slice(0, 500) ?? null,
      xp: a.xp,
    }));
    const { error } = await supabase!.from('step_attempts').upsert(rows, { onConflict: 'user_id,id', ignoreDuplicates: true });
    if (error) throw error;
    markSynced(batch.map((a) => a.id));
  }
}

async function uploadOutbox() {
  for (let guard = 0; guard < 20; guard++) {
    const batch = pendingOutbox(200);
    if (!batch.length) return;
    const events = batch
      .filter((b) => b.kind === 'event')
      .map((b) => ({ id: b.id, created_at: b.createdAt, name: String(b.payload.name), props: b.payload.props ?? {} }));
    const reports = batch
      .filter((b) => b.kind === 'report')
      .map((b) => ({
        id: b.id,
        created_at: b.createdAt,
        ref: String(b.payload.ref).slice(0, 200),
        reason: String(b.payload.reason).slice(0, 40),
        note: b.payload.note ? String(b.payload.note).slice(0, 500) : null,
      }));
    if (events.length) {
      const { error } = await supabase!.from('events').upsert(events, { onConflict: 'user_id,id', ignoreDuplicates: true });
      if (error) throw error;
    }
    if (reports.length) {
      const { error } = await supabase!.from('content_reports').upsert(reports, { onConflict: 'user_id,id', ignoreDuplicates: true });
      if (error) throw error;
    }
    removeOutbox(batch.map((b) => b.id));
  }
}

async function pullDocs() {
  const { deviceId, pulled } = useCloud.getState();
  const { data: heads, error } = await supabase!.from('user_state').select('doc, updated_at, device_id');
  if (error) throw error;
  const stale = (heads ?? []).filter(
    (h: { doc: DocId; updated_at: string; device_id: string }) =>
      h.doc in DOCS && h.device_id !== deviceId && (!pulled[h.doc] || h.updated_at > pulled[h.doc]!),
  );
  if (!stale.length) return;
  const { data: docs, error: e2 } = await supabase!
    .from('user_state')
    .select('doc, data, updated_at')
    .in(
      'doc',
      stale.map((s: { doc: DocId }) => s.doc),
    );
  if (e2) throw e2;
  const nextPulled = { ...useCloud.getState().pulled };
  for (const row of (docs ?? []) as { doc: DocId; data: object; updated_at: string }[]) {
    const spec = DOCS[row.doc];
    const local = spec.store.getState();
    const merged = spec.merge(local as never, row.data as never);
    spec.store.setState(merged);
    nextPulled[row.doc] = row.updated_at;
  }
  useCloud.getState().set({ pulled: nextPulled });
}

async function pushDocs() {
  const { dirty, deviceId } = useCloud.getState();
  const ids = DOC_IDS.filter((d) => dirty[d]);
  if (!ids.length) return;
  // Se limpian antes de subir: un cambio durante la subida vuelve a marcarlo.
  useCloud.getState().set({ dirty: {} });
  const rows = ids.map((doc) => ({ doc, data: snapshot(doc), device_id: deviceId }));
  const { data, error } = await supabase!.from('user_state').upsert(rows, { onConflict: 'user_id,doc' }).select('doc, updated_at');
  if (error) {
    useCloud.getState().set({ dirty: { ...useCloud.getState().dirty, ...Object.fromEntries(ids.map((d) => [d, true])) } });
    throw error;
  }
  const pulled = { ...useCloud.getState().pulled };
  for (const r of (data ?? []) as { doc: DocId; updated_at: string }[]) pulled[r.doc] = r.updated_at;
  useCloud.getState().set({ pulled });
}

// ---------- arranque ----------

let started = false;

/** Se llama una vez al abrir la app. Marca los documentos que cambian y programa la sincronización. */
export function startSync() {
  if (started || !supabase) {
    if (!supabase) useCloud.getState().set({ status: 'off' });
    return;
  }
  started = true;
  for (const id of DOC_IDS) {
    DOCS[id].store.subscribe(() => {
      const cloud = useCloud.getState();
      if (!cloud.dirty[id]) cloud.set({ dirty: { ...cloud.dirty, [id]: true } });
      requestSync(4000);
    });
  }
  supabase.auth.onAuthStateChange((_event, session) => {
    // Se difiere: dentro de este callback no se debe llamar a otros métodos de auth (guía de Supabase).
    setTimeout(() => onUser(session?.user ?? null), 0);
  });
  if (Platform.OS !== 'web') {
    AppState.addEventListener('change', (s) => {
      if (s === 'active') requestSync(500);
    });
    addNetworkStateListener((n) => {
      if (n.isInternetReachable) requestSync(1000);
    });
  }
  requestSync(1500);
}

/** Después de borrar la cuenta: se olvida el usuario anterior para empezar de cero. */
export function forgetUser() {
  useCloud.getState().set({ userId: null, isAnonymous: true, email: null, pulled: {}, dirty: {}, lastSyncAt: null, status: 'local' });
}
