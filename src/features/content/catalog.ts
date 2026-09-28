import * as Updates from 'expo-updates';

import UNIT_FILES from '@/content/lessons';
import curriculumJson from '@/content/m1/curriculum.json';
import type { Axis, Curriculum, Lesson, MiniClass, Unit, UnitContent } from '@/content/schema';
import type { PathUnit } from '@/engine/plan';

/**
 * Catálogo de contenido: currículo + lecciones existentes. El contenido en `draft` se ve en desarrollo y en
 * los builds de prueba (para que el fundador lo revise en el teléfono), nunca en el canal de producción,
 * y `content:validate --production` impide publicar un build con drafts (A2).
 */
export const SHOW_DRAFTS = __DEV__ || Updates.channel !== 'production';

export const curriculum = curriculumJson as Curriculum;

const visible = <T extends { reviewStatus: string }>(x: T) => SHOW_DRAFTS || x.reviewStatus === 'approved';

const CONTENT: Record<string, UnitContent> = Object.fromEntries(
  (UNIT_FILES as UnitContent[]).map((u) => [
    u.unitId,
    { ...u, lessons: u.lessons.filter(visible), miniClasses: u.miniClasses.filter(visible) },
  ]),
);

export type UnitRef = { unit: Unit; axis: Axis };

export const allUnits: UnitRef[] = curriculum.axes.flatMap((axis) => axis.units.map((unit) => ({ unit, axis })));

const UNIT_BY_ID = new Map(allUnits.map((u) => [u.unit.id, u]));

export const unitRef = (id: string): UnitRef | undefined => UNIT_BY_ID.get(id);

export const axisById = (id: string): Axis | undefined => curriculum.axes.find((a) => a.id === id);

/** Lecciones jugables de una unidad, en el orden del catálogo. */
export function lessonsOf(unitId: string): Lesson[] {
  const content = CONTENT[unitId];
  if (!content) return [];
  const planned = unitRef(unitId)?.unit.lessons.map((l) => l.id) ?? [];
  return [...content.lessons].sort((a, b) => rank(planned, a.id) - rank(planned, b.id));
}

const rank = (list: string[], id: string) => {
  const i = list.indexOf(id);
  return i < 0 ? 999 : i;
};

export const miniClassesOf = (unitId: string): MiniClass[] => CONTENT[unitId]?.miniClasses ?? [];

const LESSON_INDEX = new Map<string, { lesson: Lesson; unitId: string }>();
for (const [unitId, c] of Object.entries(CONTENT)) for (const lesson of c.lessons) LESSON_INDEX.set(lesson.id, { lesson, unitId });

export function lessonById(id: string): { lesson: Lesson; unit: Unit; axis: Axis } | undefined {
  const hit = LESSON_INDEX.get(id);
  const ref = hit && unitRef(hit.unitId);
  return hit && ref ? { lesson: hit.lesson, ...ref } : undefined;
}

const MINI_INDEX = new Map<string, { mini: MiniClass; unitId: string }>();
for (const [unitId, c] of Object.entries(CONTENT)) for (const mini of c.miniClasses) MINI_INDEX.set(mini.id, { mini, unitId });

export const miniClassById = (id: string) => MINI_INDEX.get(id);

/** Unidades con su camino de lecciones jugables (para sugerir la siguiente lección). */
export const pathUnits: PathUnit[] = allUnits.map(({ unit, axis }) => ({
  id: unit.id,
  axisId: axis.id,
  focus: axis.focus,
  lessonIds: lessonsOf(unit.id).map((l) => l.id),
}));

/** Totales del catálogo que se muestran en Aprender (solo lo que realmente existe). */
export function totals() {
  let lessons = 0;
  let minis = 0;
  for (const c of Object.values(CONTENT)) {
    lessons += c.lessons.length;
    minis += c.miniClasses.length;
  }
  return { units: allUnits.length, lessons, miniClasses: minis, plannedLessons: allUnits.reduce((s, u) => s + u.unit.lessons.length, 0) };
}

export const hasPractice = (unitId: string) => (unitRef(unitId)?.unit.generators.length ?? 0) > 0;
