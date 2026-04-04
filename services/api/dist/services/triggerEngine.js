function istHour24(d) {
    const parts = new Intl.DateTimeFormat('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        hour12: false,
    }).formatToParts(d);
    const h = parts.find((p) => p.type === 'hour')?.value;
    return Number(h ?? 0);
}
export function evaluateTriggers(input) {
    const hourIst = istHour24(input.now);
    const isHeatWindow = hourIst >= 11 && hourIst < 16;
    const hasMinOrders = input.orderDensity >= 5;
    const checks = [
        {
            type: 'rainfall',
            active: input.rainfallMmHr > 35 && input.sustainedMinutes.rainfall > 45,
            reason: 'rainfallMmHr > 35 sustained > 45m',
            triggerValue: input.rainfallMmHr,
            payoutPct: 0.8,
        },
        {
            type: 'heat',
            active: input.heatIndexC > 42 && isHeatWindow,
            reason: 'heatIndexC > 42 during 11:00-16:00 IST',
            triggerValue: input.heatIndexC,
            payoutPct: 0.6,
        },
        {
            type: 'aqi',
            active: input.aqiScore > 300 && input.sustainedMinutes.aqi >= 180,
            reason: 'aqiScore > 300 sustained >= 3h',
            triggerValue: input.aqiScore,
            payoutPct: 0.5,
        },
        {
            type: 'outage',
            active: input.platformStatus === 'outage' ||
                (input.platformStatus === 'degraded' && input.sustainedMinutes.outage >= 90),
            reason: 'platform 5xx or timeout > 90m',
            triggerValue: input.sustainedMinutes.outage,
            payoutPct: 0.7,
        },
        {
            type: 'demand',
            active: input.cancelRatePct > 45 && input.sustainedMinutes.demand >= 120 && hasMinOrders,
            reason: 'cancelRatePct > 45% sustained > 2h and >=5 orders',
            triggerValue: input.cancelRatePct,
            payoutPct: 0.4,
        },
    ];
    return checks;
}
export function payoutPaiseForTrigger(triggerType, baselineIncomePaise, outageMinutes) {
    if (triggerType === 'outage') {
        const outageHours = outageMinutes / 60;
        return Math.round(0.7 * (outageHours / 10) * baselineIncomePaise);
    }
    const pct = {
        rainfall: 0.8,
        heat: 0.6,
        aqi: 0.5,
        demand: 0.4,
    };
    return Math.round(baselineIncomePaise * pct[triggerType]);
}
