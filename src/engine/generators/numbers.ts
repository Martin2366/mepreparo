import { add, div, mul, neg, rat, type Rational, sub } from '../rational';
import { buildChoice, type Difficulty, type Exercise, type Generator, int, m, nonZero, pick, rngFrom, signed, tex } from './core';

const ex = (generator: string, seed: number, difficulty: Difficulty, step: Exercise['step']): Exercise => ({
  ref: `${generator}:${seed}:${difficulty}`,
  generator,
  difficulty,
  step,
});

const par = (n: number) => (n < 0 ? `(${n})` : String(n));
const fracTex = (n: number, d: number) => `\\frac{${n}}{${d}}`;

// ─── Operaciones con fracciones ────────────────────────────────────────────

export const fractionOps: Generator = {
  id: 'fraction-ops',
  title: 'Operaciones con fracciones',
  skill: 'resolver',
  generate(seed, difficulty) {
    const rng = rngFrom(seed);
    const op = pick(rng, difficulty <= 2 ? (['+', '-'] as const) : (['+', '-', '·', '÷'] as const));
    const b = int(rng, 2, 9);
    let d = int(rng, 2, 9);
    if (d === b && op !== '·' && op !== '÷') d = b + 1;
    // Fracciones propias o impropias, pero nunca enteras (8/8, 6/3): se ven raras y no enseñan nada.
    let a = signed(rng, int(rng, 1, 8), difficulty, 4);
    if (a % b === 0) a += a > 0 ? 1 : -1;
    let c = int(rng, 1, 8);
    if (c % d === 0) c += 1;
    const A = rat(a, b);
    const C = rat(c, d);
    const result = op === '+' ? add(A, C) : op === '-' ? sub(A, C) : op === '·' ? mul(A, C) : div(A, C);
    const expr = `${fracTex(a, b).replace('\\frac{-', '-\\frac{')}${op === '·' ? '\\cdot ' : op === '÷' ? '\\div ' : op}${fracTex(c, d)}`;

    const wrong =
      op === '+' || op === '-'
        ? [
            {
              text: m(tex(op === '+' ? rat(a + c, b + d) : rat(a - c, b + d))),
              feedback: 'Casi. Los denominadores no se suman: primero lleva ambas fracciones a un denominador común.',
            },
            {
              text: m(tex(op === '+' ? rat(a + c, b * d) : rat(a - c, b * d))),
              feedback: 'Casi. Al amplificar a denominador común, también hay que multiplicar cada numerador.',
            },
            { text: m(tex(neg(result))), feedback: 'Casi. Revisa el signo del resultado.' },
          ]
        : op === '·'
          ? [
              { text: m(tex(rat(a * d, b * c))), feedback: 'Casi. Para multiplicar fracciones se multiplica numerador con numerador y denominador con denominador.' },
              { text: m(tex(rat(a + c, b + d))), feedback: 'Casi. Multiplicar no es sumar: $\\frac{a}{b}\\cdot\\frac{c}{d}=\\frac{a\\cdot c}{b\\cdot d}$.' },
              { text: m(tex(neg(result))), feedback: 'Casi. Revisa el signo del resultado.' },
            ]
          : [
              { text: m(tex(mul(A, C))), feedback: 'Casi. Para dividir, multiplica por la fracción invertida (el recíproco de la segunda).' },
              { text: m(tex(div(C, A))), feedback: 'Casi. Invertiste la primera fracción; se invierte la segunda.' },
              { text: m(tex(neg(result))), feedback: 'Casi. Revisa el signo del resultado.' },
            ];

    const step = buildChoice(rng, {
      id: `fraction-ops-${seed}`,
      prompt: `¿Cuál es el resultado de $${expr}$?`,
      correct: m(tex(result)),
      wrong,
      fallback: [m(tex(add(result, rat(1)))), m(tex(sub(result, rat(1, 2)))), m(tex(mul(result, rat(2))))],
      skill: 'resolver',
      difficulty,
      hints:
        op === '+' || op === '-'
          ? ['Busca un denominador común.', `Un denominador común es $${b * d}$ (o el mínimo común múltiplo de $${b}$ y $${d}$).`, 'Suma o resta los numeradores y simplifica.']
          : op === '·'
            ? ['Multiplica en línea: numeradores entre sí y denominadores entre sí.', 'Simplifica al final.']
            : ['Dividir es multiplicar por el recíproco.', `El recíproco de $${fracTex(c, d)}$ es $${fracTex(d, c)}$.`],
      solution: [`$${expr}=${tex(result)}$`],
    });
    return ex(this.id, seed, difficulty, step);
  },
};

// ─── Prioridad de operaciones con enteros ─────────────────────────────────

