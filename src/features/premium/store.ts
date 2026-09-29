import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import limitsJson from '@/content/limits.json';
import paesConfig from '@/content/paes-config.json';
import { dayKey } from '@/engine/dates';
import { hasPremium, type PlanState, planState } from '@/engine/entitlements';
import { latest, passUntil, type TrialNotice } from '@/engine/premium';
import { useOnboarding } from '@/features/onboarding/store';
import { kv } from '@/lib/kv';

export const SESSIONS = Object.values(paesConfig.sessions);
export const TRIAL_DAYS = limitsJson.trialDays;

type PremiumState = {
  /** Vencimiento de la suscripción mensual según la tienda (ISO), o null. */
  subscriptionUntil: string | null;
  /** Pase PAES: fecha de compra y vencimiento (se calcula una vez al comprar). */
  pass: { purchasedAt: string; until: string } | null;
  /** La oferta de fin de prueba se usa una sola vez. */
  offerUsed: boolean;
  noticesSeen: Partial<Record<TrialNotice, boolean>>;
  setSubscription: (until: string | null) => void;
  setPass: (purchasedAt: string) => void;
  markOfferUsed: () => void;
  markNotice: (n: TrialNotice) => void;
};

/**
 * Premium pagado (RevenueCat) y avisos de la prueba. La prueba de 7 días vive en el onboarding (`trialStartedAt`):
 * la gestiona la app, sin tarjeta, y nunca se convierte en cobro.
 */
export const usePremiumStore = create<PremiumState>()(
  persist(
    (set, get) => ({
      subscriptionUntil: null,
      pass: null,
      offerUsed: false,
      noticesSeen: {},
      setSubscription: (until) => set({ subscriptionUntil: until }),
      setPass: (purchasedAt) => {
        // Si ya estaba registrado ese mismo pase, no se recalcula (las fechas de la PAES pueden cambiar por OTA).
        if (get().pass?.purchasedAt === purchasedAt) return;
        set({ pass: { purchasedAt, until: passUntil(dayKey(new Date(purchasedAt)), SESSIONS) } });
      },
      markOfferUsed: () => set({ offerUsed: true }),
      markNotice: (n) => set((s) => ({ noticesSeen: { ...s.noticesSeen, [n]: true } })),
    }),
    {
      name: 'mp.premium.v1',
      storage: createJSONStorage(() => kv),
      partialize: (s) => ({ subscriptionUntil: s.subscriptionUntil, pass: s.pass, offerUsed: s.offerUsed, noticesSeen: s.noticesSeen }),
    },
  ),
);

export function premiumUntil(s: Pick<PremiumState, 'subscriptionUntil' | 'pass'>) {
  return latest(s.subscriptionUntil, s.pass?.until);
}

/** Plan vigente (prueba, Premium o gratis). Única fuente para toda la app. */
export function usePlan(): PlanState {
  const trialStartedAt = useOnboarding((s) => s.answers.trialStartedAt);
  const subscriptionUntil = usePremiumStore((s) => s.subscriptionUntil);
  const pass = usePremiumStore((s) => s.pass);
  return planState({ trialStartedAt, premiumUntil: premiumUntil({ subscriptionUntil, pass }) }, dayKey(new Date()));
}

export const useHasPremium = () => hasPremium(usePlan());
