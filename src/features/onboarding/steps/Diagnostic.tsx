import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { Icon, type IconName } from '@/components/ui/Icon';
import { HandNote, Mascot } from '@/components/ui/Mascot';
import { MathText } from '@/components/ui/MathText';
import { Text } from '@/components/ui/Text';
import diagnostic from '@/content/diagnostic.json';
import { colors, fonts } from '@/theme/tokens';

import { StepLayout } from '../components';
import { useOnboarding } from '../store';
import type { StepProps } from './types';

export const QUESTIONS = diagnostic.questions;
export const EMPTY_DIAG = { qi: 0, answers: [] as (boolean | null)[], done: false, skipped: false };

function Fact({ icon, label }: { icon: IconName; label: string }) {
  return (
    <View style={s.fact}>
      <Icon name={icon} size={20} color={colors.sky700} />
      <Text style={s.factText}>{label}</Text>
    </View>
  );
}

export function DiagInviteStep({ next }: StepProps) {
  const update = useOnboarding((st) => st.update);
  return (
    <StepLayout
      primary={{ label: 'Comenzar diagnóstico', onPress: () => (update({ diag: { ...EMPTY_DIAG } }), next()) }}
      secondary={{
        label: 'Saltar por ahora',
        onPress: () => (update({ diag: { ...EMPTY_DIAG, skipped: true } }), next()),
      }}
    >
      <View style={{ alignItems: 'center', gap: 10 }}>
        <Image
          source={require('@/assets/images/illustrations/equis-cuaderno-abierto.webp')}
          style={{ height: 220, aspectRatio: 622 / 640 }}
          contentFit="contain"
          accessibilityLabel="Equis con un cuaderno abierto"
        />
        <Text style={s.overline}>DIAGNÓSTICO</Text>
        <Text style={s.title}>¿Vemos desde dónde partes?</Text>
        <Text style={s.sub}>No es una prueba. Nadie ve tu resultado: solo sirve para ajustar tu plan.</Text>
      </View>
      <View style={s.facts}>
        <Fact icon="list-checks" label={`${QUESTIONS.length} preguntas`} />
        <Fact icon="clock" label="~8 min" />
        <Fact icon="eye-off" label="Sin nota" />
      </View>
    </StepLayout>
  );
}

/**
 * Diagnóstico de 10 preguntas. No muestra si acertaste (sin presión); «No lo sé» cuenta igual.
 * Cada respuesta se guarda al instante: si la app se cierra, retoma en la misma pregunta.
 */
export function DiagnosticStep({ next }: StepProps) {
  const diag = useOnboarding((st) => st.answers.diag) ?? EMPTY_DIAG;
  const update = useOnboarding((st) => st.update);
  const [sel, setSel] = useState<number | null>(null);
  const qi = Math.min(diag.qi, QUESTIONS.length - 1);
  const q = QUESTIONS[qi]!;
  const last = qi + 1 >= QUESTIONS.length;

  const answer = (value: boolean | null) => {
    const answers = [...diag.answers.slice(0, qi), value];
    setSel(null);
    if (last) {
      update({ diag: { ...diag, answers, qi, done: true } });
      next();
    } else update({ diag: { ...diag, answers, qi: qi + 1 } });
  };

  return (
    <StepLayout
      primary={{
        label: last ? 'Terminar' : 'Siguiente',
        disabled: sel === null,
        onPress: () => answer(sel === q.answer),
      }}
      secondary={{ label: 'No lo sé', onPress: () => answer(null) }}
    >
      <View key={q.id} style={{ gap: 14 }}>
        <View style={s.card}>
          <View style={s.cardHead}>
            <Text style={s.axis}>M1</Text>
            <Text style={s.topic}>{q.topic}</Text>
          </View>
          <MathText source={q.q} size={18} />
          <View style={{ gap: 8, marginTop: 6 }}>
            {q.options.map((o, k) => {
              const on = sel === k;
              return (
                <Pressable
                  key={o}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: on }}
                  accessibilityLabel={`Alternativa ${'ABCD'[k]}`}
                  onPress={() => {
                    if (Platform.OS !== 'web') Haptics.selectionAsync();
                    setSel(k);
                  }}
                  style={({ pressed }) => [s.opt, on && s.optOn, pressed && { transform: [{ scale: 0.985 }] }]}
                >
                  <View style={[s.letter, on && s.letterOn]}>
                    <Text style={[s.letterText, on && { color: colors.white }]}>{'ABCD'[k]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <MathText source={o} size={17} />
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
        <View style={s.noteRow}>
          <Mascot pose="pensando" height={58} float={false} />
          <View style={{ flex: 1 }}>
            <HandNote size={19} rotate={-3}>
              Si no sabes, marca «No lo sé». Me ayuda igual.
            </HandNote>
          </View>
        </View>
      </View>
    </StepLayout>
  );
}

const s = StyleSheet.create({
  overline: {
    fontFamily: fonts['poppins-semibold'],
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 1.7,
    color: colors.sky700,
  },
  title: { fontFamily: fonts['poppins-bold'], fontSize: 26, lineHeight: 32, color: colors.ink, textAlign: 'center' },
  sub: {
    fontFamily: fonts.poppins,
    fontSize: 15,
    lineHeight: 22,
    color: colors.graphite,
    textAlign: 'center',
    maxWidth: 320,
  },
  facts: { flexDirection: 'row', gap: 8, marginTop: 20 },
  fact: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  factText: {
    fontFamily: fonts['poppins-medium'],
    fontSize: 13,
    lineHeight: 17,
    color: colors.ink,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 20,
    gap: 12,
  },
  cardHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  axis: {
    fontFamily: fonts['poppins-semibold'],
    fontSize: 12,
    lineHeight: 16,
    color: colors.sky700,
    backgroundColor: colors.sky100,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    overflow: 'hidden',
  },
  topic: { fontFamily: fonts['poppins-medium'], fontSize: 13, lineHeight: 18, color: colors.graphite },
  opt: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: colors.white,
  },
  optOn: { backgroundColor: colors.sky100, borderColor: colors.sky },
  letter: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: colors.graphite200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  letterOn: { backgroundColor: colors.sky, borderColor: colors.sky },
  letterText: { fontFamily: fonts['poppins-semibold'], fontSize: 13, lineHeight: 18, color: colors.ink },
  noteRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
});
