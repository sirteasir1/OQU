-- Supabase SQL setup (idempotent)
-- Run inside Supabase SQL Editor.

-- 1) Profiles (interests + basic student info)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  interests text[] not null default '{}',
  first_name text,
  last_name text,
  age int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- add missing columns if profiles table already existed
alter table public.profiles add column if not exists interests text[] not null default '{}';
alter table public.profiles add column if not exists first_name text;
alter table public.profiles add column if not exists last_name text;
alter table public.profiles add column if not exists age int;
alter table public.profiles add column if not exists created_at timestamptz not null default now();
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

drop policy if exists "Profiles are viewable by owner" on public.profiles;
drop policy if exists "Profiles are insertable by owner" on public.profiles;
drop policy if exists "Profiles are updatable by owner" on public.profiles;

create policy "Profiles are viewable by owner"
on public.profiles for select
using (auth.uid() = id);

create policy "Profiles are insertable by owner"
on public.profiles for insert
with check (auth.uid() = id);

create policy "Profiles are updatable by owner"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- 2) Lesson progress (persisted progress across devices)
create table if not exists public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  topic_id text not null,
  completed boolean not null default false,
  best_score int,
  last_score int,
  attempts int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, topic_id)
);

-- optional index for faster filtering by topic
create index if not exists lesson_progress_topic_idx on public.lesson_progress(topic_id);

-- keep updated_at in sync
create or replace function public.set_lesson_progress_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_lesson_progress_updated_at on public.lesson_progress;
create trigger set_lesson_progress_updated_at
before update on public.lesson_progress
for each row execute function public.set_lesson_progress_updated_at();

alter table public.lesson_progress enable row level security;

drop policy if exists "Lesson progress is viewable by owner" on public.lesson_progress;
drop policy if exists "Lesson progress is insertable by owner" on public.lesson_progress;
drop policy if exists "Lesson progress is updatable by owner" on public.lesson_progress;

create policy "Lesson progress is viewable by owner"
on public.lesson_progress for select
using (auth.uid() = user_id);

create policy "Lesson progress is insertable by owner"
on public.lesson_progress for insert
with check (auth.uid() = user_id);

create policy "Lesson progress is updatable by owner"
on public.lesson_progress for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
