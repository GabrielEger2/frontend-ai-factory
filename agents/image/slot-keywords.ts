/**
 * Lookup tables for the deterministic Image Resolver.
 *
 * Pure data — no runtime logic. Imported by `agents/image/resolver.ts`.
 *
 * - SKIP_PATTERN          slot names that must never call Pexels
 *                         (logos/avatars; stock photography is a bad fit)
 * - SLOT_KEYWORD_MAP      slot name -> English search keyword (Pexels skews
 *                         English so all values are translated upstream)
 * - VERTICAL_KEYWORD_MAP  vertical token -> English search term
 * - ASPECT_TO_ORIENTATION metadata aspectRatio -> Pexels orientation param
 */

/**
 * SKIP_PATTERN — slots matching this regex are skipped (never call Pexels).
 *
 * Brand logos (companyLogo, partnerLogo, etc.) and explicit `avatar` slots
 * are uniformly poorly served by stock photography. Author/team portraits
 * (authorImage, memberPhoto) DO resolve — generic professional portraits
 * are acceptable showcase content; the seller swaps them at review time.
 */
export const SKIP_PATTERN = /logo|avatar/i;

/**
 * SLOT_KEYWORD_MAP — maps slot name patterns to English search keywords.
 *
 * Used as the `<slotKeyword>` token in the Pexels query template:
 *   `${verticalKeyword} ${slotKeyword} ${mood}`
 *
 * Unmatched slot names fall through to the resolver's default ("business").
 */
export const SLOT_KEYWORD_MAP: Record<string, string> = {
  heroImage: "storefront exterior",
  backgroundImage: "interior atmosphere",
  image: "business", // generic fallback; vertical token adds specificity
  posterImage: "interior",
  beforeImage: "before transformation",
  afterImage: "after transformation",
  featuredImage: "showcase product",
  cardImage: "detail product",
  galleryImage: "lifestyle",
  caseStudyImage: "professional workspace",
  teamImage: "professional team",
  founderImage: "professional portrait",
  clientImage: "satisfied client",
  bestsellerThumb: "product close-up",
  // Video slots
  videoSrc: "business atmosphere",
  videoUrl: "business atmosphere",
  // Author / team portraits — generic stock professional portraits are
  // acceptable showcase content; seller swaps them at review time.
  authorImage: "professional portrait headshot",
  memberPhoto: "professional portrait headshot",
};

/**
 * VERTICAL_KEYWORD_MAP — maps vertical[] tokens to English search terms.
 *
 * Pexels content skews English/Western, so pt-BR vertical tokens (e.g.
 * `confeitaria`, `padaria`) are translated to their closest English
 * equivalents at query time. Verticals omitted from this map degrade
 * gracefully — the resolver substitutes an empty string and the query
 * falls back to slotKeyword + mood only.
 */
export const VERTICAL_KEYWORD_MAP: Record<string, string> = {
  bakery: "bakery cafe",
  "bakery-luxe": "luxury patisserie",
  restaurant: "restaurant dining",
  "restaurant-luxe": "fine dining gourmet",
  fitness: "gym fitness",
  "auto-services": "auto repair workshop",
  "legal-consulting": "law office professional",
  "legal-luxe": "boutique law firm elegant",
  healthcare: "clinic medical",
  "healthcare-luxe": "luxury wellness spa",
  "beauty-salon": "hair salon beauty",
  education: "classroom learning",
  "real-estate": "modern apartment",
  "real-estate-luxe": "luxury penthouse",
  hospitality: "hotel lobby",
  "hospitality-luxe": "boutique hotel luxury",
  "pet-services": "pet veterinary",
  ecommerce: "online retail store",
  construction: "construction architecture",
  saas: "software technology office",
  agency: "creative studio agency",
  "atelier-luxe": "fashion atelier luxury",
  "gourmet-retail": "gourmet food shop",
};

/**
 * ASPECT_TO_ORIENTATION — maps metadata aspectRatio values to Pexels
 * orientation params.
 *
 * Pexels supports only three orientation buckets: landscape | portrait
 * | square. The `auto` ratio maps to `undefined`, which the resolver
 * passes through as "no orientation filter".
 */
export const ASPECT_TO_ORIENTATION: Record<
  string,
  "landscape" | "portrait" | "square" | undefined
> = {
  "16:9": "landscape",
  "16:10": "landscape",
  "3:2": "landscape",
  "4:3": "landscape",
  "4:5": "portrait",
  "3:4": "portrait",
  "1:1": "square",
  auto: undefined, // no orientation filter
};
