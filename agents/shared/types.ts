import { z } from "zod";
import { MOOD_TAGS, STYLE_TAGS } from "./constants";

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
/*  Image Output                                                       */
/* ------------------------------------------------------------------ */

export const ImageSlotSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
  photographerCredit: z.string().optional(),
});

export const ImageOutputSchema = z.object({
  components: z.array(
    z.object({
      componentId: z.string(),
      imageSlots: z.record(z.string(), ImageSlotSchema),
    }),
  ),
});

export type ImageSlot = z.infer<typeof ImageSlotSchema>;
export type ImageOutput = z.infer<typeof ImageOutputSchema>;

/* ------------------------------------------------------------------ */
/*  QA Output                                                          */
/* ------------------------------------------------------------------ */

const QAFindingSchema = z.object({
  componentId: z.string(),
  slot: z.string(),
  message: z.string(),
});

export const QAOutputSchema = z.object({
  passed: z.boolean(),
  issues: z.array(QAFindingSchema),
  // Non-blocking advisories surfaced to the dashboard's gap-detection panel
  // (e.g. required slots filled with placeholders by the assembler safety-net).
  warnings: z.array(QAFindingSchema).optional(),
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

const HEX_COLOR_REGEX = /^#[0-9a-fA-F]{6}$/;
const HEX_COLOR_MESSAGE = {
  message: "must be a 6-digit hex color (e.g. #1A2B3C)",
};

export const PaletteSchema = z.object({
  primary: z.string().regex(HEX_COLOR_REGEX, HEX_COLOR_MESSAGE),
  secondary: z.string().regex(HEX_COLOR_REGEX, HEX_COLOR_MESSAGE),
  accent: z.string().regex(HEX_COLOR_REGEX, HEX_COLOR_MESSAGE),
  neutral: z.string().regex(HEX_COLOR_REGEX, HEX_COLOR_MESSAGE),
  primaryLight: z.string().regex(HEX_COLOR_REGEX, HEX_COLOR_MESSAGE),
  primaryDark: z.string().regex(HEX_COLOR_REGEX, HEX_COLOR_MESSAGE),
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

export const StyleKitSchema = z.object({
  card: z.string().optional(),
  ctaVariant: z.string().optional(),
  ctaColorScheme: z.string().optional(),
  background: z.string().optional(),
  textDecoration: z
    .enum(["none", "highlighter", "reveal"])
    .catch("none")
    .optional(),
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
  paletteSource: z
    .enum(["graph", "llm", "fallback-default"])
    .catch("llm")
    .optional(),
  paletteSuggestions: z.array(PaletteSchema).optional(),
  styleKit: StyleKitSchema.optional(),
  imageryDensity: z.enum(["low", "medium", "high"]).optional(),
  vertical: z.array(z.string()).optional(),
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
  source: z.enum(["vector", "fallback"]).catch("vector"),
  candidateCount: z.number().int().optional(),
  avgScore: z.number().nullable().optional(),
  warnings: z.array(z.string()).optional(),
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
  // Null-seeded fields below: pipeline-starter writes `null` for any optional
  // intake field the seller leaves blank, so SFN JsonPath blocks (StyleStep,
  // ComposerStep) don't throw on missing keys. `.nullable().default(null)`
  // unifies both ingress paths: DDB reads (attribute absent → undefined) get
  // defaulted to `null`, and SFN payloads (already `null`) pass through. This
  // is critical for SFN-resume handlers (approve-style, approve-layout) which
  // rebuild state via PipelineStateSchema.parse(item) and then SendTaskSuccess
  // — JSON.stringify drops `undefined` keys, which would break the JsonPath
  // contract on the next step. See agents/pipeline-starter/handler.ts.
  brandColor: z
    .string()
    .regex(/^#[0-9a-fA-F]{6}$/)
    .nullable()
    .default(null),
  researchOutput: ResearchOutputSchema.optional(),
  styleOutput: StyleOutputSchema.optional(),
  styleApprovalTaskToken: z.string().optional(),
  layoutApprovalTaskToken: z.string().optional(),
  desiredSections: z.array(z.string()).nullable().default(null),
  // brandToneKeywords (NOT toneKeywords) — avoids collision with ResearchOutputSchema.toneKeywords
  brandToneKeywords: z.array(z.string()).nullable().default(null),
  objectives: z.array(z.string()).nullable().default(null),
  businessHours: z.string().nullable().default(null),
  address: z.string().nullable().default(null),
  phone: z.string().nullable().default(null),
  email: z.string().nullable().default(null),
  socialLinks: z
    .array(z.object({ platform: z.string(), url: z.string() }))
    .nullable()
    .default(null),
  pageType: z.string().nullable().default(null),
  // Richer intake fields (mirror ProjectBriefSchema). All `.nullable().default(null)`
  // so SFN JsonPath blocks can reference them without runtime errors when unset.
  niche: z.string().nullable().default(null),
  region: z.string().nullable().default(null),
  companySize: z
    .enum(["solo", "2-10", "11-50", "51-200", "200+"])
    .nullable()
    .default(null),
  primaryCta: z
    .enum(["book", "buy", "contact", "subscribe", "learn-more"])
    .nullable()
    .default(null),
  mainService: z.string().nullable().default(null),
  whatMakesSpecial: z
    .array(z.string().max(120))
    .max(5)
    .nullable()
    .default(null),
  keyResults: z.string().nullable().default(null),
  idealPublic: z.string().nullable().default(null),
  moodTags: z
    .array(z.enum(MOOD_TAGS as unknown as [string, ...string[]]))
    .nullable()
    .default(null),
  styleTags: z
    .array(z.enum(STYLE_TAGS as unknown as [string, ...string[]]))
    .nullable()
    .default(null),
  voiceTone: z.array(z.string()).nullable().default(null),
  slogan: z.string().nullable().default(null),
  brandColors: z
    .array(z.string().regex(/^#[0-9a-fA-F]{6}$/))
    .max(3)
    .nullable()
    .default(null),
  colorsToAvoid: z.array(z.string()).nullable().default(null),
  inspirationSites: z.array(z.string().url()).max(3).nullable().default(null),
  doNots: z.string().nullable().default(null),
  rankedObjectives: z
    .union([
      z.array(z.string()),
      z.array(z.object({ id: z.string(), rank: z.number().int().positive() })),
    ])
    .nullable()
    .default(null),
  composerOutput: ComposerOutputSchema.optional(),
  contentOutput: ContentOutputSchema.optional(),
  humanizerOutput: HumanizerOutputSchema.optional(),
  imageOutput: ImageOutputSchema.optional(),
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
  imageWeight?: number;
  vertical?: string[];
}
