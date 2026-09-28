import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';

import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { SearchField } from '@/components/ui/Fields';
import { Icon, isIconName } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Tappable } from '@/components/ui/Tappable';
import { Text } from '@/components/ui/Text';
import { pct } from '@/engine/mastery';
import { allUnits, curriculum, lessonsOf, totals } from '@/features/content/catalog';
import { fold } from '@/features/onboarding/model';
import { useDashboard } from '@/features/progress/derived';
import { Section, TabScreen } from '@/features/shell/TabScreen';
import { colors, fonts } from '@/theme/tokens';

const TESTS = [
  { id: 'm1', label: 'M1', ready: true },
  { id: 'm2', label: 'M2', ready: false },
  { id: 'lectora', label: 'Lectora', ready: false },
  { id: 'ciencias', label: 'Ciencias', ready: false },
  { id: 'historia', label: 'Historia', ready: false },
];

export const TILES = {
  balanza: require('@/assets/images/icons/balanza-tile.png'),
  funcion: require('@/assets/images/icons/funcion-tile.png'),
  triangulo: require('@/assets/images/icons/triangulo-tile.png'),
};

export function LearnScreen() {
  const d = useDashboard();
  const [query, setQuery] = useState('');
  const t = totals();
  const q = fold(query);
  const matches = q ? allUnits.filter((u) => fold(`${u.unit.name} ${u.unit.summary} ${u.axis.name}`).includes(q)) : [];

  return (
    <TabScreen title="Aprender">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
        {TESTS.map((test) => (
          <Tappable
            key={test.id}
            accessibilityRole="button"
            accessibilityState={{ selected: test.id === 'm1' }}
            accessibilityLabel={test.ready ? test.label : `${test.label}, pronto`}
            onPress={() =>
              test.ready
                ? undefined
                : Alert.alert(`${test.label}: pronto`, 'Estamos preparando este contenido con el mismo cuidado que M1. Te avisaremos cuando esté listo.')
            }
            style={[s.pill, test.id === 'm1' && s.pillOn]}
          >
            <Text style={[s.pillText, test.id === 'm1' && { color: colors.ink }]}>{test.label}</Text>
            {!test.ready ? <Text style={s.soon}>pronto</Text> : null}
          </Tappable>
        ))}
      </ScrollView>

      <View style={{ gap: 4 }}>
        <Text style={s.h2}>{curriculum.name}</Text>
        <Text style={s.small}>
          {t.units} unidades del temario DEMRE 2027 · {t.lessons} lecciones y {t.miniClasses} mini-clases listas · más en camino
        </Text>
      </View>

      <SearchField value={query} onChangeText={setQuery} placeholder="Busca un tema: ecuaciones, pendiente…" />

      {q ? (
        <Section title="Resultados">
          <View style={{ gap: 10 }}>
            {matches.length === 0 ? <Text style={s.small}>No encontramos ese tema. Prueba con otra palabra.</Text> : null}
            {matches.map(({ unit, axis }) => (
              <Card key={unit.id} onPress={() => router.push(`/unidad/${unit.id}`)} style={s.row} accessibilityLabel={unit.name}>
                <View style={{ flex: 1 }}>
                  <Text style={s.bodyStrong}>{unit.name}</Text>
                  <Text style={s.small}>{axis.name}</Text>
                </View>
                <Icon name="chevron-right" size={20} color={colors.graphite} />
              </Card>
            ))}
          </View>
        </Section>
      ) : (
        <Section title="Ejes">
          <View style={{ gap: 12 }}>
            {d.axes.map(({ axis, mastery }) => {
              const lessons = axis.units.reduce((n, u) => n + lessonsOf(u.id).length, 0);
              const done = axis.units.reduce((n, u) => n + lessonsOf(u.id).filter((l) => d.completed.has(l.id)).length, 0);
              return (
                <Card key={axis.id} onPress={() => router.push(`/eje/${axis.id}`)} style={s.row} accessibilityLabel={axis.name}>
                  {axis.tile ? (
                    <Image source={TILES[axis.tile]} style={s.tile} contentFit="cover" />
                  ) : (
                    <View style={[s.tile, s.tileIcon]}>
                      <Icon name={isIconName(axis.icon) ? axis.icon : 'book'} size={24} color={colors.sky700} />
                    </View>
                  )}
                  <View style={{ flex: 1, gap: 4 }}>
                    <Text style={s.bodyStrong}>{axis.name}</Text>
                    <Text style={s.caption}>
                      {axis.units.length} unidades · {lessons > 0 ? `${done} de ${lessons} lecciones` : 'lecciones en preparación'}
                    </Text>
                    <ProgressBar value={mastery} height={6} />
                    <Text style={s.caption}>Dominio {pct(mastery)} %</Text>
                  </View>
                  <Icon name="chevron-right" size={20} color={colors.graphite} />
                </Card>
              );
            })}
          </View>
        </Section>
      )}

      <Card tone="sky" style={{ gap: 6 }}>
        <View style={s.row}>
          <Chip label="Nuevo" tone="new" />
          <Text style={s.bodyStrong}>Cada lección se toca</Text>
        </View>
        <Text style={s.small}>Balanzas, gráficos y pasos cortos. Si te equivocas, te explicamos exactamente qué pasó.</Text>
      </Card>
    </TabScreen>
  );
}

const s = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 40,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colors.graphite200,
    backgroundColor: colors.white,
  },
  pillOn: { backgroundColor: colors.sky100, borderColor: colors.sky },
  pillText: { fontFamily: fonts['poppins-semibold'], fontSize: 15, lineHeight: 20, color: colors.graphite },
  soon: { fontFamily: fonts.poppins, fontSize: 11, lineHeight: 14, color: colors.graphite },
  h2: { fontFamily: fonts['poppins-bold'], fontSize: 22, lineHeight: 28, color: colors.ink },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bodyStrong: { fontFamily: fonts['poppins-semibold'], fontSize: 16, lineHeight: 22, color: colors.ink },
  small: { fontFamily: fonts.poppins, fontSize: 14, lineHeight: 20, color: colors.graphite },
  caption: { fontFamily: fonts.poppins, fontSize: 12, lineHeight: 17, color: colors.graphite },
  tile: { width: 56, height: 48, borderRadius: 12 },
  tileIcon: { backgroundColor: colors.sky50, alignItems: 'center', justifyContent: 'center' },
});
