/**
 * Aritmética racional exacta (ajuste A5): nunca se usa `float` para decidir si algo es correcto.
 * Invariantes: `d > 0`, `gcd(|n|, d) = 1`, ambos enteros seguros. El cero es `0/1`.
 */
export type Rational = { readonly n: number; readonly d: number };

export class RationalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RationalError';
  }
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

function assertSafeInt(x: number, what: string): void {
  if (!Number.isSafeInteger(x)) throw new RationalError(`${what} no es un entero seguro: ${x}`);
}

export function rat(n: number, d = 1): Rational {
  assertSafeInt(n, 'numerador');
  assertSafeInt(d, 'denominador');
  if (d === 0) throw new RationalError('División por cero');
  if (n === 0) return { n: 0, d: 1 };
  const g = gcd(n, d);
  const sign = d < 0 ? -1 : 1;
  return { n: (sign * n) / g, d: (sign * d) / g };
}

export const ZERO = rat(0);
export const ONE = rat(1);

export const add = (a: Rational, b: Rational): Rational => rat(a.n * b.d + b.n * a.d, a.d * b.d);
export const sub = (a: Rational, b: Rational): Rational => rat(a.n * b.d - b.n * a.d, a.d * b.d);
export const mul = (a: Rational, b: Rational): Rational => rat(a.n * b.n, a.d * b.d);
export const neg = (a: Rational): Rational => rat(-a.n, a.d);

export function div(a: Rational, b: Rational): Rational {
  if (b.n === 0) throw new RationalError('División por cero');
  return rat(a.n * b.d, a.d * b.n);
}

export const eq = (a: Rational, b: Rational): boolean => a.n === b.n && a.d === b.d;
export const cmp = (a: Rational, b: Rational): -1 | 0 | 1 => Math.sign(a.n * b.d - b.n * a.d) as -1 | 0 | 1;
export const isZero = (a: Rational): boolean => a.n === 0;
export const isInteger = (a: Rational): boolean => a.d === 1;

/** Solo para dibujar (inclinación de la balanza, posición en un gráfico). Nunca para corregir. */
export const toNumber = (a: Rational): number => a.n / a.d;

export const toString = (a: Rational): string => (a.d === 1 ? `${a.n}` : `${a.n}/${a.d}`);

/**
 * Lee lo que escribe un estudiante: enteros, fracciones ("-3/4") y decimales exactos con punto o coma ("0,25").
 * Devuelve `null` si el texto no es un número racional válido.
 */
export function parseRational(input: string): Rational | null {
  const s = input.trim().replace(/\s+/g, '').replace('−', '-');
  const frac = /^([+-]?\d+)\/([+-]?\d+)$/.exec(s);
  if (frac) {
    const d = Number(frac[2]);
    return d === 0 ? null : rat(Number(frac[1]), d);
  }
  const dec = /^([+-]?)(\d*)(?:[.,](\d+))?$/.exec(s);
  if (!dec || (dec[2] === '' && dec[3] === undefined)) return null;
  const [, sign, int, fracPart = ''] = dec;
  const digits = Number(`${int || '0'}${fracPart}`);
  if (!Number.isSafeInteger(digits)) return null;
  return rat(sign === '-' ? -digits : digits, 10 ** fracPart.length);
}
