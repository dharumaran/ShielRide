"use client";

import { IncomeChart } from "@/components/IncomeChart";
import { INCOME_WEEK_1 } from "@/lib/seed-data";

const overlay = [0, 0, 520, 0, 0, 0, 0];

export function LandingHeroChart({ compact }: { compact?: boolean }) {
  return (
    <div className={compact ? "" : "rounded-xl border border-slate-200 bg-white p-4 shadow-sm"}>
      {!compact && (
        <p className="mb-2 text-sm font-medium text-slate-800">
          Week income — Wednesday dip (rain) vs ShieldRide payout
        </p>
      )}
      <IncomeChart weekIncome={INCOME_WEEK_1} payoutOverlay={overlay} />
    </div>
  );
}
