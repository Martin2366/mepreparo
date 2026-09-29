-- Hito 3 · Nube (plan §5.4, decisión D19).
-- Local primero: el teléfono es la fuente inmediata; aquí se respalda.
-- Todas las tablas con RLS por auth.uid(); sin delete desde el cliente (el borrado de cuenta va por la Edge Function
-- `delete-account` y cae en cascada desde auth.users).

-- 1) Intentos de pasos: solo inserción, uuid generado en el teléfono. La PK incluye user_id para que un intento
--    subido con una sesión anónima pueda volver a subirse al pasar a la cuenta de Google.
create table if not exists public.step_attempts (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id uuid not null,
  created_at timestamptz not null,
  day date not null,
  ref text not null check (char_length(ref) <= 200),
  unit_id text check (char_length(unit_id) <= 80),
  lesson_id text check (char_length(lesson_id) <= 80),
  step_index int,
  kind text not null check (kind in ('lesson', 'practice', 'review', 'exam')),
  outcome text not null check (outcome in ('clean', 'hinted', 'wrong')),
  hints int not null default 0 check (hints between 0 and 10),
  mistake_code text check (char_length(mistake_code) <= 80),
  answer text check (char_length(answer) <= 500),
  xp int not null default 0 check (xp between 0 and 1000),
  uploaded_at timestamptz not null default now(),
  primary key (user_id, id)
);
create index if not exists step_attempts_user_day on public.step_attempts (user_id, day);

-- 2) Estado agregado por documento (progreso, ensayos, intensivos, onboarding sin apodo, premium).
--    Se sube completo (upsert idempotente) y se mezcla en el teléfono (engine/merge).
create table if not exists public.user_state (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  doc text not null check (doc in ('progress', 'exams', 'intensives', 'onboarding', 'premium')),
  data jsonb not null check (pg_column_size(data) <= 2000000),
  device_id text not null check (char_length(device_id) <= 64),
  updated_at timestamptz not null default now(),
  primary key (user_id, doc)
);

-- 3) Plan: lo escribe solo el servidor (webhook de RevenueCat con service_role). El cliente solo lee.
create table if not exists public.entitlements (
  user_id uuid primary key references auth.users (id) on delete cascade,
  premium_until timestamptz,
  source text check (source in ('monthly', 'pass')),
  product_id text,
  purchased_at timestamptz,
  last_event text,
  updated_at timestamptz not null default now()
);

-- 4) Eventos de producto (solo inserción, en lote desde la outbox). Sin PII.
create table if not exists public.events (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id uuid not null,
  name text not null check (char_length(name) <= 60),
  props jsonb not null default '{}'::jsonb check (pg_column_size(props) <= 4000),
  created_at timestamptz not null,
  primary key (user_id, id)
);

-- 5) Reportes de error de contenido (solo inserción).
create table if not exists public.content_reports (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  id uuid not null,
  ref text not null check (char_length(ref) <= 200),
  reason text not null check (char_length(reason) <= 40),
  note text check (char_length(note) <= 500),
  created_at timestamptz not null,
  primary key (user_id, id)
);

alter table public.step_attempts enable row level security;
alter table public.user_state enable row level security;
alter table public.entitlements enable row level security;
alter table public.events enable row level security;
alter table public.content_reports enable row level security;

-- step_attempts: leer e insertar lo propio.
drop policy if exists "attempts_select_own" on public.step_attempts;
create policy "attempts_select_own" on public.step_attempts for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "attempts_insert_own" on public.step_attempts;
create policy "attempts_insert_own" on public.step_attempts for insert to authenticated with check ((select auth.uid()) = user_id);

-- user_state: leer, insertar y actualizar lo propio.
drop policy if exists "state_select_own" on public.user_state;
create policy "state_select_own" on public.user_state for select to authenticated using ((select auth.uid()) = user_id);
drop policy if exists "state_insert_own" on public.user_state;
create policy "state_insert_own" on public.user_state for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "state_update_own" on public.user_state;
create policy "state_update_own" on public.user_state for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- entitlements: solo lectura de lo propio.
drop policy if exists "entitlements_select_own" on public.entitlements;
create policy "entitlements_select_own" on public.entitlements for select to authenticated using ((select auth.uid()) = user_id);

-- events y content_reports: solo inserción de lo propio.
drop policy if exists "events_insert_own" on public.events;
create policy "events_insert_own" on public.events for insert to authenticated with check ((select auth.uid()) = user_id);
drop policy if exists "reports_insert_own" on public.content_reports;
create policy "reports_insert_own" on public.content_reports for insert to authenticated with check ((select auth.uid()) = user_id);

-- Permisos explícitos: anon (sin sesión) no toca nada; authenticated solo lo que permiten las políticas.
revoke all on public.step_attempts, public.user_state, public.entitlements, public.events, public.content_reports from anon;
grant select, insert on public.step_attempts to authenticated;
grant select, insert, update on public.user_state to authenticated;
grant select on public.entitlements to authenticated;
grant insert on public.events, public.content_reports to authenticated;

-- updated_at del estado lo pone el servidor (reloj confiable para el pull incremental).
create or replace function public.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
drop trigger if exists user_state_touch on public.user_state;
create trigger user_state_touch before insert or update on public.user_state
  for each row execute function public.touch_updated_at();
