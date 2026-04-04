import type { RiskComponents } from "./premium-engine";
import { computeWeeklyPremium } from "./premium-engine";

export const RAJAN = {
  id: "worker_rajan_001",
  name: "Rajan Kumar",
  age: 26,
  city: "Chennai",
  state: "Tamil Nadu",
  platform: "Zepto" as const,
  vehicle: "Electric scooter (Ola S1)",
  phone: "+919876543210",
  hoursNote: "7am–10pm demand-driven (~10 active hours)",
  tenureWeeks: 14,
  upiVpa: "rajan.kumar@upi",
  device: "Redmi Note 11",
  deviceFingerprint: "RN11-XXXX",
  dailyBaseline: 650,
};

/** Week 1 daily income Mon–Sun */
export const INCOME_WEEK_1 = [820, 530, 80, 790, 910, 680, 950];
export const INCOME_WEEK_2 = [800, 600, 150, 820, 900, 700, 920];
export const INCOME_WEEK_3 = [810, 550, 120, 780, 880, 690, 940];
export const INCOME_WEEK_4 = [830, 540, 400, 0, 0, 0, 0];

export const SEED_RISK_COMPONENTS: RiskComponents = {
  R: 0.82,
  H: 0.55,
  A: 0.3,
  O: 0.1,
  C: 0.25,
  S: 0,
};

export const SEED_RW = 0.374;
/** Self-calibrated α (slightly above 0.70) */
export const SEED_ALPHA = 0.71;
/** Derived from P_w = P_base × (1 + α × R_w), clamped ₹20–50 */
export const SEED_PW = computeWeeklyPremium(SEED_RW, SEED_ALPHA).pw;
/** Pool + reinsurance narrative; CAR ≈ 1.42 (monitor band, approaching 1.5) */
export const SEED_EXPECTED_LOSS = 145600;
export const SEED_CAR = 1.42;
export const SEED_CAR_POOL = SEED_CAR * SEED_EXPECTED_LOSS;

export const SEED_PAYOUTS = [
  {
    id: "pay_1",
    trigger: "RAINFALL" as const,
    amount: 520,
    fw: 0.09,
    processedSec: 252,
    B: 0.08,
    G: 0.11,
    L: 0.05,
    claimNumber: "CLM-SR-1709123456789",
    policycenterId: "PC-demo",
    at: Date.now() - 86400000 * 10,
  },
  {
    id: "pay_2",
    trigger: "HEAT" as const,
    amount: 390,
    fw: 0.12,
    processedSec: 235,
    B: 0.14,
    G: 0.09,
    L: 0.07,
    claimNumber: "CLM-SR-1709223456789",
    policycenterId: "PC-demo",
    at: Date.now() - 86400000 * 6,
  },
  {
    id: "pay_3",
    trigger: "DEMAND_COLLAPSE" as const,
    amount: 260,
    fw: 0.07,
    processedSec: 270,
    B: 0.06,
    G: 0.08,
    L: 0.05,
    claimNumber: "CLM-SR-1709323456789",
    policycenterId: "PC-demo",
    at: Date.now() - 86400000 * 2,
  },
];

export const SEED_POLICY = {
  policyNumber: "GW-SR-1735DEMO",
  status: "ACTIVE" as const,
  weeklyPremium: SEED_PW,
  effectiveDate: new Date(Date.now() - 86400000 * 30).toISOString(),
  renewalDate: new Date(Date.now() + 86400000 * 7).toISOString(),
  coverageLimit: 5 * RAJAN.dailyBaseline,
  triggers: [
    "RAINFALL",
    "HEAT",
    "AQI",
    "OUTAGE",
    "DEMAND_COLLAPSE",
  ] as const,
  policycenterId: "PC-uuid-demo-001",
};

export const PORTFOLIO_SEED = {
  workerCount: 1000,
  totalPremiumCollected: 920000,
  expectedLoss: 145600,
  poolCapital: 117000,
  reinsurance: 50000,
  aucRoc: 0.89,
  rmse: 0.067,
  fraudPrecision: 0.92,
  fraudRecall: 0.81,
  alphaHistory: [
    { week: "W1", alpha: 0.7 },
    { week: "W2", alpha: 0.705 },
    { week: "W3", alpha: 0.708 },
    { week: "W4", alpha: 0.712 },
    { week: "W5", alpha: 0.715 },
    { week: "W6", alpha: 0.708 },
    { week: "W7", alpha: 0.702 },
    { week: "W8", alpha: 0.71 },
  ],
};

export const LIVE_STATS = {
  workersCovered: 12847,
  paidOutWeek: 2840000,
  avgPayoutMinutes: 4.2,
};
