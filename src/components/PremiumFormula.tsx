"use client";

import { P_BASE, PREMIUM_FLOOR, PREMIUM_CAP } from "@/lib/premium-engine";

export function PremiumFormula({
  rw,
  alpha = 0.7,
  pw,
}: {
  rw: number;
  alpha?: number;
  pw: number;
}) {
  const raw = P_BASE * (1 + alpha * rw);
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-900">
      <span className="font-sans text-xs font-semibold text-slate-600">
        Weekly premium
      </span>
      <p className="mt-2">
        P<sub>w</sub> = ₹{P_BASE} × (1 + {alpha} × {rw.toFixed(3)}) = ₹{P_BASE} ×{" "}
        {(1 + alpha * rw).toFixed(4)} = ₹{raw.toFixed(2)} → clamp ₹{PREMIUM_FLOOR}–₹
        {PREMIUM_CAP} ≈ ₹{pw}
      </p>
    </div>
  );
}
