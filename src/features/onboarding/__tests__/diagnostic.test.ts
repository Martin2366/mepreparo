import diagnostic from '@/content/diagnostic.json';
import { equation, side, solve } from '@/engine/balance';
import { parseRich } from '@/engine/math-parser';
import { add, div, mul, rat, sub } from '@/engine/rational';

import { estimateM1, planFocus, weeksUntil } from '../model';

const Q = Object.fromEntries(diagnostic.questions.map((q) => [q.id, q]));
const correct = (id: string) => Q[id]!.options[Q[id]!.answer];

describe('diagnóstico: las respuestas marcadas son correctas (verificadas con el motor)', () => {
  it('toda la notación es válida y hay 4 alternativas con índice correcto', () => {
    for (const q of diagnostic.questions) {
      expect(() => parseRich(q.q)).not.toThrow();
      q.options.forEach((o) => expect(() => parseRich(o)).not.toThrow());
      expect(q.options).toHaveLength(4);
      expect(q.answer).toBeGreaterThanOrEqual(0);
      expect(q.answer).toBeLessThan(4);
    }
  });

  it('álgebra, números y funciones', () => {
    expect(solve(equation(side(3, -5), side(0, 10)))).toEqual({ kind: 'unique', x: rat(5) });
    expect(correct('d1')).toBe('$5$');
    expect(mul(rat(25, 100), rat(80))).toEqual(rat(20));
    expect(correct('d2')).toBe('$20$');
    // Vértice de x² − 4x + 3: x = −b/2a = 2; f(2) = −1.
    const xv = div(rat(4), rat(2));
    expect(add(sub(mul(xv, xv), mul(rat(4), xv)), rat(3))).toEqual(rat(-1));
    expect(correct('d3')).toBe('$(2,-1)$');
    expect(correct('d6')).toBe('$2^{5}$');
    // Pendiente (5 − 1)/(2 − 0) = 2.
    expect(div(rat(4), rat(2))).toEqual(rat(2));
    expect(correct('d8')).toBe('$2$');
  });

  it('geometría, probabilidad y proporciones', () => {
    expect(6 * 6 + 8 * 8).toBe(10 * 10);
    expect(correct('d4')).toBe('10 cm');
    expect(rat(3, 6)).toEqual(rat(1, 2));
    expect(correct('d5')).toBe('$\\frac{1}{2}$');
    expect(mul(div(rat(6000), rat(4)), rat(6))).toEqual(rat(9000));
    expect(correct('d7')).toBe('\\$9.000');
    expect(div(rat(4 + 6 + 8 + 10), rat(4))).toEqual(rat(7));
    expect(correct('d9')).toBe('$7$');
    expect(correct('d10')).toBe('$9π$');
  });
});

describe('plan', () => {
  it('estima M1 según aciertos y parte en 600 sin diagnóstico', () => {
    expect(estimateM1(0, 10, false)).toBe(600);
    expect(estimateM1(5, 10, true)).toBe(660);
    expect(estimateM1(10, 10, true)).toBe(900);
  });
  it('cuenta semanas y arma el foco sin repetir', () => {
    expect(weeksUntil(63)).toBe(9);
    expect(weeksUntil(undefined)).toBe(30);
    expect(planFocus(['Álgebra'], ['Álgebra', 'Geometría', 'Números', 'Funciones'])).toEqual([
      'Álgebra',
      'Geometría',
      'Números',
    ]);
    expect(planFocus([], [])).toEqual(['Funciones', 'Álgebra']);
  });
});
