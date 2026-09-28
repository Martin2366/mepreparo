import { paesScale } from '@/engine/score';

/**
 * Modelo puro del onboarding: qué pantallas se ven según las respuestas, recomendaciones y búsqueda.
 * Sin React ni almacenamiento: se prueba con jest.
 */

export type TestId = 'm1' | 'lectora' | 'm2' | 'ciencias' | 'historia';
export type PaesYear = 'this' | 'next' | 'later' | 'unknown';
export type SessionId = 'regular-2026' | 'invierno-2027' | 'regular-2027' | 'unknown';
export type TopicGroup = 'matematica' | 'lectora' | 'ciencias' | 'historia';

export type Weights = {
  nem: number;
  ranking: number;
  lectora: number;
  m1: number;
  m2: number;
  historia: number;
  ciencias: number;
  especial: number;
};

export type Institution = {
  id: string;
  name: string;
  short: string | null;
  search: string;
  category: string;
  region: string;
  /** Participa en la postulación centralizada con PAES (DEMRE). */
  paes: boolean;
};

export type CutScore = { score: number; kind: 'seleccionado' | 'matriculado'; year: number; source: string };

export type Career = {
  id: string;
  inst: string;
  name: string;
  place: string;
  area: string;
  w?: Weights;
  /** Historia "o" Ciencias: se considera la mejor de las dos. */
  hoc?: boolean;
  cut?: CutScore;
};

export type GenericCareer = { id: string; name: string; area: string; count: number; w: Weights; hoc?: boolean };

export type Answers = {
  name: string;
  /** `null` = "Aún no lo sé"; `undefined` = sin responder. */
  institutionId?: string | null;
  careerId?: string | null;
  year?: PaesYear;
  session?: SessionId;
  target?: number;
  tests?: TestId[];
  topics: string[];
  /** Un freno por grupo (matemática, lectora…). */
  blockers: Partial<Record<TopicGroup, string>>;
  /** Minutos diarios (meta). */
  minutes?: number;
  reminder?: { on: boolean; time: string };
  /** Diagnóstico: respuesta por pregunta (true/false; null = «No lo sé»). */
  diag?: { qi: number; answers: (boolean | null)[]; done: boolean; skipped: boolean };
  /** XP ganados en el onboarding (recompensa de «Tu plan»; se entrega una sola vez). */
  xp?: number;
  /** Prueba Premium de 7 días (la gestiona la app: sin tarjeta, sin cobro automático). */
  trialStartedAt?: string;
};

export const EMPTY_ANSWERS: Answers = { name: '', topics: [], blockers: {} };

export type StepId =
  | 'welcome'
  | 'name'
  | 'institution'
  | 'career'
  | 'weights'
  | 'year'
  | 'session'
  | 'target'
  | 'cheer'
  | 'tests'
  | 'topics'
  | 'blockers'
  | 'minutes'
  | 'reminder'
  | 'diagInvite'
  | 'diagnostic'
  | 'generating'
  | 'plan'
  | 'premium'
  | 'done';

/** Contexto derivado de los datos (carrera elegida) que decide qué pantallas aplican. */
export type FlowContext = { career?: Pick<Career, 'w'> | Pick<GenericCareer, 'w'> | null; institutionPaes?: boolean };

/**
 * Orden optimizado: primero el sueño (universidad y carrera) → lo que pesa → cuándo → meta → ánimo → diagnóstico rápido.
 * Las pantallas que no aplican se saltan (sin carrera no hay ponderaciones ni puntaje meta).
 */
export function visibleSteps(a: Answers, ctx: FlowContext = {}): StepId[] {
  const steps: StepId[] = ['welcome', 'name', 'institution', 'career'];
  const hasCareer = typeof a.careerId === 'string' && !!ctx.career;
  if (hasCareer) steps.push('weights');
  steps.push('year');
  if (a.year === 'this' || a.year === 'next') steps.push('session');
  if (hasCareer && ctx.institutionPaes !== false && ctx.career?.w) steps.push('target');
  steps.push('cheer', 'tests', 'topics', 'blockers', 'minutes', 'reminder', 'diagInvite');
  if (!a.diag?.skipped) steps.push('diagnostic');
  steps.push('generating', 'plan', 'premium', 'done');
  return steps;
}

export function progressOf(step: StepId, steps: StepId[]): number {
  const i = steps.indexOf(step);
  // La bienvenida no cuenta; la barra parte con un poquito de avance para que se sienta en marcha.
  const total = steps.length - 1;
  return i <= 0 ? 0 : Math.max(0.04, i / total);
}

