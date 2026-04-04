import { DisruptionsClient } from "./DisruptionsClient";

export default function DisruptionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Live disruptions</h1>
        <p className="text-sm text-slate-600">
          Chennai primary · other metros Phase 2
        </p>
      </div>
      <DisruptionsClient />
    </div>
  );
}
