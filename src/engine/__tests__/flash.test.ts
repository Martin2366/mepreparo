import { flashQuestion, flashXp, pointsFor } from '../flash';

describe('reto relámpago', () => {
  it('siempre 4 opciones distintas, enteras, con la correcta incluida', () => {
    for (let seed = 1; seed <= 500; seed++) {
      for (const level of [0, 4, 8]) {
        const q = flashQuestion(seed, level);
        expect(q.options).toHaveLength(4);
        expect(new Set(q.options).size).toBe(4);
        expect(q.options).toContain(q.answer);
        expect(q.options.every(Number.isInteger)).toBe(true);
      }
    }
  });

  it('el multiplicador sube con el combo y tiene tope', () => {
    expect(pointsFor(0)).toBe(10);
    expect(pointsFor(3)).toBe(20);
    expect(pointsFor(30)).toBe(40);
    expect(flashXp(1000)).toBe(30);
  });
});
