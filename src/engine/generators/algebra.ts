import { add, div, mul, neg, rat, type Rational, sub } from '../rational';
import {
  buildChoice,
  type Difficulty,
  type Exercise,
  type Generator,
  int,
  lead,
  m,
  money,
  next,
  nonZero,
  pick,
  poly,
  type Rng,
  rngFrom,
  signed,
  nextR,
  tex,
} from './core';

const ex = (generator: string, seed: number, difficulty: Difficulty, step: Exercise['step']): Exercise => ({
  ref: `${generator}:${seed}:${difficulty}`,
  generator,
  difficulty,
  step,
});

/** Respuesta entera o, desde la dificultad 4, a veces fraccionaria. */
function solutionValue(rng: Rng, difficulty: Difficulty, a: number): Rational {
  if (difficulty >= 4 && rng() < 0.5) {
    let n = nonZero(rng, -12, 12);
    if (n % a === 0) n += 1;
    return rat(n, a);
  }
  return rat(signed(rng, int(rng, 1, 9), difficulty));
}

const around = (x: Rational) => [add(x, rat(1)), sub(x, rat(1)), neg(add(x, rat(2)))].map((v) => m(tex(v)));

// ─── ax + b = c ────────────────────────────────────────────────────────────

export const linearEquation: Generator = {
  id: 'linear-equation',
  title: 'Ecuaciones de primer grado',
  skill: 'resolver',
  generate(seed, difficulty) {
    const rng = rngFrom(seed);
    const a = signed(rng, int(rng, 2, difficulty <= 1 ? 5 : 9), difficulty, 4);
    const x = solutionValue(rng, difficulty, a);
    const b = difficulty <= 1 ? int(rng, 1, 15) : nonZero(rng, -15, 15);
    const c = add(mul(rat(a), x), rat(b)); // c = a·x + b
    const eqTex = `${lead(a, 'x')}${next(b)}=${tex(c)}`;

    const signSlip = div(add(c, rat(b)), rat(a)); // pasó b sin cambiar el signo
    const multiplied = mul(sub(c, rat(b)), rat(a)); // multiplicó en vez de dividir
    const subtracted = sub(sub(c, rat(b)), rat(a)); // restó a en vez de dividir

    const step = buildChoice(rng, {
      id: `linear-equation-${seed}`,
      prompt: `Resuelve la ecuación $${eqTex}$. ¿Cuánto vale $x$?`,
      correct: m(tex(x)),
      wrong: [
        {
          text: m(tex(signSlip)),
          feedback: `Casi. Al pasar el $${b}$ al otro lado cambia su signo: si está sumando, pasa restando (y al revés).`,
        },
        {
          text: m(tex(multiplied)),
          feedback: `Casi. El $${a}$ multiplica a la $x$: para dejarla sola, divide ambos lados por $${a}$.`,
        },
        {
          text: m(tex(subtracted)),
          feedback: `Casi. $${lead(a, 'x')}$ significa $${a}$ por $x$: el $${a}$ no se resta, se divide.`,
        },
      ],
      fallback: around(x),
      skill: 'resolver',
      difficulty,
      hints: [
        'Primero deja sola la parte que tiene $x$: ¿qué número la acompaña sumando o restando?',
        `Haz lo mismo a ambos lados: ${b > 0 ? `resta $${b}$` : `suma $${-b}$`} a los dos lados.`,
        `Ahora divide ambos lados por $${a}$.`,
      ],
      solution: [
        `$${eqTex}$`,
        `$${lead(a, 'x')}=${tex(sub(c, rat(b)))}$ (${b > 0 ? 'restamos' : 'sumamos'} $${Math.abs(b)}$ a ambos lados)`,
        `$x=${tex(x)}$ (dividimos ambos lados por $${a}$)`,
      ],
    });
    return ex(this.id, seed, difficulty, step);
  },
};

// ─── ax + b = cx + d ───────────────────────────────────────────────────────

