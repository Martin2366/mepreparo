import careers from '@/content/admission/careers.json';
import generic from '@/content/admission/generic-careers.json';
import inst from '@/content/admission/institutions.json';

import { careerSections, institutionSections } from '../admission';
import { type Career, type GenericCareer, weightSlices } from '../model';

const C = careers as Career[];
const G = generic as GenericCareer[];

describe('oferta académica oficial', () => {
  it('toda carrera pertenece a una institución existente', () => {
    const ids = new Set(inst.institutions.map((i) => i.id));
    expect(C.every((c) => ids.has(c.inst))).toBe(true);
  });

  it('las 47 universidades del Sistema de Acceso tienen carreras con ponderaciones que suman 100', () => {
    const paes = inst.institutions.filter((i) => i.paes);
    expect(paes).toHaveLength(47);
    for (const u of paes) expect(C.some((c) => c.inst === u.id && c.w)).toBe(true);
    for (const c of C.filter((c) => c.w)) {
      expect(weightSlices(c.w!, c.hoc).reduce((s, x) => s + x.value, 0)).toBe(100);
    }
    for (const g of G) expect(weightSlices(g.w, g.hoc).reduce((s, x) => s + x.value, 0)).toBe(100);
  });

  it('los puntajes de corte están en la escala PAES (100–1000)', () => {
    for (const c of C.filter((c) => c.cut)) {
      expect(c.cut!.score).toBeGreaterThanOrEqual(100);
      expect(c.cut!.score).toBeLessThanOrEqual(1000);
    }
  });

  it('ningún nombre queda vacío', () => {
    expect(C.every((c) => c.name.trim() && c.place.trim())).toBe(true);
    expect(inst.institutions.every((i) => i.name.trim())).toBe(true);
  });

  it('la búsqueda encuentra por sigla y sin tildes', () => {
    const flat = (q: string) => institutionSections(q).flatMap((s) => s.data.map((i) => i.name));
    expect(flat('usach')).toContain('Universidad de Santiago de Chile');
    expect(flat('inacap').some((n) => n.includes('INACAP'))).toBe(true);
    expect(flat('concepcion')).toContain('Universidad de Concepción');
    expect(careerSections(G, 'medicina').flatMap((s) => s.data.map((g) => g.name))).toContain('Medicina');
  });
});
