// Source of truth: agents/shared/segment-presets.ts — keep in sync
export const SUPPORTED_SEGMENTS = [
  "pet-shop",
  "law-firm",
  "restaurant",
  "saas",
  "ecommerce",
] as const;

export const SEGMENT_LABELS: Record<string, string> = {
  "pet-shop": "Pet Shop",
  "law-firm": "Law Firm",
  restaurant: "Restaurant",
  saas: "SaaS",
  ecommerce: "E-commerce",
};

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
/*  Project Detail                                                     */
/* ------------------------------------------------------------------ */

export interface ProjectDetail {
  projectId: string;
  status: ProjectStatus;
  previewUrl: string | null;
  createdAt: string;
  updatedAt: string;
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
