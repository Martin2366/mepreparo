import { add, div, eq, isZero, mul, ONE, rat, type Rational, sub } from './rational';

/** Un lado de la balanza: `x·coef + constante`. */
export type Side = { readonly x: Rational; readonly c: Rational };
export type Equation = { readonly left: Side; readonly right: Side };
export type SideName = 'left' | 'right';

/**
 * Operaciones que el estudiante aplica. Restar es sumar un negativo; se guardan separadas
 * para poder explicar el error con las mismas palabras que usó el estudiante.
 */
export type Operation =
  | { readonly kind: 'add' | 'sub'; readonly x: Rational; readonly c: Rational }
  | { readonly kind: 'mul' | 'div'; readonly k: Rational };

export type MistakeCode = 'DIV_BY_ZERO' | 'MUL_BY_ZERO' | 'ONE_SIDE_ONLY';

export type OperationResult =
  | { readonly ok: true; readonly equation: Equation }
  | { readonly ok: false; readonly mistake: MistakeCode; readonly equation: Equation };

export const side = (x: number | Rational, c: number | Rational): Side => ({
  x: typeof x === 'number' ? rat(x) : x,
  c: typeof c === 'number' ? rat(c) : c,
});

export const equation = (left: Side, right: Side): Equation => ({ left, right });

function applyToSide(s: Side, op: Operation): Side {
  switch (op.kind) {
    case 'add':
      return { x: add(s.x, op.x), c: add(s.c, op.c) };
    case 'sub':
      return { x: sub(s.x, op.x), c: sub(s.c, op.c) };
    case 'mul':
      return { x: mul(s.x, op.k), c: mul(s.c, op.k) };
    case 'div':
      return { x: div(s.x, op.k), c: div(s.c, op.k) };
  }
}

/** Aplica la operación a ambos lados. Multiplicar o dividir por 0 se rechaza con su código de error. */
export function applyToBoth(e: Equation, op: Operation): OperationResult {
  if ((op.kind === 'div' || op.kind === 'mul') && isZero(op.k)) {
    return { ok: false, mistake: op.kind === 'div' ? 'DIV_BY_ZERO' : 'MUL_BY_ZERO', equation: e };
  }
  return { ok: true, equation: { left: applyToSide(e.left, op), right: applyToSide(e.right, op) } };
}

/**
 * Aplica la operación a un solo lado: es el error típico "olvidar un lado de la balanza".
 * Devuelve la ecuación resultante (ya no equivalente) para que la balanza se incline.
 */
export function applyToOneSide(e: Equation, which: SideName, op: Operation): OperationResult {
  if ((op.kind === 'div' || op.kind === 'mul') && isZero(op.k)) {
    return { ok: false, mistake: op.kind === 'div' ? 'DIV_BY_ZERO' : 'MUL_BY_ZERO', equation: e };
  }
  const next = { ...e, [which]: applyToSide(e[which], op) };
  return { ok: false, mistake: 'ONE_SIDE_ONLY', equation: next };
}

export type Solution =
  { readonly kind: 'unique'; readonly x: Rational } | { readonly kind: 'none' } | { readonly kind: 'all' };

/** Resuelve `a·x + b = c·x + d` exactamente. */
export function solve(e: Equation): Solution {
  const a = sub(e.left.x, e.right.x);
  const b = sub(e.right.c, e.left.c);
  if (isZero(a)) return isZero(b) ? { kind: 'all' } : { kind: 'none' };
  return { kind: 'unique', x: div(b, a) };
}

/** Peso de un lado si `x` vale `value`; sirve para decidir hacia dónde se inclina la balanza. */
export const weight = (s: Side, value: Rational): Rational => add(mul(s.x, value), s.c);

/** ¿Quedó `x = c` (o `c = x`)? */
export function isSolved(e: Equation): boolean {
  const isolated = (s: Side) => eq(s.x, ONE) && isZero(s.c);
  const constant = (s: Side) => isZero(s.x);
  return (isolated(e.left) && constant(e.right)) || (isolated(e.right) && constant(e.left));
}

/** ¿Las dos ecuaciones tienen exactamente la misma solución? (¿el paso fue legítimo?) */
export function isEquivalent(a: Equation, b: Equation): boolean {
  const sa = solve(a);
  const sb = solve(b);
  if (sa.kind === 'unique' && sb.kind === 'unique') return eq(sa.x, sb.x);
  return sa.kind === sb.kind;
}
