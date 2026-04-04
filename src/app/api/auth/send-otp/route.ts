import { NextResponse } from "next/server";
import { sendOtp } from "@/lib/msg91";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const phone = String(body.phone ?? "").trim();
  if (!phone) {
    return NextResponse.json({ error: "phone required" }, { status: 400 });
  }
  const r = await sendOtp(phone);
  return NextResponse.json({
    ok: r.ok,
    mock: r.mock ?? false,
    message: r.mock
      ? "Dev mode: use OTP from OTP_DEV_BYPASS in .env.local (e.g. 123456)"
      : "OTP sent",
  });
}
