"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { IncomeChart } from "@/components/IncomeChart";
import { GuidewireSync } from "@/components/GuidewireSync";
import { TriggerCard } from "@/components/TriggerCard";
import { AUTH_STORAGE_KEY } from "@/lib/client-storage";
import { PayoutTimeline } from "@/components/PayoutTimeline";
import { Zap } from "lucide-react";

type PayoutRow = {
  trigger: string;
  amount: number;
  fw: number;
  processedSec: number;
  claimNumber?: string;
};

type Dash = {
  worker: {
    id?: string;
    name: string;
    city: string;
    platform: string;
    dailyBaseline: number;
  };
  policy: {
    policyNumber: string;
    status: string;
    weeklyPremium: number;
    renewalDate: string;
    policycenterId: string;
  };
  risk: {
    rw: number;
    pw: number;
    breakdown: {
      key: string;
      label: string;
      weight: number;
      score: number;
      contribution: number;
    }[];
    alpha: number;
  };
  incomeWeek: number[];
  payoutOverlayWeek: number[];
  payouts: PayoutRow[];
  source?: "supabase" | "seed";
};

function authHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const t = window.localStorage.getItem(AUTH_STORAGE_KEY);
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export function DashboardClient() {
  const [data, setData] = useState<Dash | null>(null);
  const [triggers, setTriggers] = useState<
    {
      type: string;
      current: number;
      threshold: number;
      unit: string;
      pct: number;
      moat?: boolean;
      source?: string;
    }[]
  >([]);
  const [weatherSrc, setWeatherSrc] = useState<string>("");
  const [explain, setExplain] = useState("");
  const [loadingEx, setLoadingEx] = useState(false);
  const [simRunning, setSimRunning] = useState(false);
  const [simMsg, setSimMsg] = useState("");

  const load = useCallback(() => {
    fetch("/api/dashboard", { headers: authHeaders() })
      .then((r) => r.json())
      .then(setData);
    fetch("/api/triggers/auto-scan", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ city: "Chennai" }),
    })
      .then((r) => r.json())
      .then((d) => {
        setTriggers(d.triggers ?? []);
        setWeatherSrc(d.weather?.source ?? "");
      });
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const protectedTotal = useMemo(
    () => (data?.payouts ?? []).reduce((s, p) => s + p.amount, 0),
    [data]
  );

  const nearest = useMemo(() => {
    if (!triggers.length) return null;
    return [...triggers].sort((a, b) => b.pct - a.pct)[0];
  }, [triggers]);

  async function explainRisk() {
    setLoadingEx(true);
    const r = await fetch("/api/ai/risk-explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const j = await r.json();
    setExplain(j.explanation ?? "");
    setLoadingEx(false);
  }

  const onSimDone = useCallback(async () => {
    await fetch("/api/claims/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ trigger: "RAINFALL" }),
    });
    setSimRunning(false);
    setSimMsg("₹520 credited. Stay safe — ShieldRide 🛡️");
    load();
  }, [load]);

  function runInstantDemo() {
    setSimMsg("");
    setSimRunning(true);
  }

  if (!data) {
    return <p className="text-slate-500">Loading dashboard…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Story
          </p>
          <h2 className="text-lg font-semibold text-slate-900">
            Earnings protected · Live risk · Instant settlement path
          </h2>
        </div>
        <Badge variant={data.source === "supabase" ? "success" : "secondary"}>
          Data: {data.source === "supabase" ? "Supabase live" : "Local seed"}
        </Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-emerald-200 bg-emerald-50/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-emerald-900">
              Earnings protected (demo payouts)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-emerald-700">
              ₹{protectedTotal.toLocaleString("en-IN")}
            </p>
            <p className="mt-1 text-xs text-emerald-800">
              Sum of ShieldRide credits on your policy — rain, heat, demand
              volatility, and more.
            </p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-amber-900">
              Live disruption (Chennai)
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-amber-950">
            <p className="flex items-center gap-2 font-medium">
              <Zap className="h-4 w-4" />
              {nearest
                ? `${nearest.type.replace("_", " ")} at ${nearest.pct.toFixed(0)}% of trigger`
                : "Scanning…"}
            </p>
            <p className="mt-2 text-xs text-amber-900/90">
              Weather: {weatherSrc || "—"} · OpenWeatherMap when API key is set
            </p>
          </CardContent>
        </Card>
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">
              Instant payout simulation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-xs text-blue-900">
              Walks T+0→T+185s, then writes a claim (Supabase) + UPI sandbox.
            </p>
            <Button size="sm" className="w-full" onClick={runInstantDemo} disabled={simRunning}>
              {simRunning ? "Running…" : "Run instant payout demo"}
            </Button>
            {simMsg && (
              <p className="rounded-md border border-emerald-200 bg-white px-2 py-1.5 text-center text-xs font-medium text-emerald-800">
                {simMsg}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {simRunning && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pipeline (demo)</CardTitle>
          </CardHeader>
          <CardContent>
            <PayoutTimeline running={simRunning} onDone={onSimDone} />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2">
          <div>
            <CardTitle className="text-lg">Policy status</CardTitle>
            <p className="text-sm text-slate-600">
              {data.worker.name} · {data.worker.platform} · {data.worker.city}
            </p>
          </div>
          <GuidewireSync />
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            <span className="font-mono font-semibold">{data.policy.policyNumber}</span>{" "}
            · {data.policy.status}
          </p>
          <p>
            Renewal:{" "}
            {new Date(data.policy.renewalDate).toLocaleDateString("en-IN")}
          </p>
          <p className="text-xs text-slate-500">
            PolicyCenter: {data.policy.policycenterId}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="success">Active</Badge>
            <Badge variant="secondary">
              Weekly premium ₹{data.risk.pw} (₹20–₹50 band)
            </Badge>
          </div>
          <Button asChild variant="outline" size="sm" className="mt-2">
            <Link href="/claims">Open full claims pipeline</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
          <CardTitle>This week&apos;s risk score (R_w)</CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={explainRisk}
            disabled={loadingEx}
          >
            {loadingEx ? "…" : "What’s my risk today?"}
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-end gap-4">
            <span className="text-4xl font-bold text-slate-900">
              {data.risk.rw.toFixed(3)}
            </span>
            <span className="text-slate-600">
              Premium ₹{data.risk.pw}/wk · α={data.risk.alpha}
            </span>
          </div>
          <Progress value={data.risk.rw * 100} className="h-3" />
          {explain && (
            <p className="rounded-md border border-slate-100 bg-slate-50 p-3 text-sm">
              {explain}
            </p>
          )}
          <div className="space-y-2">
            {data.risk.breakdown.map((b) => (
              <div
                key={b.key}
                className={b.key === "social" ? "opacity-50" : ""}
              >
                <div className="flex justify-between text-xs text-slate-600">
                  <span>{b.label}</span>
                  <span>{b.contribution.toFixed(3)}</span>
                </div>
                <Progress value={b.score * 100} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">
          Live trigger monitor
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {triggers.map((t) => (
            <TriggerCard
              key={t.type}
              title={t.type.replace("_", " ")}
              subtitle={
                t.moat
                  ? "Demand-Volatility Protection — Unique to ShieldRide"
                  : t.source
                    ? `Source: ${t.source}`
                    : undefined
              }
              highlightMoat={t.moat}
              current={t.current}
              threshold={t.threshold}
              unit={t.unit}
              status={t.pct >= 100 ? "triggered" : t.pct >= 80 ? "near" : "ok"}
            />
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Income timeline</CardTitle>
          <p className="text-xs text-slate-500">
            Wednesday rain dip + green recovery — value proof
          </p>
        </CardHeader>
        <CardContent>
          <IncomeChart
            weekIncome={data.incomeWeek}
            payoutOverlay={data.payoutOverlayWeek}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Payout history</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-slate-600">
                <th className="p-2">Trigger</th>
                <th className="p-2">₹</th>
                <th className="p-2">F_w</th>
                <th className="p-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {data.payouts.map((p, idx) => (
                <tr
                  key={p.claimNumber ?? `${p.trigger}-${idx}`}
                  className="border-t border-slate-100"
                >
                  <td className="p-2">{p.trigger}</td>
                  <td className="p-2 font-medium text-emerald-600">₹{p.amount}</td>
                  <td className="p-2">
                    <Badge variant={p.fw < 0.3 ? "success" : "secondary"}>
                      {p.fw}
                    </Badge>
                  </td>
                  <td className="p-2">
                    {Math.floor(p.processedSec / 60)}m{p.processedSec % 60}s
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

    </div>
  );
}
