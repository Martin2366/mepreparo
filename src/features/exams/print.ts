import { Alert } from 'react-native';

import { dayKey } from '@/engine/dates';
import { buildExam, type ExamQuestion, type ExamSpec, questionOf } from '@/engine/exam';
import type { PrintQuestion } from '@/engine/print';
import { examHtml } from '@/engine/print';
import { track } from '@/features/cloud/auth';
import { longDate } from '@/lib/format';

import { bank } from './store';

/** Ensayo en PDF con clavijero (Premium): la hoja de impresión de Android permite guardarlo como PDF o imprimirlo. */
export async function printExam(title: string, minutes: number | null, questions: readonly ExamQuestion[]) {
  const items: PrintQuestion[] = questions
    .map((q) => questionOf(q))
    .filter((ex): ex is NonNullable<typeof ex> => !!ex)
    .map((ex) => ({ prompt: ex.step.prompt, options: ex.step.options, answer: ex.step.answer }));
  const html = examHtml({ title, minutes, questions: items, generatedOn: longDate(dayKey(new Date())) });
  try {
    // Carga diferida: el development build anterior no trae el módulo nativo y un import directo rompería la pantalla.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Print = require('expo-print') as typeof import('expo-print');
    await Print.printAsync({ html });
    track('exam_printed', { count: items.length });
  } catch {
    Alert.alert('No se pudo abrir la impresión', 'Si tu app no está actualizada, la impresión llega con la próxima versión. Si no, inténtalo de nuevo.');
  }
}

/** Arma un ensayo nuevo (preguntas que no se repiten) solo para imprimir. */
export function printNewExam(spec: ExamSpec) {
  const seed = Math.floor(Math.random() * 2_000_000_000);
  return printExam(spec.title, spec.minutes, buildExam(bank, spec, seed));
}
