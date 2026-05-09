// Segment values must match agents/shared/constants.ts SUPPORTED_SEGMENTS
export const SUPPORTED_SEGMENTS = [
  "pet-shop",
  "law-firm",
  "restaurant",
  "saas",
  "ecommerce",
  "bakery",
  "dental-clinic",
  "gym",
  "beauty-salon",
  "real-estate",
  "accounting",
  "auto-repair",
  "construction",
  "photography",
  "consulting",
  "education",
  "clothing-store",
  "health-clinic",
] as const;

export const SEGMENT_LABELS: Record<string, string> = {
  "pet-shop": "Pet Shop",
  "law-firm": "Law Firm",
  restaurant: "Restaurant",
  saas: "SaaS",
  ecommerce: "E-commerce",
  bakery: "Bakery",
  "dental-clinic": "Dental Clinic",
  gym: "Gym",
  "beauty-salon": "Beauty Salon",
  "real-estate": "Real Estate",
  accounting: "Accounting",
  "auto-repair": "Auto Repair",
  construction: "Construction",
  photography: "Photography",
  consulting: "Consulting",
  education: "Education",
  "clothing-store": "Clothing Store",
  "health-clinic": "Health Clinic",
};

export type ProjectStatus =
  | "queued"
  | "researching"
  | "styling"
  | "awaiting_style_approval"
  | "composing"
  | "awaiting_layout_approval"
  | "content"
  | "humanizing"
  | "assembling"
  | "qa"
  | "ready_for_review"
  | "deploying"
  | "deployed"
  | "failed"
  | "qa_failed"
  | "deploy_failed";

export interface ProjectSummary {
  projectId: string;
  companyName: string;
  segment: string;
  status: ProjectStatus;
  createdAt: string;
  sellerId: string;
}

/* ------------------------------------------------------------------ */
/*  Step Output Types (mirrors agents/shared/types.ts — keep in sync) */
/* ------------------------------------------------------------------ */

export interface ContentOutput {
  components: Array<{ componentId: string; slots: Record<string, unknown> }>;
}

export interface HumanizerOutput {
  components: Array<{ componentId: string; slots: Record<string, unknown> }>;
}

export interface AssemblerOutput {
  s3Key: string;
  s3Bucket: string;
}

export interface QAIssue {
  componentId: string;
  slot: string;
  message: string;
}

export interface QAOutput {
  passed: boolean;
  issues: QAIssue[];
  warnings?: QAIssue[];
}

/* ------------------------------------------------------------------ */
/*  Research & Style Output (mirrors agents/shared/types.ts)           */
/* ------------------------------------------------------------------ */

export interface ResearchOutput {
  companySummary: string;
  segment: string;
  targetAudience: string;
  toneKeywords: string[];
  competitorInsights: string;
  differentiators: string;
}

export interface Palette {
  primary: string;
  secondary: string;
  accent: string;
  neutral: string;
  primaryLight: string;
  primaryDark: string;
}

export interface PaletteModes {
  single: Palette;
  dual: Palette;
  monochromatic: Palette;
}

export interface Typography {
  heading: string;
  body: string;
}

export interface StyleOutput {
  palette: Palette;
  paletteMode: "single" | "dual" | "monochromatic";
  paletteModes: PaletteModes;
  typography: Typography;
  mood: Array<
    | "professional"
    | "elegant"
    | "fun"
    | "serious"
    | "friendly"
    | "energetic"
    | "calm"
    | "trustworthy"
  >;
  style: Array<
    | "modern"
    | "classic"
    | "editorial"
    | "luxury"
    | "playful"
    | "minimal"
    | "bold"
    | "corporate"
  >;
  density: "low" | "medium" | "high";
  paletteSource?: "graph" | "llm" | "fallback-default";
  paletteSuggestions?: Palette[];
  styleKit?: {
    card?: string;
    ctaVariant?: string;
    ctaColorScheme?: string;
    background?: string;
    textDecoration?: string;
  };
  imageryDensity?: "low" | "medium" | "high";
}

/* ------------------------------------------------------------------ */
/*  Composer Output (mirrors agents/shared/types.ts — keep in sync)    */
/* ------------------------------------------------------------------ */

export interface ComposerLayout {
  components: string[];
  score: number;
  rationale: string;
  variantSelections?: Record<string, string>;
}

export interface ComposerOutput {
  layouts: ComposerLayout[];
  selectedLayout: number;
  source: "vector" | "fallback" | "graph" | "hybrid"; // "graph" and "hybrid" are legacy Stage 2 values
  candidateCount?: number;
  avgScore?: number | null;
  warnings?: string[];
}

