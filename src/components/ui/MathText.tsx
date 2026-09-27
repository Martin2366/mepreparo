import { memo, useMemo } from 'react';
import { Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { type MathNode, parseRich, type RichSegment } from '@/engine/math-parser';
import { colors, fonts } from '@/theme/tokens';

type Props = {
  /** Texto de lección con matemática entre `$…$` (ver engine/math-parser). */
  source: string;
  /** Tamaño de la prosa. La matemática va un poco más grande: la queja real es "ejercicios muy pequeños". */
  size?: number;
  color?: string;
  /** Solo matemática, centrada (ecuaciones destacadas). */
  display?: boolean;
};

const MAX_SCALE = 1.4;
const THIN = ' '; // espacio de ¼ em alrededor de + y −
const MEDIUM = ' '; // espacio de ⅓ em alrededor de = y ≤

const isLetter = (s: string) => /\p{L}/u.test(s);

/** Espaciado tipo LaTeX: un "−" al inicio o tras "(" o "=" es unario y va pegado. */
function spaced(nodes: MathNode[], index: number): string {
  const node = nodes[index]!;
  if (node.type !== 'sym') return '';
  const prev = nodes[index - 1];
  const unary =
    node.role === 'bin' &&
    (!prev ||
      (prev.type === 'sym' &&
        (prev.role === 'open' || prev.role === 'rel' || prev.role === 'bin' || prev.role === 'punct')));
  if (node.role === 'rel') return `${MEDIUM}${node.value}${MEDIUM}`;
  if (node.role === 'bin' && !unary) return `${THIN}${node.value}${THIN}`;
  if (node.role === 'punct') return `${node.value}${THIN}`;
  return node.value;
}

function Row({ nodes, size, color }: { nodes: MathNode[]; size: number; color: string }) {
  const out: React.ReactNode[] = [];
  let run: React.ReactNode[] = [];
  const flush = () => {
    if (run.length === 0) return;
    out.push(
      <Text
        key={`r${out.length}`}
        maxFontSizeMultiplier={MAX_SCALE}
        style={{ fontSize: size, lineHeight: size * 1.25, color }}
      >
        {run}
      </Text>,
    );
    run = [];
  };

  nodes.forEach((node, i) => {
    if (node.type === 'sym') {
      run.push(
        <Text key={i} style={{ fontFamily: isLetter(node.value) ? fonts.math : fonts['math-upright'] }}>
          {spaced(nodes, i)}
        </Text>,
      );
      return;
    }
    flush();
    out.push(<Node key={i} node={node} size={size} color={color} />);
  });
  flush();

  return <View style={{ flexDirection: 'row', alignItems: 'center' }}>{out}</View>;
}

function Node({ node, size, color }: { node: Exclude<MathNode, { type: 'sym' }>; size: number; color: string }) {
  const stroke = Math.max(1.5, size * 0.06);

  if (node.type === 'frac') {
    const inner = Math.max(14, size * 0.82);
    return (
      <View style={{ alignItems: 'center', marginHorizontal: size * 0.08 }}>
        {/* El relleno lateral hace que la barra sobresalga de los números, como en un cuaderno. */}
        <View style={{ paddingHorizontal: size * 0.14 }}>
          <Row nodes={node.num} size={inner} color={color} />
        </View>
        <View
          style={{
            alignSelf: 'stretch',
            height: stroke,
            backgroundColor: color,
            marginVertical: size * 0.06,
            borderRadius: stroke,
          }}
        />
        <View style={{ paddingHorizontal: size * 0.14 }}>
          <Row nodes={node.den} size={inner} color={color} />
        </View>
      </View>
    );
  }

  if (node.type === 'sup') {
    const exp = Math.max(13, size * 0.64);
    // La línea de STIX tiene mucho aire arriba: el exponente se baja hasta la altura de la x.
    return (
      <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
        <Row nodes={[node.base]} size={size} color={color} />
        <View style={{ marginTop: size * 0.02, marginLeft: size * 0.01 }}>
          <Row nodes={node.exp} size={exp} color={color} />
        </View>
      </View>
    );
  }

  // Raíz: el signo se estira a la altura del contenido; el trazo no se deforma.
  return (
    <View style={{ flexDirection: 'row', alignItems: 'stretch', marginHorizontal: size * 0.06 }}>
      <Svg width={size * 0.55} height="100%" viewBox="0 0 10 20" preserveAspectRatio="none">
        <Path
          d="M0.6 12 L2.8 10.6 L5.4 19 L9.9 0.6 L10 0.6"
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </Svg>
      <View
        style={{ borderTopWidth: stroke, borderColor: color, paddingHorizontal: size * 0.1, paddingTop: size * 0.04 }}
      >
        <Row nodes={node.body} size={size} color={color} />
      </View>
    </View>
  );
}

function textAfter(segments: RichSegment[], i: number): string {
  const next = segments[i + 1];
  return next?.kind === 'text' ? next.value : '';
}

/**
 * Renderiza prosa + matemática legible en celular: fracciones apiladas, potencias y raíces reales.
 * La prosa se parte en palabras para que el texto fluya y haga saltos de línea alrededor de la matemática.
 */
export const MathText = memo(function MathText({ source, size = 17, color = colors.ink, display = false }: Props) {
  const segments = useMemo(() => parseRich(source), [source]);
  const mathSize = Math.round(size * (display ? 1.6 : 1.25));

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: display ? 'center' : 'flex-start',
      }}
    >
      {segments.map((seg, i) =>
        seg.kind === 'math' ? (
          // Si después viene un espacio, se vuelve margen de la expresión: así nunca queda un espacio suelto al inicio de línea.
          <View key={i} style={{ marginRight: /^\s/.test(textAfter(segments, i)) ? size * 0.28 : 0 }}>
            <Row nodes={seg.nodes} size={mathSize} color={color} />
          </View>
        ) : (
          (i > 0 ? seg.value.trimStart() : seg.value).split(/(?<=\s)/).map((word, j) => (
            <Text
              key={`${i}-${j}`}
              maxFontSizeMultiplier={MAX_SCALE}
              style={{ fontFamily: fonts.poppins, fontSize: size, lineHeight: size * 1.55, color }}
            >
              {word}
            </Text>
          ))
        ),
      )}
    </View>
  );
});
