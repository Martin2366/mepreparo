import intensives from '@/content/intensives.json';
import curriculum from '@/content/m1/curriculum.json';

import { nextStep, unitForDay } from '../intensive';

const units = new Set(curriculum.axes.flatMap((a) => a.units.map((u) => u.id)));
const p = intensives.programs[1]!; // funciones-7

describe('intensivos', () => {
  it('todos los programas usan unidades del currículo', () => {
    for (const prog of intensives.programs) for (const u of prog.unitIds) expect(units.has(u)).toBe(true);
  });

  it('entrada → días (uno por fecha) → salida → terminado', () => {
    const st = { id: p.id, startedOn: '2026-09-28', doneDates: [] as string[] };
    expect(nextStep(p, st, '2026-09-28')).toEqual({ kind: 'entry' });
    const withEntry = { ...st, entry: { score: 600, examId: 'e' } };
    expect(nextStep(p, withEntry, '2026-09-28')).toEqual({ kind: 'day', day: 1, unitId: unitForDay(p, 1), count: p.dailyPractice });
    const day1 = { ...withEntry, doneDates: ['2026-09-28'] };
    expect(nextStep(p, day1, '2026-09-28')).toEqual({ kind: 'wait', day: 2 });
    expect(nextStep(p, day1, '2026-09-29')).toMatchObject({ kind: 'day', day: 2 });
    const all = { ...withEntry, doneDates: Array.from({ length: 7 }, (_, i) => `2026-10-0${i + 1}`) };
    expect(nextStep(p, all, '2026-10-09')).toEqual({ kind: 'exit' });
    expect(nextStep(p, { ...all, exit: { score: 700, examId: 'x' } }, '2026-10-09')).toEqual({ kind: 'done' });
  });

  it('las unidades se recorren en ciclo', () => {
    expect(unitForDay(p, 1)).toBe(p.unitIds[0]);
    expect(unitForDay(p, 4)).toBe(p.unitIds[0]);
  });
});
