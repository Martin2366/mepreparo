import { BADGES, type BadgeStats, newBadges, satisfiedBadges } from '../badges';

const zero: BadgeStats = {
  lessons: 0,
  streak: 0,
  ahas: 0,
  attempts: 0,
  exams: 0,
  fullExams: 0,
  reviewCorrect: 0,
  axesPracticed: 0,
  masteredUnits: 0,
  masteredAxes: 0,
  level: 1,
  bestExamScore: 0,
};

describe('logros', () => {
  it('ids únicos y reglas válidas', () => {
    expect(new Set(BADGES.map((b) => b.id)).size).toBe(BADGES.length);
  });

  it('se ganan al cumplir la regla, una sola vez', () => {
    const stats = { ...zero, lessons: 1, streak: 7 };
    expect(satisfiedBadges(stats, false)).toEqual(expect.arrayContaining(['primera-leccion', 'racha-3', 'racha-7']));
    expect(newBadges(stats, false, { 'primera-leccion': '2026-09-28' })).not.toContain('primera-leccion');
  });

  it('los de maestría solo con Premium', () => {
    const stats = { ...zero, bestExamScore: 850 };
    expect(satisfiedBadges(stats, false)).not.toContain('maestria-800');
    expect(satisfiedBadges(stats, true)).toContain('maestria-800');
  });
});
