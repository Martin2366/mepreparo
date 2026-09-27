import { useDeferredValue, useMemo, useState } from 'react';
import { SectionList, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { SearchField } from '@/components/ui/Fields';
import { Mascot } from '@/components/ui/Mascot';
import { OptionCard } from '@/components/ui/OptionCard';
import { Text } from '@/components/ui/Text';
import { dur, easeOut } from '@/theme/motion';

import { careerSections, careersOf, genericCareers, institutionById } from '../admission';
import { SectionLabel, StepLayout, StepTitle } from '../components';
import { type Career, formatScore, type GenericCareer } from '../model';
import { useOnboarding } from '../store';
import type { StepProps } from './types';

type Item = Career | GenericCareer;

const hintOf = (c: Item): string => ('count' in c ? `En ${c.count} ${c.count === 1 ? 'universidad' : 'universidades'}` : c.place);
const badgeOf = (c: Item): string | undefined =>
  'cut' in c && c.cut ? `Último ${c.cut.kind} ${c.cut.year}: ${formatScore(c.cut.score)}` : undefined;

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

  const choose = (id: string) => update(selected === id ? {} : { careerId: id, target: undefined, tests: undefined });

  return (
    <StepLayout
      scroll={false}
      primary={{ label: 'Vamos por esa carrera', onPress: next, disabled: !selected }}
      secondary={{ label: 'Aún no lo sé', onPress: () => (update({ careerId: null, target: undefined, tests: undefined }), next()) }}
    >
      <View className="gap-4 px-5 pt-2">
        <StepTitle
          title="¿Qué te gustaría estudiar?"
          subtitle={inst ? `${list.length} carreras en ${inst.name}` : `${list.length} carreras de las universidades del Sistema de Acceso`}
        />
        <Animated.View entering={FadeInUp.duration(dur.slow).delay(80).easing(easeOut)}>
          <SearchField value={query} onChangeText={setQuery} placeholder="Busca tu carrera" />
        </Animated.View>
      </View>
      <SectionList
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        sections={sections}
        keyExtractor={(c) => c.id}
        stickySectionHeadersEnabled
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        initialNumToRender={10}
        windowSize={7}
        renderSectionHeader={({ section }) => <SectionLabel>{section.title}</SectionLabel>}
        renderItem={({ item, index }) => (
          <View className="pb-2">
            <OptionCard
              label={item.name}
              hint={hintOf(item)}
              badge={badgeOf(item)}
              badgeTone="neutral"
              selected={item.id === selected}
              onPress={() => choose(item.id)}
              index={index}
              animateIn={index < 6}
            />
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center gap-3 py-10">
            <Mascot pose="pensando" height={110} />
            <Text className="text-center text-graphite">
              No encontramos «{query}». Prueba con una palabra más corta (por ejemplo, «ingeniería»).
            </Text>
          </View>
        }
      />
    </StepLayout>
  );
}
