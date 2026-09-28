import { type Href, router } from 'expo-router';

/**
 * Volver atrás sin quedar atrapado: si la pantalla se abrió sin historial (recarga, enlace,
 * notificación o app restaurada en frío), `router.back()` no hace nada, así que se va a `fallback`.
 */
export function goBack(fallback: Href = '/') {
  if (router.canGoBack()) router.back();
  else router.replace(fallback);
}
