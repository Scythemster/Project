import { z } from "zod";

const httpsOrEmpty = z.string().optional();

export const EventInputSchema = z.object({
  eventName: z.string().min(1),
  clubName: z.string().min(1),
  category: z.enum(["hackathon", "workshop", "seminar", "cultural", "competition", "formal"]),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  venue: z.string().max(200).optional(),
  onlineLink: httpsOrEmpty,
  description: z.string().min(1),
  schedule: z.array(z.object({
    id: z.string(), time: z.string(), title: z.string(), description: z.string().optional(),
  })).optional(),
  registrationUrl: httpsOrEmpty,
  contact: z.object({
    email: z.string().optional(), phone: z.string().optional(), website: z.string().optional(),
    twitter: z.string().optional(), instagram: z.string().optional(), linkedin: z.string().optional(),
  }).optional(),
  sponsors: z.array(z.object({
    id: z.string(), name: z.string(), tier: z.string().optional(), logoUrl: z.string().optional(), websiteUrl: z.string().optional(),
  })).optional(),
  prizes: z.array(z.object({
    id: z.string(), rank: z.string(), amount: z.string().optional(), description: z.string().optional(),
  })).optional(),
  speakers: z.array(z.object({
    id: z.string(), name: z.string(), title: z.string().optional(), bio: z.string().optional(), photoUrl: z.string().optional(),
  })).optional(),
});

export const GeneratedContentSchema = z.object({
  headline: z.string().max(200),
  tagline: z.string().max(300),
  about: z.string(),
  objectives: z.array(z.string()).min(1).max(8),
  sectionHeadings: z.record(z.string()),
  suggestedTheme: z.enum(["indigo", "emerald", "rose", "amber", "violet", "cyan"]),
  missingFields: z.array(z.string()),
});

export const AIOptionsRequestSchema = z.object({
  provider: z.enum(["openai", "gemini", "anthropic", "custom"]).optional(),
  model: z.string().min(1).max(120).optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().int().min(64).max(8192).optional(),
  apiKey: z.string().min(1).max(400).optional(),
  baseUrl: z.string().url().optional(),
}).optional();

export const GenerateRequestSchema = z.object({
  eventInput: EventInputSchema,
  aiOptions: AIOptionsRequestSchema,
});

export type EventInput = z.infer<typeof EventInputSchema>;
export type GeneratedContent = z.infer<typeof GeneratedContentSchema>;
