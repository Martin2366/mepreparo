// Parser de la "Oferta Definitiva de Carreras, Vacantes y Ponderaciones - Admisión 2027" (DEMRE, 24-09-2026).
// - La universidad de cada página se detecta por su título (el índice del PDF no es confiable).
// - Cada texto de la tabla se asigna a la fila (código de carrera) más cercana en Y: robusto a nombres en varias líneas.
// - Las columnas se detectan por página agrupando la X de los valores; las 7 primeras son siempre ponderaciones.
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';
import { writeFileSync } from 'node:fs';

const doc = await getDocument({ url: 'data/oferta2027.pdf', verbosity: 0 }).promise;

async function items(p) {
  const tc = await (await doc.getPage(p)).getTextContent();
  return tc.items
    .filter((it) => 'str' in it && it.str.trim())
    .map((it) => ({ x: Math.round(it.transform[4]), y: Math.round(it.transform[5]), s: it.str.trim() }));
}

// Índice (pág. 2): solo para obtener los 47 nombres oficiales.
const idxRows = [];
for (const i of (await items(2)).sort((a, b) => b.y - a.y)) {
  const row = idxRows.find((r) => Math.abs(r.y - i.y) <= 4);
  if (row) row.its.push(i);
  else idxRows.push({ y: i.y, its: [i] });
}
const unis = [];
for (const { its } of idxRows) {
  its.sort((a, b) => a.x - b.x);
  const num = its.find((i) => i.x < 110 && /^\d+$/.test(i.s));
  const page = its.find((i) => i.x > 480 && /^\d+$/.test(i.s));
  if (!num || !page) continue;
  unis.push({ n: Number(num.s), name: its.filter((i) => i.x >= 110 && i.x < 480).map((i) => i.s).join(' ') });
}
unis.sort((a, b) => a.n - b.n);
if (unis.length !== 47) throw new Error(`índice: ${unis.length} universidades`);

