import { useRef } from 'react';
import { ScrollView, View } from 'react-native';

import { OptionCard } from '@/components/ui/OptionCard';
import content from '@/content/onboarding-tests.json';

import { SectionLabel, StepLayout, StepTitle, TopicTile } from '../components';
import { groupsFor, type TopicGroup } from '../model';
import { useOnboarding } from '../store';
import type { StepProps } from './types';

type TopicItem = { id: string; label: string; hint: string; icon: string; tests?: string[] };

/** Temas según las pruebas elegidas: si rinde M2, aparecen también los temas propios de M2. */
function topicsFor(group: TopicGroup, tests: string[]): TopicItem[] {
  const items = content.topics[group].items as TopicItem[];
  if (group !== 'matematica') return items;
  const m2 = tests.includes('m2');
  return items.filter((t) => !t.tests || t.tests.includes('m1') || (m2 && t.tests.includes('m2')));
}

export function Topics({ next }: StepProps) {
  const tests = useOnboarding((s) => s.answers.tests);
  const topics = useOnboarding((s) => s.answers.topics);
  const update = useOnboarding((s) => s.update);
  const groups = groupsFor(tests);
  const toggle = (id: string) =>
    update({ topics: topics.includes(id) ? topics.filter((t) => t !== id) : [...topics, id] });

  return (
    <StepLayout primary={{ label: topics.length ? 'Continuar' : 'Saltar por ahora', onPress: next }}>
      <View className="gap-1">
        <StepTitle title="¿Qué temas te cuestan más?" subtitle="Puedes marcar más de uno. Empezaremos por ahí." />
        {groups.map((g) => (
          <View key={g}>
            {groups.length > 1 ? <SectionLabel>{content.topics[g].title}</SectionLabel> : <View className="h-4" />}
            <View className="gap-2.5">
              {topicsFor(g, tests ?? []).map((t) => (
                <OptionCard
                  key={t.id}
                  kind="check"
                  label={t.label}
                  hint={t.hint}
                  leading={<TopicTile icon={t.icon} size={44} />}
                  selected={topics.includes(t.id)}
                  onPress={() => toggle(t.id)}
                />
              ))}
            </View>
          </View>
        ))}
      </View>
    </StepLayout>
  );
}

export function Blockers({ next }: StepProps) {
  const tests = useOnboarding((s) => s.answers.tests);
  const blockers = useOnboarding((s) => s.answers.blockers);
  const update = useOnboarding((s) => s.update);
  const groups = groupsFor(tests);
  const scroll = useRef<ScrollView>(null);
  const offsets = useRef<Partial<Record<TopicGroup, number>>>({});
  const answered = groups.filter((g) => blockers[g]).length;

  const choose = (g: TopicGroup, id: string) => {
    update({ blockers: { ...blockers, [g]: id } });
    // Guía suave: al responder una prueba, baja a la siguiente sin respuesta.
    const nextGroup = groups.slice(groups.indexOf(g) + 1).find((x) => !blockers[x]);
    const y = nextGroup ? offsets.current[nextGroup] : undefined;
    if (y !== undefined) setTimeout(() => scroll.current?.scrollTo({ y: Math.max(0, y - 8), animated: true }), 220);
  };

  return (
    <StepLayout scroll={false} primary={{ label: 'Continuar', onPress: next, disabled: answered === 0 }}>
      <ScrollView
        ref={scroll}
        className="flex-1"
        contentContainerClassName="px-5 pb-6 pt-2"
        showsVerticalScrollIndicator={false}
      >
        <StepTitle
          title="¿Qué es lo que más te frena?"
          subtitle={groups.length > 1 ? 'Elige una opción por prueba.' : 'Elige la que más se parezca a ti.'}
        />
        {groups.map((g) => (
          <View key={g} onLayout={(e) => (offsets.current[g] = e.nativeEvent.layout.y)}>
            {groups.length > 1 ? <SectionLabel>{content.blockers[g].title}</SectionLabel> : <View className="h-4" />}
            <View className="gap-2.5">
              {content.blockers[g].items.map((b) => (
                <OptionCard
                  key={b.id}
                  label={b.label}
                  selected={blockers[g] === b.id}
                  onPress={() => choose(g, b.id)}
                />
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </StepLayout>
  );
}
