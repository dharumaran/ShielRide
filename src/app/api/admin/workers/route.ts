import { NextResponse } from "next/server";
import { listWorkersForAdmin } from "@/lib/db-queries";

const adminPass = () => process.env.ADMIN_PASSWORD ?? "shieldride2026";

export async function GET(req: Request) {
  if (req.headers.get("x-admin-password") !== adminPass()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const workers = await listWorkersForAdmin();
  return NextResponse.json({ workers });
}
