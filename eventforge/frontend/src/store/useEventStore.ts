import { create } from "zustand";
import type {
  EventInput, GeneratedContent, EventConfig,
  SectionConfig, SectionId, ThemeConfig, TemplateId,
  WizardStep, PreviewMode, UIState,
} from "@/types";
import { THEMES, getDefaultTheme } from "@/utils/themeUtils";

const DEFAULT_SECTIONS: SectionConfig[] = [
  { id: "hero",         enabled: true,  order: 0 },
  { id: "about",        enabled: true,  order: 1 },
  { id: "highlights",   enabled: true,  order: 2 },
  { id: "schedule",     enabled: true,  order: 3 },
  { id: "speakers",     enabled: false, order: 4 },
  { id: "prizes",       enabled: false, order: 5 },
  { id: "sponsors",     enabled: false, order: 6 },
  { id: "registration", enabled: true,  order: 7 },
  { id: "contact",      enabled: true,  order: 8 },
];

interface EventStore {
  // Data
  eventInput: EventInput | null;
  generated: GeneratedContent | null;
  eventConfig: EventConfig | null;
  template: TemplateId;
  theme: ThemeConfig;
  sections: SectionConfig[];
  heroImageUrl: string;
  customRegistrationLabel: string;

  // UI
  ui: UIState;

  // Actions
  setEventInput: (input: EventInput) => void;
  setGenerated: (g: GeneratedContent) => void;
  setEventConfig: (cfg: EventConfig) => void;
  setTemplate: (t: TemplateId) => void;
  setTheme: (t: ThemeConfig) => void;
  setThemeId: (id: string) => void;
  setFontPair: (fp: string) => void;
  setPrimaryColor: (c: string) => void;
  toggleSection: (id: SectionId) => void;
  reorderSections: (sections: SectionConfig[]) => void;
  setHeroImageUrl: (url: string) => void;
  setRegistrationLabel: (label: string) => void;
  setStep: (s: WizardStep) => void;
  setGenerating: (v: boolean) => void;
  setGenerationError: (e: string | null) => void;
  setPreviewMode: (m: PreviewMode) => void;
  reset: () => void;
}

export const useEventStore = create<EventStore>((set, get) => ({
  eventInput: null,
  generated: null,
  eventConfig: null,
  template: "hackathon",
  theme: THEMES.indigo,
  sections: DEFAULT_SECTIONS,
  heroImageUrl: "",
  customRegistrationLabel: "Register Now",

  ui: {
    step: "form",
    isGenerating: false,
    generationError: null,
    previewMode: "desktop",
  },

  setEventInput: (input) => {
    const theme = getDefaultTheme(input.category);
    set({ eventInput: input, theme });
  },

  setGenerated: (generated) => set({ generated }),

  setEventConfig: (cfg) => set({ eventConfig: cfg }),

  setTemplate: (template) => {
    set({ template });
    // enable/disable default sections per template
    set((s) => {
      const sections = s.sections.map((sec) => {
        if (template === "hackathon") {
          return { ...sec, enabled: ["hero","about","highlights","schedule","prizes","sponsors","registration","contact"].includes(sec.id) };
        }
        if (template === "workshop") {
          return { ...sec, enabled: ["hero","about","highlights","schedule","speakers","registration","contact"].includes(sec.id) };
        }
        if (template === "cultural") {
          return { ...sec, enabled: ["hero","about","highlights","schedule","sponsors","registration","contact"].includes(sec.id) };
        }
        if (template === "competition") {
          return { ...sec, enabled: ["hero","about","highlights","schedule","prizes","registration","contact"].includes(sec.id) };
        }
        if (template === "formal") {
          return { ...sec, enabled: ["hero","about","highlights","schedule","speakers","contact"].includes(sec.id) };
        }
        return sec;
      });
      return { sections };
    });
  },

  setTheme: (theme) => set({ theme }),
  setThemeId: (id) => set({ theme: THEMES[id as keyof typeof THEMES] ?? get().theme }),
  setFontPair: (fp) => set((s) => ({ theme: { ...s.theme, fontPair: fp as any } })),
  setPrimaryColor: (c) => set((s) => ({ theme: { ...s.theme, primaryColor: c } })),

  toggleSection: (id) =>
    set((s) => ({
      sections: s.sections.map((sec) =>
        sec.id === id ? { ...sec, enabled: !sec.enabled } : sec
      ),
    })),

  reorderSections: (sections) => set({ sections }),

  setHeroImageUrl: (heroImageUrl) => set({ heroImageUrl }),
  setRegistrationLabel: (customRegistrationLabel) => set({ customRegistrationLabel }),

  setStep: (step) => set((s) => ({ ui: { ...s.ui, step } })),
  setGenerating: (isGenerating) => set((s) => ({ ui: { ...s.ui, isGenerating } })),
  setGenerationError: (generationError) => set((s) => ({ ui: { ...s.ui, generationError } })),
  setPreviewMode: (previewMode) => set((s) => ({ ui: { ...s.ui, previewMode } })),

  reset: () =>
    set({
      eventInput: null,
      generated: null,
      eventConfig: null,
      template: "hackathon",
      theme: THEMES.indigo,
      sections: DEFAULT_SECTIONS.map((s) => ({ ...s })),
      heroImageUrl: "",
      customRegistrationLabel: "Register Now",
      ui: { step: "form", isGenerating: false, generationError: null, previewMode: "desktop" },
    }),
}));
