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
import { FULLSCREEN_STEPS, progressOf, type StepId, visibleSteps } from './model';
import { useOnboarding } from './store';
import { CareerStep } from './steps/Career';
import { DiagInviteStep, DiagnosticStep, QUESTIONS } from './steps/Diagnostic';
import { MinutesStep, ReminderStep } from './steps/Habits';
import { DoneStep, GeneratingStep, PlanStep, PremiumStep } from './steps/Plan';
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
  minutes: MinutesStep,
  reminder: ReminderStep,
  diagInvite: DiagInviteStep,
  diagnostic: DiagnosticStep,
  generating: GeneratingStep,
  plan: PlanStep,
  premium: PremiumStep,
  done: DoneStep,
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
    const st = useOnboarding.getState();
    // En el diagnóstico, atrás vuelve a la pregunta anterior.
    if (st.step === 'diagnostic' && st.answers.diag && st.answers.diag.qi > 0) {
      const d = st.answers.diag;
      st.update({ diag: { ...d, qi: d.qi - 1, answers: d.answers.slice(0, d.qi - 1) } });
      return true;
    }
    // Desde la pantalla generando o las de cierre no se retrocede (el plan ya se armó).
    if (st.step === 'generating' || st.step === 'done') return true;
    const list = currentSteps();
    const i = list.indexOf(st.step);
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
          {!FULLSCREEN_STEPS.includes(active) ? (
            <Header
              onBack={back}
              progress={
                active === 'diagnostic' ? ((answers.diag?.qi ?? 0) + 1) / QUESTIONS.length : progressOf(active, steps)
              }
              right={active === 'diagnostic' ? `${(answers.diag?.qi ?? 0) + 1}/${QUESTIONS.length}` : undefined}
            />
          ) : null}
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

function Header({ onBack, progress, right }: { onBack: () => void; progress: number; right?: string }) {
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
        <View className={`flex-1 flex-row items-center justify-center gap-2 ${right ? '' : 'pr-12'}`}>
          <Image
            source={require('@/assets/images/logo/mepreparo-icon.png')}
            style={{ width: 28, height: 27 }}
            contentFit="contain"
          />
          <Text className="font-poppins-bold text-lead text-ink">MePreparo</Text>
          <Text className="rounded-full bg-sky-100 px-2.5 py-0.5 font-poppins-semibold text-caption text-sky-700">
            PAES
          </Text>
        </View>
        {right ? <Text className="w-12 text-right font-poppins-semibold text-small text-graphite">{right}</Text> : null}
      </View>
      <ProgressBar value={progress} />
    </View>
  );
}
