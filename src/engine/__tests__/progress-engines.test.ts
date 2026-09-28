import { addDays, dayKey, diffDays, isoWeekKey, weekStart } from '../dates';
import { allowance, consume, planState } from '../entitlements';
import { isMastered, masteryOf, seedFromDiagnostic } from '../mastery';
import { afterReview, dueItems, scheduleNew } from '../review';
import { estimateRange } from '../score';
import { isActiveDay, streakOf } from '../streak';
import { levers, weightedScore } from '../weighted';
import { dailyGoalXp, levelOf, stepXp } from '../xp';

describe('dates', () => {
  it('suma días cruzando meses y años', () => {
    expect(addDays('2026-09-28', 3)).toBe('2026-10-01');
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(diffDays('2026-09-28', '2026-11-30')).toBe(63);
  });
  it('usa la fecha local del teléfono', () => {
    expect(dayKey(new Date(2026, 8, 28, 23, 59))).toBe('2026-09-28');
  });
  it('calcula semanas ISO (lunes a domingo)', () => {
    expect(isoWeekKey('2026-09-28')).toBe('2026-W40'); // lunes
    expect(isoWeekKey('2026-10-04')).toBe('2026-W40'); // domingo
    expect(isoWeekKey('2026-10-05')).toBe('2026-W41');
    expect(isoWeekKey('2027-01-01')).toBe('2026-W53'); // viernes: pertenece a la última semana de 2026
    expect(weekStart('2026-10-01')).toBe('2026-09-28');
  });
});

describe('streak (racha amable)', () => {
  const days = (...k: string[]) => new Set(k);

  it('cuenta días seguidos y no se corta si hoy aún no estudias', () => {
    const s = streakOf(days('2026-09-26', '2026-09-27'), '2026-09-28');
    expect(s).toMatchObject({ current: 2, activeToday: false });
    expect(streakOf(days('2026-09-26', '2026-09-27', '2026-09-28'), '2026-09-28').current).toBe(3);
  });

  it('un día de descanso por semana protege la racha pero no suma', () => {
    // mié 30 activo, jue 1 falta (descanso), vie 2 activo
    const s = streakOf(days('2026-09-30', '2026-10-02'), '2026-10-02');
    expect(s.current).toBe(2);
    expect(s.restDays).toEqual(['2026-10-01']);
    expect(s.restUsedThisWeek).toBe(true);
  });

  it('dos faltas en la misma semana cortan la racha', () => {
    const s = streakOf(days('2026-09-28', '2026-10-01'), '2026-10-03'); // faltó mar 29, mié 30 y vie 2
    expect(s.current).toBe(1);
  });

  it('sin actividad no hay racha', () => {
    expect(streakOf(days(), '2026-09-28')).toMatchObject({ current: 0, restDays: [] });
  });

  it('día activo = 1 lección o 5 pasos correctos', () => {
    expect(isActiveDay(1, 0)).toBe(true);
    expect(isActiveDay(0, 5)).toBe(true);
    expect(isActiveDay(0, 4)).toBe(false);
  });
});

describe('xp y niveles', () => {
  it('suma por paso y nunca castiga el error', () => {
    expect(stepXp('clean')).toBe(10);
    expect(stepXp('hinted')).toBe(5);
    expect(stepXp('wrong')).toBe(0);
  });
  it('niveles con nombre', () => {
    expect(levelOf(0)).toMatchObject({ level: 1, name: 'Primeros pasos' });
    expect(levelOf(1240)).toMatchObject({ level: 4, name: 'Aprendiz de la x', into: 240, toNext: 800 });
    expect(levelOf(999_999).toNext).toBeNull();
  });
  it('meta diaria según los minutos', () => {
    expect(dailyGoalXp(20)).toBe(60);
    expect(dailyGoalXp(undefined)).toBe(60);
    expect(dailyGoalXp(12)).toBe(30);
  });
});

