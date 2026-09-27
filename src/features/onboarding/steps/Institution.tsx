import { useDeferredValue, useMemo, useState } from 'react';
import { Pressable, ScrollView, SectionList, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { SearchField } from '@/components/ui/Fields';
import { Mascot } from '@/components/ui/Mascot';
import { OptionCard } from '@/components/ui/OptionCard';
import { Text } from '@/components/ui/Text';
import { dur, easeOut } from '@/theme/motion';

import { allInstitutions, institutionSections } from '../admission';
import { SectionLabel, StepLayout, StepTitle } from '../components';
import type { Institution } from '../model';
import { useOnboarding } from '../store';
import type { StepProps } from './types';

/** Accesos rápidos: las instituciones más buscadas por estudiantes (por sigla). */
const POPULAR = ['UC', 'UCH', 'USACH', 'UDEC', 'USM', 'UV', 'INACAP', 'DUOC'];

export const shortOf = (i: Institution): string | null => i.short ?? (i.search ? i.search.split(' ')[0]! : null);

export function InstitutionStep({ next }: StepProps) {
  const selected = useOnboarding((s) => s.answers.institutionId);
  const name = useOnboarding((s) => s.answers.name);
  const update = useOnboarding((s) => s.update);
  const [query, setQuery] = useState('');
  const deferred = useDeferredValue(query);
  const sections = useMemo(() => institutionSections(deferred), [deferred]);
  const popular = useMemo(
    () => POPULAR.map((s) => allInstitutions().find((i) => i.search.split(' ').includes(s))).filter((i): i is Institution => !!i),
    [],
  );

  const choose = (id: string) =>
    update(selected === id ? {} : { institutionId: id, careerId: undefined, target: undefined, tests: undefined });
  const current = allInstitutions().find((i) => i.id === selected);
  const label = current ? `Elegir ${shortOf(current) ?? 'esta institución'}` : 'Elegir';

  return (
    <StepLayout
      scroll={false}
      primary={{ label, onPress: next, disabled: !current }}
      secondary={{ label: 'Aún no lo sé', onPress: () => (update({ institutionId: null, careerId: undefined, target: undefined, tests: undefined }), next()) }}
    >
      <View className="gap-4 px-5 pt-2">
        <StepTitle
          title={name ? `${name}, ¿dónde te gustaría estudiar?` : '¿Dónde te gustaría estudiar?'}
          subtitle="Universidades, institutos y CFT de todo Chile."
        />
        <Animated.View entering={FadeInUp.duration(dur.slow).delay(80).easing(easeOut)}>
          <SearchField value={query} onChangeText={setQuery} placeholder="Busca por nombre o sigla" />
        </Animated.View>
      </View>

      <SectionList
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
        sections={sections}
        keyExtractor={(i) => i.id}
        stickySectionHeadersEnabled
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        initialNumToRender={10}
        windowSize={7}
        ListHeaderComponent={
          !query ? (
            <View className="pt-4">
              <Text variant="overline" className="pb-2 text-graphite">
                Más buscadas
              </Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-2 pr-5">
                {popular.map((i) => {
                  const on = i.id === selected;
                  return (
                    <Pressable
                      key={i.id}
                      accessibilityRole="button"
                      accessibilityState={{ selected: on }}
                      accessibilityLabel={i.name}
                      onPress={() => choose(i.id)}
                      className={`min-h-tap justify-center rounded-full border-2 px-4 ${on ? 'border-sky bg-sky-100' : 'border-line bg-white'}`}
                    >
                      <Text className="font-poppins-semibold text-ink">{shortOf(i)}</Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          ) : null
        }
        renderSectionHeader={({ section }) => <SectionLabel>{section.title}</SectionLabel>}
        renderItem={({ item, index }) => (
          <View className="pb-2">
            <OptionCard
              label={item.name}
              hint={item.paes ? item.region : `${item.region} · admisión directa`}
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
              No encontramos «{query}». Prueba con la sigla o con otra palabra del nombre.
            </Text>
          </View>
        }
      />
    </StepLayout>
  );
}
