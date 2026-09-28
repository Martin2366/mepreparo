import * as Notifications from 'expo-notifications';
import { Alert, Platform } from 'react-native';

import { kv } from './kv';

/**
 * Recordatorio diario local (plan §5.6):
 * - el permiso se pide en contexto, después de la primera lección completada, nunca al abrir la app;
 * - se programan los próximos 7 días con textos variados de Equis; si hoy ya cumpliste, hoy no se avisa.
 */
const CHANNEL = 'recordatorio';
const ASKED_KEY = 'mp.notif.asked';

const MESSAGES = [
  'Equis te guardó la lección donde la dejaste.',
  '10 minutos hoy valen más que 2 horas el domingo.',
  'Tu racha te espera. Un paso a la vez.',
  'Hoy toca un poquito de matemática. Tú puedes.',
  'Una lección corta y listo. Aprender haciendo.',
  'Tu meta está más cerca de lo que parece.',
  '¿Un reto rápido? Equis ya tiene uno listo.',
];

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function ensureChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: 'Recordatorio diario',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

export async function hasPermission(): Promise<boolean> {
  const { granted } = await Notifications.getPermissionsAsync();
  return granted;
}

/** Reprograma los avisos de los próximos 7 días. `time` en formato HH:MM. */
export async function syncReminders(opts: { on: boolean; time: string; activeToday: boolean }): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    if (!opts.on || !(await hasPermission())) return;
    await ensureChannel();
    const [h, m] = opts.time.split(':').map(Number) as [number, number];
    const now = new Date();
    for (let i = 0; i < 7; i++) {
      const at = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i, h, m);
      if (at <= now || (i === 0 && opts.activeToday)) continue;
      await Notifications.scheduleNotificationAsync({
        content: { title: 'MePreparo', body: MESSAGES[(at.getDate() + i) % MESSAGES.length]! },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: at, channelId: CHANNEL },
      });
    }
  } catch {
    // Sin permisos o sin soporte: la app funciona igual.
  }
}

/**
 * Después de la primera lección: pregunta en contexto (una sola vez) si quiere el aviso diario.
 * `time` viene del onboarding; si eligió "sin recordatorios", no se pregunta.
 */
export function maybeAskForReminder(reminder?: { on: boolean; time: string }, onGranted?: () => void) {
  if (!reminder?.on || kv.getItem(ASKED_KEY)) return;
  kv.setItem(ASKED_KEY, '1');
  Alert.alert('¿Te aviso mañana?', `Un recordatorio a las ${reminder.time} para no cortar tu racha. Lo puedes cambiar en tu perfil.`, [
    { text: 'Ahora no', style: 'cancel' },
    {
      text: 'Sí, avísame',
      onPress: async () => {
        const { granted } = await Notifications.requestPermissionsAsync();
        if (granted) onGranted?.();
      },
    },
  ]);
}