describe('dominio y puntaje estimado', () => {
  it('promedio de los últimos 5, completando con la semilla', () => {
    expect(masteryOf([], 0.5)).toBe(0.5);
    expect(masteryOf(['clean'], 0)).toBeCloseTo(0.2);
    expect(masteryOf(['wrong', 'clean', 'clean', 'hinted', 'clean', 'clean'], 0)).toBeCloseTo(0.92);
    expect(isMastered(['clean', 'clean', 'clean', 'clean', 'hinted'])).toBe(true);
    expect(isMastered(['clean', 'clean', 'clean', 'clean'])).toBe(false);
  });
  it('la semilla del diagnóstico reproduce el estimado del onboarding', () => {
    const seed = seedFromDiagnostic(0, 10, false);
    const r = estimateRange([{ share: 1, mastery: seed }], 0);
    expect(r.point).toBe(600);
    expect(r.low).toBe(540);
    expect(r.high).toBe(660);
    expect(estimateRange([{ share: 1, mastery: 1 }], 0).point).toBe(1000);
  });
  it('el rango se angosta con más evidencia', () => {
    const r = estimateRange([{ share: 0.5, mastery: 0.5 }, { share: 0.5, mastery: 0.5 }], 200);
    expect(r.high - r.low).toBe(40);
  });
});

describe('puntaje ponderado', () => {
  // Ingeniería Comercial U. de Chile (DEMRE 2027)
  const w = { nem: 10, ranking: 20, lectora: 10, m1: 35, m2: 15, historia: 10, ciencias: 10, especial: 0 };
  it('suma ponderaciones y usa la mejor entre Historia y Ciencias', () => {
    const r = weightedScore(w, { nem: 800, ranking: 850, lectora: 700, m1: 650, m2: 500, historia: 600, ciencias: 700 }, true);
    // 80 + 170 + 70 + 227,5 + 75 + 70
    expect(r.total).toBe(692.5);
    expect(r.parts.find((p) => p.key === 'hoc')?.score).toBe(700);
  });
  it('la mejor palanca es M1 (40 puntos = 14 ponderados)', () => {
    expect(levers(w, true)[0]).toEqual({ key: 'm1', label: 'M1', gain: 14 });
  });
});

describe('repaso espaciado', () => {
  it('avanza 1 → 3 → 7 → 14 días y luego se supera', () => {
    let item = scheduleNew('gen:x:1:1', '2026-09-28');
    expect(item.due).toBe('2026-09-29');
    item = afterReview(item, true, '2026-09-29')!;
    expect(item.due).toBe('2026-10-02');
    item = afterReview(item, true, '2026-10-02')!;
    item = afterReview(item, true, '2026-10-09')!;
    expect(item.due).toBe('2026-10-23');
    expect(afterReview(item, true, '2026-10-23')).toBeNull();
  });
  it('un error vuelve a mañana', () => {
    const item = { ref: 'a', stage: 2, due: '2026-10-01', addedOn: '2026-09-20' };
    expect(afterReview(item, false, '2026-10-01')).toMatchObject({ stage: 0, due: '2026-10-02' });
    expect(dueItems([item], '2026-10-01')).toHaveLength(1);
    expect(dueItems([item], '2026-09-30')).toHaveLength(0);
  });
});

describe('plan y límites', () => {
  const trial = { trialStartedAt: new Date(2026, 8, 28, 10).toISOString() };

  it('prueba de 7 días sin cobro: después pasa a gratis', () => {
    expect(planState(trial, '2026-09-28')).toEqual({ kind: 'trial', daysLeft: 7, endsOn: '2026-10-05' });
    expect(planState(trial, '2026-10-02')).toMatchObject({ kind: 'trial', daysLeft: 3 });
    expect(planState(trial, '2026-10-05')).toEqual({ kind: 'free', trialEndedOn: '2026-10-05' });
    expect(planState({}, '2026-10-05')).toEqual({ kind: 'free', trialEndedOn: null });
  });

  it('gratis: 20 ejercicios al día; al día siguiente se recargan', () => {
    const free = planState({}, '2026-10-06');
    let usage = {};
    for (let i = 0; i < 20; i++) usage = consume('practice', usage, '2026-10-06');
    expect(allowance('practice', free, usage, '2026-10-06')).toMatchObject({ ok: false, remaining: 0 });
    expect(allowance('practice', free, usage, '2026-10-07')).toMatchObject({ ok: true, remaining: 20 });
  });

  it('gratis: 1 ensayo completo al mes; ensayos a tu medida no incluidos', () => {
    const free = planState({}, '2026-10-06');
    const usage = consume('fullExam', {}, '2026-10-06');
    expect(allowance('fullExam', free, usage, '2026-10-30').ok).toBe(false);
    expect(allowance('fullExam', free, usage, '2026-11-01').ok).toBe(true);
    expect(allowance('customExam', free, {}, '2026-10-06').ok).toBe(false);
  });

  it('en la prueba no hay límites de práctica', () => {
    expect(allowance('practice', planState(trial, '2026-09-29'), {}, '2026-09-29')).toEqual({ ok: true, unlimited: true });
  });
});
