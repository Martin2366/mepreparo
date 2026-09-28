import { MathParseError, parseMath, parseRich } from '../math-parser';

describe('math-parser', () => {
  it('lee fracciones, potencias y raíces', () => {
    expect(parseMath('\\frac{1}{2}')).toEqual([
      {
        type: 'frac',
        num: [{ type: 'sym', value: '1', role: 'ord' }],
        den: [{ type: 'sym', value: '2', role: 'ord' }],
      },
    ]);
    const [sup] = parseMath('x^{2}');
    expect(sup).toEqual({
      type: 'sup',
      base: { type: 'sym', value: 'x', role: 'ord' },
      exp: [{ type: 'sym', value: '2', role: 'ord' }],
    });
    expect(parseMath('x^2')).toEqual(parseMath('x^{2}'));
    expect(parseMath('\\sqrt{9}')[0]).toMatchObject({ type: 'sqrt' });
  });

  it('anida estructuras', () => {
    const [node] = parseMath('\\frac{\\sqrt{x^{2}+1}}{2a}');
    expect(node).toMatchObject({ type: 'frac', num: [{ type: 'sqrt' }] });
  });

  it('asigna roles para el espaciado y usa el signo menos tipográfico', () => {
    const roles = parseMath('2x - 3 \\le 5').map((n) => (n.type === 'sym' ? `${n.value}:${n.role}` : n.type));
    expect(roles).toEqual(['2:ord', 'x:ord', '−:bin', '3:ord', '≤:rel', '5:ord']);
  });

  it.each([
    ['\\alpha', 'no está permitido'],
    ['x_1', 'no está permitido'],
    ['\\frac{1}', 'argumento'],
    ['{x', 'cerrar'],
    ['x}', 'no se abrió'],
    ['^2', 'no tiene base'],
  ])('rechaza "%s"', (src, msg) => {
    expect(() => parseMath(src)).toThrow(MathParseError);
    expect(() => parseMath(src)).toThrow(msg);
  });

  it('la coma entre dígitos es decimal; en una lista es puntuación', () => {
    const dec = parseMath('0,75');
    expect(dec.map((n) => (n.type === 'sym' ? n.role : n.type))).toEqual(['ord', 'ord', 'ord', 'ord']);
    const list = parseMath('(3,-2)');
    expect(list.find((n) => n.type === 'sym' && n.value === ',')).toMatchObject({ role: 'punct' });
  });

  it('separa prosa y matemática, y respeta el signo peso', () => {
    const segs = parseRich('Si $x=2$, cuesta \\$1.500.');
    expect(segs.map((s) => s.kind)).toEqual(['text', 'math', 'text']);
    expect(segs[2]).toEqual({ kind: 'text', value: ', cuesta $1.500.' });
    expect(() => parseRich('abre $x sin cerrar')).toThrow('Falta cerrar');
  });
});
