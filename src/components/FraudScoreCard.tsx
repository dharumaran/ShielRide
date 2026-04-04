"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FRAUD_W_B, FRAUD_W_G, FRAUD_W_L, computeFw } from "@/lib/fraud-engine";
import type { FraudSignalDetail } from "@/lib/fraud-signals";

export function FraudScoreCard({
  B,
  G,
  L,
  onExplain,
  explanation,
  loading,
  signalDetails,
}: {
  B: number;
  G: number;
  L: number;
  onExplain?: () => void;
  explanation?: string | null;
  loading?: boolean;
  signalDetails?: FraudSignalDetail[];
}) {
  const fw = computeFw({ B, G, L });
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Fraud score — F<sub>w</sub> = 0.40×B + 0.35×G + 0.25×L ={" "}
          {fw.toFixed(2)}
        </CardTitle>
        <p className="text-xs text-slate-600">
          Beyond GPS: IP/ASN, device attestation, UPI linkage, order velocity,
          weather-cell consistency, SIM tenure.
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {[
          { label: "B — Behavioral", v: B, w: FRAUD_W_B, color: "bg-violet-500" },
          { label: "G — Geo + network", v: G, w: FRAUD_W_G, color: "bg-cyan-600" },
          { label: "L — Linkage / identity", v: L, w: FRAUD_W_L, color: "bg-orange-500" },
        ].map((row) => (
          <div key={row.label}>
            <div className="mb-1 flex justify-between text-xs text-slate-600">
              <span>{row.label}</span>
              <span>
                {row.v.toFixed(2)} (weight {row.w})
              </span>
            </div>
            <Progress
              value={row.v * 100}
              indicatorClassName={row.color}
              className="h-2"
            />
          </div>
        ))}

        {signalDetails && signalDetails.length > 0 && (
          <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
            <p className="mb-2 text-xs font-semibold text-slate-700">
              Active anti-spoof signals
            </p>
            <ul className="space-y-1.5">
              {signalDetails.slice(0, 8).map((s) => (
                <li
                  key={s.id}
                  className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-700"
                >
                  <span>{s.label}</span>
                  <Badge variant="outline" className="font-mono">
                    {s.bucket} · {(s.severity * 100).toFixed(0)}%
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        )}

        {onExplain && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setOpen(true);
              onExplain();
            }}
            disabled={loading}
          >
            {loading ? "Claude…" : "Explain with Claude"}
          </Button>
        )}
        {(open || explanation) && explanation && (
          <p className="rounded-md border border-slate-100 bg-slate-50 p-3 text-sm text-slate-800">
            {explanation}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
