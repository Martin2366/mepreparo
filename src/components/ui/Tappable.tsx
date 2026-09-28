import { useState } from 'react';
import { Pressable, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

type Props = Omit<PressableProps, 'style'> & {
  style?: StyleProp<ViewStyle>;
  /** Estilo extra mientras se presiona. */
  pressedStyle?: StyleProp<ViewStyle>;
};

/**
 * Pressable con estilo estático. En Android, la interop de NativeWind descarta `style` cuando es
 * una función (`({ pressed }) => …`) y el botón queda sin fondo: aquí el estado se lleva a mano.
 */
export function Tappable({ style, pressedStyle, onPressIn, onPressOut, disabled, ...rest }: Props) {
  const [pressed, setPressed] = useState(false);
  return (
    <Pressable
      disabled={disabled}
      onPressIn={(e) => {
        setPressed(true);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        setPressed(false);
        onPressOut?.(e);
      }}
      style={[style, pressed && !disabled && pressedStyle]}
      {...rest}
    />
  );
}
