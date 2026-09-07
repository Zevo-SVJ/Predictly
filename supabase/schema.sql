-- Predictly schema.
--
-- Two tables plus profiles. Predictions are readable by anyone (share links are
-- a core product feature) but writable only by their owner; evidence inherits
-- its parent's visibility.
--
-- Apply with: supabase db push, or paste into the SQL editor.

-- ---------------------------------------------------------------- profiles
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text,
  display_name text,
  created_at  timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

-- Keep a profile row in step with auth.users.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ------------------------------------------------------------- predictions
create table if not exists public.predictions (
  id                  text primary key,
  user_id             uuid references auth.users(id) on delete set null,
  slug                text not null,
  question            text not null,
  normalized_event    text not null,
  category            text not null,
  outcomes            jsonb not null default '[]'::jsonb,
  headline_outcome_id text not null,
  probability         numeric(5,4) not null check (probability >= 0 and probability <= 1),
  confidence          text not null check (confidence in ('low','medium','high')),
  reasoning           text not null,
  factors_up          jsonb not null default '[]'::jsonb,
  factors_down        jsonb not null default '[]'::jsonb,
  providers           jsonb not null default '{}'::jsonb,
  is_dev_fallback     boolean not null default false,
  status              text not null default 'complete',
  -- Resolution: the architecture is here from day one; automation comes later.
  resolution_date     date,
  resolution_status   text not null default 'unresolved'
                      check (resolution_status in ('unresolved','correct','wrong','cancelled')),
  resolved_outcome_id text,
  resolution_source   text,
  resolved_at         timestamptz,
  researched_at       timestamptz not null default now(),
  created_at          timestamptz not null default now()
);

create index if not exists predictions_user_created_idx
  on public.predictions (user_id, created_at desc);
create index if not exists predictions_slug_idx on public.predictions (slug);
create index if not exists predictions_resolution_idx
  on public.predictions (resolution_status, resolution_date)
  where resolution_status = 'unresolved';

alter table public.predictions enable row level security;

-- Share links must work for signed-out visitors.
create policy "predictions_public_read" on public.predictions
  for select using (true);

-- Anonymous forecasts are allowed; a signed-in user may only write their own.
create policy "predictions_insert" on public.predictions
  for insert with check (user_id is null or auth.uid() = user_id);

-- Claiming: an unowned forecast can be adopted; an owned one only by its owner.
create policy "predictions_update_own_or_unclaimed" on public.predictions
  for update using (user_id is null or auth.uid() = user_id)
  with check (auth.uid() = user_id or user_id is null);

-- ---------------------------------------------------------------- evidence
create table if not exists public.evidence (
  id                  text primary key,
  prediction_id       text not null references public.predictions(id) on delete cascade,
  title               text not null,
  url                 text not null,
  source_name         text not null,
  published_at        timestamptz,
  summary             text not null,
  supports_outcome_id text,
  strength            numeric(4,3) not null default 0,
  reliability         numeric(4,3) not null default 0,
  relevance           numeric(4,3) not null default 0,
  is_dev_fallback     boolean not null default false,
  created_at          timestamptz not null default now()
);

create index if not exists evidence_prediction_idx on public.evidence (prediction_id);

alter table public.evidence enable row level security;

create policy "evidence_public_read" on public.evidence
  for select using (true);

create policy "evidence_insert" on public.evidence
  for insert with check (
    exists (
      select 1 from public.predictions p
      where p.id = prediction_id
        and (p.user_id is null or p.user_id = auth.uid())
    )
  );
