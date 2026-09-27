/**
 * Validador de contenido (R1, A2, A3). Se corre en CI y antes de cada build de EAS.
 *
 * Hoy (Día 1) revisa:
 *  - que cada JSON de `src/content/lessons/` se pueda leer;
 *  - que TODA la notación matemática de sus textos esté dentro del subconjunto permitido;
 *  - que en producción no haya lecciones `draft` (A2) ni falten lecciones.
 * El Día 2 se suma el esquema zod y la verificación automática de respuestas (A3).
 *
 * Uso: npm run content:validate [-- --production]
 * En EAS, el perfil `production` activa el modo estricto solo (EAS_BUILD_PROFILE).
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { MathParseError, parseRich } from '../src/engine/math-parser';

const LESSONS_DIR = join(__dirname, '..', 'src', 'content', 'lessons');
const production = process.argv.includes('--production') || process.env.EAS_BUILD_PROFILE === 'production';

const errors: string[] = [];

/** Recorre todos los textos del JSON y valida su notación. */
function checkStrings(value: unknown, path: string): void {
  if (typeof value === 'string') {
    try {
      parseRich(value);
    } catch (e) {
      if (e instanceof MathParseError) errors.push(`${path}: ${e.message}`);
      else throw e;
    }
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => checkStrings(v, `${path}[${i}]`));
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) checkStrings(v, `${path}.${k}`);
  }
}

const files = existsSync(LESSONS_DIR) ? readdirSync(LESSONS_DIR).filter((f) => f.endsWith('.json')) : [];
let drafts = 0;

for (const file of files) {
  let lesson: { reviewStatus?: unknown };
  try {
    lesson = JSON.parse(readFileSync(join(LESSONS_DIR, file), 'utf8'));
  } catch (e) {
    errors.push(`${file}: JSON inválido (${(e as Error).message})`);
    continue;
  }
  checkStrings(lesson, file);
  if (lesson.reviewStatus !== 'approved' && lesson.reviewStatus !== 'draft') {
    errors.push(`${file}: reviewStatus debe ser "draft" o "approved"`);
  }
  if (lesson.reviewStatus === 'draft') {
    drafts++;
    if (production) errors.push(`${file}: está en "draft"; producción solo acepta lecciones aprobadas por el fundador`);
  }
}

if (production && files.length === 0) errors.push('No hay lecciones: un build de producción no puede salir vacío');

console.log(`Contenido: ${files.length} lecciones (${drafts} en draft)${production ? ' · modo producción' : ''}`);
if (errors.length > 0) {
  console.error(`\n${errors.length} problema(s):\n- ${errors.join('\n- ')}`);
  process.exit(1);
}
console.log('OK');
