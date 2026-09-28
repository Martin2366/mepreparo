import type { ReactNode } from 'react';
import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';

import { colors } from '@/theme/tokens';

import { Tappable } from './Tappable';

type Tone = 'white' | 'sky' | 'coral' | 'success' | 'paper';

type Props = {
  children: ReactNode;
  tone?: Tone;
  padding?: number;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  accessibilityLabel?: string;
};

const BG: Record<Tone, string> = {
  white: colors.white,
  sky: colors.sky50,
  coral: colors.coral50,
  success: colors.success50,
  paper: colors.paper2,
};

/** Tarjeta del design system: blanca, radio 20, borde cálido y sombra suave. Variantes planas para tips. */
export function Card({ children, tone = 'white', padding = 16, style, onPress, accessibilityLabel }: Props) {
  const base = [s.card, { backgroundColor: BG[tone], padding }, tone !== 'white' && s.flat, style];
  if (!onPress) return <View style={base}>{children}</View>;
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={base}
      pressedStyle={s.pressed}
    >
      {children}
    </Tappable>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    shadowColor: colors.ink,
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  flat: { borderColor: 'transparent', elevation: 0, shadowOpacity: 0 },
  pressed: { transform: [{ scale: 0.98 }], opacity: 0.95 },
});
