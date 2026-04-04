"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type TriggerCardProps = {
  title: string;
  subtitle?: string;
  current: number;
  threshold: number;
  unit: string;
  status: "ok" | "watch" | "near" | "triggered";
  highlightMoat?: boolean;
};

function progressColor(pct: number) {
  if (pct >= 80) return "bg-red-500";
  if (pct >= 60) return "bg-amber-500";
  return "bg-emerald-500";
}

export function TriggerCard({
  title,
  subtitle,
  current,
  threshold,
  unit,
  status,
  highlightMoat,
}: TriggerCardProps) {
  const pct = threshold > 0 ? Math.min(100, (current / threshold) * 100) : 0;
  const pulse = pct >= 80 && status !== "triggered";

  return (
    <Card
      className={cn(
        pulse && "ring-2 ring-amber-400/60",
        status === "triggered" && "ring-2 ring-red-500"
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold text-slate-900">
            {title}
            {highlightMoat && (
              <Badge variant="outline" className="ml-2 text-[10px] text-blue-700">
                Industry first
              </Badge>
            )}
          </CardTitle>
          <Badge
            variant={
              status === "triggered"
                ? "danger"
                : pct >= 80
                  ? "warning"
                  : "secondary"
            }
          >
            {status === "triggered"
              ? "Triggered"
              : pct >= 80
                ? "Near threshold"
                : "Monitoring"}
          </Badge>
        </div>
        {subtitle && (
          <p className="text-xs text-slate-600">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-slate-800">
          {current.toFixed(1)}
          {unit} / {threshold}
          {unit}
          <span className="text-slate-500"> — {pct.toFixed(0)}% to trigger</span>
        </p>
        <div className={cn(pulse && "animate-pulse-bar")}>
          <Progress
            value={pct}
            indicatorClassName={progressColor(pct)}
            className="h-2.5"
          />
        </div>
      </CardContent>
    </Card>
  );
}
