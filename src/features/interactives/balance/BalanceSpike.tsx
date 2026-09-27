import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useState } from 'react';
import { type LayoutChangeEvent, Platform, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';
import { scheduleOnRN } from 'react-native-worklets';

import { Button } from '@/components/ui/Button';
import { MathText } from '@/components/ui/MathText';
import { Text } from '@/components/ui/Text';
import {
  applyToBoth,
  applyToOneSide,
  type Equation,
  equation,
  isSolved,
  type Operation,
  side,
  type SideName,
  weight,
} from '@/engine/balance';
import { cmp, isInteger, rat, type Rational, sub, toNumber, toString } from '@/engine/rational';
import { colors, fonts } from '@/theme/tokens';

// 3x + 1 = x + 5  →  x = 2. La solución solo se usa para inclinar la balanza (física), nunca se muestra.
const START = equation(side(3, 1), side(1, 5));
const HIDDEN_X = rat(2);

const ITEM = 48; // objetivo táctil mínimo
const MAX_TILT = 14; // grados
const DRAG_OUT = 64; // dp que hay que arrastrar para sacar un peso del platillo

type Kind = 'x' | 'unit';

function termLatex(s: Equation['left']): string {
  const parts: string[] = [];
  const x = s.x;
  if (x.n !== 0) parts.push(x.n === 1 && x.d === 1 ? 'x' : `${toString(x)}x`);
  if (s.c.n !== 0 || parts.length === 0) {
    const c = toString(s.c);
    parts.push(parts.length && s.c.n > 0 ? `+${c}` : c);
  }
  return parts.join('');
}

const toLatex = (e: Equation) => `$${termLatex(e.left)}=${termLatex(e.right)}$`;

/** Inclinación en grados: positiva = baja el platillo derecho (más pesado). */
function tiltOf(e: Equation): number {
  const diff = toNumber(sub(weight(e.right, HIDDEN_X), weight(e.left, HIDDEN_X)));
  return Math.max(-MAX_TILT, Math.min(MAX_TILT, diff * 5));
}

function count(r: Rational): number {
  return isInteger(r) && r.n > 0 ? r.n : 0;
}

export function BalanceSpike() {
  const [eq, setEq] = useState<Equation>(START);
  const [width, setWidth] = useState(0);
  const tilt = useSharedValue(0);

  const balanced = cmp(weight(eq.left, HIDDEN_X), weight(eq.right, HIDDEN_X)) === 0;
  const solved = balanced && isSolved(eq);

  useEffect(() => {
    tilt.value = withSpring(tiltOf(eq), { damping: 12, stiffness: 90, mass: 0.9 });
  }, [eq, tilt]);

  useEffect(() => {
    if (solved && Platform.OS !== 'web') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, [solved]);

  const removeOne = (which: SideName, kind: Kind) => {
    const op: Operation = { kind: 'sub', x: rat(kind === 'x' ? 1 : 0), c: rat(kind === 'unit' ? 1 : 0) };
    setEq((e) => applyToOneSide(e, which, op).equation);
    if (Platform.OS !== 'web') Haptics.selectionAsync();
  };

  const both = (op: Operation) => setEq((e) => applyToBoth(e, op).equation);

  const divisor = useMemo(() => {
    const k = eq.left.x.n > 1 ? eq.left.x.n : eq.right.x.n;
    const all = [eq.left.x, eq.left.c, eq.right.x, eq.right.c];
    return k > 1 && all.every((r) => isInteger(r) && r.n % k === 0) ? k : null;
  }, [eq]);

  const canRemove = (kind: Kind) =>
    kind === 'x' ? count(eq.left.x) > 0 && count(eq.right.x) > 0 : count(eq.left.c) > 0 && count(eq.right.c) > 0;

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  return (
    <View className="gap-5">
      <View className="rounded-lg border border-line bg-white px-4 py-5">
        <MathText source={toLatex(eq)} display size={22} />
      </View>

      <View onLayout={onLayout} style={{ height: 300 }}>
        {width > 0 && <Scale width={width} tilt={tilt} eq={eq} onRemove={removeOne} />}
      </View>

      <Feedback solved={solved} balanced={balanced} />

      <View className="gap-3">
        <Text variant="overline">Con botones (a ambos lados)</Text>
        <View className="gap-2">
          <Button
            variant="secondary"
            label="Quitar x de cada lado"
            disabled={!balanced || !canRemove('x')}
            onPress={() => both({ kind: 'sub', x: rat(1), c: rat(0) })}
          />
          <Button
            variant="secondary"
            label="Quitar 1 de cada lado"
            disabled={!balanced || !canRemove('unit')}
            onPress={() => both({ kind: 'sub', x: rat(0), c: rat(1) })}
          />
          <Button
            variant="secondary"
            label={divisor ? `Dividir ambos lados por ${divisor}` : 'Dividir ambos lados'}
            disabled={!balanced || divisor === null}
            onPress={() => divisor && both({ kind: 'div', k: rat(divisor) })}
          />
        </View>
        <Button variant="ghost" label="Reiniciar" onPress={() => setEq(START)} />
      </View>
    </View>
  );
}

function Feedback({ solved, balanced }: { solved: boolean; balanced: boolean }) {
  if (solved) {
    return (
      <View className="flex-row items-center gap-3 rounded-lg bg-success-50 px-4 py-3" accessibilityLiveRegion="polite">
        <Svg width={28} height={28} viewBox="0 0 24 24">
          <Path d="M12 2 Q13.5 10.5 22 12 Q13.5 13.5 12 22 Q10.5 13.5 2 12 Q10.5 10.5 12 2Z" fill={colors.coral} />
        </Svg>
        <Text className="flex-1 font-poppins-semibold text-success-700">¡Correcto! Despejaste la x.</Text>
      </View>
    );
  }
  if (!balanced) {
    return (
      <View className="rounded-lg bg-graphite-100 px-4 py-3" accessibilityLiveRegion="polite">
        <Text className="text-ink">
          Casi. La balanza se inclinó: lo que quitas de un lado, quítalo también del otro.
        </Text>
      </View>
    );
  }
  return (
    <Text variant="small">Arrastra un peso fuera de su platillo, o usa los botones. La meta: dejar la x sola.</Text>
  );
}

type ScaleProps = {
  width: number;
  tilt: SharedValue<number>;
  eq: Equation;
  onRemove: (which: SideName, kind: Kind) => void;
};

function Scale({ width, tilt, eq, onRemove }: ScaleProps) {
  const beamY = 70;
  const half = width * 0.27; // distancia del pivote al punto de cuelgue
  const panW = Math.min(width * 0.44, ITEM * 3 + 12);

  const beamStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${tilt.value}deg` }] }));

  return (
    <View style={{ flex: 1 }}>
      {/* Soporte */}
      <Svg
        style={{ position: 'absolute', left: width / 2 - 40, top: beamY, width: 80, height: 230 }}
        viewBox="0 0 80 230"
      >
        <Path d="M40 4 V200" stroke={colors.ink} strokeWidth={6} strokeLinecap="round" />
        <Path d="M12 214 H68" stroke={colors.ink} strokeWidth={8} strokeLinecap="round" />
        <Path d="M40 200 L20 214 H60 Z" fill={colors.ink} />
      </Svg>

      {/* Brazo */}
      <Animated.View
        style={[
          { position: 'absolute', left: width / 2 - half - 10, top: beamY - 4, width: half * 2 + 20, height: 8 },
          { borderRadius: 4, backgroundColor: colors.ink },
          beamStyle,
        ]}
      />
      <View
        style={{
          position: 'absolute',
          left: width / 2 - 9,
          top: beamY - 9,
          width: 18,
          height: 18,
          borderRadius: 9,
          borderWidth: 4,
          borderColor: colors.ink,
          backgroundColor: colors.white,
        }}
      />

      {(['left', 'right'] as const).map((which) => (
        <HangingPan key={which} which={which} tilt={tilt} half={half} left={width / 2 - panW / 2} top={beamY}>
          <Pan which={which} s={eq[which]} width={panW} onRemove={onRemove} />
        </HangingPan>
      ))}
    </View>
  );
}

type HangingPanProps = {
  which: SideName;
  tilt: SharedValue<number>;
  half: number;
  left: number;
  top: number;
  children: React.ReactNode;
};

/** El platillo cuelga del extremo del brazo: se traslada con él pero no rota (queda horizontal). */
function HangingPan({ which, tilt, half, left, top, children }: HangingPanProps) {
  const dir = which === 'left' ? -1 : 1;
  const style = useAnimatedStyle(() => {
    const rad = (tilt.value * Math.PI) / 180;
    return { transform: [{ translateX: dir * half * Math.cos(rad) }, { translateY: dir * half * Math.sin(rad) }] };
  });
  return <Animated.View style={[{ position: 'absolute', top, left }, style]}>{children}</Animated.View>;
}

function Pan({
  which,
  s,
  width,
  onRemove,
}: {
  which: SideName;
  s: Equation['left'];
  width: number;
  onRemove: ScaleProps['onRemove'];
}) {
  const xs = count(s.x);
  const units = count(s.c);
  const items: Kind[] = [...Array<Kind>(xs).fill('x'), ...Array<Kind>(units).fill('unit')];

  return (
    <View style={{ alignItems: 'center' }}>
      {/* Cuerdas */}
      <Svg width={width} height={40}>
        <Path
          d={`M${width / 2} 0 L12 40 M${width / 2} 0 L${width - 12} 40`}
          stroke={colors.graphite}
          strokeWidth={1.5}
        />
      </Svg>
      <View
        style={{
          width,
          minHeight: ITEM * 2 + 8,
          flexDirection: 'row',
          flexWrap: 'wrap-reverse',
          justifyContent: 'center',
          alignContent: 'flex-start',
        }}
      >
        {items.map((kind, i) => (
          // La clave incluye la cantidad para que un peso nuevo no herede el estado de arrastre de otro.
          <Weight key={`${kind}-${i}-${xs}-${units}`} kind={kind} onOut={() => onRemove(which, kind)} />
        ))}
      </View>
      <View style={{ width, height: 8, borderRadius: 4, backgroundColor: colors.ink }} />
    </View>
  );
}

function Weight({ kind, onOut }: { kind: Kind; onOut: () => void }) {
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const lifted = useSharedValue(0);

  const pan = Gesture.Pan()
    .onBegin(() => {
      lifted.value = withTiming(1, { duration: 120 });
    })
    .onUpdate((e) => {
      tx.value = e.translationX;
      ty.value = e.translationY;
    })
    .onEnd((e) => {
      if (Math.hypot(e.translationX, e.translationY) > DRAG_OUT) {
        scheduleOnRN(onOut);
      } else {
        tx.value = withSpring(0);
        ty.value = withSpring(0);
      }
    })
    .onFinalize(() => {
      lifted.value = withTiming(0, { duration: 120 });
    });

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.value }, { translateY: ty.value }, { scale: 1 + lifted.value * 0.08 }],
    zIndex: lifted.value > 0 ? 10 : 0,
  }));

  const label = kind === 'x' ? 'Peso x' : 'Peso de 1';

  return (
    <GestureDetector gesture={pan}>
      <Animated.View
        accessible
        accessibilityLabel={`${label}. Arrástralo fuera del platillo para quitarlo.`}
        style={[{ width: ITEM, height: ITEM, alignItems: 'center', justifyContent: 'center' }, style]}
      >
        {kind === 'x' ? (
          <View
            style={{
              width: 42,
              height: 42,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: colors.ink,
              backgroundColor: colors.sky200,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Animated.Text style={{ fontFamily: fonts.math, fontSize: 26, color: colors.ink, marginTop: -2 }}>
              x
            </Animated.Text>
          </View>
        ) : (
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              borderWidth: 2,
              borderColor: colors.ink,
              backgroundColor: colors.white,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Animated.Text style={{ fontFamily: fonts['math-upright'], fontSize: 20, color: colors.ink }}>
              1
            </Animated.Text>
          </View>
        )}
      </Animated.View>
    </GestureDetector>
  );
}
