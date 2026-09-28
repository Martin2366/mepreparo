import { add, mul, rat, type Rational, sub } from '../rational';
import { buildChoice, type Difficulty, type Exercise, type Generator, int, m, pick, rngFrom, shuffle, tex } from './core';

const ex = (generator: string, seed: number, difficulty: Difficulty, step: Exercise['step']): Exercise => ({
  ref: `${generator}:${seed}:${difficulty}`,
  generator,
  difficulty,
  step,
});

/** Decimal exacto con coma (5,5 · 2,25) si el denominador solo tiene factores 2 y 5; si no, fracción. */
function dec(r: Rational): string {
  if (r.d === 1) return String(r.n);
  let d = r.d;
  while (d % 2 === 0) d /= 2;
  while (d % 5 === 0) d /= 5;
  return d === 1 ? String(r.n / r.d).replace('.', ',') : tex(r);
}

// ─── Promedio, mediana y moda ──────────────────────────────────────────────

export const centralTendency: Generator = {
  id: 'central-tendency',
  title: 'Promedio, mediana y moda',
  skill: 'representar',
  generate(seed, difficulty) {
    const rng = rngFrom(seed);
    const n = pick(rng, difficulty <= 2 ? [5, 7] : [5, 6, 7, 8]);
    const wantMean = rng() < 0.34;
    // Datos con una moda clara (un valor repetido); si se pregunta el promedio, que sea exacto.
    let data: number[] = [];
    for (let tries = 0; tries < 60; tries++) {
      data = [];
      for (let i = 0; i < n - 1; i++) data.push(int(rng, 1, 9));
      data.push(data[0]!);
      if (!wantMean || data.reduce((s, v) => s + v, 0) % n === 0) break;
    }
    data = shuffle(rng, data);
    const sorted = [...data].sort((a, b) => a - b);
    const counts = new Map<number, number>();
    for (const v of data) counts.set(v, (counts.get(v) ?? 0) + 1);
    const maxCount = Math.max(...counts.values());
    const modes = [...counts.entries()].filter(([, c]) => c === maxCount).map(([v]) => v);
    const mean = rat(data.reduce((s, v) => s + v, 0), n);
    const median = n % 2 === 1 ? rat(sorted[(n - 1) / 2]!) : rat(sorted[n / 2 - 1]! + sorted[n / 2]!, 2);
    const unsortedMid = n % 2 === 1 ? rat(data[(n - 1) / 2]!) : rat(data[n / 2 - 1]! + data[n / 2]!, 2);
    const exactMean = data.reduce((s, v) => s + v, 0) % n === 0;
    const ask = wantMean && exactMean ? 'mean' : pick(rng, modes.length === 1 ? (['median', 'mode'] as const) : (['median'] as const));
    const list = data.join(', ');
    const value = ask === 'mean' ? mean : ask === 'median' ? median : rat(modes[0]!);
    const name = ask === 'mean' ? 'el promedio' : ask === 'median' ? 'la mediana' : 'la moda';

    const step = buildChoice(rng, {
      id: `central-tendency-${seed}`,
      prompt: `Las horas que estudió Sofía en ${n} días fueron: ${list}. ¿Cuál es ${name}?`,
      correct: m(dec(value)),
      wrong: [
        ...(ask !== 'mean' ? [{ text: m(dec(mean)), feedback: 'Casi. Ese es el promedio (suma dividida por la cantidad de datos).' }] : []),
        ...(ask !== 'median' ? [{ text: m(dec(median)), feedback: 'Casi. Ese es el dato central una vez ordenados: la mediana.' }] : []),
        ...(ask !== 'mode' && modes.length === 1 ? [{ text: m(String(modes[0])), feedback: 'Casi. Ese es el dato que más se repite: la moda.' }] : []),
        ...(ask === 'median' ? [{ text: m(dec(unsortedMid)), feedback: 'Casi. Para la mediana primero hay que ordenar los datos.' }] : []),
        ...(ask === 'mean' ? [{ text: m(dec(rat(data.reduce((s, v) => s + v, 0), n - 1))), feedback: `Casi. Se divide por la cantidad de datos, que es ${n}.` }] : []),
      ],
      fallback: [m(dec(add(value, rat(1)))), m(dec(sub(value, rat(1)))), m(dec(add(value, rat(1, 2))))],
      skill: 'representar',
      difficulty,
      hints:
        ask === 'mean'
          ? ['Suma todos los datos y divide por la cantidad de datos.']
          : ask === 'median'
            ? ['Ordena los datos de menor a mayor.', n % 2 === 1 ? 'Toma el del medio.' : 'Con una cantidad par, promedia los dos del medio.']
            : ['La moda es el dato que más se repite.'],
      solution:
        ask === 'mean'
          ? [`Suma: ${data.reduce((s, v) => s + v, 0)}; datos: ${n}.`, `Promedio: $${tex(mean)}$ = ${dec(mean)}`]
          : ask === 'median'
            ? [`Ordenados: ${sorted.join(', ')}`, `Mediana: ${dec(median)}`]
            : [`${modes[0]} aparece ${maxCount} veces.`],
    });
    return ex(this.id, seed, difficulty, step);
  },
};

