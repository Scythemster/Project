import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";
import type { EventInput, GeneratedContent } from "../schemas/event";
import { GeneratedContentSchema } from "../schemas/event";
import { resolveConfig, type AIOptions, type ResolvedProviderConfig } from "./providers";

const CATEGORY_THEME: Record<string, string> = {
  hackathon: "indigo", workshop: "emerald", seminar: "cyan",
  cultural: "rose", competition: "amber", formal: "violet",
};

function stripTags(s: string): string {
  return s.replace(/<[^>]*>/g, "").trim();
}

function sanitizeGenerated(g: GeneratedContent): GeneratedContent {
  return {
    ...g,
    headline: stripTags(g.headline),
    tagline: stripTags(g.tagline),
    about: stripTags(g.about),
    objectives: g.objectives.map(stripTags),
    sectionHeadings: Object.fromEntries(Object.entries(g.sectionHeadings).map(([k, v]) => [k, stripTags(v)])),
  };
}

const SYSTEM_PROMPT = `You are a copywriter that generates structured JSON content for college event websites.
RULES:
- Return ONLY valid JSON matching the requested schema.
- NEVER invent factual details: dates, venues, prize amounts, sponsor names, registration links, or contact info. Use only what the user provides.
- If a factual detail is missing but important, list it in "missingFields".
- Write compelling but honest marketing copy for headline, tagline, about, and objectives.
- Choose section headings appropriate to the event category.`;

function buildUserPrompt(input: EventInput): string {
  return `Generate website content for this event. Event data (JSON):\n${JSON.stringify(input, null, 2)}\n\nReturn JSON with keys: headline (string), tagline (string), about (string), objectives (array of strings), sectionHeadings (object mapping section ids to titles), suggestedTheme (one of indigo/emerald/rose/amber/violet/cyan), missingFields (array of strings).`;
}

function parseAndValidate(raw: string): GeneratedContent {
  // Some models wrap JSON in code fences; strip them defensively.
  const cleaned = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("AI returned invalid JSON");
  }
  const result = GeneratedContentSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error("AI output failed schema validation: " + result.error.issues.map((i) => i.path.join(".")).join(", "));
  }
  return sanitizeGenerated(result.data);
}

// ─── Provider adapters ────────────────────────────────────────────────────────

async function callOpenAICompatible(cfg: ResolvedProviderConfig, input: EventInput): Promise<GeneratedContent> {
  const client = new OpenAI({ apiKey: cfg.apiKey!, baseURL: cfg.baseUrl });
  const completion = await client.chat.completions.create({
    model: cfg.model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(input) },
    ],
    response_format: { type: "json_object" },
    temperature: cfg.temperature,
    max_tokens: cfg.maxTokens,
  });
  return parseAndValidate(completion.choices[0]?.message?.content ?? "{}");
}

async function callGemini(cfg: ResolvedProviderConfig, input: EventInput): Promise<GeneratedContent> {
  const genAI = new GoogleGenerativeAI(cfg.apiKey!);
  const model = genAI.getGenerativeModel({
    model: cfg.model,
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: { temperature: cfg.temperature, maxOutputTokens: cfg.maxTokens, responseMimeType: "application/json" },
  });
  const res = await model.generateContent(buildUserPrompt(input));
  return parseAndValidate(res.response.text());
}

async function callAnthropic(cfg: ResolvedProviderConfig, input: EventInput): Promise<GeneratedContent> {
  const client = new Anthropic({ apiKey: cfg.apiKey! });
  const msg = await client.messages.create({
    model: cfg.model,
    max_tokens: cfg.maxTokens,
    temperature: cfg.temperature,
    system: SYSTEM_PROMPT + "\nRespond with a single JSON object and nothing else.",
    messages: [{ role: "user", content: buildUserPrompt(input) }],
  });
  const text = msg.content.map((c) => (c.type === "text" ? c.text : "")).join("");
  return parseAndValidate(text);
}

// ─── Public entry point ────────────────────────────────────────────────────────

export async function generateEventContent(input: EventInput, options?: AIOptions): Promise<{ generated: GeneratedContent; usedFallback: boolean; provider: string }> {
  const cfg = resolveConfig(options);

  // No key anywhere -> deterministic honest fallback.
  if (!cfg.apiKey) {
    return { generated: sanitizeGenerated(buildFallback(input)), usedFallback: true, provider: "fallback" };
  }

  let generated: GeneratedContent;
  switch (cfg.provider) {
    case "gemini":
      generated = await callGemini(cfg, input);
      break;
    case "anthropic":
      generated = await callAnthropic(cfg, input);
      break;
    case "openai":
    case "custom":
    default:
      generated = await callOpenAICompatible(cfg, input);
      break;
  }
  return { generated, usedFallback: false, provider: cfg.provider };
}

function buildFallback(input: EventInput): GeneratedContent {
  const theme = (CATEGORY_THEME[input.category] ?? "indigo") as GeneratedContent["suggestedTheme"];
  const missing: string[] = [];
  if (!input.venue && !input.onlineLink) missing.push("Venue or online link");
  if (!input.registrationUrl) missing.push("Registration URL");
  if (!input.contact?.email) missing.push("Contact email");

  return {
    headline: `${input.eventName}`,
    tagline: `Presented by ${input.clubName}`,
    about: input.description,
    objectives: [
      "Engage with a vibrant community",
      "Learn from experts and peers",
      "Build lasting connections",
    ],
    sectionHeadings: {
      hero: input.eventName,
      about: "About the Event",
      schedule: "Schedule",
      prizes: "Prizes",
      sponsors: "Sponsors",
      speakers: "Speakers",
      registration: "Register",
      contact: "Contact",
    },
    suggestedTheme: theme,
    missingFields: missing,
  };
}