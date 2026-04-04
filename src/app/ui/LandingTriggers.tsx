"use client";

import { useEffect, useState } from "react";
import { TriggerCard } from "@/components/TriggerCard";

type T = {
  type: string;
  current: number;
  threshold: number;
  unit: string;
  pct: number;
  moat?: boolean;
};

export function LandingTriggers() {
  const [triggers, setTriggers] = useState<T[] | null>(null);

  useEffect(() => {
    fetch("/api/triggers/auto-scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city: "Chennai" }),
    })
      .then((r) => r.json())
      .then((d) => setTriggers(d.triggers ?? []))
      .catch(() => setTriggers([]));
  }, []);

  if (!triggers) {
    return <p className="text-sm text-slate-500">Loading trigger telemetry…</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {triggers.map((t) => (
        <TriggerCard
          key={t.type}
          title={
            t.type === "DEMAND_COLLAPSE"
              ? "Demand collapse (cancellation EMA)"
              : t.type.replace("_", " ")
          }
          subtitle={
            t.moat
              ? "Demand-Volatility Protection — Unique to ShieldRide"
              : undefined
          }
          current={t.current}
          threshold={t.threshold}
          unit={t.unit}
          highlightMoat={t.moat}
          status={
            t.pct >= 100 ? "triggered" : t.pct >= 80 ? "near" : "ok"
          }
        />
      ))}
    </div>
  );
}
