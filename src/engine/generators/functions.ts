import { add, div, rat, type Rational } from '../rational';
import {
  buildChoice,
  type Difficulty,
  type Exercise,
  type Generator,
  int,
  lead,
  m,
  next,
  nonZero,
  poly,
  rngFrom,
  signed,
  tex,
} from './core';

const ex = (generator: string, seed: number, difficulty: Difficulty, step: Exercise['step']): Exercise => ({
  ref: `${generator}:${seed}:${difficulty}`,
  generator,
  difficulty,
  step,
});

const par = (n: number) => (n < 0 ? `(${n})` : String(n));
const affine = (mm: number, n: number) => `f(x)=${mm === 0 ? String(n) : `${lead(mm, 'x')}${next(n)}`}`;
const point = (x: number | Rational, y: number | Rational) =>
  `(${typeof x === 'number' ? x : tex(x)},${typeof y === 'number' ? y : tex(y)})`;

// ─── f(x) = mx + n, evaluar ────────────────────────────────────────────────

export const affineEvaluate: Generator = {
  id: 'affine-evaluate',
  title: 'Evaluar una función afín',
  skill: 'representar',
  generate(seed, difficulty) {
    const rng = rngFrom(seed);
    const mm = signed(rng, int(rng, 2, 9), difficulty);
    const n = difficulty <= 1 ? int(rng, 1, 12) : nonZero(rng, -12, 12);
    const k = signed(rng, int(rng, 1, 6), difficulty, 2);
    const y = mm * k + n;

    const step = buildChoice(rng, {
      id: `affine-evaluate-${seed}`,
      prompt: `Si $${affine(mm, n)}$, ¿cuánto vale $f(${k})$?`,
      correct: m(String(y)),
      wrong: [
        { text: m(String(mm * k)), feedback: `Casi. Te faltó sumar el coeficiente de posición: $${next(n)}$.` },
        { text: m(String(mm + k + n)), feedback: `Casi. $${lead(mm, 'x')}$ significa $${mm}$ por $x$, no $${mm}$ más $x$.` },
        { text: m(String(mm * (k + n))), feedback: `Casi. Primero multiplica $${mm}\\cdot ${par(k)}$ y después suma $${n}$.` },
        { text: m(String(-mm * k + n)), feedback: `Casi. Revisa el signo de $${mm}\\cdot ${par(k)}$.` },
      ],
      fallback: [m(String(y + 1)), m(String(y - 1)), m(String(y + mm))],
      skill: 'representar',
      difficulty,
      hints: [
        `Evaluar es reemplazar: donde dice $x$, escribe $${par(k)}$.`,
        `$f(${k})=${mm}\\cdot ${par(k)}${next(n)}$`,
        'Primero la multiplicación, después la suma.',
      ],
      solution: [`$f(${k})=${mm}\\cdot ${par(k)}${next(n)}$`, `$=${mm * k}${next(n)}=${y}$`],
    });
    return ex(this.id, seed, difficulty, step);
  },
};

// ─── Pendiente entre dos puntos ────────────────────────────────────────────

