-- As tabelas do Passaporte, com as regras de acesso (RLS). Rode uma vez, no SQL Editor do painel do Supabase.

-- O passaporte de cada pessoa: uma linha por conta, com os países visitados e as anotações.
create table public.passports (
  user_id uuid primary key default auth.uid() references auth.users on delete cascade,
  visited text[] not null default '{}',
  notes jsonb not null default '{}'
);

-- O diário de viagens: uma linha por viagem.
create table public.trips (
  id bigint generated always as identity primary key,
  user_id uuid not null default auth.uid() references auth.users on delete cascade,
  country text not null check (country ~ '^[A-Z]{2}$'),
  arrival date not null,
  days integer not null check (days between 1 and 365),
  transport text not null check (transport in ('aviao', 'onibus', 'carro', 'navio')),
  companion text not null default '' check (char_length(companion) <= 40)
);

-- Quem entrou pode usar as tabelas pela API. As políticas abaixo dizem quais linhas.
grant select, insert, update on public.passports to authenticated;
grant select, insert, update, delete on public.trips to authenticated;

-- Liga as regras por linha: sem uma política que permita, ninguém lê nem escreve nada.
alter table public.passports enable row level security;
alter table public.trips enable row level security;

create policy "Cada pessoa lê o próprio passaporte" on public.passports
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Cada pessoa cria o próprio passaporte" on public.passports
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Cada pessoa muda o próprio passaporte" on public.passports
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy "Cada pessoa cuida das próprias viagens" on public.trips
  for all to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
