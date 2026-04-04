import { NextResponse } from "next/server";
import { signJwt } from "@/lib/auth-jwt";
import { RAJAN } from "@/lib/seed-data";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const token = await signJwt({
    sub: RAJAN.id,
    phone: body.phone ?? RAJAN.phone,
    platform: body.platform,
    city: body.city,
  });
  return NextResponse.json({
    ok: true,
    workerId: RAJAN.id,
    token,
    profile: {
      ...RAJAN,
      platform: body.platform ?? RAJAN.platform,
      city: body.city ?? RAJAN.city,
      vehicleType: body.vehicleType ?? RAJAN.vehicle,
    },
  });
}
