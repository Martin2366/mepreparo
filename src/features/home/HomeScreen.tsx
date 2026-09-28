import { type Href, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Icon, type IconName } from '@/components/ui/Icon';
import { Mascot } from '@/components/ui/Mascot';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Text } from '@/components/ui/Text';
import type { SessionItem } from '@/engine/plan';
import { lessonById, unitRef } from '@/features/content/catalog';
import { careerById, institutionById } from '@/features/onboarding/admission';
import { formatScore } from '@/features/onboarding/model';
import { sessionOf } from '@/features/plan/context';
import { useDashboard } from '@/features/progress/derived';
import { Section, TabScreen } from '@/features/shell/TabScreen';
import { colors, fonts } from '@/theme/tokens';

type Row = { key: string; icon: IconName; label: string; done: boolean; href: Href };

export function HomeScreen() {
  const d = useDashboard();
  const a = d.answers;
  const name = a.name.trim();
  const career = careerById(a.careerId);
  const inst = institutionById(a.institutionId);
  const session = sessionOf(a);
  const practiceToday = d.progress.usage.practice?.[d.today] ?? 0;

  const rows: Row[] = d.session.map((item) => rowOf(item, d.completed, practiceToday));
  const doneCount = rows.filter((r) => r.done).length;
  const nextRow = rows.find((r) => !r.done);
  const focusLabel = d.plan.focus[0] ?? 'Álgebra';
  const axisName = (d.next && unitRef(d.next.unitId)?.axis.name) ?? focusLabel;
  const why = career?.w?.m1
    ? `Porque M1 pesa ${career.w.m1} % en tu carrera y ${axisName} está en tu foco.`
    : `Porque ${axisName} está en tu foco de estas semanas.`;
  const inProgress = d.inProgress ? lessonById(d.inProgress) : undefined;
  const allDone = rows.length > 0 && doneCount === rows.length;

  return (
    <TabScreen>
      <View style={s.greet}>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={s.h1}>{name ? `Hola, ${name}.` : 'Hola.'}</Text>
          <Text style={s.sub}>
            {allDone
              ? 'Hoy ya cumpliste. Si quieres, repasa o practica un poco más.'
              : `Hoy toca ${focusLabel.toLowerCase()}. ${d.plan.minutes} minutos, a tu ritmo.`}
          </Text>
        </View>
        <Mascot pose={allDone ? 'celebrando' : 'saludo'} height={84} float={false} />
      </View>

      {d.planState.kind === 'trial' ? (
        <Card tone="coral" padding={12} style={s.row}>
          <Chip label="Premium" tone="premium" />
          <Text style={[s.small, { flex: 1 }]}>
            {d.planState.daysLeft === 1 ? 'Hoy es el último día de tu prueba.' : `Te quedan ${d.planState.daysLeft} días de prueba.`} Sin
            cobros al terminar.
          </Text>
        </Card>
      ) : null}

      <Card padding={18} style={{ gap: 14 }}>
        <View style={s.row}>
          <Chip label="M1" />
          <Chip label="Sesión de hoy" tone="neutral" />
        </View>
        <Text style={s.h3}>{allDone ? 'Sesión completa' : 'Tu plan de hoy'}</Text>
        <View style={{ gap: 10 }}>
          {rows.map((r) => (
            <View key={r.key} style={s.row}>
              <Icon name={r.done ? 'check' : r.icon} size={20} color={r.done ? colors.success700 : colors.graphite} />
              <Text style={[s.body, r.done && s.doneText]}>{r.label}</Text>
            </View>
          ))}
          {rows.length === 0 ? <Text style={s.small}>Ya recorriste todo lo disponible. Practica lo que quieras.</Text> : null}
        </View>
        <ProgressBar value={rows.length ? doneCount / rows.length : 1} />
        <Text style={s.caption}>{why}</Text>
        {nextRow ? (
          <Button label="Continuar" arrow onPress={() => router.push(nextRow.href)} />
        ) : (
          <Button label="Practicar más" variant="secondary" onPress={() => router.push('/(tabs)/practicar')} />
        )}
      </Card>

      {inProgress && d.inProgress !== d.next?.lessonId ? (
        <Section title="Continúa donde quedaste">
          <Card onPress={() => router.push(`/leccion/${inProgress.lesson.id}`)} style={s.row} accessibilityLabel={`Continuar ${inProgress.lesson.title}`}>
            <View style={s.iconTile}>
              <Icon name="play" size={20} color={colors.sky700} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.bodyStrong}>{inProgress.lesson.title}</Text>
              <Text style={s.small}>
                Paso {(d.progress.lessons[inProgress.lesson.id]?.step ?? 0) + 1} de {inProgress.lesson.steps.length}
              </Text>
            </View>
            <Icon name="chevron-right" size={20} color={colors.graphite} />
          </Card>
        </Section>
      ) : null}

      <View style={s.twoCols}>
        <Card style={s.stat} onPress={() => router.push('/(tabs)/progreso')} accessibilityLabel="Ver mi meta">
          <Text style={s.caption}>Estimado M1</Text>
          <Text style={s.big}>
            {d.estimate.low}–{d.estimate.high}
          </Text>
          <Text style={s.caption} numberOfLines={2}>
            {career
              ? `Meta: ${a.target ? formatScore(a.target, 1) : '—'} · ${career.name}${inst?.short ? `, ${inst.short}` : ''}`
              : `Meta: ${formatScore(d.plan.target, 0)}`}
          </Text>
        </Card>
        <Card style={s.stat}>
          <Text style={s.caption}>{session?.label ?? 'Tu PAES'}</Text>
          <Text style={s.big}>{d.plan.days && d.plan.days > 0 ? `${d.plan.days} días` : '—'}</Text>
          <Text style={s.caption}>{d.plan.days && d.plan.days > 0 ? `Unas ${d.plan.weeks} semanas. Un paso a la vez.` : 'Elige tu fecha en el perfil.'}</Text>
        </Card>
      </View>

      <Section title="Para ti">
        <View style={{ gap: 10 }}>
          {d.due.length > 0 ? (
            <Suggestion
              icon="notebook-pen"
              title={`Repasa ${d.due.length} ${d.due.length === 1 ? 'error' : 'errores'}`}
              subtitle="Vuelven justo cuando más sirve repasarlos."
              onPress={() => router.push('/repaso')}
            />
          ) : null}
          <Suggestion
            icon="sparkles"
            title="Mini-clases"
            subtitle="Repasos de 90 segundos para refrescar un concepto."
            onPress={() => router.push('/(tabs)/aprender')}
          />
          <Suggestion
            icon="hourglass"
            title="Mini-ensayo de 30 minutos"
            subtitle="15 preguntas de los 4 ejes, con tu puntaje estimado al final."
            onPress={() => router.push({ pathname: '/ensayo/nuevo', params: { kind: 'mini' } })}
          />
        </View>
      </Section>

      <View style={[s.row, { justifyContent: 'center' }]}>
        <Icon name="smartphone" size={16} color={colors.graphite} />
        <Text style={s.caption}>Tu progreso se guarda en este teléfono.</Text>
      </View>
    </TabScreen>
  );
}

