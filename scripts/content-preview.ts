/**
 * Genera `docs/contenido/<unidad>.md` con cada lección y mini-clase en formato legible, para que el fundador
 * revise el contenido sin abrir JSON (respuestas correctas marcadas, feedback de cada error, pistas).
 *
 * Uso: npm run content:preview
 */
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

import { type Step, UnitContentSchema } from '../src/content/schema';

const ROOT = join(__dirname, '..');
const LESSONS_DIR = join(ROOT, 'src', 'content', 'lessons');
const OUT = join(ROOT, 'docs', 'contenido');

const files = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : f.endsWith('.json') ? [p] : [];
  });

const LETTERS = 'ABCDE';

function step(s: Step, i: number): string[] {
  const out: string[] = [];
  const head = `**${i + 1}. [${s.type}]**${s.skill ? ` · ${s.skill}` : ''}${s.difficulty ? ` · dificultad ${s.difficulty}` : ''}`;
  out.push(head);
  switch (s.type) {
    case 'explain':
      if (s.title) out.push(`*${s.title}*`);
      out.push(s.body);
      if (s.note) out.push(`> Nota de Equis: ${s.note}`);
      break;
    case 'choice':
      out.push(s.prompt, '');
      s.options.forEach((o, k) => {
        const ok = k === s.answer;
        out.push(`- ${LETTERS[k]}) ${o}${ok ? '  ✅' : `  → ${s.feedback[String(k)] ?? '(sin feedback)'}`}`);
      });
      if (s.explanation) out.push('', `Por qué: ${s.explanation}`);
      break;
    case 'numeric':
      out.push(s.prompt, '', `Respuesta: **${s.answer}**${s.suffix ? ` ${s.suffix}` : ''}`);
      for (const m of s.mistakes ?? []) out.push(`- Si escribe ${m.value} → ${m.feedback}`);
      out.push(`- Otro error → ${s.feedback}`);
      break;
    case 'graph':
      out.push(s.prompt, '', `Familia: ${s.family} · deslizadores: ${s.params.map((p) => `${p.name} ∈ [${p.min}, ${p.max}] paso ${p.step} (parte en ${p.start})`).join('; ')}`);
      out.push(`Objetivo: ${JSON.stringify(s.target)}`, `Si falla → ${s.feedback}`);
      if (s.explanation) out.push(`Por qué: ${s.explanation}`);
      break;
    case 'order':
      out.push(s.prompt, '', ...s.items.map((it, k) => `${k + 1}. ${it}`), `Si falla → ${s.feedback}`);
      break;
    case 'find-error':
      out.push(s.prompt, '', ...s.lines.map((l, k) => `${k + 1}. ${l}${k === s.wrong ? '  ❌ (error)' : ''}`));
      out.push(`Si elige otra → ${s.feedback}`, `Explicación: ${s.explanation}`);
      break;
  }
  if (s.hints?.length) out.push('', `Pistas: ${s.hints.map((h, k) => `(${k + 1}) ${h}`).join(' ')}`);
  if (s.solution?.length) out.push(`Resolución: ${s.solution.join(' → ')}`);
  return [...out, ''];
}

mkdirSync(OUT, { recursive: true });
for (const file of files(LESSONS_DIR)) {
  const unit = UnitContentSchema.parse(JSON.parse(readFileSync(file, 'utf8')));
  const md: string[] = [`# ${unit.unitId}`, '', '> Generado por `npm run content:preview`. No editar a mano: se edita el JSON.', ''];
  for (const l of unit.lessons) {
    md.push(`## ${l.id} · ${l.title} (${l.reviewStatus}, ~${l.estimatedMinutes} min)`, '');
    l.steps.forEach((s, i) => md.push(...step(s, i)));
  }
  md.push('## Mini-clases', '');
  for (const m of unit.miniClasses) {
    md.push(`### ${m.id} · ${m.title} (${m.reviewStatus})`, '');
    for (const c of m.cards) {
      md.push(`- **${c.title ?? ''}** ${c.body}${c.formula ? ` · ${c.formula}` : ''}${c.example ? ` · Ej.: ${c.example.join(' → ')}` : ''}`);
    }
    md.push('');
  }
  const out = join(OUT, `${basename(file, '.json')}.md`);
  writeFileSync(out, md.join('\n'));
  console.log(`→ ${out}`);
}
