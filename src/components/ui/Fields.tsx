import { forwardRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, type TextInputProps, View } from 'react-native';

import { colors, fonts } from '@/theme/tokens';

import { Icon } from './Icon';

type FieldProps = Omit<TextInputProps, 'style'>;

/** Campo de texto de la marca (Input): borde grafito → celeste al enfocar. */
export const TextField = forwardRef<TextInput, FieldProps>(function TextField({ onFocus, onBlur, ...rest }, ref) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[s.box, s.boxField, focused && s.boxFocus]}>
      <TextInput
        ref={ref}
        placeholderTextColor={colors.graphite300}
        maxFontSizeMultiplier={1.4}
        style={s.inputField}
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
    </View>
  );
});

/**
 * Buscador destacado: píldora alta con borde celeste siempre visible, lupa y botón para limpiar.
 * Es la acción principal de las listas largas (universidades, carreras).
 */
export function SearchField({ value, onChangeText, placeholder, ...rest }: FieldProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={[s.box, s.boxSearch, focused && s.boxFocus]}>
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
        style={s.inputSearch}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...rest}
      />
      {value ? (
        <Pressable accessibilityRole="button" accessibilityLabel="Borrar búsqueda" onPress={() => onChangeText?.('')} style={s.clear} hitSlop={6}>
          <Icon name="x" size={20} color={colors.graphite} />
        </Pressable>
      ) : null}
    </View>
  );
}

const s = StyleSheet.create({
  box: { borderWidth: 2, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center' },
  boxField: { borderRadius: 14, borderColor: colors.graphite200 },
  boxSearch: { borderRadius: 999, borderColor: colors.sky200, paddingLeft: 16, paddingRight: 6, minHeight: 56 },
  boxFocus: { borderColor: colors.sky },
  inputField: {
    flex: 1,
    fontFamily: fonts.poppins,
    fontSize: 19,
    color: colors.ink,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 56,
    outlineWidth: 0,
  },
  inputSearch: {
    flex: 1,
    fontFamily: fonts.poppins,
    fontSize: 17,
    color: colors.ink,
    paddingHorizontal: 12,
    paddingVertical: 10,
    outlineWidth: 0,
  },
  clear: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
