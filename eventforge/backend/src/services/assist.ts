import type { GeneratedContent } from "../schemas/event";
import { GeneratedContentSchema } from "../schemas/event";
import { resolveConfig, type AIOptions } from "./providers";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Anthropic from "@anthropic-ai/sdk";

const THEMES = ["indigo","emerald","rose","amber","violet","cyan"];

const SYS = `You edit college event website content based on a user instruction.
Return ONLY JSON: { "generated": {headline,tagline,about,objectives[],sectionHeadings{},suggestedTheme,missingFields[]}, "note": "one short sentence" }.
Keep all factual data intact. Never invent dates, venues, prizes, sponsors, or links. suggestedTheme must be one of: ${THEMES.join(", ")}.`;

function strip(s: string) { return s.replace(/<[^>]*>/g, "").trim(); }
function sanitize(g: GeneratedContent): GeneratedContent {
  return { ...g, headline: strip(g.headline), tagline: strip(g.tagline), about: strip(g.about),
    objectives: g.objectives.map(strip),
    sectionHeadings: Object.fromEntries(Object.entries(g.sectionHeadings).map(([k,v]) => [k, strip(v)])) };
}
function parse(raw: string): { generated: GeneratedContent; note: string } {
  const c = raw.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  const p = JSON.parse(c);
  const r = GeneratedContentSchema.safeParse(p.generated);
  if (!r.success) throw new Error("AI edit failed validation");
  return { generated: sanitize(r.data), note: typeof p.note === "string" ? strip(p.note) : "Updated." };
}

export async function assistEdit(current: GeneratedContent, instruction: string, options?: AIOptions) {
  const cfg = resolveConfig(options);
  if (!cfg.apiKey) throw new Error("No API key configured. Add one in AI Settings or backend/.env to use the assistant.");
  const prompt = `Current content JSON:\n${JSON.stringify(current)}\n\nUser instruction: ${instruction}\n\nReturn the full updated content plus a short note.`;

  if (cfg.provider === "gemini") {
    const m = new GoogleGenerativeAI(cfg.apiKey).getGenerativeModel({ model: cfg.model, systemInstruction: SYS, generationConfig: { temperature: cfg.temperature, maxOutputTokens: cfg.maxTokens, responseMimeType: "application/json" } });
    return parse((await m.generateContent(prompt)).response.text());
  }
  if (cfg.provider === "anthropic") {
    const msg = await new Anthropic({ apiKey: cfg.apiKey }).messages.create({ model: cfg.model, max_tokens: cfg.maxTokens, temperature: cfg.temperature, system: SYS + "\nRespond with one JSON object only.", messages: [{ role: "user", content: prompt }] });
    return parse(msg.content.map((c) => (c.type === "text" ? c.text : "")).join(""));
  }
  const client = new OpenAI({ apiKey: cfg.apiKey, baseURL: cfg.baseUrl });
  const comp = await client.chat.completions.create({ model: cfg.model, messages: [{ role: "system", content: SYS }, { role: "user", content: prompt }], response_format: { type: "json_object" }, temperature: cfg.temperature, max_tokens: cfg.maxTokens });
  return parse(comp.choices[0]?.message?.content ?? "{}");
}