export const linearEquationBothSides: Generator = {
  id: 'linear-equation-both-sides',
  title: 'Ecuaciones con x en ambos lados',
  skill: 'resolver',
  generate(seed, difficulty) {
    const rng = rngFrom(seed);
    const a = signed(rng, int(rng, 2, 9), difficulty, 4);
    let c = signed(rng, int(rng, 1, 7), difficulty);
    if (c === a) c = a - 1 === 0 ? a + 1 : a - 1;
    const k = a - c; // coeficiente final de x
    const x = solutionValue(rng, difficulty, Math.abs(k));
    const b = nonZero(rng, -12, 12);
    const d = add(mul(rat(k), x), rat(b)); // a·x + b = c·x + d  ⇒  d = (a − c)·x + b
    const rightTex = `${lead(a, 'x')}${next(b)}=${lead(c, 'x')}${nextR(d)}`;

    const wrongSum = a + c !== 0 ? div(sub(d, rat(b)), rat(a + c)) : null; // sumó cx en vez de restarlo
    const signB = div(add(d, rat(b)), rat(k)); // pasó b sin cambiar el signo

    const step = buildChoice(rng, {
      id: `linear-equation-both-sides-${seed}`,
      prompt: `Resuelve $${rightTex}$. ¿Cuánto vale $x$?`,
      correct: m(tex(x)),
      wrong: [
        ...(wrongSum
          ? [
              {
                text: m(tex(wrongSum)),
                feedback: `Casi. Para juntar las $x$ a la izquierda, el $${lead(c, 'x')}$ pasa restando: queda $${lead(k, 'x')}$.`,
              },
            ]
          : []),
        {
          text: m(tex(signB)),
          feedback: `Casi. El $${b}$ cambia de signo al pasar al otro lado de la igualdad.`,
        },
        {
          text: m(tex(neg(x))),
          feedback: 'Casi. El número está bien, pero revisa el signo al despejar la $x$.',
        },
      ],
      fallback: around(x),
      skill: 'resolver',
      difficulty,
      hints: [
        'Junta todas las $x$ en un lado y todos los números en el otro.',
        `Resta $${lead(c, 'x')}$ a ambos lados: a la izquierda queda $${lead(k, 'x')}$.`,
        `Después despeja: pasa el $${b}$ y divide por $${k}$.`,
      ],
      solution: [
        `$${rightTex}$`,
        `$${lead(k, 'x')}${next(b)}=${tex(d)}$`,
        `$${lead(k, 'x')}=${tex(sub(d, rat(b)))}$`,
        `$x=${tex(x)}$`,
      ],
    });
    return ex(this.id, seed, difficulty, step);
  },
};

// ─── ax + b < c ────────────────────────────────────────────────────────────

type Rel = '<' | '>' | '\\le' | '\\ge';
const FLIP: Record<Rel, Rel> = { '<': '>', '>': '<', '\\le': '\\ge', '\\ge': '\\le' };

