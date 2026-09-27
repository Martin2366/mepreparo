import * as Haptics from 'expo-haptics';
import { Platform, Pressable, type PressableProps, StyleSheet, View } from 'react-native';

import { colors, fonts } from '@/theme/tokens';

import { Icon } from './Icon';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost';

type Props = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  variant?: Variant;
  /** Flecha a la derecha, como en los botones de avance del design system. */
  arrow?: boolean;
};

/**
 * Botón píldora (≥ 52 dp). Estilos fijos con StyleSheet (sin clases sobre elementos animados:
 * en Android NativeWind las descarta). Al presionar se achica a .97. Primario = tinta sobre celeste (D10).
 */
export function Button({ label, variant = 'primary', arrow = false, disabled, onPress, ...rest }: Props) {
  const fg = disabled ? colors.graphite300 : variant === 'ghost' ? colors.sky700 : colors.ink;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      onPress={(e) => {
        if (Platform.OS !== 'web' && variant === 'primary') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.(e);
      }}
      style={({ pressed }) => [
        s.base,
        variant === 'primary' && (disabled ? s.primaryOff : s.primary),
        variant === 'primary' && pressed && !disabled && s.primaryPressed,
        variant === 'secondary' && (disabled ? s.secondaryOff : s.secondary),
        variant === 'secondary' && pressed && s.softPressed,
        variant === 'ghost' && s.ghost,
        variant === 'ghost' && pressed && s.softPressed,
        pressed && !disabled && { transform: [{ scale: 0.97 }] },
      ]}
      {...rest}
    >
      <View style={s.row}>
        <Text style={[s.label, { color: fg }]}>{label}</Text>
        {arrow ? <Icon name="arrow-right" size={20} color={fg} /> : null}
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  base: { minHeight: 52, borderRadius: 999, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  primary: { backgroundColor: colors.sky },
  primaryPressed: { backgroundColor: colors.sky600 },
  primaryOff: { backgroundColor: colors.graphite100 },
  secondary: { backgroundColor: colors.white, borderWidth: 2, borderColor: colors.graphite200 },
  secondaryOff: { backgroundColor: colors.graphite100, borderWidth: 2, borderColor: colors.graphite100 },
  ghost: { backgroundColor: 'transparent', minHeight: 48 },
  softPressed: { backgroundColor: colors.sky50 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  label: { fontFamily: fonts['poppins-semibold'], fontSize: 18, lineHeight: 26 },
});
