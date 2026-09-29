-- La subida idempotente usa INSERT … ON CONFLICT DO NOTHING. Postgres exige privilegio SELECT sobre las columnas del
-- conflicto y aplica las políticas de SELECT a la fila: cada usuario puede leer solo sus propios eventos y reportes
-- (inofensivo; sigue sin poder modificarlos ni borrarlos).
grant select on public.events, public.content_reports to authenticated;
drop policy if exists "events_select_own" on public.events;
create policy "events_select_own" on public.events for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "reports_select_own" on public.content_reports;
create policy "reports_select_own" on public.content_reports for select to authenticated using ((select auth.uid()) = user_id);

-- Los privilegios por defecto de Supabase dan todo a `authenticated`; se deja solo lo necesario (sin delete desde el cliente).
revoke delete, truncate, references, trigger on public.step_attempts, public.user_state, public.entitlements, public.events, public.content_reports from authenticated;
revoke update on public.step_attempts, public.entitlements, public.events, public.content_reports from authenticated;
revoke insert on public.entitlements from authenticated;
