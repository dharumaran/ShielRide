export type Policy = {
  policyNumber: string;
  workerId: string;
  status: "ACTIVE" | "LAPSED" | "PAUSED";
  weeklyPremium: number;
  effectiveDate: string;
  renewalDate: string;
  coverageLimit: number;
  triggers: string[];
  policycenterId: string;
};
