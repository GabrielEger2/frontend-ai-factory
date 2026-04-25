import { z } from "zod";

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
  // Optional override for the SFN execution name. Used by restart-pipeline
  // to start a fresh execution on a previously-failed project (the original
  // execution name is the projectId, which would collide). When omitted,
  // pipeline-starter defaults to projectId.
  executionName: z.string().optional(),
});

export type ProjectBrief = z.infer<typeof ProjectBriefSchema>;
