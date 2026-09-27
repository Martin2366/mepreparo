import * as Sentry from '@sentry/react-native';

const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

/** Se activa solo si hay DSN (Día 7 completa la integración y los source maps). Sin PII. */
export function initSentry(): void {
  if (!dsn) return;
  Sentry.init({
    dsn,
    sendDefaultPii: false,
    enabled: !__DEV__,
  });
}

export { Sentry };
