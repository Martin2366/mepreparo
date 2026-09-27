// Genera src/content/admission/*.json a partir de fuentes OFICIALES:
//  - DEMRE: Oferta Definitiva de Carreras, Vacantes y Ponderaciones, Admisión 2027 (24-09-2026) → data/demre2027.json
//  - SIES/Mineduc: Oferta Académica 2026 (05-06-2026) → toda la oferta de IP, CFT, FF.AA. y universidades sin DEMRE
//  - Universidad de Chile: puntajes de ingreso Admisión 2026 (último seleccionado)
//  - Pontificia Universidad Católica: puntajes últimos matriculados Admisión 2026
//
// Uso (desde scripts/admission/, con `npm i xlsx pdfjs-dist@4` en una carpeta temporal o global):
//   1. Descargar las fuentes a scripts/admission/data/ (ignorada por git):
//      oferta2027.pdf  ← demre.cl/publicaciones/pdf/2027-26-09-24-oferta-definitiva-carreras-p2027.pdf
//      sies2026.xlsx   ← mifuturo.cl/wp-content/uploads/2026/06/Oferta_Academica_2026_SIES_05_06_2026_WEB_E.xlsx
//      uch2026.html    ← uchile.cl/admision-y-matriculas/admision-regular-pregrado/puntajes-de-ingreso
//      uc2026.pdf      ← admision.uc.cl/…/Puntajes-Ultimos-Matriculados-2026.pdf
//   2. node parse-demre.mjs && node build-admission.mjs
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const require = createRequire(import.meta.url);
const X = require('xlsx');
const OUT = fileURLToPath(new URL('../../src/content/admission', import.meta.url));
mkdirSync(OUT, { recursive: true });

const strip = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
const fold = (s) => strip(s).toUpperCase().replace(/[^A-Z0-9]+/g, ' ').trim();

// ---------- Datos base ----------
const demre = JSON.parse(readFileSync('data/demre2027.json', 'utf8'));
const wb = X.readFile('data/sies2026.xlsx', { dense: true });
const sies = X.utils
  .sheet_to_json(wb.Sheets.in, { defval: '' })
  .filter((r) => r['Nivel Global'] === 'Pregrado' && String(r.Vigencia).startsWith('Vigente con'));
const siesByDemre = new Map(sies.filter((r) => Number(r.Demre) > 0).map((r) => [String(r.Demre), r]));

