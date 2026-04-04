import { NextResponse } from "next/server";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const policyNumber = `GW-SR-${Date.now()}`;
  return NextResponse.json({
    policy_number: policyNumber,
    status: "ACTIVE",
    coverage_limit: 5 * (body.daily_baseline_income ?? 650),
    guidewire_sync: true,
    policycenter_id: `PC-${randomUUID().slice(0, 8)}`,
  });
}