export const slopeTwoPoints: Generator = {
  id: 'slope-two-points',
  title: 'Pendiente de una recta',
  skill: 'representar',
  generate(seed, difficulty) {
    const rng = rngFrom(seed);
    const x1 = signed(rng, int(rng, 0, 5), difficulty, 2);
    let x2 = signed(rng, int(rng, 1, 8), difficulty, 2);
    if (x2 === x1) x2 = x1 + 2;
    const y1 = signed(rng, int(rng, 0, 6), difficulty, 2);
    let y2 = signed(rng, int(rng, 1, 9), difficulty, 2);
    if (y2 === y1) y2 = y1 + 3;
    // Con dificultad baja, pendiente entera.
    if (difficulty <= 2) y2 = y1 + (x2 - x1) * nonZero(rng, -3, 3);
    const dy = y2 - y1;
    const dx = x2 - x1;
    const slope = div(rat(dy), rat(dx));

    const step = buildChoice(rng, {
      id: `slope-two-points-${seed}`,
      prompt: `¿Cuál es la pendiente de la recta que pasa por los puntos $${point(x1, y1)}$ y $${point(x2, y2)}$?`,
      correct: m(tex(slope)),
      wrong: [
        {
          text: m(tex(div(rat(dx), rat(dy)))),
          feedback: 'Casi. La pendiente es lo que cambia $y$ dividido por lo que cambia $x$, no al revés.',
        },
        {
          text: m(tex(div(rat(-dy), rat(dx)))),
          feedback: 'Casi. Resta en el mismo orden arriba y abajo: segundo punto menos primero en ambos.',
        },
        ...(x1 + x2 !== 0
          ? [
              {
                text: m(tex(div(rat(dy), rat(x1 + x2)))),
                feedback: 'Casi. Abajo va la diferencia de las $x$, no su suma.',
              },
            ]
          : []),
      ],
      fallback: [m(String(dy)), m(String(dx)), ...[1, -1, 2, -2].map((k) => m(tex(add(slope, rat(k)))))],
      skill: 'representar',
      difficulty,
      hints: [
        'La pendiente mide cuánto sube (o baja) la recta por cada paso hacia la derecha.',
        `Cambio en $y$: $${y2}-${par(y1)}=${dy}$. Cambio en $x$: $${x2}-${par(x1)}=${dx}$.`,
        'Divide el cambio en $y$ por el cambio en $x$.',
      ],
      solution: [`$m=\\frac{${y2}-${par(y1)}}{${x2}-${par(x1)}}=\\frac{${dy}}{${dx}}=${tex(slope)}$`],
    });
    return ex(this.id, seed, difficulty, step);
  },
};

// ─── Recta por dos puntos ──────────────────────────────────────────────────

export const affineFromPoints: Generator = {
  id: 'affine-from-points',
  title: 'Función afín desde dos puntos',
  skill: 'modelar',
  generate(seed, difficulty) {
    const rng = rngFrom(seed);
    const mm = signed(rng, int(rng, 1, 5), difficulty, 2);
    let n = nonZero(rng, -8, 8);
    if (n === mm) n += 1;
    const x1 = int(rng, 0, 3);
    const x2 = x1 + int(rng, 1, 3);
    const y1 = mm * x1 + n;
    const y2 = mm * x2 + n;
    const wrongN = y1 + mm * x1; // despejó n con el signo cambiado

    const step = buildChoice(rng, {
      id: `affine-from-points-${seed}`,
      prompt: `Una recta pasa por $${point(x1, y1)}$ y $${point(x2, y2)}$. ¿Cuál es su función?`,
      correct: m(affine(mm, n)),
      wrong: [
        ...(wrongN !== n
          ? [{ text: m(affine(mm, wrongN)), feedback: 'Casi. Para despejar $n$ de $y=mx+n$: $n=y-mx$.' }]
          : []),
        {
          text: m(affine(n, mm)),
          feedback: 'Casi. En $f(x)=mx+n$, $m$ es la pendiente (acompaña a la $x$) y $n$ es el coeficiente de posición.',
        },
        {
          text: m(affine(-mm, n)),
          feedback: 'Casi. Revisa el signo de la pendiente: ¿la recta sube o baja al avanzar hacia la derecha?',
        },
        { text: m(affine(mm, -n)), feedback: 'Casi. Revisa el signo de $n$: reemplaza un punto y comprueba.' },
      ],
      fallback: [m(affine(mm + 1, n)), m(affine(mm, n + 1))],
      skill: 'modelar',
      difficulty,
      hints: [
        'Primero calcula la pendiente con los dos puntos.',
        `$m=\\frac{${y2}-${par(y1)}}{${x2}-${x1}}=${mm}$`,
        `Reemplaza un punto en $y=${lead(mm, 'x')}+n$ y despeja $n$.`,
      ],
      solution: [
        `$m=\\frac{${y2}-${par(y1)}}{${x2}-${x1}}=${mm}$`,
        `$${y1}=${mm}\\cdot ${x1}+n$, entonces $n=${n}$`,
        `$${affine(mm, n)}$`,
      ],
    });
    return ex(this.id, seed, difficulty, step);
  },
};

// ─── f(x) = ax² + bx + c, evaluar ──────────────────────────────────────────

