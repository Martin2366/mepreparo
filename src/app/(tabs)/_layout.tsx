import { Redirect } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';
import { useEffect } from 'react';

import { TabBar } from '@/components/ui/TabBar';
import { dayKey } from '@/engine/dates';
import { useOnboarding } from '@/features/onboarding/store';
import { useProgress } from '@/features/progress/store';
import { syncReminders } from '@/lib/notifications';
import { colors } from '@/theme/tokens';

/** Pestañas (D12): Inicio · Aprender · Equis · Practicar · Progreso. Sin onboarding terminado, se retoma. */
export default function TabsLayout() {
  const completed = useOnboarding((s) => s.completed);
  const onboardingXp = useOnboarding((s) => s.answers.xp ?? 0);
  const seed = useProgress((s) => s.seedFromOnboarding);
  const reminder = useOnboarding((s) => s.answers.reminder);
  const activeToday = useProgress((s) => s.activeDays.includes(dayKey(new Date())));

  // El XP del onboarding y el primer día de racha se entregan una sola vez al entrar a la app.
  useEffect(() => {
    if (completed) seed(onboardingXp);
  }, [completed, onboardingXp, seed]);

  // Reprograma los avisos (si ya dio permiso): hoy no se avisa si ya cumpliste.
  useEffect(() => {
    if (completed && reminder) syncReminders({ ...reminder, activeToday });
  }, [completed, reminder, activeToday]);

  if (!completed) return <Redirect href="/onboarding" />;

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.paper } }}
    >
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="aprender" options={{ title: 'Aprender' }} />
      <Tabs.Screen name="equis" options={{ title: 'Equis' }} />
      <Tabs.Screen name="practicar" options={{ title: 'Practicar' }} />
      <Tabs.Screen name="progreso" options={{ title: 'Progreso' }} />
    </Tabs>
  );
}
