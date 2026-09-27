import { useEffect } from 'react';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeInUp, ZoomIn } from 'react-native-reanimated';

import { Icon } from '@/components/ui/Icon';
import { HandNote, Mascot } from '@/components/ui/Mascot';
import { Text } from '@/components/ui/Text';
import { dur, easeOut } from '@/theme/motion';
import { colors, fonts } from '@/theme/tokens';

import { careerById } from '../admission';
import { CountUp, StepLayout, StepTitle } from '../components';
import { formatScore } from '../model';
import { useOnboarding } from '../store';
import type { StepProps } from './types';

const DEFAULT_TARGET = 700;
const clamp = (n: number) => Math.max(400, Math.min(1000, n));

function BigScore({ value, animate }: { value: number; animate: boolean }) {
  return (
    <View className="items-center">
      <View className="flex-row items-start">
        {animate ? (
          <CountUp to={value} format={(n) => formatScore(n)} style={{ fontFamily: fonts["poppins-bold"], color: colors.ink, fontSize: 64, lineHeight: 74 }} />
        ) : (
          <Text style={{ fontFamily: fonts["poppins-bold"], color: colors.ink, fontSize: 64, lineHeight: 74 }}>
            {formatScore(value)}
          </Text>
        )}
        <Animated.View entering={ZoomIn.springify().delay(1300)}>
          <View className="-mt-1 ml-1">
          <Icon name="sparkle" size={26} color={colors.coral} />
          </View>
        </Animated.View>
      </View>
      <View className="mt-1 h-1.5 w-40 rounded-full bg-sky" />
      <Text className="mt-2 font-poppins-semibold text-ink">puntos ponderados</Text>
    </View>
  );
}

export function Target({ next }: StepProps) {
  const careerId = useOnboarding((s) => s.answers.careerId);
  const target = useOnboarding((s) => s.answers.target);
  const update = useOnboarding((s) => s.update);
  const career = careerById(careerId);
  const cut = career && 'cut' in career ? career.cut : undefined;

  // Preselección: el corte oficial si existe; si no, una meta alta pero alcanzable que se puede ajustar.
  useEffect(() => {
    if (target === undefined) update({ target: cut ? cut.score : DEFAULT_TARGET });
  }, [target, cut, update]);
  const value = target ?? cut?.score ?? DEFAULT_TARGET;

  if (cut) {
    return (
      <StepLayout primary={{ label: 'Vamos por ese puntaje', onPress: next }}>
        <View className="flex-1 gap-6">
          <StepTitle title="Apuntemos a superar este puntaje" />
          <BigScore value={cut.score} animate />
          <Animated.View entering={FadeInUp.duration(dur.slow).delay(500).easing(easeOut)}>
            <View className="items-center gap-2">
            <Text variant="small" className="text-center">
              Puntaje del último {cut.kind === 'seleccionado' ? 'seleccionado' : 'matriculado'} en {career?.name}
            </Text>
            <Text className="rounded-full bg-paper-2 px-3 py-1 font-poppins-semibold text-caption text-graphite">
              Admisión {cut.year}
            </Text>
            <Text variant="small" className="px-4 text-center">
              El corte cambia cada año. Lo usaremos como referencia para tu preparación.
            </Text>
            </View>
          </Animated.View>
          <View className="mt-auto flex-row items-end gap-2">
            <Mascot pose="senalando" height={120} />
            <Animated.View entering={FadeIn.duration(dur.slow).delay(900)}>
              <View className="pb-8">
              <HandNote>Vamos paso a paso.</HandNote>
              </View>
            </Animated.View>
          </View>
        </View>
      </StepLayout>
    );
  }

  // Sin corte oficial cargado: el estudiante elige su meta (preseleccionada en 700).
  const set = (n: number) => update({ target: clamp(n) });
  return (
    <StepLayout primary={{ label: 'Vamos por ese puntaje', onPress: next }}>
      <View className="flex-1 gap-6">
        <StepTitle title="¿A qué puntaje apuntas?" subtitle="Puntaje ponderado de 100 a 1.000. Puedes cambiarlo cuando quieras." />
        <View className="flex-row items-center justify-center gap-4">
          <Stepper icon="minus" label="Bajar 10 puntos" onPress={() => set(value - 10)} />
          <BigScore value={value} animate={false} />
          <Stepper icon="plus" label="Subir 10 puntos" onPress={() => set(value + 10)} />
        </View>
        <View className="flex-row justify-center gap-2">
          {[600, 700, 800].map((n) => (
            <Pressable
              key={n}
              accessibilityRole="button"
              onPress={() => set(n)}
              className={`min-h-tap justify-center rounded-full border-2 px-5 ${value === n ? 'border-sky bg-sky-100' : 'border-line bg-white'}`}
            >
              <Text className="font-poppins-semibold text-ink">{n}</Text>
            </Pressable>
          ))}
        </View>
        <Text variant="small" className="text-center">
          Aún no tenemos el corte oficial de esta carrera. Apenas lo tengamos, te lo mostramos.
        </Text>
        <View className="mt-auto flex-row items-end gap-2">
          <Mascot pose="senalando" height={110} />
          <View className="pb-8">
            <HandNote>Vamos paso a paso.</HandNote>
          </View>
        </View>
      </View>
    </StepLayout>
  );
}

function Stepper({ icon, label, onPress }: { icon: 'plus' | 'minus'; label: string; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className="h-12 w-12 items-center justify-center rounded-full border-2 border-graphite-200 bg-white active:bg-sky-50"
    >
      <Icon name={icon} size={22} />
    </Pressable>
  );
}
