import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';

// En la web, la ventana emergente de Google vuelve aquí y se cierra; en Android el navegador del sistema entrega la URL.
WebBrowser.maybeCompleteAuthSession();

/** Vuelta de Google (`mepreparo://auth/callback`). El código lo canjea `features/cloud/auth`; aquí solo se regresa. */
export default function AuthCallback() {
  useEffect(() => {
    if (router.canGoBack()) router.back();
    else router.replace('/');
  }, []);
  return null;
}
