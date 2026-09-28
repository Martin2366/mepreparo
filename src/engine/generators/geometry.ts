import { div, mul, rat } from '../rational';
import { buildChoice, type Difficulty, type Exercise, type Generator, int, m, pick, rngFrom, signed, tex } from './core';

const ex = (generator: string, seed: number, difficulty: Difficulty, step: Exercise['step']): Exercise => ({
  ref: `${generator}:${seed}:${difficulty}`,
  generator,
  difficulty,
  step,
});

const TRIPLES: [number, number, number][] = [
  [3, 4, 5],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [20, 21, 29],
];

const piTex = (k: number) => (k === 1 ? 'π' : `${k}π`);

// ─── Figuras ───────────────────────────────────────────────────────────────

export const pythagoras: Generator = {
  id: 'pythagoras',
  title: 'Teorema de Pitágoras',
  skill: 'resolver',
  generate(seed, difficulty) {
    const rng = rngFrom(seed);
    const [a0, b0, c0] = pick(rng, difficulty <= 2 ? TRIPLES.slice(0, 2) : TRIPLES);
    const k = int(rng, 1, difficulty <= 2 ? 2 : 4);
    const [a, b, c] = [a0 * k, b0 * k, c0 * k];
    const askLeg = difficulty >= 3 && rng() < 0.5;
    const prompt = askLeg
      ? `En un triángulo rectángulo, la hipotenusa mide ${c} cm y un cateto mide ${a} cm. ¿Cuánto mide el otro cateto?`
      : `Un triángulo rectángulo tiene catetos de ${a} cm y ${b} cm. ¿Cuánto mide la hipotenusa?`;
    const correct = askLeg ? b : c;
    const step = buildChoice(rng, {
      id: `pythagoras-${seed}`,
      prompt,
      correct: `${correct} cm`,
      wrong: askLeg
        ? [
            { text: `${c - a} cm`, feedback: 'Casi. Las medidas no se restan directamente: se restan sus cuadrados, $c^{2}-a^{2}$, y luego se saca raíz.' },
            { text: `${c * c - a * a} cm`, feedback: `Casi. $${c * c - a * a}$ es el cateto al cuadrado; falta sacar la raíz.` },
            { text: `${Math.round(Math.sqrt(c * c + a * a))} cm`, feedback: 'Casi. Para un cateto se resta: $b^{2}=c^{2}-a^{2}$.' },
          ]
        : [
            { text: `${a + b} cm`, feedback: 'Casi. La hipotenusa no es la suma de los catetos: se suman sus cuadrados y se saca raíz.' },
            { text: `${a * a + b * b} cm`, feedback: `Casi. $${a * a + b * b}$ es la hipotenusa al cuadrado; falta sacar la raíz.` },
            { text: `${Math.max(a, b) + 1} cm`, feedback: 'Casi. Usa $a^{2}+b^{2}=c^{2}$ con los dos catetos.' },
          ],
      fallback: [`${correct + 1} cm`, `${correct + 2} cm`, `${Math.max(1, correct - 1)} cm`],
      skill: 'resolver',
      difficulty,
      hints: ['$a^{2}+b^{2}=c^{2}$, donde $c$ es la hipotenusa (el lado opuesto al ángulo recto).', askLeg ? `$b^{2}=${c}^{2}-${a}^{2}$` : `$c^{2}=${a}^{2}+${b}^{2}$`],
      solution: askLeg
        ? [`$b^{2}=${c * c}-${a * a}=${b * b}$`, `$b=\\sqrt{${b * b}}=${b}$`]
        : [`$c^{2}=${a * a}+${b * b}=${c * c}$`, `$c=\\sqrt{${c * c}}=${c}$`],
    });
    return ex(this.id, seed, difficulty, step);
  },
};