// ---------- Diccionario de tildes (desde los nombres DEMRE, que sí traen tildes) ----------
const accentWords = new Map();
const addAccent = (w) => {
  const k = strip(w).toUpperCase();
  if (k !== w.toUpperCase()) accentWords.set(k, w.toUpperCase());
};
for (const c of demre.careers) for (const w of `${c.name} ${c.place}`.split(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/)) if (w) addAccent(w);
for (const u of demre.universities) for (const w of u.name.split(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+/)) if (w) addAccent(w);
// Palabras frecuentes en carreras técnicas que no aparecen en la oferta DEMRE.
for (const w of `TÉCNICO TÉCNICA TÉCNICOS ELÉCTRICA ELÉCTRICO ELECTRÓNICA ELECTRÓNICO MECÁNICA MECÁNICO INFORMÁTICA INFORMÁTICO
  LOGÍSTICA GASTRONOMÍA GASTRONÓMICO ADMINISTRACIÓN COMUNICACIÓN PRODUCCIÓN CONSTRUCCIÓN AUTOMATIZACIÓN INSTRUMENTACIÓN
  MANTENCIÓN MANTENCIÓN REFRIGERACIÓN CLIMATIZACIÓN PREVENCIÓN ANIMACIÓN ILUSTRACIÓN FOTOGRAFÍA AUDIOVISUAL ODONTOLÓGICO
  ODONTOLÓGICA FARMACÉUTICO FARMACÉUTICA QUÍMICO QUÍMICA MÚSICA MÚSICO ENERGÍA ENERGÍAS TELECOMUNICACIONES METALÚRGICA
  AGRÍCOLA PECUARIA GEOLOGÍA TOPOGRAFÍA HOTELERÍA TURÍSTICO TURÍSTICA ECOTURISMO ESTÉTICA COSMETOLOGÍA PODOLOGÍA ÓPTICA
  RADIOLOGÍA LABORATORIO CLÍNICO CLÍNICA ENFERMERÍA PARAMÉDICO FISIOTERAPIA ANÁLISIS PROGRAMACIÓN COMPUTACIÓN DISEÑO
  ARQUITECTÓNICO GRÁFICO GRÁFICA INDUSTRIAL MINERÍA MÁQUINAS MARÍTIMA MARÍTIMO NÁUTICA AERONÁUTICA AERONÁUTICO VETERINARIA
  PÚBLICA PÚBLICO GESTIÓN OPERACIÓN OPERACIONES ELECTRICIDAD HIDRÁULICA NEUMÁTICA ROBÓTICA INTELIGENCIA CIBERSEGURIDAD
  EDUCACIÓN PARVULARIA ASISTENTE PEDAGOGÍA CONTABILIDAD TRIBUTARIA ECONOMÍA JURÍDICO JURÍDICA TRADUCCIÓN INTERPRETACIÓN
  LINGÜÍSTICA INGLÉS ALEMÁN FRANCÉS JAPONÉS COMERCIO EXPORTACIÓN IMPORTACIÓN SECRETARIADO BIBLIOTECOLOGÍA DOCUMENTACIÓN
  ACUICULTURA PESQUERA OCEANOGRAFÍA MEDIOAMBIENTE AMBIENTAL SUSTENTABILIDAD CIRCUNSCRIPCIÓN POLICÍA INVESTIGACIÓN
  CRIMINALÍSTICA AVIACIÓN ESPECIALIDADES PÚBLICAS CÁLCULO ESTADÍSTICA MATEMÁTICA FÍSICA BIOLOGÍA ESPAÑOL CASTELLANO
  PSICOLOGÍA SOCIOLOGÍA ANTROPOLOGÍA TEOLOGÍA FILOSOFÍA HISTORIA GEOGRAFÍA PERIODISMO PUBLICIDAD RELACIONES DERECHO
  ÁREA ÁREAS MENCIÓN MENCIONES INGENIERÍA GESTIÓN VESPERTINO DIURNO ONLINE CONTINUIDAD SEÑALÉTICA PASTELERÍA PANADERÍA
  REPOSTERÍA COCINA CULINARIA VITIVINICULTURA ENOLOGÍA AGRONOMÍA FORESTAL ZOOTECNIA APICULTURA ORTOPEDIA ÓRTESIS PRÓTESIS
  ACÚSTICA SONIDO ILUMINACIÓN ESCENOGRAFÍA ACTUACIÓN TEATRO DANZA COREOGRAFÍA CINEMATOGRAFÍA EDICIÓN POSTPRODUCCIÓN
  VIDEOJUEGOS DIGITAL INFORMACIÓN SISTEMAS REDES CONECTIVIDAD SOFTWARE DATOS ANALÍTICA MARKETING RECURSOS HUMANOS
  TRABAJO SOCIAL TERAPIA OCUPACIONAL KINESIOLOGÍA NUTRICIÓN DIETÉTICA FONOAUDIOLOGÍA OBSTETRICIA PUERICULTURA TECNOLOGÍA
  TECNOLÓGICO TECNOLÓGICA MÉDICA MÉDICO QUIRÚRGICO QUIRÚRGICA INSTRUMENTACIÓN ESTERILIZACIÓN URGENCIAS RESCATE
  EMERGENCIAS FARMACIA DROGUERÍA ADMINISTRATIVO ADMINISTRATIVA LOGÍSTICO CONTROL CALIDAD PROCESOS ALIMENTOS
  AUTOMOTRIZ MAQUINARIA PESADA ELECTROMECÁNICA ELECTROMECÁNICO SOLDADURA METALMECÁNICA MATRICERÍA MECATRÓNICA
  BIOTECNOLOGÍA BIOQUÍMICA GEOMENSURA CARTOGRAFÍA GEOMÁTICA ÉNFASIS ESPECIALIZACIÓN PRÁCTICA PRÁCTICO
  POLITÉCNICA POLITÉCNICO CICERÓN TITULACIÓN ACADÉMICO ACADÉMICA ESTRATÉGICOS POLÍTICOS POLÍTICA POLÍTICAS AVIACIÓN
  CAPACITACIÓN AERONÁUTICA ÁVALOS IBÁÑEZ SEPÚLVEDA REGIÓN ANTÁRTICA ARAUCANÍA AYSÉN TARAPACÁ BÍO LIBERTADOR
  CONCHALÍ PEÑALOLÉN ESTACIÓN PUCÓN HUALPÉN UNIÓN TOMÉ CHAITÉN MAULLÍN PITRUFQUÉN CURACAUTÍN VICUÑA CAÑETE
  CONSTITUCIÓN MACHALÍ REQUÍNOA PICHIDEGUA RÍO BUÍN PAINE ALHUÉ QUILICURA HUECHURABA MAIPÚ QUILPUÉ CONCEPCIÓN
  CHILLÁN ÁNGELES JOAQUÍN MIGUEL RAMÓN VALPARAÍSO COPIAPÓ CURICÓ VALDIVIA OSORNO PUERTO ÑUÑOA LEÓN JOSÉ MARÍA
  JESÚS PARÍS INGLÉS ARTÍSTICO ARTÍSTICA EXPRESIÓN CORPORAL MÚSICA PIANO CANTO GUITARRA`.split(/\s+/))
  if (w) addAccent(w);

