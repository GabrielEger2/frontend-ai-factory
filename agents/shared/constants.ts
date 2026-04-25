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
