import type { RiskComponents } from "@/lib/premium-engine";

export type RiskProfile = {
  workerId: string;
  components: RiskComponents;
  rw: number;
  weeklyPremium: number;
  alpha: number;
  updatedAt: number;
};
