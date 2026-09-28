import { applyToBoth, applyToOneSide, equation, isEquivalent, isSolved, side, solve, weight } from '../linear';
import { rat } from '../rational';

// 2x + 3 = 7
const e0 = equation(side(2, 3), side(0, 7));

describe('ecuaciones lineales', () => {
  it('resuelve paso a paso aplicando a ambos lados', () => {
    const r1 = applyToBoth(e0, { kind: 'sub', x: rat(0), c: rat(3) });
    expect(r1.ok).toBe(true);
    expect(r1.equation).toEqual(equation(side(2, 0), side(0, 4)));
    expect(isSolved(r1.equation)).toBe(false);

    const r2 = applyToBoth(r1.equation, { kind: 'div', k: rat(2) });
    expect(r2.equation).toEqual(equation(side(1, 0), side(0, 2)));
    expect(isSolved(r2.equation)).toBe(true);
    expect(isEquivalent(e0, r2.equation)).toBe(true);
  });

  it('detecta "aplicar la operación a un solo lado"', () => {
    const r = applyToOneSide(e0, 'left', { kind: 'sub', x: rat(0), c: rat(3) });
    expect(r).toMatchObject({ ok: false, mistake: 'ONE_SIDE_ONLY' });
    expect(isEquivalent(e0, r.equation)).toBe(false);
  });

  it('no permite dividir ni multiplicar por cero', () => {
    expect(applyToBoth(e0, { kind: 'div', k: rat(0) })).toMatchObject({ ok: false, mistake: 'DIV_BY_ZERO' });
    expect(applyToBoth(e0, { kind: 'mul', k: rat(0) })).toMatchObject({ ok: false, mistake: 'MUL_BY_ZERO' });
  });

  it('funciona con fracciones y negativos', () => {
    // -x/2 + 1 = 3  →  x = -4
    expect(solve(equation(side(rat(-1, 2), 1), side(0, 3)))).toEqual({ kind: 'unique', x: rat(-4) });
    // x = 5 escrito al revés también cuenta como despejada
    expect(isSolved(equation(side(0, 5), side(1, 0)))).toBe(true);
  });

  it('reconoce ecuaciones sin solución o con infinitas', () => {
    expect(solve(equation(side(1, 1), side(1, 2)))).toEqual({ kind: 'none' });
    expect(solve(equation(side(2, 2), side(2, 2)))).toEqual({ kind: 'all' });
  });

  it('calcula el peso de cada lado para la inclinación', () => {
    expect(weight(e0.left, rat(2))).toEqual(rat(7));
  });
});
