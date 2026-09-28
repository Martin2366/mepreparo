import { View } from 'react-native';
import Animated, { FadeInUp, ZoomIn } from 'react-native-reanimated';

import { Icon } from '@/components/ui/Icon';
import { Mascot } from '@/components/ui/Mascot';
import { Text } from '@/components/ui/Text';
import { dur, easeOut } from '@/theme/motion';
import { colors } from '@/theme/tokens';

import { careerById, institutionById } from '../admission';
import { StepLayout } from '../components';
import { formatScore } from '../model';
import { useOnboarding } from '../store';
import type { StepProps } from './types';

/** Momento de ánimo: la meta se vuelve concreta y Equis celebra. Después vienen las últimas preguntas. */
export function Cheer({ next }: StepProps) {
  const a = useOnboarding((s) => s.answers);
  const career = careerById(a.careerId);
  const inst = institutionById(a.institutionId);
  const where = inst?.name ?? (career ? 'Universidad por definir' : null);

  return (
    <StepLayout primary={{ label: 'Continuar', onPress: next }}>
      <View className="flex-1 justify-center gap-6">
        <Animated.View entering={FadeInUp.duration(dur.slow).easing(easeOut)}>
          <View className="gap-2">
            <Text accessibilityRole="header" className="font-poppins-bold text-h2 text-ink">
              {a.name ? `¡Vamos por tu meta, ${a.name}!` : '¡Vamos por tu meta!'}
            </Text>
            {career ? (
              <View className="gap-0.5">
                <Text className="font-poppins-semibold text-lead text-sky-700">{career.name}</Text>
                <Text variant="small">
                  {where}
                  {a.target ? ` · meta ${formatScore(a.target)} puntos` : ''}
                </Text>
              </View>
            ) : (
              <View className="gap-0.5">
                <Text className="font-poppins-semibold text-lead text-sky-700">Carrera por definir</Text>
                <Text variant="small">Puedes elegirla más adelante.</Text>
              </View>
            )}
          </View>
        </Animated.View>

        <View className="items-center">
          <View>
            <Mascot pose="celebrando" height={210} pop cheer label="Equis celebra" />
            <Animated.View
              entering={ZoomIn.springify().delay(400)}
              style={{ position: 'absolute', top: 6, right: -18 }}
            >
              <Icon name="sparkle" size={30} color={colors.coral} />
            </Animated.View>
            <Animated.View
              entering={ZoomIn.springify().delay(650)}
              style={{ position: 'absolute', top: 60, left: -22 }}
            >
              <Icon name="sparkle" size={20} color={colors.coral} />
            </Animated.View>
          </View>
        </View>

        <Animated.View entering={FadeInUp.duration(dur.slow).delay(500).easing(easeOut)}>
          <Text className="text-center text-lead text-ink">
            Tengo casi todo listo para ayudarte con tu meta. Solo unas preguntas más.
          </Text>
        </Animated.View>
      </View>
    </StepLayout>
  );
}
