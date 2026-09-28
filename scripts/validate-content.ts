/**
 * Validador de contenido (R1, A2, A3). Se corre en CI y antes de cada build de EAS.
 *
 * Revisa:
 *  - el currículo y cada archivo de `src/content/lessons/` contra el esquema zod (`src/content/schema.ts`);
 *  - que TODA la notación matemática esté dentro del subconjunto permitido;
 *  - las respuestas, de forma automática con el motor exacto (A3): una sola alternativa correcta y explicación
 *    para cada incorrecta, números legibles, balanzas con solución única, gráficos cuyo objetivo se puede
 *    alcanzar con los deslizadores, etc.;
 *  - los generadores de práctica de cada unidad (varias semillas y dificultades);
 *  - en producción, que no haya contenido `draft` (A2).
 *
 * Uso: npm run content:validate [-- --production]
 * En EAS, el perfil `production` activa el modo estricto solo (EAS_BUILD_PROFILE).
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

import { CurriculumSchema, type Step, type StepOf, UnitContentSchema } from '../src/content/schema';
import { isSolved, solve } from '../src/engine/balance';
import { GENERATORS } from '../src/engine/generators';
import { equationOf, gradeGraph } from '../src/engine/grading';
import { MathParseError, parseRich } from '../src/engine/math-parser';
import { add, cmp, parseRational, type Rational, rat } from '../src/engine/rational';

const ROOT = join(__dirname, '..');
const CONTENT = join(ROOT, 'src', 'content');
const LESSONS_DIR = join(CONTENT, 'lessons');
const production = process.argv.includes('--production') || process.env.EAS_BUILD_PROFILE === 'production';

const errors: string[] = [];
const err = (where: string, msg: string) => errors.push(`${where}: ${msg}`);

/** Recorre todos los textos del JSON y valida su notación. */
function checkStrings(value: unknown, path: string): void {
  if (typeof value === 'string') {
    try {
      parseRich(value);
    } catch (e) {
      if (e instanceof MathParseError) err(path, e.message);
      else throw e;
    }
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => checkStrings(v, `${path}[${i}]`));
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) checkStrings(v, `${path}.${k}`);
  }
}

function num(where: string, text: string): Rational | null {
  const v = parseRational(text);
  if (!v) err(where, `"${text}" no es un número racional válido`);
  return v;
}

function jsonFiles(dir: string): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? jsonFiles(p) : f.endsWith('.json') ? [p] : [];
  });
}

// ─── Currículo ─────────────────────────────────────────────────────────────

const curriculumRaw = JSON.parse(readFileSync(join(CONTENT, 'm1', 'curriculum.json'), 'utf8'));
const cur = CurriculumSchema.safeParse(curriculumRaw);
const plannedLessons = new Map<string, string>(); // lección → unidad
const units = new Map<string, string[]>(); // unidad → generadores
if (!cur.success) {
  err('m1/curriculum.json', cur.error.message);
} else {
  checkStrings(cur.data, 'm1/curriculum.json');
  const shares = cur.data.axes.reduce((s, a) => s + a.share, 0);
  if (Math.abs(shares - 1) > 0.001) err('m1/curriculum.json', `las proporciones de los ejes suman ${shares}, no 1`);
  for (const axis of cur.data.axes) {
    for (const u of axis.units) {
      if (units.has(u.id)) err('m1/curriculum.json', `unidad repetida: ${u.id}`);
      units.set(u.id, u.generators);
      for (const l of u.lessons) {
        if (plannedLessons.has(l.id)) err('m1/curriculum.json', `lección repetida: ${l.id}`);
        plannedLessons.set(l.id, u.id);
      }
      for (const g of u.generators) if (!GENERATORS[g]) err(`m1/curriculum.json (${u.id})`, `generador inexistente: ${g}`);
    }
  }
}

// ─── Pasos ─────────────────────────────────────────────────────────────────

