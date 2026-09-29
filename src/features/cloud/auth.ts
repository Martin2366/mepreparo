import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import { clearLocalData, enqueue } from '@/data/attempts';
import { useExams } from '@/features/exams/store';
import { useIntensives } from '@/features/intensives/store';
import { useOnboarding } from '@/features/onboarding/store';
import { usePremiumStore } from '@/features/premium/store';
import { useProgress } from '@/features/progress/store';
import { supabase } from '@/lib/supabase';

import { ensureSession, forgetUser, requestSync, syncNow } from './sync';

/**
 * Cuenta con Google (plan §5.5):
 * - "Respaldar con Google": `linkIdentity` sobre la sesión anónima → mismo user_id, nada se mueve.
 * - Si esa cuenta de Google ya tenía progreso: se ofrece entrar a ella; lo de este teléfono se mezcla con lo respaldado.
 * - Teléfono nuevo: "Entrar con Google" → se baja y se mezcla el progreso.
 */
const redirectTo = Linking.createURL('auth/callback');

export type GoogleResult = 'ok' | 'cancelled' | 'conflict' | 'offline' | 'error';

/** Evento de producto (sin datos personales); se sube en lote con la sincronización. */
export function track(name: string, props: Record<string, string | number | boolean> = {}) {
  try {
    enqueue('event', { name, props });
    requestSync(5000);
  } catch {
    // Nunca bloquea.
  }
}

function paramsOf(url: string): Record<string, string> {
  // Supabase devuelve `code` en la query y los errores en la query o en el fragmento (#).
  const out: Record<string, string> = {};
  const i = url.search(/[?#]/);
  if (i < 0) return out;
  for (const part of url.slice(i + 1).split(/[&#?]/)) {
    const [k, v] = part.split('=');
    if (k) out[decodeURIComponent(k)] = decodeURIComponent((v ?? '').replace(/\+/g, ' '));
  }
  return out;
}

/** Abre Google en el navegador del sistema y canjea el código PKCE por la sesión. */
async function oauth(start: () => Promise<{ data: { url: string | null } | null; error: { code?: string } | null }>): Promise<GoogleResult> {
  if (!supabase) return 'error';
  let res;
  try {
    res = await start();
  } catch {
    return 'offline';
  }
  if (res.error || !res.data?.url) return res.error?.code === 'manual_linking_disabled' ? 'error' : 'offline';
  const result = await WebBrowser.openAuthSessionAsync(res.data.url, redirectTo);
  if (result.type !== 'success') return 'cancelled';
  const p = paramsOf(result.url);
  if (p.error_code === 'identity_already_exists' || /already.*linked|identity.*exists/i.test(p.error_description ?? '')) return 'conflict';
  if (!p.code) return 'error';
  const { error } = await supabase.auth.exchangeCodeForSession(p.code);
  return error ? 'error' : 'ok';
}

/** Respaldar el progreso de este teléfono con Google (mismo usuario). */
export async function linkGoogle(): Promise<GoogleResult> {
  if (!supabase) return 'error';
  track('link_google_started');
  const uid = await ensureSession();
  if (!uid) return 'offline';
  const r = await oauth(() => supabase!.auth.linkIdentity({ provider: 'google', options: { redirectTo, skipBrowserRedirect: true } }));
  track(r === 'ok' ? 'link_google_succeeded' : 'link_google_failed', { reason: r });
  if (r === 'ok') {
    await supabase.auth.refreshSession();
    void syncNow();
  }
  return r;
}

/**
 * Entrar a una cuenta de Google que ya tiene progreso (teléfono nuevo o conflicto). La sesión anónima se reemplaza;
 * lo de este teléfono se sube a esa cuenta y se mezcla con lo respaldado (nada se pierde).
 */
export async function signInWithGoogle(): Promise<GoogleResult> {
  if (!supabase) return 'error';
  const r = await oauth(() => supabase!.auth.signInWithOAuth({ provider: 'google', options: { redirectTo, skipBrowserRedirect: true } }));
  if (r === 'ok') await syncNow();
  return r;
}

export type DeleteResult = 'ok' | 'offline' | 'error';

/** Borrar mi cuenta y datos (Play lo exige): en el servidor (cascada) y en el teléfono. */
export async function deleteAccount(): Promise<DeleteResult> {
  if (supabase) {
    const uid = await ensureSession();
    if (!uid) return 'offline';
    try {
      const { error } = await supabase.functions.invoke('delete-account', { method: 'POST' });
      if (error) return 'error';
    } catch {
      return 'offline';
    }
    await supabase.auth.signOut({ scope: 'local' });
  }
  clearLocalData();
  useProgress.getState().reset();
  useOnboarding.getState().reset();
  useExams.setState({ active: null, activeIntensive: null, history: [] });
  useIntensives.setState({ active: null, finished: [] });
  usePremiumStore.setState({ subscriptionUntil: null, pass: null, offerUsed: false, noticesSeen: {} });
  forgetUser();
  return 'ok';
}