const LOWER = new Set(['DE', 'DEL', 'LA', 'LAS', 'EL', 'LOS', 'Y', 'E', 'EN', 'O', 'U', 'A', 'AL', 'CON', 'PARA', 'POR', 'SU', 'SUS']);
const UPPER = new Set(['UC', 'TIC', 'TI', 'LBI', 'II', 'III', 'IV', 'PDI', 'ANEPE', 'CFT', 'IP', 'UCN', 'PUCV', 'DUOC', 'INACAP', 'AIEP', 'IACC', 'IPG', 'ENAC', 'CEDUC', 'INSALCO', 'UNIACC', 'SEK', 'EATRI', 'IPLACEX', 'MC', 'BEA', 'PACE', 'TP', 'RR', 'HH', 'UV', 'USM', 'UBB', 'UTEM', 'UFT']);
function titleCase(raw) {
  const words = raw.replace(/\s+/g, ' ').trim().split(' ');
  return words
    .map((w, i) => {
      const bare = w.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, '');
      const up = strip(bare).toUpperCase();
      if (UPPER.has(up)) return w.toUpperCase();
      let word = w.toUpperCase();
      // Restaura tildes palabra por palabra (solo letras; conserva puntuación).
      word = word.replace(/[A-ZÁÉÍÓÚÜÑ]+/g, (m) => accentWords.get(strip(m)) ?? m);
      word = word.toLowerCase();
      if (i > 0 && LOWER.has(up) && !/^\(/.test(w)) return word;
      // Mayúscula tras inicio, guion, apóstrofo o paréntesis: "Bío-Bío", "O’Higgins", "(Villarrica)".
      return word.replace(/(^|[-’'(\/])([a-záéíóúüñ])/g, (m, a, b) => a + b.toUpperCase());
    })
    .join(' ')
    .replace(/\bcs\./gi, 'Cs.');
}

const cleanCareer = (s) =>
  s
    .replace(/\((\d+|PE|\*+)\)/g, ' ')
    .replace(/\s*\*+\s*/g, ' ')
    .replace(/[¹²³⁴⁵⁶⁷⁸⁹⁰]/g, '')
    .replace(/\s+,/g, ',')
    .replace(/\s+/g, ' ')
    .trim();

// ---------- Universidades DEMRE ↔ SIES ----------
const siesIesOfDemreUni = new Map();
const iesCodeOf = new Map();
for (const u of demre.universities) {
  const votes = new Map();
  for (const c of demre.careers.filter((c) => c.university === u.n)) {
    const r = siesByDemre.get(c.code);
    if (r) votes.set(r['Nombre IES'], (votes.get(r['Nombre IES']) ?? 0) + 1);
  }
  const top = [...votes].sort((a, b) => b[1] - a[1])[0];
  if (!top) throw new Error(`Sin cruce SIES para ${u.name}`);
  siesIesOfDemreUni.set(u.n, top[0]);
  iesCodeOf.set(u.n, sies.find((r) => r['Nombre IES'] === top[0])['Código IES']);
}
const demreUniOfSiesIes = new Map([...siesIesOfDemreUni].map(([n, ies]) => [ies, n]));

// Siglas usadas por estudiantes para buscar.
const SIGLAS = {
  'PONTIFICIA UNIVERSIDAD CATOLICA DE CHILE': 'UC PUC',
  'PONTIFICIA UNIVERSIDAD CATOLICA DE VALPARAISO': 'PUCV',
  'UNIVERSIDAD ACADEMIA DE HUMANISMO CRISTIANO': 'UAHC',
  'UNIVERSIDAD ADOLFO IBANEZ': 'UAI',
  'UNIVERSIDAD ADVENTISTA DE CHILE': 'UNACH',
  'UNIVERSIDAD ALBERTO HURTADO': 'UAH',
  'UNIVERSIDAD ANDRES BELLO': 'UNAB',
  'UNIVERSIDAD ARTURO PRAT': 'UNAP',
  'UNIVERSIDAD AUSTRAL DE CHILE': 'UACH',
  'UNIVERSIDAD AUTONOMA DE CHILE': 'UA',
  'UNIVERSIDAD BERNARDO O HIGGINS': 'UBO',
  'UNIVERSIDAD CATOLICA DE LA SANTISIMA CONCEPCION': 'UCSC',
  'UNIVERSIDAD CATOLICA DE TEMUCO': 'UCT',
  'UNIVERSIDAD CATOLICA DEL MAULE': 'UCM',
  'UNIVERSIDAD CATOLICA DEL NORTE': 'UCN',
  'UNIVERSIDAD CATOLICA SILVA HENRIQUEZ': 'UCSH',
  'UNIVERSIDAD CENTRAL DE CHILE': 'UCEN',
  'UNIVERSIDAD DE ANTOFAGASTA': 'UA UANTOF',
  'UNIVERSIDAD DE ATACAMA': 'UDA',
  'UNIVERSIDAD DE AYSEN': 'UAYSEN',
  'UNIVERSIDAD DE CHILE': 'UCH UCHILE',
  'UNIVERSIDAD DE CONCEPCION': 'UDEC',
  'UNIVERSIDAD DE LA FRONTERA': 'UFRO',
  'UNIVERSIDAD DE LA SERENA': 'ULS',
  'UNIVERSIDAD DE LAS AMERICAS': 'UDLA',
  'UNIVERSIDAD DE LOS ANDES': 'UANDES',
  'UNIVERSIDAD DE LOS LAGOS': 'ULAGOS',
  'UNIVERSIDAD DE MAGALLANES': 'UMAG',
  'UNIVERSIDAD DE O HIGGINS': 'UOH',
  'UNIVERSIDAD DE PLAYA ANCHA': 'UPLA',
  'UNIVERSIDAD DE SANTIAGO DE CHILE': 'USACH',
  'UNIVERSIDAD DE TALCA': 'UTALCA',
  'UNIVERSIDAD DE TARAPACA': 'UTA',
  'UNIVERSIDAD DE VALPARAISO': 'UV UVALPO',
  'UNIVERSIDAD DEL ALBA': 'UDALBA',
  'UNIVERSIDAD DEL BIO BIO': 'UBB',
  'UNIVERSIDAD DEL DESARROLLO': 'UDD',
  'UNIVERSIDAD DIEGO PORTALES': 'UDP',
  'UNIVERSIDAD FINIS TERRAE': 'UFT',
  'UNIVERSIDAD GABRIELA MISTRAL': 'UGM',
  'UNIVERSIDAD MAYOR': 'UMAYOR',
  'UNIVERSIDAD METROPOLITANA DE CS DE LA EDUCACION': 'UMCE',
  'UNIVERSIDAD SAN SEBASTIAN': 'USS',
  'UNIVERSIDAD SANTO TOMAS': 'UST',
  'UNIVERSIDAD TECNICA FEDERICO SANTA MARIA': 'USM UTFSM',
  'UNIVERSIDAD TECNOLOGICA METROPOLITANA': 'UTEM',
  'UNIVERSIDAD VINA DEL MAR': 'UVM',
  'UNIVERSIDAD DE ACONCAGUA': 'UAC',
  'UNIVERSIDAD DE ARTES CIENCIAS Y COMUNICACION UNIACC': 'UNIACC',
  'UNIVERSIDAD MIGUEL DE CERVANTES': 'UMC',
  'UNIVERSIDAD SEK': 'SEK',
  'IP DUOC UC': 'DUOC',
  'IP INACAP': 'INACAP',
  'IP AIEP': 'AIEP',
  'IP DE CHILE': 'IPCHILE',
  'IP SANTO TOMAS': 'IPST',
  'IP DR VIRGINIO GOMEZ G': 'IPVG',
  'IP LATINOAMERICANO DE COMERCIO EXTERIOR IPLACEX': 'IPLACEX',
};

// Nombres visibles de instituciones que no están en DEMRE (SIES viene en mayúsculas y sin tildes).
function displayInstitution(siesName) {
  const n = siesName
    .replace(/^IP /, 'Instituto Profesional ')
    .replace(/^CFT /, 'Centro de Formación Técnica ');
  return titleCase(n)
    .replace(/Instituto Profesional Ip\b/i, 'Instituto Profesional')
    .replace(/\bDuoc Uc\b/i, 'Duoc UC')
    .replace(/\bCeduc - Ucn\b/i, 'CEDUC UCN')
    .replace(/\bPucv\b/i, 'PUCV');
}
const SHORT = {
  'IP DUOC UC': 'Duoc UC',
  'IP INACAP': 'INACAP',
  'IP AIEP': 'AIEP',
  'IP DE CHILE': 'IPChile',
  'IP IACC': 'IACC',
};
// Nombre corto natural (atajos y botón "Elegir …") para las universidades más buscadas.
const SHORT_UNI = {
  'PONTIFICIA UNIVERSIDAD CATOLICA DE CHILE': 'UC',
  'UNIVERSIDAD DE CHILE': 'U. de Chile',
  'UNIVERSIDAD DE SANTIAGO DE CHILE': 'USACH',
  'UNIVERSIDAD DE CONCEPCION': 'UdeC',
  'UNIVERSIDAD TECNICA FEDERICO SANTA MARIA': 'USM',
  'UNIVERSIDAD DE VALPARAISO': 'UV',
  'PONTIFICIA UNIVERSIDAD CATOLICA DE VALPARAISO': 'PUCV',
  'UNIVERSIDAD DIEGO PORTALES': 'UDP',
  'UNIVERSIDAD ADOLFO IBANEZ': 'UAI',
  'UNIVERSIDAD DE LOS ANDES': 'UANDES',
  'UNIVERSIDAD AUSTRAL DE CHILE': 'UACh',
  'UNIVERSIDAD DE LA FRONTERA': 'UFRO',
  'UNIVERSIDAD DE TALCA': 'UTALCA',
};

// ---------- Categorías ----------
const G_ESTATAL = 'Universidades estatales';
const G_CRUCH = 'Universidades privadas del Consejo de Rectores';
const G_PRIV = 'Universidades privadas del Sistema de Acceso';
const G_PROPIA = 'Universidades con admisión propia';
const G_IP = 'Institutos profesionales';
const G_CFT = 'Centros de formación técnica';
const G_FFAA = 'Fuerzas Armadas y de Orden';
const CATEGORY_ORDER = [G_ESTATAL, G_CRUCH, G_PRIV, G_PROPIA, G_IP, G_CFT, G_FFAA];

function categoryOf(r, inDemre) {
  const t3 = r['Tipo Institución 3'];
  if (t3 === 'Universidades Estatales CRUCH') return G_ESTATAL;
  if (t3 === 'Universidades Privadas CRUCH') return G_CRUCH;
  if (t3 === 'Universidades Privadas') return inDemre ? G_PRIV : G_PROPIA;
  if (t3 === 'Institutos Profesionales') return G_IP;
  if (t3.startsWith('Centros de Formación Técnica')) return G_CFT;
  if (t3 === 'FFAA') return G_FFAA;
  return null;
}

// ---------- Carreras DEMRE ----------
const areaOf = (r) => (r ? r['Área del conocimiento'] : '') || 'Otras áreas';
const AREA_NAMES = {
  Salud: 'Salud',
  Tecnología: 'Ingeniería y tecnología',
  Educación: 'Educación',
  'Ciencias Sociales': 'Ciencias sociales',
  'Administración y Comercio': 'Administración y negocios',
  'Arte y Arquitectura': 'Arte, diseño y arquitectura',
  Humanidades: 'Humanidades',
  Derecho: 'Derecho',
  'Ciencias Básicas': 'Ciencias',
  Agropecuaria: 'Agro y medioambiente',
  'Otras áreas': 'Otras áreas',
};
const niceArea = (a) => AREA_NAMES[a] ?? a;

const PLACE_WORDS = new Set(['CAMPUS', 'SEDE', 'CASA', 'CENTRAL', 'REGION', 'METROPOLITANA', 'MACUL', 'JOAQUIN', 'CABEZAS', 'GARCIA']);
for (const c of demre.careers) for (const w of fold(c.place).split(' ')) if (w.length > 2 && !LOWER.has(w)) PLACE_WORDS.add(w);
for (const r of sies) for (const w of fold(r['Comuna Sede']).split(' ')) if (w.length > 2 && !LOWER.has(w)) PLACE_WORDS.add(w);

// Nombres propios con artículo en mayúscula (así los escriben las propias instituciones).
const UNI_NAME_FIX = {
  'Universidad de la Serena': 'Universidad de La Serena',
  'Universidad de la Frontera': 'Universidad de La Frontera',
  'Universidad de las Américas': 'Universidad de Las Américas',
  'Universidad de los Lagos': 'Universidad de Los Lagos',
  'Universidad Metropolitana de Cs. de la Educación': 'Universidad Metropolitana de Ciencias de la Educación',
};
const fixInstitution = (n) =>
  n
    .replace(/Profesional los Leones/, 'Profesional Los Leones')
    .replace(/Región de los Lagos/, 'Región de Los Lagos')
    .replace(/Región de los Rios/, 'Región de Los Ríos')
    .replace(/Región de la Araucanía/, 'Región de La Araucanía')
    .replace(/Chileno Britanico/, 'Chileno Británico')
    .replace(/Virginio Gomez/, 'Virginio Gómez')
    .replace(/del Futbol/, 'del Fútbol')
    .replace(/Capitan Manuel/, 'Capitán Manuel')
    .replace(/San Agustin/, 'San Agustín');

const institutions = [];
const careers = [];
let uniMismatch = 0;
for (const u of demre.universities) {
  const siesName = siesIesOfDemreUni.get(u.n);
  const sample = sies.find((r) => r['Nombre IES'] === siesName);
  const id = `ies${iesCodeOf.get(u.n)}`;
  institutions.push({
    id,
    name: UNI_NAME_FIX[titleCase(u.name)] ?? titleCase(u.name),
    short: SHORT_UNI[fold(u.name)] ?? SHORT[siesName] ?? null,
    search: SIGLAS[fold(u.name)] ?? SIGLAS[siesName] ?? '',
    category: categoryOf(sample, true),
    region: sample?.['Región Sede'] ?? '',
    paes: true,
  });
}
for (const c of demre.careers) {
  const r = siesByDemre.get(c.code);
  let uniN = c.university;
  if (r && demreUniOfSiesIes.has(r['Nombre IES']) && demreUniOfSiesIes.get(r['Nombre IES']) !== c.university) {
    uniMismatch++;
    uniN = demreUniOfSiesIes.get(r['Nombre IES']);
  }
  let name = cleanCareer(c.name);
  let place = c.place;
  // Quita palabras de lugar que se colaron al nombre ("ARQUITECTURA CENTRAL", "CAMPUS INGENIERÍA CIVIL",
  // "… CAMPUS MACUL …"). Con SIES se protege todo lo que sí está en el nombre oficial.
  const siesWords = new Set(r ? fold(r['Nombre Carrera']).split(' ') : []);
  if (r || !place) {
    name = name
      .split(' ')
      .filter((t) => {
        const f = fold(t);
        return !f || siesWords.has(f) || !PLACE_WORDS.has(f);
      })
      .join(' ');
  }
  // Nombres largos tipo "AGRONOMÍA, LICENCIATURA EN AGRONOMÍA": se muestra la carrera; el grado va aparte.
  const paren = name.match(/\((DAMAS|VARONES|DIURNO|VESPERTINO)\)/)?.[0];
  name = name.replace(/,\s*(LICENCIATURA|LIC\.).*$/i, '');
  if (paren && !name.includes(paren)) name = `${name} ${paren}`;
  // Si la celda del PDF perdió el comienzo del nombre, manda el nombre oficial SIES.
  if (r && fold(name).split(' ')[0] !== fold(r['Nombre Carrera']).split(' ')[0]) {
    name = r['Nombre Carrera'].replace(/\s+CON MENCION$/i, '');
  }
  // Sede: comuna oficial (SIES), con tildes restauradas.
  if (r) place = r['Comuna Sede'];
  const w = c.weights;
  careers.push({
    id: c.code,
    inst: `ies${iesCodeOf.get(uniN)}`,
    name: titleCase(name.replace(/[,\s]+$/, '')),
    place: place ? titleCase(place) : r ? titleCase(r['Comuna Sede']) : '',
    area: niceArea(areaOf(r)),
    w: {
      nem: w.nem ?? 0,
      ranking: w.ranking ?? 0,
      lectora: w.lectora ?? 0,
      m1: w.m1 ?? 0,
      m2: w.m2 ?? 0,
      historia: w.historia ?? 0,
      ciencias: w.ciencias ?? 0,
      especial: w.especial ?? 0,
    },
    hoc: c.historiaOCiencias || undefined,
  });
}

// Sede faltante: la más común de la misma institución.
for (const c of careers.filter((c) => !c.place)) {
  const counts = new Map();
  for (const o of careers) if (o.inst === c.inst && o.place) counts.set(o.place, (counts.get(o.place) ?? 0) + 1);
  c.place = [...counts].sort((x, y) => y[1] - x[1])[0]?.[0] ?? '';
}

// ---------- Instituciones y carreras fuera de DEMRE (SIES) ----------
const others = new Map();
for (const r of sies) {
  const ies = r['Nombre IES'];
  if (demreUniOfSiesIes.has(ies)) continue;
  const cat = categoryOf(r, false);
  if (!cat) continue;
  if (!others.has(ies)) others.set(ies, { cat, rows: [] });
  others.get(ies).rows.push(r);
}
const slug = (s) => fold(s).toLowerCase().replace(/ /g, '-');
for (const [ies, { cat, rows }] of [...others].sort()) {
  const id = `ies${rows[0]['Código IES']}`;
  institutions.push({
    id,
    name: fixInstitution(displayInstitution(ies)),
    short: SHORT[ies] ?? null,
    search: SIGLAS[ies] ?? SIGLAS[fold(ies)] ?? '',
    category: cat,
    region: rows[0]['Región Sede'],
    paes: false,
  });
  const byName = new Map();
  // Solo programas de ingreso directo desde la enseñanza media (sin planes especiales ni de continuidad).
  for (const r of rows.filter((r) => r['Tipo Carrera'] === 'Plan Regular' && r['Requisito Ingreso'] === 'Educación Media')) {
    const nm = titleCase(cleanCareer(r['Nombre Carrera']));
    if (!byName.has(nm)) byName.set(nm, { name: nm, area: niceArea(areaOf(r)), places: new Set() });
    byName.get(nm).places.add(titleCase(r['Comuna Sede']));
  }
  for (const v of byName.values()) {
    const places = [...v.places].sort((a, b) => a.localeCompare(b, 'es'));
    careers.push({ id: `${id}-${slug(v.name)}`, inst: id, name: v.name, place: places.length > 2 ? `${places.length} sedes` : places.join(' · '), area: v.area });
  }
}

// ---------- Puntajes de corte oficiales (Admisión 2026) ----------
const cuts = {};
// Universidad de Chile: tabla HTML con código DEMRE.
{
  const h = readFileSync('data/uch2026.html', 'latin1');
  const dec = (s) =>
    s
      .replace(/&nbsp;/g, ' ')
      .replace(/&([aeiouAEIOU])acute;/g, (m, c) => ({ a: 'á', e: 'é', i: 'í', o: 'ó', u: 'ú', A: 'Á', E: 'É', I: 'Í', O: 'Ó', U: 'Ú' })[c])
      .replace(/&[Nn]tilde;/g, 'ñ')
      .replace(/&amp;/g, '&');
  for (const m of h.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...m[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map((c) => dec(c[1].replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim());
    if (cells.length >= 4 && /^\d{5}$/.test(cells[0])) {
      const v = Number(cells[3].replace(/\./g, '').replace(',', '.'));
      if (v > 0) cuts[cells[0]] = { score: v, kind: 'seleccionado', year: 2026, source: 'Universidad de Chile' };
    }
  }
}
// UC: PDF sin códigos → se cruza por nombre con la oferta DEMRE de la PUC (u1).
{
  const doc = await getDocument({ url: 'data/uc2026.pdf', verbosity: 0 }).promise;
  const ucRows = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const its = (await (await doc.getPage(p)).getTextContent()).items
      .filter((i) => 'str' in i && i.str.trim())
      .map((i) => ({ x: Math.round(i.transform[4]), y: Math.round(i.transform[5]), s: i.str.trim() }));
    const nums = its.filter((i) => i.x >= 180 && i.x <= 200 && /^\d+(,\d+)?$/.test(i.s));
    const rows = nums.map((n) => ({ y: n.y, score: Number(n.s.replace(',', '.')), parts: [] }));
    for (const i of its.filter((i) => i.x < 100)) {
      let best = null;
      let d = Infinity;
      for (const r of rows) if (Math.abs(r.y - i.y) < d) [best, d] = [r, Math.abs(r.y - i.y)];
      if (best && d <= 30) best.parts.push(i);
    }
    for (const r of rows) {
      let name = '';
      for (const part of r.parts.sort((a, b) => b.y - a.y)) {
        const s = part.s.replace(/[¹²³⁴⁵⁶⁷⁸⁹⁰]/g, '');
        name = name && /[a-záéíóúñ]$/i.test(name) && /^[a-záéíóúñ]/.test(s) ? name + s : `${name} ${s}`;
      }
      ucRows.push({ name: name.trim(), score: r.score });
    }
  }
  const key = (s) => strip(s).toLowerCase().replace(/[^a-z]/g, '');
  const pucByKey = new Map(careers.filter((c) => c.inst === `ies${iesCodeOf.get(1)}`).map((c) => [key(c.name), c]));
  let matched = 0;
  const unmatched = [];
  for (const r of ucRows) {
    const c = pucByKey.get(key(r.name));
    if (c && !cuts[c.id]) {
      cuts[c.id] = { score: r.score, kind: 'matriculado', year: 2026, source: 'Pontificia Universidad Católica de Chile' };
      matched++;
    } else if (!c) unmatched.push(r.name);
  }
  console.log('UC: filas', ucRows.length, 'cruzadas', matched, 'sin cruce', unmatched.length, unmatched.slice(0, 12));
}
for (const c of careers) if (cuts[c.id]) c.cut = cuts[c.id];

// ---------- Carreras genéricas (cuando aún no elige institución) ----------
const generic = new Map();
for (const c of careers.filter((c) => c.w)) {
  const r = siesByDemre.get(c.id);
  const gname = r ? titleCase(r['Área Carrera Genérica']) : c.name;
  if (!generic.has(gname)) generic.set(gname, { name: gname, area: c.area, list: [] });
  generic.get(gname).list.push(c);
}
function avgWeights(list) {
  // Cada carrera se reduce a un vector que suma 100 (la electiva cuenta una vez); el promedio también suma 100.
  const keys = ['nem', 'ranking', 'lectora', 'm1', 'm2', 'electiva', 'especial'];
  const vec = (c) => ({
    nem: c.w.nem,
    ranking: c.w.ranking,
    lectora: c.w.lectora,
    m1: c.w.m1,
    m2: c.w.m2,
    electiva: c.hoc ? Math.max(c.w.historia, c.w.ciencias) : c.w.historia + c.w.ciencias,
    especial: c.w.especial,
  });
  const raw = Object.fromEntries(keys.map((k) => [k, list.reduce((s, c) => s + vec(c)[k], 0) / list.length]));
  // Redondeo por mayor residuo: conserva la suma exacta de 100.
  const r = Object.fromEntries(keys.map((k) => [k, Math.floor(raw[k])]));
  let rest = 100 - keys.reduce((s, k) => s + r[k], 0);
  for (const k of [...keys].sort((a, b) => raw[b] - Math.floor(raw[b]) - (raw[a] - Math.floor(raw[a])))) if (rest-- > 0) r[k]++;
  // ¿Cómo se muestra la electiva? Solo Ciencias, solo Historia, o "Historia o Ciencias" si varía.
  const onlyC = list.every((c) => !c.hoc && c.w.historia === 0);
  const onlyH = list.every((c) => !c.hoc && c.w.ciencias === 0);
  const w = { nem: r.nem, ranking: r.ranking, lectora: r.lectora, m1: r.m1, m2: r.m2, historia: 0, ciencias: 0, especial: r.especial };
  if (onlyC) w.ciencias = r.electiva;
  else if (onlyH) w.historia = r.electiva;
  else w.historia = w.ciencias = r.electiva;
  return { w, hoc: !onlyC && !onlyH && r.electiva > 0 ? true : undefined };
}
const genericCareers = [...generic.values()]
  .filter((g) => g.list.length >= 2)
  .map((g) => ({ id: `g-${fold(g.name).toLowerCase().replace(/ /g, '-')}`, name: g.name, area: g.area, count: new Set(g.list.map((c) => c.inst)).size, ...avgWeights(g.list) }))
  .sort((a, b) => b.count - a.count);

// ---------- Salida ----------
institutions.sort((a, b) => CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category) || a.name.localeCompare(b.name, 'es'));
const meta = {
  generatedAt: new Date().toISOString().slice(0, 10),
  sources: [
    'DEMRE — Oferta Definitiva de Carreras, Vacantes y Ponderaciones, Proceso de Admisión 2027 (24-09-2026)',
    'SIES/Mineduc — Oferta Académica 2026 (05-06-2026), mifuturo.cl',
    'Universidad de Chile — Puntajes de ingreso, Admisión 2026 (último seleccionado)',
    'Pontificia Universidad Católica de Chile — Puntajes de últimos matriculados, Admisión 2026',
  ],
  categories: CATEGORY_ORDER,
};
writeFileSync(`${OUT}/institutions.json`, JSON.stringify({ meta, institutions }));
writeFileSync(`${OUT}/careers.json`, JSON.stringify(careers));
writeFileSync(`${OUT}/generic-careers.json`, JSON.stringify(genericCareers));
console.log('instituciones', institutions.length, Object.fromEntries(CATEGORY_ORDER.map((c) => [c, institutions.filter((i) => i.category === c).length])));
console.log('carreras', careers.length, 'con ponderación', careers.filter((c) => c.w).length, 'con corte', careers.filter((c) => c.cut).length, 'genéricas', genericCareers.length, 'cruces corregidos', uniMismatch);
