import { NextResponse } from "next/server";
import { explainFraudDecision } from "@/ai/fraud-explainer";
import { fraudDecision } from "@/lib/fraud-engine";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const B = Number(body.B ?? 0);
  const G = Number(body.G ?? 0);
  const L = Number(body.L ?? 0);
  const fw = Number(body.fw ?? 0);
  const d = fraudDecision(fw);
  const r = await explainFraudDecision({
    B,
    G,
    L,
    fw,
    bFlags: body.bFlags ?? [],
    gFlags: body.gFlags ?? [],
    lFlags: body.lFlags ?? [],
    decisionLabel: d.label,
  });
  return NextResponse.json(r);
}
