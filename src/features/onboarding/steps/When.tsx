import { useEffect } from 'react';
import { View } from 'react-native';

import { OptionCard } from '@/components/ui/OptionCard';
import paes from '@/content/paes-config.json';

import { StepLayout, StepTitle } from '../components';
import { daysUntil, type PaesYear, type SessionId } from '../model';
import { useOnboarding } from '../store';
import type { StepProps } from './types';

const YEARS: { id: PaesYear; label: string; hint?: string }[] = [
  { id: 'this', label: 'Este año', hint: 'Rendición de fines de 2026' },
  { id: 'next', label: 'El próximo año', hint: 'Rendición de 2027' },
  { id: 'later', label: 'En unos años más', hint: 'Estoy en 1.º o 2.º medio' },
  { id: 'unknown', label: 'Todavía no sé' },
];

export function YearStep({ next }: StepProps) {
  const year = useOnboarding((s) => s.answers.year);
  const update = useOnboarding((s) => s.update);
  // Preseleccionado: la mayoría de quienes llegan en esta época rinden este año.
  useEffect(() => {
    if (!year) update({ year: 'this' });
  }, [year, update]);

  return (
    <StepLayout primary={{ label: 'Continuar', onPress: next, disabled: !year }}>
      <View className="gap-5">
        <StepTitle title="¿Cuándo das la PAES?" />
        <View className="gap-2.5">
          {YEARS.map((y) => (
            <OptionCard
              key={y.id}
              label={y.label}
              hint={y.hint}
              selected={year === y.id}
              onPress={() => update({ year: y.id, session: undefined })}
            />
          ))}
        </View>
      </View>
    </StepLayout>
  );
}

type SessionOption = { id: SessionId; label: string; hint: string; badge?: string; disabled?: boolean };

export function SessionStep({ next }: StepProps) {
  const year = useOnboarding((s) => s.answers.year);
  const session = useOnboarding((s) => s.answers.session);
  const update = useOnboarding((s) => s.update);
  const s = paes.sessions;

  const days = daysUntil(s['regular-2026'].start, new Date());
  const options: SessionOption[] =
    year === 'this'
      ? [
          {
            id: 'regular-2026',
            label: 'PAES Regular',
            hint: s['regular-2026'].when,
            badge: days > 0 ? `Faltan ${days} días` : undefined,
          },
          { id: 'unknown', label: 'Invierno', hint: 'La de invierno 2026 ya se rindió en junio', disabled: true },
          { id: 'unknown', label: 'Todavía no sé', hint: 'Lo puedes cambiar después' },
        ]
      : [
          { id: 'invierno-2027', label: 'PAES de Invierno', hint: s['invierno-2027'].when },
          { id: 'regular-2027', label: 'PAES Regular', hint: s['regular-2027'].when },
          { id: 'unknown', label: 'Todavía no sé', hint: 'Lo puedes cambiar después' },
        ];

  // Preselección: la regular (la única que queda este año; la más común el próximo).
  useEffect(() => {
    if (!session) update({ session: year === 'this' ? 'regular-2026' : 'regular-2027' });
  }, [session, year, update]);

  return (
    <StepLayout primary={{ label: 'Continuar', onPress: next, disabled: !session }}>
      <View className="gap-5">
        <StepTitle title="¿Invierno o regular?" subtitle="Así calculamos cuántos días te quedan para prepararte." />
        <View className="gap-2.5">
          {options.map((o, i) => (
            <OptionCard
              key={`${o.label}-${i}`}
              label={o.label}
              hint={o.hint}
              badge={o.badge}
              badgeTone="coral"
              disabled={o.disabled}
              selected={!o.disabled && session === o.id}
              onPress={() => update({ session: o.id })}
            />
          ))}
        </View>
      </View>
    </StepLayout>
  );
}
