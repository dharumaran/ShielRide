import type { PlatformStatus, RiskScoreResult } from './types.js'

/** README α; base chosen so P_w stays in the advertised ₹20–₹50 band for R_w ∈ [0, 1]. */
export const WEEKLY_PREMIUM_ALPHA = 0.7
export const WEEKLY_PREMIUM_BASE = 30
export const WEEKLY_PREMIUM_MIN = 20
export const WEEKLY_PREMIUM_MAX = 50

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0
  if (n < 0) return 0
  if (n > 1) return 1
  return n
}

export type RiskInputs = {
  rainfallMmHr: number
  heatIndexC: number
  aqiScore: number
  cancelRatePct: number
  platformStatus: PlatformStatus
}

export function computeRiskScore(inputs: RiskInputs): RiskScoreResult {
  const R = clamp01(inputs.rainfallMmHr / 75)
  const H = clamp01(Math.max(0, (inputs.heatIndexC - 30) / 17))
  const A = clamp01(inputs.aqiScore / 380)
  const O = inputs.platformStatus === 'degraded' ? 1.0 : 0.1
  const C = clamp01(inputs.cancelRatePct / 58)

  const riskScore = clamp01(R * 0.25 + H * 0.15 + A * 0.1 + O * 0.2 + C * 0.15)

  // README: P_w = P_base × (1 + α × R_w). Product onboarding band: ₹20–₹50/week.
  const raw = Math.round(WEEKLY_PREMIUM_BASE * (1 + WEEKLY_PREMIUM_ALPHA * riskScore))
  const premiumRupees = Math.min(Math.max(raw, WEEKLY_PREMIUM_MIN), WEEKLY_PREMIUM_MAX)
  const premiumPaise = premiumRupees * 100

  return {
    riskScore,
    premiumRupees,
    premiumPaise,
    components: { R, H, A, O, C },
  }
}

