import './local-storage';

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

/** Acepta la URL con o sin `/rest/v1/` (el panel de Supabase muestra ambas). */
const url = process.env.EXPO_PUBLIC_SUPABASE_URL?.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const key = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

/**
 * Cliente de Supabase, o `null` si faltan las claves: la app funciona igual, solo en el teléfono (local primero).
 * PKCE para el flujo de Google (`linkIdentity` / `signInWithOAuth` + `exchangeCodeForSession`).
 */
export const supabase: SupabaseClient | null =
  url && key
    ? createClient(url, key, {
        auth: {
          storage: globalThis.localStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
          flowType: 'pkce',
        },
      })
    : null;

// El token se refresca solo con la app en primer plano (guía de Supabase para React Native).
if (supabase && Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') supabase.auth.startAutoRefresh();
    else supabase.auth.stopAutoRefresh();
  });
}
