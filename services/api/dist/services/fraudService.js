const clamp = (n) => Math.max(0, Math.min(1, n));
export function computeFraudScore(input) {
    const z = Math.abs(input.currentIncomePaise - input.mu30dPaise) / Math.max(input.sigma30dPaise, 1);
    const bFromZ = clamp(z / 4);
    const inactivity = clamp(input.staticGpsMinutes / 90);
    const B = clamp(bFromZ * 0.7 + inactivity * 0.3);
    const speedRisk = input.gpsSpeedKmph > 120 ? 1 : clamp(input.gpsSpeedKmph / 120);
    const mismatchRisk = input.weatherCellMismatch ? 0.8 : 0.1;
    const G = clamp(speedRisk * 0.55 + mismatchRisk * 0.45);
    const deviceRisk = clamp((input.sharedDeviceCount - 1) / 4);
    const upiRisk = input.sharedUpi ? 1 : 0;
    const L = clamp(deviceRisk * 0.6 + upiRisk * 0.4);
    const F_w = clamp(0.4 * B + 0.35 * G + 0.25 * L);
    const decision = F_w < 0.3
        ? 'auto_approve'
        : F_w <= 0.5
            ? 'approve_with_log'
            : F_w <= 0.8
                ? 'delay_review'
                : 'manual_review';
    return { B, G, L, F_w, decision };
}
