-- ============================================================
-- WIDE "Imprenditore per un Giorno" — Supabase Schema
-- Esegui questo script nell'SQL Editor di Supabase
-- ============================================================

-- Tabella sessioni di gioco
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  product_name text not null,
  step_1_choice text,
  step_1_output text,
  step_2_choice text,
  step_2_output text,
  step_3_choice text,
  step_3_output text,
  conclusion text,
  contact_type text check (contact_type in ('email', 'whatsapp')),
  contact_value text,
  completed boolean default false
);

-- Trigger per aggiornare updated_at automaticamente
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger sessions_updated_at
  before update on sessions
  for each row execute function update_updated_at();

-- Tabella rate limiting anti-bot
-- Massimo 5 partite per IP ogni 24 ore
create table if not exists rate_limits (
  ip text primary key,
  count integer default 1,
  reset_at timestamptz default (now() + interval '24 hours')
);
