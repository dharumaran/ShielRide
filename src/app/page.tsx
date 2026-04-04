import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LIVE_STATS, RAJAN } from "@/lib/seed-data";
import { LandingTriggers } from "./ui/LandingTriggers";
import { LandingHeroChart } from "./ui/LandingHeroChart";

export default function LandingPage() {
  return (
    <div className="space-y-16">
      <section className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <Badge variant="secondary" className="mb-3">
            Guidewire DEVTrails 2026 · Q-Commerce persona
          </Badge>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
            Your income. Protected. Automatically.
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            When the storm hits, your income shouldn&apos;t stop. Weekly
            parametric cover for Zepto &amp; Blinkit riders — rainfall, heat,
            air quality, platform outages, and{" "}
            <span className="font-semibold text-blue-700">
              demand-volatility
            </span>{" "}
            (industry first).
          </p>
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
            7.7M gig workers in India — most have{" "}
            <span className="font-semibold">0%</span> income protection.
            ShieldRide fixes that with transparent math, not black-box AI
            pricing.
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/onboarding">Protect my income — ₹20–50/week</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/dashboard">View demo dashboard</Link>
            </Button>
          </div>
        </div>
        <LandingHeroChart />
      </section>
      <p className="-mt-8 text-center text-xs text-slate-500 md:text-left">
        {RAJAN.name}, 26 · {RAJAN.city} · {RAJAN.platform} · Wednesday rain dip +
        ₹520 recovery bar
      </p>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Workers covered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900">
              {LIVE_STATS.workersCovered.toLocaleString("en-IN")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Paid out this week
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-emerald-600">
              ₹{(LIVE_STATS.paidOutWeek / 100000).toFixed(2)}L
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              Avg payout time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-slate-900">
              {LIVE_STATS.avgPayoutMinutes} min
            </p>
          </CardContent>
        </Card>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">
          Five parametric triggers — live status
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Demand-Volatility Protection — unique to ShieldRide. No generic
          parametric product covers demand-side income collapse.
        </p>
        <div className="mt-6">
          <LandingTriggers />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-slate-900">Why ShieldRide</h2>
        <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-700">
              <tr>
                <th className="p-3 font-semibold">Capability</th>
                <th className="p-3 font-semibold">ShieldRide</th>
                <th className="p-3 font-semibold">Traditional</th>
                <th className="p-3 font-semibold">Generic parametric</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              <tr>
                <td className="p-3">Demand-side volatility trigger</td>
                <td className="p-3 text-emerald-700 font-medium">Yes (moat)</td>
                <td className="p-3 text-slate-500">Rare</td>
                <td className="p-3 text-slate-500">No</td>
              </tr>
              <tr>
                <td className="p-3">Show actuarial formulas in-app</td>
                <td className="p-3 text-emerald-700 font-medium">Always</td>
                <td className="p-3 text-slate-500">Opaque</td>
                <td className="p-3 text-slate-500">Partial</td>
              </tr>
              <tr>
                <td className="p-3">Soft-fail claims (held, not silent deny)</td>
                <td className="p-3 text-emerald-700 font-medium">Yes</td>
                <td className="p-3 text-slate-500">Varies</td>
                <td className="p-3 text-slate-500">Varies</td>
              </tr>
              <tr>
                <td className="p-3">Weekly premium aligned to gig pay</td>
                <td className="p-3 text-emerald-700 font-medium">₹20–50</td>
                <td className="p-3 text-slate-500">Annual / high friction</td>
                <td className="p-3 text-slate-500">Static pricing</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 text-center">
        <p className="text-sm text-slate-600">
          NITI Aayog: ~7.7M platform workers today, projected 23.5M by 2030.
          Built for India&apos;s Q-commerce backbone.
        </p>
        <Button asChild className="mt-4">
          <Link href="/onboarding">Start onboarding</Link>
        </Button>
      </section>
    </div>
  );
}
