import { describe, it, expect } from "vitest";
import request from "supertest";
import { createApp } from "../index";

const app = createApp();

const validInput = {
  eventName: "HackFest 2025",
  clubName: "IEEE Chapter",
  category: "hackathon",
  startDate: "2025-11-15T09:00",
  description: "A 48-hour hackathon for students.",
  registrationUrl: "https://forms.gle/example",
};

describe("GET /api/health", () => {
  it("returns ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("POST /api/generate", () => {
  it("returns generated content for valid input (fallback mode)", async () => {
    const res = await request(app).post("/api/generate").send({ eventInput: validInput });
    expect(res.status).toBe(200);
    expect(res.body.generated).toBeDefined();
    expect(res.body.generated.headline).toBeTruthy();
    expect(Array.isArray(res.body.generated.objectives)).toBe(true);
    expect(["indigo","emerald","rose","amber","violet","cyan"]).toContain(res.body.generated.suggestedTheme);
  });

  it("does not invent missing factual fields", async () => {
    const res = await request(app).post("/api/generate").send({ eventInput: validInput });
    // No venue/online link or contact email supplied -> flagged as missing
    expect(res.body.generated.missingFields).toContain("Venue or online link");
    expect(res.body.generated.missingFields).toContain("Contact email");
  });

  it("returns 400 for invalid input", async () => {
    const res = await request(app).post("/api/generate").send({ eventInput: { eventName: "x" } });
    expect(res.status).toBe(400);
    expect(res.body.error).toBeTruthy();
  });

  it("returns 400 when eventInput is missing", async () => {
    const res = await request(app).post("/api/generate").send({});
    expect(res.status).toBe(400);
  });
});