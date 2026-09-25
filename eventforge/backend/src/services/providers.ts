import { z } from "zod";

// Supported AI providers. "custom" is any OpenAI-compatible endpoint
// (Ollama, LM Studio, OpenRouter, Together, etc.).
export const ProviderIdSchema = z.enum(["openai", "gemini", "anthropic", "custom"]);
export type ProviderId = z.infer<typeof ProviderIdSchema>;

// Options that can be tuned per request or configured on the backend.
export const AIOptionsSchema = z.object({
  provider: ProviderIdSchema.optional(),
  model: z.string().min(1).max(120).optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().min(64).max(8192).optional(),
  // Optional per-request key + base URL override (in-browser mode).
  apiKey: z.string().min(1).max(400).optional(),
  baseUrl: z.string().url().optional(),
});
export type AIOptions = z.infer<typeof AIOptionsSchema>;

export interface ResolvedProviderConfig {
  provider: ProviderId;
  model: string;
  temperature: number;
  maxTokens: number;
  apiKey: string | undefined;
  baseUrl: string | undefined;
  source: "request" | "backend" | "none";
}

const DEFAULT_MODELS: Record<ProviderId, string> = {
  openai: "gpt-4o-mini",
  gemini: "gemini-1.5-flash",
  anthropic: "claude-3-5-haiku-latest",
  custom: "llama3.1",
};

// Merge backend .env config with an optional per-request override.
// Request values win, but only for that single call (never persisted).
export function resolveConfig(reqOptions?: AIOptions): ResolvedProviderConfig {
  const backendProvider = (process.env.AI_PROVIDER as ProviderId) || "openai";
  const provider = reqOptions?.provider ?? backendProvider;

  const backendKey =
    provider === "openai" ? process.env.OPENAI_API_KEY :
    provider === "gemini" ? process.env.GEMINI_API_KEY :
    provider === "anthropic" ? process.env.ANTHROPIC_API_KEY :
    process.env.CUSTOM_API_KEY;

  const backendBaseUrl =
    provider === "custom" ? process.env.CUSTOM_BASE_URL :
    provider === "openai" ? process.env.OPENAI_BASE_URL :
    undefined;

  const backendModel =
    provider === "openai" ? process.env.OPENAI_MODEL :
    provider === "gemini" ? process.env.GEMINI_MODEL :
    provider === "anthropic" ? process.env.ANTHROPIC_MODEL :
    process.env.CUSTOM_MODEL;

  const apiKey = reqOptions?.apiKey ?? backendKey ?? undefined;
  const source: ResolvedProviderConfig["source"] =
    reqOptions?.apiKey ? "request" : backendKey ? "backend" : "none";

  return {
    provider,
    model: reqOptions?.model ?? backendModel ?? DEFAULT_MODELS[provider],
    temperature: reqOptions?.temperature ?? Number(process.env.AI_TEMPERATURE ?? 0.7),
    maxTokens: reqOptions?.maxTokens ?? Number(process.env.AI_MAX_TOKENS ?? 1024),
    apiKey,
    baseUrl: reqOptions?.baseUrl ?? backendBaseUrl ?? undefined,
    source,
  };
}

// A safe, non-secret summary the frontend can read to show current status.
export function getPublicStatus() {
  const provider = (process.env.AI_PROVIDER as ProviderId) || "openai";
  const configured =
    !!(process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY ||
       process.env.ANTHROPIC_API_KEY || process.env.CUSTOM_API_KEY);
  return {
    backendProvider: provider,
    backendKeyConfigured: configured,
    supportedProviders: ["openai", "gemini", "anthropic", "custom"] as ProviderId[],
    defaultModels: DEFAULT_MODELS,
  };
}