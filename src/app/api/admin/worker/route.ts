import { NextResponse } from "next/server";
import { getAdminWorkerDetail } from "@/lib/db-queries";

const adminPass = () => process.env.ADMIN_PASSWORD ?? "shieldride2026";

export async function GET(req: Request) {
  if (req.headers.get("x-admin-password") !== adminPass()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const workerId = searchParams.get("workerId");
  if (!workerId) {
    return NextResponse.json({ error: "workerId required" }, { status: 400 });
  }
  const detail = await getAdminWorkerDetail(workerId);
  if (!detail) {
    return NextResponse.json({ error: "Worker not found" }, { status: 404 });
  }
  return NextResponse.json(detail);
}
