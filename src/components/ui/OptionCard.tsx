import * as Haptics from 'expo-haptics';
import { memo, type ReactNode, useEffect } from 'react';
import { Platform, Pressable, View } from 'react-native';
import Animated, {
  FadeInUp,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '@/theme/tokens';
import { dur, easeOut, popSpring, stagger } from '@/theme/motion';

import { Icon } from './Icon';
import { Text } from './Text';

type Props = {
  label: string;
  hint?: string;
  selected: boolean;
  onPress: () => void;
  /** Radio (una opción) o casilla (varias). */
  kind?: 'radio' | 'check';
  leading?: ReactNode;
  badge?: string;
  badgeTone?: 'sky' | 'coral' | 'neutral';
  disabled?: boolean;
  /** Posición en la lista: escalona la entrada (solo las primeras aparecen con retraso). */
  index?: number;
  animateIn?: boolean;
};

/**
 * Opción seleccionable del design system (AnswerOption/Radio/Checkbox): tarjeta blanca, borde cálido,
 * y al elegirla: relleno celeste suave, borde celeste y un "pop" del indicador + vibración leve.
 */
export const OptionCard = memo(function OptionCard({
  label,
  hint,
  selected,
  onPress,
  kind = 'radio',
  leading,
  badge,
  badgeTone = 'sky',
  disabled = false,
  index = 0,
  animateIn = true,
}: Props) {
  const sel = useSharedValue(selected ? 1 : 0);
  const pop = useSharedValue(selected ? 1 : 0);
  const pressed = useSharedValue(0);

  useEffect(() => {
    sel.value = withTiming(selected ? 1 : 0, { duration: dur.base, easing: easeOut });
    pop.value = selected ? withSpring(1, popSpring) : withTiming(0, { duration: dur.fast });
  }, [selected, sel, pop]);

  const card = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(sel.value, [0, 1], [colors.white, colors.sky100]),
    borderColor: interpolateColor(sel.value, [0, 1], [colors.line, colors.sky]),
    transform: [{ scale: 1 - pressed.value * 0.02 }],
  }));
  const ring = useAnimatedStyle(() => ({
    borderColor: interpolateColor(sel.value, [0, 1], [colors.graphite200, colors.sky]),
    backgroundColor: kind === 'check' ? interpolateColor(sel.value, [0, 1], [colors.white, colors.sky]) : colors.white,
  }));
  const mark = useAnimatedStyle(() => ({ opacity: pop.value, transform: [{ scale: 0.4 + pop.value * 0.6 }] }));

  const press = () => {
    if (disabled) return;
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    onPress();
  };

  const tone =
    badgeTone === 'coral' ? 'bg-coral-50 text-coral-600' : badgeTone === 'neutral' ? 'bg-paper-2 text-graphite' : 'bg-sky-50 text-sky-700';

  return (
    <Animated.View entering={animateIn ? FadeInUp.duration(dur.slow).delay(stagger(index)).easing(easeOut) : undefined}>
      <Pressable
        accessibilityRole={kind === 'radio' ? 'radio' : 'checkbox'}
        accessibilityState={{ checked: selected, disabled }}
        accessibilityLabel={hint ? `${label}. ${hint}` : label}
        onPress={press}
        onPressIn={() => (pressed.value = withTiming(1, { duration: dur.fast }))}
        onPressOut={() => (pressed.value = withTiming(0, { duration: dur.base }))}
        disabled={disabled}
      >
        <Animated.View
          style={[{ borderWidth: 1.5, borderRadius: 14, opacity: disabled ? 0.55 : 1 }, card]}
          className="min-h-tap flex-row items-center gap-3 px-4 py-3"
        >
          {leading}
          <View className="flex-1 gap-0.5">
            <Text className="font-poppins-medium text-body text-ink">{label}</Text>
            {hint ? <Text variant="small">{hint}</Text> : null}
            {badge ? (
              <View className="mt-1 flex-row">
                <Text className={`rounded-full px-2 py-0.5 font-poppins-semibold text-caption ${tone}`}>{badge}</Text>
              </View>
            ) : null}
          </View>
          <Animated.View
            style={[
              { width: 24, height: 24, borderWidth: 2, borderRadius: kind === 'radio' ? 12 : 6, alignItems: 'center', justifyContent: 'center' },
              ring,
            ]}
          >
            <Animated.View style={mark}>
              {kind === 'radio' ? (
                <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: colors.sky }} />
              ) : (
                <Icon name="check" size={16} color={colors.white} strokeWidth={3} />
              )}
            </Animated.View>
          </Animated.View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
});