export const integerOps: Generator = {
  id: 'integer-ops',
  title: 'Operaciones con números enteros',
  skill: 'resolver',
  generate(seed, difficulty) {
    const rng = rngFrom(seed);
    const a = signed(rng, int(rng, 2, 12), difficulty, 2);
    const b = int(rng, 2, 9);
    const c = nonZero(rng, -6, 6);
    const d = signed(rng, int(rng, 1, 9), difficulty, 2);
    // a + b·c − d
    const correct = a + b * c - d;
    const leftToRight = (a + b) * c - d;
    const signSlip = a + b * c + d;
    const expr = `${a}+${b}\\cdot ${par(c)}-${par(d)}`;

    const step = buildChoice(rng, {
      id: `integer-ops-${seed}`,
      prompt: `Calcula $${expr}$.`,
      correct: m(String(correct)),
      wrong: [
        { text: m(String(leftToRight)), feedback: 'Casi. La multiplicación va antes que la suma: primero $' + `${b}\\cdot ${par(c)}` + '$.' },
        {
          text: m(String(signSlip)),
          feedback: d < 0 ? `Casi. Restar $${par(d)}$ es sumar $${-d}$: revisa ese signo.` : `Casi. El $${d}$ se resta, no se suma.`,
        },
        { text: m(String(a - b * c - d)), feedback: `Casi. $${b}\\cdot ${par(c)}=${b * c}$: revisa el signo del producto.` },
      ],
      fallback: [m(String(correct + 1)), m(String(correct - 2)), m(String(-correct))],
      skill: 'resolver',
      difficulty,
      hints: ['Primero multiplicaciones y divisiones, después sumas y restas.', `$${b}\\cdot ${par(c)}=${b * c}$.`, 'Restar un número negativo es sumar.'],
      solution: [`$${expr}$`, `$=${a}+${par(b * c)}-${par(d)}$`, `$=${correct}$`],
    });
    return ex(this.id, seed, difficulty, step);
  },
};

// ─── Porcentajes ───────────────────────────────────────────────────────────

export const percentOf: Generator = {
  id: 'percent-of',
  title: 'Porcentaje de una cantidad',
  skill: 'resolver',
  generate(seed, difficulty) {
    const rng = rngFrom(seed);
    const p = pick(rng, difficulty <= 2 ? [10, 20, 25, 50, 75] : [5, 12, 15, 30, 35, 40, 60, 65, 80]);
    // N múltiplo de 100/mcd(p, 100): así el resultado siempre es entero.
    const gcd = (x: number, y: number): number => (y === 0 ? x : gcd(y, x % y));
    const unit = 100 / gcd(p, 100);
    const N = unit * int(rng, Math.max(2, Math.ceil(40 / unit)), Math.max(3, Math.floor(1200 / unit)));
    const correct = (p * N) / 100;
    const step = buildChoice(rng, {
      id: `percent-of-${seed}`,
      prompt: `¿Cuánto es el ${p} % de ${N}?`,
      correct: m(String(correct)),
      wrong: [
        { text: m(String(p * N)), feedback: `Casi. El ${p} % es ${p} de cada 100: falta dividir por 100.` },
        { text: m(String(N - correct)), feedback: `Casi. Eso es lo que queda después de quitar el ${p} %; la pregunta es el ${p} % mismo.` },
        { text: m(tex(rat(N, p))), feedback: `Casi. No se divide la cantidad por ${p}: se multiplica por $\\frac{${p}}{100}$.` },
      ],
      fallback: [m(String(correct + 10)), m(String(correct * 2)), m(String(correct + 1))],
      skill: 'resolver',
      difficulty,
      hints: [`El ${p} % significa $\\frac{${p}}{100}$.`, `Calcula $\\frac{${p}}{100}\\cdot ${N}$.`],
      solution: [`$\\frac{${p}}{100}\\cdot ${N}=${correct}$`],
    });
    return ex(this.id, seed, difficulty, step);
  },
};

