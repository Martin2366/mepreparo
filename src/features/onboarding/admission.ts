import { type Career, fold, type GenericCareer, type Institution, matches } from './model';

/**
 * Oferta académica oficial (DEMRE Admisión 2027 + SIES 2026). Se carga recién cuando se necesita:
 * son ~700 KB de JSON y no deben pesar en el arranque en frío.
 * Para regenerar: scripts/admission/.
 */
type InstitutionsFile = { meta: { categories: string[]; sources: string[] }; institutions: Institution[] };

let instFile: InstitutionsFile | undefined;
let careersAll: Career[] | undefined;
let genericAll: GenericCareer[] | undefined;
const careersByInst = new Map<string, Career[]>();

const loadInstitutions = (): InstitutionsFile =>
  (instFile ??= require('@/content/admission/institutions.json') as InstitutionsFile);
const loadCareers = (): Career[] => (careersAll ??= require('@/content/admission/careers.json') as Career[]);
const loadGeneric = (): GenericCareer[] =>
  (genericAll ??= require('@/content/admission/generic-careers.json') as GenericCareer[]);

export const admissionSources = (): string[] => loadInstitutions().meta.sources;
export const categories = (): string[] => loadInstitutions().meta.categories;
export const allInstitutions = (): Institution[] => loadInstitutions().institutions;
export const institutionById = (id: string | null | undefined): Institution | undefined =>
  id ? allInstitutions().find((i) => i.id === id) : undefined;

export function careersOf(instId: string): Career[] {
  let list = careersByInst.get(instId);
  if (!list) {
    list = loadCareers()
      .filter((c) => c.inst === instId)
      .sort((a, b) => a.name.localeCompare(b.name, 'es'));
    careersByInst.set(instId, list);
  }
  return list;
}

export const genericCareers = (): GenericCareer[] => loadGeneric();

/** Carrera elegida: de una institución (código) o genérica (`g-…`, cuando aún no elige universidad). */
export function careerById(id: string | null | undefined): Career | GenericCareer | undefined {
  if (!id) return undefined;
  if (id.startsWith('g-')) return loadGeneric().find((g) => g.id === id);
  return loadCareers().find((c) => c.id === id);
}

export type Section<T> = { title: string; data: T[] };

/** Instituciones por categoría, filtradas por búsqueda (nombre o sigla, sin tildes). */
export function institutionSections(query: string): Section<Institution>[] {
  const list = allInstitutions().filter((i) => matches(query, i.name, i.search, i.short));
  return categories()
    .map((title) => ({ title, data: list.filter((i) => i.category === title) }))
    .filter((s) => s.data.length > 0);
}

/** Carreras agrupadas por área. Una misma carrera en varias sedes se muestra una vez por sede. */
export function careerSections<T extends { name: string; area: string }>(list: T[], query: string): Section<T>[] {
  const filtered = list.filter((c) => matches(query, c.name));
  const areas = [...new Set(filtered.map((c) => c.area))].sort((a, b) =>
    a === 'Otras áreas' ? 1 : b === 'Otras áreas' ? -1 : a.localeCompare(b, 'es'),
  );
  return areas.map((title) => ({ title, data: filtered.filter((c) => c.area === title) }));
}

export const isGeneric = (c: Career | GenericCareer | undefined): c is GenericCareer => !!c && c.id.startsWith('g-');

export { fold };
