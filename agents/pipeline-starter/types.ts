import { z } from "zod";
import { MOOD_TAGS, STYLE_TAGS } from "../shared/constants";

const HEX_RE = /^#[0-9a-fA-F]{6}$/;

/**
 * Zod schema for the SQS message body that triggers the pipeline.
 * Sent by the POST /projects API handler.
 */
export const ProjectBriefSchema = z.object({
  projectId: z.string(),
  segment: z.string(),
  companyName: z.string(),
  description: z.string(),
  sellerId: z.string(),
  brandColor: z.string().optional(),
  // Expanded intake fields (all optional for back-compat with in-flight projects).
  // brandToneKeywords (NOT toneKeywords) — avoids collision with ResearchOutputSchema.toneKeywords.
  desiredSections: z.array(z.string()).optional(),
  brandToneKeywords: z.array(z.string()).optional(),
  objectives: z.array(z.string()).optional(),
  businessHours: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  socialLinks: z
    .array(z.object({ platform: z.string(), url: z.string() }))
    .optional(),
  pageType: z
    .enum(["landing", "store", "portfolio", "services", "about"])
    .optional(),
  // Richer intake fields (all optional for back-compat).
  niche: z.string().optional(),
  region: z.string().optional(),
  companySize: z.enum(["solo", "2-10", "11-50", "51-200", "200+"]).optional(),
  primaryCta: z
    .enum(["book", "buy", "contact", "subscribe", "learn-more"])
    .optional(),
  mainService: z.string().optional(),
  whatMakesSpecial: z.array(z.string().max(120)).max(5).optional(),
  keyResults: z.string().optional(),
  idealPublic: z.string().optional(),
  moodTags: z
    .array(z.enum(MOOD_TAGS as unknown as [string, ...string[]]))
    .max(5)
    .optional(),
  styleTags: z
    .array(z.enum(STYLE_TAGS as unknown as [string, ...string[]]))
    .max(5)
    .optional(),
  voiceTone: z.array(z.string()).max(3).optional(),
  slogan: z.string().optional(),
  brandColors: z.array(z.string().regex(HEX_RE)).max(3).optional(),
  colorsToAvoid: z.array(z.string()).optional(),
  inspirationSites: z.array(z.string().url()).max(3).optional(),
  doNots: z.string().optional(),
  // Ranked objectives accepts BOTH legacy string[] AND new typed shape.
  // Zod evaluates union arms left-to-right — legacy string[] MUST be first
  // so existing in-flight SQS messages continue to parse.
  rankedObjectives: z
    .union([
      z.array(z.string()),
      z.array(z.object({ id: z.string(), rank: z.number().int().positive() })),
    ])
    .optional(),
  // Optional override for the SFN execution name. Used by restart-pipeline
  // to start a fresh execution on a previously-failed project (the original
  // execution name is the projectId, which would collide). When omitted,
  // pipeline-starter defaults to projectId.
  executionName: z.string().optional(),
});

export type ProjectBrief = z.infer<typeof ProjectBriefSchema>;
