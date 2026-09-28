import { View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { TextField } from '@/components/ui/Fields';
import { Mascot, SpeechBubble } from '@/components/ui/Mascot';
import { Text } from '@/components/ui/Text';
import { dur, easeOut } from '@/theme/motion';

import { StepLayout, StepTitle } from '../components';
import { useOnboarding } from '../store';
import type { StepProps } from './types';

/** Mayúscula inicial en cada palabra: "cata" → "Cata". */
const tidy = (s: string) => s.replace(/(^|\s)(\p{Ll})/gu, (m, a: string, b: string) => a + b.toUpperCase());

export function Name({ next }: StepProps) {
  const name = useOnboarding((s) => s.answers.name);
  const update = useOnboarding((s) => s.update);
  const ok = name.trim().length > 0;

  return (
    <StepLayout
      primary={{ label: 'Continuar', onPress: next, disabled: !ok }}
      secondary={{ label: 'Prefiero no decirlo', onPress: () => (update({ name: '' }), next()) }}
    >
      <View className="gap-6">
        <Animated.View entering={FadeInUp.duration(dur.slow).easing(easeOut)}>
          <View className="flex-row items-center gap-3">
            <Mascot pose="curioso" height={72} />
            <SpeechBubble>Antes de empezar, quiero conocerte un poco.</SpeechBubble>
          </View>
        </Animated.View>
        <StepTitle title="¿Cómo te llamas?" delay={80} />
        <Animated.View entering={FadeInUp.duration(dur.slow).delay(160).easing(easeOut)}>
          <View className="gap-2">
            <TextField
              value={name}
              onChangeText={(t) => update({ name: tidy(t.replace(/\s{2,}/g, ' ')).slice(0, 30) })}
              placeholder="Tu nombre o apodo"
              autoCapitalize="words"
              autoComplete="given-name"
              returnKeyType="next"
              onSubmitEditing={() => ok && next()}
              accessibilityLabel="Tu nombre o apodo"
            />
            <Text variant="small">Así sabré cómo saludarte. Solo queda guardado en tu teléfono.</Text>
          </View>
        </Animated.View>
      </View>
    </StepLayout>
  );
}
