import { forwardRef, useState } from 'react';
import { Pressable, TextInput, type TextInputProps, View } from 'react-native';
import Animated, { interpolateColor, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';

import { dur, easeOut } from '@/theme/motion';
import { colors, fonts } from '@/theme/tokens';

import { Icon } from './Icon';

type FieldProps = Omit<TextInputProps, 'style'> & { large?: boolean };

function useFocusBorder(focused: boolean, strong: boolean) {
  const f = useDerivedValue(() => withTiming(focused ? 1 : 0, { duration: dur.base, easing: easeOut }), [focused]);
  return useAnimatedStyle(() => ({
    borderColor: interpolateColor(f.value, [0, 1], [strong ? colors.sky200 : colors.graphite200, colors.sky]),
    // Anillo de foco del design system (celeste al 40 %), dibujado como sombra suave.
    shadowOpacity: f.value * 0.35,
  }));
}

const fieldBox = {
  borderWidth: 2,
  backgroundColor: colors.white,
  shadowColor: colors.sky,
  shadowOffset: { width: 0, height: 0 },
  shadowRadius: 6,
  elevation: 0,
} as const;

/** Campo de texto de la marca (Input): borde grafito → celeste al enfocar. */
export const TextField = forwardRef<TextInput, FieldProps>(function TextField({ onFocus, onBlur, ...rest }, ref) {
  const [focused, setFocused] = useState(false);
  const border = useFocusBorder(focused, false);
  return (
    <Animated.View style={[fieldBox, { borderRadius: 14 }, border]}>
      <TextInput
        ref={ref}
        placeholderTextColor={colors.graphite300}
        maxFontSizeMultiplier={1.4}
        style={{ fontFamily: fonts.poppins, fontSize: 19, color: colors.ink, paddingHorizontal: 16, minHeight: 56, outlineWidth: 0 }}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
    </Animated.View>
  );
});

/**
 * Buscador destacado: más alto, borde celeste siempre visible, lupa y botón para limpiar.
 * Es la acción principal de las listas largas (universidades, carreras).
 */
export function SearchField({ value, onChangeText, placeholder, ...rest }: FieldProps) {
  const [focused, setFocused] = useState(false);
  const border = useFocusBorder(focused, true);
  return (
    <Animated.View style={[fieldBox, { borderRadius: 999 }, border]} className="flex-row items-center pl-4 pr-2">
      <Icon name="search" size={22} color={focused ? colors.sky700 : colors.graphite} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.graphite300}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
        maxFontSizeMultiplier={1.4}
        accessibilityLabel={placeholder}
        style={{ flex: 1, fontFamily: fonts.poppins, fontSize: 17, color: colors.ink, paddingHorizontal: 12, minHeight: 54, outlineWidth: 0 }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
      />
      {value ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Borrar búsqueda"
          onPress={() => onChangeText?.('')}
          className="h-10 w-10 items-center justify-center rounded-full active:bg-sky-50"
        >
          <Icon name="x" size={20} color={colors.graphite} />
        </Pressable>
      ) : (
        <View className="w-2" />
      )}
    </Animated.View>
  );
}
