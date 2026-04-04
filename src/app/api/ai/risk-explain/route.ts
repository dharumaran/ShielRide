import { NextResponse } from "next/server";
import { explainRiskQuote } from "@/ai/risk-explainer";
import { premiumFromComponents, type RiskComponents } from "@/lib/premium-engine";
import { SEED_ALPHA, RAJAN } from "@/lib/seed-data";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const components = (body.components ?? {}) as RiskComponents;
  const alpha = Number(body.alpha ?? SEED_ALPHA);
  const prem = premiumFromComponents(
    {
      R: Number(components.R ?? 0.82),
      O: Number(components.O ?? 0.1),
      H: Number(components.H ?? 0.55),
      C: Number(components.C ?? 0.25),
      A: Number(components.A ?? 0.3),
      S: 0,
    },
    alpha
  );
  const exp = await explainRiskQuote({
    rw: prem.rw,
    pw: prem.pw,
    breakdown: prem.breakdown,
    city: String(body.city ?? RAJAN.city),
    personaName: String(body.personaName ?? RAJAN.name),
    platform: String(body.platform ?? RAJAN.platform),
    forecastNote: body.forecastNote,
    tenureWeeks: RAJAN.tenureWeeks,
  });
  return NextResponse.json({ ...exp, prem });
}
