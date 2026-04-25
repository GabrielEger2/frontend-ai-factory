import { z } from "zod";

/* ------------------------------------------------------------------ */
/*  Project Status                                                     */
/* ------------------------------------------------------------------ */

export const PROJECT_STATUSES = [
  "queued",
  "researching",
  "styling",
  "awaiting_style_approval",
  "composing",
  "awaiting_layout_approval",
  "content",
  "humanizing",
  "assembling",
  "qa",
  "ready_for_review",
  "deploying",
  "deployed",
  "failed",
  "qa_failed",
  "deploy_failed",
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
/*  Research Output                                                    */
/* ------------------------------------------------------------------ */

export const ResearchOutputSchema = z.object({
  companySummary: z.string(),
  segment: z.string(),
  targetAudience: z.string(),
  toneKeywords: z.array(z.string()),
  competitorInsights: z.string(),
  differentiators: z.string(),
});

export type ResearchOutput = z.infer<typeof ResearchOutputSchema>;

/* ------------------------------------------------------------------ */
/*  Style Output                                                       */
/* ------------------------------------------------------------------ */

export const PaletteSchema = z.object({
  primary: z.string(),
  secondary: z.string(),
  accent: z.string(),
  neutral: z.string(),
  primaryLight: z.string(),
  primaryDark: z.string(),
});

export const PaletteModesSchema = z.object({
  single: PaletteSchema,
  dual: PaletteSchema,
  monochromatic: PaletteSchema,
});
export type PaletteModes = z.infer<typeof PaletteModesSchema>;

export const TypographySchema = z.object({
  heading: z.string(),
  body: z.string(),
});

export const StyleOutputSchema = z.object({
  palette: PaletteSchema,
  paletteMode: z.enum(["single", "dual", "monochromatic"]),
  paletteModes: PaletteModesSchema,
  typography: TypographySchema,
  mood: z.array(
    z.enum([
      "professional",
      "elegant",
      "fun",
      "serious",
      "friendly",
      "energetic",
      "calm",
      "trustworthy",
    ]),
  ),
  style: z.array(
    z.enum([
      "modern",
      "classic",
      "editorial",
      "luxury",
      "playful",
      "minimal",
      "bold",
      "corporate",
    ]),
  ),
  density: z.enum(["low", "medium", "high"]),
  paletteSource: z.enum(["graph", "fallback"]).optional(),
  paletteSuggestions: z.array(PaletteSchema).optional(),
});

export type StyleOutput = z.infer<typeof StyleOutputSchema>;
export type Palette = z.infer<typeof PaletteSchema>;
export type Typography = z.infer<typeof TypographySchema>;

/* ------------------------------------------------------------------ */
/*  Composer Output                                                    */
/* ------------------------------------------------------------------ */

export const ComposerLayoutSchema = z.object({
  components: z.array(z.string()),
  score: z.number(),
  rationale: z.string(),
  variantSelections: z.record(z.string(), z.string()).optional(),
});

export const ComposerOutputSchema = z.object({
  layouts: z.array(ComposerLayoutSchema),
  selectedLayout: z.number().int(),
  source: z.enum(["graph", "fallback"]),
  candidateCount: z.number().int().optional(),
  avgScore: z.number().nullable().optional(),
});

export type ComposerLayout = z.infer<typeof ComposerLayoutSchema>;
export type ComposerOutput = z.infer<typeof ComposerOutputSchema>;

/* ------------------------------------------------------------------ */
/*  Working Draft (Phase 5 Visual Editor)                              */
/* ------------------------------------------------------------------ */

export const WorkingDraftSchema = z.object({
  blueprint: ComposerLayoutSchema,
  contentSlots: HumanizerOutputSchema,
  palette: PaletteSchema,
  typography: TypographySchema,
  density: z.enum(["low", "medium", "high"]),
  updatedAt: z.string(),
});

export type WorkingDraft = z.infer<typeof WorkingDraftSchema>;

/* ------------------------------------------------------------------ */
/*  Project Version (Phase 5 Version History)                          */
/* ------------------------------------------------------------------ */

export const ProjectVersionSchema = z.object({
  pk: z.string(),
  sk: z.string(),
  versionNumber: z.number().int(),
  createdAt: z.string(),
  deployedAt: z.string(),
  blueprint: ComposerOutputSchema,
  contentSlots: HumanizerOutputSchema,
  palette: PaletteSchema,
  typography: TypographySchema,
  density: z.string(),
  assembledTarGzKey: z.string(),
  vercelDeploymentId: z.string().optional(),
  note: z.string().optional(),
});

export type ProjectVersion = z.infer<typeof ProjectVersionSchema>;

/* ------------------------------------------------------------------ */
/*  Share Token (Phase 5 Client Preview)                               */
/* ------------------------------------------------------------------ */

// expiresAt is an epoch integer (seconds) — required for DDB TTL attribute
export const ShareTokenSchema = z.object({
  pk: z.string(),
  sk: z.string(),
  token: z.string(),
  projectId: z.string(),
  sellerId: z.string(),
  createdAt: z.string(),
  expiresAt: z.number().int(),
  revoked: z.boolean(),
});

export type ShareToken = z.infer<typeof ShareTokenSchema>;

/* ------------------------------------------------------------------ */
/*  Feedback Item (Phase 5 Client Preview)                             */
/* ------------------------------------------------------------------ */

export const FeedbackItemSchema = z.object({
  pk: z.string(),
  sk: z.string(),
  message: z.string(),
  clientName: z.string().optional(),
  clientEmail: z.string().optional(),
  submittedAt: z.string(),
  shareTokenId: z.string(),
});

export type FeedbackItem = z.infer<typeof FeedbackItemSchema>;

/* ------------------------------------------------------------------ */
/*  Pipeline State                                                     */
/* ------------------------------------------------------------------ */

export const PipelineStateSchema = z.object({
  projectId: z.string(),
  status: z.enum([
    "queued",
    "researching",
    "styling",
    "awaiting_style_approval",
    "composing",
    "awaiting_layout_approval",
    "content",
    "humanizing",
    "assembling",
    "qa",
    "ready_for_review",
    "deploying",
    "deployed",
    "failed",
    "qa_failed",
    "deploy_failed",
  ]),
  companyName: z.string(),
  segment: z.string(),
  description: z.string(),
  brandColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .optional(),
  researchOutput: ResearchOutputSchema.optional(),
  styleOutput: StyleOutputSchema.optional(),
  styleApprovalTaskToken: z.string().optional(),
  layoutApprovalTaskToken: z.string().optional(),
  desiredSections: z.array(z.string()).optional(),
  // brandToneKeywords (NOT toneKeywords) — avoids collision with ResearchOutputSchema.toneKeywords
  brandToneKeywords: z.array(z.string()).optional(),
  objectives: z.array(z.string()).optional(),
  businessHours: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  socialLinks: z
    .array(z.object({ platform: z.string(), url: z.string() }))
    .optional(),
  composerOutput: ComposerOutputSchema.optional(),
  contentOutput: ContentOutputSchema.optional(),
  humanizerOutput: HumanizerOutputSchema.optional(),
  assemblerOutput: AssemblerOutputSchema.optional(),
  qaOutput: QAOutputSchema.optional(),
  previewUrl: z.string().optional(),
  sellerId: z.string(),
  failureReason: z.string().optional(),
});

export type PipelineState = z.infer<typeof PipelineStateSchema>;

export type ProjectStatus = PipelineState["status"];

/* ------------------------------------------------------------------ */
/*  Project Item (DynamoDB document)                                   */
/* ------------------------------------------------------------------ */

export const ProjectItemSchema = PipelineStateSchema.extend({
  pk: z.string(),
  sk: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  qaIssues: QAOutputSchema.shape.issues.optional(),
  workingDraft: WorkingDraftSchema.optional().nullable(),
  currentVersionNumber: z.number().int().optional(),
  vercelDeploymentId: z.string().optional(),
  vercelPreviewUrl: z.string().optional(),
  deployError: z.string().optional(),
});

export type ProjectItem = z.infer<typeof ProjectItemSchema>;

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
