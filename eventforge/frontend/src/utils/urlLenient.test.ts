import { describe, it, expect } from "vitest";
import { EventInputSchema } from "@/utils/validation";

const base = {
  eventName: "My Event", clubName: "My Club", category: "hackathon",
  startDate: "2025-11-15T09:00", description: "This description is long enough to pass validation.",
};

describe("lenient url handling", () => {
  it("accepts a bare domain and prepends https", () => {
    const r = EventInputSchema.safeParse({ ...base, registrationUrl: "forms.gle/abc" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.registrationUrl).toBe("https://forms.gle/abc");
  });
  it("upgrades http to https", () => {
    const r = EventInputSchema.safeParse({ ...base, onlineLink: "http://meet.google.com/x" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.onlineLink).toBe("https://meet.google.com/x");
  });
  it("treats empty optional url as undefined", () => {
    const r = EventInputSchema.safeParse({ ...base, registrationUrl: "" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.registrationUrl).toBeUndefined();
  });
  it("rejects a value with no dot (not a domain)", () => {
    const r = EventInputSchema.safeParse({ ...base, registrationUrl: "notadomain" });
    expect(r.success).toBe(false);
  });
  it("treats empty contact email as undefined", () => {
    const r = EventInputSchema.safeParse({ ...base, contact: { email: "" } });
    expect(r.success).toBe(true);
  });
  it("still rejects a malformed email", () => {
    const r = EventInputSchema.safeParse({ ...base, contact: { email: "nope" } });
    expect(r.success).toBe(false);
  });
});