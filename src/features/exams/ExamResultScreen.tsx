import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { Mascot } from '@/components/ui/Mascot';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Text } from '@/components/ui/Text';
import { SKILL_LABEL, SKILLS } from '@/content/schema';
import { questionOf } from '@/engine/exam';
import { axisById } from '@/features/content/catalog';
import { Section } from '@/features/shell/TabScreen';
import { FullScreen } from '@/features/shell/FullScreen';
import { colors, fonts } from '@/theme/tokens';

import { useExams } from './store';

const minutes = (ms: number) => Math.max(1, Math.round(ms / 60000));

export function ExamResultScreen({ id }: { id: string }) {
  const history = useExams((s) => s.history);
  const record = history.find((r) => r.id === id);
  if (!record) return <FullScreen title="Resultados">{null}</FullScreen>;
  const { result } = record;
  const previous = history.find((r) => r.id !== id && r.spec.kind === record.spec.kind && r.finishedAt < record.finishedAt);
  const diff = previous ? result.score - previous.result.score : null;
  const axes = Object.entries(result.byAxis)
    .map(([axisId, v]) => ({ axis: axisById(axisId), ...v, p: v.total ? v.correct / v.total : 0 }))
    .sort((a, b) => a.p - b.p);
  const weakest = axes[0];

  return (
    <FullScreen title="Resultados" onBack={() => router.replace('/(tabs)/practicar')} backIcon="x">
      <View style={s.hero}>
        <Mascot pose={result.correct / result.total >= 0.6 ? 'celebrando' : 'apoyo'} height={120} />
        <Text style={s.caption}>{record.spec.title}</Text>
        <Text style={s.caption}>Puntaje estimado</Text>
        <Text style={s.huge}>{result.score}</Text>
        <Text style={s.body}>
          {result.correct} de {result.total} correctas · {minutes(record.elapsedMs)} min
        </Text>
        {diff !== null ? (
          <Chip label={diff === 0 ? 'Igual que tu ensayo anterior' : `${diff > 0 ? '+' : ''}${diff} vs. tu ensayo anterior`} tone={diff > 0 ? 'success' : 'neutral'} />
        ) : null}
        <Text style={[s.caption, { textAlign: 'center' }]}>
          Estimación orientativa con la escala de la app; no es el puntaje oficial de DEMRE.
        </Text>
      </View>

      {weakest?.axis ? (
        <Card tone="sky" style={s.row}>
          <Icon name="target" size={22} color={colors.sky700} />
          <Text style={[s.body, { flex: 1 }]}>
            Tu plan se ajustó: tus respuestas ya cuentan en tu dominio. Tu eje con más espacio para subir es {weakest.axis.name}, y los errores quedaron en tu cuaderno.
          </Text>
        </Card>
      ) : null}

      <Section title="Por eje">
        <Card style={{ gap: 12 }}>
          {axes.map((a) => (
            <View key={a.axis?.id ?? 'x'} style={{ gap: 4 }}>
              <View style={s.row}>
                <Text style={[s.strong, { flex: 1 }]}>{a.axis?.name ?? 'Otro'}</Text>
                <Text style={s.strong}>
                  {a.correct}/{a.total}
                </Text>
              </View>
              <ProgressBar value={a.p} height={8} />
            </View>
          ))}
        </Card>
      </Section>

      <Section title="Por habilidad PAES">
        <Card style={{ gap: 12 }}>
          {SKILLS.filter((sk) => result.bySkill[sk]).map((sk) => {
            const v = result.bySkill[sk]!;
            return (
              <View key={sk} style={{ gap: 4 }}>
                <View style={s.row}>
                  <Text style={[s.strong, { flex: 1 }]}>{SKILL_LABEL[sk]}</Text>
                  <Text style={s.strong}>
                    {v.correct}/{v.total}
                  </Text>
                </View>
                <ProgressBar value={v.total ? v.correct / v.total : 0} height={8} />
              </View>
            );
          })}
        </Card>
      </Section>

      <Section title="Revisa cada pregunta">
        <View style={s.grid}>
          {record.questions.map((q, i) => {
            const ex = questionOf(q);
            const chosen = record.answers[i];
            const ok = !!ex && chosen === ex.step.answer;
            const blank = chosen === null || chosen === undefined;
            return (
              <Card
                key={i}
                padding={0}
                onPress={() => router.push({ pathname: '/ensayo/revision/[id]', params: { id, q: String(i) } })}
                style={[s.cell, ok ? s.ok : blank ? s.blank : s.wrong]}
                accessibilityLabel={`Pregunta ${i + 1}: ${ok ? 'correcta' : blank ? 'en blanco' : 'incorrecta'}`}
              >
                <Text style={s.cellText}>{i + 1}</Text>
              </Card>
            );
          })}
        </View>
        <Text style={s.caption}>Verde: correcta · Grafito: incorrecta · Blanco: sin responder</Text>
      </Section>

      <Button label="Revisar desde la primera" arrow onPress={() => router.push({ pathname: '/ensayo/revision/[id]', params: { id, q: '0' } })} />
    </FullScreen>
  );
}

const s = StyleSheet.create({
  hero: { alignItems: 'center', gap: 4 },
  huge: { fontFamily: fonts['poppins-bold'], fontSize: 52, lineHeight: 60, color: colors.ink },
  body: { fontFamily: fonts.poppins, fontSize: 15, lineHeight: 22, color: colors.ink },
  strong: { fontFamily: fonts['poppins-semibold'], fontSize: 15, color: colors.ink },
  caption: { fontFamily: fonts.poppins, fontSize: 12, lineHeight: 17, color: colors.graphite },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  cell: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 12 },
  ok: { backgroundColor: colors.success50, borderColor: colors.success },
  wrong: { backgroundColor: colors.graphite100, borderColor: colors.graphite },
  blank: { backgroundColor: colors.white },
  cellText: { fontFamily: fonts['poppins-semibold'], fontSize: 15, color: colors.ink },
});
