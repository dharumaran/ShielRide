/**
 * Anti-spoofing & fraud signals beyond raw GPS.
 * Aggregates into B (behavioral), G (geo/network), L (linkage/identity) for F_w.
 */

import { clamp01, type FraudComponents } from "./fraud-engine";

export type FraudSignalInput = {
  /** Z-score of orders/hour vs 30d mean (abs value) */
  orderVelocityZ: number;
  /** Sudden income drop without external trigger (0–1 suspicion) */
  incomeDropMismatch: number;
  /** GPS speed km/h (120+ = flag) */
  gpsSpeedKmh: number;
  /** Reported active delivery but static GPS for >10min (0–1) */
  staticGpsWhileActive: number;
  /** Weather station cell vs GPS pin mismatch (0–1) */
  weatherCellMismatch: number;
  /** IP geolocation region vs claimed city (0–1) */
  ipRegionMismatch: number;
  /** VPN / hosting / datacenter ASN suspicion (0–1) */
  vpnOrDatacenter: number;
  /** Device fingerprint changed vs last session (0–1) */
  deviceIntegrityDrift: number;
  /** Play Integrity / DeviceCheck attestation failed */
  appAttestationFailed: boolean;
  /** Number of distinct accounts sharing same UPI VPA (0 = unique) */
  upiVpaShareCount: number;
  /** Synchronized claims in same geo-cluster (count) */
  geoClusterSyncClaims: number;
  /** Days since SIM change (0 = unknown, <7 = elevated) */
  simChangeDaysAgo: number | null;
};

export type FraudSignalDetail = {
  id: string;
  label: string;
  severity: number;
  bucket: "B" | "G" | "L";
};

/**
 * Map raw signals → B, G, L sub-scores ∈ [0,1].
 */
export function computeFraudComponentsFromSignals(
  s: Partial<FraudSignalInput>
): FraudComponents & {
  flags: FraudSignalDetail[];
  narrative: string[];
} {
  const flags: FraudSignalDetail[] = [];
  const narrative: string[] = [];

  const vel = Math.min(1, Math.abs(s.orderVelocityZ ?? 0) / 4);
  const inc = clamp01(s.incomeDropMismatch ?? 0);
  const bRaw = 0.5 * vel + 0.5 * inc;

  const speedFlag = (s.gpsSpeedKmh ?? 0) > 120 ? 0.9 : 0;
  const staticG = clamp01(s.staticGpsWhileActive ?? 0);
  const wx = clamp01(s.weatherCellMismatch ?? 0);
  const ip = clamp01(s.ipRegionMismatch ?? 0);
  const vpn = clamp01(s.vpnOrDatacenter ?? 0);
  const gRaw = Math.max(
    speedFlag,
    0.35 * staticG + 0.25 * wx + 0.25 * ip + 0.15 * vpn
  );

  if (speedFlag > 0.5) {
    flags.push({
      id: "GPS_SPEED",
      label: "GPS speed >120 km/h",
      severity: speedFlag,
      bucket: "G",
    });
    narrative.push("Geo: impossible speed spike for last-mile delivery.");
  }
  if (staticG > 0.4) {
    flags.push({
      id: "STATIC_GPS",
      label: "Static GPS while “active delivery”",
      severity: staticG,
      bucket: "G",
    });
  }
  if (wx > 0.3) {
    flags.push({
      id: "WX_CELL",
      label: "GPS vs weather cell mismatch",
      severity: wx,
      bucket: "G",
    });
  }
  if (ip > 0.25 || vpn > 0.25) {
    flags.push({
      id: "IP_VPN",
      label: "IP region / VPN–datacenter anomaly",
      severity: Math.max(ip, vpn),
      bucket: "G",
    });
    narrative.push("Network: IP geography or ASN inconsistent with rider city.");
  }

  const dev = clamp01(s.deviceIntegrityDrift ?? 0);
  const att = s.appAttestationFailed ? 0.85 : 0;
  const upi = Math.min(1, (s.upiVpaShareCount ?? 0) / 4);
  const sync = Math.min(1, (s.geoClusterSyncClaims ?? 0) / 5);
  const sim =
    s.simChangeDaysAgo != null && s.simChangeDaysAgo < 7 ? 0.45 : 0;
  const lRaw = Math.max(
    0.35 * dev + 0.35 * att + 0.2 * upi + 0.2 * sync,
    sim
  );

  if (dev > 0.35) {
    flags.push({
      id: "DEVICE_DRIFT",
      label: "Device fingerprint drift vs history",
      severity: dev,
      bucket: "L",
    });
  }
  if (s.appAttestationFailed) {
    flags.push({
      id: "ATTEST_FAIL",
      label: "App attestation failed (Play Integrity / DeviceCheck)",
      severity: 0.85,
      bucket: "L",
    });
    narrative.push("Device attestation did not validate genuine install.");
  }
  if (upi > 0.2) {
    flags.push({
      id: "UPI_SHARE",
      label: "UPI VPA linked across multiple accounts",
      severity: upi,
      bucket: "L",
    });
  }
  if (sync > 0.2) {
    flags.push({
      id: "GEO_SYNC",
      label: "Synchronized claims in geo-cluster",
      severity: sync,
      bucket: "L",
    });
  }
  if (sim > 0.3) {
    flags.push({
      id: "SIM_RECENT",
      label: "Recent SIM change (<7d)",
      severity: sim,
      bucket: "L",
    });
  }

  if (vel > 0.4 || inc > 0.35) {
    flags.push({
      id: "BEHAVIOR",
      label: "Order velocity / income pattern anomaly",
      severity: bRaw,
      bucket: "B",
    });
  }

  return {
    B: clamp01(bRaw),
    G: clamp01(gRaw),
    L: clamp01(lRaw),
    flags,
    narrative,
  };
}

/** Clean demo path — low scores, few flags */
export function demoCleanFraudSignals(): ReturnType<
  typeof computeFraudComponentsFromSignals
> {
  return computeFraudComponentsFromSignals({
    orderVelocityZ: 0.4,
    incomeDropMismatch: 0.05,
    gpsSpeedKmh: 25,
    staticGpsWhileActive: 0.08,
    weatherCellMismatch: 0.06,
    ipRegionMismatch: 0.04,
    vpnOrDatacenter: 0.02,
    deviceIntegrityDrift: 0.05,
    appAttestationFailed: false,
    upiVpaShareCount: 0,
    geoClusterSyncClaims: 0,
    simChangeDaysAgo: 400,
  });
}
