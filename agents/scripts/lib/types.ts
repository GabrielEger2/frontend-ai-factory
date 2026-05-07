import { z } from "zod";

/* ------------------------------------------------------------------ */
/*  Slot Schema                                                        */
/* ------------------------------------------------------------------ */

export const SlotSchema = z.object({
  name: z.string(),
  type: z.enum(["text", "image", "url", "list", "number", "boolean", "object"]),
  optional: z.boolean().optional(),
  maxLength: z.number().optional(),
  aspectRatio: z.string().optional(),
  maxItems: z.number().optional(),
  enum: z.array(z.union([z.string(), z.number()])).optional(),
  itemSchema: z.unknown().optional(),
  fields: z.array(z.unknown()).optional(),
});

export type Slot = z.infer<typeof SlotSchema>;

/* ------------------------------------------------------------------ */
/*  Metadata Schema                                                    */
/* ------------------------------------------------------------------ */
//
// Mirrors the canonical metadata.json shape used by real components in
// `components/library/**` (see HeroGeometric for the gold-standard example).
// Style and mood enums include "classic" and "serious" which appear in
// `.claude/rules/domains/components.md` but are not yet used in real
// components — kept here to match `agents/shared/types.ts` StyleOutputSchema.
//

export const MetadataSchema = z.object({
  id: z.string().regex(/^[a-z][a-z0-9-]*-\d{2}$/),
  name: z.string().min(1),
  category: z.enum([
    "hero",
    "contact",
    "cta",
    "faq",
    "footers",
    "navigation",
    "stats",
    "testimonial",
    "content",
    "pricing",
    "team",
    "gallery",
  ]),
  purpose: z.array(z.string()).min(1),
  acceptsStyleKit: z.object({
    card: z.boolean(),
    background: z.boolean(),
    textDecoration: z.boolean(),
    button: z.boolean(),
  }),
  style: z
    .array(
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
    )
    .min(1),
  mood: z
    .array(
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
    )
    .min(1),
  layout: z.enum([
    "split",
    "centered",
    "grid",
    "stacked",
    "asymmetric",
    "multi-column",
    "horizontal",
    "floating",
  ]),
  density: z.enum(["low", "medium", "high"]),
  imageWeight: z.number().min(0).max(1).optional(),
  slots: z.array(SlotSchema).min(1),
  mobileBehavior: z.enum(["stack", "scroll", "collapse", "preserve"]),
  pairsWell: z.array(z.string()),
  pairsPoorly: z.array(z.string()),
  nativeMotif: z.string().optional(),
  variants: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        density: z.string(),
        colorMode: z.enum(["dark", "light"]),
        styleOverrides: z.array(z.string()),
      }),
    )
    .optional(),
});

export type Metadata = z.infer<typeof MetadataSchema>;
export type Category = Metadata["category"];

/* ------------------------------------------------------------------ */
/*  Claude Response Schema                                             */
/* ------------------------------------------------------------------ */
//
// Claude does NOT produce `id` — the importer script computes it after
// the response is validated, by combining CATEGORY_TO_PREFIX, the kebab
// form of `componentName`, and a 2-digit sequence. Therefore `id` is
// omitted from MetadataSchema before extending with the source-code
// fields Claude must produce.
//

export const ClaudeResponseSchema = MetadataSchema.omit({ id: true }).extend({
  componentName: z.string().regex(/^[A-Z][A-Za-z0-9]+$/),
  indexTsx: z.string().min(100),
  storiesTsx: z.string().min(100),
});

export type ClaudeResponse = z.infer<typeof ClaudeResponseSchema>;

/* ------------------------------------------------------------------ */
/*  Category → Directory Mapping                                       */
/* ------------------------------------------------------------------ */
//
// The `category` value strings do NOT all match their on-disk directory
// names — e.g. `category: "hero"` lives at `components/library/heroes/`,
// `category: "testimonial"` at `components/library/testimonials/`. This
// single source of truth resolves every category to its directory
// segment relative to `components/library/`.
//

export const CATEGORY_TO_DIR: Record<Category, string> = {
  hero: "heroes",
  contact: "contact",
  cta: "cta",
  faq: "faq",
  footers: "footers",
  navigation: "navigation",
  stats: "stats",
  testimonial: "testimonials",
  content: "content",
  pricing: "pricing",
  team: "team",
  gallery: "gallery",
};

/* ------------------------------------------------------------------ */
/*  Category → ID Prefix Mapping                                       */
/* ------------------------------------------------------------------ */
//
// The `id` field on every metadata.json follows the pattern:
//   `<prefix>-<componentName-kebab>-<2-digit-seq>`
// e.g. `hero-geometric-01`, `contact-map-info-01`, `layout-simplegrid-01`,
// `footer-reveal-01`.
//
// Note the plural-vs-singular asymmetry on `footers`: the category
// VALUE is plural (`"footers"`) and the directory is plural
// (`footers/`), but the id PREFIX is singular (`"footer"`). This is the
// only category where this matters; do not normalize it.
//

export const CATEGORY_TO_PREFIX: Record<Category, string> = {
  hero: "hero",
  contact: "contact",
  cta: "cta",
  faq: "faq",
  footers: "footer", // plural-asymmetry: category "footers" → id prefix "footer"
  navigation: "navigation",
  stats: "stats",
  testimonial: "layout", // frozen IDs — prefix mismatch acceptable
  content: "content",
  pricing: "pricing",
  team: "team",
  gallery: "gallery",
};
