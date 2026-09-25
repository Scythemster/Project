// ─── Core domain types ────────────────────────────────────────────────────────

export type EventCategory =
  | "hackathon"
  | "workshop"
  | "seminar"
  | "cultural"
  | "competition"
  | "formal";

export type TemplateId =
  | "hackathon"
  | "workshop"
  | "cultural"
  | "competition"
  | "formal";

export type SectionId =
  | "hero"
  | "about"
  | "highlights"
  | "schedule"
  | "speakers"
  | "prizes"
  | "sponsors"
  | "registration"
  | "contact";

export type ThemeId =
  | "indigo"
  | "emerald"
  | "rose"
  | "amber"
  | "violet"
  | "cyan";

export type FontPairId =
  | "inter-inter"
  | "poppins-inter"
  | "playfair-inter"
  | "space-inter";

// ─── Sub-entities ─────────────────────────────────────────────────────────────

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  description?: string;
}

export interface ContactInfo {
  email?: string;
  phone?: string;
  website?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
}

export interface Sponsor {
  id: string;
  name: string;
  tier?: "gold" | "silver" | "bronze" | "partner";
  logoUrl?: string;
  websiteUrl?: string;
}

export interface Prize {
  id: string;
  rank: string;
  amount?: string;
  description?: string;
}

export interface Speaker {
  id: string;
  name: string;
  title?: string;
  bio?: string;
  photoUrl?: string;
}

// ─── EventInput ───────────────────────────────────────────────────────────────

export interface EventInput {
  eventName: string;
  clubName: string;
  category: EventCategory;
  startDate: string;
  endDate?: string;
  venue?: string;
  onlineLink?: string;
  description: string;
  schedule?: ScheduleItem[];
  registrationUrl?: string;
  contact?: ContactInfo;
  sponsors?: Sponsor[];
  prizes?: Prize[];
  speakers?: Speaker[];
}

// ─── GeneratedContent (from AI) ───────────────────────────────────────────────

export interface GeneratedContent {
  headline: string;
  tagline: string;
  about: string;
  objectives: string[];
  sectionHeadings: Partial<Record<SectionId, string>>;
  suggestedTheme: ThemeId;
  missingFields: string[];
}

// ─── Theme / Styling ──────────────────────────────────────────────────────────

export interface ThemeConfig {
  id: ThemeId;
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  textColor: string;
  fontPair: FontPairId;
}

export interface SectionConfig {
  id: SectionId;
  enabled: boolean;
  order: number;
  customHeading?: string;
}

// ─── Full EventConfig ─────────────────────────────────────────────────────────

export interface EventConfig {
  input: EventInput;
  generated: GeneratedContent;
  template: TemplateId;
  theme: ThemeConfig;
  sections: SectionConfig[];
  heroImageUrl?: string;
  customRegistrationLabel?: string;
}

// ─── UI state helpers ─────────────────────────────────────────────────────────

export type WizardStep = "form" | "template" | "preview" | "export";

export type PreviewMode = "desktop" | "mobile";

export interface UIState {
  step: WizardStep;
  isGenerating: boolean;
  generationError: string | null;
  previewMode: PreviewMode;
}