/** Pruebas preseleccionadas según las ponderaciones de la carrera (M1 y Lectora siempre). */
export function recommendedTests(w?: Weights, hoc?: boolean): { tests: TestId[]; eitherHistoriaOCiencias: boolean } {
  const tests: TestId[] = ['m1', 'lectora'];
  if (!w) return { tests, eitherHistoriaOCiencias: false };
  if (w.m2 > 0) tests.push('m2');
  if (!hoc) {
    if (w.ciencias > 0) tests.push('ciencias');
    if (w.historia > 0) tests.push('historia');
  }
  return { tests, eitherHistoriaOCiencias: !!hoc && (w.ciencias > 0 || w.historia > 0) };
}

/** Grupos de temas/frenos según las pruebas elegidas. "Todavía no sé" = las obligatorias. */
export function groupsFor(tests: TestId[] | undefined): TopicGroup[] {
  const t = tests && tests.length > 0 ? tests : (['m1', 'lectora'] as TestId[]);
  const groups: TopicGroup[] = [];
  if (t.includes('m1') || t.includes('m2')) groups.push('matematica');
  if (t.includes('lectora')) groups.push('lectora');
  if (t.includes('ciencias')) groups.push('ciencias');
  if (t.includes('historia')) groups.push('historia');
  return groups;
}

export type WeightSlice = { key: string; label: string; value: number; math: boolean };

/** Porciones del gráfico de ponderaciones (Historia o Ciencias cuenta una vez si es alternativa). */
export function weightSlices(w: Weights, hoc?: boolean): WeightSlice[] {
  const s: WeightSlice[] = [
    { key: 'nem', label: 'Notas (NEM)', value: w.nem, math: false },
    { key: 'ranking', label: 'Ranking', value: w.ranking, math: false },
    { key: 'lectora', label: 'Competencia Lectora', value: w.lectora, math: false },
    { key: 'm1', label: 'Matemática 1 (M1)', value: w.m1, math: true },
    { key: 'm2', label: 'Matemática 2 (M2)', value: w.m2, math: true },
  ];
  if (hoc) s.push({ key: 'hoc', label: 'Historia o Ciencias', value: Math.max(w.historia, w.ciencias), math: false });
  else {
    s.push({ key: 'ciencias', label: 'Ciencias', value: w.ciencias, math: false });
    s.push({ key: 'historia', label: 'Historia', value: w.historia, math: false });
  }
  s.push({ key: 'especial', label: 'Prueba especial', value: w.especial, math: false });
  return s.filter((x) => x.value > 0);
}

export const mathShare = (w: Weights): number => w.m1 + w.m2;

/** Normaliza para buscar: sin tildes, minúsculas, solo letras y números. */
export function fold(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9ñ]+/g, ' ')
    .trim();
}

/** Todas las palabras de la búsqueda deben aparecer (prefijo) en el nombre o en las siglas. */
export function matches(query: string, ...fields: (string | null | undefined)[]): boolean {
  const q = fold(query).split(' ').filter(Boolean);
  if (q.length === 0) return true;
  const words = fold(fields.filter(Boolean).join(' ')).split(' ');
  return q.every((t) => words.some((w) => w.startsWith(t)));
}

/** Días completos desde `today` hasta `date` (ambas fechas locales, formato AAAA-MM-DD). */
export function daysUntil(date: string, today: Date): number {
  const [y, m, d] = date.split('-').map(Number) as [number, number, number];
  const target = Date.UTC(y, m - 1, d);
  const now = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((target - now) / 86_400_000);
}

/** Formato chileno para puntajes: 700,0 · 811,35 */
export function formatScore(n: number, decimals = 1): string {
  return n.toLocaleString('es-CL', { minimumFractionDigits: decimals, maximumFractionDigits: 2 });
}

/** Pantallas sin encabezado (momentos de cierre, como en el diseño). */
export const FULLSCREEN_STEPS: StepId[] = ['welcome', 'generating', 'plan', 'premium', 'done'];

/**
 * Puntaje M1 estimado (orientativo) con la escala común de la app (`engine/score.paesScale`).
 * Sin diagnóstico: 600 como punto de partida neutro.
 */
export function estimateM1(correct: number, total: number, done: boolean): number {
  if (!done || total === 0) return 600;
  return paesScale(correct / total);
}

/** Semanas hasta la PAES (mínimo 1). Sin fecha: 30, una estimación que se cambia después. */
export function weeksUntil(days: number | undefined): number {
  return days && days > 0 ? Math.max(1, Math.round(days / 7)) : 30;
}

/** Foco del plan: temas marcados + temas fallados en el diagnóstico, sin repetir, máximo 3. */
export function planFocus(marked: string[], missed: string[]): string[] {
  const focus = [...new Set([...marked, ...missed])].slice(0, 3);
  return focus.length > 0 ? focus : ['Funciones', 'Álgebra'];
}

/** XP de recompensa por completar el onboarding. */
export const ONBOARDING_XP = 50;