export const linearInequality: Generator = {
  id: 'linear-inequality',
  title: 'Inecuaciones de primer grado',
  skill: 'resolver',
  generate(seed, difficulty) {
    const rng = rngFrom(seed);
    const a = signed(rng, int(rng, 2, 6), difficulty);
    const k = rat(signed(rng, int(rng, 1, 8), difficulty));
    const b = nonZero(rng, -10, 10);
    const c = add(mul(rat(a), k), rat(b));
    const rel = pick<Rel>(rng, ['<', '>', '\\le', '\\ge']);
    const solRel = a < 0 ? FLIP[rel] : rel;
    const k2 = div(add(c, rat(b)), rat(a)); // error de signo al pasar b

    const flipFeedback =
      a < 0
        ? `Casi. Al dividir por un número negativo ($${a}$) la desigualdad se da vuelta.`
        : `Casi. Al dividir por un número positivo ($${a}$) el sentido de la desigualdad se mantiene.`;

    const step = buildChoice(rng, {
      id: `linear-inequality-${seed}`,
      prompt: `¿Cuál es la solución de la inecuación $${lead(a, 'x')}${next(b)}${rel}${tex(c)}$?`,
      correct: m(`x${solRel}${tex(k)}`),
      wrong: [
        { text: m(`x${FLIP[solRel]}${tex(k)}`), feedback: flipFeedback },
        {
          text: m(`x${solRel}${tex(k2)}`),
          feedback: `Casi. El $${b}$ cambia de signo al pasar al otro lado.`,
        },
        {
          text: m(`x${FLIP[solRel]}${tex(k2)}`),
          feedback: `Casi. Revisa dos cosas: el signo del $${b}$ al pasarlo y el sentido de la desigualdad.`,
        },
      ],
      fallback: [m(`x=${tex(k)}`)],
      skill: 'resolver',
      difficulty,
      hints: [
        'Se resuelve igual que una ecuación, con una sola regla extra.',
        'Si multiplicas o divides ambos lados por un número negativo, la desigualdad se da vuelta.',
        `Despeja: pasa el $${b}$ y divide por $${a}$.`,
      ],
      solution: [
        `$${lead(a, 'x')}${next(b)}${rel}${tex(c)}$`,
        `$${lead(a, 'x')}${rel}${tex(sub(c, rat(b)))}$`,
        a < 0 ? `$x${solRel}${tex(k)}$ (dividimos por $${a}$, que es negativo: se da vuelta)` : `$x${solRel}${tex(k)}$`,
      ],
    });
    return ex(this.id, seed, difficulty, step);
  },
};

// ─── (px + q)² ─────────────────────────────────────────────────────────────

export const squareBinomial: Generator = {
  id: 'square-binomial',
  title: 'Cuadrado de binomio',
  skill: 'representar',
  generate(seed, difficulty) {
    const rng = rngFrom(seed);
    const p = difficulty <= 2 ? 1 : int(rng, 1, 3);
    const q = difficulty <= 1 ? int(rng, 1, 9) : nonZero(rng, -9, 9);
    const base = `(${lead(p, 'x')}${next(q)})^{2}`;
    const A = p * p;
    const B = 2 * p * q;
    const C = q * q;

    const step = buildChoice(rng, {
      id: `square-binomial-${seed}`,
      prompt: `¿Cuál es el desarrollo de $${base}$?`,
      correct: m(poly(A, B, C)),
      wrong: [
        {
          text: m(poly(A, 0, C)),
          feedback: `Casi. $${base}$ no es la suma de los cuadrados: falta el doble producto $2\\cdot ${lead(p, 'x')}\\cdot ${q < 0 ? `(${q})` : q}$.`,
        },
        {
          text: m(poly(A, p * q, C)),
          feedback: 'Casi. El término del medio es el doble del producto: $2\\cdot$ primero $\\cdot$ segundo.',
        },
        {
          text: m(poly(A, B, 2 * q)),
          feedback: `Casi. El último término es el cuadrado de $${q}$, no su doble.`,
        },
        {
          text: m(poly(A, B, -C)),
          feedback: `Casi. El cuadrado de un número siempre es positivo: $(${q})^{2}=${C}$.`,
        },
      ],
      fallback: [m(poly(p, B, C)), m(poly(A, -B, C))],
      skill: 'representar',
      difficulty,
      hints: [
        'Piensa en el modelo de área: un cuadrado de lado $' + `${lead(p, 'x')}${next(q)}` + '$ se arma con 4 rectángulos.',
        'Regla: primero al cuadrado, más el doble del primero por el segundo, más el segundo al cuadrado.',
        `El término del medio es $2\\cdot ${lead(p, 'x')}\\cdot ${q < 0 ? `(${q})` : q}=${lead(B, 'x')}$.`,
      ],
      solution: [
        `$${base}=(${lead(p, 'x')})^{2}+2\\cdot ${lead(p, 'x')}\\cdot ${q < 0 ? `(${q})` : q}+(${q})^{2}$`,
        `$=${poly(A, B, C)}$`,
      ],
    });
    return ex(this.id, seed, difficulty, step);
  },
};

