create extension if not exists pgcrypto;

create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  public_id text not null unique,
  name text not null default 'Sin nombre',
  is_public boolean not null default false,
  data jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_characters_updated_at on public.characters;
create trigger trg_characters_updated_at
before update on public.characters
for each row execute procedure public.set_updated_at();

alter table public.characters enable row level security;

drop policy if exists "Users can view own characters" on public.characters;
drop policy if exists "Users can insert own characters" on public.characters;
drop policy if exists "Users can update own characters" on public.characters;
drop policy if exists "Users can delete own characters" on public.characters;

create policy "Users can view own characters"
on public.characters for select
using (auth.uid() = user_id);

create policy "Users can insert own characters"
on public.characters for insert
with check (auth.uid() = user_id);

create policy "Users can update own characters"
on public.characters for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own characters"
on public.characters for delete
using (auth.uid() = user_id);

create or replace view public.characters_public as
select public_id, name, data, updated_at
from public.characters
where is_public = true;

grant select on public.characters_public to anon, authenticated;
