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
  | "assembling"
  | "deploying"
  | "deployed"
  | "failed";

export interface ProjectSummary {
  projectId: string;
  companyName: string;
  segment: string;
  status: ProjectStatus;
  createdAt: string;
}

export interface ProjectDetail {
  projectId: string;
  status: ProjectStatus;
  previewUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectInput {
  companyName: string;
  segment: string;
  description: string;
}