export const areaPerimeter: Generator = {
  id: 'area-perimeter',
  title: 'Áreas y perímetros',
  skill: 'resolver',
  generate(seed, difficulty) {
    const rng = rngFrom(seed);
    const shape = pick(rng, difficulty <= 2 ? (['rect', 'triangle'] as const) : (['rect', 'triangle', 'circle', 'circlePerimeter'] as const));
    let prompt: string;
    let correct: string;
    let wrong: { text: string; feedback: string }[];
    let solution: string[];
    let hints: string[];
    let near: string[] = [];
    if (shape === 'rect') {
      const w = int(rng, 3, 15);
      const h = int(rng, 2, 12) + (w === 7 ? 1 : 0);
      const askPerimeter = rng() < 0.5;
      prompt = `Un rectángulo mide ${w} cm de largo y ${h} cm de ancho. ¿Cuál es su ${askPerimeter ? 'perímetro' : 'área'}?`;
      correct = askPerimeter ? `${2 * (w + h)} cm` : `${w * h} cm²`;
      const v = askPerimeter ? 2 * (w + h) : w * h;
      near = [v + 2, v + 4, v - 1].map((n) => `${n} ${askPerimeter ? 'cm' : 'cm²'}`);
      wrong = askPerimeter
        ? [
            { text: `${w * h} cm`, feedback: 'Casi. Ese es el área. El perímetro es el contorno: la suma de los 4 lados.' },
            { text: `${w + h} cm`, feedback: 'Casi. Sumaste solo dos lados; el rectángulo tiene cuatro.' },
            { text: `${2 * w + h} cm`, feedback: 'Casi. Faltó un lado: son dos largos y dos anchos.' },
          ]
        : [
            { text: `${2 * (w + h)} cm²`, feedback: 'Casi. Ese es el perímetro. El área es largo por ancho.' },
            { text: `${w + h} cm²`, feedback: 'Casi. El área se obtiene multiplicando, no sumando.' },
            { text: `${String((w * h) / 2).replace('.', ',')} cm²`, feedback: 'Casi. Dividir por 2 es para el triángulo; el rectángulo es largo por ancho.' },
          ];
      hints = askPerimeter ? ['El perímetro es la suma de todos los lados.'] : ['Área del rectángulo: largo por ancho.'];
      solution = [askPerimeter ? `$2\\cdot(${w}+${h})=${2 * (w + h)}$ cm` : `$${w}\\cdot ${h}=${w * h}$ cm²`];
    } else if (shape === 'triangle') {
      const base = int(rng, 2, 10) * 2;
      const h = int(rng, 3, 12);
      prompt = `Un triángulo tiene base ${base} cm y altura ${h} cm. ¿Cuál es su área?`;
      correct = `${(base * h) / 2} cm²`;
      near = [1, 2, 3].map((d) => `${(base * h) / 2 + d} cm²`);
      wrong = [
        { text: `${base * h} cm²`, feedback: 'Casi. El triángulo es la mitad de un rectángulo: falta dividir por 2.' },
        { text: `${base + h} cm²`, feedback: 'Casi. El área se multiplica: base por altura dividido por 2.' },
        { text: `${(base + h) * 2} cm²`, feedback: 'Casi. Eso se parece a un perímetro; el área es $\\frac{b\\cdot h}{2}$.' },
      ];
      hints = ['Área del triángulo: $\\frac{b\\cdot h}{2}$.'];
      solution = [`$\\frac{${base}\\cdot ${h}}{2}=${(base * h) / 2}$ cm²`];
    } else {
      const r = int(rng, 2, 9);
      if (shape === 'circle') {
        prompt = `¿Cuál es el área de un círculo de radio ${r} cm? (Deja el resultado en función de π.)`;
        correct = m(`${piTex(r * r)}`) + ' cm²';
        near = [1, 2, 3].map((d) => m(piTex(r * r + d)) + ' cm²');
        wrong = [
          { text: m(piTex(2 * r)) + ' cm²', feedback: 'Casi. $2πr$ es el perímetro; el área es $πr^{2}$.' },
          { text: m(piTex(2 * r * r)) + ' cm²', feedback: 'Casi. El área es $πr^{2}$, sin el 2.' },
          { text: m(piTex(r * r * 4)) + ' cm²', feedback: 'Casi. Usaste el diámetro en vez del radio.' },
        ];
        hints = ['Área del círculo: $πr^{2}$.'];
        solution = [`$π\\cdot ${r}^{2}=${piTex(r * r)}$ cm²`];
      } else {
        prompt = `¿Cuál es el perímetro de una circunferencia de radio ${r} cm? (En función de π.)`;
        correct = m(piTex(2 * r)) + ' cm';
        near = [1, 3, 5].map((d) => m(piTex(2 * r + d)) + ' cm');
        wrong = [
          { text: m(piTex(r * r)) + ' cm', feedback: 'Casi. $πr^{2}$ es el área; el perímetro es $2πr$.' },
          { text: m(piTex(r)) + ' cm', feedback: 'Casi. El perímetro es $2πr$: falta el 2.' },
          { text: m(piTex(4 * r)) + ' cm', feedback: 'Casi. Usaste el diámetro en $2πr$; con el diámetro es $πd$.' },
        ];
        hints = ['Perímetro de la circunferencia: $2πr$.'];
        solution = [`$2π\\cdot ${r}=${piTex(2 * r)}$ cm`];
      }
    }
    const step = buildChoice(rng, {
      id: `area-perimeter-${seed}`,
      prompt,
      correct,
      wrong,
      fallback: near,
      skill: 'resolver',
      difficulty,
      hints,
      solution,
    });
    return ex(this.id, seed, difficulty, step);
  },
};

