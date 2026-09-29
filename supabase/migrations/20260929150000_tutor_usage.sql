-- Uso de Equis (IA) por usuario, día y modo: topes diarios y tope global de gasto mensual (PRD §10, plan D25).
-- Lo escribe solo la Edge Function `equis` (service_role); el cliente puede leer lo suyo.
create table if not exists public.tutor_usage (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  mode text not null check (mode in ('scan', 'explain', 'chat')),
  calls int not null default 0,
  cost_micros bigint not null default 0,
  primary key (user_id, day, mode)
);
create index if not exists tutor_usage_day on public.tutor_usage (day);

alter table public.tutor_usage enable row level security;
drop policy if exists "tutor_usage_select_own" on public.tutor_usage;
create policy "tutor_usage_select_own" on public.tutor_usage for select to authenticated using ((select auth.uid()) = user_id);
revoke all on public.tutor_usage from anon;
revoke insert, update, delete, truncate, references, trigger on public.tutor_usage from authenticated;
grant select on public.tutor_usage to authenticated;

-- Suma atómica (evita carreras entre dos llamadas simultáneas).
create or replace function public.tutor_bump(p_user uuid, p_day date, p_mode text, p_cost bigint) returns void
language sql security definer set search_path = '' as $$
  insert into public.tutor_usage (user_id, day, mode, calls, cost_micros)
  values (p_user, p_day, p_mode, 1, p_cost)
  on conflict (user_id, day, mode) do update
    set calls = public.tutor_usage.calls + 1, cost_micros = public.tutor_usage.cost_micros + excluded.cost_micros;
$$;
revoke all on function public.tutor_bump(uuid, date, text, bigint) from public, anon, authenticated;

-- Gasto del mes (en micro-dólares) para el tope global.
create or replace function public.tutor_month_cost(p_from date) returns bigint
language sql security definer set search_path = '' stable as $$
  select coalesce(sum(cost_micros), 0)::bigint from public.tutor_usage where day >= p_from;
$$;
revoke all on function public.tutor_month_cost(date) from public, anon, authenticated;
