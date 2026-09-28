import { StyleSheet } from 'react-native';

import { colors } from '@/theme/tokens';

import { Icon, type IconName } from './Icon';
import { Tappable } from './Tappable';

type Props = {
  icon: IconName;
  label: string;
  onPress: () => void;
  size?: number;
  color?: string;
  tone?: 'ghost' | 'white';
};

/** Botón de solo ícono, con objetivo táctil de 48 dp y etiqueta accesible obligatoria. */
export function IconButton({ icon, label, onPress, size = 24, color = colors.ink, tone = 'ghost' }: Props) {
  return (
    <Tappable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={4}
      onPress={onPress}
      style={[s.base, tone === 'white' && s.white]}
      pressedStyle={s.pressed}
    >
      <Icon name={icon} size={size} color={color} />
    </Tappable>
  );
}

const s = StyleSheet.create({
  base: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  white: { backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  pressed: { backgroundColor: colors.sky50, transform: [{ scale: 0.96 }] },
});
