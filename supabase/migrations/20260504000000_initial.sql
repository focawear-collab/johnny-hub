-- FILE: supabase/migrations/20260504000000_initial.sql
-- ============================================================
-- Johnny Hub – Initial Schema
-- ============================================================

-- ------------------------------------------------------------
-- Extensions
-- ------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- pizza_styles (must exist before profiles FK)
-- ------------------------------------------------------------
create table if not exists public.pizza_styles (
  id              text primary key,
  name            text not null,
  region          text,
  hyd_default     int,
  ball_default    int,
  salt_default    numeric(4,2),
  oil_default     numeric(4,2),
  ferment_default int,
  temp_default    int
);

-- ------------------------------------------------------------
-- profiles
-- ------------------------------------------------------------
create table if not exists public.profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  username        text,
  full_name       text,
  avatar_url      text,
  level           text default 'Principiante'
                  check (level in ('Principiante', 'Amateur', 'Avanzado', 'Maestro')),
  oven_type       text,
  mixer_type      text,
  scale_brand     text,
  preferred_style text references public.pizza_styles(id),
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

-- ------------------------------------------------------------
-- recipes
-- ------------------------------------------------------------
create table if not exists public.recipes (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  style_id     text references public.pizza_styles(id),
  level        text,   -- Clásica | Casual | Premium | Avanzada
  tag          text,
  time_minutes int,
  description  text,
  instructions jsonb  default '[]'::jsonb,
  ingredients  jsonb  default '[]'::jsonb,
  tips         jsonb  default '[]'::jsonb,
  stars_avg    numeric(3,2) default 0,
  is_public    boolean default true,
  created_by   uuid references public.profiles(id),
  created_at   timestamptz default now()
);

-- ------------------------------------------------------------
-- bake_sessions
-- ------------------------------------------------------------
create table if not exists public.bake_sessions (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references public.profiles(id) on delete cascade,
  style_id         text references public.pizza_styles(id),
  recipe_id        uuid references public.recipes(id),
  pizzas           int  not null,
  ball_size_g      int  not null,
  hyd_pct          numeric(4,1) not null,
  salt_pct         numeric(4,2) not null,
  oil_pct          numeric(4,2) not null,
  ferment_hours    int  not null,
  ferment_temp_c   int  not null,
  -- calculated
  flour_g          int,
  water_g          int,
  salt_g           numeric(5,2),
  oil_g            numeric(5,2),
  yeast_g          numeric(5,3),
  -- timing
  started_at       timestamptz,
  ready_at         timestamptz,
  completed_at     timestamptz,
  status           text default 'planned'
                   check (status in ('planned','mixing','bulk','cold','bench','proofing','baking','done')),
  -- journal
  rating           numeric(3,2),
  notes            text,
  photo_url        text,
  created_at       timestamptz default now()
);

-- ------------------------------------------------------------
-- journal_entries
-- ------------------------------------------------------------
create table if not exists public.journal_entries (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references public.profiles(id) on delete cascade,
  bake_session_id  uuid references public.bake_sessions(id),
  title            text not null,
  style_id         text references public.pizza_styles(id),
  date             date not null,
  rating           numeric(3,2),
  notes            text,
  photo_url        text,
  tags             text[] default '{}',
  created_at       timestamptz default now()
);

-- ------------------------------------------------------------
-- saved_recipes
-- ------------------------------------------------------------
create table if not exists public.saved_recipes (
  user_id    uuid references public.profiles(id) on delete cascade,
  recipe_id  uuid references public.recipes(id) on delete cascade,
  saved_at   timestamptz default now(),
  primary key (user_id, recipe_id)
);

-- ------------------------------------------------------------
-- shopping_lists
-- ------------------------------------------------------------
create table if not exists public.shopping_lists (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references public.profiles(id) on delete cascade,
  bake_session_id  uuid references public.bake_sessions(id),
  -- items: [{name, qty, unit, category, checked}]
  items            jsonb default '[]'::jsonb,
  created_at       timestamptz default now()
);

