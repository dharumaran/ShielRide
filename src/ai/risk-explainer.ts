import { callClaude } from "./anthropic";
import { formatINR } from "@/lib/utils";
import { P_BASE } from "@/lib/premium-engine";
import type { WeightedBreakdown } from "@/lib/premium-engine";

export async function explainRiskQuote(input: {
  rw: number;
  pw: number;
  breakdown: WeightedBreakdown[];
  city: string;
  personaName: string;
  platform: string;
  forecastNote?: string;
  tenureWeeks?: number;
}) {
  const system = `You are ShieldRide's actuarial explainer. Output 3-4 short sentences in plain English for Indian gig workers. Always include the actual premium formula with numbers: P_w = ₹${P_BASE} × (1 + α × R_w), and note weekly premium is clamped between ₹20 and ₹50. Be specific about weather/risk drivers. No jargon.`;

  const lines = input.breakdown
    .filter((b) => b.key !== "social" || b.contribution > 0)
    .map(
      (b) =>
        `${b.label}: score ${b.score.toFixed(2)} × weight ${b.weight} = ${b.contribution.toFixed(3)}`
    )
    .join("\n");

  const user = `Worker: ${input.personaName}, ${input.city}, ${input.platform}.
R_w = ${input.rw.toFixed(3)}
Weekly premium P_w = ${formatINR(input.pw)} (after floor/cap if any).
Component breakdown:
${lines}
Tenure: ${input.tenureWeeks ?? "N/A"} weeks.
Forecast/context: ${input.forecastNote ?? "Monsoon week approaching"}.

Explain why the premium is what it is. Include inline formula with numbers like: P_w = ₹${P_BASE} × (1 + 0.7 × ${input.rw.toFixed(3)}) ≈ ${formatINR(input.pw)}.`;

  const r = await callClaude(system, user);
  if (r.text) return { explanation: r.text, mock: false };
  return {
    explanation: `Your premium this week is ${formatINR(input.pw)}. ${input.city} shows elevated rainfall and heat stress this week. With R_w = ${input.rw.toFixed(3)}, the formula gives P_w = ₹${P_BASE} × (1 + 0.7 × ${input.rw.toFixed(3)}) = ₹${(P_BASE * (1 + 0.7 * input.rw)).toFixed(2)} ≈ ${formatINR(input.pw)} (clamped ₹20–₹50). Rainfall risk adds material weight (0.25 × score) to your weekly price.`,
    mock: true,
  };
}