// ─── Proporcionalidad ──────────────────────────────────────────────────────

const ITEMS = [
  ['cuaderno', 'cuadernos'],
  ['entrada al cine', 'entradas al cine'],
  ['kilo de pan', 'kilos de pan'],
  ['completo', 'completos'],
  ['lápiz', 'lápices'],
] as const;

export const directProportion: Generator = {
  id: 'direct-proportion',
  title: 'Proporcionalidad directa',
  skill: 'modelar',
  generate(seed, difficulty) {
    const rng = rngFrom(seed);
    const [, plural] = pick(rng, ITEMS);
    const unit = int(rng, 6, 30) * 50;
    const k = int(rng, 2, 6);
    let n = int(rng, 2, difficulty <= 2 ? 10 : 15);
    if (n === k) n += 1;
    const total = unit * k;
    const answer = unit * n;

    const step = buildChoice(rng, {
      id: `direct-proportion-${seed}`,
      prompt: `Si ${k} ${plural} cuestan ${money(total)}, ¿cuánto cuestan ${n} ${plural} al mismo precio?`,
      correct: money(answer),
      wrong: [
        {
          text: money(total * n),
          feedback: `Casi. Primero calcula cuánto cuesta uno: ${money(total)} dividido por ${k}.`,
        },
        ...((total * k) % n === 0
          ? [
              {
                text: money((total * k) / n),
                feedback: 'Casi. Si compras más, pagas más: es proporcionalidad directa, no inversa.',
              },
            ]
          : []),
        {
          text: money(total + (n - k)),
          feedback: 'Casi. En la proporcionalidad directa las cantidades se multiplican por el mismo factor; no se suma la diferencia.',
        },
      ],
      fallback: [money(answer + unit), money(answer - unit), money(unit * (n + k))],
      skill: 'modelar',
      difficulty,
      hints: [
        '¿Cuánto cuesta una unidad?',
        `Una unidad cuesta ${money(total)} $\\div ${k}=$ ${money(unit)}.`,
        `Ahora multiplica ese precio por ${n}.`,
      ],
      solution: [`Precio de uno: ${money(total)} $\\div ${k}=$ ${money(unit)}`, `${n} unidades: ${money(unit)} $\\cdot ${n}=$ ${money(answer)}`],
    });
    return ex(this.id, seed, difficulty, step);
  },
};

export const inverseProportion: Generator = {
  id: 'inverse-proportion',
  title: 'Proporcionalidad inversa',
  skill: 'modelar',
  generate(seed, difficulty) {
    const rng = rngFrom(seed);
    // w·d = w2·h con todo entero: se elige el total primero.
    const total = pick(rng, [12, 18, 24, 30, 36, 48, 60]);
    const divisors = [2, 3, 4, 5, 6, 8, 10, 12].filter((v) => total % v === 0 && total / v >= 2);
    const w = pick(rng, divisors);
    let w2 = pick(rng, divisors);
    if (w2 === w) w2 = divisors.find((v) => v !== w) ?? w + 1;
    const d = total / w;
    const h = total / w2;

    const direct = div(mul(rat(d), rat(w2)), rat(w));
    const step = buildChoice(rng, {
      id: `inverse-proportion-${seed}`,
      prompt: `${w} personas pintan una sala en ${d} horas. Si trabajan al mismo ritmo, ¿cuántas horas demoran ${w2} personas?`,
      correct: m(tex(rat(h))),
      wrong: [
        {
          text: m(tex(direct)),
          feedback: 'Casi. Con más personas se demora menos: es proporcionalidad inversa, no directa.',
        },
        {
          text: m(String(total)),
          feedback: `Casi. $${w}\\cdot ${d}=${total}$ son las horas de trabajo en total; falta repartirlas entre ${w2} personas.`,
        },
        {
          text: m(String(Math.max(1, d + (w - w2)))),
          feedback: 'Casi. No se suma ni se resta la diferencia de personas: el producto personas $\\cdot$ horas se mantiene.',
        },
      ],
      fallback: [m(String(h + 1)), m(String(h + 2)), m(String(Math.max(1, h - 1)))],
      skill: 'modelar',
      difficulty,
      hints: [
        '¿Más personas significa más horas o menos horas?',
        `En la proporcionalidad inversa el producto se mantiene: $${w}\\cdot ${d}=${total}$.`,
        `Reparte ese total entre ${w2}: $${total}\\div ${w2}$.`,
      ],
      solution: [`$${w}\\cdot ${d}=${total}$ horas de trabajo`, `$${total}\\div ${w2}=${h}$ horas`],
    });
    return ex(this.id, seed, difficulty, step);
  },
};

