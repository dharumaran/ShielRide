import { NextResponse } from "next/server";
import {
  PORTFOLIO_SEED,
  SEED_CAR,
  SEED_CAR_POOL,
  SEED_EXPECTED_LOSS,
  SEED_ALPHA,
} from "@/lib/seed-data";
import { computeCar } from "@/lib/car-monitor";
import { recalibrateAlpha } from "@/lib/alpha-calibrator";

const ADMIN_PASS = () =>
  process.env.ADMIN_PASSWORD ?? "shieldride2026";

export async function GET(req: Request) {
  const pwd = req.headers.get("x-admin-password");
  if (pwd !== ADMIN_PASS()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const pool = SEED_CAR_POOL;
  const el = SEED_EXPECTED_LOSS;
  const car = computeCar(pool, el);
  const fraudQueue = [
    {
      id: "rev_1",
      claimNumber: "CLM-SR-REVIEW",
      fw: 0.62,
      B: 0.55,
      G: 0.48,
      L: 0.4,
      trigger: "OUTAGE",
    },
  ];
  return NextResponse.json({
    portfolio: PORTFOLIO_SEED,
    car: { ...car, pool, expectedLoss: el, display: SEED_CAR },
    fraudQueue,
    alpha: SEED_ALPHA,
    alphaHistory: PORTFOLIO_SEED.alphaHistory,
    metrics: {
      apiP99Ms: 62,
      triggerLagMin: 12,
      payoutCreditMin: 4.2,
      onboardingSec: 78,
      mlInferenceMs: 12,
      uptime: 99.94,
    },
  });
}

export async function POST(req: Request) {
  const pwd = req.headers.get("x-admin-password");
  if (pwd !== ADMIN_PASS()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  if (body.action === "recalibrate_alpha") {
    const r = recalibrateAlpha({
      observedTotalLoss: 150000,
      sumRw: 0.36,
      workerCount: 1000,
    });
    return NextResponse.json({
      before: SEED_ALPHA,
      after: Number(r.alphaNew.toFixed(4)),
      formula: r.formula,
    });
  }
  return NextResponse.json({ ok: true });
}
