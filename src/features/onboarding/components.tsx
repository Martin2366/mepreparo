import { Image } from 'expo-image';
import { type ReactNode, useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, G } from 'react-native-svg';

import { Button } from '@/components/ui/Button';
import { Icon, isIconName } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { dur, easeOut } from '@/theme/motion';
import { colors, fonts } from '@/theme/tokens';

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
    <View style={{ flex: 1 }}>
      {scroll ? (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={{ flex: 1 }}>{children}</View>
      )}
      <View style={[s.footer, { paddingBottom: Math.max(insets.bottom, 12) + 4 }]}>
        <Button label={primary.label} onPress={primary.onPress} disabled={primary.disabled} arrow={primary.arrow ?? true} />
        {secondary ? <Button variant="ghost" label={secondary.label} onPress={secondary.onPress} /> : null}
      </View>
    </View>
  );
}

export function StepTitle({ title, subtitle, delay = 0 }: { title: string; subtitle?: string; delay?: number }) {
  return (
    <Animated.View entering={FadeInUp.duration(dur.slow).delay(delay).easing(easeOut)} style={{ gap: 6 }}>
      <Text accessibilityRole="header" style={s.title}>
        {title}
      </Text>
      {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
    </Animated.View>
  );
}

export function SectionLabel({ children }: { children: string }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionText}>{children.toUpperCase()}</Text>
    </View>
  );
}

const TILES = {
  balanza: require('@/assets/images/icons/balanza-tile.png'),
  funcion: require('@/assets/images/icons/funcion-tile.png'),
  triangulo: require('@/assets/images/icons/triangulo-tile.png'),
} as const;

/** Ícono de tema: las ilustraciones de marca (balanza, función, triángulo) o un ícono lineal en tile. */
export function TopicTile({ icon, size = 44 }: { icon: string; size?: number }) {
  if (icon in TILES) {
    return (
      <Image source={TILES[icon as keyof typeof TILES]} style={{ width: size, height: size, borderRadius: 12 }} contentFit="cover" />
    );
  }
  return (
    <View style={[s.tile, { width: size, height: size }]}>
      {isIconName(icon) ? <Icon name={icon} size={size * 0.5} color={colors.ink} /> : null}
    </View>
  );
}

/** Tarjeta destacada suave (tip / "ajá"): fondo celeste 50, chispa coral. */
export function Callout({ children }: { children: string }) {
  return (
    <View style={s.callout}>
      <View style={{ paddingTop: 2 }}>
        <Icon name="sparkle" size={20} color={colors.coral} />
      </View>
      <Text style={s.calloutText}>{children}</Text>
    </View>
  );
}

/**
 * Progreso 0→1 animado en JS (requestAnimationFrame, ease-out). Para contadores y la dona:
 * son pocos elementos y así no se cruza con el hilo de UI (evita errores de worklets).
 */
function useProgress(duration: number, delay = 0): number {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    let start: number | null = null;
    const t = setTimeout(() => {
      const tick = (now: number) => {
        start ??= now;
        const x = Math.min(1, (now - start) / duration);
        setP(1 - (1 - x) ** 3);
        if (x < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
    };
  }, [duration, delay]);
  return p;
}

/** Número que cuenta hacia arriba con suavidad (puntajes, porcentajes). */
export function CountUp({
  to,
  format,
  duration = 1100,
  delay = 150,
  style,
}: {
  to: number;
  format: (n: number) => string;
  duration?: number;
  delay?: number;
  style?: object;
}) {
  const p = useProgress(duration, delay);
  return (
    <Text style={style} accessibilityLabel={format(to)}>
      {format(p >= 1 ? to : Math.round(to * p * 20) / 20)}
    </Text>
  );
}

export type DonutSlice = { key: string; value: number; color: string };

/** Dona de ponderaciones: se dibuja en sentido horario desde arriba, en ~0,9 s. */
export function Donut({ slices, size = 200, stroke = 30, children }: { slices: DonutSlice[]; size?: number; stroke?: number; children?: ReactNode }) {
  const p = useProgress(900, 120);
  const total = slices.reduce((sum, x) => sum + x.value, 0) || 1;
  const r = (size - stroke) / 2;
  const C = 2 * Math.PI * r;
  const starts = slices.map((_, i) => slices.slice(0, i).reduce((sum, x) => sum + x.value, 0));
  const gap = slices.length > 1 ? 2.5 : 0;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={StyleSheet.absoluteFill}>
        <G transform={`translate(${size / 2} ${size / 2}) rotate(-90)`}>
          <Circle cx={0} cy={0} r={r} stroke={colors.graphite100} strokeWidth={stroke} fill="none" />
          {slices.map((sl, i) => {
            const len = (sl.value / total) * C;
            const off = (starts[i]! / total) * C;
            const drawn = Math.max(0, Math.min(len - gap, p * C - off));
            if (drawn <= 0) return null;
            return (
              <Circle
                key={sl.key}
                cx={0}
                cy={0}
                r={r}
                stroke={sl.color}
                strokeWidth={stroke}
                fill="none"
                strokeDasharray={`${drawn} ${C}`}
                strokeDashoffset={-off}
              />
            );
          })}
        </G>
      </Svg>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
  footer: {
    gap: 4,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: colors.paper,
  },
  title: { fontFamily: fonts['poppins-bold'], fontSize: 28, lineHeight: 36, color: colors.ink },
  subtitle: { fontFamily: fonts.poppins, fontSize: 15, lineHeight: 22, color: colors.graphite },
  section: { backgroundColor: colors.paper, paddingTop: 16, paddingBottom: 8 },
  sectionText: { fontFamily: fonts['poppins-semibold'], fontSize: 12, lineHeight: 16, letterSpacing: 1.6, color: colors.graphite },
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.sky200,
    backgroundColor: colors.white,
  },
  callout: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, borderRadius: 20, backgroundColor: colors.sky50, paddingHorizontal: 16, paddingVertical: 12 },
  calloutText: { flex: 1, fontFamily: fonts.poppins, fontSize: 16, lineHeight: 24, color: colors.ink },
});
