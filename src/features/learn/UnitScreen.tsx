import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip, PremiumTag } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Tappable } from '@/components/ui/Tappable';
import { Text } from '@/components/ui/Text';
import { SKILL_LABEL } from '@/content/schema';
import { pct } from '@/engine/mastery';
import { hasPractice, lessonsOf, miniClassesOf, unitRef } from '@/features/content/catalog';
import { unitMastery, useDashboard } from '@/features/progress/derived';
import { Section } from '@/features/shell/TabScreen';
import { FullScreen } from '@/features/shell/FullScreen';
import { colors, fonts } from '@/theme/tokens';

export function UnitScreen({ unitId }: { unitId: string }) {
  const d = useDashboard();
  const ref = unitRef(unitId);
  if (!ref) return <FullScreen title="Unidad">{null}</FullScreen>;
  const { unit, axis } = ref;
  const lessons = lessonsOf(unit.id);
  const minis = miniClassesOf(unit.id);
  const mastery = unitMastery(d.progress, d.answers, unit.id);

  return (
    <FullScreen title={axis.name}>
      <View style={{ gap: 8 }}>
        <Text style={s.h2}>{unit.name}</Text>
        <Text style={s.body}>{unit.summary}</Text>
        <View style={s.wrap}>
          {unit.skills.map((sk) => (
            <Chip key={sk} label={SKILL_LABEL[sk]} tone="neutral" />
          ))}
        </View>
      </View>

      <Card style={{ gap: 8 }}>
        <Text style={s.caption}>Tu dominio</Text>
        <ProgressBar value={mastery} />
        <Text style={s.bodyStrong}>{pct(mastery)} %</Text>
      </Card>

      {hasPractice(unit.id) ? (
        <View style={{ gap: 10 }}>
          <Button label="Practicar esta unidad" arrow onPress={() => router.push(`/practica/${unit.id}`)} />
          <Tappable
            onPress={() => router.push({ pathname: '/ensayo/nuevo', params: { kind: 'custom', unit: unit.id } })}
            accessibilityLabel="Ensayo de esta unidad"
          >
            <Card tone="paper" style={s.row}>
              <Icon name="hourglass" size={20} color={colors.graphite} />
              <Text style={[s.small, { flex: 1 }]}>Ensayo de esta unidad</Text>
              <PremiumTag />
            </Card>
          </Tappable>
        </View>
      ) : null}

      <Section title="Lecciones">
        <View style={{ gap: 10 }}>
          {unit.lessons.map((planned) => {
            const ready = lessons.find((l) => l.id === planned.id);
            const done = d.completed.has(planned.id);
            return (
              <Card
                key={planned.id}
                onPress={ready ? () => router.push(`/leccion/${planned.id}`) : undefined}
                style={[s.row, !ready && { opacity: 0.7 }]}
                accessibilityLabel={planned.title}
              >
                <Icon name={done ? 'check' : ready ? 'book' : 'clock'} size={20} color={done ? colors.success700 : colors.graphite} />
                <View style={{ flex: 1 }}>
                  <Text style={s.bodyStrong}>{planned.title}</Text>
                  <Text style={s.caption}>{ready ? `${ready.estimatedMinutes} min · ${ready.steps.length} pasos` : 'En preparación'}</Text>
                </View>
              </Card>
            );
          })}
        </View>
      </Section>

      {minis.length > 0 ? (
        <Section title="Mini-clases · 90 segundos">
          <View style={{ gap: 10 }}>
            {minis.map((m) => (
              <Card key={m.id} tone="sky" onPress={() => router.push(`/mini/${m.id}`)} style={s.row} accessibilityLabel={m.title}>
                <Icon name="sparkles" size={20} color={colors.sky700} />
                <Text style={[s.bodyStrong, { flex: 1 }]}>{m.title}</Text>
                <Icon name="chevron-right" size={20} color={colors.graphite} />
              </Card>
            ))}
          </View>
        </Section>
      ) : null}
    </FullScreen>
  );
}

const s = StyleSheet.create({
  h2: { fontFamily: fonts['poppins-bold'], fontSize: 24, lineHeight: 30, color: colors.ink },
  body: { fontFamily: fonts.poppins, fontSize: 16, lineHeight: 24, color: colors.ink },
  bodyStrong: { fontFamily: fonts['poppins-semibold'], fontSize: 16, lineHeight: 22, color: colors.ink },
  small: { fontFamily: fonts.poppins, fontSize: 14, lineHeight: 20, color: colors.graphite },
  caption: { fontFamily: fonts.poppins, fontSize: 13, lineHeight: 18, color: colors.graphite },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
});
