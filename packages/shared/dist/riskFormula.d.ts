import type { PlatformStatus, RiskScoreResult } from './types.js';
/** README α; base chosen so P_w stays in the advertised ₹20–₹50 band for R_w ∈ [0, 1]. */
export declare const WEEKLY_PREMIUM_ALPHA = 0.7;
export declare const WEEKLY_PREMIUM_BASE = 30;
export declare const WEEKLY_PREMIUM_MIN = 20;
export declare const WEEKLY_PREMIUM_MAX = 50;
export type RiskInputs = {
    rainfallMmHr: number;
    heatIndexC: number;
    aqiScore: number;
    cancelRatePct: number;
    platformStatus: PlatformStatus;
};
export type RiskComponents = {
    R: number;
    H: number;
    A: number;
    O: number;
    C: number;
};
/** Feature components (same geometry as the legacy formula) for UI when ML supplies R_w only. */
export declare function computeRiskFeatureComponents(inputs: RiskInputs): RiskComponents;
export declare function computeRiskScore(inputs: RiskInputs): RiskScoreResult;
//# sourceMappingURL=riskFormula.d.ts.map