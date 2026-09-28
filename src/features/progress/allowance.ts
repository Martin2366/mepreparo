import { dayKey } from '@/engine/dates';
import { type Allowance, allowance, type Feature, planState } from '@/engine/entitlements';
import { useOnboarding } from '@/features/onboarding/store';

import { useProgress } from './store';

/** ¿Puede usar esta función hoy? (límites del plan gratis, PRD §4.2). `use` registra el uso. */
export function useAllowance(feature: Feature): Allowance & { use: () => void } {
  const trialStartedAt = useOnboarding((s) => s.answers.trialStartedAt);
  const usage = useProgress((s) => s.usage);
  const use = useProgress((s) => s.use);
  const today = dayKey(new Date());
  const plan = planState({ trialStartedAt }, today);
  return { ...allowance(feature, plan, usage, today), use: () => use(feature) };
}
