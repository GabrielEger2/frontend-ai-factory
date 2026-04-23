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
});

export type ProjectBrief = z.infer<typeof ProjectBriefSchema>;
