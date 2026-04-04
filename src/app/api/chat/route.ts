import { NextResponse } from "next/server";
import { supportChatReply } from "@/ai/support-chat";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const message = String(body.message ?? "");
  if (!message) {
    return NextResponse.json({ error: "message required" }, { status: 400 });
  }
  const r = await supportChatReply(message);
  return NextResponse.json(r);
}
