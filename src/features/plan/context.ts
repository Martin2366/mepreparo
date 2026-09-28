import diagnostic from '@/content/diagnostic.json';
import content from '@/content/onboarding-tests.json';
import paes from '@/content/paes-config.json';
import { type PlanContext, type PlanSummary, planSummary } from '@/engine/plan';
import type { Answers } from '@/features/onboarding/model';

export const TOPIC_LABEL: Record<string, string> = Object.fromEntries(
  Object.values(content.topics).flatMap((g) => g.items.map((t) => [t.id, t.label])),
);

export const QUESTION_FOCUS: string[] = diagnostic.questions.map((q) => q.focus);

type Session = { label: string; start: string | null; when: string };

/** La PAES elegida en el onboarding, con su fecha si ya está publicada. */
export function sessionOf(a: Answers): Session | undefined {
  if (!a.session || a.session === 'unknown') return undefined;
  return (paes.sessions as Record<string, Session>)[a.session];
}

export function planContext(a: Answers, today: Date = new Date()): PlanContext {
  return { today, sessionStart: sessionOf(a)?.start ?? null, questionFocus: QUESTION_FOCUS, topicLabel: TOPIC_LABEL };
}

/** Resumen del plan (onboarding y pestañas usan exactamente el mismo cálculo). */
export const planOf = (a: Answers, today: Date = new Date()): PlanSummary => planSummary(a, planContext(a, today));
