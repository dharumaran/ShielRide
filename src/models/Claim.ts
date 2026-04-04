export type Claim = {
  claimNumber: string;
  policyNumber: string;
  workerId: string;
  triggerType: string;
  payoutAmount: number;
  fwScore: number;
  status: string;
  processedSeconds?: number;
  B: number;
  G: number;
  L: number;
  claimcenterId: string;
  createdAt: number;
};
