import { NextResponse } from "next/server";
import { SEED_PAYOUTS, RAJAN, SEED_POLICY } from "@/lib/seed-data";
import { getSubFromAuthHeader, isUuid } from "@/lib/auth-request";
import { listClaimsForWorker } from "@/lib/db-queries";
import { hasSupabaseService } from "@/lib/supabase-server";

export async function GET(req: Request) {
  const sub = await getSubFromAuthHeader(req);

  if (hasSupabaseService() && sub && isUuid(sub)) {
    const rows = await listClaimsForWorker(sub);
    if (rows.length) {
      const claims = rows.map((c: Record<string, unknown>) => ({
        claimNumber: c.claim_number as string,
        trigger: c.trigger_type as string,
        amount: Number(c.payout_amount),
        fw: Number(c.fw_score),
        processedSec: Number(c.processed_seconds ?? 240),
        B: Number(c.b_score ?? 0),
        G: Number(c.g_score ?? 0),
        L: Number(c.l_score ?? 0),
        policyNumber: SEED_POLICY.policyNumber,
        workerId: sub,
        claimcenterId: (c.claimcenter_id as string) ?? "CC-db",
        at: new Date(c.created_at as string).getTime(),
        fraudSignals: c.fraud_signals,
      }));
      return NextResponse.json({
        claims,
        worker: { ...RAJAN, id: sub },
        policy: SEED_POLICY,
        source: "supabase",
      });
    }
  }

  const claims = SEED_PAYOUTS.map((p) => ({
    claimNumber: p.claimNumber,
    trigger: p.trigger,
    amount: p.amount,
    fw: p.fw,
    processedSec: p.processedSec,
    B: p.B,
    G: p.G,
    L: p.L,
    policyNumber: SEED_POLICY.policyNumber,
    workerId: RAJAN.id,
    claimcenterId: "CC-seed",
    at: p.at,
    fraudSignals: null,
  }));
  return NextResponse.json({ claims, worker: RAJAN, policy: SEED_POLICY, source: "seed" });
}