// ─── Sistemas 2×2 ──────────────────────────────────────────────────────────

export const system2x2: Generator = {
  id: 'system-2x2',
  title: 'Sistemas de ecuaciones 2×2',
  skill: 'resolver',
  generate(seed, difficulty) {
    const rng = rngFrom(seed);
    const x = signed(rng, int(rng, 1, 8), difficulty);
    let y = signed(rng, int(rng, 1, 8), difficulty);
    if (y === x) y = x + 1;
    let a1 = 1;
    let b1 = 1;
    let a2 = 1;
    let b2 = -1;
    if (difficulty >= 3) {
      a1 = int(rng, 1, 4);
      b1 = nonZero(rng, -3, 3);
      a2 = int(rng, 1, 4);
      b2 = nonZero(rng, -3, 3);
      if (a1 * b2 - a2 * b1 === 0) b2 = b2 + 1 === 0 ? 2 : b2 + 1;
      if (a1 * b2 - a2 * b1 === 0) a2 += 1;
    }
    const c1 = a1 * x + b1 * y;
    const c2 = a2 * x + b2 * y;
    const e1 = `${lead(a1, 'x')}${next(b1, 'y')}=${c1}`;
    const e2 = `${lead(a2, 'x')}${next(b2, 'y')}=${c2}`;

    const step = buildChoice(rng, {
      id: `system-2x2-${seed}`,
      prompt: `Resuelve el sistema $${e1}$ y $${e2}$. ¿Cuánto vale $x$?`,
      correct: m(String(x)),
      wrong: [
        { text: m(String(y)), feedback: 'Casi. Ese es el valor de $y$; la pregunta es por $x$.' },
        { text: m(String(-x)), feedback: 'Casi. Revisa los signos al sumar o restar las ecuaciones.' },
        { text: m(String(x + y)), feedback: 'Casi. Encontraste $x+y$; falta separar cada incógnita.' },
      ],
      fallback: [m(String(x + 1)), m(String(x - 1)), m(String(x + 2))],
      skill: 'resolver',
      difficulty,
      hints: [
        'Busca eliminar una incógnita: suma o resta las ecuaciones (multiplicándolas antes si hace falta).',
        'O despeja una incógnita en una ecuación y reemplázala en la otra.',
        difficulty >= 3
          ? 'Multiplica una ecuación para que los coeficientes de $y$ queden opuestos, y después súmalas.'
          : 'Si sumas las dos ecuaciones, la $y$ se cancela.',
      ],
      solution: [
        `$${e1}$`,
        `$${e2}$`,
        `Eliminando una incógnita se obtiene $x=${x}$ y, reemplazando, $y=${y}$.`,
        `Comprobación: $${a1}\\cdot ${x < 0 ? `(${x})` : x}${next(b1)}\\cdot ${y < 0 ? `(${y})` : y}=${c1}$`,
      ],
    });
    return ex(this.id, seed, difficulty, step);
  },
};
