"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PremiumFormula } from "@/components/PremiumFormula";
import { RiskRadar } from "@/components/RiskRadar";
import { GuidewireSync } from "@/components/GuidewireSync";
import { Badge } from "@/components/ui/badge";
import { SEED_RISK_COMPONENTS, SEED_ALPHA } from "@/lib/seed-data";
import { breakdownRw, premiumFromComponents } from "@/lib/premium-engine";
import { AUTH_STORAGE_KEY } from "@/lib/client-storage";
import Link from "next/link";

export function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("Rajan Kumar");
  const [platform, setPlatform] = useState<"Zepto" | "Blinkit">("Zepto");
  const [city, setCity] = useState("Chennai");
  const [vehicle, setVehicle] = useState("Electric scooter");
  const [explain, setExplain] = useState("");
  const [explainMock, setExplainMock] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);
  const [policyNum, setPolicyNum] = useState("");
  const [gwPc, setGwPc] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [authError, setAuthError] = useState("");
  const [sendInfo, setSendInfo] = useState("");

  const prem = premiumFromComponents(SEED_RISK_COMPONENTS, SEED_ALPHA);
  const breakdown = breakdownRw(SEED_RISK_COMPONENTS);

  async function sendOtpRequest() {
    setAuthError("");
    setSendInfo("");
    const p = phone.trim();
    if (!p) {
      setAuthError("Enter your mobile number first.");
      return;
    }
    setSendingOtp(true);
    try {
      const r = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: p }),
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        setAuthError(
          typeof j.error === "string" ? j.error : "Could not send OTP"
        );
        return;
      }
      setOtpSent(true);
      setSendInfo(
        typeof j.message === "string"
          ? j.message
          : "OTP sent. Enter the code below."
      );
    } finally {
      setSendingOtp(false);
    }
  }

  async function submitOtp() {
    setAuthError("");
    const p = phone.trim();
    if (!p) {
      setAuthError("Enter your mobile number.");
      return;
    }
    const o = otp.trim() || "123456";
    const r = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: p, otp: o }),
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok) {
      setAuthError(
        typeof j.error === "string" ? j.error : "Sign-in failed. Check OTP."
      );
      return;
    }
    if (j.token) {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(AUTH_STORAGE_KEY, j.token);
      }
      setStep(2);
    } else {
      setAuthError("No token returned. Try again.");
    }
  }

  async function loadExplain() {
    setStep(3);
    setLoadingAi(true);
    const r = await fetch("/api/ai/risk-explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        components: SEED_RISK_COMPONENTS,
        alpha: SEED_ALPHA,
        city,
        platform,
      }),
    });
    const j = await r.json();
    setExplain(j.explanation ?? "");
    setExplainMock(!!j.mock);
    setLoadingAi(false);
  }

  async function activatePolicy() {
    const token =
      typeof window !== "undefined"
        ? window.localStorage.getItem(AUTH_STORAGE_KEY)
        : null;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) headers.Authorization = `Bearer ${token}`;

    const r = await fetch("/api/policy/activate", {
      method: "POST",
      headers,
      body: JSON.stringify({
        name,
        city,
        platform,
        vehicle_type: vehicle,
        weekly_premium: prem.pw,
        rw: prem.rw,
        alpha: SEED_ALPHA,
        daily_baseline_income: 650,
      }),
    });
    const j = await r.json();
    if (!r.ok) {
      setPolicyNum("Error — check Supabase / auth");
      setGwPc("");
      setStep(4);
      return;
    }
    setPolicyNum(j.policy_number ?? "");
    setGwPc(j.policycenter_id ?? "");
    setStep(4);
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 text-xs text-slate-500 dark:text-slate-400">
        {[1, 2, 3, 4].map((s) => (
          <span
            key={s}
            className={
              step >= s ? "font-semibold text-blue-600 dark:text-blue-400" : ""
            }
          >
            Step {s}
          </span>
        ))}
      </div>

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Phone OTP (MSG91)</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Tap <strong>Send OTP</strong>, then enter the code. Without MSG91,
              mock verify accepts <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">123456</code>{" "}
              or use <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">OTP_DEV_BYPASS</code> in{" "}
              <code className="rounded bg-slate-100 px-1 dark:bg-slate-800">.env.local</code>.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                void submitOtp();
              }}
            >
              <div>
                <Label htmlFor="onboard-phone">Mobile</Label>
                <Input
                  id="onboard-phone"
                  name="phone"
                  autoComplete="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setOtpSent(false);
                    setSendInfo("");
                  }}
                  placeholder="+919876543210"
                />
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  disabled={sendingOtp}
                  onClick={() => void sendOtpRequest()}
                >
                  {sendingOtp ? "Sending…" : "Send OTP"}
                </Button>
                {otpSent && (
                  <Badge variant="secondary" className="w-fit">
                    Ready to verify
                  </Badge>
                )}
              </div>
              <div>
                <Label htmlFor="onboard-otp">OTP</Label>
                <Input
                  id="onboard-otp"
                  name="otp"
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456 (dev default if empty)"
                />
              </div>
              {sendInfo && (
                <p className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-100">
                  {sendInfo}
                </p>
              )}
              {authError && (
                <p
                  className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/50 dark:text-red-100"
                  role="alert"
                >
                  {authError}
                </p>
              )}
              <Button type="submit" className="w-full sm:w-auto">
                Verify &amp; continue
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Worker profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Full name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Platform</Label>
              <select
                className="mt-1 flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                value={platform}
                onChange={(e) =>
                  setPlatform(e.target.value as "Zepto" | "Blinkit")
                }
              >
                <option>Zepto</option>
                <option>Blinkit</option>
              </select>
            </div>
            <div>
              <Label>City</Label>
              <Input value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div>
              <Label>Vehicle</Label>
              <select
                className="mt-1 flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
                value={vehicle}
                onChange={(e) => setVehicle(e.target.value)}
              >
                <option>Electric scooter</option>
                <option>Petrol</option>
                <option>Cycle</option>
              </select>
            </div>
            <div className="rounded-md border border-dashed border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              Aadhaar eKYC (DigiLocker mock): consent recorded · last 4 Aadhaar
              verified ✓
            </div>
            <Button onClick={loadExplain} disabled={loadingAi}>
              {loadingAi ? "Computing…" : "Continue to AI risk quote"}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>AI risk quote</CardTitle>
            <p className="text-sm text-slate-600">
              TypeScript engines compute numbers; Claude narrates when{" "}
              <code className="text-xs">ANTHROPIC_API_KEY</code> is set.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {loadingAi && (
              <p className="text-sm text-blue-600">Fetching Claude explanation…</p>
            )}
            <PremiumFormula rw={prem.rw} alpha={SEED_ALPHA} pw={prem.pw} />
            <div>
              <p className="text-xs font-semibold text-slate-600">R_w weights</p>
              <div className="mt-2 space-y-2">
                {breakdown.map((b) => (
                  <div
                    key={b.key}
                    className={b.key === "social" ? "opacity-50" : ""}
                  >
                    <div className="flex justify-between text-xs">
                      <span>
                        {b.label}
                        {b.key === "social" && (
                          <Badge variant="muted" className="ml-2">
                            Phase 2
                          </Badge>
                        )}
                      </span>
                      <span>
                        {b.score.toFixed(2)} × {b.weight} ={" "}
                        {b.contribution.toFixed(3)}
                      </span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-blue-600"
                        style={{ width: `${b.score * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <RiskRadar breakdown={breakdown} />
            {explain && (
              <div className="rounded-lg border border-blue-100 bg-blue-50/80 p-3 text-sm text-slate-800">
                {explainMock && (
                  <Badge variant="secondary" className="mb-2">
                    Offline explanation (set ANTHROPIC_API_KEY for live Claude)
                  </Badge>
                )}
                <p>{explain}</p>
              </div>
            )}
            <Button onClick={activatePolicy}>
              Pay with UPI (sandbox) &amp; activate policy
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Policy active</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="flex flex-wrap items-center gap-2 text-slate-800">
              <GuidewireSync />
              <span className="font-mono text-lg">{policyNum}</span>
            </p>
            <p className="text-xs text-slate-600">
              PolicyCenter ID: <span className="font-mono">{gwPc}</span>
            </p>
            <p className="text-sm text-slate-600">
              Policy row synced to Supabase (when configured). Razorpay UPI path
              runs in sandbox.
            </p>
            <Button asChild>
              <Link href="/dashboard">Open dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
