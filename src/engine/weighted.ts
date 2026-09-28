/** Ponderaciones de una carrera en % (DEMRE), como en `content/admission/careers.json`. */
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

export type ScoreKey = 'nem' | 'ranking' | 'lectora' | 'm1' | 'm2' | 'historia' | 'ciencias';
export type Scores = Partial<Record<ScoreKey, number>>;

export type Contribution = { key: ScoreKey | 'hoc'; label: string; weight: number; score: number; points: number };

const LABEL: Record<ScoreKey | 'hoc', string> = {
  nem: 'NEM',
  ranking: 'Ranking',
  lectora: 'Competencia Lectora',
  m1: 'M1',
  m2: 'M2',
  historia: 'Historia',
  ciencias: 'Ciencias',
  hoc: 'Historia o Ciencias',
};

/**
 * Puntaje ponderado estimado: Σ ponderación × puntaje / 100. Si la carrera acepta Historia **o** Ciencias
 * (`hoc`), cuenta la mejor de las dos. Las pruebas sin puntaje cuentan como 0 (la UI pide completarlas).
 */
export function weightedScore(w: Weights, s: Scores, hoc = false): { total: number; parts: Contribution[] } {
  const keys: (ScoreKey | 'hoc')[] = ['nem', 'ranking', 'lectora', 'm1', 'm2'];
  if (hoc) keys.push('hoc');
  else keys.push('historia', 'ciencias');

  const parts: Contribution[] = [];
  for (const key of keys) {
    const weight = key === 'hoc' ? Math.max(w.historia, w.ciencias) : w[key];
    if (weight <= 0) continue;
    const score = key === 'hoc' ? Math.max(s.historia ?? 0, s.ciencias ?? 0) : (s[key] ?? 0);
    parts.push({ key, label: LABEL[key], weight, score, points: (weight * score) / 100 });
  }
  const total = Math.round(parts.reduce((t, p) => t + p.points, 0) * 100) / 100;
  return { total, parts };
}

export type Lever = { key: ScoreKey | 'hoc'; label: string; gain: number };

/**
 * "Mejor palanca": cuántos puntos ponderados ganas si subes `delta` puntos en cada prueba que se puede preparar
 * (NEM y Ranking no se entrenan en la app). Ordenadas de mayor a menor.
 */
export function levers(w: Weights, hoc = false, delta = 40): Lever[] {
  const trainable: (ScoreKey | 'hoc')[] = ['lectora', 'm1', 'm2', ...(hoc ? (['hoc'] as const) : (['historia', 'ciencias'] as const))];
  return trainable
    .map((key) => {
      const weight = key === 'hoc' ? Math.max(w.historia, w.ciencias) : w[key];
      return { key, label: LABEL[key], gain: Math.round(((weight * delta) / 100) * 10) / 10 };
    })
    .filter((l) => l.gain > 0)
    .sort((a, b) => b.gain - a.gain);
}
