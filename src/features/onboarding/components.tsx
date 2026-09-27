import { Image } from 'expo-image';
import { type ReactNode, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import Animated, {
  FadeInUp,
  useAnimatedProps,
  useAnimatedReaction,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, G } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';

import { Button } from '@/components/ui/Button';
import { Icon, isIconName } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { dur, easeOut } from '@/theme/motion';
import { colors } from '@/theme/tokens';

type Action = { label: string; onPress: () => void; disabled?: boolean; arrow?: boolean };

/**
 * Estructura de cada paso: contenido arriba y la acción principal fija abajo (una sola por pantalla),
 * con una acción secundaria opcional ("Aún no lo sé").
 */
export function StepLayout({
  children,
  primary,
  secondary,
  scroll = true,
}: {
  children: ReactNode;
  primary: Action;
  secondary?: Action;
  scroll?: boolean;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View className="flex-1">
      {scroll ? (
        <ScrollView
          className="flex-1"
          contentContainerClassName="flex-grow px-5 pb-6 pt-2"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View className="flex-1">{children}</View>
      )}
      <View
        className="gap-1 border-t border-line bg-paper px-5 pt-3"
        style={{ paddingBottom: Math.max(insets.bottom, 12) + 4 }}
      >
        <Button label={primary.label} onPress={primary.onPress} disabled={primary.disabled} arrow={primary.arrow ?? true} />
        {secondary ? <Button variant="ghost" label={secondary.label} onPress={secondary.onPress} arrow={false} /> : null}
      </View>
    </View>
  );
}

export function StepTitle({ title, subtitle, delay = 0 }: { title: string; subtitle?: string; delay?: number }) {
  return (
    <Animated.View entering={FadeInUp.duration(dur.slow).delay(delay).easing(easeOut)} className="gap-1.5">
      <Text accessibilityRole="header" className="font-poppins-bold text-h2 text-ink">
        {title}
      </Text>
      {subtitle ? <Text variant="small">{subtitle}</Text> : null}
    </Animated.View>
  );
}

export function SectionLabel({ children }: { children: string }) {
  return (
    <View className="bg-paper pb-2 pt-4">
      <Text variant="overline" className="text-graphite">
        {children}
      </Text>
    </View>
  );
}

const TILES = {
  balanza: require('@/assets/images/icons/balanza-tile.png'),
  funcion: require('@/assets/images/icons/funcion-tile.png'),
  triangulo: require('@/assets/images/icons/triangulo-tile.png'),
} as const;

/** Ícono de tema: las ilustraciones de marca (balanza, función, triángulo) o un ícono lineal en tile celeste. */
export function TopicTile({ icon, size = 44 }: { icon: string; size?: number }) {
  if (icon in TILES) {
    return (
      <Image
        source={TILES[icon as keyof typeof TILES]}
        style={{ width: size, height: size, borderRadius: 12 }}
        contentFit="cover"
      />
    );
  }
  return (
    <View className="items-center justify-center rounded-md border border-sky-200 bg-white" style={{ width: size, height: size }}>
      {isIconName(icon) ? <Icon name={icon} size={size * 0.5} color={colors.ink} /> : null}
    </View>
  );
}

/** Tarjeta destacada suave (tip / "ajá"): fondo celeste 50, chispa coral. */
export function Callout({ children }: { children: string }) {
  return (
    <View className="flex-row items-start gap-3 rounded-lg bg-sky-50 px-4 py-3">
      <View className="pt-0.5">
        <Icon name="sparkle" size={20} color={colors.coral} />
      </View>
      <Text className="flex-1 text-ink">{children}</Text>
    </View>
  );
}

/** Número que cuenta hacia arriba con suavidad (puntajes, porcentajes). */
export function CountUp({
  to,
  format,
  duration = 1200,
  delay = 150,
  className,
  style,
}: {
  to: number;
  format: (n: number) => string;
  duration?: number;
  delay?: number;
  className?: string;
  style?: object;
}) {
  const v = useSharedValue(0);
  const [shown, setShown] = useState(format(0));
  useEffect(() => {
    v.value = withDelay(delay, withTiming(to, { duration, easing: easeOut }));
  }, [to, delay, duration, v]);
  useAnimatedReaction(
    () => Math.round(v.value * 20) / 20,
    (cur, prev) => {
      if (cur !== prev) scheduleOnRN(setShown, format(cur));
    },
  );
  return (
    <Text className={className} style={style} accessibilityLabel={format(to)}>
      {shown}
    </Text>
  );
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export type DonutSlice = { key: string; value: number; color: string };

function DonutArc({ slice, start, total, progress, r, stroke }: { slice: DonutSlice; start: number; total: number; progress: { value: number }; r: number; stroke: number }) {
  const C = 2 * Math.PI * r;
  const len = (slice.value / total) * C;
  const off = (start / total) * C;
  const gap = 2.5;
  const props = useAnimatedProps(() => {
    const drawn = Math.max(0, Math.min(len - gap, progress.value * C - off));
    return { strokeDasharray: [drawn, C], strokeDashoffset: -off };
  });
  return <AnimatedCircle cx={0} cy={0} r={r} stroke={slice.color} strokeWidth={stroke} fill="none" animatedProps={props} />;
}

/** Dona de ponderaciones: se dibuja en sentido horario desde arriba, en ~0,9 s. */
export function Donut({ slices, size = 200, stroke = 30, children }: { slices: DonutSlice[]; size?: number; stroke?: number; children?: ReactNode }) {
  const progress = useSharedValue(0);
  useEffect(() => {
    progress.value = withDelay(120, withTiming(1, { duration: 900, easing: easeOut }));
  }, [progress]);
  const total = slices.reduce((s, x) => s + x.value, 0);
  const r = (size - stroke) / 2;
  const starts = slices.map((_, i) => slices.slice(0, i).reduce((sum, x) => sum + x.value, 0));
  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <G transform={`translate(${size / 2} ${size / 2}) rotate(-90)`}>
          <Circle cx={0} cy={0} r={r} stroke={colors.graphite100} strokeWidth={stroke} fill="none" />
          {slices.map((s, i) => (
            <DonutArc key={s.key} slice={s} start={starts[i]!} total={total} progress={progress} r={r} stroke={stroke} />
          ))}
        </G>
      </Svg>
      {children}
    </View>
  );
}
