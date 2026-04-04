import { DashboardClient } from "./DashboardClient";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Command center</h1>
        <p className="text-sm text-slate-600">
          Policy, risk, triggers, income — Rajan Kumar demo
        </p>
      </div>
      <DashboardClient />
    </div>
  );
}
