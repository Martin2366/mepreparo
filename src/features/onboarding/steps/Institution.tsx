import { memo, useCallback, useDeferredValue, useMemo, useState } from 'react';
import { Pressable, ScrollView, SectionList, StyleSheet, View } from 'react-native';

import { SearchField } from '@/components/ui/Fields';
import { Mascot } from '@/components/ui/Mascot';
import { OptionCard } from '@/components/ui/OptionCard';
import { Text } from '@/components/ui/Text';
import { colors, fonts } from '@/theme/tokens';

import { allInstitutions, institutionSections } from '../admission';
import { SectionLabel, StepLayout, StepTitle } from '../components';
import type { Institution } from '../model';
import { useOnboarding } from '../store';
import type { StepProps } from './types';

/** Accesos rápidos: las instituciones más buscadas por estudiantes (por sigla). */
const POPULAR = ['UC', 'UCH', 'USACH', 'UDEC', 'USM', 'UV', 'INACAP', 'DUOC'];

export const shortOf = (i: Institution): string | null => i.short ?? (i.search ? i.search.split(' ')[0]! : null);

const Row = memo(function Row({ item, selected, onChoose }: { item: Institution; selected: boolean; onChoose: (id: string) => void }) {
  return (
    <View style={{ paddingBottom: 8 }}>
      <OptionCard
        label={item.name}
        hint={item.paes ? item.region : `${item.region} · admisión directa`}
        selected={selected}
        onPress={() => onChoose(item.id)}
      />
    </View>
  );
});

export function InstitutionStep({ next }: StepProps) {
  const selected = useOnboarding((s) => s.answers.institutionId);
  const update = useOnboarding((s) => s.update);
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query);
  const sections = useMemo(() => institutionSections(deferred), [deferred]);
  const popular = useMemo(
    () => POPULAR.map((s) => allInstitutions().find((i) => i.search.split(' ').includes(s))).filter((i): i is Institution => !!i),
    [],
  );

  const choose = useCallback(
    (id: string) => update({ institutionId: id, careerId: undefined, target: undefined, tests: undefined }),
    [update],
  );
  const current = allInstitutions().find((i) => i.id === selected);
  const label = current ? `Elegir ${shortOf(current) ?? 'esta institución'}` : 'Elegir';

  return (
    <StepLayout
      scroll={false}
      primary={{ label, onPress: next, disabled: !current }}
      secondary={{ label: 'Aún no lo sé', onPress: () => (update({ institutionId: null, careerId: undefined, target: undefined, tests: undefined }), next()) }}
    >
      <View style={s.head}>
        <StepTitle title="¿Dónde te gustaría estudiar?" subtitle="Universidades, institutos y escuelas de todo Chile." />
        <SearchField value={query} onChangeText={setQuery} placeholder="Busca por nombre o sigla" />
      </View>

      <SectionList
        style={{ flex: 1 }}
        contentContainerStyle={s.list}
        sections={sections}
        keyExtractor={(i) => i.id}
        extraData={selected}
        stickySectionHeadersEnabled
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={9}
        removeClippedSubviews
        ListHeaderComponent={
          !query ? (
            <View style={{ paddingTop: 6 }}>
              <SectionLabel>Más buscadas</SectionLabel>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 20 }}>
                {popular.map((i) => {
                  const on = i.id === selected;
                  return (
                    <Pressable
                      key={i.id}
                      accessibilityRole="button"
                      accessibilityState={{ selected: on }}
                      accessibilityLabel={i.name}
                      onPress={() => choose(i.id)}
                      style={[s.chip, on && s.chipOn]}
                    >
                      <Text style={s.chipText}>{shortOf(i)}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          ) : null
        }
        renderSectionHeader={({ section }) => <SectionLabel>{section.title}</SectionLabel>}
        renderItem={({ item }) => <Row item={item} selected={item.id === selected} onChoose={choose} />}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', gap: 12, paddingVertical: 40 }}>
            <Mascot pose="pensando" height={110} float={false} />
            <Text className="text-center text-graphite">No encontramos «{query}». Prueba con la sigla o con otra palabra.</Text>
          </View>
        }
      />
    </StepLayout>
  );
}

const s = StyleSheet.create({
  head: { gap: 16, paddingHorizontal: 20, paddingTop: 8 },
  list: { paddingHorizontal: 20, paddingBottom: 24 },
  chip: {
    minHeight: 48,
    justifyContent: 'center',
    borderRadius: 999,
    borderWidth: 2,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 18,
  },
  chipOn: { borderColor: colors.sky, backgroundColor: colors.sky100 },
  chipText: { fontFamily: fonts['poppins-semibold'], fontSize: 16, lineHeight: 22, color: colors.ink },
});
