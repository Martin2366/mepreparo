import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Icon } from '@/components/ui/Icon';
import { Mascot } from '@/components/ui/Mascot';
import { Tappable } from '@/components/ui/Tappable';
import { Text } from '@/components/ui/Text';
import { isMastered, pct } from '@/engine/mastery';
import { axisById, hasPractice, lessonsOf, miniClassesOf } from '@/features/content/catalog';
import { unitMastery, useDashboard } from '@/features/progress/derived';
import { FullScreen } from '@/features/shell/FullScreen';
import { colors, fonts } from '@/theme/tokens';

export type NodeState = 'suggested' | 'in-progress' | 'completed' | 'mastered' | 'available' | 'soon';

/**
 * Ruta del eje: unidades como secciones y lecciones como nodos. Nada se bloquea (PRD §7.1):
 * "más adelante" se puede abrir igual; solo lo que aún no existe dice "En preparación".
 */
export function AxisScreen({ axisId }: { axisId: string }) {
  const d = useDashboard();
  const axis = axisById(axisId);
  if (!axis) return <FullScreen title="Eje">{null}</FullScreen>;

  return (
    <FullScreen title={axis.name}>
      {axis.units.map((unit, ui) => {
        const lessons = lessonsOf(unit.id);
        const ready = new Map(lessons.map((l) => [l.id, l]));
        const minis = miniClassesOf(unit.id);
        const mastery = unitMastery(d.progress, d.answers, unit.id);
        const mastered = isMastered(d.progress.unitOutcomes[unit.id] ?? []);
        return (
          <View key={unit.id} style={{ gap: 12 }}>
            <Tappable
              accessibilityRole="button"
              accessibilityLabel={`Unidad ${ui + 1}: ${unit.name}`}
              onPress={() => router.push(`/unidad/${unit.id}`)}
              style={s.unitHead}
              pressedStyle={{ opacity: 0.8 }}
            >
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={s.overline}>UNIDAD {ui + 1}</Text>
                <Text style={s.h3}>{unit.name}</Text>
                <Text style={s.caption}>Dominio {pct(mastery)} %{mastered ? ' · dominada' : ''}</Text>
              </View>
              <Icon name="info" size={20} color={colors.graphite} />
            </Tappable>

            <View style={s.path}>
              {unit.lessons.map((planned, i) => {
                const lesson = ready.get(planned.id);
                const st = d.progress.lessons[planned.id];
                const state: NodeState = !lesson
                  ? 'soon'
                  : st?.status === 'completed'
                    ? mastered
                      ? 'mastered'
                      : 'completed'
                    : st?.status === 'in-progress'
                      ? 'in-progress'
                      : d.next?.lessonId === planned.id
                        ? 'suggested'
                        : 'available';
                return (
                  <PathNode
                    key={planned.id}
                    index={i}
                    title={planned.title}
                    state={state}
                    minutes={lesson?.estimatedMinutes}
                    onPress={lesson ? () => router.push(`/leccion/${planned.id}`) : undefined}
                  />
                );
              })}
            </View>

            {minis.length > 0 || hasPractice(unit.id) ? (
              <View style={s.row}>
                {minis.length > 0 ? (
                  <View style={{ flex: 1 }}>
                    <Button label="Mini-clases" variant="secondary" onPress={() => router.push(`/unidad/${unit.id}`)} />
                  </View>
                ) : null}
                {hasPractice(unit.id) ? (
                  <View style={{ flex: 1 }}>
                    <Button label="Practicar" variant="secondary" onPress={() => router.push(`/practica/${unit.id}`)} />
                  </View>
                ) : null}
              </View>
            ) : null}
          </View>
        );
      })}
    </FullScreen>
  );
}

const NODE: Record<NodeState, { bg: string; border: string; icon: 'check' | 'play' | 'sparkle' | 'book' | 'clock' }> = {
  suggested: { bg: colors.sky, border: colors.sky, icon: 'play' },
  'in-progress': { bg: colors.sky100, border: colors.sky, icon: 'play' },
  completed: { bg: colors.success50, border: colors.success, icon: 'check' },
  mastered: { bg: colors.success50, border: colors.success, icon: 'sparkle' },
  available: { bg: colors.white, border: colors.graphite200, icon: 'book' },
  soon: { bg: colors.paper2, border: colors.graphite100, icon: 'clock' },
};

const LABEL: Record<NodeState, string> = {
  suggested: 'Sugerida',
  'in-progress': 'En curso',
  completed: 'Completada',
  mastered: 'Dominada',
  available: 'Disponible',
  soon: 'En preparación',
};

export function PathNode({
  index,
  title,
  state,
  minutes,
  onPress,
}: {
  index: number;
  title: string;
  state: NodeState;
  minutes?: number;
  onPress?: () => void;
}) {
  const n = NODE[state];
  const iconColor = state === 'mastered' ? colors.coral : state === 'completed' ? colors.success700 : state === 'soon' ? colors.graphite300 : colors.ink;
  return (
    <Card
      onPress={onPress}
      padding={12}
      style={[s.node, state === 'soon' && { opacity: 0.7 }, { marginLeft: index % 2 === 0 ? 0 : 28 }]}
      accessibilityLabel={`${title}. ${LABEL[state]}`}
    >
      <View style={[s.dot, { backgroundColor: n.bg, borderColor: n.border }]}>
        <Icon name={n.icon} size={18} color={iconColor} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[s.nodeTitle, state === 'soon' && { color: colors.graphite }]}>{title}</Text>
        <View style={s.row}>
          {state === 'suggested' ? <Chip label="Sugerida" /> : <Text style={s.caption}>{LABEL[state]}</Text>}
          {minutes ? <Text style={s.caption}>· {minutes} min</Text> : null}
        </View>
      </View>
      {state === 'suggested' ? <Mascot pose="senalando" height={40} float={false} /> : null}
    </Card>
  );
}

const s = StyleSheet.create({
  unitHead: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingTop: 6 },
  overline: { fontFamily: fonts['poppins-semibold'], fontSize: 12, lineHeight: 16, letterSpacing: 1.7, color: colors.sky700 },
  h3: { fontFamily: fonts['poppins-semibold'], fontSize: 19, lineHeight: 25, color: colors.ink },
  caption: { fontFamily: fonts.poppins, fontSize: 12, lineHeight: 17, color: colors.graphite },
  path: { gap: 10 },
  node: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dot: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  nodeTitle: { fontFamily: fonts['poppins-semibold'], fontSize: 15, lineHeight: 21, color: colors.ink },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
