import { z } from "zod";

/* ------------------------------------------------------------------ */
/*  Project Status                                                     */
/* ------------------------------------------------------------------ */

export type ProjectStatus =
  | "queued"
  | "content"
  | "humanizing"
  | "assembling"
  | "qa"
  | "deploying"
  | "deployed"
  | "failed"
  | "qa_failed";

export const PROJECT_STATUSES: readonly ProjectStatus[] = [
  "queued",
  "content",
  "humanizing",
  "assembling",
  "qa",
  "deploying",
  "deployed",
  "failed",
  "qa_failed",
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
/*  Humanizer Output                                                   */
/* ------------------------------------------------------------------ */

export const HumanizerOutputSchema = z.object({
  components: z.array(
    z.object({
      componentId: z.string(),
      slots: z.record(z.string(), z.unknown()),
    }),
  ),
});

export type HumanizerOutput = z.infer<typeof HumanizerOutputSchema>;

/* ------------------------------------------------------------------ */
/*  QA Output                                                          */
/* ------------------------------------------------------------------ */

export const QAOutputSchema = z.object({
  passed: z.boolean(),
  issues: z.array(
    z.object({
      componentId: z.string(),
      slot: z.string(),
      message: z.string(),
    }),
  ),
});

export type QAOutput = z.infer<typeof QAOutputSchema>;

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
    "humanizing",
    "assembling",
    "qa",
    "deploying",
    "deployed",
    "failed",
    "qa_failed",
  ]),
  companyName: z.string(),
  segment: z.string(),
  description: z.string(),
  contentOutput: ContentOutputSchema.optional(),
  humanizerOutput: HumanizerOutputSchema.optional(),
  assemblerOutput: AssemblerOutputSchema.optional(),
  qaOutput: QAOutputSchema.optional(),
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
  humanizerOutput?: HumanizerOutput;
  assemblerOutput?: AssemblerOutput;
  qaOutput?: QAOutput;
  qaIssues?: QAOutput["issues"];
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
