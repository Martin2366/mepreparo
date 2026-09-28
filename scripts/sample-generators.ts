/**
 * Muestra ejemplos de cada generador para revisarlos a mano (plantilla + 10 ejemplos: PRD §14.3).
 * Uso: npx tsx scripts/sample-generators.ts [id-generador] [cantidad]
 */
import { GENERATORS } from '../src/engine/generators';

const [only, countArg] = process.argv.slice(2);
const count = Number(countArg ?? 2);
const LETTERS = 'ABCDE';

for (const g of Object.values(GENERATORS)) {
  if (only && g.id !== only) continue;
  console.log(`\n=== ${g.id} · ${g.title}`);
  for (let i = 0; i < count; i++) {
    const d = ((i % 5) + 1) as 1 | 2 | 3 | 4 | 5;
    const { step } = g.generate(1000 + i * 7, d);
    console.log(`[d${d}] ${step.prompt}`);
    step.options.forEach((o, k) => console.log(`   ${LETTERS[k]}) ${o}${k === step.answer ? '  ✅' : `  → ${step.feedback[String(k)]}`}`));
  }
}
