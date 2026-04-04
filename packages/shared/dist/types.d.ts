export type Platform = 'zepto' | 'blinkit' | 'swiggy';
export type PlatformStatus = 'online' | 'degraded' | 'outage';
export type TriggerType = 'rainfall' | 'heat' | 'aqi' | 'outage' | 'demand';
export type WorkerStatus = 'active' | 'suspended' | 'review';
export type PolicyStatus = 'active' | 'expired' | 'cancelled';
export type PayoutStatus = 'pending' | 'processing' | 'credited' | 'review' | 'rejected';
export type FraudReviewStatus = 'pending' | 'cleared' | 'confirmed';
export type FraudFlagType = 'behavioral' | 'geo' | 'linkage' | 'ring';
export type AuditEntityType = 'worker' | 'policy' | 'payout' | 'fraud';
export type ApiEnvelope<T> = {
    data: T | null;
    error: {
        code: string;
        message: string;
        details?: unknown;
    } | null;
    meta: Record<string, unknown>;
};
export type MoneyPaise = number;
export type SensorReading = {
    id: string;
    city: string;
    pincode?: string | null;
    rainfallMmHr: number;
    heatIndexC: number;
    aqiScore: number;
    cancelRatePct: number;
    platformStatus: PlatformStatus;
    orderDensity: number;
    source: 'openweather' | 'cpcb' | 'platform';
    recordedAt: string;
};
export type RiskScoreResult = {
    riskScore: number;
    premiumRupees: number;
    premiumPaise: MoneyPaise;
    components: {
        R: number;
        H: number;
        A: number;
        O: number;
        C: number;
    };
};
export type TriggerActive = {
    type: TriggerType;
    active: boolean;
    reason: string;
    triggerValue?: number;
    payoutPct?: number;
};
//# sourceMappingURL=types.d.ts.map