// ─── Diagrama de cajón ─────────────────────────────────────────────────────

export const boxplotRead: Generator = {
  id: 'boxplot-read',
  title: 'Leer un diagrama de cajón',
  skill: 'representar',
  generate(seed, difficulty) {
    const rng = rngFrom(seed);
    const min = int(rng, 10, 30);
    const q1 = min + int(rng, 3, 12);
    const me = q1 + int(rng, 2, 10);
    const q3 = me + int(rng, 2, 12);
    const max = q3 + int(rng, 3, 15);
    const ask = pick(rng, difficulty <= 2 ? (['iqr', 'range'] as const) : (['iqr', 'range', 'below', 'between'] as const));
    const summary = `mínimo ${min}, primer cuartil ${q1}, mediana ${me}, tercer cuartil ${q3} y máximo ${max}`;
    const q =
      ask === 'iqr'
        ? '¿Cuál es el rango intercuartil?'
        : ask === 'range'
          ? '¿Cuál es el rango de los datos?'
          : ask === 'below'
            ? `¿Qué porcentaje de los datos es menor o igual que ${q1}?`
            : `¿Qué porcentaje de los datos está entre ${q1} y ${q3}?`;
    const correct = ask === 'iqr' ? String(q3 - q1) : ask === 'range' ? String(max - min) : ask === 'below' ? '25 %' : '50 %';
    const wrong =
      ask === 'iqr' || ask === 'range'
        ? [
            { text: String(ask === 'iqr' ? max - min : q3 - q1), feedback: ask === 'iqr' ? 'Casi. Ese es el rango (máximo menos mínimo). El rango intercuartil es $Q_{3}-Q_{1}$.'.replace('Q_{3}-Q_{1}', 'Q3 − Q1') : 'Casi. Ese es el rango intercuartil; el rango es máximo menos mínimo.' },
            { text: String(me), feedback: 'Casi. Ese es la mediana, no una diferencia.' },
            { text: String(ask === 'iqr' ? q3 + q1 : max + min), feedback: 'Casi. El rango es una resta, no una suma.' },
          ]
        : [
            { text: ask === 'below' ? '50 %' : '25 %', feedback: 'Casi. Cada tramo del cajón (entre dos marcas consecutivas) tiene el 25 % de los datos.' },
            { text: '75 %', feedback: 'Casi. Cuenta los tramos: cada uno es un 25 %.' },
            { text: ask === 'below' ? `${q1} %` : '100 %', feedback: 'Casi. Los cuartiles dividen los datos en cuatro partes iguales.' },
          ];
    const step = buildChoice(rng, {
      id: `boxplot-read-${seed}`,
      prompt: `Un diagrama de cajón resume los datos: ${summary}. ${q}`,
      correct,
      wrong,
      fallback: ['10 %', '40 %', '60 %', String(q3 - q1 + 1), String(max - min + 2)],
      skill: 'representar',
      difficulty,
      hints: ['Los cuartiles dividen los datos ordenados en 4 partes con el 25 % cada una.', 'Rango intercuartil = tercer cuartil − primer cuartil.'],
      solution: [ask === 'iqr' ? `${q3} − ${q1} = ${q3 - q1}` : ask === 'range' ? `${max} − ${min} = ${max - min}` : correct],
    });
    return ex(this.id, seed, difficulty, step);
  },
};

