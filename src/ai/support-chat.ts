import { callClaude } from "./anthropic";
import { RAJAN, SEED_POLICY, SEED_PAYOUTS, SEED_RW } from "@/lib/seed-data";
import { P_BASE } from "@/lib/premium-engine";
import { SEED_ALPHA } from "@/lib/seed-data";

const SYSTEM = `You are ShieldRide's assistant for Q-commerce delivery partners in India (Zepto, Blinkit). Explain insurance simply. Weekly premiums are always in the ₹20–₹50 band (clamped). When asked about premiums or payouts, show the math (P_w = P_base × (1 + α × R_w), payouts as % of daily baseline). Do not discuss insurer capital adequacy (CAR) or pool solvency — that is internal. Friendly, simple English that works for Hindi-speaking users. Never use heavy jargon. Short paragraphs.`;

export async function supportChatReply(userMessage: string) {
  const lastPayouts = SEED_PAYOUTS.slice(0, 3)
    .map((p) => `${p.trigger}: ₹${p.amount}, F_w=${p.fw}`)
    .join("; ");
  const context = `Worker context: ${RAJAN.name}, ${RAJAN.city}, ${RAJAN.platform}. Policy ${SEED_POLICY.policyNumber}, weekly premium ~₹${SEED_POLICY.weeklyPremium}. Current R_w ≈ ${SEED_RW}. Last payouts: ${lastPayouts}. P_base=${P_BASE}, α≈${SEED_ALPHA}.`;

  const r = await callClaude(SYSTEM, `${context}\n\nUser: ${userMessage}`);
  if (r.text) return { reply: r.text, mock: false };
  return {
    reply: "ShieldRide protects your income when rain, heat, bad air, app outages, or order cancellations hit your earnings. Ask me about your premium formula or a payout.",
    mock: true,
  };
}
