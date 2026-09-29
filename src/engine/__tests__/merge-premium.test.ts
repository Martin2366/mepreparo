import { mergeExams, mergeIntensives, mergeLesson, mergeOnboarding, mergeProgress, type ProgressDoc } from '../merge';
import { examHtml, richToHtml } from '../print';
import { endOfTrialOffer, latest, passUntil, trialEndsAt, trialNotice } from '../premium';

const base: ProgressDoc = {
  lessons: {},
  unitOutcomes: {},
  skillOutcomes: {},
  xp: 0,
  xpByDay: {},
  dayStats: {},
  activeDays: [],
  reviews: [],
  notebook: {},
  usage: {},
  practiceDifficulty: {},
  lastLessonId: null,
  attempts: 0,
  seeded: false,
  simScores: {},
  counters: { ahas: 0, reviewCorrect: 0 },
  badges: {},
  unseenBadges: [],
  flashBest: 0,
  savedFormulas: [],
};

describe('merge', () => {
  it('lección: completada gana; si no, el paso más avanzado', () => {
    const a = { step: 3, status: 'in-progress' as const, startedAt: '2026-09-28T10:00:00Z' };
    const b = { step: 5, status: 'in-progress' as const, startedAt: '2026-09-27T10:00:00Z' };
    expect(mergeLesson(a, b)).toEqual({ step: 5, status: 'in-progress', startedAt: '2026-09-27T10:00:00Z' });
    const c = { step: 0, status: 'completed' as const, startedAt: '2026-09-29T10:00:00Z', completedAt: '2026-09-29T11:00:00Z' };
    expect(mergeLesson(a, c).status).toBe('completed');
  });

  it('progreso: máximos y uniones, sin duplicar XP, y es idempotente', () => {
    const local: ProgressDoc = {
      ...base,
      xp: 120,
      xpByDay: { '2026-09-28': 50 },
      activeDays: ['2026-09-28'],
      badges: { racha3: '2026-09-28' },
      unseenBadges: ['racha3'],
      savedFormulas: ['f1'],
      usage: { practice: { '2026-09-28': 4 } },
      simScores: { nem: 700 },
    };
    const remote: ProgressDoc = {
      ...base,
      xp: 300,
      xpByDay: { '2026-09-27': 80, '2026-09-28': 30 },
      activeDays: ['2026-09-27'],
      badges: { racha3: '2026-09-27', ensayo: '2026-09-27' },
      unseenBadges: ['ensayo'],
      savedFormulas: ['f2'],
      usage: { practice: { '2026-09-28': 9 } },
      simScores: { nem: 650, ranking: 800 },
      lessons: { l1: { step: 0, status: 'completed', startedAt: 'x', completedAt: 'y' } },
    };
    const m = mergeProgress(local, remote);
    expect(m.xp).toBe(300);
    expect(m.xpByDay).toEqual({ '2026-09-27': 80, '2026-09-28': 50 });
    expect(m.activeDays).toEqual(['2026-09-27', '2026-09-28']);
    expect(m.badges).toEqual({ racha3: '2026-09-27', ensayo: '2026-09-27' });
    expect(m.unseenBadges).toEqual(['racha3']);
    expect(m.savedFormulas.sort()).toEqual(['f1', 'f2']);
    expect(m.usage.practice?.['2026-09-28']).toBe(9);
    expect(m.simScores).toEqual({ nem: 700, ranking: 800 });
    expect(m.lessons.l1?.status).toBe('completed');
    expect(mergeProgress(m, remote)).toEqual(m);
  });

  it('progreso: sin respaldo, queda igual', () => {
    expect(mergeProgress(base, null)).toBe(base);
  });

  it('ensayos: unión del historial por id y el ensayo en curso local', () => {
    const h = (id: string, finishedAt: string) => ({ id, finishedAt });
    const local: { active: { id: string } | null; activeIntensive: null; history: { id: string; finishedAt: string }[] } = { active: null, activeIntensive: null, history: [h('a', '2026-09-28')] };
    const remote = { active: { id: 'b' }, activeIntensive: null, history: [h('a', '2026-09-28'), h('c', '2026-09-29')] };
    const m = mergeExams(local, remote);
    expect(m.history.map((x) => x.id)).toEqual(['c', 'a']);
    expect(m.active).toEqual({ id: 'b' });
    // Si el ensayo en curso de la nube ya está terminado, no se retoma.
    expect(mergeExams(local, { ...remote, active: { id: 'a' } }).active).toBeNull();
  });

  it('intensivos: terminado en otro teléfono deja de estar activo', () => {
    const run = { id: 'funciones-7', startedOn: '2026-09-20', doneDates: ['2026-09-20'] };
    const done = { ...run, doneDates: ['2026-09-20', '2026-09-21'], exit: { score: 700, examId: 'e' } };
    expect(mergeIntensives({ active: run, finished: [] }, { active: null, finished: [done] })).toEqual({ active: null, finished: [done] });
    const ahead = { ...run, doneDates: ['2026-09-20', '2026-09-21'] };
    expect(mergeIntensives({ active: run, finished: [] }, { active: ahead, finished: [] }).active).toEqual(ahead);
  });

  it('onboarding: el apodo no viene de la nube y la prueba parte en la fecha más antigua', () => {
    const local = { answers: { name: 'Cata', trialStartedAt: '2026-09-29T00:00:00Z' }, step: 'welcome', completed: false };
    const remote = { answers: { name: '', trialStartedAt: '2026-09-20T00:00:00Z' }, step: 'done', completed: true };
    const m = mergeOnboarding(local, remote);
    expect(m.completed).toBe(true);
    expect(m.answers).toEqual({ name: 'Cata', trialStartedAt: '2026-09-20T00:00:00Z' });
  });
});

