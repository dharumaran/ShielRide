"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle } from "lucide-react";

export const PAYOUT_STEPS = [
  { t: 0, label: "T+0s: Signal crosses threshold" },
  { t: 2, label: "T+2s: 2-source cross-validation" },
  { t: 4, label: "T+4s: Eligibility check" },
  { t: 10, label: "T+10s: Fraud score computed" },
  { t: 15, label: "T+15s: Payout amount + reserve check" },
  { t: 45, label: "T+45s: Razorpay UPI API call" },
  { t: 180, label: "T+180s: NPCI settlement confirmed" },
  { t: 185, label: "T+185s: FCM push + WhatsApp notification" },
];

export function PayoutTimeline({
  running,
  onDone,
  notifyText,
}: {
  running: boolean;
  onDone?: () => void;
  notifyText?: string;
}) {
  const [activeIdx, setActiveIdx] = useState(-1);

  useEffect(() => {
    if (!running) {
      setActiveIdx(-1);
      return;
    }
    setActiveIdx(0);
    const delays = [400, 400, 500, 800, 500, 1200, 1400, 400];
    let acc = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    delays.forEach((d, idx) => {
      acc += d;
      timers.push(
        setTimeout(() => {
          setActiveIdx(idx + 1);
          if (idx === delays.length - 1) onDone?.();
        }, acc)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [running, onDone]);

  return (
    <div className="space-y-3">
      {PAYOUT_STEPS.map((step, idx) => {
        const done = idx <= activeIdx;
        return (
          <div
            key={step.t}
            className={cn(
              "flex items-start gap-3 rounded-lg border p-3 text-sm",
              done
                ? "border-emerald-200 bg-emerald-50/80"
                : "border-slate-100 bg-white"
            )}
          >
            {done ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            ) : (
              <Circle className="mt-0.5 h-5 w-5 shrink-0 text-slate-300" />
            )}
            <span className={done ? "text-slate-900" : "text-slate-500"}>
              {step.label}
            </span>
          </div>
        );
      })}
      {notifyText && activeIdx >= PAYOUT_STEPS.length - 1 && (
        <p className="rounded-lg border border-emerald-300 bg-emerald-100 px-4 py-3 text-center font-medium text-emerald-900">
          {notifyText}
        </p>
      )}
    </div>
  );
}
