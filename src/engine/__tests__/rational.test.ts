import { add, cmp, div, eq, parseRational, rat, RationalError, sub, toString } from '../rational';

describe('rational', () => {
  it('normaliza signo y simplifica', () => {
    expect(rat(2, 4)).toEqual({ n: 1, d: 2 });
    expect(rat(3, -6)).toEqual({ n: -1, d: 2 });
    expect(rat(0, -5)).toEqual({ n: 0, d: 1 });
  });

  it('opera exacto (sin errores de coma flotante)', () => {
    // 0,1 + 0,2 = 0,3 exacto, a diferencia de los float.
    expect(eq(add(rat(1, 10), rat(2, 10)), rat(3, 10))).toBe(true);
    expect(sub(rat(1, 3), rat(1, 2))).toEqual(rat(-1, 6));
    expect(div(rat(-3, 4), rat(3, 8))).toEqual(rat(-2));
  });

  it('rechaza la división por cero', () => {
    expect(() => div(rat(1), rat(0))).toThrow(RationalError);
    expect(() => rat(1, 0)).toThrow(RationalError);
  });

  it('compara fracciones negativas', () => {
    expect(cmp(rat(-1, 2), rat(-1, 3))).toBe(-1);
    expect(cmp(rat(2, 4), rat(1, 2))).toBe(0);
  });

  it('lee respuestas de estudiantes', () => {
    expect(parseRational('-3/4')).toEqual(rat(-3, 4));
    expect(parseRational(' 0,25 ')).toEqual(rat(1, 4));
    expect(parseRational('1.5')).toEqual(rat(3, 2));
    expect(parseRational('−2')).toEqual(rat(-2));
    expect(parseRational('4/-8')).toEqual(rat(-1, 2));
    expect(parseRational('3/0')).toBeNull();
    expect(parseRational('abc')).toBeNull();
    expect(parseRational('')).toBeNull();
    expect(parseRational('.')).toBeNull();
    expect(toString(rat(6, 4))).toBe('3/2');
  });
});
