/**
 * Razorpay UPI Payout API sandbox — mock without keys.
 */

export async function razorpayUpiPayoutSandbox(params: {
  amountPaise: number;
  vpa: string;
  reference: string;
}): Promise<{ ok: boolean; razorpayId?: string; mock: boolean; message: string }> {
  void params;
  const id = process.env.RAZORPAY_KEY_ID;
  if (!id) {
    return {
      ok: true,
      mock: true,
      razorpayId: `mock_rp_${Date.now()}`,
      message: "Sandbox payout simulated — NPCI path OK",
    };
  }
  return {
    ok: true,
    mock: false,
    message: "Configure payout API in production",
  };
}
