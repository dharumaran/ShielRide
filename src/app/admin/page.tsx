"use client";

import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CARGauge } from "@/components/CARGauge";
import { Progress } from "@/components/ui/progress";
import { PREMIUM_FLOOR, PREMIUM_CAP } from "@/lib/premium-engine";

type AdminData = {
  portfolio: {
    workerCount: number;
    totalPremiumCollected: number;
    expectedLoss: number;
    aucRoc: number;
    rmse: number;
    fraudPrecision: number;
    fraudRecall: number;
  };
  car: {
    car: number;
    status: string;
    message: string;
    pool: number;
    expectedLoss: number;
    display: number;
  };
  fraudQueue: {
    id: string;
    claimNumber: string;
    fw: number;
    B: number;
    G: number;
    L: number;
    trigger: string;
  }[];
  alpha: number;
  alphaHistory: { week: string; alpha: number }[];
  metrics: Record<string, number>;
};

type WorkerRow = {
  id: string;
  phone: string;
  name: string | null;
  city: string | null;
  platform: string | null;
};

type WorkerDetail = {
  worker: {
    id?: string;
    name: string;
    phone?: string;
    city: string;
    platform: string;
  };
  policy: {
    policyNumber: string;
    weeklyPremium: number;
    rw: number;
    alpha: number;
    policycenterId: string;
  };
  riskBreakdown: {
    key: string;
    label: string;
    weight: number;
    score: number;
    contribution: number;
  }[];
  claims: Record<string, unknown>[];
  analytics: {
    totalPayout: number;
    estimatedPremiumsPaid: number;
    weeksAssumed: number;
    lossRatio: number;
    claimCount: number;
    avgFw: number;
  };
  source: string;
};

