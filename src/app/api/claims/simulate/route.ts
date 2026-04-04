import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { payoutForTrigger } from "@/lib/trigger-engine";
import { RAJAN, SEED_POLICY } from "@/lib/seed-data";
import { computeFw } from "@/lib/fraud-engine";
import { razorpayUpiPayoutSandbox } from "@/lib/upi-utils";
import { sendPayoutNotification } from "@/lib/notifications";
import { demoCleanFraudSignals } from "@/lib/fraud-signals";
import { getSubFromAuthHeader, isUuid } from "@/lib/auth-request";
import { getPolicyByWorker, insertClaimRow } from "@/lib/db-queries";
import { hasSupabaseService } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const trigger = (body.trigger as "RAINFALL") ?? "RAINFALL";
  const sub = await getSubFromAuthHeader(req);

  const fraud = demoCleanFraudSignals();
  const fw = computeFw({ B: fraud.B, G: fraud.G, L: fraud.L });
  const dailyBaseline = RAJAN.dailyBaseline;
  const amount = payoutForTrigger(trigger, dailyBaseline);

  const payout = await razorpayUpiPayoutSandbox({
    amountPaise: Math.round(amount * 100),
    vpa: RAJAN.upiVpa,
    reference: `sim_${Date.now()}`,
  });
  const notif = await sendPayoutNotification({
    workerName: RAJAN.name,
    amount,
  });
  const claimNumber = `CLM-SR-${Date.now()}`;
  const claimcenterId = `CC-${randomUUID().slice(0, 8)}`;

  const fraudPayload = {
    B: fraud.B,
    G: fraud.G,
    L: fraud.L,
    flags: fraud.flags,
    narrative: fraud.narrative,
    formula: "F_w = 0.40×B + 0.35×G + 0.25×L",
  };

  let workerId = RAJAN.id;
  if (sub && isUuid(sub)) workerId = sub;

  if (hasSupabaseService() && isUuid(workerId)) {
    const policy = await getPolicyByWorker(workerId);
    await insertClaimRow({
      workerId,
      policyId: policy?.id ?? null,
      claimNumber,
      triggerType: trigger,
      payoutAmount: amount,
      fw,
      B: fraud.B,
      G: fraud.G,
      L: fraud.L,
      fraudSignals: fraudPayload,
      processedSeconds: 252,
      claimcenterId,
    });
  }

  return NextResponse.json({
    claim: {
      claimNumber,
      trigger,
      amount,
      fw,
      B: fraud.B,
      G: fraud.G,
      L: fraud.L,
      processedSec: 252,
      policyNumber: SEED_POLICY.policyNumber,
      workerId,
      claimcenterId,
      at: Date.now(),
      fraudSignals: fraudPayload,
    },
    payout,
    notification: notif,
    message: notif.text,
  });
}