-- ------------------------------------------------------------
-- week_plans
-- ------------------------------------------------------------
create table if not exists public.week_plans (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete cascade,
  week_start  date not null,
  -- days: {mon: {bake_session_id, note}, tue: ..., ...}
  days        jsonb default '{}'::jsonb,
  created_at  timestamptz default now(),
  unique (user_id, week_start)
);

-- ============================================================
-- Indexes
-- ============================================================
create index if not exists idx_bake_sessions_user_status
  on public.bake_sessions (user_id, status);

create index if not exists idx_journal_entries_user_date
  on public.journal_entries (user_id, date);

create index if not exists idx_bake_sessions_started_at
  on public.bake_sessions (started_at);

create index if not exists idx_recipes_style_public
  on public.recipes (style_id, is_public);

create index if not exists idx_saved_recipes_user
  on public.saved_recipes (user_id);

-- ============================================================
-- updated_at trigger
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_profiles_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- ============================================================
-- Auto-create profile on new auth user
-- ============================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================
-- Row Level Security
-- ============================================================

-- profiles -------
alter table public.profiles enable row level security;

create policy "profiles: owner read"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: owner insert"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles: owner update"
  on public.profiles for update
  using (auth.uid() = id);

-- pizza_styles (public read, no write from clients) -------
alter table public.pizza_styles enable row level security;

create policy "pizza_styles: authenticated read"
  on public.pizza_styles for select
  to authenticated
  using (true);

-- recipes -------
alter table public.recipes enable row level security;

create policy "recipes: public read"
  on public.recipes for select
  to authenticated
  using (is_public = true or created_by = auth.uid());

create policy "recipes: owner insert"
  on public.recipes for insert
  with check (auth.uid() = created_by);

create policy "recipes: owner update"
  on public.recipes for update
  using (auth.uid() = created_by);

create policy "recipes: owner delete"
  on public.recipes for delete
  using (auth.uid() = created_by);

-- bake_sessions -------
alter table public.bake_sessions enable row level security;

create policy "bake_sessions: owner all"
  on public.bake_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- journal_entries -------
alter table public.journal_entries enable row level security;

create policy "journal_entries: owner all"
  on public.journal_entries for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- saved_recipes -------
alter table public.saved_recipes enable row level security;

create policy "saved_recipes: owner all"
  on public.saved_recipes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- shopping_lists -------
alter table public.shopping_lists enable row level security;

create policy "shopping_lists: owner all"
  on public.shopping_lists for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- week_plans -------
alter table public.week_plans enable row level security;

create policy "week_plans: owner all"
  on public.week_plans for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- Storage bucket for bake photos
-- ============================================================
insert into storage.buckets (id, name, public)
values ('bake-photos', 'bake-photos', true)
on conflict (id) do nothing;

create policy "bake_photos: owner upload"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'bake-photos' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "bake_photos: public read"
  on storage.objects for select
  using (bucket_id = 'bake-photos');

create policy "bake_photos: owner delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'bake-photos' and (storage.foldername(name))[1] = auth.uid()::text);

-- ============================================================
-- Seed: pizza_styles
-- ============================================================
insert into public.pizza_styles (id, name, region, hyd_default, ball_default, salt_default, oil_default, ferment_default, temp_default)
values
  ('napoletana', 'Napoletana',      'Napoli, IT',    62,  280, 2.80, 0.00, 48,  430),
  ('newyork',    'New York',        'New York, US',  65,  300, 2.00, 2.00, 24,  290),
  ('romana',     'Romana in Teglia','Roma, IT',      80,  800, 2.50, 3.00, 72,  280),
  ('detroit',    'Detroit',         'Detroit, US',   70,  900, 2.00, 3.00, 48,  260),
  ('pala',       'Pala / Pinsa',    'Roma, IT',      78,  700, 2.50, 4.00, 96,  300)
on conflict (id) do update set
  name            = excluded.name,
  region          = excluded.region,
  hyd_default     = excluded.hyd_default,
  ball_default    = excluded.ball_default,
  salt_default    = excluded.salt_default,
  oil_default     = excluded.oil_default,
  ferment_default = excluded.ferment_default,
  temp_default    = excluded.temp_default;