// ─── Probabilidad ──────────────────────────────────────────────────────────

const COLORS = [
  ['roja', 'rojas'],
  ['azul', 'azules'],
  ['verde', 'verdes'],
  ['amarilla', 'amarillas'],
] as const;

export const classicProbability: Generator = {
  id: 'classic-probability',
  title: 'Probabilidad clásica',
  skill: 'modelar',
  generate(seed, difficulty) {
    const rng = rngFrom(seed);
    const k = difficulty <= 2 ? 2 : 3;
    const colors = shuffle(rng, COLORS).slice(0, k);
    const counts = colors.map(() => int(rng, 1, 8));
    const total = counts.reduce((s, c) => s + c, 0);
    const i = int(rng, 0, k - 1);
    const complement = difficulty >= 4 && rng() < 0.5;
    const fav = complement ? total - counts[i]! : counts[i]!;
    const p = rat(fav, total);
    const desc = colors.map((c, j) => `${counts[j]} ${counts[j] === 1 ? c[0] : c[1]}`).join(', ').replace(/, ([^,]*)$/, ' y $1');
    // "8 rojas y 1 azul" → "8 bolitas rojas y 1 azul"
    const bag = desc.replace(/^(\d+) /, (_, k: string) => `${k} ${k === '1' ? 'bolita' : 'bolitas'} `);
    const target = complement ? `no sea ${colors[i]![0]}` : `sea ${colors[i]![0]}`;
    const step = buildChoice(rng, {
      id: `classic-probability-${seed}`,
      prompt: `En una bolsa hay ${bag}. Si sacas una al azar, ¿cuál es la probabilidad de que ${target}?`,
      correct: m(tex(p)),
      wrong: [
        { text: m(tex(rat(fav, Math.max(1, total - fav)))), feedback: 'Casi. En el denominador van todos los casos posibles (el total de bolitas), no solo los desfavorables.' },
        { text: m(tex(rat(total - fav, total))), feedback: complement ? 'Casi. Esa es la probabilidad de que sí sea de ese color.' : 'Casi. Esa es la probabilidad de que no sea de ese color.' },
        { text: m(tex(rat(1, k))), feedback: 'Casi. Los colores no son igual de probables: depende de cuántas bolitas hay de cada uno.' },
      ],
      fallback: [rat(fav, total + 1), rat(fav + 1, total), rat(1, total), rat(fav + 2, total + 2), rat(fav, total + 3), rat(fav + 3, total + 1)]
        .filter((r) => r.n > 0 && r.n <= r.d)
        .map((r) => m(tex(r))),
      skill: 'modelar',
      difficulty,
      hints: ['Probabilidad = casos favorables / casos posibles.', `Hay ${total} bolitas en total.`],
      solution: [`$P=\\frac{${fav}}{${total}}${p.d !== total ? `=${tex(p)}` : ''}$`],
    });
    return ex(this.id, seed, difficulty, step);
  },
};

