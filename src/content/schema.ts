/**
 * Esquema del contenido (R1, A2, A3). Lo usan la app (tipos) y `scripts/validate-content.ts` (validación en CI).
 * La matemática de los textos va entre `$…$` con el subconjunto de `engine/math-parser`.
 */
import { z } from 'zod';

/** Las 4 habilidades PAES. */
export const SKILLS = ['resolver', 'modelar', 'representar', 'argumentar'] as const;
export const SkillSchema = z.enum(SKILLS);
export type Skill = z.infer<typeof SkillSchema>;

export const SKILL_LABEL: Record<Skill, string> = {
  resolver: 'Resolver problemas',
  modelar: 'Modelar',
  representar: 'Representar',
  argumentar: 'Argumentar',
};

export const ReviewStatusSchema = z.enum(['draft', 'approved']);
export type ReviewStatus = z.infer<typeof ReviewStatusSchema>;

/** Número racional escrito como texto: "3", "-3/4", "0,25". Se valida con `parseRational` en el validador. */
const RationalText = z.string().min(1);

// ─── Currículo ─────────────────────────────────────────────────────────────

export const PlannedLesson = z.object({ id: z.string(), title: z.string() });

export const UnitSchema = z.object({
  id: z.string(),
  name: z.string(),
  summary: z.string(),
  skills: z.array(SkillSchema).min(1),
  /** Lecciones planificadas (catálogo). Solo se juegan las que existen en `lessons/`. */
  lessons: z.array(PlannedLesson),
  /** Generadores de práctica (`engine/generators`) de esta unidad. */
  generators: z.array(z.string()),
});
export type Unit = z.infer<typeof UnitSchema>;

export const AxisSchema = z.object({
  id: z.string(),
  name: z.string(),
  /** Ícono de interfaz (`components/ui/Icon`) y ficha ilustrada opcional del design system. */
  icon: z.string(),
  tile: z.enum(['funcion', 'triangulo']).optional(),
  /** Proporción aproximada de preguntas del eje en la prueba (suman 1). */
  share: z.number().positive().max(1),
  /** Etiquetas del onboarding/diagnóstico que apuntan a este eje ("Álgebra", "Funciones"…). */
  focus: z.array(z.string()),
  units: z.array(UnitSchema).min(1),
});
export type Axis = z.infer<typeof AxisSchema>;

export const CurriculumSchema = z.object({
  test: z.string(),
  name: z.string(),
  version: z.number().int(),
  _fuente: z.string().optional(),
  axes: z.array(AxisSchema).min(1),
});
export type Curriculum = z.infer<typeof CurriculumSchema>;

// ─── Pasos de lección ──────────────────────────────────────────────────────

const base = {
  id: z.string(),
  skill: SkillSchema.optional(),
  difficulty: z.number().int().min(1).max(5).optional(),
  /** Pistas graduadas (1–3): la 1.ª siempre es gratis. */
  hints: z.array(z.string()).max(3).optional(),
  /** Resolución completa paso a paso (se muestra al pedirla). */
  solution: z.array(z.string()).optional(),
};

export const ExplainStep = z.object({
  ...base,
  type: z.literal('explain'),
  title: z.string().optional(),
  body: z.string(),
  /** Nota manuscrita de Equis (Kalam). */
  note: z.string().optional(),
  mascot: z.enum(['explicando', 'pensando', 'senalando', 'aja', 'celebrando', 'saludo', 'estudiando']).optional(),
});

export const ChoiceStep = z.object({
  ...base,
  type: z.literal('choice'),
  prompt: z.string(),
  options: z.array(z.string()).min(2).max(5),
  answer: z.number().int().min(0),
  /** Explicación de cada alternativa incorrecta, por índice ("1": "Casi…"). */
  feedback: z.record(z.string(), z.string()),
  /** Por qué la correcta es correcta. */
  explanation: z.string().optional(),
});

export const NumericStep = z.object({
  ...base,
  type: z.literal('numeric'),
  prompt: z.string(),
  answer: RationalText,
  /** Errores típicos: si el estudiante escribe `value`, se muestra su explicación. */
  mistakes: z.array(z.object({ value: RationalText, feedback: z.string() })).optional(),
  /** Explicación para cualquier otro error. */
  feedback: z.string(),
  /** Unidad o texto que acompaña la respuesta ("cm", "%"). */
  suffix: z.string().optional(),
  explanation: z.string().optional(),
});

