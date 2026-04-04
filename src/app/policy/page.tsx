"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PremiumFormula } from "@/components/PremiumFormula";
import { GuidewireSync } from "@/components/GuidewireSync";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import {
  SEED_POLICY,
  SEED_RISK_COMPONENTS,
  PORTFOLIO_SEED,
  SEED_ALPHA,
} from "@/lib/seed-data";
import { computeWeeklyPremium, breakdownRw } from "@/lib/premium-engine";

const payoutRows = [
  { trigger: "Heavy rain >35 mm/hr × 45 min", pct: "80%", note: "daily baseline" },
  { trigger: "Heat index >42°C × 2h (11am–4pm)", pct: "60%", note: "daily baseline" },
  { trigger: "AQI >300 × 3h consecutive", pct: "50%", note: "daily baseline" },
  { trigger: "Platform outage >90 min / 6h window", pct: "70%×(h/10)", note: "daily baseline" },
  { trigger: "Cancellation rate >45% (2h EMA, min 5 orders)", pct: "40%", note: "Demand-Volatility — unique" },
];

export default function PolicyPage() {
  const [rwSlider, setRwSlider] = useState(0.374);
  const prem = useMemo(
    () => computeWeeklyPremium(rwSlider, SEED_ALPHA),
    [rwSlider]
  );

  const radarData = breakdownRw(SEED_RISK_COMPONENTS).map((b) => ({
    m: b.key === "social" ? "Social(P2)" : b.label.slice(0, 14),
    v: b.score,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-bold text-slate-900">Policy &amp; model</h1>
        <GuidewireSync />
        <span className="font-mono text-sm">{SEED_POLICY.policyNumber}</span>
      </div>
      <p className="text-sm text-slate-600">
        Income loss only · weekly premium · five triggers including
        demand-volatility (industry first).
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Coverage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>Weekly premium: ₹{SEED_POLICY.weeklyPremium}</p>
          <p>Coverage limit: ₹{SEED_POLICY.coverageLimit} (5× daily baseline)</p>
          <div className="flex flex-wrap gap-2">
            {SEED_POLICY.triggers.map((t) => (
              <Badge key={t} variant="secondary">
                {t}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Premium formula (interactive R_w)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="block text-sm text-slate-600">
            R_w slider: {rwSlider.toFixed(3)}
            <input
              type="range"
              min={0}
              max={1}
              step={0.001}
              value={rwSlider}
              onChange={(e) => setRwSlider(Number(e.target.value))}
              className="mt-2 w-full"
            />
          </label>
          <PremiumFormula rw={prem.rw} alpha={SEED_ALPHA} pw={prem.pw} />
          <p className="text-xs text-slate-500">
            Drag R_w to see P_w recalc — weekly premium clamped ₹20–₹50 for riders.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>α coefficient history (8 weeks)</CardTitle>
        </CardHeader>
        <CardContent className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={PORTFOLIO_SEED.alphaHistory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis domain={[0.68, 0.72]} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="alpha" stroke="#2563eb" dot />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Risk weight radar (6 weights, Social greyed)</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="m" tick={{ fontSize: 10 }} />
              <PolarRadiusAxis domain={[0, 1]} tick={false} />
              <Radar
                dataKey="v"
                stroke="#64748b"
                fill="#94a3b8"
                fillOpacity={0.4}
              />
            </RadarChart>
          </ResponsiveContainer>
          <p className="mt-2 text-center text-xs text-slate-500">
            Weights sum to 1.0 — Social Disruption reserved for Phase 2 (NLP).
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payout formula table</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-slate-600">
                <th className="p-2">Trigger</th>
                <th className="p-2">Payout</th>
                <th className="p-2">Note</th>
              </tr>
            </thead>
            <tbody>
              {payoutRows.map((r) => (
                <tr key={r.trigger} className="border-t border-slate-100">
                  <td className="p-2">{r.trigger}</td>
                  <td className="p-2 font-medium">{r.pct}</td>
                  <td className="p-2 text-slate-600">{r.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
