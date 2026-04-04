import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { fraudDecision } from "@/lib/fraud-engine";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const fw = Number(body.F_w_score ?? body.fw_score ?? 0.1);
  const d = fraudDecision(fw);
  const claimNumber = `CLM-SR-${Date.now()}`;
  const auto = fw < 0.5;
  return NextResponse.json({
    claim_number: claimNumber,
    status: auto ? "AUTO_APPROVED" : "PENDING_REVIEW",
    settlement_time_minutes: fw < 0.3 ? 4 : 30,
    guidewire_sync: true,
    claimcenter_id: `CC-${randomUUID().slice(0, 8)}`,
    decision: d.label,
  });
}
