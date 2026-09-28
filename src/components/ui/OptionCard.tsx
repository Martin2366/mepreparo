import * as Haptics from 'expo-haptics';
import { memo, type ReactNode } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';

import { colors, fonts } from '@/theme/tokens';

import { Icon } from './Icon';
import { Tappable } from './Tappable';
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
};

/**
 * Opción seleccionable (design system → AnswerOption): tarjeta blanca con borde cálido; elegida,
 * relleno celeste suave y borde celeste. Liviana a propósito: sin estado animado por fila, para que
 * las listas largas se deslicen fluidas en gama media-baja. Solo la marca de selección hace "pop".
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
}: Props) {
  return (
    <Tappable
      accessibilityRole={kind === 'radio' ? 'radio' : 'checkbox'}
      accessibilityState={{ checked: selected, disabled }}
      accessibilityLabel={hint ? `${label}. ${hint}` : label}
      disabled={disabled}
      onPress={() => {
        if (Platform.OS !== 'web') Haptics.selectionAsync();
        onPress();
      }}
      style={[s.card, selected && s.cardOn, disabled && s.cardOff]}
      pressedStyle={[!selected && s.cardPressed, s.pressed]}
    >
      {leading}
      <View style={s.body}>
        <Text style={s.label}>{label}</Text>
        {hint ? <Text style={s.hint}>{hint}</Text> : null}
        {badge ? (
          <View style={s.badgeRow}>
            <Text style={[s.badge, TONES[badgeTone]]}>{badge}</Text>
          </View>
        ) : null}
      </View>
      <View style={[s.mark, kind === 'radio' ? s.radio : s.check, selected && (kind === 'radio' ? s.radioOn : s.checkOn)]}>
        {selected ? (
          <Animated.View entering={ZoomIn.springify().damping(12).stiffness(260)}>
            {kind === 'radio' ? <View style={s.dot} /> : <Icon name="check" size={16} color={colors.white} strokeWidth={3} />}
          </Animated.View>
        ) : null}
      </View>
    </Tappable>
  );
});

const TONES = StyleSheet.create({
  sky: { backgroundColor: colors.sky50, color: colors.sky700 },
  coral: { backgroundColor: colors.coral50, color: '#C2410C' },
  neutral: { backgroundColor: colors.paper2, color: colors.graphite },
});

const s = StyleSheet.create({
  card: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  cardOn: { backgroundColor: colors.sky100, borderColor: colors.sky },
  cardPressed: { backgroundColor: colors.sky50 },
  cardOff: { opacity: 0.55 },
  pressed: { transform: [{ scale: 0.985 }] },
  body: { flex: 1, gap: 2 },
  label: { fontFamily: fonts['poppins-medium'], fontSize: 17, lineHeight: 24, color: colors.ink },
  hint: { fontFamily: fonts.poppins, fontSize: 14, lineHeight: 20, color: colors.graphite },
  badgeRow: { flexDirection: 'row', marginTop: 4 },
  badge: {
    fontFamily: fonts['poppins-semibold'],
    fontSize: 12,
    lineHeight: 16,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: 'hidden',
  },
  mark: { width: 24, height: 24, borderWidth: 2, alignItems: 'center', justifyContent: 'center', borderColor: colors.graphite200 },
  radio: { borderRadius: 12, backgroundColor: colors.white },
  check: { borderRadius: 6, backgroundColor: colors.white },
  radioOn: { borderColor: colors.sky },
  checkOn: { borderColor: colors.sky, backgroundColor: colors.sky },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.sky },
});
