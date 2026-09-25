import { describe, it, expect } from "vitest";
import { renderEventHtml } from "@/utils/templateRenderer";
import type { EventConfig } from "@/types";
import { THEMES } from "@/utils/themeUtils";

function makeConfig(overrides: Partial<EventConfig> = {}): EventConfig {
  return {
    input: {
      eventName: "HackFest 2025",
      clubName: "IEEE Chapter",
      category: "hackathon",
      startDate: "2025-11-15T09:00",
      description: "A great event.",
      registrationUrl: "https://forms.gle/example",
      schedule: [{ id: "1", time: "9:00 AM", title: "Opening" }],
      prizes: [{ id: "1", rank: "1st", amount: "50000" }],
      contact: { email: "hi@club.edu" },
    },
    generated: {
      headline: "Build the Future",
      tagline: "48 hours of code",
      about: "About the event goes here.",
      objectives: ["Learn", "Build"],
      sectionHeadings: { hero: "Welcome", about: "About" },
      suggestedTheme: "indigo",
      missingFields: [],
    },
    template: "hackathon",
    theme: THEMES.indigo,
    sections: [
      { id: "hero", enabled: true, order: 0 },
      { id: "about", enabled: true, order: 1 },
      { id: "schedule", enabled: true, order: 2 },
      { id: "prizes", enabled: true, order: 3 },
      { id: "registration", enabled: true, order: 4 },
      { id: "contact", enabled: false, order: 5 },
    ],
    heroImageUrl: "",
    customRegistrationLabel: "Join Now",
    ...overrides,
  };
}

describe("renderEventHtml", () => {
  it("produces a full HTML document", () => {
    const html = renderEventHtml(makeConfig());
    expect(html).toContain("<!DOCTYPE html>");
    expect(html).toContain("</html>");
  });

  it("includes the headline and tagline", () => {
    const html = renderEventHtml(makeConfig());
    expect(html).toContain("Build the Future");
    expect(html).toContain("48 hours of code");
  });

  it("renders enabled sections and omits disabled ones", () => {
    const html = renderEventHtml(makeConfig());
    expect(html).toContain("9:00 AM");    // schedule enabled
    expect(html).not.toContain("hi@club.edu"); // contact disabled
  });

  it("uses the custom registration label", () => {
    const html = renderEventHtml(makeConfig());
    expect(html).toContain("Join Now");
  });

  it("escapes malicious content in event data (XSS protection)", () => {
    const cfg = makeConfig();
    cfg.generated.headline = `<img src=x onerror="alert(1)">`;
    const html = renderEventHtml(cfg);
    expect(html).not.toContain("<img src=x onerror");
    expect(html).toContain("&lt;img");
  });

  it("blocks inline scripts via CSP meta tag", () => {
    const html = renderEventHtml(makeConfig());
    expect(html).toContain("script-src 'none'");
  });

  it("does not render registration section without a url", () => {
    const cfg = makeConfig();
    cfg.input.registrationUrl = undefined;
    const html = renderEventHtml(cfg);
    expect(html).not.toContain("Join Now");
  });
});