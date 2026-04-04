"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function IncomeChart({
  weekIncome,
  payoutOverlay,
}: {
  weekIncome: number[];
  payoutOverlay: number[];
}) {
  const data = days.map((d, i) => ({
    day: d,
    actual: weekIncome[i] ?? 0,
    shield: payoutOverlay[i] ?? 0,
  }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="day" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v}`} />
          <Tooltip
            formatter={(value: number) => [`₹${value}`, ""]}
            labelClassName="text-slate-900"
          />
          <Legend />
          <Bar dataKey="actual" name="Actual income" fill="#2563eb" radius={[4, 4, 0, 0]} />
          <Bar
            dataKey="shield"
            name="ShieldRide payout"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-2 text-center text-xs text-slate-600">
        Wednesday rain dip + green recovery bar — proof of value
      </p>
    </div>
  );
}
