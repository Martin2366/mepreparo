import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

import { dur, easeOut } from '@/theme/motion';
import { colors, fonts } from '@/theme/tokens';

import { MathText } from './MathText';
import { Tappable } from './Tappable';
import { Text } from './Text';

export type SolutionStep = { text?: string | null; math?: string | null };

const STEP_MS = 650;

/**
 * Resolución animada: los pasos aparecen de a uno y el paso actual se destaca en celeste (movimiento calmo del DS).
 * Tocar muestra todo de inmediato (nadie tiene que esperar la animación).
 */
export function AnimatedSolution({ steps, title }: { steps: readonly SolutionStep[]; title?: string }) {
  const [shown, setShown] = useState(1);

  useEffect(() => {
    if (shown >= steps.length) return;
    const t = setTimeout(() => setShown((n) => n + 1), STEP_MS);
    return () => clearTimeout(t);
  }, [shown, steps.length]);

  return (
    <Tappable accessibilityRole="button" accessibilityLabel="Mostrar todos los pasos" onPress={() => setShown(steps.length)} style={{ gap: 8 }}>
      {title ? <Text style={s.title}>{title}</Text> : null}
      {steps.slice(0, shown).map((st, i) => {
        const current = i === shown - 1 && shown < steps.length + 1;
        return (
          <Animated.View key={i} entering={FadeInDown.duration(dur.slow).easing(easeOut)}>
            <View style={[s.step, current && s.current]}>
              <View style={[s.num, current && s.numOn]}>
                <Text style={s.numText}>{i + 1}</Text>
              </View>
              <View style={{ flex: 1, gap: 4 }}>
                {st.text ? <MathText source={st.text} size={15} /> : null}
                {st.math ? <MathText source={st.math} size={17} display /> : null}
              </View>
            </View>
          </Animated.View>
        );
      })}
      {shown < steps.length ? <Text style={s.hint}>Toca para ver todos los pasos</Text> : null}
    </Tappable>
  );
}

/** Líneas de la resolución del contenido (cada línea es un paso). */
export const linesToSteps = (lines: readonly string[]): SolutionStep[] => lines.map((l) => ({ text: l }));

/**
 * Entrada del feedback de error: aparece desde abajo con un pequeño vaivén (grafito, sin rojo, sin culpa).
 */
export function NudgeIn({ children }: { children: React.ReactNode }) {
  const x = useSharedValue(0);
  useEffect(() => {
    x.value = withSequence(withTiming(-6, { duration: 70 }), withTiming(6, { duration: 90 }), withTiming(-3, { duration: 80 }), withTiming(0, { duration: 80 }));
  }, [x]);
  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  return (
    <Animated.View entering={FadeInUp.duration(dur.base)}>
      <Animated.View style={style}>{children}</Animated.View>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  title: { fontFamily: fonts['poppins-semibold'], fontSize: 16, lineHeight: 22, color: colors.ink },
  step: { flexDirection: 'row', gap: 10, padding: 10, borderRadius: 14, borderWidth: 1, borderColor: 'transparent' },
  current: { backgroundColor: colors.sky50, borderColor: colors.sky200 },
  num: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.graphite100, alignItems: 'center', justifyContent: 'center', marginTop: 1 },
  numOn: { backgroundColor: colors.sky },
  numText: { fontFamily: fonts['poppins-semibold'], fontSize: 12, color: colors.ink },
  hint: { fontFamily: fonts.poppins, fontSize: 12, color: colors.graphite, textAlign: 'center' },
});
