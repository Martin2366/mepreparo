import { View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { Mascot } from '@/components/ui/Mascot';
import { Text } from '@/components/ui/Text';
import { dur, easeOut } from '@/theme/motion';
import { colors } from '@/theme/tokens';

import { careerById, institutionById, isGeneric } from '../admission';
import { Callout, CountUp, Donut, StepLayout, StepTitle } from '../components';
import { mathShare, weightSlices } from '../model';
import { useOnboarding } from '../store';
import type { StepProps } from './types';

const SLICE_COLOR: Record<string, string> = {
  nem: colors.ink,
  ranking: colors.graphite,
  lectora: colors.graphite200,
  m1: colors.sky,
  m2: colors.sky700,
  ciencias: colors.graphite300,
  historia: colors.sky200,
  hoc: colors.graphite300,
  especial: colors.ink700,
};

function mathMessage(m1: number, m2: number): string {
  const total = m1 + m2;
  if (m2 > 0) return `M1 y M2 suman el ${total} % de tu puntaje. Ahí es donde te acompaño yo.`;
  if (m1 >= 25) return `Matemática 1 pesa un ${m1} %: es de lo que más suma. Ahí es donde te acompaño yo.`;
  return `Matemática 1 pesa un ${m1} %. En la PAES cada punto cuenta, y te ayudo a asegurarlos.`;
}

export function Weights({ next }: StepProps) {
  const answers = useOnboarding((s) => s.answers);
  const career = careerById(answers.careerId);
  const inst = institutionById(answers.institutionId);

  // Institución con admisión directa (IP, CFT, algunas privadas): no hay ponderaciones PAES.
  if (!career?.w) {
    return (
      <StepLayout primary={{ label: 'Continuar', onPress: next }}>
        <View className="flex-1 justify-center gap-6">
          <View className="items-center">
            <Mascot pose="explicando" height={170} pop />
          </View>
          <StepTitle title="¡Buena elección!" subtitle={career ? `${career.name} · ${inst?.name ?? ''}` : undefined} />
          <Animated.View entering={FadeInUp.duration(dur.slow).delay(150).easing(easeOut)} className="gap-4">
            <Text className="text-ink">
              {inst?.name ?? 'Esta institución'} tiene admisión directa: no usa la postulación con PAES del Sistema de
              Acceso. Revisa sus requisitos en su sitio oficial.
            </Text>
            <Callout>Igual te ayudo con la PAES: te abre más puertas si después quieres postular a una universidad.</Callout>
          </Animated.View>
        </View>
      </StepLayout>
    );
  }

  const w = career.w;
  const slices = weightSlices(w, career.hoc);
  const math = mathShare(w);
  const generic = isGeneric(career);

  return (
    <StepLayout primary={{ label: 'Continuar', onPress: next }}>
      <View className="gap-5">
        <StepTitle
          title="Esto es lo que pesa para entrar a tu carrera"
          subtitle={generic ? `${career.name} · promedio de ${career.count} universidades` : `${career.name} · ${inst?.name ?? ''}`}
        />
        <View className="items-center py-1">
          <Donut slices={slices.map((s) => ({ key: s.key, value: s.value, color: SLICE_COLOR[s.key] ?? colors.graphite300 }))}>
            <CountUp to={math} format={(n) => `${Math.round(n)} %`} className="font-poppins-bold text-h1 text-ink" />
            <Text variant="small">matemática</Text>
          </Donut>
        </View>
        <View className="gap-2.5">
          {slices.map((s, i) => (
            <Animated.View
              key={s.key}
              entering={FadeInUp.duration(dur.slow).delay(300 + i * 60).easing(easeOut)}
              className="flex-row items-center gap-3"
            >
              <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: SLICE_COLOR[s.key] }} />
              <Text className={`flex-1 ${s.math ? 'font-poppins-semibold text-ink' : 'text-ink'}`}>{s.label}</Text>
              <Text className={s.math ? 'font-poppins-semibold text-ink' : 'text-graphite'}>{s.value} %</Text>
            </Animated.View>
          ))}
        </View>
        <Animated.View entering={FadeInUp.duration(dur.slow).delay(750).easing(easeOut)} className="gap-2">
          <Callout>{mathMessage(w.m1, w.m2)}</Callout>
          <Text variant="caption">
            {generic
              ? 'Referencia: cada universidad define sus ponderaciones.'
              : 'Fuente: DEMRE, Oferta Definitiva de Carreras, Admisión 2027.'}
          </Text>
        </Animated.View>
      </View>
    </StepLayout>
  );
}
