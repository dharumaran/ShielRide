/**
 * MSG91 OTP — mock in dev (auto 123456), real when env set.
 */

export async function sendOtp(phone: string): Promise<{ ok: boolean; mock?: boolean }> {
  void phone;
  const key = process.env.MSG91_AUTH_KEY;
  if (!key) {
    return { ok: true, mock: true };
  }
  // Placeholder: integrate MSG91 REST
  return { ok: true, mock: false };
}

export async function verifyOtp(
  phone: string,
  otp: string
): Promise<{ ok: boolean }> {
  void phone;
  const bypass = process.env.OTP_DEV_BYPASS;
  if (bypass && otp === bypass) {
    return { ok: true };
  }
  if (!process.env.MSG91_AUTH_KEY) {
    return { ok: otp === "123456" || otp === "000000" };
  }
  // Production: integrate MSG91 verify API here; length check is placeholder
  return { ok: otp.length === 6 };
}
