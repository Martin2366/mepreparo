import { useIsFocused } from 'expo-router';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { Mascot } from '@/components/ui/Mascot';
import { Tappable } from '@/components/ui/Tappable';
import { Text } from '@/components/ui/Text';
import { useOnboarding } from '@/features/onboarding/store';
import { kv } from '@/lib/kv';
import { dur, easeOut } from '@/theme/motion';
import { colors, fonts } from '@/theme/tokens';

export type TourId = 'home' | 'learn' | 'equis' | 'practice' | 'progress' | 'lesson';
export type TourStep = { text: string; at: 'top' | 'middle' | 'bottom' };

/** Textos del tour: cortos (≤ 8 palabras), una idea por globo. */
export const TOURS: Record<TourId, TourStep[]> = {
  home: [
    { text: 'Aquí está tu plan de hoy.', at: 'middle' },
    { text: 'Arriba: tu racha, tu XP y los días.', at: 'top' },
  ],
  learn: [{ text: 'Todos los temas de M1, siempre gratis.', at: 'middle' }],
  equis: [
    { text: 'Sácale foto a tu ejercicio y te ayudo.', at: 'middle' },
    { text: 'O pregúntame lo que no entiendas.', at: 'bottom' },
  ],
  practice: [{ text: 'Ensayos, práctica y tu cuaderno de errores.', at: 'middle' }],
  progress: [{ text: 'Tu puntaje estimado y cuánto falta.', at: 'middle' }],
  lesson: [
    { text: 'Responde y toca «Comprobar».', at: 'bottom' },
    { text: '¿Dudas? Pide una pista, sin castigo.', at: 'bottom' },
  ],
};

type TourState = {
  seen: Partial<Record<TourId, number>>;
  step: (id: TourId) => void;
  skip: (id: TourId) => void;
  reset: () => void;
};

/** Qué globos ya se vieron (solo en el teléfono). */
export const useTour = create<TourState>()(
  persist(
    (set) => ({
      seen: {},
      step: (id) => set((s) => ({ seen: { ...s.seen, [id]: (s.seen[id] ?? 0) + 1 } })),
      skip: (id) => set((s) => ({ seen: { ...s.seen, [id]: TOURS[id].length } })),
      reset: () => set({ seen: {} }),
    }),
    { name: 'mp.tour.v1', storage: createJSONStorage(() => kv), partialize: (s) => ({ seen: s.seen }) },
  ),
);

/** Mini tour: globos de Equis la primera vez que se abre una pantalla. Suave, rápido y con «Saltar». */
export function Tour({ id }: { id: TourId }) {
  const focused = useIsFocused();
  const completed = useOnboarding((s) => s.completed);
  const index = useTour((s) => s.seen[id] ?? 0);
  const next = useTour((s) => s.step);
  const skip = useTour((s) => s.skip);
  const insets = useSafeAreaInsets();
  const steps = TOURS[id];
  const current = steps[index];
  if (!focused || !completed || !current) return null;

  const pos =
    current.at === 'top'
      ? { top: insets.top + 64 }
      : current.at === 'bottom'
        ? { bottom: insets.bottom + 110 }
        : { top: '38%' as const };

  return (
    <Modal visible transparent animationType="none" onRequestClose={() => skip(id)} statusBarTranslucent>
      <Animated.View entering={FadeIn.duration(dur.base)} style={s.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => next(id)} accessibilityLabel="Siguiente" />
        <Animated.View key={index} entering={FadeInDown.duration(dur.slow).easing(easeOut)} style={[s.bubbleWrap, pos]}>
          <Mascot pose={index === 0 ? 'saludo' : 'senalando'} height={64} float={false} />
          <View style={s.bubble}>
            <Text style={s.text}>{current.text}</Text>
            <View style={s.row}>
              <Text style={s.count}>
                {index + 1}/{steps.length}
              </Text>
              <View style={{ flex: 1 }} />
              <Tappable accessibilityRole="button" onPress={() => skip(id)} style={s.btn}>
                <Text style={s.skip}>Saltar</Text>
              </Tappable>
              <Tappable accessibilityRole="button" onPress={() => next(id)} style={[s.btn, s.primary]}>
                <Text style={s.go}>{index === steps.length - 1 ? 'Listo' : 'Siguiente'}</Text>
              </Tappable>
            </View>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(30,42,74,0.28)' },
  bubbleWrap: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', alignItems: 'flex-end', gap: 6 },
  bubble: {
    flex: 1,
    gap: 10,
    backgroundColor: colors.white,
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.line,
  },
  text: { fontFamily: fonts['poppins-semibold'], fontSize: 17, lineHeight: 23, color: colors.ink },
  row: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  count: { fontFamily: fonts.poppins, fontSize: 12, color: colors.graphite },
  btn: { minHeight: 44, minWidth: 48, paddingHorizontal: 12, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: colors.sky },
  skip: { fontFamily: fonts['poppins-medium'], fontSize: 14, color: colors.graphite },
  go: { fontFamily: fonts['poppins-semibold'], fontSize: 14, color: colors.ink },
});
