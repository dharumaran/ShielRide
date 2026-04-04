import { getSupabaseService } from "./supabase-server";
import {
  RAJAN,
  SEED_POLICY,
  SEED_PAYOUTS,
  SEED_RISK_COMPONENTS,
  SEED_RW,
  SEED_PW,
  INCOME_WEEK_1,
  SEED_ALPHA,
} from "./seed-data";
import { premiumFromComponents } from "./premium-engine";
import { isUuid } from "./auth-request";

export type WorkerRow = {
  id: string;
  phone: string;
  name: string | null;
  city: string | null;
  platform: string | null;
  vehicle_type: string | null;
  daily_baseline_income: number;
  upi_vpa: string | null;
  device_fingerprint: string | null;
};

export async function upsertWorkerByPhone(
  phone: string
): Promise<WorkerRow | null> {
  const sb = getSupabaseService();
  if (!sb) return null;
  const normalized = phone.trim();
  try {
    const { data, error } = await sb
      .from("workers")
      .upsert(
        { phone: normalized, updated_at: new Date().toISOString() },
        { onConflict: "phone" }
      )
      .select()
      .single();
    if (error || !data) return null;
    return data as WorkerRow;
  } catch {
    return null;
  }
}

export async function getWorkerById(id: string): Promise<WorkerRow | null> {
  if (!isUuid(id)) return null;
  const sb = getSupabaseService();
  if (!sb) return null;
  const { data, error } = await sb
    .from("workers")
    .select()
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data as WorkerRow;
}

