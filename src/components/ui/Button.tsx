import { Pressable, type PressableProps } from 'react-native';

import { Text } from './Text';

type Props = Omit<PressableProps, 'children'> & {
  label: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
};

const BOX = {
  primary: 'bg-sky active:bg-sky-700',
  secondary: 'bg-white border-2 border-graphite-200 active:bg-sky-50',
  ghost: 'bg-transparent active:bg-sky-50',
} as const;

const LABEL = {
  primary: 'text-white',
  secondary: 'text-ink',
  ghost: 'text-sky-700',
} as const;

/** Botón píldora de la marca (≥ 48 dp). Press: escala .97, como define el design system. */
export function Button({ label, variant = 'primary', disabled, className = '', ...rest }: Props) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      className={`min-h-tap items-center justify-center rounded-full px-6 py-3 active:scale-[0.97] ${
        disabled ? 'bg-graphite-100' : BOX[variant]
      } ${className}`}
      {...rest}
    >
      <Text className={`font-poppins-semibold ${disabled ? 'text-graphite-300' : LABEL[variant]}`}>{label}</Text>
    </Pressable>
  );
}
