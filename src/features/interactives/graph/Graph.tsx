import * as Haptics from 'expo-haptics';
import { useEffect, useMemo, useState } from 'react';
import { type LayoutChangeEvent, Platform, StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';

import { IconButton } from '@/components/ui/IconButton';
import { MathText } from '@/components/ui/MathText';
import { Text } from '@/components/ui/Text';
import type { StepOf } from '@/content/schema';
import { evalGraph, r } from '@/engine/grading';
import { add, cmp, eq, neg, type Rational, rat, toNumber } from '@/engine/rational';
import { tex } from '@/engine/generators/core';
import { colors, fonts } from '@/theme/tokens';

type Step = StepOf<'graph'>;

/** Valores posibles de un deslizador (grilla exacta de racionales). */
function gridOf(p: Step['params'][number]): Rational[] {
  const step = r(p.step);
  const out: Rational[] = [];
  const max = rat(Math.round(p.max * 1000), 1000);
  for (let v = rat(Math.round(p.min * 1000), 1000); cmp(v, max) <= 0 && out.length < 200; v = add(v, step)) out.push(v);
  return out;
}

export type GraphValues = Record<string, Rational>;

/**
 * Gráfico con deslizadores (lineal y cuadrática). Los valores viven en una grilla racional exacta,
 * así la corrección nunca depende de un flotante. Cada deslizador tiene botones − / + como alternativa al arrastre.
 */
export function Graph({ step, onChange, disabled }: { step: Step; onChange: (v: GraphValues) => void; disabled?: boolean }) {
  const grids = useMemo(() => step.params.map((p) => ({ p, grid: gridOf(p) })), [step]);
  const [idx, setIdx] = useState<number[]>(() =>
    grids.map(({ p, grid }) => Math.max(0, grid.findIndex((v) => cmp(v, r(p.start)) === 0))),
  );
  const values: GraphValues = useMemo(
    () => Object.fromEntries(grids.map(({ p, grid }, i) => [p.name, grid[idx[i] ?? 0] ?? rat(0)])),
    [grids, idx],
  );

  useEffect(() => onChange(values), [values, onChange]);

  const set = (i: number, next: number) => {
    const grid = grids[i]!.grid;
    const clamped = Math.max(0, Math.min(grid.length - 1, next));
    if (clamped === idx[i] || disabled) return;
    if (Platform.OS !== 'web') Haptics.selectionAsync();
    setIdx((cur) => cur.map((v, k) => (k === i ? clamped : v)));
  };

  const terms: [Rational, string][] =
    step.family === 'linear'
      ? [
          [values.m ?? rat(0), 'x'],
          [values.n ?? rat(0), ''],
        ]
      : [
          [values.a ?? rat(0), 'x^{2}'],
          [values.b ?? rat(0), 'x'],
          [values.c ?? rat(0), ''],
        ];
  const formula = `$y=${polyTex(terms)}$`;

  return (
    <View style={{ gap: 14 }}>
      <Plot step={step} values={values} />
      <View style={s.formula}>
        <MathText source={formula} size={17} display />
      </View>
      {grids.map(({ p, grid }, i) =>
        p.min === p.max ? null : (
          <View key={p.name} style={s.sliderRow}>
            <IconButton icon="minus" label={`Bajar ${p.name}`} onPress={() => set(i, (idx[i] ?? 0) - 1)} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={s.paramLabel}>
                {p.name} = {tex(grid[idx[i] ?? 0] ?? rat(0)).replace(/\\frac\{(\d+)\}\{(\d+)\}/, '$1/$2')}
              </Text>
              <Slider count={grid.length} index={idx[i] ?? 0} onIndex={(k) => set(i, k)} label={p.name} />
            </View>
            <IconButton icon="plus" label={`Subir ${p.name}`} onPress={() => set(i, (idx[i] ?? 0) + 1)} />
          </View>
        ),
      )}
    </View>
  );
}

function Slider({ count, index, onIndex, label }: { count: number; index: number; onIndex: (i: number) => void; label: string }) {
  const [w, setW] = useState(0);
  const toIndex = (x: number) => (w > 0 ? Math.round((Math.max(0, Math.min(w, x)) / w) * (count - 1)) : index);
  const pan = Gesture.Pan()
    .runOnJS(true)
    .minDistance(0)
    .onBegin((e) => onIndex(toIndex(e.x)))
    .onUpdate((e) => onIndex(toIndex(e.x)));
  const pos = count > 1 ? index / (count - 1) : 0;
  return (
    <GestureDetector gesture={pan}>
      <View
        onLayout={(e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width)}
        style={s.track}
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={`Deslizador ${label}`}
        accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
        onAccessibilityAction={(e) => onIndex(index + (e.nativeEvent.actionName === 'increment' ? 1 : -1))}
      >
        <View style={s.rail} />
        <View style={[s.fill, { width: `${pos * 100}%` }]} />
        <View style={[s.thumb, { left: w * pos - 14 }]} />
      </View>
    </GestureDetector>
  );
}

function Plot({ step, values }: { step: Step; values: GraphValues }) {
  const [w, setW] = useState(0);
  // Ventana por defecto de −6 a 6, ampliada para que los puntos marcados queden con margen.
  const marks = (step.marks ?? []).map(([mx, my]) => [toNumber(r(mx)), toNumber(r(my))] as const);
  const [x0, x1] = step.window?.x ?? [Math.min(-6, ...marks.map((p) => p[0] - 1)), Math.max(6, ...marks.map((p) => p[0] + 1))];
  const [y0, y1] = step.window?.y ?? [Math.min(-6, ...marks.map((p) => p[1] - 1)), Math.max(6, ...marks.map((p) => p[1] + 1))];
  const h = w * 0.78;
  const X = (x: number) => ((x - x0) / (x1 - x0)) * w;
  const Y = (y: number) => h - ((y - y0) / (y1 - y0)) * h;

  const points = useMemo(() => {
    if (!w) return '';
    const out: string[] = [];
    const n = 80;
    for (let i = 0; i <= n; i++) {
      const x = x0 + ((x1 - x0) * i) / n;
      const y = toNumber(evalGraph(step.family, values, rat(Math.round(x * 1000), 1000)));
      out.push(`${X(x).toFixed(1)},${Y(Math.max(y0 - 50, Math.min(y1 + 50, y))).toFixed(1)}`);
    }
    return out.join(' ');
    // X e Y dependen solo de w y la ventana
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [w, values, step.family, x0, x1, y0, y1]);

  const xs = range(Math.ceil(x0), Math.floor(x1));
  const ys = range(Math.ceil(y0), Math.floor(y1));
  const yStep = ys.length > 14 ? 2 : 1;

  return (
    <View onLayout={(e) => setW(e.nativeEvent.layout.width)} style={s.plot} accessibilityLabel="Plano cartesiano con la recta o parábola">
      {w > 0 ? (
        <Svg width={w} height={h}>
          {xs.map((x) => (
            <Line key={`x${x}`} x1={X(x)} x2={X(x)} y1={0} y2={h} stroke={x === 0 ? colors.ink : colors.graphite100} strokeWidth={x === 0 ? 1.5 : 1} />
          ))}
          {ys
            .filter((y) => y % yStep === 0)
            .map((y) => (
              <Line key={`y${y}`} y1={Y(y)} y2={Y(y)} x1={0} x2={w} stroke={y === 0 ? colors.ink : colors.graphite100} strokeWidth={y === 0 ? 1.5 : 1} />
            ))}
          <Polyline points={points} fill="none" stroke={colors.sky} strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
          {(step.marks ?? []).map(([mx, my], i) => (
            <Circle key={i} cx={X(toNumber(r(mx)))} cy={Y(toNumber(r(my)))} r={7} fill={colors.white} stroke={colors.ink} strokeWidth={2.5} />
          ))}
        </Svg>
      ) : null}
      {w > 0 ? (
        <>
          <Text style={[s.axisLabel, { left: w - 14, top: Y(0) + 2 }]}>x</Text>
          <Text style={[s.axisLabel, { left: X(0) + 5, top: 2 }]}>y</Text>
        </>
      ) : null}
    </View>
  );
}

/** `[[2,'x'],[−1,'']]` → `2x-1`, sin coeficientes 1 ni términos nulos. */
function polyTex(terms: [Rational, string][]): string {
  let out = '';
  for (const [k, v] of terms) {
    if (k.n === 0) continue;
    const abs = k.n < 0 ? neg(k) : k;
    const coef = v && eq(abs, rat(1)) ? '' : tex(abs);
    out += `${k.n < 0 ? '-' : out ? '+' : ''}${coef}${v}`;
  }
  return out || '0';
}

const range = (a: number, b: number) => Array.from({ length: Math.max(0, b - a + 1) }, (_, i) => a + i);

const s = StyleSheet.create({
  plot: { width: '100%', borderRadius: 14, overflow: 'hidden', backgroundColor: colors.white, borderWidth: 1, borderColor: colors.line },
  formula: { paddingVertical: 4 },
  sliderRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  paramLabel: { fontFamily: fonts['poppins-semibold'], fontSize: 15, lineHeight: 20, color: colors.ink },
  track: { height: 36, justifyContent: 'center' },
  rail: { height: 6, borderRadius: 3, backgroundColor: colors.graphite100 },
  fill: { position: 'absolute', left: 0, height: 6, borderRadius: 3, backgroundColor: colors.sky },
  thumb: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: colors.sky,
  },
  axisLabel: { position: 'absolute', fontFamily: fonts.math, fontSize: 16, color: colors.ink },
});
