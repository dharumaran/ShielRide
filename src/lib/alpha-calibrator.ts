/**
 * α_new = Observed_Total_Loss_₹ / (P_base × ΣR_w × worker_count)
 */

import { P_BASE } from "./premium-engine";

export function recalibrateAlpha(params: {
  observedTotalLoss: number;
  sumRw: number;
  workerCount: number;
  pBase?: number;
}): { alphaNew: number; formula: string } {
  const pBase = params.pBase ?? P_BASE;
  const denom = pBase * params.sumRw * params.workerCount;
  if (denom <= 0) {
    return { alphaNew: 0.7, formula: "denom=0 → keep default α" };
  }
  const alphaNew = params.observedTotalLoss / denom;
  return {
    alphaNew,
    formula: `α_new = ${params.observedTotalLoss} / (${pBase} × ${params.sumRw.toFixed(4)} × ${params.workerCount}) = ${alphaNew.toFixed(4)}`,
  };
}
