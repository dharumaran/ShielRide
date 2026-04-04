import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getSubFromAuthHeader, isUuid } from "@/lib/auth-request";
import {
  createPolicyForWorker,
  getPolicyByWorker,
  updateWorkerProfile,
} from "@/lib/db-queries";
import { hasSupabaseService } from "@/lib/supabase-server";
import { RAJAN, SEED_PW } from "@/lib/seed-data";

export async function POST(req: Request) {
  const sub = await getSubFromAuthHeader(req);
  if (!sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const name = String(body.name ?? RAJAN.name);
  const city = String(body.city ?? RAJAN.city);
  const platform = String(body.platform ?? RAJAN.platform);
  const vehicleType = String(body.vehicle_type ?? body.vehicle ?? RAJAN.vehicle);
  const weeklyPremium = Number(body.weekly_premium ?? body.weeklyPremium ?? SEED_PW);
  const rw = Number(body.rw ?? 0.374);
  const alpha = Number(body.alpha ?? 0.71);
  const dailyBaseline = Number(body.daily_baseline_income ?? RAJAN.dailyBaseline);
  const upiVpa = String(body.upi_vpa ?? RAJAN.upiVpa);

  const coverageLimit = 5 * dailyBaseline;
  const effectiveDate = new Date().toISOString();
  const renewalDate = new Date(Date.now() + 7 * 86400000).toISOString();

  let policyNumber = `GW-SR-${Date.now()}`;
  let policycenterId = `PC-${randomUUID().slice(0, 8)}`;

  if (hasSupabaseService() && isUuid(sub)) {
    await updateWorkerProfile(sub, {
      name,
      city,
      platform,
      vehicle_type: vehicleType,
      upi_vpa: upiVpa,
      device_fingerprint: RAJAN.deviceFingerprint,
    });

    const existing = await getPolicyByWorker(sub);
    if (existing) {
      policyNumber = existing.policy_number;
      policycenterId = existing.policycenter_id ?? policycenterId;
    } else {
      await createPolicyForWorker({
        workerId: sub,
        policyNumber,
        weeklyPremium,
        rw,
        alpha,
        coverageLimit,
        policycenterId,
        effectiveDate,
        renewalDate,
      });
    }
  }

  return NextResponse.json({
    policy_number: policyNumber,
    status: "ACTIVE",
    coverage_limit: coverageLimit,
    guidewire_sync: true,
    policycenter_id: policycenterId,
    daily_baseline_income: dailyBaseline,
  });
}
