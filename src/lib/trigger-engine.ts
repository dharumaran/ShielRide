/**
 * Five parametric triggers — pure evaluation from time-series / snapshots.
 */

export type TriggerType =
  | "RAINFALL"
  | "HEAT"
  | "AQI"
  | "OUTAGE"
  | "DEMAND_COLLAPSE";

export type RainfallReading = { t: number; mmPerHr: number };

/** Sustained > 35 mm/hr for > 45 minutes */
export function evaluateRainfallTrigger(readings: RainfallReading[]): boolean {
  const windowMs = 45 * 60 * 1000;
  if (readings.length === 0) return false;
  const sorted = [...readings].sort((a, b) => a.t - b.t);
  for (let i = 0; i < sorted.length; i++) {
    const startT = sorted[i].t;
    const inWindow = sorted.filter((r) => r.t >= startT && r.t <= startT + windowMs);
    if (inWindow.length === 0) continue;
    const allAbove = inWindow.every((r) => r.mmPerHr > 35);
    if (allAbove && inWindow.length >= 2) return true;
  }
  return false;
}

export type HeatReading = { t: number; heatIndexC: number };

/** > 42°C for > 2 hours between 11:00–16:00 local (caller passes hour in reading or filters) */
export function evaluateHeatTrigger(
  readings: HeatReading[],
  hourOfDay: (t: number) => number
): boolean {
  const relevant = readings.filter((r) => {
    const h = hourOfDay(r.t);
    return h >= 11 && h < 16;
  });
  if (relevant.length === 0) return false;
  const sorted = [...relevant].sort((a, b) => a.t - b.t);
  let runStart = sorted[0].t;
  let runEnd = sorted[0].t;
  for (let i = 1; i < sorted.length; i++) {
    const r = sorted[i];
    if (r.heatIndexC > 42) {
      runEnd = r.t;
      if (runEnd - runStart >= 2 * 60 * 60 * 1000) return true;
    } else {
      runStart = r.t;
      runEnd = r.t;
    }
  }
  return runEnd - runStart >= 2 * 60 * 60 * 1000;
}

export type AqiReading = { t: number; aqi: number };

/** AQI > 300 for > 3 consecutive hours */
export function evaluateAqiTrigger(readings: AqiReading[]): boolean {
  const sorted = [...readings].sort((a, b) => a.t - b.t);
  let streakMs = 0;
  let streakStart: number | null = null;
  for (let i = 1; i < sorted.length; i++) {
    const prev = sorted[i - 1];
    const cur = sorted[i];
    if (prev.aqi > 300 && cur.aqi > 300) {
      if (streakStart === null) streakStart = prev.t;
      streakMs = cur.t - streakStart;
      if (streakMs >= 3 * 60 * 60 * 1000) return true;
    } else if (cur.aqi <= 300) {
      streakStart = null;
      streakMs = 0;
    }
  }
  return false;
}

export type OutageWindow = { start: number; end: number };

/** > 90 minutes within any 6-hour window */
export function evaluateOutageTrigger(outages: OutageWindow[]): boolean {
  const sixHr = 6 * 60 * 60 * 1000;
  for (const o of outages) {
    const duration = o.end - o.start;
    if (duration > 90 * 60 * 1000) {
      const windowStart = o.start - sixHr + 1;
      const cluster = outages.filter((x) => x.start >= windowStart && x.end <= o.end + sixHr);
      const total = cluster.reduce((s, x) => s + (x.end - x.start), 0);
      if (total > 90 * 60 * 1000) return true;
    }
  }
  const merged = [...outages].sort((a, b) => a.start - b.start);
  for (let i = 0; i < merged.length; i++) {
    const anchor = merged[i].start;
    const slice = merged.filter((x) => x.start >= anchor && x.start <= anchor + sixHr);
    const total = slice.reduce((s, x) => s + (x.end - x.start), 0);
    if (total > 90 * 60 * 1000) return true;
  }
  return false;
}

export type OrderSample = { cancelled: boolean; t: number };

/**
 * EMA cancellation rate > 45% over 2h window, min 5 orders.
 * Simplified: use last N orders in 2h window, compute rate.
 */
export function cancellationRateInWindow(orders: OrderSample[], windowEnd: number): number {
  const twoHr = 2 * 60 * 60 * 1000;
  const slice = orders.filter((o) => o.t <= windowEnd && o.t >= windowEnd - twoHr);
  if (slice.length < 5) return 0;
  const c = slice.filter((o) => o.cancelled).length;
  return c / slice.length;
}

export function evaluateDemandCollapseTrigger(
  orders: OrderSample[],
  windowEnd: number
): boolean {
  return cancellationRateInWindow(orders, windowEnd) > 0.45;
}

export function payoutForTrigger(
  type: TriggerType,
  dailyBaseline: number,
  outageHours?: number
): number {
  switch (type) {
    case "RAINFALL":
      return 0.8 * dailyBaseline;
    case "HEAT":
      return 0.6 * dailyBaseline;
    case "AQI":
      return 0.5 * dailyBaseline;
    case "OUTAGE": {
      const h = Math.min(10, Math.max(0, outageHours ?? 0));
      return 0.7 * (h / 10) * dailyBaseline;
    }
    case "DEMAND_COLLAPSE":
      return 0.4 * dailyBaseline;
    default:
      return 0;
  }
}

/**
 * Rothfusz heat index approximation (°C inputs).
 * NOAA formula uses °F; we convert.
 */
export function heatIndexCelsius(tempC: number, humidityPct: number): number {
  const T = (tempC * 9) / 5 + 32;
  const R = humidityPct;
  const HI =
    -42.379 +
    2.04901523 * T +
    10.14333127 * R -
    0.22475541 * T * R -
    6.83783e-3 * T * T -
    5.481717e-2 * R * R +
    1.22874e-3 * T * T * R +
    8.5282e-4 * T * R * R -
    1.99e-6 * T * T * R * R;
  if (T < 80) return tempC;
  const hiC = ((HI - 32) * 5) / 9;
  return hiC;
}
