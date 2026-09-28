import { parseRich } from '../math-parser';
import { clampDifficulty, fromRef, GENERATORS, nextDifficulty } from '../generators';
import type { Difficulty } from '../generators';
import { gradeChoice } from '../grading';

const SEEDS = 200;
const DIFFICULTIES: Difficulty[] = [1, 2, 3, 4, 5];

/** Todos los textos de un paso (enunciado, alternativas, feedback, pistas, resolución). */
function texts(step: object): string[] {
  const out: string[] = [];
  const walk = (v: unknown) => {
    if (typeof v === 'string') out.push(v);
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  walk(step);
  return out;
}

describe.each(Object.values(GENERATORS))('generador $id', (g) => {
  it(`${SEEDS} semillas × 5 dificultades: una sola correcta, alternativas distintas y notación válida`, () => {
    for (let seed = 1; seed <= SEEDS; seed++) {
      for (const d of DIFFICULTIES) {
        const { step, ref } = g.generate(seed, d);
        expect(step.options).toHaveLength(4);
        expect(new Set(step.options).size).toBe(4);
        expect(step.answer).toBeGreaterThanOrEqual(0);
        expect(gradeChoice(step, step.answer).correct).toBe(true);
        // Cada alternativa incorrecta tiene su explicación "Casi…".
        step.options.forEach((_, i) => {
          if (i === step.answer) return;
          const g2 = gradeChoice(step, i);
          expect(g2.correct).toBe(false);
          expect(g2.feedback).toMatch(/^Casi/);
        });
        for (const t of texts(step)) expect(() => parseRich(t)).not.toThrow();
        expect(ref).toBe(`${g.id}:${seed}:${d}`);
      }
    }
  });

  it('es reproducible desde su referencia', () => {
    const a = g.generate(42, 3);
    expect(fromRef(a.ref)).toEqual(a);
  });
});

describe('dificultad adaptativa', () => {
  it('3 aciertos limpios suben; 2 errores bajan; se mantiene en 1–5', () => {
    expect(nextDifficulty(2, ['clean', 'clean', 'clean'])).toBe(3);
    expect(nextDifficulty(2, ['clean', 'wrong', 'wrong'])).toBe(1);
    expect(nextDifficulty(5, ['clean', 'clean', 'clean'])).toBe(5);
    expect(nextDifficulty(1, ['wrong', 'wrong'])).toBe(1);
    expect(nextDifficulty(3, ['clean', 'hinted', 'clean'])).toBe(3);
    expect(clampDifficulty(9)).toBe(5);
  });
});
