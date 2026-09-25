import { Router } from "express";
import { GenerateRequestSchema } from "../schemas/event";
import { generateEventContent } from "../services/llm";
import { assistEdit } from "../services/assist";
import { GeneratedContentSchema } from "../schemas/event";
import { AIOptionsRequestSchema } from "../schemas/event";
import { z } from "zod";
import { getPublicStatus } from "../services/providers";

const router = Router();

// Non-secret status the frontend uses to show current AI configuration.
router.get("/settings", (_req, res) => {
  res.json(getPublicStatus());
});

router.post("/generate", async (req, res) => {
  const parsed = GenerateRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid event input",
      details: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
  }

  try {
    const { generated, usedFallback, provider } = await generateEventContent(
      parsed.data.eventInput,
      parsed.data.aiOptions ?? undefined
    );
    return res.json({ generated, usedFallback, provider });
  } catch (e: any) {
    console.error("Generation error:", e?.message);
    // Surface a helpful message without leaking secrets.
    const msg = typeof e?.message === "string" ? e.message : "AI generation failed";
    const status = /api key|unauthorized|401|invalid key|permission/i.test(msg) ? 401 : 502;
    return res.status(status).json({ error: msg });
  }
});

const AssistRequestSchema = z.object({
  current: GeneratedContentSchema,
  instruction: z.string().min(2).max(500),
  aiOptions: AIOptionsRequestSchema,
});

router.post("/assist", async (req, res) => {
  const parsed = AssistRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid assist request", details: parsed.error.issues.map((i) => i.message) });
  }
  try {
    const result = await assistEdit(parsed.data.current, parsed.data.instruction, parsed.data.aiOptions ?? undefined);
    return res.json(result);
  } catch (e: any) {
    const msg = e && typeof e.message === "string" ? e.message : "Assistant failed";
    const status = /api key|no api key|unauthorized|401/i.test(msg) ? 401 : 502;
    return res.status(status).json({ error: msg });
  }
});

export default router;