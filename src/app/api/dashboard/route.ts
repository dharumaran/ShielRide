import { NextResponse } from "next/server";
import {
  RAJAN,
  SEED_POLICY,
  SEED_PAYOUTS,
  SEED_RISK_COMPONENTS,
  SEED_RW,
  SEED_PW,
  INCOME_WEEK_1,
  SEED_ALPHA,
} from "@/lib/seed-data";
import { premiumFromComponents } from "@/lib/premium-engine";
import { getSubFromAuthHeader, isUuid } from "@/lib/auth-request";
import { buildDashboardFromDb } from "@/lib/db-queries";
import { hasSupabaseService } from "@/lib/supabase-server";

export async function GET(req: Request) {
  const sub = await getSubFromAuthHeader(req);

  if (hasSupabaseService() && sub && isUuid(sub)) {
    const fromDb = await buildDashboardFromDb(sub);
    if (fromDb) {
      return NextResponse.json(fromDb);
    }
  }

  const prem = premiumFromComponents(SEED_RISK_COMPONENTS, SEED_ALPHA);
  const payoutOverlay = [0, 0, 520, 0, 0, 0, 0];
  return NextResponse.json({
    worker: {
      id: RAJAN.id,
      name: RAJAN.name,
      city: RAJAN.city,
      platform: RAJAN.platform,
      dailyBaseline: RAJAN.dailyBaseline,
    },
    policy: {
      policyNumber: SEED_POLICY.policyNumber,
      status: SEED_POLICY.status,
      weeklyPremium: SEED_PW,
      renewalDate: SEED_POLICY.renewalDate,
      policycenterId: SEED_POLICY.policycenterId,
    },
    payouts: SEED_PAYOUTS.map((p) => ({
      trigger: p.trigger,
      amount: p.amount,
      fw: p.fw,
      processedSec: p.processedSec,
      B: p.B,
      G: p.G,
      L: p.L,
      claimNumber: p.claimNumber,
      at: p.at,
    })),
    risk: {
      components: SEED_RISK_COMPONENTS,
      rw: SEED_RW,
      pw: SEED_PW,
      breakdown: prem.breakdown,
      alpha: SEED_ALPHA,
    },
    incomeWeek: INCOME_WEEK_1,
    payoutOverlayWeek: payoutOverlay,
    source: "seed" as const,
  });
}
