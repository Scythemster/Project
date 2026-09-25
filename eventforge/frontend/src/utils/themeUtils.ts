import { ThemeConfig, ThemeId, FontPairId } from "@/types";

export const THEMES: Record<ThemeId, ThemeConfig> = {
  indigo: { id: "indigo", primaryColor: "#6366f1", accentColor: "#a78bfa", bgColor: "#0f0a2e", textColor: "#e0e7ff", fontPair: "inter-inter" },
  emerald: { id: "emerald", primaryColor: "#10b981", accentColor: "#34d399", bgColor: "#052e16", textColor: "#d1fae5", fontPair: "poppins-inter" },
  rose: { id: "rose", primaryColor: "#f43f5e", accentColor: "#fb7185", bgColor: "#1c0010", textColor: "#ffe4e6", fontPair: "playfair-inter" },
  amber: { id: "amber", primaryColor: "#f59e0b", accentColor: "#fbbf24", bgColor: "#1c1400", textColor: "#fef3c7", fontPair: "poppins-inter" },
  violet: { id: "violet", primaryColor: "#8b5cf6", accentColor: "#c084fc", bgColor: "#150b2e", textColor: "#ede9fe", fontPair: "space-inter" },
  cyan: { id: "cyan", primaryColor: "#06b6d4", accentColor: "#22d3ee", bgColor: "#001a2e", textColor: "#cffafe", fontPair: "inter-inter" },
};

export const FONT_PAIRS: Record<FontPairId, { heading: string; body: string; googleQuery: string }> = {
  "inter-inter": { heading: "Inter", body: "Inter", googleQuery: "Inter:wght@400;600;700;800" },
  "poppins-inter": { heading: "Poppins", body: "Inter", googleQuery: "Poppins:wght@600;700;800&family=Inter:wght@400;500" },
  "playfair-inter": { heading: "Playfair Display", body: "Inter", googleQuery: "Playfair+Display:wght@700;800&family=Inter:wght@400;500" },
  "space-inter": { heading: "Space Grotesk", body: "Inter", googleQuery: "Space+Grotesk:wght@500;700&family=Inter:wght@400;500" },
};

export const CATEGORY_THEME_MAP: Record<string, ThemeId> = {
  hackathon: "indigo",
  workshop: "emerald",
  seminar: "cyan",
  cultural: "rose",
  competition: "amber",
  formal: "violet",
};

export function getDefaultTheme(category: string): ThemeConfig {
  const id = (CATEGORY_THEME_MAP[category] ?? "indigo") as ThemeId;
  return THEMES[id];
}
