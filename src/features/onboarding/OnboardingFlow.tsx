import { Image } from 'expo-image';
import { router } from 'expo-router';
import { type ComponentType, useCallback, useEffect, useState } from 'react';
import { BackHandler, KeyboardAvoidingView, Pressable, View } from 'react-native';
import Animated, { Easing, Keyframe } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GridBackground } from '@/components/ui/GridBackground';
import { Icon } from '@/components/ui/Icon';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Text } from '@/components/ui/Text';

import { careerById, institutionById } from './admission';
import { progressOf, type StepId, visibleSteps } from './model';
import { useOnboarding } from './store';
import { CareerStep } from './steps/Career';
import { Cheer } from './steps/Cheer';
import { InstitutionStep } from './steps/Institution';
import { Name } from './steps/Name';
import { Target } from './steps/Target';
import { Tests } from './steps/Tests';
import { Blockers, Topics } from './steps/Topics';
import type { StepProps } from './steps/types';
import { Weights } from './steps/Weights';
import { Welcome } from './steps/Welcome';
import { SessionStep, YearStep } from './steps/When';

const SCREENS: Record<StepId, ComponentType<StepProps>> = {
  welcome: Welcome,
  name: Name,
  institution: InstitutionStep,
  career: CareerStep,
  weights: Weights,
  year: YearStep,
  session: SessionStep,
  target: Target,
  cheer: Cheer,
  tests: Tests,
  topics: Topics,
  blockers: Blockers,
};

// Transición calma: la pantalla nueva entra deslizándose 24 dp y apareciendo. Sin animación de salida:
// en Android dejaba la pantalla anterior superpuesta.
const ease = Easing.out(Easing.cubic);
const enter = (dir: 1 | -1) =>
  new Keyframe({
    0: { opacity: 0, transform: [{ translateX: 24 * dir }] },
    100: { opacity: 1, transform: [{ translateX: 0 }], easing: ease },
  }).duration(260);

function currentSteps(): StepId[] {
  const { answers } = useOnboarding.getState();
  const career = careerById(answers.careerId);
  const inst = institutionById(answers.institutionId);
  return visibleSteps(answers, { career: career ?? null, institutionPaes: inst ? inst.paes : true });
}

export function OnboardingFlow() {
  const step = useOnboarding((s) => s.step);
  const answers = useOnboarding((s) => s.answers);
  const goTo = useOnboarding((s) => s.goTo);
  const complete = useOnboarding((s) => s.complete);
  // Dirección de la transición: adelante desliza desde la derecha; atrás, desde la izquierda.
  const [dir, setDir] = useState<1 | -1>(1);

  const career = careerById(answers.careerId);
  const inst = institutionById(answers.institutionId);
  const steps = visibleSteps(answers, { career: career ?? null, institutionPaes: inst ? inst.paes : true });
  const active = steps.includes(step) ? step : 'welcome';

  const next = useCallback(() => {
    const list = currentSteps();
    const i = list.indexOf(useOnboarding.getState().step);
    setDir(1);
    if (i >= 0 && i < list.length - 1) goTo(list[i + 1]!);
    else {
      complete();
      router.replace('/');
    }
  }, [goTo, complete]);

  const back = useCallback(() => {
    const list = currentSteps();
    const i = list.indexOf(useOnboarding.getState().step);
    if (i <= 0) return false;
    setDir(-1);
    goTo(list[i - 1]!);
    return true;
  }, [goTo]);

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', back);
    return () => sub.remove();
  }, [back]);

  const Screen = SCREENS[active];

  return (
    <View className="flex-1 bg-paper">
      <GridBackground />
      <SafeAreaView className="flex-1" edges={['top']}>
        <KeyboardAvoidingView className="flex-1" behavior="padding">
          {active !== 'welcome' ? <Header onBack={back} progress={progressOf(active, steps)} /> : null}
          <View className="flex-1">
            <Animated.View
              key={active}
              entering={enter(dir)}
              style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
            >
              <Screen next={next} />
            </Animated.View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

function Header({ onBack, progress }: { onBack: () => void; progress: number }) {
  return (
    <View className="gap-3 px-5 pb-3 pt-1">
      <View className="flex-row items-center">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Volver"
          onPress={onBack}
          hitSlop={8}
          className="h-12 w-12 items-center justify-center rounded-full active:bg-sky-50"
        >
          <Icon name="arrow-left" size={24} />
        </Pressable>
        <View className="flex-1 flex-row items-center justify-center gap-2 pr-12">
          <Image source={require('@/assets/images/logo/mepreparo-icon.png')} style={{ width: 28, height: 27 }} contentFit="contain" />
          <Text className="font-poppins-bold text-lead text-ink">MePreparo</Text>
          <Text className="rounded-full bg-sky-100 px-2.5 py-0.5 font-poppins-semibold text-caption text-sky-700">PAES</Text>
        </View>
      </View>
      <ProgressBar value={progress} />
    </View>
  );
}
