import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/msg91";
import { signJwt } from "@/lib/auth-jwt";
import { RAJAN } from "@/lib/seed-data";
import { upsertWorkerByPhone } from "@/lib/db-queries";
import { hasSupabaseService } from "@/lib/supabase-server";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const phone = String(body.phone ?? "");
  const otp = String(body.otp ?? "");
  if (!phone || !otp) {
    return NextResponse.json({ error: "phone and otp required" }, { status: 400 });
  }
  const v = await verifyOtp(phone, otp);
  if (!v.ok) {
    return NextResponse.json({ error: "Invalid OTP" }, { status: 401 });
  }

  let workerId = RAJAN.id;
  if (hasSupabaseService()) {
    const w = await upsertWorkerByPhone(phone);
    if (w?.id) workerId = w.id;
  }

  const token = await signJwt({ sub: workerId, phone });
  return NextResponse.json({
    token,
    workerId,
    mockOtp: !process.env.MSG91_AUTH_KEY,
  });
}
