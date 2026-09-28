import type { StepOf } from '@/content/schema';

import { type Equation, equation, side } from './balance';
import { add, div, eq, mul, neg, parseRational, rat, type Rational } from './rational';

/**
 * Corrección determinista de un paso (R2): la decide el motor, nunca un modelo de IA.
 * Devuelve la explicación específica del error cuando existe ("Casi…").
 */
export type Grade = { correct: boolean; feedback?: string; mistakeCode?: string };

export type Answer =
  | { type: 'choice'; index: number }
  | { type: 'numeric'; text: string }
  | { type: 'order'; order: number[] }
  | { type: 'find-error'; line: number }
  | { type: 'balance'; solved: boolean; oneSideMistakes: number }
  | { type: 'graph'; values: Record<string, Rational> };

/** Convierte un texto racional del contenido. El validador garantiza que siempre es válido. */
export function r(text: string): Rational {
  const v = parseRational(text);
  if (!v) throw new Error(`Número inválido en el contenido: "${text}"`);
  return v;
}

export function gradeChoice(step: StepOf<'choice'>, index: number): Grade {
  if (index === step.answer) return { correct: true };
  return { correct: false, feedback: step.feedback[String(index)], mistakeCode: `choice:${index}` };
}

export function gradeNumeric(step: StepOf<'numeric'>, text: string): Grade {
  const value = parseRational(text);
  if (!value) return {
      correct: false,
      feedback: 'Escribe un número: entero, fracción (3/4) o decimal con coma (0,5).',
      mistakeCode: 'unreadable',
    };
  if (eq(value, r(step.answer))) return { correct: true };
  const known = step.mistakes?.find((m) => eq(r(m.value), value));
  return known
    ? { correct: false, feedback: known.feedback, mistakeCode: `value:${m(known.value)}` }
    : { correct: false, feedback: step.feedback, mistakeCode: 'other' };
}

const m = (s: string) => s.replace(/\s+/g, '');

/** `order` = índices de `items` en el orden en que los dejó el estudiante. */
export function gradeOrder(step: StepOf<'order'>, order: number[]): Grade {
  const ok = order.length === step.items.length && order.every((v, i) => v === i);
  return ok ? { correct: true } : { correct: false, feedback: step.feedback, mistakeCode: 'order' };
}

export function gradeFindError(step: StepOf<'find-error'>, line: number): Grade {
  return line === step.wrong
    ? { correct: true }
    : { correct: false, feedback: step.feedback, mistakeCode: `line:${line}` };
}

export function equationOf(step: StepOf<'balance'>): Equation {
  const [a, b] = step.equation.left;
  const [c, d] = step.equation.right;
  return equation(side(r(a), r(b)), side(r(c), r(d)));
}

/** Evalúa la función del gráfico con los parámetros dados, en aritmética exacta. */
export function evalGraph(family: 'linear' | 'quadratic', p: Record<string, Rational>, x: Rational): Rational {
  const get = (k: string) => p[k] ?? rat(0);
  if (family === 'linear') return add(mul(get('m'), x), get('n'));
  return add(add(mul(get('a'), mul(x, x)), mul(get('b'), x)), get('c'));
}

export function gradeGraph(step: StepOf<'graph'>, values: Record<string, Rational>): Grade {
  const t = step.target;
  let ok = false;
  if (t.kind === 'params') {
    ok = Object.entries(t.values).every(([k, v]) => values[k] !== undefined && eq(values[k]!, r(v)));
  } else if (t.kind === 'points') {
    ok = t.points.every(([x, y]) => eq(evalGraph(step.family, values, r(x)), r(y)));
  } else {
    // Vértice de ax² + bx + c: x = −b / 2a (con a ≠ 0).
    const a = values.a ?? rat(0);
    if (a.n !== 0) {
      const b = values.b ?? rat(0);
      const vx = neg(div(b, mul(rat(2), a)));
      ok = eq(vx, r(t.point[0])) && eq(evalGraph('quadratic', values, vx), r(t.point[1]));
    }
  }
  return ok ? { correct: true } : { correct: false, feedback: step.feedback, mistakeCode: 'graph' };
}

export function gradeBalance(step: StepOf<'balance'>, solved: boolean): Grade {
  return solved
    ? { correct: true }
    : {
        correct: false,
        feedback: 'Casi. Lo que haces en un platillo, hazlo también en el otro, hasta que la x quede sola.',
        mistakeCode: 'balance',
      };
}
