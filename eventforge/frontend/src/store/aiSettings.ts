import type { AIOptions, ProviderId } from "@/api/generateContent";

const STORAGE_KEY = "eventforge.aiSettings.v1";

export interface AISettingsState {
  enabled: boolean;          // use custom in-browser AI settings for this session
  provider: ProviderId;
  model: string;
  temperature: number;
  maxTokens: number;
  apiKey: string;            // in-browser key (optional, local use only)
  baseUrl: string;           // for custom provider
  persistKey: boolean;       // whether to save the key in localStorage
}

export const DEFAULT_AI_SETTINGS: AISettingsState = {
  enabled: false,
  provider: "openai",
  model: "",
  temperature: 0.7,
  maxTokens: 1024,
  apiKey: "",
  baseUrl: "",
  persistKey: false,
};

export function loadAISettings(): AISettingsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_AI_SETTINGS;
    const parsed = JSON.parse(raw) as Partial<AISettingsState>;
    return {
      ...DEFAULT_AI_SETTINGS,
      ...parsed,
      // Only restore the key if the user opted to persist it.
      apiKey: parsed.persistKey ? (parsed.apiKey ?? "") : "",
    };
  } catch {
    return DEFAULT_AI_SETTINGS;
  }
}

export function saveAISettings(s: AISettingsState): void {
  try {
    const toStore: AISettingsState = { ...s, apiKey: s.persistKey ? s.apiKey : "" };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toStore));
  } catch {
    // ignore storage errors (private mode etc.)
  }
}

// Build the AIOptions payload from settings, only when enabled.
export function toAIOptions(s: AISettingsState): AIOptions | undefined {
  if (!s.enabled) return undefined;
  const opts: AIOptions = {
    provider: s.provider,
    temperature: s.temperature,
    maxTokens: s.maxTokens,
  };
  if (s.model.trim()) opts.model = s.model.trim();
  if (s.apiKey.trim()) opts.apiKey = s.apiKey.trim();
  if (s.baseUrl.trim()) opts.baseUrl = s.baseUrl.trim();
  return opts;
}