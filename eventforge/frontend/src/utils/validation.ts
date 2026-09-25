import { z } from "zod";

// Lenient, user-friendly URL field:
// - empty string / whitespace -> undefined (optional, no error)
// - bare domains like "google.com" or "www.site.org" get "https://" prepended
// - "http://" is upgraded to "https://"
// - anything that still is not a valid https URL produces a clear error
const httpsUrl = z.preprocess(
  (val) => {
    if (typeof val !== "string") return val;
    const trimmed = val.trim();
    if (trimmed === "") return undefined;
    let candidate = trimmed;
    if (/^http:\/\//i.test(candidate)) {
      candidate = candidate.replace(/^http:\/\//i, "https://");
    } else if (!/^https:\/\//i.test(candidate)) {
      candidate = "https://" + candidate;
    }
    return candidate;
  },
  z
    .string()
    .refine(
      (v) => {
        try {
          const u = new URL(v);
          return u.protocol === "https:" && u.hostname.includes(".");
        } catch {
          return false;
        }
      },
      { message: "Enter a valid web address, e.g. example.com" }
    )
    .optional()
);

// Optional email: empty -> undefined, otherwise must be a valid email.
const optionalEmail = z.preprocess(
  (val) => {
    if (typeof val !== "string") return val;
    const trimmed = val.trim();
    return trimmed === "" ? undefined : trimmed;
  },
  z.string().email("Enter a valid email, e.g. name@college.edu").optional()
);

// Optional free-text: empty string -> undefined so it never trips validation.
const optionalText = (max?: number) =>
  z.preprocess(
    (val) => {
      if (typeof val !== "string") return val;
      const trimmed = val.trim();
      return trimmed === "" ? undefined : trimmed;
    },
    max ? z.string().max(max).optional() : z.string().optional()
  );

export const ScheduleItemSchema = z.object({
  id: z.string(),
  time: z.string().min(1, "Time is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

export const SponsorSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Sponsor name is required"),
  tier: z.enum(["gold", "silver", "bronze", "partner"]).optional().or(z.literal("")),
  logoUrl: httpsUrl,
  websiteUrl: httpsUrl,
});

export const PrizeSchema = z.object({
  id: z.string(),
  rank: z.string().min(1, "Rank is required"),
  amount: z.string().optional(),
  description: z.string().optional(),
});

export const SpeakerSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Speaker name is required"),
  title: z.string().optional(),
  bio: z.string().optional(),
  photoUrl: httpsUrl,
});

export const ContactInfoSchema = z.object({
  email: optionalEmail,
  phone: optionalText(),
  website: httpsUrl,
  twitter: optionalText(),
  instagram: optionalText(),
  linkedin: optionalText(),
});

export const EventInputSchema = z.object({
  eventName: z.string().trim().min(2, "Event name must be at least 2 characters"),
  clubName: z.string().trim().min(2, "Club name must be at least 2 characters"),
  category: z.enum(["hackathon", "workshop", "seminar", "cultural", "competition", "formal"]),
  startDate: z.string().min(1, "Start date is required"),
  endDate: optionalText(),
  venue: optionalText(200),
  onlineLink: httpsUrl,
  description: z.string().trim().min(20, "Description must be at least 20 characters"),
  schedule: z.array(ScheduleItemSchema).optional(),
  registrationUrl: httpsUrl,
  contact: ContactInfoSchema.optional(),
  sponsors: z.array(SponsorSchema).optional(),
  prizes: z.array(PrizeSchema).optional(),
  speakers: z.array(SpeakerSchema).optional(),
});

export const GeneratedContentSchema = z.object({
  headline: z.string().max(120),
  tagline: z.string().max(200),
  about: z.string(),
  objectives: z.array(z.string()).min(1).max(7),
  sectionHeadings: z.record(z.string()),
  suggestedTheme: z.enum(["indigo", "emerald", "rose", "amber", "violet", "cyan"]),
  missingFields: z.array(z.string()),
});

export type EventInputForm = z.infer<typeof EventInputSchema>;