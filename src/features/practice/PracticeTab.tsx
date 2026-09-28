import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Chip, PremiumTag } from '@/components/ui/Chip';
import { Icon, type IconName } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Text } from '@/components/ui/Text';
import { pct } from '@/engine/mastery';
import { allUnits } from '@/features/content/catalog';
import type { ExamKind } from '@/engine/exam';
import { useExams } from '@/features/exams/store';
import { useAllowance } from '@/features/progress/allowance';
import { unitMastery, useDashboard } from '@/features/progress/derived';
import { Section, TabScreen } from '@/features/shell/TabScreen';
import { colors, fonts } from '@/theme/tokens';

/** Practicar (PRD §9): ensayos, práctica por tema, cuaderno de errores y más formas de practicar. */
export function PracticeTab() {
  const d = useDashboard();
  const practice = useAllowance('practice');
  const units = allUnits.filter((u) => u.unit.generators.length > 0);
  const notebookCount = Object.keys(d.progress.notebook).length;
  const activeExam = useExams((st) => st.active);
  const lastExam = useExams((st) => st.history[0]);

  return (
    <TabScreen title="Practicar">
      {activeExam ? (
        <Card tone="sky" onPress={() => router.push('/ensayo/en-curso')} style={s.row} accessibilityLabel="Retomar ensayo en curso">
          <View style={s.tile}>
            <Icon name="play" size={22} color={colors.sky700} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.strong}>Ensayo en curso</Text>
            <Text style={s.caption}>
              {activeExam.spec.title} · {activeExam.answers.filter((a) => a !== null).length} de {activeExam.questions.length} respondidas
            </Text>
          </View>
          <Icon name="chevron-right" size={20} color={colors.graphite} />
        </Card>
      ) : null}

      <Section title="Ensayos PAES">
        <View style={{ gap: 10 }}>
          <ExamCard kind="full" icon="hourglass" title="Ensayo completo M1" subtitle="65 preguntas · 2 h 20 min · formato DEMRE 2027" note="1 gratis al mes" />
          <ExamCard kind="mini" icon="timer" title="Mini-ensayo" subtitle="15 preguntas · 30 min · para la micro" note="1 gratis a la semana" />
          <ExamCard kind="thematic" icon="target" title="Ensayo temático" subtitle="20 preguntas de un eje · 30 min" premium />
          <ExamCard kind="custom" icon="shuffle" title="Ensayo a tu medida" subtitle="Eliges temas, cantidad y tiempo" premium />
          {lastExam ? (
            <Card onPress={() => router.push({ pathname: '/ensayo/resultado/[id]', params: { id: lastExam.id } })} style={s.row} accessibilityLabel="Ver tu último ensayo">
              <Icon name="trending-up" size={20} color={colors.sky700} />
              <Text style={[s.strong, { flex: 1 }]}>Último ensayo: {lastExam.result.score} puntos</Text>
              <Icon name="chevron-right" size={20} color={colors.graphite} />
            </Card>
          ) : null}
        </View>
      </Section>

      <Section title="Práctica por tema" action={!practice.unlimited ? <Text style={s.caption}>Quedan {practice.remaining} hoy</Text> : undefined}>
        <View style={{ gap: 10 }}>
          {units.map(({ unit, axis }) => {
            const m = unitMastery(d.progress, d.answers, unit.id);
            return (
              <Card key={unit.id} onPress={() => router.push(`/practica/${unit.id}`)} style={s.row} accessibilityLabel={`Practicar ${unit.name}`}>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={s.strong}>{unit.name}</Text>
                  <Text style={s.caption}>
                    {axis.name} · dominio {pct(m)} %
                  </Text>
                  <ProgressBar value={m} height={6} />
                </View>
                <Icon name="play" size={20} color={colors.sky700} />
              </Card>
            );
          })}
          <Text style={s.caption}>Ejercicios generados y verificados por el motor: nunca se acaban ni se repiten.</Text>
        </View>
      </Section>

      <Section title="Cuaderno de errores">
        <Card onPress={() => router.push('/cuaderno')} style={s.row} accessibilityLabel="Abrir cuaderno de errores">
          <View style={s.tile}>
            <Icon name="notebook-pen" size={22} color={colors.sky700} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.strong}>{notebookCount ? `${notebookCount} ${notebookCount === 1 ? 'error guardado' : 'errores guardados'}` : 'Sin errores guardados'}</Text>
            <Text style={s.caption}>{d.due.length ? `${d.due.length} por repasar hoy` : 'Vuelven a los 1, 3, 7 y 14 días'}</Text>
          </View>
          <Icon name="chevron-right" size={20} color={colors.graphite} />
        </Card>
      </Section>

      <Section title="Más formas de practicar">
        <View style={{ gap: 10 }}>
          <Soon icon="flame" title="Intensivo: recta final" subtitle="Un plan guiado hasta tu PAES, con ensayo de entrada y de salida" premium />
          <Soon icon="zap" title="Reto relámpago" subtitle="60 segundos de cálculo mental" note="1 gratis al día" />
          <Soon icon="book-marked" title="Fórmulas" subtitle="Tarjetas por unidad para repasar" />
        </View>
      </Section>
    </TabScreen>
  );
}

function ExamCard({
  kind,
  icon,
  title,
  subtitle,
  note,
  premium,
}: {
  kind: ExamKind;
  icon: IconName;
  title: string;
  subtitle: string;
  note?: string;
  premium?: boolean;
}) {
  return (
    <Card onPress={() => router.push({ pathname: '/ensayo/nuevo', params: { kind } })} style={s.row} accessibilityLabel={title}>
      <View style={s.tile}>
        <Icon name={icon} size={22} color={colors.sky700} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={s.strong}>{title}</Text>
        <Text style={s.caption}>{subtitle}</Text>
        {note ? <Text style={s.caption}>{note}</Text> : null}
      </View>
      {premium ? <PremiumTag /> : <Icon name="chevron-right" size={20} color={colors.graphite} />}
    </Card>
  );
}

function Soon({ icon, title, subtitle, note, premium }: { icon: IconName; title: string; subtitle: string; note?: string; premium?: boolean }) {
  return (
    <Card style={s.row}>
      <View style={s.tile}>
        <Icon name={icon} size={22} color={colors.graphite} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={s.strong}>{title}</Text>
        <Text style={s.caption}>{subtitle}</Text>
        {note ? <Text style={s.caption}>{note}</Text> : null}
      </View>
      <View style={{ gap: 4, alignItems: 'flex-end' }}>
        {premium ? <PremiumTag /> : null}
        <Chip label="Pronto" tone="neutral" />
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  strong: { fontFamily: fonts['poppins-semibold'], fontSize: 16, lineHeight: 22, color: colors.ink },
  caption: { fontFamily: fonts.poppins, fontSize: 13, lineHeight: 18, color: colors.graphite },
  tile: { width: 44, height: 44, borderRadius: 12, backgroundColor: colors.sky50, alignItems: 'center', justifyContent: 'center' },
});
