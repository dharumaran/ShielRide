-- Seed demo data: Rajan Kumar (matches app fallbacks)
-- Run after migrations. Replace worker UUID if you need a fixed JWT subject.

-- Fixed demo worker id for documentation / manual JWT testing
-- a0000000-0000-0000-0000-000000000001

insert into public.workers (
  id,
  phone,
  name,
  city,
  platform,
  vehicle_type,
  daily_baseline_income,
  upi_vpa,
  device_fingerprint,
  legacy_id
) values (
  'a0000000-0000-0000-0000-000000000001',
  '+919876543210',
  'Rajan Kumar',
  'Chennai',
  'Zepto',
  'Electric scooter (Ola S1)',
  650,
  'rajan.kumar@upi',
  'RN11-XXXX',
  'worker_rajan_001'
)
on conflict (phone) do update set
  name = excluded.name,
  city = excluded.city,
  updated_at = now();

insert into public.policies (
  worker_id,
  policy_number,
  status,
  weekly_premium,
  rw,
  alpha,
  effective_date,
  renewal_date,
  coverage_limit,
  policycenter_id,
  guidewire_sync,
  triggers
) values (
  'a0000000-0000-0000-0000-000000000001',
  'GW-SR-1735DEMO',
  'ACTIVE',
  35,
  0.374,
  0.71,
  now() - interval '30 days',
  now() + interval '7 days',
  3250,
  'PC-uuid-demo-001',
  true,
  array['RAINFALL','HEAT','AQI','OUTAGE','DEMAND_COLLAPSE']::text[]
)
on conflict (policy_number) do nothing;

insert into public.claims (
  worker_id,
  policy_id,
  claim_number,
  trigger_type,
  payout_amount,
  fw_score,
  b_score,
  g_score,
  l_score,
  fraud_signals,
  status,
  processed_seconds,
  claimcenter_id,
  created_at
)
select
  'a0000000-0000-0000-0000-000000000001',
  p.id,
  'CLM-SR-1709123456789',
  'RAINFALL',
  520,
  0.09,
  0.08,
  0.11,
  0.05,
  '{"behavioral":"z-score OK","geo":"weather cell match","linkage":"unique device"}'::jsonb,
  'SETTLED',
  252,
  'CC-seed-1',
  now() - interval '10 days'
from public.policies p
where p.policy_number = 'GW-SR-1735DEMO'
on conflict (claim_number) do nothing;

insert into public.claims (
  worker_id,
  policy_id,
  claim_number,
  trigger_type,
  payout_amount,
  fw_score,
  b_score,
  g_score,
  l_score,
  fraud_signals,
  status,
  processed_seconds,
  claimcenter_id,
  created_at
)
select
  'a0000000-0000-0000-0000-000000000001',
  p.id,
  'CLM-SR-1709223456789',
  'HEAT',
  390,
  0.12,
  0.14,
  0.09,
  0.07,
  '{}'::jsonb,
  'SETTLED',
  235,
  'CC-seed-2',
  now() - interval '6 days'
from public.policies p
where p.policy_number = 'GW-SR-1735DEMO'
on conflict (claim_number) do nothing;

insert into public.claims (
  worker_id,
  policy_id,
  claim_number,
  trigger_type,
  payout_amount,
  fw_score,
  b_score,
  g_score,
  l_score,
  fraud_signals,
  status,
  processed_seconds,
  claimcenter_id,
  created_at
)
select
  'a0000000-0000-0000-0000-000000000001',
  p.id,
  'CLM-SR-1709323456789',
  'DEMAND_COLLAPSE',
  260,
  0.07,
  0.06,
  0.08,
  0.05,
  '{"note":"Demand-volatility — unique trigger"}'::jsonb,
  'SETTLED',
  270,
  'CC-seed-3',
  now() - interval '2 days'
from public.policies p
where p.policy_number = 'GW-SR-1735DEMO'
on conflict (claim_number) do nothing;

insert into public.income_weekly (
  worker_id,
  week_label,
  mon, tue, wed, thu, fri, sat, sun,
  payout_overlay
) values (
  'a0000000-0000-0000-0000-000000000001',
  'demo_week_1',
  820, 530, 80, 790, 910, 680, 950,
  '[0,0,520,0,0,0,0]'::jsonb
)
on conflict (worker_id, week_label) do update set
  mon = excluded.mon,
  tue = excluded.tue,
  wed = excluded.wed,
  thu = excluded.thu,
  fri = excluded.fri,
  sat = excluded.sat,
  sun = excluded.sun,
  payout_overlay = excluded.payout_overlay;
