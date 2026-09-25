import type { EventInput, GeneratedContent } from "@/types";

export type ProviderId = "openai" | "gemini" | "anthropic" | "custom";

export interface AIOptions {
  provider?: ProviderId;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  apiKey?: string;   // in-browser override (local use only)
  baseUrl?: string;
}

export interface AISettingsStatus {
  backendProvider: ProviderId;
  backendKeyConfigured: boolean;
  supportedProviders: ProviderId[];
  defaultModels: Record<ProviderId, string>;
}

export interface GenerateResult {
  generated: GeneratedContent;
  usedFallback: boolean;
  provider: string;
}

export async function fetchAISettings(): Promise<AISettingsStatus> {
  const res = await fetch("/api/settings");
  if (!res.ok) throw new Error("Could not load AI settings");
  return res.json();
}

export async function generateContent(input: EventInput, aiOptions?: AIOptions): Promise<GenerateResult> {
  // Only send options that have values, so empty fields fall back to backend config.
  const cleanedOptions: AIOptions | undefined = aiOptions
    ? Object.fromEntries(Object.entries(aiOptions).filter(([, v]) => v !== undefined && v !== "" && v !== null))
    : undefined;

  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      eventInput: input,
      ...(cleanedOptions && Object.keys(cleanedOptions).length ? { aiOptions: cleanedOptions } : {}),
    }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as any).error ?? `Server error ${res.status}`);
  }
  return res.json();
}
export interface AssistResult {
  generated: GeneratedContent;
  note: string;
}

export async function assistEdit(current: GeneratedContent, instruction: string, aiOptions?: AIOptions): Promise<AssistResult> {
  const cleaned: AIOptions | undefined = aiOptions
    ? Object.fromEntries(Object.entries(aiOptions).filter(([, v]) => v !== undefined && v !== "" && v !== null))
    : undefined;
  const res = await fetch("/api/assist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ current, instruction, ...(cleaned && Object.keys(cleaned).length ? { aiOptions: cleaned } : {}) }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as any).error ?? "Assistant failed (" + res.status + ")");
  }
  return res.json();
}