/* ------------------------------------------------------------------ */
/*  Working Draft / Version / Share / Feedback                         */
/*  (mirrors agents/shared/types.ts — keep in sync)                    */
/* ------------------------------------------------------------------ */

export interface WorkingDraft {
  blueprint: ComposerLayout;
  contentSlots: HumanizerOutput;
  palette: Palette;
  typography: Typography;
  density: "low" | "medium" | "high";
  updatedAt: string;
}

export interface ProjectVersion {
  pk: string;
  sk: string;
  versionNumber: number;
  createdAt: string;
  deployedAt: string;
  blueprint: ComposerOutput;
  contentSlots: HumanizerOutput;
  palette: Palette;
  typography: Typography;
  density: string;
  assembledTarGzKey: string;
  vercelDeploymentId?: string;
  note?: string;
}

export interface ShareToken {
  pk: string;
  sk: string;
  token: string;
  projectId: string;
  sellerId: string;
  createdAt: string;
  expiresAt: number;
  revoked: boolean;
}

export interface FeedbackItem {
  pk: string;
  sk: string;
  message: string;
  clientName?: string;
  clientEmail?: string;
  submittedAt: string;
  shareTokenId: string;
}

/* ------------------------------------------------------------------ */
/*  Project Detail                                                     */
/* ------------------------------------------------------------------ */

export interface ProjectDetail {
  projectId: string;
  companyName: string;
  description: string;
  status: ProjectStatus;
  previewUrl: string | null;
  createdAt: string;
  updatedAt: string;
  failureReason: string | null;
  sellerId: string;
  researchOutput: ResearchOutput | null;
  styleOutput: StyleOutput | null;
  composerOutput: ComposerOutput | null;
  contentOutput: ContentOutput | null;
  humanizerOutput: HumanizerOutput | null;
  assemblerOutput: AssemblerOutput | null;
  qaOutput: QAOutput | null;
  qaIssues: QAIssue[] | null;
  workingDraft: WorkingDraft | null;
  currentVersionNumber: number | null;
  layoutApprovalTaskToken?: string;
  desiredSections?: string[];
  brandToneKeywords?: string[];
  objectives?: string[];
  businessHours?: string;
  address?: string;
  phone?: string;
  email?: string;
  socialLinks?: { platform: string; url: string }[];
  // Richer intake fields. Nullable to match PipelineStateSchema's
  // `.nullable().default(null)` shape after parsing.
  niche?: string | null;
  region?: string | null;
  companySize?: "solo" | "2-10" | "11-50" | "51-200" | "200+" | null;
  primaryCta?: "book" | "buy" | "contact" | "subscribe" | "learn-more" | null;
  mainService?: string | null;
  whatMakesSpecial?: string[] | null;
  keyResults?: string | null;
  idealPublic?: string | null;
  moodTags?: string[] | null;
  styleTags?: string[] | null;
  voiceTone?: string[] | null;
  slogan?: string | null;
  brandColors?: string[] | null;
  colorsToAvoid?: string[] | null;
  inspirationSites?: string[] | null;
  doNots?: string | null;
  rankedObjectives?: string[] | Array<{ id: string; rank: number }> | null;
  vercelDeploymentId?: string;
  vercelPreviewUrl?: string;
  deployError?: string;
}

export interface CreateProjectInput {
  companyName: string;
  segment: string;
  description: string;
  brandColor?: string;
  desiredSections?: string[];
  brandToneKeywords?: string[];
  objectives?: string[];
  businessHours?: string;
  address?: string;
  phone?: string;
  email?: string;
  socialLinks?: { platform: string; url: string }[];
  pageType?: "landing" | "store" | "portfolio" | "services" | "about";
  // Richer intake fields. No nulls — outbound form payload only sends keys
  // the seller actually filled in.
  niche?: string;
  region?: string;
  companySize?: "solo" | "2-10" | "11-50" | "51-200" | "200+";
  primaryCta?: "book" | "buy" | "contact" | "subscribe" | "learn-more";
  mainService?: string;
  whatMakesSpecial?: string[];
  keyResults?: string;
  idealPublic?: string;
  moodTags?: string[];
  styleTags?: string[];
  voiceTone?: string[];
  slogan?: string;
  brandColors?: string[];
  colorsToAvoid?: string[];
  inspirationSites?: string[];
  doNots?: string;
  rankedObjectives?: Array<{ id: string; rank: number }>;
}
