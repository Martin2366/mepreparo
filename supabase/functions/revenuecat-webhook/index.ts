// Webhook de RevenueCat → tabla `entitlements` (PRD §16). Registro del servidor; el teléfono decide con la
// información de RevenueCat (local primero) y calcula la vigencia del Pase PAES con `engine/premium`.
// Seguridad: RevenueCat envía el header Authorization configurado en su panel; debe coincidir con el secreto
// REVENUECAT_WEBHOOK_AUTH de esta función. Se despliega con --no-verify-jwt (RevenueCat no envía un JWT).
import { createClient } from 'npm:@supabase/supabase-js@2';

type RcEvent = {
  id: string;
  type: string;
  app_user_id: string;
  original_app_user_id?: string;
  aliases?: string[];
  transferred_to?: string[];
  product_id?: string;
  purchased_at_ms?: number | null;
  expiration_at_ms?: number | null;
  environment?: string;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const PASS = /^pase_paes/;

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('method_not_allowed', { status: 405 });
  const expected = Deno.env.get('REVENUECAT_WEBHOOK_AUTH');
  if (!expected || req.headers.get('Authorization') !== expected) return new Response('unauthorized', { status: 401 });

  let event: RcEvent;
  try {
    event = ((await req.json()) as { event: RcEvent }).event;
  } catch {
    return new Response('bad_json', { status: 400 });
  }
  if (event.type === 'TEST') return new Response('ok');

  // El app_user_id es el id de Supabase (Purchases.logIn). Los ids anónimos de RevenueCat ($RCAnonymousID) se ignoran.
  const ids = [event.app_user_id, ...(event.transferred_to ?? [])].filter((x) => UUID.test(x ?? ''));
  if (!ids.length) return new Response('ignored');

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const isPass = PASS.test(event.product_id ?? '');
  const iso = (ms?: number | null) => (ms ? new Date(ms).toISOString() : null);
  const row: Record<string, unknown> = {
    source: isPass ? 'pass' : 'monthly',
    product_id: event.product_id ?? null,
    last_event: event.type,
    updated_at: new Date().toISOString(),
  };
  switch (event.type) {
    case 'INITIAL_PURCHASE':
    case 'RENEWAL':
    case 'UNCANCELLATION':
    case 'PRODUCT_CHANGE':
    case 'SUBSCRIPTION_EXTENDED':
    case 'REFUND_REVERSED':
    case 'NON_RENEWING_PURCHASE':
    case 'TRANSFER':
      row.purchased_at = iso(event.purchased_at_ms);
      // El pase no trae vencimiento: su vigencia la calcula la app (hasta tu próxima PAES).
      row.premium_until = isPass ? null : iso(event.expiration_at_ms);
      break;
    case 'EXPIRATION':
      row.premium_until = iso(event.expiration_at_ms) ?? new Date().toISOString();
      break;
    default:
      // CANCELLATION, BILLING_ISSUE, etc.: el acceso sigue hasta el vencimiento; solo se registra el evento.
      break;
  }

  for (const user_id of ids) {
    const { error } = await admin.from('entitlements').upsert({ user_id, ...row }, { onConflict: 'user_id' });
    // FK: si el usuario ya no existe (cuenta borrada), no hay nada que registrar.
    if (error && error.code !== '23503') return new Response('db_error', { status: 500 });
  }
  return new Response('ok');
});
