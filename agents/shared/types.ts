import { z } from "zod";

/* ------------------------------------------------------------------ */
/*  Project Status                                                     */
/* ------------------------------------------------------------------ */

export type ProjectStatus =
  | "queued"
  | "content"
  | "assembling"
  | "deploying"
  | "deployed"
  | "failed";

export const PROJECT_STATUSES: readonly ProjectStatus[] = [
  "queued",
  "content",
  "assembling",
  "deploying",
  "deployed",
  "failed",
] as const;

/* ------------------------------------------------------------------ */
/*  Content Output                                                     */
/* ------------------------------------------------------------------ */

export const ContentOutputSchema = z.object({
  components: z.array(
    z.object({
      componentId: z.string(),
      slots: z.record(z.string(), z.unknown()),
    }),
  ),
});

export type ContentOutput = z.infer<typeof ContentOutputSchema>;

/* ------------------------------------------------------------------ */
/*  Assembler Output                                                   */
/* ------------------------------------------------------------------ */

export const AssemblerOutputSchema = z.object({
  s3Key: z.string(),
  s3Bucket: z.string(),
});

export type AssemblerOutput = z.infer<typeof AssemblerOutputSchema>;

/* ------------------------------------------------------------------ */
/*  Pipeline State                                                     */
/* ------------------------------------------------------------------ */

export const PipelineStateSchema = z.object({
  projectId: z.string(),
  status: z.enum([
    "queued",
    "content",
    "assembling",
    "deploying",
    "deployed",
    "failed",
  ]),
  companyName: z.string(),
  segment: z.string(),
  description: z.string(),
  contentOutput: ContentOutputSchema.optional(),
  assemblerOutput: AssemblerOutputSchema.optional(),
  previewUrl: z.string().optional(),
});

export type PipelineState = z.infer<typeof PipelineStateSchema>;

/* ------------------------------------------------------------------ */
/*  Project Item (DynamoDB document)                                   */
/* ------------------------------------------------------------------ */

export interface ProjectItem {
  pk: string; // PROJECT#<id>
  sk: string; // PROJECT#<id>
  projectId: string;
  status: ProjectStatus;
  companyName: string;
  segment: string;
  description: string;
  contentOutput?: ContentOutput;
  assemblerOutput?: AssemblerOutput;
  previewUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/* ------------------------------------------------------------------ */
/*  Component Item (DynamoDB document)                                 */
/* ------------------------------------------------------------------ */

export interface ComponentItem {
  pk: string; // COMP#<id>
  id: string;
  name: string;
  category: string;
  style: string[];
  mood: string[];
  purpose: string[];
  slots: unknown[];
  pairsWell: string[];
  pairsPoorly: string[];
  acceptsStyleKit: Record<string, boolean>;
}
