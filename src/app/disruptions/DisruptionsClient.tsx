"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TriggerCard } from "@/components/TriggerCard";
import { Badge } from "@/components/ui/badge";

const cities = ["Chennai", "Mumbai", "Delhi", "Bengaluru"] as const;

export function DisruptionsClient() {
  const [city, setCity] = useState<string>("Chennai");
  const [triggers, setTriggers] = useState<
    {
      type: string;
      current: number;
      threshold: number;
      unit: string;
      pct: number;
      source: string;
      moat?: boolean;
    }[]
  >([]);
  const [weather, setWeather] = useState<{ source?: string } | null>(null);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/triggers/auto-scan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ city }),
    })
      .then((r) => r.json())
      .then((d) => {
        setTriggers(d.triggers ?? []);
        setWeather(d.weather);
        const ts = new Date(d.evaluatedAt).toLocaleTimeString("en-IN");
        setLog((prev) => {
          const line = `${ts} ${city}: scan complete`;
          return [line, ...prev].slice(0, 10);
        });
      });
  }, [city]);

  const anyTriggered = triggers.some((t) => t.pct >= 100);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {cities.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCity(c)}
            className={`rounded-full border px-3 py-1 text-sm ${
              city === c
                ? "border-blue-600 bg-blue-50 text-blue-800"
                : "border-slate-200 bg-white text-slate-600"
            }`}
          >
            {c}
            {c !== "Chennai" && (
              <Badge variant="muted" className="ml-2">
                Phase 2
              </Badge>
            )}
          </button>
        ))}
      </div>

      {anyTriggered && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-900 animate-pulse-bar">
          Alert: one or more triggers fired in evaluation window (demo).
        </div>
      )}

      <div className="flex flex-wrap gap-2 text-xs">
        <Badge variant="secondary">OpenWeatherMap / backup</Badge>
        <Badge variant="outline">{weather?.source ?? "mock"}</Badge>
        <Badge variant="muted">CPCB Mock</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {triggers.map((t) => (
          <TriggerCard
            key={t.type + city}
            title={t.type}
            subtitle={`Source: ${t.source}`}
            highlightMoat={t.moat}
            current={t.current}
            threshold={t.threshold}
            unit={t.unit}
            status={t.pct >= 100 ? "triggered" : t.pct >= 80 ? "near" : "ok"}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Auto-scan log</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1 font-mono text-xs text-slate-700">
            {log.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
