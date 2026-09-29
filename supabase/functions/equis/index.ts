// Equis con IA (PRD §10, plan D25) sobre Gemini (capa de pago: los datos no se usan para entrenar).
// Reglas: la IA NUNCA decide si una respuesta es correcta (eso lo hace el motor de la app); sin datos personales;
// solo temas de estudio. Topes: diario por usuario y modo, y global de gasto mensual (EQUIS_MONTHLY_CAP_USD).
// La foto se procesa y se descarta: no se guarda en ninguna parte.
import { createClient } from 'npm:@supabase/supabase-js@2';

type Mode = 'scan' | 'explain' | 'chat';
type Part = { text: string } | { inline_data: { mime_type: string; data: string } };

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DAILY: Record<Mode, number> = { scan: 20, explain: 60, chat: 60 };
const MODEL: Record<Mode, string> = {
  scan: Deno.env.get('GEMINI_MODEL_VISION') ?? 'gemini-3.8-flash',
  explain: Deno.env.get('GEMINI_MODEL_TEXT') ?? 'gemini-3.5-flash-lite',
  chat: Deno.env.get('GEMINI_MODEL_TEXT') ?? 'gemini-3.5-flash-lite',
};
// US$ por millón de tokens (entrada, salida). Se ajustan por secreto si cambian los precios.
const PRICE: Record<string, [number, number]> = {
  'gemini-3.8-flash': [0.75, 3.75],
  'gemini-3.5-flash-lite': [0.3, 2.5],
};
const CAP_MICROS = Number(Deno.env.get('EQUIS_MONTHLY_CAP_USD') ?? '3') * 1_000_000;

const STYLE = `Eres Equis, tutor de matemática PAES (Chile) para estudiantes de 16-18 años. Español de Chile, tuteo, cálido, breve, sin emoji.
Nunca afirmes que la respuesta del estudiante es correcta o incorrecta: eso lo decide la app. Guía para ENTENDER, no entregues la solución completa salvo que se pida explícitamente.
Matemática SIEMPRE entre $…$ usando solo: \\frac{a}{b}, \\sqrt{x}, x^{2}, \\cdot, \\div, \\le, \\ge, paréntesis, + − = < >. Para pesos chilenos escribe \\$ (ej. \\$1.500). Coma decimal.
Si el mensaje no es de estudio, redirige con amabilidad. Si notas angustia, di con cariño que hable con alguien de confianza. No pidas ni repitas datos personales.`;

