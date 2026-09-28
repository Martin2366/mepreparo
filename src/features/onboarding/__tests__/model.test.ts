import {
  daysUntil,
  EMPTY_ANSWERS,
  groupsFor,
  matches,
  progressOf,
  recommendedTests,
  visibleSteps,
  type Weights,
  weightSlices,
} from '../model';

const ING: Weights = { nem: 20, ranking: 20, lectora: 10, m1: 20, m2: 15, historia: 0, ciencias: 15, especial: 0 };
const DERECHO: Weights = { nem: 20, ranking: 20, lectora: 25, m1: 10, m2: 0, historia: 25, ciencias: 0, especial: 0 };
const PSICO: Weights = { nem: 20, ranking: 20, lectora: 25, m1: 25, m2: 0, historia: 10, ciencias: 10, especial: 0 };

describe('visibleSteps', () => {
  it('sin carrera se saltan ponderaciones y meta', () => {
    const steps = visibleSteps({ ...EMPTY_ANSWERS, institutionId: null, careerId: null, year: 'later' });
    expect(steps).not.toContain('weights');
    expect(steps).not.toContain('target');
    expect(steps).not.toContain('session');
    expect(steps.at(-1)).toBe('done');
  });

  it('con carrera PAES muestra ponderaciones, sesión y meta', () => {
    const steps = visibleSteps(
      { ...EMPTY_ANSWERS, careerId: '11001', year: 'this' },
      { career: { w: ING }, institutionPaes: true },
    );
    expect(steps).toEqual([
      'welcome',
      'name',
      'institution',
      'career',
      'weights',
      'year',
      'session',
      'target',
      'cheer',
      'tests',
      'topics',
      'blockers',
      'minutes',
      'reminder',
      'diagInvite',
      'diagnostic',
      'generating',
      'plan',
      'premium',
      'done',
    ]);
  });

  it('en una institución sin PAES no pide puntaje meta', () => {
    const steps = visibleSteps(
      { ...EMPTY_ANSWERS, careerId: 'o1-3', year: 'next' },
      { career: {}, institutionPaes: false },
    );
    expect(steps).toContain('weights');
    expect(steps).not.toContain('target');
  });

  it('saltar el diagnóstico quita la pantalla de preguntas', () => {
    const steps = visibleSteps({ ...EMPTY_ANSWERS, diag: { qi: 0, answers: [], done: false, skipped: true } });
    expect(steps).not.toContain('diagnostic');
    expect(steps).toContain('generating');
  });

  it('la barra de progreso avanza de 0 a 1', () => {
    const steps = visibleSteps(EMPTY_ANSWERS);
    expect(progressOf('welcome', steps)).toBe(0);
    expect(progressOf('done', steps)).toBe(1);
    expect(progressOf('name', steps)).toBeGreaterThan(0);
  });
});

describe('recomendaciones', () => {
  it('preselecciona M2 y Ciencias para ingeniería', () => {
    expect(recommendedTests(ING).tests).toEqual(['m1', 'lectora', 'm2', 'ciencias']);
  });
  it('Derecho pide Historia', () => {
    expect(recommendedTests(DERECHO).tests).toEqual(['m1', 'lectora', 'historia']);
  });
  it('Historia "o" Ciencias no preselecciona ninguna y avisa', () => {
    expect(recommendedTests(PSICO, true)).toEqual({ tests: ['m1', 'lectora'], eitherHistoriaOCiencias: true });
  });
  it('sin carrera recomienda solo las obligatorias', () => {
    expect(recommendedTests().tests).toEqual(['m1', 'lectora']);
  });
});

describe('grupos y ponderaciones', () => {
  it('M1 y M2 comparten el grupo de matemática', () => {
    expect(groupsFor(['m1', 'm2', 'historia'])).toEqual(['matematica', 'historia']);
    expect(groupsFor([])).toEqual(['matematica', 'lectora']);
  });

  it('Historia o Ciencias cuenta una sola vez y todo suma 100', () => {
    const slices = weightSlices(PSICO, true);
    expect(slices.find((s) => s.key === 'hoc')?.value).toBe(10);
    expect(slices.reduce((s, x) => s + x.value, 0)).toBe(100);
    expect(weightSlices(ING).reduce((s, x) => s + x.value, 0)).toBe(100);
  });
});

describe('búsqueda', () => {
  it('ignora tildes y mayúsculas, y busca por sigla', () => {
    expect(matches('ingenieria civil', 'Ingeniería Civil Industrial')).toBe(true);
    expect(matches('usach', 'Universidad de Santiago de Chile', 'USACH')).toBe(true);
    expect(matches('conce', 'Universidad de Concepción')).toBe(true);
    expect(matches('medicina', 'Enfermería')).toBe(false);
  });
});

describe('cuenta regresiva', () => {
  it('cuenta días completos en fecha local', () => {
    expect(daysUntil('2026-11-30', new Date(2026, 8, 27))).toBe(64);
    expect(daysUntil('2026-11-30', new Date(2026, 10, 30, 23, 59))).toBe(0);
  });
});
