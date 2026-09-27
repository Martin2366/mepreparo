import { useEffect, useMemo } from 'react';
import { View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { OptionCard } from '@/components/ui/OptionCard';
import content from '@/content/onboarding-tests.json';
import { dur, easeOut } from '@/theme/motion';

import { careerById } from '../admission';
import { Callout, StepLayout, StepTitle, TopicTile } from '../components';
import { recommendedTests, type TestId } from '../model';
import { useOnboarding } from '../store';
import type { StepProps } from './types';

export function Tests({ next }: StepProps) {
  const tests = useOnboarding((s) => s.answers.tests);
  const careerId = useOnboarding((s) => s.answers.careerId);
  const update = useOnboarding((s) => s.update);
  const career = careerById(careerId);
  const rec = useMemo(() => recommendedTests(career?.w, career?.hoc), [career]);

  // Preselección según la carrera (M1 y Lectora siempre). "Todavía no sé" = lista vacía.
  useEffect(() => {
    if (tests === undefined) update({ tests: rec.tests });
  }, [tests, rec, update]);

  const current = tests ?? rec.tests;
  const unknown = tests !== undefined && tests.length === 0;
  const toggle = (id: TestId) =>
    update({ tests: current.includes(id) ? current.filter((t) => t !== id) : [...current, id] });

  const badgeFor = (id: string, required?: boolean) => {
    if (required) return 'Obligatoria';
    if (career && rec.tests.includes(id as TestId)) return 'Recomendada';
    return undefined;
  };

  return (
    <StepLayout primary={{ label: 'Continuar', onPress: next, disabled: !unknown && current.length === 0 }}>
      <View className="gap-5">
        <StepTitle
          title="¿Qué pruebas vas a rendir?"
          subtitle={career ? 'Marcamos las que pide tu carrera. Puedes cambiarlas.' : 'Puedes marcar varias.'}
        />
        <View className="gap-2.5">
          {content.tests.map((t, i) => (
            <OptionCard
              key={t.id}
              kind="check"
              label={t.name}
              hint={t.note}
              badge={badgeFor(t.id, t.required)}
              badgeTone={t.required ? 'neutral' : 'sky'}
              leading={<TopicTile icon={t.icon} size={40} />}
              selected={!unknown && current.includes(t.id as TestId)}
              onPress={() => toggle(t.id as TestId)}
            />
          ))}
          <OptionCard
            kind="check"
            label="Todavía no sé"
            hint="Te preparamos para las obligatorias"
            selected={unknown}
            onPress={() => update({ tests: unknown ? rec.tests : [] })}
          />
        </View>
        {rec.eitherHistoriaOCiencias ? (
          <Animated.View entering={FadeInUp.duration(dur.slow).delay(400).easing(easeOut)}>
            <Callout>Tu carrera acepta Historia o Ciencias: se considera la que te vaya mejor. Elige una o ambas.</Callout>
          </Animated.View>
        ) : null}
      </View>
    </StepLayout>
  );
}
