import * as Haptics from 'expo-haptics';
import { useEffect } from 'react';
import { Platform, type PressableProps, View } from 'react-native';
import { interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { dur, easeOut } from '@/theme/motion';
import { colors } from '@/theme/tokens';

import { AnimatedPressable } from './animated';
import { Icon } from './Icon';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost';

type Props = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: Variant;
  /** Flecha a la derecha, como en los botones de avance del design system. */
  arrow?: boolean;
  className?: string;
};

const BG: Record<Variant, [string, string]> = {
  // [habilitado, deshabilitado]
  primary: [colors.sky, colors.graphite100],
  secondary: [colors.white, colors.graphite100],
  ghost: ['rgba(0,0,0,0)', 'rgba(0,0,0,0)'],
};

const FG: Record<Variant, string> = { primary: colors.ink, secondary: colors.ink, ghost: colors.sky700 };

/**
 * Botón píldora (≥ 48 dp). Al habilitarse cambia de color con suavidad (200 ms) y al presionar
 * se achica a .97: se siente vivo sin ser saltón. Primario = tinta sobre celeste (contraste 6:1, D10).
 */
export function Button({ label, variant = 'primary', arrow = false, disabled, className = '', onPress, ...rest }: Props) {
  const enabled = useSharedValue(disabled ? 0 : 1);
  const pressed = useSharedValue(0);

  useEffect(() => {
    enabled.value = withTiming(disabled ? 0 : 1, { duration: dur.base, easing: easeOut });
  }, [disabled, enabled]);

  const style = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(enabled.value, [0, 1], [BG[variant][1], BG[variant][0]]),
    transform: [{ scale: 1 - pressed.value * 0.03 }],
  }));

  const fg = disabled ? colors.graphite300 : FG[variant];

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPressIn={() => (pressed.value = withTiming(1, { duration: dur.fast }))}
      onPressOut={() => (pressed.value = withTiming(0, { duration: dur.base }))}
      onPress={(e) => {
        if (Platform.OS !== 'web' && variant === 'primary') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.(e);
      }}
      className={`min-h-tap items-center justify-center rounded-full px-6 py-3 ${
        variant === 'secondary' ? 'border-2 border-graphite-200' : ''
      } ${className}`}
      style={style}
      {...rest}
    >
      <View className="flex-row items-center gap-2">
        <Text className="font-poppins-semibold text-lead" style={{ color: fg }}>
          {label}
        </Text>
        {arrow && <Icon name="arrow-right" size={20} color={fg} />}
      </View>
    </AnimatedPressable>
  );
}
