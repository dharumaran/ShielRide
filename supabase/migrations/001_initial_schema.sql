-- ShieldRide — PostgreSQL schema for Supabase
-- Run in Supabase SQL editor or: supabase db push

create extension if not exists "uuid-ossp";

-- Workers (Q-commerce riders)
create table if not exists public.workers (
  id uuid primary key default gen_random_uuid(),
  phone text not null unique,
  name text,
  city text default 'Chennai',
  platform text,
  vehicle_type text,
  daily_baseline_income numeric not null default 650,
  upi_vpa text,
  device_fingerprint text,
  legacy_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists workers_phone_idx on public.workers (phone);

-- Policies
create table if not exists public.policies (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references public.workers (id) on delete cascade,
  policy_number text not null unique,
  status text not null default 'ACTIVE',
  weekly_premium numeric not null,
  rw numeric,
  alpha numeric,
  effective_date timestamptz,
  renewal_date timestamptz,
  coverage_limit numeric,
  policycenter_id text,
  guidewire_sync boolean not null default true,
  triggers text[] not null default array['RAINFALL','HEAT','AQI','OUTAGE','DEMAND_COLLAPSE']::text[],
  created_at timestamptz not null default now()
);

create index if not exists policies_worker_idx on public.policies (worker_id);

-- Claims / payouts
create table if not exists public.claims (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references public.workers (id) on delete cascade,
  policy_id uuid references public.policies (id) on delete set null,
  claim_number text not null unique,
  trigger_type text not null,
  payout_amount numeric not null,
  fw_score numeric not null,
  b_score numeric,
  g_score numeric,
  l_score numeric,
  fraud_signals jsonb not null default '{}'::jsonb,
  status text not null default 'SETTLED',
  processed_seconds int,
  claimcenter_id text,
  created_at timestamptz not null default now()
);

create index if not exists claims_worker_idx on public.claims (worker_id);
create index if not exists claims_created_idx on public.claims (created_at desc);

-- Trigger evaluation audit (auto-scan / live monitor)
create table if not exists public.trigger_evaluations (
  id uuid primary key default gen_random_uuid(),
  city text not null,
  trigger_type text not null,
  current_value numeric,
  threshold numeric,
  pct_to_trigger numeric,
  outcome text,
  payload jsonb default '{}'::jsonb,
  evaluated_at timestamptz not null default now()
);

create index if not exists trigger_eval_city_time on public.trigger_evaluations (city, evaluated_at desc);

-- Weekly income rows for dashboard charts
create table if not exists public.income_weekly (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references public.workers (id) on delete cascade,
  week_label text not null,
  mon numeric, tue numeric, wed numeric, thu numeric, fri numeric, sat numeric, sun numeric,
  payout_overlay jsonb,
  created_at timestamptz not null default now(),
  unique (worker_id, week_label)
);

-- RLS: leave disabled for hackathon — API routes use service role only.
-- In production, enable RLS and scope policies to auth.uid() or service role.
