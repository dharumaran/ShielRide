import { OnboardingWizard } from "./OnboardingWizard";

export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Get covered</h1>
        <p className="text-sm text-slate-600">
          Phone OTP → Profile → AI risk quote → UPI activation
        </p>
      </div>
      <OnboardingWizard />
    </div>
  );
}