function rowOf(item: SessionItem, completed: Set<string>, practiceToday: number): Row {
  switch (item.kind) {
    case 'lesson': {
      const l = lessonById(item.lessonId);
      return {
        key: `l-${item.lessonId}`,
        icon: 'book',
        label: `Lección: ${l?.lesson.title ?? 'nueva lección'}`,
        done: completed.has(item.lessonId),
        href: `/leccion/${item.lessonId}`,
      };
    }
    case 'practice': {
      const u = unitRef(item.unitId);
      return {
        key: `p-${item.unitId}`,
        icon: 'target',
        label: `${item.count} ejercicios de ${u?.unit.name.toLowerCase() ?? 'práctica'}`,
        done: practiceToday >= item.count,
        href: `/practica/${item.unitId}`,
      };
    }
    case 'review':
      return {
        key: 'r',
        icon: 'notebook-pen',
        label: `Repasar ${item.count} ${item.count === 1 ? 'error' : 'errores'}`,
        done: false,
        href: '/repaso',
      };
  }
}

function Suggestion({
  icon,
  title,
  subtitle,
  onPress,
  tag,
}: {
  icon: IconName;
  title: string;
  subtitle: string;
  onPress?: () => void;
  tag?: string;
}) {
  return (
    <Card onPress={onPress} style={s.row} accessibilityLabel={title}>
      <View style={s.iconTile}>
        <Icon name={icon} size={20} color={colors.sky700} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={s.bodyStrong}>{title}</Text>
        <Text style={s.small}>{subtitle}</Text>
      </View>
      {tag ? <Chip label={tag} tone="neutral" /> : <Icon name="chevron-right" size={20} color={colors.graphite} />}
    </Card>
  );
}

const s = StyleSheet.create({
  greet: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  h1: { fontFamily: fonts['poppins-bold'], fontSize: 28, lineHeight: 34, color: colors.ink },
  h3: { fontFamily: fonts['poppins-semibold'], fontSize: 20, lineHeight: 26, color: colors.ink },
  sub: { fontFamily: fonts.poppins, fontSize: 15, lineHeight: 22, color: colors.graphite },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  body: { fontFamily: fonts.poppins, fontSize: 16, lineHeight: 22, color: colors.ink, flex: 1 },
  bodyStrong: { fontFamily: fonts['poppins-semibold'], fontSize: 16, lineHeight: 22, color: colors.ink },
  doneText: { color: colors.graphite, textDecorationLine: 'line-through' },
  small: { fontFamily: fonts.poppins, fontSize: 14, lineHeight: 20, color: colors.graphite },
  caption: { fontFamily: fonts.poppins, fontSize: 13, lineHeight: 18, color: colors.graphite },
  big: { fontFamily: fonts['poppins-bold'], fontSize: 24, lineHeight: 30, color: colors.ink },
  twoCols: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, gap: 4 },
  iconTile: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.sky50,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
