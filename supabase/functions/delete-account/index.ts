// Borra la cuenta del llamante y, en cascada, todos sus datos (plan §5.4).
// La service_role solo vive en los secretos de la función (SUPABASE_SERVICE_ROLE_KEY la inyecta Supabase).
import { createClient } from 'npm:@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const token = req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) return json({ error: 'no_authorization' }, 401);

  const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Se valida el JWT del llamante contra Auth: solo puede borrarse a sí mismo.
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) return json({ error: 'invalid_token' }, 401);

  const { error: delError } = await admin.auth.admin.deleteUser(data.user.id);
  if (delError) return json({ error: 'delete_failed' }, 500);

  return json({ ok: true });
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { ...cors, 'Content-Type': 'application/json' } });
}