export const GraphParam = z.object({
  name: z.string(),
  min: z.number(),
  max: z.number(),
  step: RationalText,
  start: RationalText,
});

export const GraphTarget = z.discriminatedUnion('kind', [
  /** Los parámetros deben quedar exactamente en estos valores. */
  z.object({ kind: z.literal('params'), values: z.record(z.string(), RationalText) }),
  /** La función debe pasar por todos estos puntos. */
  z.object({ kind: z.literal('points'), points: z.array(z.tuple([RationalText, RationalText])).min(1) }),
  /** Parábola con el vértice en este punto. */
  z.object({ kind: z.literal('vertex'), point: z.tuple([RationalText, RationalText]) }),
]);

export const GraphStep = z.object({
  ...base,
  type: z.literal('graph'),
  prompt: z.string(),
  /** linear: m·x + n · quadratic: a·x² + b·x + c */
  family: z.enum(['linear', 'quadratic']),
  params: z.array(GraphParam).min(1),
  target: GraphTarget,
  /** Puntos de referencia dibujados en el plano. */
  marks: z.array(z.tuple([RationalText, RationalText])).optional(),
  /** Ventana visible del plano (por defecto x e y de −6 a 6). */
  window: z.object({ x: z.tuple([z.number(), z.number()]), y: z.tuple([z.number(), z.number()]) }).optional(),
  feedback: z.string(),
  explanation: z.string().optional(),
});

export const OrderStep = z.object({
  ...base,
  type: z.literal('order'),
  prompt: z.string(),
  /** En el orden correcto; la app los muestra mezclados. */
  items: z.array(z.string()).min(2).max(6),
  feedback: z.string(),
  explanation: z.string().optional(),
});

export const FindErrorStep = z.object({
  ...base,
  type: z.literal('find-error'),
  prompt: z.string(),
  /** Resolución ajena, una línea por paso. */
  lines: z.array(z.string()).min(2),
  /** Índice de la primera línea equivocada. */
  wrong: z.number().int().min(0),
  feedback: z.string(),
  explanation: z.string(),
});

export const StepSchema = z.discriminatedUnion('type', [
  ExplainStep,
  ChoiceStep,
  NumericStep,
  GraphStep,
  OrderStep,
  FindErrorStep,
]);
export type Step = z.infer<typeof StepSchema>;
export type StepType = Step['type'];
export type StepOf<T extends StepType> = Extract<Step, { type: T }>;

export const LessonSchema = z.object({
  id: z.string(),
  title: z.string(),
  version: z.number().int(),
  reviewStatus: ReviewStatusSchema,
  estimatedMinutes: z.number().int().min(1).max(15),
  skills: z.array(SkillSchema).min(1),
  steps: z.array(StepSchema).min(3),
});
export type Lesson = z.infer<typeof LessonSchema>;

export const MiniClassCard = z.object({
  title: z.string().optional(),
  body: z.string(),
  formula: z.string().optional(),
  example: z.array(z.string()).optional(),
});

export const MiniClassSchema = z.object({
  id: z.string(),
  title: z.string(),
  reviewStatus: ReviewStatusSchema,
  cards: z.array(MiniClassCard).min(2).max(8),
});
export type MiniClass = z.infer<typeof MiniClassSchema>;

/** Un archivo por unidad: `src/content/lessons/<prueba>/<unidad>.json`. */
export const UnitContentSchema = z.object({
  unitId: z.string(),
  lessons: z.array(LessonSchema),
  miniClasses: z.array(MiniClassSchema),
});
export type UnitContent = z.infer<typeof UnitContentSchema>;

export const isEvaluable = (s: Step): boolean => s.type !== 'explain';

// ─── Fórmulas ──────────────────────────────────────────────────────────────

export const FormulaSchema = z.object({ id: z.string(), title: z.string(), formula: z.string(), note: z.string().optional() });
export type Formula = z.infer<typeof FormulaSchema>;

export const FormulasSchema = z.object({
  reviewStatus: ReviewStatusSchema,
  _nota: z.string().optional(),
  units: z.record(z.string(), z.array(FormulaSchema)),
});
