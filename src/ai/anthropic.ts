const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";

export async function callClaude(systemPrompt: string, userPrompt: string) {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return {
      text: null as string | null,
      mock: true,
      error: "ANTHROPIC_API_KEY not set",
    };
  }
  const response = await fetch(ANTHROPIC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });
  if (!response.ok) {
    const err = await response.text();
    return { text: null as string | null, mock: false, error: err };
  }
  const data = (await response.json()) as {
    content?: Array<{ type: string; text?: string }>;
  };
  const block = data.content?.find((c) => c.type === "text");
  return { text: block?.text ?? null, mock: false, error: null as string | null };
}
