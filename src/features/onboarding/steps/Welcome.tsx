import { Image } from 'expo-image';
import { View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';

import { HandNote, Mascot } from '@/components/ui/Mascot';
import { Text } from '@/components/ui/Text';
import { dur, easeOut } from '@/theme/motion';

import { StepLayout, TopicTile } from '../components';
import type { StepProps } from './types';

const VALUES = [
  { icon: 'funcion', strong: 'Entiende', rest: ' cada tema con ejercicios visuales.' },
  { icon: 'balanza', strong: 'Practica', rest: ' con preguntas tipo PAES de M1 y M2.' },
  { icon: 'triangulo', strong: 'Avanza', rest: ' a tu ritmo, con un tutor que no se cansa de explicar.' },
];

export function Welcome({ next }: StepProps) {
  return (
    <StepLayout primary={{ label: 'Comenzar', onPress: next }}>
      <View className="flex-1 justify-center gap-6 py-2">
        <Animated.View entering={FadeIn.duration(dur.slow)} className="items-center">
          <Image
            source={require('@/assets/images/logo/mepreparo-lockup.png')}
            style={{ width: 230, height: 62 }}
            contentFit="contain"
            accessibilityLabel="MePreparo. Entiende, practica, avanza."
          />
        </Animated.View>

        <View className="flex-row items-center justify-center">
          <Mascot pose="saludo" height={190} pop label="Equis te saluda" />
          <Animated.View entering={FadeIn.duration(dur.slow).delay(450)} className="-ml-2 w-36 pb-16">
            <HandNote size={21}>Soy Equis, tu compañero de estudio y tutor.</HandNote>
          </Animated.View>
        </View>

        <View className="gap-4 rounded-lg border border-line bg-white px-4 py-5" style={{ boxShadow: '0 6px 20px rgba(30,42,74,0.06)' }}>
          {VALUES.map((v, i) => (
            <Animated.View
              key={v.strong}
              entering={FadeInUp.duration(dur.slow).delay(250 + i * 110).easing(easeOut)}
              className="flex-row items-center gap-3"
            >
              <TopicTile icon={v.icon} size={52} />
              <Text className="flex-1 text-ink">
                <Text className="font-poppins-semibold text-ink">{v.strong}</Text>
                {v.rest}
              </Text>
            </Animated.View>
          ))}
        </View>
      </View>
    </StepLayout>
  );
}
