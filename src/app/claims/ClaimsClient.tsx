"use client";

import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PayoutTimeline } from "@/components/PayoutTimeline";
import { FraudScoreCard } from "@/components/FraudScoreCard";
import { GuidewireSync } from "@/components/GuidewireSync";
import { AUTH_STORAGE_KEY } from "@/lib/client-storage";
import { demoCleanFraudSignals } from "@/lib/fraud-signals";
import type { FraudSignalDetail } from "@/lib/fraud-signals";

type Claim = {
  claimNumber: string;
  trigger: string;
  amount: number;
  fw: number;
  processedSec: number;
  B: number;
  G: number;
  L: number;
  at: number;
  fraudSignals?: { flags?: FraudSignalDetail[] };
};

function authHeaders(): HeadersInit {
  if (typeof window === "undefined") return {};
  const t = window.localStorage.getItem(AUTH_STORAGE_KEY);
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export function ClaimsClient() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [extraClaims, setExtraClaims] = useState<Claim[]>([]);
  const [running, setRunning] = useState(false);
  const [notify, setNotify] = useState("");
  const [selected, setSelected] = useState<Claim | null>(null);
  const [fraudExplain, setFraudExplain] = useState<string | null>(null);
  const [fraudLoading, setFraudLoading] = useState(false);

  const refresh = useCallback(() => {
    fetch("/api/claims", { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => setClaims(d.claims ?? []));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const mergedClaims = [...extraClaims, ...claims].filter(
    (c, i, arr) => arr.findIndex((x) => x.claimNumber === c.claimNumber) === i
  );

  const onTimelineDone = useCallback(async () => {
    const res = await fetch("/api/claims/simulate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({ trigger: "RAINFALL" }),
    });
    const j = await res.json();
    if (j.claim) {
      setExtraClaims((prev) => [j.claim as Claim, ...prev]);
    }
    refresh();
    setNotify(j.message ?? "₹520 credited. Stay safe, Rajan 🛡️");
  }, [refresh]);

  function simulate() {
    setNotify("");
    setRunning(true);
  }

  async function explainFraud(c: Claim) {
    setFraudLoading(true);
    setSelected(c);
    const r = await fetch("/api/ai/fraud-explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        B: c.B,
        G: c.G,
        L: c.L,
        fw: c.fw,
        bFlags: ["Order velocity vs 30d baseline", "Income drop vs external triggers"],
        gFlags: ["GPS vs weather cell", "IP/ASN vs city", "No VPN/datacenter flag"],
        lFlags: ["Device fingerprint stable", "UPI VPA unique", "No geo-cluster sync"],
      }),
    });
    const j = await r.json();
    setFraudExplain(`${j.formula ?? ""}\n\n${j.explanation ?? ""}`);
    setFraudLoading(false);
  }

  return (
    <div className="space-y-6">
      <Card className="border-emerald-200 bg-emerald-50/50">
        <CardHeader>
          <CardTitle className="text-base text-emerald-900">
            Soft-fail guarantee
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-emerald-950">
          Claims are <strong>held</strong>, never silently rejected. Every F_w
          &gt; 0.80 routes to manual review within 2 hours — built for genuine
          workers when GPS/weather degrades.
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pipeline</CardTitle>
          <p className="text-xs text-slate-500">
            Trigger Detected → Eligibility → Fraud Score → UPI Credit
          </p>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal space-y-1 pl-4 text-sm text-slate-700">
            <li>T+0s threshold crossed</li>
            <li>T+10s F_w computed (multi-signal)</li>
            <li>T+45s Razorpay UPI</li>
            <li>T+185s FCM + WhatsApp mock</li>
          </ol>
          <Button className="mt-4" onClick={simulate} disabled={running}>
            Simulate trigger (rainfall &gt; 35 mm/hr)
          </Button>
          <div className="mt-6">
            <PayoutTimeline
              running={running}
              onDone={() => {
                setRunning(false);
                void onTimelineDone();
              }}
              notifyText={notify}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Claim history</CardTitle>
          <GuidewireSync />
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="text-slate-600">
                <th className="p-2">Claim</th>
                <th className="p-2">Trigger</th>
                <th className="p-2">₹</th>
                <th className="p-2">F_w</th>
                <th className="p-2">Time</th>
              </tr>
            </thead>
            <tbody>
              {mergedClaims.map((c) => (
                <tr
                  key={c.claimNumber}
                  className="cursor-pointer border-t border-slate-100 hover:bg-slate-50"
                  onClick={() => {
                    setSelected(c);
                    setFraudExplain(null);
                  }}
                >
                  <td className="p-2 font-mono text-xs">{c.claimNumber}</td>
                  <td className="p-2">{c.trigger}</td>
                  <td className="p-2 font-medium text-emerald-600">₹{c.amount}</td>
                  <td className="p-2">
                    <Badge variant={c.fw < 0.3 ? "success" : "warning"}>
                      {c.fw}
                    </Badge>
                  </td>
                  <td className="p-2">
                    {Math.floor(c.processedSec / 60)}m{c.processedSec % 60}s
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {selected && (
        <FraudScoreCard
          B={selected.B}
          G={selected.G}
          L={selected.L}
          explanation={fraudExplain}
          loading={fraudLoading}
          signalDetails={
            selected.fraudSignals?.flags ?? demoCleanFraudSignals().flags
          }
          onExplain={() => explainFraud(selected)}
        />
      )}
    </div>
  );
}
