import { describe, it, expect } from "vitest";
import { EventInputSchema, GeneratedContentSchema } from "@/utils/validation";

const valid = {
  eventName: "HackFest 2025",
  clubName: "IEEE Chapter",
  category: "hackathon" as const,
  startDate: "2025-11-15T09:00",
  description: "A great hackathon event for all students to participate in.",
};

describe("EventInputSchema", () => {
  it("accepts a minimal valid input", () => {
    expect(EventInputSchema.safeParse(valid).success).toBe(true);
  });
  it("rejects short event name", () => {
    expect(EventInputSchema.safeParse({ ...valid, eventName: "x" }).success).toBe(false);
  });
  it("rejects short description", () => {
    expect(EventInputSchema.safeParse({ ...valid, description: "too short" }).success).toBe(false);
  });
  it("rejects invalid category", () => {
    expect(EventInputSchema.safeParse({ ...valid, category: "party" }).success).toBe(false);
  });
  it("upgrades http registration url to https", () => {
    const r = EventInputSchema.safeParse({ ...valid, registrationUrl: "http://insecure.com" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.registrationUrl).toBe("https://insecure.com");
  });
  it("rejects a registration value that is not a domain", () => {
    expect(EventInputSchema.safeParse({ ...valid, registrationUrl: "notadomain" }).success).toBe(false);
  });
  it("accepts https registration url", () => {
    expect(EventInputSchema.safeParse({ ...valid, registrationUrl: "https://secure.com" }).success).toBe(true);
  });
});

describe("GeneratedContentSchema", () => {
  it("validates a well-formed AI response", () => {
    const g = {
      headline: "Build the Future",
      tagline: "48 hours of code",
      about: "About text here.",
      objectives: ["Learn", "Build", "Win"],
      sectionHeadings: { hero: "Welcome", about: "About" },
      suggestedTheme: "indigo" as const,
      missingFields: [],
    };
    expect(GeneratedContentSchema.safeParse(g).success).toBe(true);
  });
  it("rejects invalid theme", () => {
    const g = { headline: "h", tagline: "t", about: "a", objectives: ["x"], sectionHeadings: {}, suggestedTheme: "neon", missingFields: [] };
    expect(GeneratedContentSchema.safeParse(g).success).toBe(false);
  });
  it("rejects empty objectives", () => {
    const g = { headline: "h", tagline: "t", about: "a", objectives: [], sectionHeadings: {}, suggestedTheme: "indigo", missingFields: [] };
    expect(GeneratedContentSchema.safeParse(g).success).toBe(false);
  });
});