import { clampDiff, ExplainSchema, frameToPhoto, safeRich, ScanSchema, topicList, unitOfGenerator } from '../equis';

const units = [
  { id: 'ecuaciones', name: 'Ecuaciones', generators: ['linear-equation', 'linear-inequality'] },
  { id: 'porcentaje', name: 'Porcentaje', generators: ['percent-of'] },
];

describe('equis', () => {
  it('valida y completa la respuesta de una foto', () => {
    const r = ScanSchema.parse({ exercises: [{ statement: 'Resuelve $2x + 3 = 7$', topic: 'linear-equation' }] });
    expect(r.exercises[0]).toEqual({ statement: 'Resuelve $2x + 3 = 7$', options: [], topic: 'linear-equation', difficulty: 2 });
    expect(r.note).toBeNull();
    expect(ScanSchema.safeParse({ exercises: 'nada' }).success).toBe(false);
  });

  it('una explicación necesita al menos un paso', () => {
    expect(ExplainSchema.safeParse({ steps: [], question: '' }).success).toBe(false);
    expect(ExplainSchema.parse({ steps: [{ text: 'Resta 3' }] }).steps[0]?.math).toBeNull();
  });

  it('notación ilegible del modelo se muestra como texto plano', () => {
    expect(safeRich('Si $x = \\frac{1}{2}$')).toBe('Si $x = \\frac{1}{2}$');
    expect(safeRich('Usa $\\alpha$ y cuesta \\$500')).toBe('Usa \\alpha y cuesta \\$500');
  });

  it('del tema de la foto a la unidad de práctica', () => {
    expect(unitOfGenerator('percent-of', units)).toBe('porcentaje');
    expect(unitOfGenerator('nada', units)).toBeNull();
    expect(topicList(units, { 'linear-equation': 'Ecuación lineal', 'percent-of': 'Porcentaje de' })).toEqual([
      { id: 'linear-equation', title: 'Ecuación lineal (Ecuaciones)' },
      { id: 'percent-of', title: 'Porcentaje de (Porcentaje)' },
    ]);
    expect(clampDiff(9)).toBe(5);
    expect(clampDiff(Number.NaN)).toBe(2);
  });
});

describe('marco de la cámara', () => {
  it('pasa el marco de la pantalla a la foto (visor que cubre)', () => {
    // Foto 3000x4000 en una pantalla 400x800: se ve escalada ×0,2 y recortada a los lados.
    const r = frameToPhoto({ x: 0.1, y: 0.25, w: 0.8, h: 0.5 }, { w: 400, h: 800 }, { w: 3000, h: 4000 });
    expect(r.y).toBeCloseTo(0.23, 2);
    expect(r.h).toBeCloseTo(0.54, 2);
    expect(r.x).toBeGreaterThan(0.2);
    expect(r.x + r.w).toBeLessThanOrEqual(1);
  });
});