function checkChoice(where: string, s: StepOf<'choice'>) {
  if (s.answer >= s.options.length) err(where, 'la respuesta correcta apunta a una alternativa que no existe');
  if (new Set(s.options).size !== s.options.length) err(where, 'hay alternativas repetidas');
  s.options.forEach((_, i) => {
    if (i !== s.answer && !s.feedback[String(i)]) err(where, `falta la explicación de la alternativa ${i}`);
  });
  if (s.feedback[String(s.answer)]) err(where, 'la alternativa correcta no debe tener feedback de error');
}

function checkNumeric(where: string, s: StepOf<'numeric'>) {
  const answer = num(where, s.answer);
  const seen = new Set<string>();
  for (const m of s.mistakes ?? []) {
    const v = num(where, m.value);
    if (answer && v && cmp(answer, v) === 0) err(where, `el error típico ${m.value} es igual a la respuesta correcta`);
    if (seen.has(m.value)) err(where, `error típico repetido: ${m.value}`);
    seen.add(m.value);
  }
}

function checkBalance(where: string, s: StepOf<'balance'>) {
  const all = [...s.equation.left, ...s.equation.right];
  if (!all.every((t) => num(where, t))) return;
  const e = equationOf(s);
  const sol = solve(e);
  if (sol.kind !== 'unique') err(where, 'la ecuación de la balanza no tiene solución única');
  if (isSolved(e)) err(where, 'la balanza ya parte resuelta');
  // La balanza dibuja pesos enteros positivos.
  if (!all.every((t) => {
    const v = parseRational(t);
    return v !== null && v.d === 1 && v.n >= 0 && v.n <= 9;
  })) err(where, 'la balanza solo dibuja coeficientes enteros entre 0 y 9');
}

function gridOf(where: string, p: StepOf<'graph'>['params'][number]): Rational[] | null {
  const step = num(where, p.step);
  const start = num(where, p.start);
  if (!step || !start) return null;
  if (step.n <= 0) {
    err(where, `el paso de ${p.name} debe ser positivo`);
    return null;
  }
  const values: Rational[] = [];
  for (let v = rat(Math.round(p.min * 1000), 1000); cmp(v, rat(Math.round(p.max * 1000), 1000)) <= 0; v = add(v, step)) {
    values.push(v);
    if (values.length > 200) {
      err(where, `el deslizador ${p.name} tiene demasiados valores`);
      return null;
    }
  }
  if (!values.some((v) => cmp(v, start) === 0)) err(where, `el valor inicial de ${p.name} no cae en su grilla`);
  return values;
}

function checkGraph(where: string, s: StepOf<'graph'>) {
  const grids = s.params.map((p) => [p.name, gridOf(where, p)] as const);
  if (grids.some(([, g]) => !g)) return;
  const names = s.params.map((p) => p.name);
  const expected = s.family === 'linear' ? ['m', 'n'] : ['a', 'b', 'c'];
  for (const n of names) if (!expected.includes(n)) err(where, `parámetro desconocido para ${s.family}: ${n}`);

  // Búsqueda exhaustiva: el objetivo tiene que poder alcanzarse con los deslizadores.
  let reachable = false;
  const walk = (i: number, acc: Record<string, Rational>) => {
    if (reachable) return;
    if (i === grids.length) {
      reachable = gradeGraph(s, acc).correct;
      return;
    }
    const [name, grid] = grids[i]!;
    for (const v of grid!) walk(i + 1, { ...acc, [name]: v });
  };
  walk(0, {});
  if (!reachable) err(where, 'el objetivo del gráfico no se puede alcanzar con los deslizadores');
  const start = Object.fromEntries(s.params.map((p) => [p.name, parseRational(p.start)!]));
  if (gradeGraph(s, start).correct) err(where, 'el gráfico ya parte en la respuesta correcta');
}

function checkStep(where: string, s: Step) {
  switch (s.type) {
    case 'choice':
      return checkChoice(where, s);
    case 'numeric':
      return checkNumeric(where, s);
    case 'balance':
      return checkBalance(where, s);
    case 'graph':
      return checkGraph(where, s);
    case 'order':
      if (new Set(s.items).size !== s.items.length) err(where, 'hay pasos repetidos');
      return;
    case 'find-error':
      if (s.wrong >= s.lines.length) err(where, 'la línea equivocada no existe');
      return;
    case 'explain':
      return;
  }
}

