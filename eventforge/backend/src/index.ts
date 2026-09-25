import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import generateRoute from "./routes/generate";

dotenv.config();

export function createApp() {
  const app = express();
  app.use(cors({ origin: process.env.CORS_ORIGIN ?? "*" }));
  app.use(express.json({ limit: "1mb" }));

  app.get("/api/health", (_req, res) => res.json({ status: "ok", timestamp: Date.now() }));
  app.use("/api", generateRoute);

  return app;
}

const PORT = Number(process.env.PORT ?? 3001);

if (require.main === module) {
  const app = createApp();
  app.listen(PORT, () => {
    console.log(`EventForge API listening on http://localhost:${PORT}`);
    console.log(process.env.OPENAI_API_KEY ? "OpenAI key detected." : "No OpenAI key — using deterministic fallback content.");
  });
}