// ─── Cuerpos ───────────────────────────────────────────────────────────────

export const volume: Generator = {
  id: 'volume',
  title: 'Volumen de cuerpos',
  skill: 'modelar',
  generate(seed, difficulty) {
    const rng = rngFrom(seed);
    const kind = pick(rng, difficulty <= 2 ? (['box', 'cube'] as const) : (['box', 'cylinder', 'cone'] as const));
    let prompt: string;
    let correct: string;
    let wrong: { text: string; feedback: string }[];
    let solution: string[];
    let hints: string[];
    let near: string[] = [];
    if (kind === 'box' || kind === 'cube') {
      const a = int(rng, 2, 10);
      const b = kind === 'cube' ? a : int(rng, 2, 8);
      const c = kind === 'cube' ? a : int(rng, 2, 6);
      prompt =
        kind === 'cube'
          ? `¿Cuál es el volumen de un cubo de arista ${a} cm?`
          : `Una caja tiene ${a} cm de largo, ${b} cm de ancho y ${c} cm de alto. ¿Cuál es su volumen?`;
      correct = `${a * b * c} cm³`;
      near = [1, 2, 3].map((d) => `${a * b * c + d * a} cm³`);
      wrong = [
        { text: `${a + b + c} cm³`, feedback: 'Casi. El volumen se obtiene multiplicando las tres medidas, no sumándolas.' },
        { text: `${2 * (a * b + a * c + b * c)} cm³`, feedback: 'Casi. Ese es el área de todas las caras; el volumen es largo · ancho · alto.' },
        { text: `${a * b} cm³`, feedback: 'Casi. Eso es solo el área de la base; falta multiplicar por la altura.' },
      ];
      hints = ['Volumen = área de la base · altura.'];
      solution = [`$${a}\\cdot ${b}\\cdot ${c}=${a * b * c}$ cm³`];
    } else {
      const r = int(rng, 2, 6);
      const h = kind === 'cone' ? int(rng, 1, 4) * 3 : int(rng, 2, 10);
      const base = r * r;
      const vol = kind === 'cone' ? (base * h) / 3 : base * h;
      prompt = `¿Cuál es el volumen de un ${kind === 'cone' ? 'cono' : 'cilindro'} de radio ${r} cm y altura ${h} cm? (En función de π.)`;
      correct = m(piTex(vol)) + ' cm³';
      near = [1, 2, 3].map((d) => m(piTex(vol + d)) + ' cm³');
      wrong =
        kind === 'cone'
          ? [
              { text: m(piTex(base * h)) + ' cm³', feedback: 'Casi. El cono es un tercio del cilindro: $\\frac{πr^{2}h}{3}$.' },
              { text: m(piTex((2 * r * h) / 3)) + ' cm³', feedback: 'Casi. En la base va el área $πr^{2}$, no el perímetro.' },
              { text: m(piTex(vol * 2)) + ' cm³', feedback: 'Casi. Revisa: se divide por 3, no por otro número.' },
            ]
          : [
              { text: m(piTex(2 * r * h)) + ' cm³', feedback: 'Casi. La base es un círculo de área $πr^{2}$, no su perímetro $2πr$.' },
              { text: m(piTex(vol / 1 + base)) + ' cm³', feedback: 'Casi. Volumen = área de la base · altura; no se suma el área de la base.' },
              { text: m(piTex(r * h)) + ' cm³', feedback: 'Casi. El radio va al cuadrado: $πr^{2}h$.' },
            ];
      hints = ['Volumen del cilindro: $πr^{2}h$.', kind === 'cone' ? 'El cono es un tercio del cilindro de igual base y altura.' : 'Primero el área de la base: $πr^{2}$.'];
      solution = [`$${kind === 'cone' ? '\\frac{π\\cdot ' : 'π\\cdot '}${r}^{2}\\cdot ${h}${kind === 'cone' ? '}{3}' : ''}=${piTex(vol)}$ cm³`];
    }
    const step = buildChoice(rng, {
      id: `volume-${seed}`,
      prompt,
      correct,
      wrong,
      fallback: near,
      skill: 'modelar',
      difficulty,
      hints,
      solution,
    });
    return ex(this.id, seed, difficulty, step);
  },
};

