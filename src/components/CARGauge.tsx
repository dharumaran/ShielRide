"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { computeCar } from "@/lib/car-monitor";

const GREEN = "#10b981";
const AMBER = "#f59e0b";
const RED = "#ef4444";

export function CARGauge({
  pool,
  expectedLoss,
}: {
  pool: number;
  expectedLoss: number;
}) {
  const { car, status } = computeCar(pool, expectedLoss);
  const displayCar = Number.isFinite(car) ? car : 2;
  const arc = Math.min(1, displayCar / 2);
  const data = [
    { name: "car", value: arc * 100 },
    { name: "rest", value: 100 - arc * 100 },
  ];
  const color =
    status === "stable"
      ? GREEN
      : status === "monitor"
        ? AMBER
        : RED;

  return (
    <div className="relative mx-auto h-48 w-full max-w-xs">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="70%"
            startAngle={180}
            endAngle={0}
            innerRadius={60}
            outerRadius={80}
            dataKey="value"
            stroke="none"
          >
            <Cell fill={color} />
            <Cell fill="#e2e8f0" />
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 top-10 flex flex-col items-center justify-end pb-2">
        <span className="text-2xl font-bold text-slate-900">
          {displayCar.toFixed(2)}
        </span>
        <span className="text-xs text-slate-600">CAR (pool / expected loss)</span>
      </div>
      <div className="mt-[-8px] flex justify-center gap-4 text-[10px] text-slate-500">
        <span>1.0</span>
        <span>1.2</span>
        <span>1.5</span>
      </div>
    </div>
  );
}
