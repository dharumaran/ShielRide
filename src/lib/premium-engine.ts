/**
 * Weekly premium: P_w = P_base × (1 + α × R_w)
 * Clamped to ₹20–₹50/week (affordable for gig riders).
 */

export const P_BASE = 28;
export const ALPHA_DEFAULT = 0.7;
export const PREMIUM_FLOOR = 20;
export const PREMIUM_CAP = 50;

export const RISK_WEIGHTS = {
  rainfall: 0.25,
  outage: 0.2,
  heat: 0.15,
  cancellation: 0.15,
  aqi: 0.1,
  social: 0.15,
} as const;

export type RiskComponents = {
  /** R — rainfall intensity ∈ [0,1] */
  R: number;
  /** O — platform outage ∈ [0,1] */
  O: number;
  /** H — heat index ∈ [0,1] */
  H: number;
  /** C — cancellation rate ∈ [0,1] */
  C: number;
  /** A — AQI severity ∈ [0,1] */
  A: number;
  /** S — social disruption (Phase 2), default 0 */
  S?: number;
};

export type WeightedBreakdown = {
  key: keyof typeof RISK_WEIGHTS;
  label: string;
  weight: number;
  score: number;
  contribution: number;
};

function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}

/**
 * Composite risk R_w ∈ [0,1] — weighted sum of components (S=0 in Phase 1).
 */
export function computeRw(components: RiskComponents): number {
  const S = components.S ?? 0;
  const parts =
    RISK_WEIGHTS.rainfall * clamp01(components.R) +
    RISK_WEIGHTS.outage * clamp01(components.O) +
    RISK_WEIGHTS.heat * clamp01(components.H) +
    RISK_WEIGHTS.cancellation * clamp01(components.C) +
    RISK_WEIGHTS.aqi * clamp01(components.A) +
    RISK_WEIGHTS.social * clamp01(S);
  return clamp01(parts);
}

export function breakdownRw(components: RiskComponents): WeightedBreakdown[] {
  const S = components.S ?? 0;
  const rows: WeightedBreakdown[] = [
    {
      key: "rainfall",
      label: "Rainfall intensity",
      weight: RISK_WEIGHTS.rainfall,
      score: clamp01(components.R),
      contribution: RISK_WEIGHTS.rainfall * clamp01(components.R),
    },
    {
      key: "heat",
      label: "Heat index",
      weight: RISK_WEIGHTS.heat,
      score: clamp01(components.H),
      contribution: RISK_WEIGHTS.heat * clamp01(components.H),
    },
    {
      key: "aqi",
      label: "AQI severity",
      weight: RISK_WEIGHTS.aqi,
      score: clamp01(components.A),
      contribution: RISK_WEIGHTS.aqi * clamp01(components.A),
    },
    {
      key: "outage",
      label: "Platform outage",
      weight: RISK_WEIGHTS.outage,
      score: clamp01(components.O),
      contribution: RISK_WEIGHTS.outage * clamp01(components.O),
    },
    {
      key: "cancellation",
      label: "Cancellation rate",
      weight: RISK_WEIGHTS.cancellation,
      score: clamp01(components.C),
      contribution: RISK_WEIGHTS.cancellation * clamp01(components.C),
    },
    {
      key: "social",
      label: "Social Disruption (Phase 2 — NLP news signal)",
      weight: RISK_WEIGHTS.social,
      score: clamp01(S),
      contribution: RISK_WEIGHTS.social * clamp01(S),
    },
  ];
  return rows;
}

export function computeWeeklyPremium(
  rw: number,
  alpha: number = ALPHA_DEFAULT,
  pBase: number = P_BASE
): { pwRaw: number; pw: number; rw: number } {
  const r = clamp01(rw);
  const a = Math.max(0, alpha);
  const pwRaw = pBase * (1 + a * r);
  const pw = Math.min(PREMIUM_CAP, Math.max(PREMIUM_FLOOR, Math.round(pwRaw)));
  return { pwRaw, pw, rw: r };
}

export function premiumFromComponents(
  components: RiskComponents,
  alpha: number = ALPHA_DEFAULT
): {
  rw: number;
  breakdown: WeightedBreakdown[];
  pwRaw: number;
  pw: number;
} {
  const rw = computeRw(components);
  const breakdown = breakdownRw(components);
  const { pwRaw, pw } = computeWeeklyPremium(rw, alpha);
  return { rw, breakdown, pwRaw, pw };
}
