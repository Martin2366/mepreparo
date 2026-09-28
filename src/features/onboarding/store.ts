import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { kv } from '@/lib/kv';

import { type Answers, EMPTY_ANSWERS, type StepId } from './model';

type OnboardingState = {
  answers: Answers;
  step: StepId;
  completed: boolean;
  update: (patch: Partial<Answers>) => void;
  goTo: (step: StepId) => void;
  complete: () => void;
  reset: () => void;
  /** Volver a responder el onboarding desde el perfil, conservando la prueba Premium y el XP ya entregado. */
  restart: () => void;
};

/**
 * Estado del onboarding, persistido en el teléfono en cada cambio: si la app se cierra a la mitad,
 * se retoma en la misma pantalla con las mismas respuestas.
 */
export const useOnboarding = create<OnboardingState>()(
  persist(
    (set) => ({
      answers: EMPTY_ANSWERS,
      step: 'welcome',
      completed: false,
      update: (patch) => set((s) => ({ answers: { ...s.answers, ...patch } })),
      goTo: (step) => set({ step }),
      complete: () => set({ completed: true }),
      reset: () => set({ answers: EMPTY_ANSWERS, step: 'welcome', completed: false }),
      // Las respuestas se conservan (quedan preseleccionadas), igual que la prueba y el XP.
      restart: () => set({ step: 'name', completed: false }),
    }),
    {
      name: 'mp.onboarding.v1',
      storage: createJSONStorage(() => kv),
      partialize: (s) => ({ answers: s.answers, step: s.step, completed: s.completed }),
    },
  ),
);
