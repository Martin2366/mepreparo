import { z } from 'zod';

import { parseRich } from './math-parser';

/**
 * Contratos de Equis (IA). Todo lo que llega del modelo se valida aquí antes de mostrarse:
 * si la notación matemática no se puede leer, se muestra como texto plano (nunca rompe la pantalla).
 * La IA no decide si algo es correcto: los ejercicios parecidos salen de los generadores verificados.
 */

export const ScanSchema = z.object({
  exercises: z
    .array(
      z.object({
        statement: z.string().min(1).max(2000),
        options: z.array(z.string().max(300)).max(5).optional().default([]),
        topic: z.string().max(60).nullable().optional().default(null),
        difficulty: z.number().optional().default(2),
      }),
    )
    .max(12),
  note: z.string().max(400).nullable().optional().default(null),
});
export type ScanResult = z.infer<typeof ScanSchema>;
export type ScannedExercise = ScanResult['exercises'][number];

export const ExplainSchema = z.object({
  steps: z
    .array(z.object({ text: z.string().max(600), math: z.string().max(400).nullable().optional().default(null) }))
    .min(1)
    .max(8),
  question: z.string().max(400).optional().default(''),
});
export type Explanation = z.infer<typeof ExplainSchema>;

export const ChatSchema = z.object({ reply: z.string().min(1).max(1500) });

/** Texto del modelo seguro para `MathText`: si su notación no se puede leer, se quita el marcado `$`. */
export function safeRich(src: string): string {
  try {
    parseRich(src);
    return src;
  } catch {
    return src.replace(/\\\$/g, '§PESO§').replace(/\$/g, '').replace(/§PESO§/g, '\\$');
  }
}

export type UnitGenerators = { id: string; name: string; generators: readonly string[] };

/** Unidad a la que pertenece un generador (para abrir la práctica con los "ejercicios parecidos"). */
export function unitOfGenerator(genId: string, units: readonly UnitGenerators[]): string | null {
  return units.find((u) => u.generators.includes(genId))?.id ?? null;
}

/** Lista cerrada de temas que se envía al modelo para clasificar la foto. */
export function topicList(units: readonly UnitGenerators[], titles: Record<string, string>) {
  return units.flatMap((u) => u.generators.filter((g) => titles[g]).map((g) => ({ id: g, title: `${titles[g]} (${u.name})` })));
}

export const clampDiff = (d: number) => Math.max(1, Math.min(5, Math.round(Number.isFinite(d) ? d : 2)));

/** Región relativa (0–1) de una imagen. */
export type Region = { x: number; y: number; w: number; h: number };

const PAD = 0.04;

/**
 * Pasa el marco (coordenadas de la vista) a la foto. El visor muestra la foto «cubriendo» la pantalla,
 * así que parte de la foto queda fuera: se deshace esa escala y ese desplazamiento.
 */
export function frameToPhoto(frame: Region, view: { w: number; h: number }, photo: { w: number; h: number }): Region {
  const scale = Math.max(view.w / photo.w, view.h / photo.h);
  const offX = (photo.w * scale - view.w) / 2;
  const offY = (photo.h * scale - view.h) / 2;
  const x = ((frame.x - PAD) * view.w + offX) / scale / photo.w;
  const y = ((frame.y - PAD) * view.h + offY) / scale / photo.h;
  const w = ((frame.w + 2 * PAD) * view.w) / scale / photo.w;
  const h = ((frame.h + 2 * PAD) * view.h) / scale / photo.h;
  const cx = Math.max(0, Math.min(1, x));
  const cy = Math.max(0, Math.min(1, y));
  return { x: cx, y: cy, w: Math.min(1 - cx, w), h: Math.min(1 - cy, h) };
}

