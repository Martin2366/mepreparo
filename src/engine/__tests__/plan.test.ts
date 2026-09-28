import { EMPTY_ANSWERS } from '@/features/onboarding/model';

import { dailySession, nextLesson, planSummary, practiceCount } from '../plan';

const ctx = {
  today: new Date(2026, 8, 28),
  sessionStart: '2026-11-30',
  questionFocus: ['Álgebra', 'Números', 'Funciones', 'Geometría'],
  topicLabel: { funciones: 'Funciones', geometria: 'Geometría' },
};

describe('plan', () => {
  it('resume el onboarding: días, semanas, estimado y foco', () => {
    const p = planSummary(
      {
        ...EMPTY_ANSWERS,
        topics: ['geometria'],
        target: 830,
        diag: { qi: 4, answers: [true, true, false, true], done: true, skipped: false },
      },
      ctx,
    );
    expect(p).toMatchObject({ days: 63, weeks: 9, hasDate: true, correct: 3, done: true, target: 830, minutes: 20 });
    expect(p.est).toBe(780); // 420 + 3/4 · 480
    expect(p.focus).toEqual(['Geometría', 'Funciones']);
  });

  it('sugiere la primera lección pendiente de los ejes en foco, sin bloquear el resto', () => {
    const units = [
      { id: 'enteros', axisId: 'numeros', focus: ['Números'], lessonIds: ['n1', 'n2'] },
      { id: 'ecuaciones', axisId: 'algebra', focus: ['Álgebra', 'Funciones'], lessonIds: ['e1', 'e2'] },
    ];
    expect(nextLesson(units, new Set(), ['Funciones'])).toEqual({ unitId: 'ecuaciones', lessonId: 'e1' });
    expect(nextLesson(units, new Set(['e1', 'e2']), ['Funciones'])).toEqual({ unitId: 'enteros', lessonId: 'n1' });
    expect(nextLesson(units, new Set(['e1', 'e2', 'n1', 'n2']), [])).toBeNull();
  });

  it('arma la sesión de hoy según los minutos', () => {
    expect(practiceCount(20)).toBe(8);
    expect(practiceCount(45)).toBe(15);
    expect(
      dailySession({ minutes: 20, next: { unitId: 'u', lessonId: 'l' }, practiceUnitId: null, dueReviews: 9 }),
    ).toEqual([
      { kind: 'lesson', lessonId: 'l', unitId: 'u' },
      { kind: 'practice', unitId: 'u', count: 8 },
      { kind: 'review', count: 5 },
    ]);
  });
});