// ─── Transformaciones isométricas ──────────────────────────────────────────

export const transformPoint: Generator = {
  id: 'transform-point',
  title: 'Transformaciones de un punto',
  skill: 'representar',
  generate(seed, difficulty) {
    const rng = rngFrom(seed);
    let x = signed(rng, int(rng, 1, 7), difficulty, 1);
    let y = signed(rng, int(rng, 1, 7), difficulty, 1);
    if (Math.abs(x) === Math.abs(y)) y = y > 0 ? y + 1 : y - 1;
    if (x === 0) x = 2;
    const kinds = difficulty <= 2 ? (['reflX', 'reflY', 'trans'] as const) : (['reflX', 'reflY', 'origin', 'trans', 'rot90'] as const);
    const kind = pick(rng, kinds);
    const dx = signed(rng, int(rng, 1, 5), difficulty, 1);
    const dy = signed(rng, int(rng, 1, 5), difficulty, 1);
    const P = (a: number, b: number) => m(`(${a},${b})`);
    const table = {
      reflX: { q: 'reflejarlo respecto del eje $x$', r: [x, -y], hint: 'Al reflejar en el eje $x$, la coordenada $x$ se mantiene y la $y$ cambia de signo.' },
      reflY: { q: 'reflejarlo respecto del eje $y$', r: [-x, y], hint: 'Al reflejar en el eje $y$, la coordenada $y$ se mantiene y la $x$ cambia de signo.' },
      origin: { q: 'aplicarle una simetría respecto del origen', r: [-x, -y], hint: 'La simetría central respecto del origen cambia el signo de ambas coordenadas.' },
      trans: { q: `trasladarlo según el vector $(${dx},${dy})$`, r: [x + dx, y + dy], hint: 'Trasladar es sumar el vector a las coordenadas.' },
      rot90: { q: 'rotarlo en 90° en sentido antihorario con centro en el origen', r: [-y, x], hint: 'Rotar 90° antihorario: $(x,y)$ pasa a $(-y,x)$.' },
    } as const;
    const t = table[kind];
    const [rx, ry] = t.r;
    const step = buildChoice(rng, {
      id: `transform-point-${seed}`,
      prompt: `¿Dónde queda el punto $(${x},${y})$ después de ${t.q}?`,
      correct: P(rx, ry),
      wrong: [
        { text: P(-x, y), feedback: 'Casi. Eso es una reflexión respecto del eje $y$.' },
        { text: P(x, -y), feedback: 'Casi. Eso es una reflexión respecto del eje $x$.' },
        { text: P(y, x), feedback: 'Casi. Intercambiar las coordenadas no es ninguna de estas transformaciones.' },
        { text: P(-x, -y), feedback: 'Casi. Eso es una simetría respecto del origen.' },
        { text: P(x - dx, y - dy), feedback: 'Casi. En una traslación el vector se suma, no se resta.' },
        { text: P(y, -x), feedback: 'Casi. Eso es una rotación de 90° en sentido horario.' },
      ],
      fallback: [P(rx + 1, ry), P(rx, ry + 1), P(rx - 1, ry - 1)],
      skill: 'representar',
      difficulty,
      hints: [t.hint, 'Dibuja el punto en el plano y aplica el movimiento.'],
      solution: [`$(${x},${y})$ → $(${rx},${ry})$`],
    });
    return ex(this.id, seed, difficulty, step);
  },
};

// ─── Semejanza ─────────────────────────────────────────────────────────────