export async function updateWorkerProfile(
  id: string,
  fields: {
    name: string;
    city: string;
    platform: string;
    vehicle_type: string;
    upi_vpa?: string;
    device_fingerprint?: string;
  }
): Promise<boolean> {
  if (!isUuid(id)) return false;
  const sb = getSupabaseService();
  if (!sb) return false;
  const { error } = await sb
    .from("workers")
    .update({
      ...fields,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  return !error;
}

export async function createPolicyForWorker(params: {
  workerId: string;
  policyNumber: string;
  weeklyPremium: number;
  rw: number;
  alpha: number;
  coverageLimit: number;
  policycenterId: string;
  effectiveDate: string;
  renewalDate: string;
}): Promise<{ id: string } | null> {
  if (!isUuid(params.workerId)) return null;
  const sb = getSupabaseService();
  if (!sb) return null;
  const { data, error } = await sb
    .from("policies")
    .insert({
      worker_id: params.workerId,
      policy_number: params.policyNumber,
      status: "ACTIVE",
      weekly_premium: params.weeklyPremium,
      rw: params.rw,
      alpha: params.alpha,
      coverage_limit: params.coverageLimit,
      policycenter_id: params.policycenterId,
      effective_date: params.effectiveDate,
      renewal_date: params.renewalDate,
      guidewire_sync: true,
    })
    .select("id")
    .single();
  if (error || !data) return null;
  return { id: data.id as string };
}

export async function getPolicyByWorker(
  workerId: string
): Promise<{
  policy_number: string;
  status: string;
  weekly_premium: number;
  renewal_date: string | null;
  policycenter_id: string | null;
  rw: number | null;
  alpha: number | null;
  coverage_limit: number | null;
  id: string;
} | null> {
  if (!isUuid(workerId)) return null;
  const sb = getSupabaseService();
  if (!sb) return null;
  const { data, error } = await sb
    .from("policies")
    .select()
    .eq("worker_id", workerId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return data as {
    policy_number: string;
    status: string;
    weekly_premium: number;
    renewal_date: string | null;
    policycenter_id: string | null;
    rw: number | null;
    alpha: number | null;
    coverage_limit: number | null;
    id: string;
  };
}

export async function insertClaimRow(params: {
  workerId: string;
  policyId: string | null;
  claimNumber: string;
  triggerType: string;
  payoutAmount: number;
  fw: number;
  B: number;
  G: number;
  L: number;
  fraudSignals: Record<string, unknown>;
  processedSeconds: number;
  claimcenterId: string;
}): Promise<boolean> {
  if (!isUuid(params.workerId)) return false;
  const sb = getSupabaseService();
  if (!sb) return false;
  const { error } = await sb.from("claims").insert({
    worker_id: params.workerId,
    policy_id: params.policyId,
    claim_number: params.claimNumber,
    trigger_type: params.triggerType,
    payout_amount: params.payoutAmount,
    fw_score: params.fw,
    b_score: params.B,
    g_score: params.G,
    l_score: params.L,
    fraud_signals: params.fraudSignals,
    status: "SETTLED",
    processed_seconds: params.processedSeconds,
    claimcenter_id: params.claimcenterId,
  });
  return !error;
}

export async function listClaimsForWorker(workerId: string) {
  if (!isUuid(workerId)) return [];
  const sb = getSupabaseService();
  if (!sb) return [];
  const { data, error } = await sb
    .from("claims")
    .select()
    .eq("worker_id", workerId)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  return data;
}

export async function logTriggerEvaluations(
  rows: {
    city: string;
    trigger_type: string;
    current_value: number;
    threshold: number;
    pct_to_trigger: number;
    outcome: string;
    payload: Record<string, unknown>;
  }[]
) {
  const sb = getSupabaseService();
  if (!sb || rows.length === 0) return;
  await sb.from("trigger_evaluations").insert(
    rows.map((r) => ({
      city: r.city,
      trigger_type: r.trigger_type,
      current_value: r.current_value,
      threshold: r.threshold,
      pct_to_trigger: r.pct_to_trigger,
      outcome: r.outcome,
      payload: r.payload,
    }))
  );
}

export async function getIncomeWeekForWorker(workerId: string): Promise<{
  incomeWeek: number[];
  payoutOverlay: number[];
} | null> {
  if (!isUuid(workerId)) return null;
  const sb = getSupabaseService();
  if (!sb) return null;
  const { data } = await sb
    .from("income_weekly")
    .select()
    .eq("worker_id", workerId)
    .eq("week_label", "demo_week_1")
    .maybeSingle();
  if (!data) return null;
  const row = data as {
    mon: number;
    tue: number;
    wed: number;
    thu: number;
    fri: number;
    sat: number;
    sun: number;
    payout_overlay: number[] | null;
  };
  const incomeWeek = [
    row.mon,
    row.tue,
    row.wed,
    row.thu,
    row.fri,
    row.sat,
    row.sun,
  ];
  const payoutOverlay = Array.isArray(row.payout_overlay)
    ? row.payout_overlay
    : [0, 0, 520, 0, 0, 0, 0];
  return { incomeWeek, payoutOverlay };
}

/** Build dashboard payload from DB or null to use file seed */
export async function buildDashboardFromDb(workerId: string) {
  const worker = await getWorkerById(workerId);
  if (!worker) return null;
  const policy = await getPolicyByWorker(workerId);
  const claims = await listClaimsForWorker(workerId);
  const income = await getIncomeWeekForWorker(workerId);

  const w = {
    name: worker.name ?? RAJAN.name,
    city: worker.city ?? RAJAN.city,
    platform: worker.platform ?? RAJAN.platform,
    dailyBaseline: Number(worker.daily_baseline_income ?? RAJAN.dailyBaseline),
    phone: worker.phone,
    id: worker.id,
  };

  const prem = premiumFromComponents(
    SEED_RISK_COMPONENTS,
    policy?.alpha ?? SEED_ALPHA
  );

  const p = policy ?? {
    policy_number: SEED_POLICY.policyNumber,
    status: "ACTIVE",
    weekly_premium: SEED_PW,
    renewal_date: SEED_POLICY.renewalDate,
    policycenter_id: SEED_POLICY.policycenterId,
  };

  const payouts = claims.length
    ? claims.map((c: Record<string, unknown>) => ({
        trigger: c.trigger_type as string,
        amount: Number(c.payout_amount),
        fw: Number(c.fw_score),
        processedSec: Number(c.processed_seconds ?? 240),
        B: Number(c.b_score ?? 0),
        G: Number(c.g_score ?? 0),
        L: Number(c.l_score ?? 0),
        claimNumber: c.claim_number as string,
        at: new Date(c.created_at as string).getTime(),
      }))
    : [];

  return {
    worker: w,
    policy: {
      policyNumber: p.policy_number,
      status: p.status,
      weeklyPremium: Number(policy?.weekly_premium ?? SEED_PW),
      renewalDate: String(policy?.renewal_date ?? SEED_POLICY.renewalDate),
      policycenterId: String(policy?.policycenter_id ?? SEED_POLICY.policycenterId),
    },
    payouts,
    risk: {
      components: SEED_RISK_COMPONENTS,
      rw: policy?.rw ?? SEED_RW,
      pw: Number(policy?.weekly_premium ?? SEED_PW),
      breakdown: prem.breakdown,
      alpha: policy?.alpha ?? SEED_ALPHA,
    },
    incomeWeek: income?.incomeWeek ?? INCOME_WEEK_1,
    payoutOverlayWeek: income?.payoutOverlay ?? [0, 0, 520, 0, 0, 0, 0],
    source: "supabase" as const,
  };
}

export type WorkerListItem = {
  id: string;
  phone: string;
  name: string | null;
  city: string | null;
  platform: string | null;
};

export async function listWorkersForAdmin(): Promise<WorkerListItem[]> {
  const sb = getSupabaseService();
  if (!sb) {
    return [
      {
        id: RAJAN.id,
        phone: RAJAN.phone,
        name: RAJAN.name,
        city: RAJAN.city,
        platform: RAJAN.platform,
      },
    ];
  }
  const { data, error } = await sb
    .from("workers")
    .select("id, phone, name, city, platform")
    .order("created_at", { ascending: false });
  if (error || !data?.length) {
    return [
      {
        id: RAJAN.id,
        phone: RAJAN.phone,
        name: RAJAN.name,
        city: RAJAN.city,
        platform: RAJAN.platform,
      },
    ];
  }
  return data as WorkerListItem[];
}

export async function getAdminWorkerDetail(workerId: string) {
  if (workerId === RAJAN.id) {
    const prem = premiumFromComponents(SEED_RISK_COMPONENTS, SEED_ALPHA);
    const claimsRows = SEED_PAYOUTS.map((p) => ({
      trigger_type: p.trigger,
      payout_amount: p.amount,
      fw_score: p.fw,
      b_score: p.B,
      g_score: p.G,
      l_score: p.L,
      claim_number: p.claimNumber,
      created_at: new Date(p.at).toISOString(),
    }));
    const totalPayout = SEED_PAYOUTS.reduce((s, p) => s + p.amount, 0);
    const weeks = RAJAN.tenureWeeks;
    const weeklyPrem = SEED_PW;
    const estimatedPremiumsPaid = weeklyPrem * weeks;
    const lossRatio =
      estimatedPremiumsPaid > 0 ? totalPayout / estimatedPremiumsPaid : 0;
    const avgFw =
      SEED_PAYOUTS.reduce((s, p) => s + p.fw, 0) / SEED_PAYOUTS.length;
    return {
      worker: {
        id: RAJAN.id,
        name: RAJAN.name,
        phone: RAJAN.phone,
        city: RAJAN.city,
        platform: RAJAN.platform,
      },
      policy: {
        policyNumber: SEED_POLICY.policyNumber,
        weeklyPremium: SEED_PW,
        rw: SEED_RW,
        alpha: SEED_ALPHA,
        policycenterId: SEED_POLICY.policycenterId,
      },
      riskBreakdown: prem.breakdown,
      claims: claimsRows,
      analytics: {
        totalPayout,
        estimatedPremiumsPaid,
        weeksAssumed: weeks,
        lossRatio,
        claimCount: SEED_PAYOUTS.length,
        avgFw,
      },
      source: "seed" as const,
    };
  }

  if (!isUuid(workerId)) return null;

  const dash = await buildDashboardFromDb(workerId);
  if (!dash) return null;

  const sb = getSupabaseService();
  const claims = sb
    ? ((await sb
        .from("claims")
        .select()
        .eq("worker_id", workerId)
        .order("created_at", { ascending: false }))?.data ?? [])
    : [];

  const totalPayout = claims.reduce(
    (s, c: { payout_amount?: number }) => s + Number(c.payout_amount ?? 0),
    0
  );
  const weeks = 14;
  const weeklyPrem = dash.policy.weeklyPremium;
  const estimatedPremiumsPaid = weeklyPrem * weeks;
  const lossRatio =
    estimatedPremiumsPaid > 0 ? totalPayout / estimatedPremiumsPaid : 0;
  const avgFw = claims.length
    ? claims.reduce(
        (s, c: { fw_score?: number }) => s + Number(c.fw_score ?? 0),
        0
      ) / claims.length
    : 0;

  return {
    worker: dash.worker,
    policy: {
      policyNumber: dash.policy.policyNumber,
      weeklyPremium: dash.policy.weeklyPremium,
      rw: dash.risk.rw,
      alpha: dash.risk.alpha,
      policycenterId: dash.policy.policycenterId,
    },
    riskBreakdown: dash.risk.breakdown,
    claims,
    analytics: {
      totalPayout,
      estimatedPremiumsPaid,
      weeksAssumed: weeks,
      lossRatio,
      claimCount: claims.length,
      avgFw,
    },
    source: "supabase" as const,
  };
}
