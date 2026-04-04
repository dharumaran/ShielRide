/**
 * F_w = w₁·B + w₂·G + w₃·L
 * w₁=0.40, w₂=0.35, w₃=0.25
 */

export const FRAUD_W_B = 0.4;
export const FRAUD_W_G = 0.35;
export const FRAUD_W_L = 0.25;

export type FraudComponents = {
  B: number;
  G: number;
  L: number;
};

export type FraudDecision =
  | "instant"
  | "payout_review"
  | "delayed"
  | "blocked_manual";

export function clamp01(x: number): number {
  return Math.min(1, Math.max(0, x));
}

export function computeFw(c: FraudComponents): number {
  return (
    FRAUD_W_B * clamp01(c.B) +
    FRAUD_W_G * clamp01(c.G) +
    FRAUD_W_L * clamp01(c.L)
  );
}

export function fraudDecision(fw: number): {
  decision: FraudDecision;
  label: string;
  settlementMinutesHint: number;
} {
  const f = clamp01(fw);
  if (f < 0.3) {
    return {
      decision: "instant",
      label: "Instant payout (< 5 min), silent",
      settlementMinutesHint: 5,
    };
  }
  if (f < 0.5) {
    return {
      decision: "payout_review",
      label: "Payout + silent logging, flagged for review",
      settlementMinutesHint: 30,
    };
  }
  if (f <= 0.8) {
    return {
      decision: "delayed",
      label: "Delayed 30 min, re-validate — Verifying your claim",
      settlementMinutesHint: 30,
    };
  }
  return {
    decision: "blocked_manual",
    label: "Blocked — manual review queue (< 2hr SLA). Claim held, not rejected.",
    settlementMinutesHint: 120,
  };
}
