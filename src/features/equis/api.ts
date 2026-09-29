import type { z } from 'zod';

import { ChatSchema, ExplainSchema, ScanSchema, topicList, type UnitGenerators } from '@/engine/equis';
import { GENERATORS } from '@/engine/generators';
import { track } from '@/features/cloud/auth';
import { ensureSession } from '@/features/cloud/sync';
import { curriculum } from '@/features/content/catalog';
import { supabase } from '@/lib/supabase';

/** Unidades con sus generadores (para clasificar fotos y abrir "ejercicios parecidos"). */
export const UNIT_GENERATORS: UnitGenerators[] = curriculum.axes.flatMap((a) =>
  a.units.map((u) => ({ id: u.id, name: u.name, generators: u.generators ?? [] })),
);
const TOPICS = topicList(UNIT_GENERATORS, Object.fromEntries(Object.values(GENERATORS).map((g) => [g.id, g.title])));

export type EquisError = 'offline' | 'limit' | 'budget' | 'unavailable' | 'error';
export type EquisResult<T> = { ok: true; data: T } | { ok: false; error: EquisError };

/** Mensaje amable para cada problema (la app nunca se queda pegada esperando a Equis). */
export const ERROR_TEXT: Record<EquisError, string> = {
  offline: 'Equis necesita internet para esto. Tus lecciones y la práctica siguen funcionando sin red.',
  limit: 'Por hoy Equis ya respondió harto. Mañana seguimos; mientras, las pistas y explicaciones siguen disponibles.',
  budget: 'Equis está descansando un rato. Vuelve a intentarlo más tarde.',
  unavailable: 'Equis todavía no está disponible en esta versión. Muy pronto.',
  error: 'Algo falló al hablar con Equis. Inténtalo de nuevo.',
};

async function call<S extends z.ZodTypeAny>(mode: 'scan' | 'explain' | 'chat', body: object, schema: S): Promise<EquisResult<z.infer<S>>> {
  if (!supabase) return { ok: false, error: 'unavailable' };
  const uid = await ensureSession();
  if (!uid) return { ok: false, error: 'offline' };
  try {
    const { data, error } = await supabase.functions.invoke('equis', { body: { mode, ...body } });
    if (error) {
      const ctx = (error as { context?: Response }).context;
      const status = ctx?.status;
      const code = status === 503 ? ((await ctx?.json().catch(() => null)) as { error?: string } | null)?.error : undefined;
      const kind: EquisError =
        status === 429 ? 'limit' : code === 'not_configured' ? 'unavailable' : status === 503 ? 'budget' : status ? 'error' : 'offline';
      track('equis_error', { mode, kind });
      return { ok: false, error: kind };
    }
    const parsed = schema.safeParse((data as { data?: unknown })?.data);
    if (!parsed.success) return { ok: false, error: 'error' };
    track('equis', { mode });
    return { ok: true, data: parsed.data };
  } catch {
    return { ok: false, error: 'offline' };
  }
}

export const scanImage = (base64: string) => call('scan', { image: base64, topics: TOPICS }, ScanSchema);

export const explain = (input: { statement: string; options?: string[]; solution?: string; studentAnswer?: string; mistake?: string }) =>
  call('explain', input, ExplainSchema);

export type ChatMessage = { role: 'user' | 'equis'; text: string };
export const chat = (messages: ChatMessage[], context?: string) => call('chat', { messages, context }, ChatSchema);