function adminHeaders(password: string): HeadersInit {
  return { "x-admin-password": password };
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [data, setData] = useState<AdminData | null>(null);
  const [workers, setWorkers] = useState<WorkerRow[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [workerDetail, setWorkerDetail] = useState<WorkerDetail | null>(null);
  const [loadingWorker, setLoadingWorker] = useState(false);
  const [error, setError] = useState("");
  const [alphaMsg, setAlphaMsg] = useState("");

  const load = useCallback(async () => {
    setError("");
    const r = await fetch("/api/admin", {
      headers: adminHeaders(password),
    });
    if (!r.ok) {
      setError("Unauthorized — check ADMIN_PASSWORD in .env.local");
      setData(null);
      return;
    }
    setData(await r.json());

    const wr = await fetch("/api/admin/workers", {
      headers: adminHeaders(password),
    });
    if (wr.ok) {
      const j = await wr.json();
      const list: WorkerRow[] = j.workers ?? [];
      setWorkers(list);
      const first = list[0]?.id;
      if (first) {
        setSelectedId(first);
        setLoadingWorker(true);
        const dr = await fetch(
          `/api/admin/worker?workerId=${encodeURIComponent(first)}`,
          { headers: adminHeaders(password) }
        );
        if (dr.ok) {
          setWorkerDetail(await dr.json());
        } else {
          setWorkerDetail(null);
        }
        setLoadingWorker(false);
      }
    }
  }, [password]);

  async function loadWorkerDetail(id: string) {
    if (!id || !password) return;
    setLoadingWorker(true);
    setWorkerDetail(null);
    const r = await fetch(
      `/api/admin/worker?workerId=${encodeURIComponent(id)}`,
      { headers: adminHeaders(password) }
    );
    if (r.ok) {
      setWorkerDetail(await r.json());
    }
    setLoadingWorker(false);
  }

  async function recalibrate() {
    const r = await fetch("/api/admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...adminHeaders(password),
      },
      body: JSON.stringify({ action: "recalibrate_alpha" }),
    });
    const j = await r.json();
    setAlphaMsg(`Before α=${j.before} → After α=${j.after}. ${j.formula}`);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Insurer console</h1>
      <p className="text-sm text-slate-600">
        Capital adequacy (CAR) and pool metrics are visible here only — not shown
        to riders. Premium band for workers: ₹{PREMIUM_FLOOR}–₹{PREMIUM_CAP}/week.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Access</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="max-w-xs"
          />
          <Button onClick={load}>Load portfolio &amp; worker list</Button>
        </CardContent>
        {error && <p className="px-6 pb-4 text-sm text-red-600">{error}</p>}
      </Card>

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-600">Workers</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                {data.portfolio.workerCount}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-600">Premiums</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                ₹{(data.portfolio.totalPremiumCollected / 100000).toFixed(2)}L
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-600">Expected loss</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">
                ₹{(data.portfolio.expectedLoss / 1000).toFixed(0)}k
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-600">α (self-cal)</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold">{data.alpha}</CardContent>
            </Card>
          </div>

          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle>Portfolio CAR (internal only)</CardTitle>
              <Badge
                variant={
                  data.car.status === "stable"
                    ? "success"
                    : data.car.status === "monitor"
                      ? "warning"
                      : "danger"
                }
              >
                {data.car.message}
              </Badge>
            </CardHeader>
            <CardContent>
              <CARGauge pool={data.car.pool} expectedLoss={data.car.expectedLoss} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analyze a rider</CardTitle>
              <p className="text-sm text-slate-600">
                Select a user to see policy, risk breakdown, claims, and loss
                ratio vs estimated premiums paid.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-end gap-2">
                <label className="flex flex-col gap-1 text-sm">
                  <span className="text-slate-600">Worker</span>
                  <select
                    className="min-w-[240px] rounded-md border border-slate-200 bg-white px-3 py-2 text-sm"
                    value={selectedId}
                    onChange={(e) => {
                      setSelectedId(e.target.value);
                      void loadWorkerDetail(e.target.value);
                    }}
                  >
                    {workers.map((w) => (
                      <option key={w.id} value={w.id}>
                        {(w.name ?? "Unnamed") + " · " + w.phone}
                      </option>
                    ))}
                  </select>
                </label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => loadWorkerDetail(selectedId)}
                  disabled={!selectedId || loadingWorker}
                >
                  {loadingWorker ? "Loading…" : "Refresh"}
                </Button>
              </div>

              {workerDetail && (
                <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50/80 p-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">{workerDetail.source}</Badge>
                    <span className="text-sm font-medium text-slate-800">
                      {workerDetail.worker.name} · {workerDetail.worker.city} ·{" "}
                      {workerDetail.worker.platform}
                    </span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
                    <div>
                      <p className="text-slate-500">Weekly premium</p>
                      <p className="text-lg font-semibold">
                        ₹{workerDetail.policy.weeklyPremium}
                      </p>
                      <p className="text-xs text-slate-500">
                        Target band ₹{PREMIUM_FLOOR}–₹{PREMIUM_CAP}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">R_w / α</p>
                      <p className="font-mono">
                        {workerDetail.policy.rw.toFixed(3)} /{" "}
                        {workerDetail.policy.alpha}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Total payouts</p>
                      <p className="text-lg font-semibold text-emerald-700">
                        ₹
                        {workerDetail.analytics.totalPayout.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Est. premiums ({workerDetail.analytics.weeksAssumed} wks)</p>
                      <p className="font-semibold">
                        ₹
                        {workerDetail.analytics.estimatedPremiumsPaid.toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3 text-sm">
                    <p>
                      <span className="text-slate-500">Loss ratio (payout / prem): </span>
                      <span className="font-mono font-semibold">
                        {(workerDetail.analytics.lossRatio * 100).toFixed(1)}%
                      </span>
                    </p>
                    <p>
                      <span className="text-slate-500">Claims: </span>
                      {workerDetail.analytics.claimCount}
                    </p>
                    <p>
                      <span className="text-slate-500">Avg F_w: </span>
                      <span className="font-mono">
                        {workerDetail.analytics.avgFw.toFixed(3)}
                      </span>
                    </p>
                  </div>
                  <p className="text-xs text-slate-500">
                    Policy {workerDetail.policy.policyNumber} · PC{" "}
                    {workerDetail.policy.policycenterId}
                  </p>
                  <div>
                    <p className="mb-2 text-xs font-semibold text-slate-600">
                      R_w components
                    </p>
                    <div className="space-y-1">
                      {workerDetail.riskBreakdown.map((b) => (
                        <div
                          key={b.key}
                          className="flex justify-between text-xs text-slate-700"
                        >
                          <span>{b.label}</span>
                          <span className="font-mono">{b.contribution.toFixed(3)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {workerDetail.claims.length > 0 && (
                    <div className="max-h-40 overflow-auto text-xs">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-slate-500">
                            <th className="p-1">Trigger</th>
                            <th className="p-1">₹</th>
                            <th className="p-1">F_w</th>
                          </tr>
                        </thead>
                        <tbody>
                          {workerDetail.claims.slice(0, 12).map((c, i) => (
                            <tr key={i} className="border-t border-slate-200">
                              <td className="p-1">
                                {String(c.trigger_type ?? c.trigger ?? "—")}
                              </td>
                              <td className="p-1">
                                ₹{Number(c.payout_amount ?? c.amount ?? 0)}
                              </td>
                              <td className="p-1 font-mono">
                                {Number(c.fw_score ?? c.fw ?? 0).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
              <CardTitle>α recalibration (Sunday job)</CardTitle>
              <Button size="sm" variant="outline" onClick={recalibrate}>
                Run Sunday recalibration
              </Button>
            </CardHeader>
            <CardContent>
              {alphaMsg && (
                <p className="rounded-md bg-slate-50 p-3 font-mono text-xs">{alphaMsg}</p>
              )}
              <p className="mt-2 text-xs text-slate-500">
                α_new = Observed loss / (P_base × ΣR_w × N)
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fraud review queue (F_w &gt; 0.50)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.fraudQueue.map((q) => (
                <div
                  key={q.id}
                  className="rounded-lg border border-slate-200 p-4 text-sm"
                >
                  <p className="font-mono text-xs">{q.claimNumber}</p>
                  <p>
                    F_w={q.fw} · {q.trigger}
                  </p>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    <span>B {q.B}</span>
                    <span>G {q.G}</span>
                    <span>L {q.L}</span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Button size="sm" variant="default">
                      Approve
                    </Button>
                    <Button size="sm" variant="outline">
                      Flag
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Model performance</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-slate-600">AUC-ROC (target 0.87)</p>
                <p className="text-lg font-bold text-emerald-600">
                  {data.portfolio.aucRoc} ✓
                </p>
                <Progress value={data.portfolio.aucRoc * 100} className="mt-2 h-2" />
              </div>
              <div>
                <p className="text-xs text-slate-600">RMSE (target &lt; 0.08)</p>
                <p className="text-lg font-bold text-emerald-600">
                  {data.portfolio.rmse} ✓
                </p>
                <Progress
                  value={(1 - data.portfolio.rmse) * 100}
                  className="mt-2 h-2"
                />
              </div>
              <div>
                <p className="text-xs text-slate-600">Fraud precision (P&gt;0.90)</p>
                <p className="text-lg font-bold">{data.portfolio.fraudPrecision}</p>
              </div>
              <div>
                <p className="text-xs text-slate-600">Fraud recall (R&gt;0.80)</p>
                <p className="text-lg font-bold">{data.portfolio.fraudRecall}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance targets</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
              <p>API p99: {data.metrics.apiP99Ms}ms / target &lt;80ms</p>
              <p>Trigger lag: {data.metrics.triggerLagMin} min / &lt;15 min</p>
              <p>Payout credit: {data.metrics.payoutCreditMin} min</p>
              <p>Onboarding: {data.metrics.onboardingSec}s / &lt;90s</p>
              <p>ML inference: {data.metrics.mlInferenceMs}ms</p>
              <p>Uptime: {data.metrics.uptime}%</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
