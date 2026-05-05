import { z } from "zod";

export const SkeletonSlotSchema = z.object({
  category: z.enum([
    "navigation",
    "hero",
    "testimonial",
    "footer",
    "cta",
    "faq",
    "contact",
    "stats",
    "motion",
    "carousel",
    "layout/grid",
    "layout/split",
  ]),
  purpose: z.string(),
  notes: z.string().optional(),
});

export type SkeletonSlot = z.infer<typeof SkeletonSlotSchema>;
export type Skeleton = SkeletonSlot[];

/**
 * DEFAULT_SKELETON — Phase A hard-coded page skeleton.
 *
 * Used as input to the per-slot category-filtered Qdrant search.
 * Each slot drives one vector query:
 *   "<category> for <brief>; mood: <style mood>; needs: <purpose>"
 *
 * Phase B replaces this constant with an LLM planner call.
 * This constant becomes the fallback when the planner errors.
 *
 * Boost values for PAIRS_WITH re-ranking (Phase A):
 *   +0.3 if candidate ID appears in prior pick's pairsWell
 *   -0.3 if candidate ID appears in prior pick's pairsPoorly
 * Applied to the normalized cosine similarity base score (0–1).
 */
export const DEFAULT_SKELETON: Skeleton = [
  { category: "navigation", purpose: "brand navigation" },
  { category: "hero", purpose: "brand statement" },
  { category: "layout/grid", purpose: "showcase services or features" },
  { category: "testimonial", purpose: "social proof" },
  { category: "cta", purpose: "lead capture" },
  { category: "footer", purpose: "site navigation footer" },
];