const PROMPTS: Record<Mode, string> = {
  scan: `${STYLE}
Tarea: lee la imagen (foto de un cuaderno, libro o pantalla) y transcribe cada ejercicio de matemática que veas, tal cual, en la notación indicada.
Para cada uno elige el "topic" MÁS parecido de la lista entregada (usa exactamente su id) o null si ninguno calza, y una dificultad 1-5.
Responde SOLO JSON: {"exercises":[{"statement":string,"options":string[],"topic":string|null,"difficulty":number}],"note":string|null}.
"options" solo si el ejercicio trae alternativas (sin la letra). Si no hay ejercicios legibles, "exercises": [] y explica en "note" en una frase qué foto sacar.`,
  explain: `${STYLE}
Tarea: explica cómo pensar el ejercicio en pasos cortos (máximo 6), cada uno con una idea. Si viene una solución verificada, síguela y NO cambies sus números.
Si viene la respuesta del estudiante y un código de error, parte por lo que probablemente pensó ("Casi…").
Responde SOLO JSON: {"steps":[{"text":string,"math":string|null}],"question":string}. "math" es la expresión de ese paso (entre $…$). "question" es una pregunta corta para comprobar si entendió.`,
  chat: `${STYLE}
Tarea: conversa en máximo 90 palabras. Pregunta primero qué intentó antes de explicar.
Responde SOLO JSON: {"reply":string}.`,
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);
  const key = Deno.env.get('GEMINI_API_KEY');
  if (!key) return json({ error: 'not_configured' }, 503);

  const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return json({ error: 'no_authorization' }, 401);
  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const { data: u, error: authError } = await admin.auth.getUser(token);
  if (authError || !u.user) return json({ error: 'invalid_token' }, 401);
  const uid = u.user.id;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'bad_json' }, 400);
  }
  const mode = body.mode as Mode;
  if (!(mode in PROMPTS)) return json({ error: 'bad_mode' }, 400);

  // Topes: diario por usuario y global mensual.
  const today = new Date().toISOString().slice(0, 10);
  const { data: usage } = await admin.from('tutor_usage').select('calls').eq('user_id', uid).eq('day', today).eq('mode', mode).maybeSingle();
  if ((usage?.calls ?? 0) >= DAILY[mode]) return json({ error: 'daily_limit' }, 429);
  const monthStart = today.slice(0, 8) + '01';
  const { data: spent } = await admin.rpc('tutor_month_cost', { p_from: monthStart });
  if (Number(spent ?? 0) >= CAP_MICROS) return json({ error: 'budget' }, 503);

  const parts = buildParts(mode, body);
  if (!parts) return json({ error: 'bad_input' }, 400);

  const model = MODEL[mode];
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: PROMPTS[mode] }] },
      contents: [{ role: 'user', parts }],
      generationConfig: { responseMimeType: 'application/json', temperature: mode === 'scan' ? 0.1 : 0.5, maxOutputTokens: 1500 },
    }),
  });
  if (!res.ok) return json({ error: 'upstream', status: res.status }, 502);
  const out = await res.json();
  const text: string = out?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? '').join('') ?? '';
  const meta = out?.usageMetadata ?? {};
  const [pin, pout] = PRICE[model] ?? [1.5, 9];
  const cost = Math.ceil(((meta.promptTokenCount ?? 0) * pin + ((meta.candidatesTokenCount ?? 0) + (meta.thoughtsTokenCount ?? 0)) * pout));
  await admin.rpc('tutor_bump', { p_user: uid, p_day: today, p_mode: mode, p_cost: cost });

  try {
    return json({ ok: true, data: JSON.parse(repairLatex(text)) });
  } catch {
    return json({ error: 'bad_output' }, 502);
  }
});

function buildParts(mode: Mode, b: Record<string, unknown>): Part[] | null {
  const str = (v: unknown, max: number) => (typeof v === 'string' ? v.slice(0, max) : '');
  if (mode === 'scan') {
    const image = str(b.image, 4_000_000);
    if (!image) return null;
    const topics = Array.isArray(b.topics) ? b.topics.slice(0, 80) : [];
    return [
      { text: `Temas disponibles (id: nombre):\n${topics.map((t: { id: string; title: string }) => `${t.id}: ${t.title}`).join('\n')}` },
      { inline_data: { mime_type: 'image/jpeg', data: image } },
    ];
  }
  if (mode === 'explain') {
    const statement = str(b.statement, 2000);
    if (!statement) return null;
    return [
      {
        text: [
          `Ejercicio: ${statement}`,
          b.options ? `Alternativas: ${(b.options as string[]).slice(0, 5).join(' | ')}` : '',
          b.solution ? `Solución verificada por el motor: ${str(b.solution, 2000)}` : '',
          b.studentAnswer ? `Respuesta del estudiante: ${str(b.studentAnswer, 300)}` : '',
          b.mistake ? `Pista del error (del motor): ${str(b.mistake, 300)}` : '',
        ]
          .filter(Boolean)
          .join('\n'),
      },
    ];
  }
  const history = Array.isArray(b.messages) ? b.messages.slice(-8) : [];
  if (!history.length) return null;
  return [
    {
      text: [
        b.context ? `Contexto del estudiante (sin datos personales): ${str(b.context, 800)}` : '',
        ...history.map((m: { role: string; text: string }) => `${m.role === 'user' ? 'Estudiante' : 'Equis'}: ${str(m.text, 1000)}`),
      ]
        .filter(Boolean)
        .join('\n'),
    },
  ];
}

/**
 * El modelo a veces escribe `\frac` sin escapar dentro del JSON: `\f` se leería como un carácter de control
 * y `\$` es inválido. Se duplica la barra de nuestros comandos cuando viene sola.
 */
export function repairLatex(text: string): string {
  return text.replace(/(?<!\\)\\(frac|sqrt|cdot|div|le|ge|\$)/g, '\\\\$1');
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
}
