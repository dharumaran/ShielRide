import { ClaimsClient } from "./ClaimsClient";

export default function ClaimsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Claims</h1>
        <p className="text-sm text-slate-600">
          Zero-touch pipeline · soft-fail guarantee
        </p>
      </div>
      <ClaimsClient />
    </div>
  );
}
