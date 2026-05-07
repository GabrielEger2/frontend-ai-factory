/**
 * Controlled vocabularies shared across agents and the dashboard.
 *
 * These arrays are the single source of truth for tone, objectives, style,
 * and mood tags. Mirror them in `dashboard/src/lib/constants.ts` if changed.
 */

export const TONE_KEYWORDS = [
  "confident",
  "reserved",
  "formal",
  "friendly",
  "playful",
  "serious",
  "energetic",
  "calm",
  "bold",
  "trustworthy",
] as const;

export const OBJECTIVES = [
  "more_leads",
  "drive_whatsapp",
  "showcase_portfolio",
  "increase_signups",
  "brand_awareness",
  "drive_purchases",
  "support_inquiries",
] as const;

export const STYLE_TAGS = [
  "modern",
  "classic",
  "editorial",
  "luxury",
  "playful",
  "minimal",
  "bold",
  "corporate",
] as const;

export const MOOD_TAGS = [
  "professional",
  "elegant",
  "fun",
  "serious",
  "friendly",
  "energetic",
  "calm",
  "trustworthy",
] as const;

export type ToneKeyword = (typeof TONE_KEYWORDS)[number];
export type Objective = (typeof OBJECTIVES)[number];
export type StyleTag = (typeof STYLE_TAGS)[number];
export type MoodTag = (typeof MOOD_TAGS)[number];

export const RANKED_OBJECTIVE_IDS = [
  "sell-products",
  "generate-leads",
  "tell-our-story",
  "showcase-portfolio",
  "build-trust",
  "drive-foot-traffic",
  "grow-community",
] as const;
export type RankedObjectiveId = (typeof RANKED_OBJECTIVE_IDS)[number];

export const RANKED_OBJECTIVE_LABELS: Record<RankedObjectiveId, string> = {
  "sell-products": "Sell products",
  "generate-leads": "Generate leads",
  "tell-our-story": "Tell our story",
  "showcase-portfolio": "Showcase portfolio",
  "build-trust": "Build trust",
  "drive-foot-traffic": "Drive foot traffic",
  "grow-community": "Grow community",
};

export const VOICE_TONE_OPTIONS = [
  "formal",
  "casual",
  "witty",
  "warm",
  "technical",
  "authoritative",
  "playful",
  "inspirational",
] as const;
export type VoiceTone = (typeof VOICE_TONE_OPTIONS)[number];

export const COMPANY_SIZES = [
  "solo",
  "2-10",
  "11-50",
  "51-200",
  "200+",
] as const;
export type CompanySize = (typeof COMPANY_SIZES)[number];

export const PRIMARY_CTA_OPTIONS = [
  "book",
  "buy",
  "contact",
  "subscribe",
  "learn-more",
] as const;
export type PrimaryCta = (typeof PRIMARY_CTA_OPTIONS)[number];

export const PRIMARY_CTA_LABELS: Record<PrimaryCta, string> = {
  book: "Book / Schedule",
  buy: "Buy / Shop",
  contact: "Contact us",
  subscribe: "Subscribe",
  "learn-more": "Learn more",
};

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
];
