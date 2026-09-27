import { Image } from 'expo-image';
import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { popSpring } from '@/theme/motion';

import { Text } from './Text';

const POSES = {
  saludo: require('@/assets/images/mascot/equis-saludo.png'),
  pensando: require('@/assets/images/mascot/equis-pensando.png'),
  senalando: require('@/assets/images/mascot/equis-senalando.png'),
  aja: require('@/assets/images/mascot/equis-aja.png'),
  explicando: require('@/assets/images/mascot/equis-explicando.png'),
  celebrando: require('@/assets/images/mascot/equis-celebrando.png'),
  estudiando: require('@/assets/images/mascot/equis-estudiando.png'),
  descansando: require('@/assets/images/mascot/equis-descansando.png'),
  curioso: require('@/assets/images/mascot/expr-curioso.png'),
  apoyo: require('@/assets/images/mascot/expr-apoyo.png'),
  tranquilo: require('@/assets/images/mascot/expr-tranquilo.png'),
} as const;

/** Proporción ancho/alto de cada pose (de los PNG del design system). */
const RATIO: Record<keyof typeof POSES, number> = {
  saludo: 330 / 370,
  pensando: 275 / 370,
  senalando: 325 / 365,
  aja: 290 / 420,
  explicando: 315 / 350,
  celebrando: 305 / 380,
  estudiando: 245 / 355,
  descansando: 340 / 230,
  curioso: 140 / 150,
  apoyo: 153 / 148,
  tranquilo: 140 / 148,
};

export type MascotPose = keyof typeof POSES;

type Props = {
  pose: MascotPose;
  height: number;
  /** Flota suavemente (respiración). Se desactiva si el sistema pide menos movimiento. */
  float?: boolean;
  /** Entrada con "pop" (momentos de logro). */
  pop?: boolean;
  /** Pequeños saltos de alegría repetidos. */
  cheer?: boolean;
  label?: string;
};

/** Equis, la mascota. Siempre con pose con sentido; nunca decorativa sin motivo. */
export function Mascot({ pose, height, float = true, pop = false, cheer = false, label = 'Equis' }: Props) {
  const reduce = useReducedMotion();
  const y = useSharedValue(0);
  const s = useSharedValue(pop && !reduce ? 0.85 : 1);

  useEffect(() => {
    if (reduce) return;
    if (pop) s.value = withSpring(1, popSpring);
    if (cheer) {
      y.value = withDelay(
        250,
        withRepeat(
          withSequence(withTiming(-10, { duration: 220, easing: Easing.out(Easing.quad) }), withTiming(0, { duration: 260, easing: Easing.bounce })),
          3,
        ),
      );
    } else if (float) {
      y.value = withRepeat(withTiming(-4, { duration: 1800, easing: Easing.inOut(Easing.sin) }), -1, true);
    }
  }, [reduce, pop, cheer, float, s, y]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateY: y.value }, { scale: s.value }] }));

  return (
    <Animated.View style={style} accessible accessibilityRole="image" accessibilityLabel={label}>
      <Image source={POSES[pose]} style={{ height, width: height * RATIO[pose] }} contentFit="contain" />
    </Animated.View>
  );
}

/** Globo de diálogo de Equis (design system: tarjeta blanca con borde cálido). */
export function SpeechBubble({ children }: { children: string }) {
  return (
    <View className="flex-1 rounded-lg border border-line bg-white px-4 py-3" style={{ borderTopLeftRadius: 6 }}>
      <Text className="text-ink">{children}</Text>
    </View>
  );
}

/** Nota manuscrita de Equis (Kalam, levemente girada), como en el tablero de marca. */
export function HandNote({ children, rotate = -4, size = 22 }: { children: string; rotate?: number; size?: number }) {
  return (
    <Text variant="hand" style={{ transform: [{ rotate: `${rotate}deg` }], fontSize: size, lineHeight: size * 1.2 }}>
      {children}
    </Text>
  );
}
