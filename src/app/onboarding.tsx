import { Redirect } from 'expo-router';

import { OnboardingFlow } from '@/features/onboarding/OnboardingFlow';
import { useOnboarding } from '@/features/onboarding/store';

export default function OnboardingScreen() {
  // Si el progreso respaldado llega mientras está abierta (teléfono nuevo con la misma cuenta), se entra directo.
  const completed = useOnboarding((s) => s.completed);
  if (completed) return <Redirect href="/" />;
  return <OnboardingFlow />;
}
