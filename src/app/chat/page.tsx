"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const QUICK = [
  "Why did I get ₹520 today?",
  "What triggers my payout?",
  "Is my premium going up next week?",
  "How is my fraud score calculated?",
  "Why is my weekly premium between ₹20 and ₹50?",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>(
    []
  );
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function send(text: string) {
    const t = text.trim();
    if (!t) return;
    setMessages((m) => [...m, { role: "user", text: t }]);
    setInput("");
    setLoading(true);
    const r = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: t }),
    });
    const j = await r.json();
    setMessages((m) => [...m, { role: "assistant", text: j.reply ?? "Error" }]);
    setLoading(false);
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col gap-4 pb-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Support</h1>
        <p className="text-sm text-slate-600">
          Plain-language help for riders · Powered by Claude
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {QUICK.map((q) => (
          <Button
            key={q}
            type="button"
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={() => send(q)}
          >
            {q}
          </Button>
        ))}
      </div>
      <Card className="min-h-[360px] flex-1">
        <CardHeader>
          <CardTitle className="text-base">Chat</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {messages.length === 0 && (
            <p className="text-sm text-slate-500">Ask anything about ShieldRide.</p>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`rounded-lg px-3 py-2 text-sm ${
                m.role === "user"
                  ? "ml-8 bg-blue-600 text-white"
                  : "mr-8 border border-slate-200 bg-slate-50 text-slate-900"
              }`}
            >
              {m.text}
            </div>
          ))}
          {loading && <p className="text-sm text-slate-500">Thinking…</p>}
        </CardContent>
      </Card>
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your question"
        />
        <Button type="submit" disabled={loading}>
          Send
        </Button>
      </form>
      <p className="text-center text-xs text-slate-500">
        Powered by Claude (Anthropic) — explanations, not hidden pricing.
      </p>
    </div>
  );
}