const norm = (t) =>
  t
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/[^A-Z ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
const STOP = new Set(['DE', 'DEL', 'LA', 'LAS', 'LOS', 'Y', 'UNIVERSIDAD']);
const ALIAS = { CS: 'CIENCIAS' };
const key = (t) => new Set(norm(t).map((x) => ALIAS[x] ?? x).filter((x) => !STOP.has(x)));
const uniWords = unis.map((u) => key(u.name));
// Coincide si el título contiene todas las palabras significativas del nombre oficial, o al revés
// (títulos abreviados: "Universidad Central", "Universidad Federico Santa María"). Gana la más específica.
function uniOfHeader(text) {
  const w = key(text);
  if (w.size === 0) return null;
  let best = null;
  let bestExtra = Infinity;
  uniWords.forEach((set, i) => {
    const officialInTitle = [...set].every((x) => w.has(x));
    const titleInOfficial = [...w].every((x) => set.has(x));
    if (!officialInTitle && !titleInOfficial) return;
    const extra = Math.abs(set.size - w.size);
    if (extra < bestExtra) [best, bestExtra] = [i, extra];
  });
  return best;
}

const num = (s) => (/^-*$/.test(s) ? null : Number(s.replace(/\./g, '').replace(',', '.')));
const isVal = (s) => /^(\d+([.,]\d+)?|-{2,}|SI|NO)$/.test(s);

const careers = [];
const problems = [];
let current = null;
for (let p = 3; p <= doc.numPages; p++) {
  const its = (await items(p)).filter((i) => i.x < 730);
  const codes = its.filter((i) => i.x >= 68 && i.x <= 82 && /^\d{5}$/.test(i.s));
  const top = codes.length ? Math.max(...codes.map((c) => c.y)) + 16 : 0;
  // Título de la universidad: textos arriba a la izquierda (x≈65), por sobre la tabla.
  const title = its
    .filter((i) => i.x <= 70 && i.y > Math.max(top, 520))
    .sort((a, b) => b.y - a.y)
    .map((i) => i.s)
    .join(' ');
  const found = title ? uniOfHeader(title) : null;
  if (found !== null) current = found;
  if (codes.length === 0 || current === null) continue;

  const rows = codes.map((c) => ({ code: c.s, y: c.y, parts: [] }));
  const minY = Math.min(...codes.map((c) => c.y)) - 16;
  for (const i of its) {
    if (codes.includes(i) || i.y < minY || i.y > top) continue;
    let best = null;
    let d = Infinity;
    for (const r of rows) if (Math.abs(r.y - i.y) < d) [best, d] = [r, Math.abs(r.y - i.y)];
    if (d <= 14) best.parts.push(i);
  }

  const lugar = its.find((i) => /^LUGAR/.test(i.s) && i.y > top);
  const placeX = lugar ? lugar.x - 8 : 295;
  const valXs = rows
    .flatMap((r) => r.parts.filter((i) => i.x > placeX && isVal(i.s)).map((i) => i.x))
    .sort((a, b) => a - b);
  const clusters = [];
  for (const x of valXs) {
    const c = clusters.at(-1);
    if (c && x - c.max <= 8) {
      c.max = x;
      c.xs.push(x);
    } else clusters.push({ min: x, max: x, xs: [x] });
  }
  const cols = clusters.filter((c) => c.xs.length >= Math.max(1, rows.length * 0.5));
  const header = its.filter((i) => i.y > top).map((i) => i.s).join(' ');
  const ORDER = ['nem', 'ranking', 'lectora', 'm1', 'historia', 'ciencias', 'm2'];
  if (header.includes('PRUEBA ESPECIAL')) ORDER.push('especial');
  if (cols.length < ORDER.length) {
    problems.push({ page: p, university: unis[current].n, clusters: cols.length, codes: codes.length });
    continue;
  }
  const firstValX = cols[0].min;
  const colAt = (x) => {
    const i = cols.findIndex((c) => x >= c.min - 3 && x <= c.max + 3);
    return i >= 0 && i < ORDER.length ? ORDER[i] : null;
  };

  for (const r of rows) {
    const byPos = (a, b) => b.y - a.y || a.x - b.x;
    const name = r.parts.filter((i) => i.x >= 100 && i.x < placeX).sort(byPos).map((i) => i.s).join(' ');
    const place = r.parts
      .filter((i) => i.x >= placeX && i.x < firstValX - 4 && !isVal(i.s))
      .sort(byPos)
      .map((i) => i.s)
      .join(' ');
    const v = {};
    for (const i of r.parts.filter((i) => i.x >= firstValX - 4)) {
      if (i.s === 'o') v.o = 'o';
      else {
        const k = colAt(i.x);
        if (k) v[k] = i.s;
      }
    }
    const w = {};
    for (const k of ['nem', 'ranking', 'lectora', 'm1', 'm2', 'historia', 'ciencias', 'especial']) {
      w[k] = v[k] === 'SI' ? null : num(v[k] ?? '');
    }
    const base = (w.nem ?? 0) + (w.ranking ?? 0) + (w.lectora ?? 0) + (w.m1 ?? 0) + (w.m2 ?? 0) + (w.especial ?? 0);
    const both = w.historia != null && w.ciencias != null;
    const eitherOr =
      v.o === 'o' || (both && base + Math.max(w.historia, w.ciencias) === 100 && base + w.historia + w.ciencias !== 100);
    const sum = base + (eitherOr ? Math.max(w.historia ?? 0, w.ciencias ?? 0) : (w.historia ?? 0) + (w.ciencias ?? 0));
    const c = {
      code: r.code,
      university: unis[current].n,
      name: name.replace(/\s+/g, ' ').trim(),
      place: place.replace(/\s+/g, ' ').trim(),
      weights: w,
      historiaOCiencias: eitherOr,
      especialRequerida: v.especial === 'SI' || (w.especial ?? 0) > 0,
      page: p,
    };
    if (sum !== 100) problems.push({ code: c.code, university: c.university, name: c.name, sum, page: p });
    else careers.push(c);
  }
}

// Un código puede repetirse (p. ej. en notas); se conserva la primera fila válida.
const seen = new Set();
const unique = careers.filter((c) => !seen.has(c.code) && seen.add(c.code));
writeFileSync('data/demre2027.json', JSON.stringify({ universities: unis, careers: unique }, null, 1));
const per = {};
for (const c of unique) per[c.university] = (per[c.university] ?? 0) + 1;
console.log('universidades', unis.length, 'carreras válidas', unique.length, 'problemas', problems.length);
console.log(unis.map((u) => `${u.n}:${per[u.n] ?? 0}`).join(' '));
for (const p of problems.slice(0, 10)) console.log(JSON.stringify(p));
