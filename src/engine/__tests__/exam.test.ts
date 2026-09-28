import curriculum from '@/content/m1/curriculum.json';

import { allocate, buildExam, gradeExam, PRESETS, questionOf, realMinutes } from '../exam';

const bank = curriculum.axes.map((a) => ({ id: a.id, share: a.share, units: a.units.map((u) => ({ id: u.id, generators: u.generators })) }));

describe('ensayos', () => {
  it('reparte las preguntas por eje según su peso y suma exacto', () => {
    const a = allocate(bank, 65);
    expect(Object.values(a).reduce((s, v) => s + v, 0)).toBe(65);
    expect(a.algebra).toBeGreaterThan(a.geometria!);
  });

  it('arma un ensayo completo de 65 preguntas de los 4 ejes, sin enunciados repetidos', () => {
    const qs = buildExam(bank, { ...PRESETS.full, title: 'Ensayo' }, 12345);
    expect(qs).toHaveLength(65);
    expect(new Set(qs.map((q) => q.axisId)).size).toBe(4);
    const prompts = qs.map((q) => questionOf(q)!.step.prompt);
    expect(new Set(prompts).size).toBe(65);
  });

  it('dos intentos distintos no se repiten; la misma semilla sí reproduce el ensayo', () => {
    const a = buildExam(bank, { ...PRESETS.mini, title: 'Mini' }, 1);
    const b = buildExam(bank, { ...PRESETS.mini, title: 'Mini' }, 2);
    expect(a.map((q) => q.ref)).not.toEqual(b.map((q) => q.ref));
    expect(buildExam(bank, { ...PRESETS.mini, title: 'Mini' }, 1)).toEqual(a);
  });

  it('un ensayo temático usa solo las unidades pedidas', () => {
    const qs = buildExam(bank, { ...PRESETS.thematic, title: 'Geometría', unitIds: ['figuras', 'cuerpos'] }, 7);
    expect(qs).toHaveLength(20);
    expect(new Set(qs.map((q) => q.unitId))).toEqual(new Set(['figuras', 'cuerpos']));
  });

  it('corrige y calcula el puntaje con la escala común', () => {
    const qs = buildExam(bank, { ...PRESETS.mini, title: 'Mini' }, 99);
    const perfect = qs.map((q) => questionOf(q)!.step.answer);
    expect(gradeExam(qs, perfect)).toMatchObject({ correct: 15, total: 15, score: 1000 });
    const blank = gradeExam(qs, qs.map(() => null));
    expect(blank).toMatchObject({ correct: 0, score: 100 });
    expect(Object.values(blank.byAxis).reduce((s, v) => s + v.total, 0)).toBe(15);
  });

  it('tiempo real: el ritmo oficial', () => {
    expect(realMinutes(65)).toBe(140);
    expect(realMinutes(15)).toBe(32);
  });
});