// ─── Archivos de contenido ─────────────────────────────────────────────────

const files = jsonFiles(LESSONS_DIR);
const indexSource = existsSync(join(LESSONS_DIR, 'index.ts')) ? readFileSync(join(LESSONS_DIR, 'index.ts'), 'utf8') : '';
const lessonIds = new Set<string>();
const miniIds = new Set<string>();
let lessonCount = 0;
let miniCount = 0;
let drafts = 0;

for (const file of files) {
  const rel = relative(LESSONS_DIR, file).replace(/\\/g, '/');
  if (!indexSource.includes(`./${rel}`)) err(rel, 'no está en src/content/lessons/index.ts (la app no lo cargaría)');

  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(file, 'utf8'));
  } catch (e) {
    err(rel, `JSON inválido (${(e as Error).message})`);
    continue;
  }
  checkStrings(raw, rel);
  const parsed = UnitContentSchema.safeParse(raw);
  if (!parsed.success) {
    for (const issue of parsed.error.issues) err(`${rel} → ${issue.path.join('.')}`, issue.message);
    continue;
  }
  const unit = parsed.data;
  if (!units.has(unit.unitId)) err(rel, `la unidad ${unit.unitId} no existe en el currículo`);

  for (const lesson of unit.lessons) {
    lessonCount++;
    const where = `${rel} → ${lesson.id}`;
    if (lessonIds.has(lesson.id)) err(where, 'id de lección repetido');
    lessonIds.add(lesson.id);
    if (plannedLessons.get(lesson.id) !== unit.unitId) err(where, 'la lección no está planificada en esta unidad del currículo');
    if (lesson.reviewStatus === 'draft') {
      drafts++;
      if (production) err(where, 'está en "draft"; producción solo acepta contenido aprobado por el fundador');
    }
    const stepIds = new Set<string>();
    lesson.steps.forEach((s, i) => {
      const sw = `${where} → paso ${i + 1} (${s.id})`;
      if (stepIds.has(s.id)) err(sw, 'id de paso repetido');
      stepIds.add(s.id);
      checkStep(sw, s);
    });
    if (!lesson.steps.some((s) => s.type !== 'explain')) err(where, 'la lección no tiene ningún paso evaluable');
  }

  for (const mini of unit.miniClasses) {
    miniCount++;
    const where = `${rel} → ${mini.id}`;
    if (miniIds.has(mini.id)) err(where, 'id de mini-clase repetido');
    miniIds.add(mini.id);
    if (mini.reviewStatus === 'draft') {
      drafts++;
      if (production) err(where, 'está en "draft"; producción solo acepta contenido aprobado por el fundador');
    }
  }
}

if (production && lessonCount === 0) err('lessons', 'no hay lecciones: un build de producción no puede salir vacío');

// ─── Generadores ───────────────────────────────────────────────────────────

let generated = 0;
for (const [unitId, gens] of units) {
  for (const id of gens) {
    const g = GENERATORS[id];
    if (!g) continue;
    for (let seed = 1; seed <= 50; seed++) {
      for (const d of [1, 2, 3, 4, 5] as const) {
        const where = `generador ${id} (${unitId}) semilla ${seed} dificultad ${d}`;
        try {
          const { step } = g.generate(seed, d);
          checkStrings(step, where);
          checkChoice(where, step);
          generated++;
        } catch (e) {
          err(where, (e as Error).message);
        }
      }
    }
  }
}

console.log(
  `Contenido: ${lessonCount} lecciones · ${miniCount} mini-clases (${drafts} en draft) · ${generated} ejercicios generados revisados` +
    (production ? ' · modo producción' : ''),
);
if (errors.length > 0) {
  console.error(`\n${errors.length} problema(s):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log('OK');
