import { callClaude } from "./anthropic";
import { FRAUD_W_B, FRAUD_W_G, FRAUD_W_L, fraudDecision } from "@/lib/fraud-engine";

export async function explainFraudDecision(input: {
  B: number;
  G: number;
  L: number;
  fw: number;
  bFlags: string[];
  gFlags: string[];
  lFlags: string[];
  decisionLabel: string;
}) {
  const system = `You explain ShieldRide fraud decisions simply. Always show: F_w = 0.40×B + 0.35×G + 0.25×L = final. 2-4 sentences. Plain English for Hindi-speaking users.`;

  const user = `B=${input.B}, G=${input.G}, L=${input.L}, F_w=${input.fw.toFixed(2)}.
B flags: ${input.bFlags.join("; ") || "none"}
G flags: ${input.gFlags.join("; ") || "none"}
L flags: ${input.lFlags.join("; ") || "none"}
System decision: ${input.decisionLabel}
Narrate approval/delay/block in friendly tone.`;

  const r = await callClaude(system, user);
  const formula = `F_w = ${FRAUD_W_B}×${input.B.toFixed(2)} + ${FRAUD_W_G}×${input.G.toFixed(2)} + ${FRAUD_W_L}×${input.L.toFixed(2)} = ${input.fw.toFixed(2)}`;
  if (r.text) return { explanation: r.text, formula, mock: false };
  const d = fraudDecision(input.fw);
  return {
    explanation: `Your claim was ${input.fw < 0.3 ? "auto-approved" : d.label}. Behavioral score ${input.B.toFixed(2)}, Geo score ${input.G.toFixed(2)}, Linkage score ${input.L.toFixed(2)}. ${formula} — ${input.fw < 0.3 ? "well below 0.30 threshold." : "review rules applied."}`,
    formula,
    mock: true,
  };
}
