// Source of truth: agents/shared/segment-presets.ts — keep in sync
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
  | "content"
  | "humanizing"
  | "assembling"
  | "qa"
  | "deploying"
  | "deployed"
  | "failed"
  | "qa_failed";

export interface ProjectSummary {
  projectId: string;
  companyName: string;
  segment: string;
  status: ProjectStatus;
  createdAt: string;
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

export interface Typography {
  heading: string;
  body: string;
}

export interface StyleOutput {
  palette: Palette;
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
}

/* ------------------------------------------------------------------ */
/*  Composer Output (mirrors agents/shared/types.ts — keep in sync)    */
/* ------------------------------------------------------------------ */

export interface ComposerLayout {
  components: string[];
  score: number;
  rationale: string;
}

export interface ComposerOutput {
  layouts: ComposerLayout[];
  selectedLayout: number;
  source: "graph" | "fallback";
}

/* ------------------------------------------------------------------ */
/*  Project Detail                                                     */
/* ------------------------------------------------------------------ */

export interface ProjectDetail {
  projectId: string;
  status: ProjectStatus;
  previewUrl: string | null;
  createdAt: string;
  updatedAt: string;
  researchOutput: ResearchOutput | null;
  styleOutput: StyleOutput | null;
  composerOutput: ComposerOutput | null;
  contentOutput: ContentOutput | null;
  humanizerOutput: HumanizerOutput | null;
  assemblerOutput: AssemblerOutput | null;
  qaOutput: QAOutput | null;
  qaIssues: QAIssue[] | null;
}

export interface CreateProjectInput {
  companyName: string;
  segment: string;
  description: string;
}