export const similarity: Generator = {
  id: 'similarity',
  title: 'Semejanza y proporcionalidad',
  skill: 'resolver',
  generate(seed, difficulty) {
    const rng = rngFrom(seed);
    const kind = pick(rng, difficulty <= 2 ? (['triangle', 'scale'] as const) : (['triangle', 'scale', 'shadow'] as const));
    if (kind === 'scale') {
      const scale = pick(rng, [100, 200, 500, 1000, 50000]);
      const cm = int(rng, 2, 12);
      const real = cm * scale; // en cm
      const dec = (n: number) => String(n).replace(".", ",");
      const fmtLen = (c: number) => (c >= 100000 ? `${dec(c / 100000)} km` : c >= 100 ? `${dec(c / 100)} m` : `${c} cm`);
      const step = buildChoice(rng, {
        id: `similarity-${seed}`,
        prompt: `En un plano a escala 1:${scale}, una pared mide ${cm} cm. ¿Cuánto mide en la realidad?`,
        correct: fmtLen(real),
        wrong: [
          { text: fmtLen(real * 10), feedback: 'Casi. Revisa la conversión de unidades: 100 cm = 1 m y 1000 m = 1 km.' },
          { text: fmtLen(cm + scale), feedback: 'Casi. La escala multiplica: 1 cm del plano son ' + `${scale}` + ' cm reales.' },
          { text: fmtLen(Math.max(1, Math.round(real / 100))), feedback: 'Casi. Convertiste dos veces; revisa las unidades.' },
        ],
        fallback: [fmtLen(real * 2), fmtLen(real + 100), fmtLen(real * 100)],
        skill: 'modelar',
        difficulty,
        hints: [`1:${scale} significa que 1 cm del plano son ${scale} cm reales.`, `Multiplica: $${cm}\\cdot ${scale}$ cm y luego convierte la unidad.`],
        solution: [`$${cm}\\cdot ${scale}=${real}$ cm $=$ ${fmtLen(real)}`],
      });
      return ex(this.id, seed, difficulty, step);
    }
    // Lados homólogos: a/a' = b/b'  →  b' = b·a'/a
    const a = int(rng, 2, 8);
    const k = pick(rng, difficulty <= 2 ? [2, 3] : [2, 3, 4, 5]);
    const b = int(rng, 3, 12);
    const aa = a * k;
    const bb = b * k;
    const prompt =
      kind === 'shadow'
        ? `Un poste de ${b} m proyecta una sombra de ${a} m. A la misma hora, un edificio proyecta una sombra de ${aa} m. ¿Cuánto mide el edificio?`
        : `Dos triángulos son semejantes. En el pequeño, dos lados homólogos miden ${a} cm y ${b} cm; en el grande, el lado homólogo al de ${a} cm mide ${aa} cm. ¿Cuánto mide el lado homólogo al de ${b} cm?`;
    const unit = kind === 'shadow' ? 'm' : 'cm';
    const step = buildChoice(rng, {
      id: `similarity-${seed}`,
      prompt,
      correct: `${bb} ${unit}`,
      wrong: [
        { text: `${b + (aa - a)} ${unit}`, feedback: 'Casi. En la semejanza las medidas se multiplican por la misma razón; no se suma la diferencia.' },
        { text: `${tex(div(mul(rat(b), rat(a)), rat(aa)))} ${unit}`.replace(/\\frac\{(\d+)\}\{(\d+)\}/, '$1/$2'), feedback: 'Casi. Planteaste la proporción al revés: el lado grande debe salir más grande.' },
        { text: `${aa * b} ${unit}`, feedback: `Casi. La razón de semejanza es $\\frac{${aa}}{${a}}=${k}$; se multiplica ${b} por ${k}.` },
      ],
      fallback: [`${bb + 1} ${unit}`, `${bb - 1} ${unit}`, `${bb + k} ${unit}`],
      skill: 'resolver',
      difficulty,
      hints: ['Plantea una proporción entre medidas homólogas.', `La razón es $\\frac{${aa}}{${a}}=${k}$.`],
      solution: [`$\\frac{x}{${b}}=\\frac{${aa}}{${a}}$`, `$x=${b}\\cdot ${k}=${bb}$`],
    });
    return ex(this.id, seed, difficulty, step);
  },
};
