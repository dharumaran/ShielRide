const byCity = {};
export function getMockSensor(city) {
    const key = city.toLowerCase();
    if (!byCity[key]) {
        byCity[key] = {
            rainfallMmHr: 14,
            heatIndexC: 36,
            aqiScore: 190,
            cancelRatePct: 18,
            platformStatus: 'online',
            orderDensity: 7,
        };
    }
    const current = byCity[key];
    current.rainfallMmHr = Math.max(0, current.rainfallMmHr + (Math.random() - 0.44) * 5);
    current.heatIndexC = Math.max(20, current.heatIndexC + (Math.random() - 0.5) * 0.8);
    current.aqiScore = Math.max(10, Math.round(current.aqiScore + (Math.random() - 0.5) * 18));
    current.cancelRatePct = Math.max(0, Math.min(100, current.cancelRatePct + (Math.random() - 0.5) * 4));
    current.platformStatus = Math.random() > 0.97 ? 'outage' : Math.random() > 0.85 ? 'degraded' : 'online';
    return current;
}
