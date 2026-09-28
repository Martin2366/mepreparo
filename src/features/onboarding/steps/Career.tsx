import { memo, useCallback, useDeferredValue, useMemo, useState } from 'react';
import { SectionList, StyleSheet, View } from 'react-native';

import { SearchField } from '@/components/ui/Fields';
import { Mascot } from '@/components/ui/Mascot';
import { OptionCard } from '@/components/ui/OptionCard';
import { Text } from '@/components/ui/Text';

import { careerSections, careersOf, genericCareers, institutionById } from '../admission';
import { SectionLabel, StepLayout, StepTitle } from '../components';
import { type Career, formatScore, type GenericCareer } from '../model';
import { useOnboarding } from '../store';
import type { StepProps } from './types';

type Item = Career | GenericCareer;

const hintOf = (c: Item): string =>
  'count' in c ? `En ${c.count} ${c.count === 1 ? 'universidad' : 'universidades'}` : c.place;
const badgeOf = (c: Item): string | undefined =>
  'cut' in c && c.cut ? `Último ${c.cut.kind} ${c.cut.year}: ${formatScore(c.cut.score)}` : undefined;

const Row = memo(function Row({
  item,
  selected,
  onChoose,
}: {
  item: Item;
  selected: boolean;
  onChoose: (id: string) => void;
}) {
  return (
    <View style={{ paddingBottom: 8 }}>
      <OptionCard
        label={item.name}
        hint={hintOf(item)}
        badge={badgeOf(item)}
        badgeTone="neutral"
        selected={selected}
        onPress={() => onChoose(item.id)}
      />
    </View>
  );
});

export function CareerStep({ next }: StepProps) {
  const instId = useOnboarding((s) => s.answers.institutionId);
  const selected = useOnboarding((s) => s.answers.careerId);
  const update = useOnboarding((s) => s.update);
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query);
  const inst = institutionById(instId);
  // Las carreras dependen de la institución: INACAP no tiene las mismas que la UC.
  const list: Item[] = useMemo(() => (inst ? careersOf(inst.id) : genericCareers()), [inst]);
  const sections = useMemo(() => careerSections(list, deferred), [list, deferred]);

  const choose = useCallback((id: string) => update({ careerId: id, target: undefined, tests: undefined }), [update]);

  return (
    <StepLayout
      scroll={false}
      primary={{ label: 'Vamos por esa carrera', onPress: next, disabled: !selected }}
      secondary={{
        label: 'Aún no lo sé',
        onPress: () => (update({ careerId: null, target: undefined, tests: undefined }), next()),
      }}
    >
      <View style={s.head}>
        <StepTitle
          title="¿Qué te gustaría estudiar?"
          subtitle={inst ? inst.name : 'Carreras de las universidades del Sistema de Acceso'}
        />
        <SearchField value={query} onChangeText={setQuery} placeholder="Busca tu carrera" />
      </View>
      <SectionList
        style={{ flex: 1 }}
        contentContainerStyle={s.list}
        sections={sections}
        keyExtractor={(c) => c.id}
        extraData={selected}
        stickySectionHeadersEnabled
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        initialNumToRender={8}
        maxToRenderPerBatch={8}
        windowSize={9}
        removeClippedSubviews
        renderSectionHeader={({ section }) => <SectionLabel>{section.title}</SectionLabel>}
        renderItem={({ item }) => <Row item={item} selected={item.id === selected} onChoose={choose} />}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', gap: 12, paddingVertical: 40 }}>
            <Mascot pose="pensando" height={110} float={false} />
            <Text className="text-center text-graphite">
              No encontramos «{query}». Prueba con una palabra más corta.
            </Text>
          </View>
        }
      />
    </StepLayout>
  );
}

const s = StyleSheet.create({
  head: { gap: 16, paddingHorizontal: 20, paddingTop: 8 },
  list: { paddingHorizontal: 20, paddingBottom: 24 },
});
