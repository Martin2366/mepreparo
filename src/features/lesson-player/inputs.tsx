import * as Haptics from 'expo-haptics';
import { useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { Icon } from '@/components/ui/Icon';
import { IconButton } from '@/components/ui/IconButton';
import { MathText } from '@/components/ui/MathText';
import { Tappable } from '@/components/ui/Tappable';
import { Text } from '@/components/ui/Text';
import { shuffle, rngFrom } from '@/engine/generators/core';
import { colors, fonts } from '@/theme/tokens';

const LETTERS = 'ABCDE';
const tap = () => Platform.OS !== 'web' && Haptics.selectionAsync();

export type Reveal = 'none' | 'wrong' | 'correct' | 'solution';

// ─── Alternativas ──────────────────────────────────────────────────────────

/** Alternativas A–D (AnswerOption del design system). El error se marca en grafito, nunca en rojo. */
export function ChoiceInput({
  options,
  selected,
  onSelect,
  reveal,
  answer,
}: {
  options: string[];
  selected: number | null;
  onSelect: (i: number) => void;
  reveal: Reveal;
  answer: number;
}) {
  const locked = reveal === 'correct' || reveal === 'solution';
  return (
    <View style={{ gap: 10 }} accessibilityRole="radiogroup">
      {options.map((opt, i) => {
        const isSel = selected === i;
        const showCorrect = (reveal === 'correct' && isSel) || (reveal === 'solution' && i === answer);
        const showWrong = (reveal === 'wrong' || reveal === 'solution') && isSel && i !== answer;
        const tone = showCorrect ? 'correct' : showWrong ? 'wrong' : isSel ? 'selected' : 'idle';
        return (
          <Tappable
            key={i}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSel, disabled: locked }}
            accessibilityLabel={`Alternativa ${LETTERS[i]}`}
            disabled={locked}
            onPress={() => {
              tap();
              onSelect(i);
            }}
            style={[s.option, OPTION[tone]]}
            pressedStyle={{ transform: [{ scale: 0.98 }] }}
          >
            <View style={[s.letter, LETTER[tone]]}>
              {showCorrect ? (
                <Icon name="check" size={16} color={colors.white} />
              ) : (
                <Text style={[s.letterText, (tone === 'selected' || tone === 'wrong') && { color: colors.white }]}>{LETTERS[i]}</Text>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <MathText source={opt} size={17} />
            </View>
          </Tappable>
        );
      })}
    </View>
  );
}

const OPTION = StyleSheet.create({
  idle: { backgroundColor: colors.white, borderColor: colors.graphite200 },
  selected: { backgroundColor: colors.sky100, borderColor: colors.sky },
  correct: { backgroundColor: colors.success50, borderColor: colors.success },
  wrong: { backgroundColor: colors.graphite100, borderColor: colors.graphite },
});

const LETTER = StyleSheet.create({
  idle: { borderColor: colors.graphite200, backgroundColor: colors.white },
  selected: { borderColor: colors.sky, backgroundColor: colors.sky },
  correct: { borderColor: colors.success, backgroundColor: colors.success },
  wrong: { borderColor: colors.graphite, backgroundColor: colors.graphite },
});

// ─── Respuesta numérica con teclado propio ─────────────────────────────────

/** Muestra lo escrito; si es una fracción válida, la dibuja apilada. */
function pretty(text: string): string {
  const frac = /^(-?)(\d+)\/(\d+)$/.exec(text);
  if (frac) return `$${frac[1]}\\frac{${frac[2]}}{${frac[3]}}$`;
  return text ? `$${text.replace('-', '−')}$` : '';
}

export function NumericInput({ value, onChange, suffix, disabled }: { value: string; onChange: (v: string) => void; suffix?: string; disabled?: boolean }) {
  const press = (k: string) => {
    if (disabled) return;
    tap();
    if (k === 'del') return onChange(value.slice(0, -1));
    if (k === '-') return onChange(value.startsWith('-') ? value.slice(1) : `-${value}`);
    if ((k === '/' || k === ',') && (value.includes('/') || value.includes(',') || !/\d$/.test(value))) return;
    if (value.replace(/\D/g, '').length >= 9 && /\d/.test(k)) return;
    onChange(value + k);
  };
  const rows = [
    ['7', '8', '9', 'del'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '/'],
    ['0', ',', '', ''],
  ];
  return (
    <View style={{ gap: 12 }}>
      <View style={[s.display, disabled && { opacity: 0.7 }]} accessibilityLabel={`Tu respuesta: ${value || 'vacía'}`}>
        {value ? <MathText source={pretty(value)} size={18} /> : <Text style={s.placeholder}>Escribe tu respuesta</Text>}
        {suffix ? <Text style={s.suffix}>{suffix}</Text> : null}
      </View>
      <View style={{ gap: 8 }}>
        {rows.map((row, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
            {row.map((k, j) =>
              k === '' ? (
                <View key={j} style={{ flex: 1 }} />
              ) : (
                <Tappable
                  key={j}
                  accessibilityRole="button"
                  accessibilityLabel={KEY_LABEL[k] ?? k}
                  onPress={() => press(k)}
                  disabled={disabled}
                  style={[s.key, (k === 'del' || k === '-' || k === '/' || k === ',') && s.keyAlt]}
                  pressedStyle={{ backgroundColor: colors.sky100, transform: [{ scale: 0.96 }] }}
                >
                  {k === 'del' ? (
                    <Icon name="delete" size={22} />
                  ) : (
                    <Text style={s.keyText}>{k === '-' ? '±' : k === '/' ? 'a/b' : k}</Text>
                  )}
                </Tappable>
              ),
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const KEY_LABEL: Record<string, string> = { del: 'Borrar', '-': 'Cambiar signo', '/': 'Fracción', ',': 'Coma decimal' };

// ─── Ordenar pasos ─────────────────────────────────────────────────────────

/** Orden inicial mezclado de forma estable (la misma semilla cada vez que se abre el paso). */
export function useShuffledOrder(n: number, seedText: string): number[] {
  return useMemo(() => {
    let seed = 0;
    for (const ch of seedText) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
    const base = Array.from({ length: n }, (_, i) => i);
    let out = shuffle(rngFrom(seed), base);
    if (out.every((v, i) => v === i)) out = [...base].reverse();
    return out;
  }, [n, seedText]);
}

export function OrderInput({ items, order, onChange, disabled }: { items: string[]; order: number[]; onChange: (o: number[]) => void; disabled?: boolean }) {
  const move = (pos: number, dir: -1 | 1) => {
    const to = pos + dir;
    if (to < 0 || to >= order.length || disabled) return;
    tap();
    const next = [...order];
    [next[pos], next[to]] = [next[to]!, next[pos]!];
    onChange(next);
  };
  return (
    <View style={{ gap: 8 }}>
      {order.map((itemIndex, pos) => (
        <View key={itemIndex} style={s.orderRow}>
          <Text style={s.orderNum}>{pos + 1}</Text>
          <View style={{ flex: 1 }}>
            <MathText source={items[itemIndex]!} size={16} />
          </View>
          <View style={{ flexDirection: 'row' }}>
            <IconButton icon="chevron-up" label="Subir" onPress={() => move(pos, -1)} size={20} />
            <IconButton icon="chevron-down" label="Bajar" onPress={() => move(pos, 1)} size={20} />
          </View>
        </View>
      ))}
      <Text style={s.hint}>Usa las flechas para subir o bajar cada paso.</Text>
    </View>
  );
}

// ─── Encontrar el error ────────────────────────────────────────────────────

export function FindErrorInput({
  lines,
  selected,
  onSelect,
  reveal,
  wrong,
}: {
  lines: string[];
  selected: number | null;
  onSelect: (i: number) => void;
  reveal: Reveal;
  wrong: number;
}) {
  const locked = reveal === 'correct' || reveal === 'solution';
  return (
    <View style={{ gap: 8 }}>
      {lines.map((line, i) => {
        const isSel = selected === i;
        const isWrongLine = (reveal === 'correct' && isSel) || (reveal === 'solution' && i === wrong);
        return (
          <Tappable
            key={i}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSel }}
            accessibilityLabel={`Línea ${i + 1}`}
            disabled={locked}
            onPress={() => {
              tap();
              onSelect(i);
            }}
            style={[s.line, isSel && OPTION.selected, reveal === 'wrong' && isSel && OPTION.wrong, isWrongLine && OPTION.correct]}
          >
            <Text style={s.orderNum}>{i + 1}</Text>
            <View style={{ flex: 1 }}>
              <MathText source={line} size={17} />
            </View>
          </Tappable>
        );
      })}
    </View>
  );
}

const s = StyleSheet.create({
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, borderWidth: 2 },
  letter: { width: 30, height: 30, borderRadius: 15, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  letterText: { fontFamily: fonts['poppins-semibold'], fontSize: 14, lineHeight: 18, color: colors.ink },
  display: {
    minHeight: 64,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.sky,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  placeholder: { fontFamily: fonts.poppins, fontSize: 16, color: colors.graphite300 },
  suffix: { fontFamily: fonts['poppins-medium'], fontSize: 16, color: colors.graphite },
  key: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyAlt: { backgroundColor: colors.sky50 },
  keyText: { fontFamily: fonts['poppins-semibold'], fontSize: 20, lineHeight: 26, color: colors.ink },
  orderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.graphite200,
    backgroundColor: colors.white,
    minHeight: 56,
  },
  orderNum: { fontFamily: fonts['poppins-semibold'], fontSize: 14, color: colors.graphite, width: 18 },
  hint: { fontFamily: fonts.poppins, fontSize: 13, color: colors.graphite },
  line: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 52,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: colors.graphite200,
    backgroundColor: colors.white,
  },
});
