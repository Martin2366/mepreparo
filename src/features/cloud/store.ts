import { randomUUID } from 'expo-crypto';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { kv } from '@/lib/kv';

export type DocId = 'progress' | 'exams' | 'intensives' | 'onboarding' | 'premium';

export type CloudStatus = 'off' | 'local' | 'syncing' | 'backed-up';

type CloudState = {
  /** Identificador de este teléfono (para no volver a bajar lo que él mismo subió). */
  deviceId: string;
  /** Usuario de Supabase con el que se subió lo último; si cambia, todo se vuelve a subir a la nueva cuenta. */
  userId: string | null;
  isAnonymous: boolean;
  email: string | null;
  status: CloudStatus;
  lastSyncAt: string | null;
  /** Documentos con cambios sin subir (persistido: si la app se cierra, se suben al volver). */
  dirty: Partial<Record<DocId, true>>;
  /** `updated_at` del servidor de lo último que se bajó por documento. */
  pulled: Partial<Record<DocId, string>>;
  set: (patch: Partial<Omit<CloudState, 'set'>>) => void;
};

const newId = () => randomUUID();

export const useCloud = create<CloudState>()(
  persist(
    (set) => ({
      deviceId: newId(),
      userId: null,
      isAnonymous: true,
      email: null,
      status: 'local',
      lastSyncAt: null,
      dirty: {},
      pulled: {},
      set: (patch) => set(patch),
    }),
    {
      name: 'mp.cloud.v1',
      storage: createJSONStorage(() => kv),
      partialize: ({ deviceId, userId, isAnonymous, email, lastSyncAt, dirty, pulled }) => ({
        deviceId,
        userId,
        isAnonymous,
        email,
        lastSyncAt,
        dirty,
        pulled,
      }),
    },
  ),
);
