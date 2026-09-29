import { type MathNode, parseRich } from './math-parser';

/**
 * Ensayo imprimible en PDF con clavijero (PRD §9, Premium). HTML autocontenido para `expo-print`:
 * la matemática sale del mismo parser que usa `MathText`, así que el papel dice exactamente lo mismo que la app.
 */

export type PrintQuestion = { prompt: string; options: string[]; answer: number; unit?: string };

const LETTERS = 'ABCDE';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function nodeHtml(n: MathNode, prev?: MathNode): string {
  switch (n.type) {
    case 'sym': {
      const v = esc(n.value);
      // Signo unario (al inicio o tras un operador o paréntesis): sin espacios, igual que en MathText.
      const unary = n.role === 'bin' && (!prev || (prev.type === 'sym' && prev.role !== 'ord' && prev.role !== 'close'));
      if ((n.role === 'bin' && !unary) || n.role === 'rel') return `<span class="op">${v}</span>`;
      return /^[a-zA-Z]$/.test(n.value) ? `<i>${v}</i>` : v;
    }
    case 'frac':
      return `<span class="frac"><span class="num">${nodesHtml(n.num)}</span><span class="den">${nodesHtml(n.den)}</span></span>`;
    case 'sqrt':
      return `<span class="sqrt">√<span class="rad">${nodesHtml(n.body)}</span></span>`;
    case 'sup':
      return `${nodeHtml(n.base)}<sup>${nodesHtml(n.exp)}</sup>`;
  }
}

const nodesHtml = (nodes: readonly MathNode[]) => nodes.map((n, i) => nodeHtml(n, nodes[i - 1])).join('');

/** Texto del contenido (prosa + `$…$`) a HTML. Si algo no se puede leer, se imprime el texto tal cual. */
export function richToHtml(src: string): string {
  try {
    return parseRich(src)
      .map((seg) => (seg.kind === 'text' ? esc(seg.value).replace(/\n/g, '<br>') : `<span class="math">${nodesHtml(seg.nodes)}</span>`))
      .join('');
  } catch {
    return esc(src);
  }
}

const CSS = `
@page { size: letter; margin: 16mm 14mm; }
* { box-sizing: border-box; }
body { font-family: 'Poppins', Arial, sans-serif; color: #1E2A4A; font-size: 11.5pt; line-height: 1.45; margin: 0; }
h1 { font-size: 18pt; margin: 0 0 2pt; }
.meta { color: #5B6475; font-size: 10pt; margin-bottom: 10pt; }
.fill { display: flex; gap: 16pt; font-size: 10pt; margin: 6pt 0 12pt; }
.fill span { flex: 1; border-bottom: 1px solid #A9AFBB; padding-bottom: 2pt; }
.rules { border: 1px solid #E7E1D5; border-radius: 6pt; padding: 8pt 10pt; font-size: 10pt; color: #5B6475; margin-bottom: 12pt; }
ol.qs { padding-left: 0; list-style: none; margin: 0; }
.q { break-inside: avoid; page-break-inside: avoid; margin: 0 0 12pt; }
.q .n { font-weight: 600; margin-right: 4pt; }
.opts { margin: 4pt 0 0 18pt; padding: 0; list-style: none; }
.opts li { margin: 2pt 0; }
.opts b { display: inline-block; width: 18pt; font-weight: 600; }
.math { font-family: 'STIX Two Text', 'Times New Roman', serif; font-size: 1.12em; white-space: nowrap; }
.op { padding: 0 0.22em; }
.frac { display: inline-flex; flex-direction: column; vertical-align: middle; text-align: center; margin: 0 0.1em; font-size: 0.92em; }
.frac .num { border-bottom: 1px solid currentColor; padding: 0 0.15em; }
.frac .den { padding: 0 0.15em; }
.sqrt .rad { border-top: 1px solid currentColor; padding: 0 0.1em; }
sup { font-size: 0.7em; }
.key { page-break-before: always; break-before: page; }
.key h2 { font-size: 15pt; margin: 0 0 8pt; }
.grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 4pt 10pt; font-size: 11pt; }
.grid div { border-bottom: 1px dotted #CDD1D8; padding: 2pt 0; }
.grid b { display: inline-block; width: 24pt; }
.foot { color: #5B6475; font-size: 9pt; margin-top: 14pt; text-align: center; }
`;

export function examHtml(opts: { title: string; minutes: number | null; questions: readonly PrintQuestion[]; generatedOn: string }): string {
  const { title, minutes, questions, generatedOn } = opts;
  const items = questions
    .map(
      (q, i) => `<li class="q"><span class="n">${i + 1}.</span>${richToHtml(q.prompt)}
<ul class="opts">${q.options.map((o, k) => `<li><b>${LETTERS[k]})</b>${richToHtml(o)}</li>`).join('')}</ul></li>`,
    )
    .join('\n');
  const key = questions.map((q, i) => `<div><b>${i + 1}.</b>${LETTERS[q.answer] ?? '?'}</div>`).join('');
  return `<!doctype html><html lang="es"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=STIX+Two+Text:ital@0;1&display=swap" rel="stylesheet">
<title>${esc(title)}</title><style>${CSS}</style></head><body>
<h1>${esc(title)}</h1>
<div class="meta">${questions.length} preguntas${minutes ? ` · ${minutes} minutos` : ''} · MePreparo · ${esc(generatedOn)}</div>
<div class="fill"><span>Nombre:</span><span>Fecha:</span><span>Correctas: ____ / ${questions.length}</span></div>
<div class="rules">Marca una sola alternativa por pregunta. No se descuenta por respuestas incorrectas: responde todas.
El clavijero está en la última página; revísalo al terminar.</div>
<ol class="qs">${items}</ol>
<section class="key"><h2>Clavijero</h2><div class="grid">${key}</div>
<div class="foot">Estimación orientativa, no es el puntaje oficial. Revisa cada error en la app: tiene su explicación.</div></section>
</body></html>`;
}