export const diceProbability: Generator = {
  id: 'dice-probability',
  title: 'Probabilidad con dados y monedas',
  skill: 'modelar',
  generate(seed, difficulty) {
    const rng = rngFrom(seed);
    const kind = pick(rng, difficulty <= 2 ? (['oneDie', 'coinDie'] as const) : (['twoDiceSum', 'coinDie', 'twoCoins'] as const));
    let prompt: string;
    let p: Rational;
    let wrong: { text: string; feedback: string }[];
    let hints: string[];
    let solution: string[];
    if (kind === 'oneDie') {
      const cond = pick(rng, ['par', 'mayor que 4', 'múltiplo de 3', 'menor que 3'] as const);
      const fav = cond === 'par' ? 3 : 2;
      p = rat(fav, 6);
      prompt = `Al lanzar un dado común, ¿cuál es la probabilidad de obtener un número ${cond}?`;
      wrong = [
        { text: m(tex(rat(1, 6))), feedback: 'Casi. Hay más de un resultado que cumple la condición: cuéntalos todos.' },
        { text: m(tex(rat(fav, 5))), feedback: 'Casi. Un dado tiene 6 resultados posibles.' },
        { text: m(tex(rat(6 - fav, 6))), feedback: 'Casi. Esa es la probabilidad de que no se cumpla.' },
      ];
      hints = ['Anota los 6 resultados y marca los que cumplen.'];
      solution = [`${fav} de 6 resultados: $\\frac{${fav}}{6}=${tex(p)}$`];
    } else if (kind === 'coinDie') {
      const face = pick(rng, [1, 2, 3, 4, 5, 6]);
      p = rat(1, 12);
      prompt = `Se lanza una moneda y un dado. ¿Cuál es la probabilidad de obtener cara y un ${face}?`;
      wrong = [
        { text: m(tex(add(rat(1, 2), rat(1, 6)))), feedback: 'Casi. Que ocurran los dos a la vez (sucesos independientes) se calcula multiplicando, no sumando.' },
        { text: m(tex(rat(1, 6))), feedback: 'Casi. Esa es solo la probabilidad del dado; falta la moneda.' },
        { text: m(tex(rat(1, 8))), feedback: 'Casi. En total hay $2\\cdot 6=12$ resultados posibles.' },
      ];
      hints = ['Son sucesos independientes: se multiplican sus probabilidades.', '$\\frac{1}{2}\\cdot\\frac{1}{6}$'];
      solution = ['$\\frac{1}{2}\\cdot\\frac{1}{6}=\\frac{1}{12}$'];
    } else if (kind === 'twoCoins') {
      p = rat(1, 2);
      prompt = 'Se lanzan dos monedas. ¿Cuál es la probabilidad de obtener exactamente una cara?';
      wrong = [
        { text: m(tex(rat(1, 3))), feedback: 'Casi. Los resultados posibles son 4 (CC, CS, SC, SS), no 3: "una cara" puede salir de dos formas.' },
        { text: m(tex(rat(1, 4))), feedback: 'Casi. Hay dos resultados con exactamente una cara: CS y SC.' },
        { text: m(tex(rat(3, 4))), feedback: 'Casi. Esa es la probabilidad de al menos una cara.' },
      ];
      hints = ['Anota los 4 resultados posibles.'];
      solution = ['CS y SC: $\\frac{2}{4}=\\frac{1}{2}$'];
    } else {
      const target = int(rng, 3, 11);
      const fav = 6 - Math.abs(7 - target);
      p = rat(fav, 36);
      prompt = `Se lanzan dos dados. ¿Cuál es la probabilidad de que la suma sea ${target}?`;
      wrong = [
        { text: m(tex(rat(1, 11))), feedback: 'Casi. Las 11 sumas posibles no son igual de probables; hay 36 resultados.' },
        { text: m(tex(rat(fav, 12))), feedback: 'Casi. Hay $6\\cdot 6=36$ resultados posibles, no 12.' },
        { text: m(tex(rat(1, 36))), feedback: `Casi. Hay más de una forma de sumar ${target}: cuéntalas todas.` },
      ];
      hints = ['Hay 36 resultados posibles (6 · 6).', `Cuenta los pares que suman ${target}.`];
      solution = [`${fav} pares suman ${target}: $\\frac{${fav}}{36}${tex(p) !== `\\frac{${fav}}{36}` ? `=${tex(p)}` : ''}$`];
    }
    const step = buildChoice(rng, {
      id: `dice-probability-${seed}`,
      prompt,
      correct: m(tex(p)),
      wrong,
      fallback: [m(tex(mul(p, rat(2)))), m(tex(rat(1, 2))), m(tex(rat(5, 6))), m(tex(rat(2, 3)))],
      skill: 'modelar',
      difficulty,
      hints,
      solution,
    });
    return ex(this.id, seed, difficulty, step);
  },
};