export const quadraticEvaluate: Generator = {
  id: 'quadratic-evaluate',
  title: 'Evaluar una función cuadrática',
  skill: 'representar',
  generate(seed, difficulty) {
    const rng = rngFrom(seed);
    const a = difficulty <= 2 ? 1 : signed(rng, int(rng, 1, 3), difficulty, 4);
    const b = nonZero(rng, -6, 6);
    const c = nonZero(rng, -9, 9);
    const k = difficulty <= 1 ? int(rng, 1, 4) : -int(rng, 1, 4);
    const y = a * k * k + b * k + c;

    const step = buildChoice(rng, {
      id: `quadratic-evaluate-${seed}`,
      prompt: `Si $f(x)=${poly(a, b, c)}$, ¿cuánto vale $f(${k})$?`,
      correct: m(String(y)),
      wrong: [
        ...(k < 0
          ? [
              {
                text: m(String(-a * k * k + b * k + c)),
                feedback: `Casi. $(${k})^{2}=${k * k}$: el cuadrado de un número negativo es positivo.`,
              },
            ]
          : []),
        { text: m(String(a * 2 * k + b * k + c)), feedback: `Casi. $x^{2}$ es $x\\cdot x$, no $2\\cdot x$.` },
        ...(a !== 1
          ? [
              {
                text: m(String(a * a * k * k + b * k + c)),
                feedback: `Casi. Solo la $x$ está al cuadrado, no el $${a}$.`,
              },
            ]
          : []),
        { text: m(String(a * k * k + b * k - c)), feedback: `Casi. Revisa el signo del término $${next(c)}$.` },
      ],
      fallback: [m(String(y + 1)), m(String(y - 2)), m(String(y + 4))],
      skill: 'representar',
      difficulty,
      hints: [
        `Reemplaza cada $x$ por $${par(k)}$, con paréntesis.`,
        `Empieza por la potencia: $${par(k)}^{2}=${k * k}$.`,
        'Después las multiplicaciones y al final las sumas.',
      ],
      solution: [
        `$f(${k})=${a === 1 ? '' : `${a}\\cdot `}${par(k)}^{2}${next(b)}\\cdot ${par(k)}${next(c)}$`,
        `$=${a * k * k}${next(b * k)}${next(c)}=${y}$`,
      ],
    });
    return ex(this.id, seed, difficulty, step);
  },
};

// ─── Vértice de la parábola ────────────────────────────────────────────────

export const quadraticVertex: Generator = {
  id: 'quadratic-vertex',
  title: 'Vértice de una parábola',
  skill: 'representar',
  generate(seed, difficulty) {
    const rng = rngFrom(seed);
    const a = difficulty <= 2 ? 1 : signed(rng, int(rng, 1, 2), difficulty);
    const h = nonZero(rng, -5, 5);
    const k = int(rng, -9, 9);
    const b = -2 * a * h;
    const c = a * h * h + k;
    const f = (x: number) => a * x * x + b * x + c;
    const twiceH = div(rat(-b), rat(a)); // olvidó el 2 del denominador

    const step = buildChoice(rng, {
      id: `quadratic-vertex-${seed}`,
      prompt: `¿Cuál es el vértice de la parábola $f(x)=${poly(a, b, c)}$?`,
      correct: m(point(h, k)),
      wrong: [
        {
          text: m(point(-h, f(-h))),
          feedback: 'Casi. La coordenada $x$ del vértice es $-\\frac{b}{2a}$: cuidado con el signo.',
        },
        {
          text: m(point(h, c)),
          feedback: 'Casi. La coordenada $y$ del vértice es $f$ evaluada en la $x$ del vértice, no el término $c$.',
        },
        {
          text: m(point(twiceH, rat(f(twiceH.n / twiceH.d)))),
          feedback: 'Casi. Es $-\\frac{b}{2a}$: falta el $2$ en el denominador.',
        },
      ],
      fallback: [m(point(h, k + 1)), m(point(h + 1, k)), m(point(k, h))],
      skill: 'representar',
      difficulty,
      hints: [
        'El vértice es el punto más bajo (o más alto) de la parábola.',
        `Su coordenada $x$ es $-\\frac{b}{2a}=-\\frac{${b}}{2\\cdot ${par(a)}}=${h}$.`,
        `Para la coordenada $y$, calcula $f(${h})$.`,
      ],
      solution: [
        `$x=-\\frac{b}{2a}=-\\frac{${b}}{${2 * a}}=${h}$`,
        `$f(${h})=${k}$`,
        `Vértice: $${point(h, k)}$`,
      ],
    });
    return ex(this.id, seed, difficulty, step);
  },
};
