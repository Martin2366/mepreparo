import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { MathText } from '@/components/ui/MathText';
import { Text } from '@/components/ui/Text';
import { questionOf } from '@/engine/exam';
import { unitRef } from '@/features/content/catalog';
import { ChoiceInput } from '@/features/lesson-player/inputs';
import { FullScreen } from '@/features/shell/FullScreen';
import { colors, fonts } from '@/theme/tokens';

import { useExams } from './store';

const LETTERS = 'ABCDE';

/**
 * Revisión de una pregunta (PRD §9): tu respuesta, la correcta, la explicación de CADA alternativa y la
 * resolución paso a paso. En el plan gratis la revisión completa también es gratis.
 */
export function ExamReviewScreen({ id, index }: { id: string; index: number }) {
  const record = useExams((s) => s.history.find((r) => r.id === id));
  const q = record?.questions[index];
  const ex = q ? questionOf(q) : null;
  if (!record || !q || !ex) return <FullScreen title="Revisión">{null}</FullScreen>;
  const step = ex.step;
  const chosen = record.answers[index] ?? null;
  const ok = chosen === step.answer;
  const total = record.questions.length;
  const go = (i: number) => router.setParams({ q: String(i) });

  return (
    <FullScreen
      title={`Pregunta ${index + 1} de ${total}`}
      footer={
        <View style={s.row}>
          <View style={{ flex: 1 }}>
            <Button label="Anterior" variant="secondary" disabled={index === 0} onPress={() => go(index - 1)} />
          </View>
          <View style={{ flex: 1 }}>
            {index < total - 1 ? <Button label="Siguiente" onPress={() => go(index + 1)} /> : <Button label="Listo" onPress={() => router.back()} />}
          </View>
        </View>
      }
    >
      <View style={s.row}>
        <Chip label={ok ? 'Correcta' : chosen === null ? 'En blanco' : 'Incorrecta'} tone={ok ? 'success' : 'neutral'} />
        <Chip label={unitRef(q.unitId)?.unit.name ?? ''} tone="neutral" />
      </View>
      <MathText source={step.prompt} size={18} />
      <ChoiceInput options={step.options} selected={chosen} onSelect={() => undefined} reveal="solution" answer={step.answer} />
      {!ok && chosen !== null ? <Text style={s.caption}>Tu respuesta: {LETTERS[chosen]}</Text> : null}

      <Card style={{ gap: 12 }}>
        <Text style={s.strong}>Por qué cada alternativa</Text>
        {step.options.map((opt, i) => (
          <View key={i} style={{ gap: 2 }}>
            <View style={s.row}>
              <Text style={[s.letter, i === step.answer && { color: colors.success700 }]}>{LETTERS[i]})</Text>
              <View style={{ flex: 1 }}>
                <MathText source={opt} size={15} />
              </View>
            </View>
            <View style={{ paddingLeft: 26 }}>
              <MathText source={i === step.answer ? 'Correcta.' : (step.feedback[String(i)] ?? '')} size={14} color={colors.graphite} />
            </View>
          </View>
        ))}
      </Card>

      {step.solution?.length ? (
        <Card tone="sky" style={{ gap: 8 }}>
          <Text style={s.strong}>Resolución paso a paso</Text>
          {step.solution.map((l, i) => (
            <MathText key={i} source={l} size={16} />
          ))}
        </Card>
      ) : null}
    </FullScreen>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  strong: { fontFamily: fonts['poppins-semibold'], fontSize: 16, color: colors.ink },
  caption: { fontFamily: fonts.poppins, fontSize: 13, color: colors.graphite },
  letter: { fontFamily: fonts['poppins-semibold'], fontSize: 15, color: colors.ink, width: 22 },
});
