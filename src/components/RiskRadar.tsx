"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import type { WeightedBreakdown } from "@/lib/premium-engine";

export function RiskRadar({ breakdown }: { breakdown: WeightedBreakdown[] }) {
  const data = breakdown.map((b) => ({
    metric:
      b.key === "social"
        ? "Social (P2)"
        : b.label.replace(" intensity", "").slice(0, 12),
    full: b.label,
    score: b.score,
    weight: b.weight,
  }));

  return (
    <div className="h-[280px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis
            dataKey="metric"
            tick={{ fill: "#475569", fontSize: 10 }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 1]} tick={false} />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#2563eb"
            fill="#3b82f6"
            fillOpacity={0.35}
            isAnimationActive
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
