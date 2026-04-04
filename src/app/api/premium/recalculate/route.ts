import { NextResponse } from "next/server";
import {
  premiumFromComponents,
  type RiskComponents,
} from "@/lib/premium-engine";
import { SEED_ALPHA } from "@/lib/seed-data";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const components = (body.components ?? {}) as RiskComponents;
  const alpha = Number(body.alpha ?? SEED_ALPHA);
  const result = premiumFromComponents(
    {
      R: Number(components.R ?? 0),
      O: Number(components.O ?? 0),
      H: Number(components.H ?? 0),
      C: Number(components.C ?? 0),
      A: Number(components.A ?? 0),
      S: Number(components.S ?? 0),
    },
    alpha
  );
  return NextResponse.json({ ...result, alpha });
}