describe('premium', () => {
  const sessions = [
    { start: '2026-06-01', end: '2026-06-30' },
    { start: '2026-11-30', end: '2026-12-02' },
    { start: null },
  ];

  it('pase: hasta la próxima PAES + 7 días; sin fecha publicada, 1 año', () => {
    expect(passUntil('2026-09-29', sessions)).toBe('2026-12-09');
    expect(passUntil('2026-12-05', sessions)).toBe('2027-12-05');
  });

  it('la prueba termina a la medianoche local del día 8', () => {
    const end = trialEndsAt(new Date(2026, 8, 28, 20, 30).toISOString(), 7);
    expect(end.getTime()).toBe(new Date(2026, 9, 5).getTime());
  });

  it('oferta de 48 h reales desde el fin de la prueba, una sola vez', () => {
    const start = new Date(2026, 8, 28, 20).toISOString();
    const opts = { trialDays: 7, offerHours: 48, used: false };
    expect(endOfTrialOffer(start, new Date(2026, 9, 4, 23), opts)?.active).toBe(false);
    expect(endOfTrialOffer(start, new Date(2026, 9, 5, 1), opts)?.active).toBe(true);
    expect(endOfTrialOffer(start, new Date(2026, 9, 7, 1), opts)?.active).toBe(false);
    expect(endOfTrialOffer(start, new Date(2026, 9, 5, 1), { ...opts, used: true })).toBeNull();
  });

  it('avisos de prueba: día 5, día 7 y fin, una vez cada uno', () => {
    const start = new Date(2026, 8, 28, 9).toISOString();
    expect(trialNotice(start, new Date(2026, 9, 1, 12), 7, {}, false)).toBeNull();
    expect(trialNotice(start, new Date(2026, 9, 3, 12), 7, {}, false)).toBe('day5');
    expect(trialNotice(start, new Date(2026, 9, 4, 12), 7, {}, false)).toBe('day7');
    expect(trialNotice(start, new Date(2026, 9, 4, 12), 7, { day7: true }, false)).toBeNull();
    expect(trialNotice(start, new Date(2026, 9, 6, 12), 7, {}, false)).toBe('ended');
    expect(trialNotice(start, new Date(2026, 9, 6, 12), 7, {}, true)).toBeNull();
  });

  it('vencimiento más tardío entre suscripción y pase', () => {
    expect(latest(null, '2026-12-09', '2026-10-29T15:00:00.000Z')).toBe('2026-12-09');
    expect(latest(null, undefined)).toBeNull();
  });
});

describe('ensayo en PDF', () => {
  it('convierte la notación del contenido a HTML', () => {
    expect(richToHtml('Si $x = \\frac{1}{2}$, cuesta \\$1.500')).toBe(
      'Si <span class="math"><i>x</i><span class="op">=</span><span class="frac"><span class="num">1</span><span class="den">2</span></span></span>, cuesta $1.500',
    );
    expect(richToHtml('$-3 + x^{2}$')).toBe('<span class="math">−3<span class="op">+</span><i>x</i><sup>2</sup></span>');
    expect(richToHtml('<b>')).toBe('&lt;b&gt;');
  });

  it('incluye todas las preguntas y el clavijero', () => {
    const html = examHtml({
      title: 'Ensayo M1',
      minutes: 140,
      generatedOn: '29 de septiembre de 2026',
      questions: [
        { prompt: '¿Cuánto es $2 + 2$?', options: ['3', '4', '5', '6'], answer: 1 },
        { prompt: 'Otra', options: ['a', 'b', 'c', 'd'], answer: 3 },
      ],
    });
    expect(html).toContain('<b>1.</b>B');
    expect(html).toContain('<b>2.</b>D');
    expect(html).toContain('Clavijero');
    expect(html.match(/class="q"/g)).toHaveLength(2);
  });
});