export const percentChange: Generator = {
  id: 'percent-change',
  title: 'Descuentos y aumentos',
  skill: 'modelar',
  generate(seed, difficulty) {
    const rng = rngFrom(seed);
    const up = difficulty >= 3 && rng() < 0.4;
    const p = pick(rng, [10, 15, 20, 25, 30, 40]);
    const price = int(rng, 4, 60) * 1000;
    const delta = (price * p) / 100;
    const final = up ? price + delta : price - delta;
    const what = up ? `sube un ${p} %` : `tiene un ${p} % de descuento`;
    const fmt = (n: number) => `\\$${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;

    const step = buildChoice(rng, {
      id: `percent-change-${seed}`,
      prompt: `Un producto cuesta ${fmt(price)} y ${what}. ¿Cuál es su nuevo precio?`,
      correct: fmt(final),
      wrong: [
        { text: fmt(delta), feedback: `Casi. ${fmt(delta)} es ${up ? 'el aumento' : 'el descuento'}; falta ${up ? 'sumarlo al' : 'restarlo del'} precio original.` },
        { text: fmt(up ? price - delta : price + delta), feedback: up ? 'Casi. Es un aumento: se suma al precio.' : 'Casi. Es un descuento: se resta del precio.' },
        { text: fmt(up ? price + p * 10 : price - p * 10), feedback: `Casi. El ${p} % depende del precio: es ${p} de cada 100 pesos, no ${p}0 pesos fijos.` },
      ],
      fallback: [fmt(final + 1000), fmt(final - 500), fmt(Math.round(final * 1.1))],
      skill: 'modelar',
      difficulty,
      hints: [`Calcula primero el ${p} % de ${fmt(price)}.`, `El ${p} % de ${fmt(price)} es ${fmt(delta)}.`, up ? 'Súmalo al precio original.' : 'Réstalo del precio original.'],
      solution: [`${p} % de ${fmt(price)} = ${fmt(delta)}`, `${fmt(price)} ${up ? '+' : '−'} ${fmt(delta)} = ${fmt(final)}`],
    });
    return ex(this.id, seed, difficulty, step);
  },
};

export const successivePercent: Generator = {
  id: 'successive-percent',
  title: 'Porcentajes sucesivos',
  skill: 'argumentar',
  generate(seed, difficulty) {
    const rng = rngFrom(seed);
    const a = pick(rng, [10, 20, 25, 30, 50]);
    const b = pick(rng, [10, 20, 25, 30, 50]);
    // (1 + a/100)(1 − b/100) − 1, en porcentaje
    const factor = mul(rat(100 + a, 100), rat(100 - b, 100));
    const net = mul(sub(factor, rat(1)), rat(100));
    // Porcentaje con coma decimal (12,5 %): los factores dan a lo más 2 decimales.
    const pctText = (r: Rational) => String(Math.round((Math.abs(r.n) / r.d) * 100) / 100).replace('.', ',');
    const describe = (r: Rational) => (r.n === 0 ? 'No cambia' : r.n > 0 ? `Sube un ${pctText(r)} %` : `Baja un ${pctText(r)} %`);
    const step = buildChoice(rng, {
      id: `successive-percent-${seed}`,
      prompt: `Un precio sube un ${a} % y después baja un ${b} %. Respecto del precio original, ¿qué pasó?`,
      correct: describe(net),
      wrong: [
        { text: describe(rat(a - b)), feedback: 'Casi. Los porcentajes no se restan directamente: el segundo se calcula sobre el precio ya aumentado.' },
        { text: describe(rat(a + b)), feedback: 'Casi. Una subida y una bajada no se suman; se multiplican sus factores.' },
        { text: describe(neg(net)), feedback: 'Casi. Revisa si el precio final quedó sobre o bajo el original.' },
      ],
      fallback: ['No cambia', 'Sube un 1 %', 'Baja un 1 %'],
      skill: 'argumentar',
      difficulty,
      hints: ['Prueba con un precio de \\$100.', `Sube un ${a} %: queda en \\$${100 + a}. Ahora calcula el ${b} % de eso.`],
      solution: [`Factor total: $\\frac{${100 + a}}{100}\\cdot\\frac{${100 - b}}{100}=${tex(factor)}$`, `Resultado: ${describe(net).toLowerCase()}`],
    });
    return ex(this.id, seed, difficulty, step);
  },
};

// ─── Potencias y raíces ────────────────────────────────────────────────────

export const powerRules: Generator = {
  id: 'power-rules',
  title: 'Propiedades de las potencias',
  skill: 'resolver',
  generate(seed, difficulty) {
    const rng = rngFrom(seed);
    const base = pick(rng, [2, 3, 5, 7, 10]);
    const p = int(rng, 2, 6);
    const q = int(rng, 2, 5);
    const kind = pick(rng, difficulty <= 2 ? (['mul', 'pow'] as const) : (['mul', 'pow', 'div'] as const));
    const expr =
      kind === 'mul' ? `${base}^{${p}}\\cdot ${base}^{${q}}` : kind === 'pow' ? `(${base}^{${p}})^{${q}}` : `\\frac{${base}^{${p + q}}}{${base}^{${q}}}`;
    const exp = kind === 'mul' ? p + q : kind === 'pow' ? p * q : p;
    const alt1 = kind === 'mul' ? p * q : kind === 'pow' ? p + q : (p + q) * q;
    const pw = (e: number, b: number = base) => m(`${b}^{${e}}`);

    const step = buildChoice(rng, {
      id: `power-rules-${seed}`,
      prompt: `¿A qué es igual $${expr}$?`,
      correct: pw(exp),
      wrong: [
        {
          text: pw(alt1),
          feedback:
            kind === 'mul'
              ? 'Casi. Al multiplicar potencias de igual base, los exponentes se suman, no se multiplican.'
              : kind === 'pow'
                ? 'Casi. Una potencia elevada a otra potencia multiplica los exponentes.'
                : 'Casi. Al dividir potencias de igual base, los exponentes se restan.',
        },
        {
          text: pw(exp, kind === 'mul' ? base * base : base * q),
          feedback: 'Casi. La base se mantiene; lo que cambia es el exponente.',
        },
        { text: pw(kind === 'div' ? p + 2 * q : exp + 1), feedback: 'Casi. Revisa la operación entre los exponentes.' },
      ],
      fallback: [pw(exp + 2), pw(Math.max(1, exp - 1)), pw(exp, base + 1)],
      skill: 'resolver',
      difficulty,
      hints: [
        kind === 'mul' ? '$a^{m}\\cdot a^{n}=a^{m+n}$' : kind === 'pow' ? '$(a^{m})^{n}=a^{m\\cdot n}$' : '$\\frac{a^{m}}{a^{n}}=a^{m-n}$',
      ],
      solution: [`$${expr}=${base}^{${exp}}$`],
    });
    return ex(this.id, seed, difficulty, step);
  },
};

export const negativeExponent: Generator = {
  id: 'negative-exponent',
  title: 'Exponentes negativos y cero',
  skill: 'resolver',
  generate(seed, difficulty) {
    const rng = rngFrom(seed);
    const base = pick(rng, [2, 3, 4, 5, 10]);
    const e = int(rng, 1, difficulty <= 2 ? 2 : 3);
    const value = rat(1, base ** e);
    const step = buildChoice(rng, {
      id: `negative-exponent-${seed}`,
      prompt: `¿Cuál es el valor de $${base}^{-${e}}$?`,
      correct: m(tex(value)),
      wrong: [
        { text: m(String(-(base ** e))), feedback: 'Casi. Un exponente negativo no hace negativo el resultado: indica el recíproco.' },
        { text: m(tex(rat(-1, base ** e))), feedback: 'Casi. El recíproco es positivo: $a^{-n}=\\frac{1}{a^{n}}$.' },
        { text: m(tex(rat(1, base * e))), feedback: `Casi. $${base}^{${e}}$ es $${base}$ multiplicado ${e} veces, no $${base}\\cdot ${e}$.` },
      ],
      fallback: [m(String(base ** e)), m('0'), m(tex(rat(1, base ** e + 1)))],
      skill: 'resolver',
      difficulty,
      hints: ['$a^{-n}=\\frac{1}{a^{n}}$', `Calcula $${base}^{${e}}$ y toma su recíproco.`],
      solution: [`$${base}^{-${e}}=\\frac{1}{${base}^{${e}}}=${tex(value)}$`],
    });
    return ex(this.id, seed, difficulty, step);
  },
};

export const simplifyRoot: Generator = {
  id: 'simplify-root',
  title: 'Simplificar raíces',
  skill: 'resolver',
  generate(seed, difficulty) {
    const rng = rngFrom(seed);
    const k = int(rng, 2, difficulty <= 2 ? 5 : 9);
    const r = pick(rng, [2, 3, 5, 6, 7]);
    const n = k * k * r;
    const step = buildChoice(rng, {
      id: `simplify-root-${seed}`,
      prompt: `¿A qué es igual $\\sqrt{${n}}$?`,
      correct: m(`${k}\\sqrt{${r}}`),
      wrong: [
        { text: m(`${k * k}\\sqrt{${r}}`), feedback: `Casi. Sale de la raíz la raíz de $${k * k}$, que es $${k}$.` },
        { text: m(`${r}\\sqrt{${k}}`), feedback: `Casi. Busca el cuadrado perfecto que divide a $${n}$: es $${k * k}$.` },
        { text: m(`${k}\\sqrt{${r * k}}`), feedback: `Casi. Si sacas $${k}$ de la raíz, adentro queda $${n}\\div ${k * k}=${r}$.` },
      ],
      fallback: [m(`${k + 1}\\sqrt{${r}}`), m(`${k}\\sqrt{${r + 1}}`), m(`\\sqrt{${n / k}}`)],
      skill: 'resolver',
      difficulty,
      hints: [`Escribe $${n}$ como un cuadrado perfecto por otro número.`, `$${n}=${k * k}\\cdot ${r}$`, '$\\sqrt{a\\cdot b}=\\sqrt{a}\\cdot\\sqrt{b}$'],
      solution: [`$\\sqrt{${n}}=\\sqrt{${k * k}\\cdot ${r}}=${k}\\sqrt{${r}}$`],
    });
    return ex(this.id, seed, difficulty, step);
  },
};
